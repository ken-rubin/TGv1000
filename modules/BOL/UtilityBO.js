//////////////////////////////////
// UtilityBO.js module
//
//////////////////////////////////
var fs = require("fs");
var jade = require("jade");
var async = require("async");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
                    amount: parseFloat(req.body.dAmount) * 100,    // amount in cents!
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
            // req.body.onlyCoreProjects
            // req.body.onlyOwnedByUser   
            // req.body.onlyOthersProjects
            // req.body.onlyProducts
            // req.body.onlyClasses If === 1: if req.body.privilegedUser === 0, limit to classes about to start in next 3 months and then loop thru them, saving 
            //                          only those within 30 miles of req.body.nearZip.
            //                      If req.body.privilegedUser === 1, ignore the 3 month limitation and, since it's optional, use nearZip only if entered.
            // req.body.nearZip     This is the user's home zipcode. It is optional for a privileged user.
            //                      GET from https://www.zipcodeapi.com/rest/<zipcodekey>/distance.json/<zip_code1>/<zip_code2>/mile where
            //                          <zipcodekey> is replaced by app.get("zipcodekey")
            //                          <zip_code1> is replaced by req.body.nearZip
            //                      result is of form { distance: 34.5 }
            // req.body.onlyOnlineClasses If === 1: if req.body.privilegedUser === 0, limit to classes about to start in next 3 months.
            //                      If req.body.privilegedUser === 1, ignore the 3 month limitation.
            // req.body.privilegedUser

            // Will use async.series to (1) get string of tag id's; (2) perform one of many select statements to get matching projects; 
            // (3) if req.body.onlyClasses, then possibly winnow class projects down by date and distance.

            async.waterfall(
                [
                    // (1)
                    function(cb) {

                        if (req.body.onlyCoreProjects === "1") {

                            return cb(null, {});
                        }

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
                        console.log("");
                        console.log(sqlString);
                        console.log("");
                        sql.execute(sqlString,
                            function (arrayRows) {
                            
                                // We have to get the same number of rows back from the query as ccArray.length.
                                if (arrayRows.length !== ccArray.length) {

                                    // Success as far as the POST is concerned but an empty array of projects will be returned.
                                    return res.json({
                                        success: true,
                                        arrayRows: []
                                    });
                                }

                                // We can proceed since all tags exist and their id's are in arrayRows.
                                // Construct tagIds joined by ',' for use in main queries below. Hold in idString.
                                var idString = '';
                                for (var i = 0; i < arrayRows.length; i++) {

                                    if (i > 0) { idString = idString + ','; }
                                    idString = idString + arrayRows[i].id.toString();
                                }

                                var passOn = {idString: idString, arrayRows: arrayRows};
                                return cb(null, passOn);
                            },
                            function(strError) { return cb(new Error(strError), null); }
                        );
                    },
                    // (2)
                    function(passOn, cb) {

                        var strQuery;

                        // In the queries below, we're not retrieving the whole project rows (or the project joined with class or product).
                        // We're just selecting enough to create the image (with project.id) in the carousel and to decide (in the case of classes and products)
                        // if the project should be retrieved in the first place. 
                        if (req.body.onlyCoreProjects === "1") {

                            // Only for privileged users.
                            strQuery = "select p.id, p.name, p.description, p.imageId from " + self.dbname + "projects p where p.isCoreProject=1;";

                        } else if (req.body.onlyOwnedByUser === "1") {

                            strQuery = "select distinct p.id, p.name, p.description, p.imageId from " + self.dbname + "projects p where p.ownedByUserId=" + req.user.userId + " and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";

                        } else if (req.body.onlyOthersProjects === "1") {

                            if (req.body.privilegedUser === "1") {
                                // A privileged user doesn't care about public/private.
                                strQuery = "select distinct p.id, p.name, p.description, p.imageId from " + self.dbname + "projects p where p.ownedByUserId<>" + req.user.userId + " and p.isCoreProject=0 and p.isProduct=0 and p.isClass=0 and p.isOnlineClass=0 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";

                            } else {
                                // A non-privileged user can retrieve only public projects and only "normal" projects.
                                strQuery = "select distinct p.id, p.name, p.description, p.imageId from " + self.dbname + "projects p where p.ownedByUserId<>" + req.user.userId + " and p.public=1 and p.isCoreProject=0 and p.isProduct=0 and p.isClass=0 and p.isOnlineClass=0 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            }
                        } else if (req.body.onlyProducts === "1") {

                            if (req.body.privilegedUser === "1") {
                                // A privileged user doesn't care about active.
                                strQuery = "select distinct p.id, p.name, p.description, p.imageId from " + self.dbname + "projects p inner join " + self.dbname + "products pr on pr.baseProjectId=p.id where p.isProduct=1 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            } else {
                                // A non-privileged user just sees active projects.
                                strQuery = "select distinct p.id, p.name, p.description, p.imageId from " + self.dbname + "projects p inner join " + self.dbname + "products pr on pr.baseProjectId=p.id where pr.active=1 and p.isProduct=1 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            }
                        } else if (req.body.onlyClasses === "1") {

                            if (req.body.privilegedUser === "1") {
                                // A privileged user doesn't care about active.
                                strQuery = "select distinct p.id, p.name, p.description, p.imageId, cl.schedule, cl.zip from " + self.dbname + "projects p inner join " + self.dbname + "classes cl on cl.baseProjectId=p.id where p.isClass=1 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            } else {
                                // A non-privileged user just sees active classes.
                                strQuery = "select distinct p.id, p.name, p.description, p.imageId, cl.schedule, cl.zip from " + self.dbname + "projects p inner join " + self.dbname + "classes cl on cl.baseProjectId=p.id where cl.active=1 and p.isClass=1 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            }
                        } else { // req.body.onlyOnlineClasses === "1"

                            if (req.body.privilegedUser === "1") {
                                // A privileged user doesn't care about active.
                                strQuery = "select distinct p.id, p.name, p.description, p.imageId, cl.schedule from " + self.dbname + "projects p inner join " + self.dbname + "onlineclasses cl on cl.baseProjectId=p.id where p.isOnlineClass=1 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            } else {
                                // A non-privileged user just sees active classes.
                                strQuery = "select distinct p.id, p.name, p.description, p.imageId, cl.schedule from " + self.dbname + "projects p inner join " + self.dbname + "onlineclasses cl on cl.baseProjectId=p.id where cl.active=1 and p.isOnlineClass=1 and p.id in (select distinct projectId from " + self.dbname + "project_tags pt where " + passOn.arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "project_tags pt2 where pt2.projectId=pt.projectId and tagId in (" + passOn.idString + ")));";
                            }
                        }

                        sql.execute(strQuery,
                            function(rows){

                                // Sort rows on name, since async retrieval doesn't let us sort in the query.
                                rows.sort(function(a,b){

                                    if (a.name > b.name)
                                        return 1;
                                    if (a.name < b.name)
                                        return -1;
                                    return 0;
                                });

                                passOn.projects = rows;
                                return cb(null, passOn);
                            },
                            function(strError) { return cb(new Error(strError), null); }
                        );
                    },
                    // (3)
                    function(passOn, cb) {

                        if ((req.body.onlyClasses === "1" || req.body.onlyOnlineClasses === "1") && passOn.projects.length > 0) {

                            if (req.body.privilegedUser === "0") {
                                // A normal user, retrieving classes or online classes, gets only active ones (already handled in the query) and
                                // only only those starting within 3 months. For classes (not online) they must be within 35 miles of req.body.nearZip.
                                // Any non-qualified are removed from passOn.projects.

                                var today = new Date();
                                async.each(passOn.projects,
                                    function(projectIth, cb) {

                                        var bRemove = false;
                                        var class1Date = projectIth.schedule[0].date;
                                        // This date must exist or the class could not have been made active.
                                        // As must the zipcode used below.

                                        var class1DateDate = new Date(class1Date);
                                        var diffSeconds = (class1DateDate - today) / 1000;
                                        if (diffSeconds < 0) {
                                            // Class was in the past
                                            bRemove = true;
                                        } else {
                                            var diffDays = diffSeconds / (24*60*60);
                                            if (diffDays > 92) {

                                                bRemove = true;
                                            }
                                        }

                                        if (!bRemove && req.body.onlyClasses === "1") {
                                            // Class is not disqualified due to start date. We'll do the zipcode distance check.
                                            // https://www.zipcodeapi.com/rest/<zipcodekey>/distance.<format>/<zip_code1>/<zip_code2>/<units>.
                                            var url = "https://www.zipcodeapi.com/rest/" + app.get("zipcodekey") + ".json/" + projectIth.zip + "/" + req.body.nearZip + "/mile";
                                            var xhr = new XMLHttpRequest();
                                            xhr.open("GET", url, true);
                                            xhr.onload = function (e) {

                                                if (xhr.readyState === 4) {

                                                    if (xhr.status === 200) {

                                                        var distanceJSON = JSON.parse(xhr.responseText);
                                                        if (distanceJSON.hasOwnProperty("distance")) {

                                                            if (distanceJSON.distance > 35) {

                                                                bRemove = true;
                                                            }
                                                        } else {

                                                            bRemove = true;
                                                        }
                                                    } else {
                                                        bRemove = true;
                                                    }
                                                }
                                            };
                                            xhr.onerror = function (e) {
                                                bRemove = true;
                                            };
                                            xhr.send(null);
                                        }

                                        projectIth.remove = bRemove;
                                        cb(null);
                                    }
                                );
                            } else {
                                // A privileged user, retrieving classes or online classes, gets both active and inactive ones. And date doesn't matter.
                                // For classes (not online) they must be within 35 miles of req.body.nearZip--if that optional parameter is entered.
                                // Any non-qualified are removed from passOn.projects.
                                async.each(passOn.projects,
                                    function(projectIth, cb) {

                                        var bRemove = false;
                                        if (req.body.nearZip.length > 0 && req.body.onlyClasses === "1") {
                                            // Do the zipcode distance check.
                                            // https://www.zipcodeapi.com/rest/<zipcodekey>/distance.<format>/<zip_code1>/<zip_code2>/<units>.
                                            var url = "https://www.zipcodeapi.com/rest/" + app.get("zipcodekey") + ".json/" + projectIth.zip + "/" + req.body.nearZip + "/mile";
                                            var xhr = new XMLHttpRequest();
                                            xhr.open("GET", url, true);
                                            xhr.onload = function (e) {

                                                if (xhr.readyState === 4) {

                                                    if (xhr.status === 200) {

                                                        var distanceJSON = JSON.parse(xhr.responseText);
                                                        if (distanceJSON.hasOwnProperty("distance")) {

                                                            if (distanceJSON.distance > 35) {

                                                                bRemove = true;
                                                            }
                                                        } else {

                                                            bRemove = true;
                                                        }
                                                    } else {
                                                        bRemove = true;
                                                    }
                                                }
                                            };
                                            xhr.onerror = function (e) {
                                                bRemove = true;
                                            };
                                            xhr.send(null);
                                        }

                                        projectIth.remove = bRemove;
                                        cb(null);
                                    }
                                );
                            }
                            
                            for (var i = passOn.projects.length - 1; i >= 0; i--) {
                                if (passOn.projects[i].remove) {
                                    passOn.projects.splice(i, 1);
                                }
                            }
                        }

                        return cb(null, passOn);
                    }
                ],
                function(err, passOn) {

                    if (err) {
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

    // self.routeGetDashboardFuncs = function (req, res) {

    //     console.log("Entered UtilityBO/routeGetDashboardFuncs");

    //     try {

    //         // Select data.
    //         var exceptionRet = sql.execute("select * from " + self.dbname + "adminFuncs order by wording asc;",
    //             function (arrayRows) {
                
    //                 res.json({

    //                     success: true,
    //                     arrayRows: arrayRows
    //                 });
    //             },
    //             function (strError) {
                
    //                 res.json({

    //                     success: false,
    //                     message: strError
    //                 });
    //         });
    //         if (exceptionRet !== null) {

    //             res.json({

    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch (e) {

    //         res.json({

    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeGetClasses = function (req, res, next) {
    
    //     try {
        
    //         console.log("Entered UtilityBO/routeGetClasses.");

    //         var strWhere = (req.body.which === 'active' ? ' where display=1;' : ";");

    //         // Select data.
    //         var exceptionRet = sql.execute("select * from " + self.dbname + "classes" + strWhere,
    //             function (arrayRows) {
                
    //                 res.json({

    //                     success: true,
    //                     arrayRows: arrayRows
    //                 });
    //             },
    //             function (strError) {
                
    //                 res.json({

    //                     success: false,
    //                     message: strError
    //                 });
    //         });
    //         if (exceptionRet !== null) {

    //             res.json({

    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch (e) {

    //         res.json({

    //             success: false,
    //             message: e.message
    //         });
    //     }
    // };
    
    // Private fields
};

