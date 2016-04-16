//////////////////////////////////
// UtilityBO.js module
//
//////////////////////////////////
var fs = require("fs");
var jade = require("jade");
var async = require("async");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var moment = require("moment-timezone");
var stripe = null;
var bLocalCredit = true;

module.exports = function UtilityBO(app, sql, logger) {

    var self = this;                // Über closure.

    // Private fields
    var m_resourceTypes = ['0-unused'];
    self.dbname = app.get("dbname");

    // Decide, based on app.get("development") whether we're using test credit or real.
    bLocalCredit = app.get("development");
    if (bLocalCredit) {

        console.log("Using local (test) credit.");
        stripe = require("stripe")("sk_test_ATd0E5b9XCV8G88pXqw3CcbM");

    } else {

        console.log("Using remote (real) credit.");
        stripe = require("stripe")("sk_live_FNvxhlz9j5L82jwlyA4vIMK1");
    }
    
    // Fill m_resourceTypes from database.
    try {

        var exceptionRet = sql.execute("select * from " + self.dbname + "resourceTypes;",
            function(rows) {

                if (rows.length === 0) {

                    throw new Error('Failed to read resource types from database. Cannot proceed.');

                } else {

                    // Make sure rows are sorted by id.
                    rows.sort(function(a,b){return a.id - b.id;})
                    for (var i = 0; i < rows.length; i++) {

                        m_resourceTypes.push(rows[i].description);
                    }
                }
            },
            function (strError) {

                throw new Error("Received error reading resource types from database. Cannot proceed. " + strError);

            });
        if (exceptionRet) {

            throw exceptionRet;
        }

    } catch (e) {

        throw e;
    }
    
    ////////////////////////////////////
    // Public methods
    
    // Router handler functions.
        // Simple handler returns public key to client.
    self.routeGetStripePK = function (req, res) {

        console.log("Request for " + (bLocalCredit ? "local" : "remote") + " public key: " + req.ip);

        // Send key back to caller.
        res.json({
            success: true,
            pk: (bLocalCredit ? "pk_test_eiDr85dbo39T4J1O8fzNi00a" : "pk_live_XfqMDtVuoHHxfWCJOh6Dlp89")
        });
    };
    
    self.routeProcessCharge = function (req, res) {

        try {

            console.log("Entered UtilityBO/routeProcessCharge with req.body = " + JSON.stringify(req.body));
            // req.user.userId*
            // req.user.userName*
            // req.body.token
            // req.body.dAmount
            // req.body.descriptionForReceipt
            // req.body.statementDescriptor

            var charge = stripe.charges.create(
                {
                    source: req.body.token,
                    currency: "usd",
                    amount: Math.round(parseFloat(req.body.dAmount) * 100),    // amount in cents!
                    description: req.body.descriptionForReceipt,
                    receipt_email: req.user.userName,
                    statement_descriptor: req.body.statementDescriptor
                },
                function(strError, charge) {
                    if (strError) {
                        res.json({
                            success: false,
                            message: strError
                        });
                    } else {

                        // Return success
                        res.json({
                            success: true
                        });
                    }
                }
            );
        } catch (e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

    self.routeSearchResources = function (req, res) {

        // This is a search for Images or Sounds (resourceTypeIds 1 and 2, respectively).

        try {

            console.log("Entered UtilityBO/routeSearchResources with req.body = " + JSON.stringify(req.body));
            // req.body.tags
            // req.user.userId
            // req.user.userName
            // req.body.resourceTypeId  1,2,
            // req.body.onlyOwnedByUser   '0' or '1'

            var iResourceTypeId = parseInt(req.body.resourceTypeId,10);
            var resourceTypeDescr = m_resourceTypes[iResourceTypeId];

            // Add resource type description to the tags the user (may have) entered.
            var tags = req.body.tags + " " + resourceTypeDescr;

            // If we're retrieving only items created by user, add userName to tags.
            if (req.body.onlyOwnedByUser === "1") {

                tags += " " + req.user.userName;
            }
            console.log("tags massaged='" + tags + "'");

            // Turn tags into string with commas between tags and tags surrounded by single quotes.
            var ccArray = tags.match(/([\w\-\_\@\.]+)/g);

            var ccString = '';
            for (var i = 0; i < ccArray.length; i++) {

                if (i > 0) {

                    ccString = ccString + ',';
                }

                ccString = ccString + "'" + ccArray[i] + "'";
            }

            var sqlString = "select id from " + self.dbname + "tags where description in (" + ccString + ");";

            console.log(' ');
            console.log('Query to get tag ids: ' + sqlString);
            console.log(' ');

            var exceptionRet = sql.execute(sqlString,
                function (arrayRows) {
                
                    // We have to get the same number of rows back from the query as ccArray.length.
                    if (arrayRows.length !== ccArray.length) {

                        // Success as far as the function is concerned but no result array
                        res.json({
                            success:true,
                            arrayRows: new Array()
                        });
                    } else {

                        // We can proceed since all tags exist and their id's are in arrayRows.
                        // Construct tagIds joined by ',' for use in main queries below. Hold in idString.
                        var idString = '';
                        for (var i = 0; i < arrayRows.length; i++) {

                            if (i > 0) {

                                idString = idString + ',';
                            }

                            idString = idString + arrayRows[i].id.toString();
                        }

                        // By including userName in tags if req.body.onlyOwnedByUser, we automatically make the "only mine" and "choose all matching" work.
                        // But to do so, we need something like: (createdByUserId=req.user.userId or public=1) along with the tag matching. Note: public=1 works all the time, because of the userName match requirement.

                        sqlString = "select r.* from " + self.dbname + "resources r where (r.createdByUserId=" + req.user.userId + " or r.public=1) and id in (select distinct resourceId from " + self.dbname + "resources_tags rt where " + arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "resources_tags rt2 where rt2.resourceId=rt.resourceId and tagId in (" + idString + ")));";

                        // console.log(' ');
                        // console.log('Query: ' + sqlString);
                        // console.log(' ');
                        exceptionRet = sql.execute(sqlString,
                            function(rows){

                                // Sort rows on name, since async retrieval doesn't let us sort in the query.
                                rows.sort(function(a,b){

                                    if (a.name > b.name)
                                        return 1;
                                    if (a.name < b.name)
                                        return -1;
                                    return 0;
                                });

                                res.json({
                                    success:true,
                                    arrayRows: rows
                                });
                            },
                            function(err){
                                res.json({
                                    success:false,
                                    message: err.message
                                });
                            }
                        );
                    }
                },
                function (strError) {
                
                    res.json({
                        success: false,
                        message: strError
                    });
            });
            if (exceptionRet !== null) {

                res.json({
                    success: false,
                    message: exceptionRet.message
                });
            }
        } catch (e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

    self.routeSearchProjects = function (req, res) {

        // This is a search for projects based on tags.

        try {

            console.log("Entered UtilityBO/routeSearchProjects with req.body = " + JSON.stringify(req.body));
            // req.body.tags
            // req.user.userId
            // req.user.userName
            // req.body.privilegedUser

            // Will return arrayRows: [][] where first dimension is 
            //  [0] core projects (empty if req.body.privilegedUser === "0")
            //  [1] user's own projects
            //  [2] other's projects (if req.body.privilegedUser, then ignore public/private; else just public)
            //  [3] products (if req.body.privilegedUser, then all, active or not; else just active)
            //  [4] classes (if req.body.privilegedUser, then all, active or not, no matter when or where; else just active, near user and soon)
            //  [5] online classes (if req.body.privilegedUser, then all, active or not, no matter when; else just active and soon)

            // Will use async.waterfall to build up passOn javascript object:
            // (1) if req.body.privilegedUser === "0", retrieve user's home zipcode.
            // (2) get string of tag id's; 
            // (3) perform many select statements to get projects that both match tags and contain correct items based on req.body.privilegedUser; 
            // (4) if req.body.privilegedUser === "0", then winnow classes down by date and distance and then onlineclasses by date.
            // (5) Finally, for all surviving classes determine current number of users who bought the class.

            async.waterfall(
                [
                    // (1)
                    function(cb) {

                        if (req.body.privilegedUser === "0") {

                            sql.execute("select zipcode from " + self.dbname + "user where id=" + req.user.userId + ";",
                                function(rows) {

                                    if (rows.length !== 1) {
                                        return cb(new Error("Unable to read user table to determine zip code."), null);
                                    }

                                    return cb(null, {zipcode:rows[0]["zipcode"]});
                                },
                                function(strError) {
                                    return cb(new Error(strError), null);
                                }
                            );
                        } else {
                            // priv user doesn't need zipcode
                            return cb(null, {zipcode: ''});
                        }
                    },
                    // (2)
                    function(passOn, cb) {

                        // Add resource type description to the tags the user (may have) entered.
                        var tags = req.body.tags + " project";

                        // Turn tags into string with commas between tags and tags surrounded by single quotes.
                        var ccArray = tags.match(/([\w\-\_\@\.]+)/g);

                        var ccString = '';
                        for (var i = 0; i < ccArray.length; i++) {

                            if (i > 0) { ccString = ccString + ','; }
                            ccString = ccString + "'" + ccArray[i] + "'";
                        }

                        var sqlString = "select id from " + self.dbname + "tags where description in (" + ccString + ");";
                        console.log(sqlString);
                        sql.execute(sqlString,
                            function (arrayRows) {
                            
                                // We have to get the same number of rows back from the query as ccArray.length.
                                // Otherwise we didn't have a complete match and nothing qualifies--except core projects for privileged users which don't user tags for retrieval.
                                if (arrayRows.length !== ccArray.length) {

                                    // Success as far as the POST is concerned but an empty array of projects will be returned.
                                    // So on to the next function in the waterfall.
                                    passOn.idString = '';
                                    passOn.idCount = '0';
                                    return cb(null, passOn);
                                }

                                // We can proceed since all tags exist and their id's are in arrayRows.
                                // Construct tagIds joined by ',' for use in main queries below. Hold in idString.
                                var idString = '';
                                for (var i = 0; i < arrayRows.length; i++) {

                                    if (i > 0) { idString = idString + ','; }
                                    idString = idString + arrayRows[i].id.toString();
                                }

                                passOn.idString = idString;
                                passOn.idCount = arrayRows.length.toString();

                                return cb(null, passOn);
                            },
                            function(strError) { return cb(new Error(strError), null); }
                        );
                    },
                    // (3)
                    function(passOn, cb) {

                        var strQuery = '';

                        // In the queries below, we're not retrieving the whole project rows (or the project joined with class or product).
                        // We're just selecting enough to create the image (with project.id) in the carousel and to decide (in the case of classes and products)
                        // if the project should be retrieved in the first place. 
                        
                        // Core projects for privileged users. Empty array for non.
                        if (req.body.privilegedUser === "1") {
                            strQuery = "select p.id, p.name, p.description, p.imageId from " + self.dbname + "projects p where p.isCoreProject=1;";
                        } else {
                            strQuery = "select p.id, p.name, p.description, p.imageId from " + self.dbname + "projects p where p.isCoreProject=-1;";   // we want this to return no rows but use [0].
                        }

                        if (passOn.idString.length) {
                            // Owned by user. Same for both priv and non-priv.
                            strQuery += "select distinct p.id, p.name, p.description, p.imageId from " + self.dbname + "projects p where p.ownedByUserId=" + req.user.userId + " and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.idCount + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";

                            // Others' accounts
                            if (req.body.privilegedUser === "1") {
                                // A privileged user doesn't care about public/private.
                                strQuery += "select distinct p.id, p.name, p.description, p.imageId from " + self.dbname + "projects p where p.ownedByUserId<>" + req.user.userId + " and p.isCoreProject=0 and p.isProduct=0 and p.isClass=0 and p.isOnlineClass=0 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.idCount + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            } else {
                                // A non-privileged user can retrieve only public projects and only "normal" projects.
                                strQuery += "select distinct p.id, p.name, p.description, p.imageId from " + self.dbname + "projects p where p.ownedByUserId<>" + req.user.userId + " and p.public=1 and p.isCoreProject=0 and p.isProduct=0 and p.isClass=0 and p.isOnlineClass=0 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.idCount + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            }

                            // Products
                            if (req.body.privilegedUser === "1") {
                                // A privileged user doesn't care about active.
                                strQuery += "select distinct p.id, p.name, p.description, p.imageId, pr.level, pr.difficulty, pr.productDescription, pr.imageId as prImageId, pr.price, pr.active, pr.videoURL from " + self.dbname + "projects p inner join " + self.dbname + "products pr on pr.baseProjectId=p.id where p.isProduct=1 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.idCount + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            } else {
                                // A non-privileged user just sees active projects.
                                strQuery += "select distinct p.id, p.name, p.description, p.imageId, pr.level, pr.difficulty, pr.productDescription, pr.imageId as prImageId, pr.price, pr.active, pr.videoURL from " + self.dbname + "projects p inner join " + self.dbname + "products pr on pr.baseProjectId=p.id where pr.active=1 and p.isProduct=1 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.idCount + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            }

                            // Classes
                            if (req.body.privilegedUser === "1") {
                                // A privileged user doesn't care about active.
                                strQuery += "select distinct p.id, p.name, p.description, p.imageId, cl.level, cl.difficulty, cl.classDescription, cl.imageId as clImageId, cl.price, cl.schedule, cl.active, cl.classNotes, cl.zip, cl.maxClassSize from " + self.dbname + "projects p inner join " + self.dbname + "classes cl on cl.baseProjectId=p.id where p.isClass=1 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.idCount + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            } else {
                                // A non-privileged user just sees active classes.
                                strQuery += "select distinct p.id, p.name, p.description, p.imageId, cl.level, cl.difficulty, cl.classDescription, cl.imageId as clImageId, cl.price, cl.schedule, cl.active, cl.classNotes, cl.zip, cl.maxClassSize from " + self.dbname + "projects p inner join " + self.dbname + "classes cl on cl.baseProjectId=p.id where cl.active=1 and p.isClass=1 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.idCount + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            }

                            // Online classes
                            if (req.body.privilegedUser === "1") {
                                // A privileged user doesn't care about active.
                                strQuery += "select distinct p.id, p.name, p.description, p.imageId, cl.level, cl.difficulty, cl.classDescription, cl.imageId as clImageId, cl.price, cl.schedule, cl.active, cl.classNotes from " + self.dbname + "projects p inner join " + self.dbname + "onlineclasses cl on cl.baseProjectId=p.id where p.isOnlineClass=1 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.idCount + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            } else {
                                // A non-privileged user just sees active classes.
                                strQuery += "select distinct p.id, p.name, p.description, p.imageId, cl.level, cl.difficulty, cl.classDescription, cl.imageId as clImageId, cl.price, cl.schedule, cl.active, cl.classNotes from " + self.dbname + "projects p inner join " + self.dbname + "onlineclasses cl on cl.baseProjectId=p.id where cl.active=1 and p.isOnlineClass=1 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.idCount + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            }
                        }

                        sql.execute(strQuery,
                            function(rows){

                                if (passOn.idString.length) {

                                    // rows is a jagged array with first dimension size = 6.
                                    var totRows = 0;
                                    for (var i = 0; i < 6; i++) { totRows += rows[i].length; }
                                    if (totRows === 0) {
                                        passOn.projects = rows;
                                        return cb(null, passOn);
                                    }

                                    // Sort rows on name, since async retrieval doesn't let us sort in the query.
                                    for (var i = 0; i < 6; i++) {
                                        if (rows[i].length) {

                                            rows[i].sort(function(a,b){

                                                if (a.name > b.name)
                                                    return 1;
                                                if (a.name < b.name)
                                                    return -1;
                                                return 0;
                                            });
                                        }
                                    }

                                    passOn.projects = rows;
                                    return cb(null, passOn);

                                } else {

                                    // Tags didn't match. rows has core projects for priv. user and is empty for non-priv. users.
                                    // But we have to fill out passOn.projects so we can return success, not failure.
                                    // And not crap out on the client side.

                                    passOn.projects = Array(6);
                                    if (req.body.privilegedUser === '1') {
                                        passOn.projects[0] = rows;
                                    } else {
                                        passOn.projects[0] = new Array();
                                    }

                                    for (var i = 1; i < 6; i++) {
                                        passOn.projects[i] = new Array();
                                    }

                                    return cb(null, passOn);
                                }
                            },
                            function(strError) { return cb(new Error(strError), null); }
                        );
                    },
                    // (4a)
                    // passOn.projects will have no rows in any of its 6 dimensions only if tags don't match and we're called by a non-priv. user.
                    // passOn.projects[0] is core projects.
                    // passOn.projects[1] is the user's own projects.
                    // passOn.projects[2] is others' projects.
                    // passOn.projects[3] is Product projects.
                    // passOn.projects[4] is Class projects.
                    // passOn.projects[5] is Online class projects.
                    // We need to process [4] and [5] separately in (4a) and (4b), respectively.
                    function(passOn, cb) {

                        if (req.body.privilegedUser === "0") {
                            // A normal user, retrieving classes, gets only active ones (already handled in the query) and
                            // only only those starting within 3 months. They also must be within 35 miles of req.body.nearZip.
                            // Any non-qualified are removed from passOn.projects[4].

                            var mntNow = moment();

                            async.eachSeries(passOn.projects[4],
                                function(projectIth, cb) {

                                    projectIth.remove = false;
                                    var strClass1Date = JSON.parse(projectIth.schedule)[0].date;
                                    // This date must exist or the class could not have been made active.
                                    // As must the zipcode used below.

                                    var mntClass1Date = moment(strClass1Date, "YYYY-MM-DD");
                                    if (mntClass1Date.isBefore(mntNow) || mntClass1Date.isAfter(mntNow.clone().add(3, "months"))) {
                                        
                                        // Class started in the past or starts more than 3 months from now.
                                        projectIth.remove = true;
                                        return cb(null);

                                    } else {

                                        // Class is not disqualified due to start date. We'll do the zipcode distance check.
                                        // https://www.zipcodeapi.com/rest/<zipcodekey>/distance.<format>/<zip_code1>/<zip_code2>/<units>.
                                        var url = "https://www.zipcodeapi.com/rest/" + app.get("zipcodekey") + "/distance.json/" + projectIth.zip + "/" + passOn.zipcode + "/mile";
                                        var xhr = new XMLHttpRequest();
                                        xhr.open("GET", url, true);     // true means async (which is default)
                                        xhr.onload = function (e) {

                                            if (xhr.status === 200) {
                                                // A good result to test.
                                                console.log("Got xhr.responseText: " + xhr.responseText);
                                                var distanceJSON = JSON.parse(xhr.responseText);
                                                if (distanceJSON.hasOwnProperty("distance")) {
                                                    // Has distance prop.
                                                    if (distanceJSON.distance > 35) {
                                                        // But too far.
                                                        projectIth.remove = true;
                                                    }
                                                } else {
                                                    // No distance prop. Some sort of error. Disqualify this project.
                                                    projectIth.remove = true;
                                                }
                                            } else {
                                                // Error. Disqualify this project.
                                                projectIth.remove = true;
                                            }
                                            // Never an error, since we just remove a project in case of error.
                                            return cb(null);
                                        };
                                        xhr.onerror = function (e) {
                                            projectIth.remove = true;
                                            return cb(null);
                                        };
                                        xhr.send(null);
                                    }
                                },
                                function(err) {

                                    // err is always null, since in all error cases, we just remove the project.
                                    for (var i = passOn.projects[4].length - 1; i >= 0; i--) {
                                        if (passOn.projects[4][i].remove) {
                                            passOn.projects[4].splice(i, 1);
                                        }
                                    }
                                    return cb(null, passOn);
                                }
                            );
                        } else { return cb(null, passOn); }
                    },
                    // (4b)
                    function(passOn, cb) {

                        if (req.body.privilegedUser === "0") {
                            // A normal user, retrieving online classes, gets only active ones (already handled in the query) and
                            // only only those starting within 3 months.
                            // Any non-qualified are removed from passOn.projects[5].

                            var mntNow = moment();

                            async.eachSeries(passOn.projects[5],
                                function(projectIth, cb) {

                                    projectIth.remove = false;
                                    var strClass1Date = JSON.parse(projectIth.schedule)[0].date;
                                    // This date must exist or the class could not have been made active.
                                    // As must the zipcode used below.

                                    var mntClass1Date = moment(strClass1Date, "YYYY-MM-DD");
                                    if (mntClass1Date.isBefore(mntNow) || mntClass1Date.isAfter(mntNow.clone().add(3, "months"))) {
                                        
                                        // Class started in the past or starts more than 3 months from now.
                                        projectIth.remove = true;
                                    }
                                    return cb(null);
                                },
                                function(err) {

                                    // err is always null.
                                    for (var i = passOn.projects[5].length - 1; i >= 0; i--) {
                                        if (passOn.projects[5][i].remove) {
                                            passOn.projects[5].splice(i, 1);
                                        }
                                    }
                                    return cb(null, passOn);
                                }
                            );
                        } else { return cb(null, passOn); }
                    },
                    // (5)
                    function(passOn, cb) {

                        async.eachSeries(passOn.projects[4],
                            function(projectIth, cb) {

                                var strQuery = "select count(*) as cnt from " + self.dbname + "projects where comicProjectId=" + projectIth.id + " and id<>" + projectIth.id + ";";

                                sql.execute(strQuery,
                                    function(rows){

                                        if (rows.length === 0) {
                                            projectIth.numEnrollees = 0;
                                        } else {
                                            projectIth.numEnrollees = rows[0].cnt;
                                        }
                                        return cb(null);
                                    },
                                    function(strError) { return cb(new Error(strError)); }
                                );
                            },
                            function(err) {
                                return cb(err, passOn);
                            }
                        );
                    }
                ],
                function(err, passOn) {

                    console.log("Got into the waterfall's final function");
                    if (err) {
                        console.log("In final func. Returning success:false");
                        return res.json({success:false, message:err.message});
                    }

                    return res.json({
                        success: true,
                        arrayRows: passOn.projects
                    });
                }
            );
        } catch (e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

    self.routePutUserOnWaitlist = function (req, res) {

        try {

            console.log("Entered UtilityBO/routePutUserOnWaitList with req.body = " + JSON.stringify(req.body));
            // req.body.productId
            // req.user.userId
            // req.user.userName

            sql.getCxnFromPool(
                function(err, connection) {

                    if (err) {

                        return res.json({
                            success: false,
                            message: 'Could not get a database connection: ' + err.message
                        });
                    }

                    var guts = {
                        projectId: req.body.projectId,
                        userId: req.user.userId,
                        userName: req.user.userName
                    };
                    var strQuery = "INSERT " + self.dbname + "waitlist SET ?";
                    console.log('Inserting waitlist record with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                    sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                        function(err, rows) {

                            if (err) {
                                return res.json({
                                    success: false,
                                    message: 'Could not add user to waitlist: ' + err.message
                                });
                            }

                            return res.json({
                                success: true
                            });
                        }
                    );
                }
            );
        } catch(e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

    self.routeSearchTypes = function (req, res) {

        // This is a search for types based on tags.

        try {

            console.log("Entered UtilityBO/routeSearchTypes with req.body = " + JSON.stringify(req.body));
            // req.body.tags
            // req.user.userId
            // req.user.userName
            // req.body.onlyOwnedByUser   '0' or '1'

            // Add resource type description to the tags the user (may have) entered.
            var tags = req.body.tags + " type";

            // If we're retrieving only items created by user, add userName to tags.
            if (req.body.onlyOwnedByUser === "1") {

                tags += " " + req.user.userName;
            }
            // console.log("tags massaged='" + tags + "'");

            // Turn tags into string with commas between tags and tags surrounded by single quotes.
            var ccArray = tags.match(/([\w\-\_\@\.]+)/g);

            var ccString = '';
            for (var i = 0; i < ccArray.length; i++) {

                if (i > 0) {

                    ccString = ccString + ',';
                }

                ccString = ccString + "'" + ccArray[i] + "'";
            }

            var sqlString = "select id from " + self.dbname + "tags where description in (" + ccString + ");";

            // console.log(' ');
            // console.log('Query to get tag ids: ' + sqlString);
            // console.log(' ');

            var exceptionRet = sql.execute(sqlString,
                function (arrayRows) {
                
                    // We have to get the same number of rows back from the query as ccArray.length.
                    if (arrayRows.length !== ccArray.length) {

                        // Success as far as the function is concerned but no result array
                        res.json({
                            success:true,
                            arrayRows: new Array()
                        });
                    } else {

                        // We can proceed since all tags exist and their id's are in arrayRows.
                        // Construct tagIds joined by ',' for use in main queries below. Hold in idString.
                        var idString = '';
                        for (var i = 0; i < arrayRows.length; i++) {

                            if (i > 0) {

                                idString = idString + ',';
                            }

                            idString = idString + arrayRows[i].id.toString();
                        }

                        // By including userName in tags if req.body.onlyOwnedByUser, we automatically make the "only mine" and "choose all matching" work.
                        // But to do so, we need something like: (ownedByUserId=req.user.userId or public=1) along with the tag matching. Note: public=1 works all the time, because of the userName match requirement.

                        sqlString = "select distinct t.* from " + self.dbname + "types t where (t.ownedByUserId=" + req.user.userId + " or t.public=1) and t.id in (select distinct typeId from " + self.dbname + "type_tags tt where " + arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "type_tags tt2 where tt2.typeId=tt.typeId and tagId in (" + idString + ")));";

                        console.log(' ');
                        console.log('Query: ' + sqlString);
                        console.log(' ');

                        exceptionRet = sql.execute(sqlString,
                            function(rows){

                                // Sort rows on name, since async retrieval doesn't let us sort in the query.
                                rows.sort(function(a,b){

                                    if (a.name > b.name)
                                        return 1;
                                    if (a.name < b.name)
                                        return -1;
                                    return 0;
                                });
                                res.json({
                                    success:true,
                                    arrayRows: rows
                                });
                            },
                            function(err){
                                res.json({
                                    success:false,
                                    message: err.message
                                });
                            }
                        );
                    }
                },
                function (strError) {
                
                    res.json({
                        success: false,
                        message: strError
                    });
            });
            if (exceptionRet !== null) {

                res.json({
                    success: false,
                    message: exceptionRet.message
                });
            }
        } catch (e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

    self.routeSearchMethods = function (req, res) {

        // This is a search for methods based on tags.

        try {

            console.log("Entered UtilityBO/routeSearchMethods with req.body = " + JSON.stringify(req.body));
            // req.body.tags
            // req.user.userId
            // req.user.userName
            // req.body.onlyOwnedByUser   '0' or '1'

            // Add resource type description to the tags the user (may have) entered.
            var tags = req.body.tags + " method";

            // If we're retrieving only items created by user, add userName to tags.
            if (req.body.onlyOwnedByUser === "1") {

                tags += " " + req.user.userName;
            }
            // console.log("tags massaged='" + tags + "'");

            // Turn tags into string with commas between tags and tags surrounded by single quotes.
            var ccArray = tags.match(/([\w\-\_\@\.]+)/g);

            var ccString = '';
            for (var i = 0; i < ccArray.length; i++) {

                if (i > 0) {

                    ccString = ccString + ',';
                }

                ccString = ccString + "'" + ccArray[i] + "'";
            }

            var sqlString = "select id from " + self.dbname + "tags where description in (" + ccString + ");";

            // console.log(' ');
            // console.log('Query to get tag ids: ' + sqlString);
            // console.log(' ');

            var exceptionRet = sql.execute(sqlString,
                function (arrayRows) {
                
                    // We have to get the same number of rows back from the query as ccArray.length.
                    if (arrayRows.length !== ccArray.length) {

                        // Success as far as the function is concerned but no result array
                        res.json({
                            success:true,
                            arrayRows: new Array()
                        });
                    } else {

                        // We can proceed since all tags exist and their id's are in arrayRows.
                        // Construct tagIds joined by ',' for use in main queries below. Hold in idString.
                        var idString = '';
                        for (var i = 0; i < arrayRows.length; i++) {

                            if (i > 0) {

                                idString = idString + ',';
                            }

                            idString = idString + arrayRows[i].id.toString();
                        }

                        // By including userName in tags if req.body.onlyOwnedByUser, we automatically make the "only mine" and "choose all matching" work.
                        // But to do so, we need something like: (ownedByUserId=req.body.userId or public=1) along with the tag matching. Note: public=1 works all the time, because of the userName match requirement.

                        sqlString = "select distinct m.* from " + self.dbname + "methods m where (m.ownedByUserId=" + req.user.userId + " or m.public=1) and m.id in (select distinct methodId from " + self.dbname + "method_tags mt where " + arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "method_tags mt2 where mt2.methodId=mt.methodId and tagId in (" + idString + ")));";

                        console.log(' ');
                        console.log('Query: ' + sqlString);
                        console.log(' ');
                        
                        exceptionRet = sql.execute(sqlString,
                            function(rows){

                                // Sort rows on name, since async retrieval doesn't let us sort in the query.
                                rows.sort(function(a,b){

                                    if (a.name > b.name)
                                        return 1;
                                    if (a.name < b.name)
                                        return -1;
                                    return 0;
                                });
                                res.json({
                                    success:true,
                                    arrayRows: rows
                                });
                            },
                            function(err){
                                res.json({
                                    success:false,
                                    message: err.message
                                });
                            }
                        );
                    }
                },
                function (strError) {
                
                    res.json({
                        success: false,
                        message: strError
                    });
            });
            if (exceptionRet !== null) {

                res.json({
                    success: false,
                    message: exceptionRet.message
                });
            }
        } catch (e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

    self.routeAddLogitem = function (req, res) {

        try {

            console.log("Entered UtilityBO/routeAddLogitem with req.body = " + JSON.stringify(req.body));

            var exceptionRet = logger.logItem(req.body.logtypeId, req.body.jsoncontext);

            if (exceptionRet) {

                res.json({
                    success: false,
                    message: exceptionRet.message
                });
            } else {

                // Return success: true
                res.json({
                    
                    success: true
                });
            }
        } catch (e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

};

