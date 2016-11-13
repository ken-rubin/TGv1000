//////////////////////////////////
// UtilityBO.js module
//
//////////////////////////////////
var fs = require("fs");
var jade = require("jade");
var async = require("async");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var moment = require("moment-timezone");
var mysql = require("mysql");
var stripe = null;
var bLocalCredit = true;

module.exports = function UtilityBO(app, sql, logger, mailWrapper) {

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
                function(err, charge) {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                    } else {

                        // Return success
                        res.json({
                            success: true,
                            chargeId: charge.id
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

    self.routeUndoPurchase = function (req, res) {

        try {

            // Processes a Stripe refund and upon success delete the purchased project (cascading).

            console.log("Entered UtilityBO/routeUndoPurchase with req.body = " + JSON.stringify(req.body));
            // req.body.projectId: product project id -- NOT THE ID OF THE USER'S PROJECT WE'RE DELETING.
            // req.body.userid: Userid of owner of project
            // req.body.refund: bRefund

            if (req.body.refund === '1') {

                var chargeId = null;
                var id = null;
/* TOXXX DONE   var strQuery = "select chargeId, id from " + self.dbname + "projects where ownedByUserId=" + req.body.userId + " and comicProjectId=" + req.body.projectId + ";"; */
                var strQuery = "select chargeId, id from " + self.dbname + "projects where ownedByUserId=" + req.body.userId + " and id in (" + self.dbname + "getProjectsLinkedToGivenProjectByComic(" + req.body.projectId + "));";
                sql.execute(
                    strQuery,
                    function(rows) {

                        if (!rows.length) {

                            return res.json({
                                success: false,
                                message: "Unable to find user's charge Id."
                            });
                        }

                        chargeId = rows[0].chargeId;
                        id = rows[0].id;

                        var charge = stripe.refunds.create(
                            {
                                charge: chargeId
                            },
                            function(err, refund) {

                                if (err) {
                                    res.json({
                                        success: false,
                                        message: "Received this error processing refund with Stripe: " + err.message
                                    });
                                } else {

                                    // Do a cascading deletion of the project.
                                    var strQuery = "delete from " + self.dbname + "projects where id=" + id + ";";
                                    sql.execute(
                                        strQuery,
                                        function(rows) {

                                            // Success. Add a row to the refunds table. id is AUTO_INCREMENT and dtRefund defaults to CURRENT_TIMESTAMP.
                                            var strQuery2 = "insert " + self.dbname + "refunds (userId, projectId, refundId) values(" + req.body.userId + "," + req.body.projectId + ",'" + refund.id + "');";
                                            sql.execute(
                                                strQuery2,
                                                function(rows) {

                                                    // Send a refund processed email to the user.
                                                    var aORz = (userIth.userName === 'a@a.com' || userIth.userName === 'z@z.com');
                                                    var when = classIth.mntClass1Date.format('dddd, MMMM Do YYYY [at] h:mm:ss a');
                                                    mailOptions = {
                                             
                                                        from: "TechGroms <techgroms@gmail.com>", // sender address
                                                        to: (!aORz) ? userIth.userName : 'jerry@rubintech.com, ken.rubin@live.com, jdsurf@gmail.com',
                                                        subject: "A refund has been issued for the Next Wave Coders class", // Subject line
                                                        text: "Hi, " + userIth.firstName + ". " +
                                                        "For your reference, your refund ID is " + refund.id + ". This refund should appear soon in your card account." +
                                                        "\r\n\r\n\r\n\r\nWarm regards, The nextwavecoders Team",
                                                        html: "Hi, " + userIth.firstName + ". " +
                                                        "For your reference, your refund ID is " + refund.id + ". This refund should appear soon in your card account." +
                                                        "<br><br><br><br>Warm regards, The nextwavecoders Team"
                                                    };

                                                    mailWrapper.mail(mailOptions,
                                                        function(error) {

                                                            if (error) {

                                                                return res.json({
                                                                    success: false,
                                                                    message: "Received this error insert refund row into OUR database AFTER the refund was processed successfully: " + error.message
                                                                });
                                                            }

                                                            // Return success
                                                            return res.json({
                                                                success: true
                                                            });
                                                        }
                                                    );
                                                },
                                                function(strError) {

                                                    return res.json({
                                                        success: false,
                                                        message: "Received this error insert refund row into OUR database AFTER the refund was processed successfully: " + strError
                                                    });
                                                }
                                            );
                                        },
                                        function(strError) {
                                            return res.json({
                                                success: false,
                                                message: "Received this error deleting user's project AFTER the refund was processed successfully: " + strError
                                            });
                                        }
                                    );
                                }
                            }
                        );
                    },
                    function(strError) {

                        return res.json({
                            success: false,
                            message: "Received this error retrieving charge Id: " + strError
                        });
                    }
                );
            } else {

// TODO Cascading delete has become more complicated so this will need to change:

                // This is the no-refund case. Just do cascading delete of the project.
                var projectIds = null;
/* TOXXX DONE   var strQuery = "select id from " + self.dbname + "projects where ownedByUserId=" + req.body.userId + " and comicProjectId=" + req.body.projectId + ";";                */
                var strQuery = "select " + self.dbname + "getProjectsLinkedToGivenProjectByComic(" + req.body.projectId + ") as projectIds;"; // userId check has been moved below.
                sql.execute(
                    strQuery,
                    function(rows) {

                        if (!rows.length) {

                            return res.json({
                                success: false,
                                message: "Unable to find user's project Id."
                            });
                        }

                        projectIds = rows[0].projectIds;

                        // Now do the cascading deletion of the project.
                        var strQuery = "delete from " + self.dbname + "projects where id in (" + projectIds + ") and ownedByUserId=" + req.body.userId + ";";
                        sql.execute(
                            strQuery,
                            function(rows) {

                                // Return success
                                res.json({
                                    success: true
                                });
                            },
                            function(strError) {
                                return res.json({
                                    success: false,
                                    message: "Received this error deleting user's project: " + strError
                                });
                            }
                        );
                    },
                    function(strError) {

                        return res.json({
                            success: false,
                            message: "Received this error retrieving user's project Id: " + strError
                        });
                    }
                );
            }
        } catch (e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

    self.routeGetAllUserMaintData = function (req, res) {

        try {

            console.log("Entered UtilityBO/routeGetAllUserMaintData");
            // no req props are used.

            // Returns all users, usergroups, permissions and ug_permissions.
            var strSql = "select * from " + self.dbname + "user; ";
            strSql += "select * from " + self.dbname + "usergroups; ";
            strSql += "select * from " + self.dbname + "permissions; ";
            strSql += "select * from " + self.dbname + "ug_permissions; ";
            sql.execute(
                strSql,
                function (rows) {

                    if (rows.length !== 4) {

                        return res.json({
                            success:false,
                            message: "Something went wrong fetching required info from the DB."
                        });
                    }

                    return res.json({
                        success:true,
                        rows: rows
                    });
                },
                function (strError) {

                    return res.json({
                        success: false,
                        message: "This error received fetching required info from the DB: " + strError
                     });
                }
            );
        } catch (e) {

            res.json({
                success: false,
                message: "This error received fetching required info from the DB: " + e.message
            });
        }
    }

    self.routeGetPPBuyers = function (req, res) {

        try {

            console.log("Entered UtilityBO/routeGetPPBuyers w/req.body = " + JSON.stringify(req.body));
            // req.body.projectId  purch. project id

            // Retrieve and build a response containing: 
            // (1) the project with numEnrollees property added; 
            // (2) special PP data; 
            // (3) array of purchasers (users); 
            // (4) array of waitlisted users, if any (in order).
            // (5) array of users in the 24-hour period after being invited to enroll. Will be displayed with active countdown.
            // (6) array of up to 100 latest refunds.

            async.waterfall(
                [
                    // (1a)
                    function(cb) {

                        var strQuery = "select * from " + self.dbname + "projects where id=" + req.body.projectId;
                        sql.execute(strQuery,
                            function(rows) {

                                if (rows.length !== 1) {
                                    return cb(new Error("Unable to fetch project from DB."), null);
                                }

                                return cb(null, { project: rows[0] } );
                            },
                            function(strError) {

                                return cb(new Error("Rec'd error fetching project from DB: " + strError), null);
                            }
                        );
                    },
                    // (1b)
                    function(passOn, cb) {
                        // So far passOn contains this property: project.
                        // This function adds passOn.project.numEnrollees

/* TOXXX DONE           var strQuery = "select count(*) as cnt from " + self.dbname + "projects where comicProjectId=" + passOn.project.id + " and id<>" + passOn.project.id + ";"; */
                        var strQuery = "select " + self.dbname + "getProjectsLinkedToGivenProjectByComic(" + passOn.project.id + ") as idstring";

                        sql.execute(strQuery,
                            function(rows){

                                var numEnrollees = 0;
                                if (rows.length) {

                                    var arr = rows[0].idstring.split(',');
                                    numEnrollees = arr.length;
                                }
                                passOn.project["numEnrollees"] = numEnrollees;
                                return cb(null, passOn);
                            },
                            function(strError) { 

                                return cb(new Error("Rec'd error fetching numEnrollees from DB: " + strError), null);
                            }
                        );
                    },
                    // (2)
                    function(passOn, cb) {
                        // So far passOn contains this property: project augmented with numEnrollees.
                        // This function adds passOn.classesdata or onlineclassesdata or productsdata for the project.

                        var tbl = (passOn.project.isProduct === 1) ? "products" : (passOn.project.isClass === 1) ? "classes" : "onlineclasses";
                        var strQuery = "select * from " + self.dbname + tbl + " where baseProjectId=" + req.body.projectId + ";";
                        sql.execute(strQuery,
                            function(rows) {

                                if (rows.length !== 1) {
                                    return cb(new Error("Unable to fetch project data from DB."), null);
                                }

                                passOn[tbl + "data"] = rows[0];
                                return cb(null, passOn);
                            },
                            function(strError) {

                                return cb(new Error("Rec'd error fetching project data from DB: " + strError), null);
                            }
                        );
                    },
                    // (3)
                    function(passOn, cb) {
                        // So far passOn contains these properties: project; one of classesdata, productsdata, onlineclassesdata.
                        // This function adds passOn.buyers.

/* TOXXX DONE           var strQuery = "select u.*, ug.name as usergroupName from " + self.dbname + "user u inner join " + self.dbname + "usergroups ug on u.usergroupId=ug.id where u.id in (select ownedByUserId from " + self.dbname + "projects where id<>comicProjectId and comicProjectId=" + req.body.projectId + ");"; */
                        var strQuery = "select u.*, ug.name as usergroupName from " + self.dbname + "user u inner join " + self.dbname + "usergroups ug on u.usergroupId=ug.id where u.id in (select ownedByUserId from " + self.dbname + "projects where id in (select " + self.dbname + "getProjectsLinkedToGivenProjectByComic(" + req.body.projectId + ")));";
                        sql.execute(
                            strQuery,
                            function(rows) {

                                passOn["buyers"] = rows;
                                return cb(null, passOn);
                            },
                            function(strError) {

                                return cb(new Error("Rec'd error fetching buyers from DB: " + strError), null);
                            }
                        );
                    },
                    // (4)
                    function(passOn, cb) {
                        // So far passOn contains these properties: project; one of classesdata, productsdata, onlineclassesdata; buyers.
                        // This function adds passOn.waitlisted.

                        var strQuery = "select u.*, ug.name as usergroupName, w.dtWaitlisted from " + self.dbname + "user u inner join " + self.dbname + "usergroups ug on u.usergroupId=ug.id inner join " + self.dbname + "waitlist w on w.userId=u.id where u.id in (select userId from " + self.dbname + "waitlist where projectId=" + req.body.projectId + " and dtInvited is null order by dtWaitlisted asc);";
                        sql.execute(
                            strQuery,
                            function(rows) {

                                passOn["waitlisted"] = rows;
                                return cb(null, passOn);
                            },
                            function(strError) {

                                return cb(new Error("Rec'd error fetching waitlisted from DB: " + strError), null);
                            }
                        );
                    },
                    // (5)
                    function(passOn, cb) {
                        // So far passOn contains these properties: project; one of classesdata, productsdata, onlineclassesdata; buyers, waitlisted.
                        // This function adds passOn.invited.

                        var strQuery = "select u.*, ug.name as usergroupName, w.dtWaitlisted, w.dtInvited from " + self.dbname + "user u inner join " + self.dbname + "usergroups ug on u.usergroupId=ug.id inner join " + self.dbname + "waitlist w on w.userId=u.id where u.id in (select userId from " + self.dbname + "waitlist where projectId=" + req.body.projectId + " and dtInvited is not null order by dtInvited asc);";
                        sql.execute(
                            strQuery,
                            function(rows) {

                                passOn["invited"] = rows;
                                return cb(null, passOn);
                            },
                            function(strError) {

                                return cb(new Error("Rec'd error fetching invited from DB: " + strError), null);
                            }
                        );
                    },
                    // (6)
                    function(passOn, cb) {
                        // So far passOn contains these properties: project; one of classesdata, productsdata, onlineclassesdata; buyers, waitlisted, invited.
                        // This function adds passOn.recentRefunds. These refunds apply across all purchasable products, unlike all the other passOn properties.

                        var strQuery = "select r.*, u.userName, p.name from " + self.dbname + "refunds r inner join " + self.dbname + "user u on u.id=r.userId inner join " + self.dbname + "projects p on p.id=r.projectId order by dtRefund desc LIMIT 100;";
                        sql.execute(
                            strQuery,
                            function(rows) {

                                passOn["recentRefunds"] = rows;
                                return cb(null, passOn);
                            },
                            function(strError) {

                                return cb(new Error("Rec'd error fetching refunds from DB: " + strError), null);
                            }
                        );
                    }
                ],
                function(err, passOn) {

                    if (err) {
                        return res.json({
                            success: false,
                            message: err.message
                        });
                    }

                    passOn["success"] = true;
                    return res.json(passOn);
                }
            );
        } catch (e) {

            res.json({
                success: false,
                message: "This error received fetching PP Buyers from the DB: " + e.message
            });
        }
    }

    self.routeAddPermission = function (req, res) {

        try {

            console.log("Entered UtilityBO/routeAddPermission w/req.body = " + JSON.stringify(req.body));
            // req.body.permission

            sql.getCxnFromPool(
                function(err, connection) {

                    if (err) {

                        return res.json({
                            success: false,
                            message: 'Could not get a database connection: ' + err.message
                        });
                    }

                    var guts = {
                        description: req.body.permission
                    };

                    var strQuery = "INSERT " + self.dbname + "permissions SET ?";
                    console.log('Inserting permissions record with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                    sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                        function(err, rows) {

                            if (err) {
                                return res.json({
                                    success: false,
                                    message: 'Could not add permission: ' + err.message
                                });
                            }

                            strQuery = "select * from " + self.dbname + "permissions;";
                            sql.execute(
                                strQuery,
                                function (rows) {

                                    if (rows.length === 0) {

                                        return res.json({
                                            success:false,
                                            message: "Something went wrong fetching permissions from the DB."
                                        });
                                    }

                                    return res.json({
                                        success:true,
                                        rows: rows
                                    });
                                },
                                function (strError) {

                                    return res.json({
                                        success: false,
                                        message: "This error received fetching permissions from the DB: " + strError
                                     });
                                }
                            );
                        }
                    );
                }            
            );
        } catch (e) {

            res.json({
                success: false,
                message: "This error received adding permission: " + e.message
            });
        }
    }

    self.routeAddUsergroup = function (req, res) {

        try {

            console.log("Entered UtilityBO/routeAddUsergroup w/req.body = " + JSON.stringify(req.body));
            // req.body.usergroup

            sql.getCxnFromPool(
                function(err, connection) {

                    if (err) {

                        return res.json({
                            success: false,
                            message: 'Could not get a database connection: ' + err.message
                        });
                    }

                    var guts = {
                        name: req.body.usergroup
                    };

                    var strQuery = "INSERT " + self.dbname + "usergroups SET ?";
                    console.log('Inserting usergroups record with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                    sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                        function(err, rows) {

                            if (err) {
                                return res.json({
                                    success: false,
                                    message: 'Could not add usergroup: ' + err.message
                                });
                            }

                            strQuery = "select * from " + self.dbname + "usergroups;";
                            sql.execute(
                                strQuery,
                                function (rows) {

                                    if (rows.length === 0) {

                                        return res.json({
                                            success:false,
                                            message: "Something went wrong fetching usergroups from the DB."
                                        });
                                    }

                                    return res.json({
                                        success:true,
                                        rows: rows
                                    });
                                },
                                function (strError) {

                                    return res.json({
                                        success: false,
                                        message: "This error received fetching usergroups from the DB: " + strError
                                     });
                                }
                            );
                        }
                    );
                }            
            );
        } catch (e) {

            res.json({
                success: false,
                message: "This error received adding usergroup: " + e.message
            });
        }
    }

    self.routeUpdateUserUsergroup = function (req, res) {

        try {

            console.log("Entered UtilityBO/routeUpdateUserUsergroup with req.body = " + JSON.stringify(req.body));
            // req.body.userId
            // req.body.usergroupId

            var strQuery = "update " + self.dbname + "user set usergroupId=" + req.body.usergroupId + " where id=" + req.body.userId + ";";
            var exceptionRet = sql.execute(
                strQuery,
                function (rows) {

                    return res.json({ success: true });
                },
                function (strError) { throw new Error(strError); }
            );
            if (exceptionRet) { throw exceptionRet; }
        } catch (e) {

            res.json({
                success: false,
                message: "This error received updating usergroup: " + e.message
            });
        }
    }

    self.routeUpdateUgPermissions = function (req, res) {

        try {

            console.log("Entered UtilityBO/routeUpdateUgPermissions with req.body = " + JSON.stringify(req.body));
            // req.body.permissionId
            // req.body.usergroupId
            // req.body.state ('on' or 'off')

            var strQuery;
            if (req.body.state === 'on') {

                // Add to ug_permissions.
                var strQuery = "insert " + self.dbname + "ug_permissions set usergroupId=" + req.body.usergroupId + ", permissionId=" + req.body.permissionId + ";";

            } else {

                // Delete from ug_permissions.
                var strQuery = "delete from " + self.dbname + "ug_permissions where usergroupId=" + req.body.usergroupId + " and permissionId=" + req.body.permissionId + ";";
            }

            var exceptionRet = sql.execute(
                strQuery,
                function(rows) {

                    return res.json({ success: true });
                },
                function (strError) { throw new Error(strError); }
            );
            if (exceptionRet) { throw exceptionRet; }
        } catch (e) {

            res.json({
                success: false,
                message: "This error received updating usergroup permission-set: " + e.message
            });
        }
    }

    self.routeSendClassInvite = function (req, res) {

        try {

            console.log("Entered UtilityBO/routeSendClassInvite with req.body = " + JSON.stringify(req.body));
            // req.body.projectId -- if of product project user is being invited to enroll in (getting off waitlist)
            // req.body.userId -- id of user being invited






            

        } catch (e) {

            res.json({
                success: false,
                message: "This error received inviting user off waitlist: " + e.message
            });
        }
    }

    self.routeSearchResources = function (req, res) {

        // This is a search for Images or Sounds (resourceTypeIds 1 and 2, respectively).
// TODO All needs changing
        try {

            console.log("Entered UtilityBO/routeSearchResources with req.body = " + JSON.stringify(req.body));
            // req.body.description
            // req.user.userId
            // req.user.userName
            // req.body.resourceTypeId  1,2,
            // req.body.onlyOwnedByUser   '0' or '1'

            var iResourceTypeId = parseInt(req.body.resourceTypeId,10);
            var resourceTypeDescr = m_resourceTypes[iResourceTypeId];

            // Add resource type description to the tags the user (may have) entered.
            var description = req.body.tags + " " + resourceTypeDescr;

            // If we're retrieving only items created by user, add userName to tags.
            if (req.body.onlyOwnedByUser === "1") {

                description += " " + req.user.userName;
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

        try {

            console.log("Entered UtilityBO/routeSearchProjects with req.body = " + JSON.stringify(req.body));
            // req.body.searchPhrase
            // req.user.userId
            // req.user.userName
            // req.body.userAllowedToCreateEditPurchProjs

            // Will return arrayRows: [][] where first dimension is 
            //  [0] core projects (empty if req.body.userAllowedToCreateEditPurchProjs === "0")
            //  [1] user's own projects
            //  [2] other's projects (if req.body.userAllowedToCreateEditPurchProjs, then ignore public/private; else just public)
            //  [3] products (if req.body.userAllowedToCreateEditPurchProjs, then all, active or not; else just active)
            //  [4] classes (if req.body.userAllowedToCreateEditPurchProjs, then all, active or not, no matter when or where; else just active, near user and soon)
            //  [5] online classes (if req.body.userAllowedToCreateEditPurchProjs, then all, active or not, no matter when; else just active and soon)

            // Will use async.waterfall to build up passOn javascript object:
            // (1) if req.body.userAllowedToCreateEditPurchProjs === "0", retrieve user's home zipcode;
            // (2) set things up to do soundex match on req.body.searchPhrase; this will result in creating a temporary table of soundex indices in descending order with 0 results ignored.
            // (3) perform many select statements to get projects that both match tags and contain correct items based on req.body.userAllowedToCreateEditPurchProjs; 
            // (4) if req.body.userAllowedToCreateEditPurchProjs === "0", then winnow classes down by date and distance; onlineclasses by date; and for Products and Online Classes see if already bought.
            // (5) for all surviving classes determine current number of users who bought the class.
            // (6) drop the temp table if it was created.

            async.waterfall(
                [
                    // (1)
                    function(cb) {

                        if (req.body.userAllowedToCreateEditPurchProjs === "0") {

                            sql.execute("select zipcode from " + self.dbname + "user where id=" + req.user.userId + ";",
                                function(rows) {

                                    if (rows.length !== 1) { return cb(new Error("Unable to read user table to determine zip code."), null); }

                                    return cb(null, {zipcode: rows[0]["zipcode"]});
                                },
                                function(strError) {
                                    return cb(new Error(strError), null);
                                }
                            );
                        } else {

                            // Priv. user doesn't need zipcode.
                            return cb(null, {zipcode: ''});
                        }
                    },
                    // (2)
                    function(passOn, cb) {

                        if (req.body.searchPhrase.length === 0) {

                            passOn["tempTableName"] = '';
                            return cb(null, passOn);
                        }

                        let sqlString = '';
    
                        // Gen unique name for this call's temporary table.
                        let guid = m_createGuid();
                        console.log('guid=' + guid);
                        let tempTableUniqueName = 'search_table_' + guid.replace(/-/g, '');
                        console.log('tempTableName=' + tempTableUniqueName);
                        passOn["tempTableName"] = tempTableUniqueName;
                        sqlString = "create table " + tempTableUniqueName + " (projectId INT UNSIGNED, sindex DOUBLE) ENGINE=InnoDB;";
                        sqlString += "insert " + tempTableUniqueName + " select id, soundex_match_all(" + mysql.escape(req.body.searchPhrase) + ", description, ' ') from " + self.dbname + "projects where length(description)>0;";

                        console.log(sqlString);
                        sql.execute(sqlString,
                            function (arrayRows) {
                            
                                // Need to debug into this and see what is returned in arrayRows--just to see if anything needs checking.
                                // if (arrayRows.length !== 1) { return cb(new Error('PROGRAM ERROR RECEIVED matching search phrase ' + req.body.searchPhrase), null); }

                                // We can proceed whether or not some matches came out of searchPhrase. Total failure (i.e., a temp table with no sindex values > 0) will be handled below.
                                return cb(null, passOn);
                            },
                            function(strError) { return cb(new Error(strError), null); }
                        );
                    },
                    // (3)
                    function(passOn, cb) {

                        let strQuery = '';

                        // In the queries below, we're not retrieving the whole project rows (or the project joined with class or product).
                        // We're just selecting: enough to create the image (with project.id) in the carousel; information for fairly
                        // detailed tooltips for purchasable prjects; and, for classes and products, to decide if the project should be retrieved in the first place.

                        // Core projects for privileged users. Empty array for non. req.body.searchPhase (actually passOn.tempTableName) isn't used.
                        // We do this query to fill passOn.projects[0] in any case.
                        if (req.body.userAllowedToCreateEditPurchProjs === "1") {
                            strQuery = "select p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId from " + self.dbname + "projects p where p.isCoreProject=1;";
                        } else {
                            // We want this to return no rows but use [0].
                            strQuery = "select p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId from " + self.dbname + "projects p where p.isCoreProject=-1;";
                        }

                        if (passOn.tempTableName.length === 0) {
                            // Not including temp table in queries, since there was no req.body.searchPhrase.

                            // Owned by user. Same for both priv and non-priv.
                            // In this query I'm selecting baseProjectId as the id of the purchased project.
                            strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, p.baseProjectId from " + self.dbname + "projects p where p.ownedByUserId=" + req.user.userId + ";";

                            // Others' accounts
                            if (req.body.userAllowedToCreateEditPurchProjs === "1") {
                                // A privileged user doesn't care about public/private.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId from " + self.dbname + "projects p where p.ownedByUserId<>" + req.user.userId + " and p.isCoreProject=0 and p.isProduct=0 and p.isClass=0 and p.isOnlineClass=0;";
                            } else {
                                // A non-privileged user can retrieve only public projects and only "normal" projects.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId from " + self.dbname + "projects p where p.ownedByUserId<>" + req.user.userId + " and p.public=1 and p.isCoreProject=0 and p.isProduct=0 and p.isClass=0 and p.isOnlineClass=0;";
                            }

                            // Products
                            if (req.body.userAllowedToCreateEditPurchProjs === "1") {
                                // A privileged user doesn't care about active.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, pr.level, pr.difficulty, pr.productDescription, pr.imageId as prImageId, pr.price, pr.active, pr.videoURL from " + self.dbname + "projects p inner join " + self.dbname + "products pr on pr.baseProjectId=p.id where p.isProduct=1;";
                            } else {
                                // A non-privileged user just sees active projects.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, p.isProduct, pr.* from " + self.dbname + "projects p inner join " + self.dbname + "products pr on pr.baseProjectId=p.id where pr.active=1 and p.isProduct=1;";
                            }

                            // Classes
                            if (req.body.userAllowedToCreateEditPurchProjs === "1") {
                                // A privileged user doesn't care about active.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, cl.level, cl.difficulty, cl.classDescription, cl.imageId as clImageId, cl.price, cl.schedule, cl.active, cl.classNotes, cl.zip, cl.maxClassSize from " + self.dbname + "projects p inner join " + self.dbname + "classes cl on cl.baseProjectId=p.id where p.isClass=1;";
                            } else {
                                // A non-privileged user just sees active classes.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, p.isClass, cl.* from " + self.dbname + "projects p inner join " + self.dbname + "classes cl on cl.baseProjectId=p.id where cl.active=1 and p.isClass=1;";
                            }

                            // Online classes
                            if (req.body.userAllowedToCreateEditPurchProjs === "1") {
                                // A privileged user doesn't care about active.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, cl.level, cl.difficulty, cl.classDescription, cl.imageId as clImageId, cl.price, cl.schedule, cl.active, cl.classNotes from " + self.dbname + "projects p inner join " + self.dbname + "onlineclasses cl on cl.baseProjectId=p.id where p.isOnlineClass=1;";
                            } else {
                                // A non-privileged user just sees active classes.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, p.isOnlineClass, cl.* from " + self.dbname + "projects p inner join " + self.dbname + "onlineclasses cl on cl.baseProjectId=p.id where cl.active=1 and p.isOnlineClass=1;";
                            }
                        } else {

                            // A searchPhrase was entered by the user and some non-0-index projects were found. Include temp table in queries.

                            // Owned by user. Same for both priv and non-priv.
                            // In this query I'm selecting baseProjectId as the id of the purchased project.
                            strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, p.baseProjectId, t.sindex from " + self.dbname + "projects p inner join " + passOn.tempTableName + " t on t.projectId=p.id where p.ownedByUserId=" + req.user.userId + " and p.id in (select projectId from " + passOn.tempTableName + " where sindex>0);";

                            // Others' accounts
                            if (req.body.userAllowedToCreateEditPurchProjs === "1") {
                                // A privileged user doesn't care about public/private.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, t.sindex from " + self.dbname + "projects p inner join " + passOn.tempTableName + " t on t.projectId=p.id where p.ownedByUserId<>" + req.user.userId + " and p.isCoreProject=0 and p.isProduct=0 and p.isClass=0 and p.isOnlineClass=0 and p.id in (select projectId from " + passOn.tempTableName + " where sindex>0);";
                            } else {
                                // A non-privileged user can retrieve only public projects and only "normal" projects.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, t.sindex from " + self.dbname + "projects p inner join " + passOn.tempTableName + " t on t.projectId=p.id where p.ownedByUserId<>" + req.user.userId + " and p.public=1 and p.isCoreProject=0 and p.isProduct=0 and p.isClass=0 and p.isOnlineClass=0 and p.id in (select projectId from " + passOn.tempTableName + " where sindex>0);";
                            }

                            // Products
                            if (req.body.userAllowedToCreateEditPurchProjs === "1") {
                                // A privileged user doesn't care about active.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, t.sindex, pr.level, pr.difficulty, pr.productDescription, pr.imageId as prImageId, pr.price, pr.active, pr.videoURL from " + self.dbname + "projects p inner join " + passOn.tempTableName + " t on t.projectId=p.id inner join " + self.dbname + "products pr on pr.baseProjectId=p.id where p.isProduct=1 and p.id in (select projectId from " + passOn.tempTableName + " where sindex>0);";
                            } else {
                                // A non-privileged user just sees active projects.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, p.isProduct, t.sindex, pr.* from " + self.dbname + "projects p inner join " + passOn.tempTableName + " t on t.projectId=p.id inner join " + self.dbname + "products pr on pr.baseProjectId=p.id where pr.active=1 and p.isProduct=1 and p.id in (select projectId from " + passOn.tempTableName + " where sindex>0);";
                            }

                            // Classes
                            if (req.body.userAllowedToCreateEditPurchProjs === "1") {
                                // A privileged user doesn't care about active.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, t.sindex, cl.level, cl.difficulty, cl.classDescription, cl.imageId as clImageId, cl.price, cl.schedule, cl.active, cl.classNotes, cl.zip, cl.maxClassSize from " + self.dbname + "projects p inner join " + passOn.tempTableName + " t on t.projectId=p.id inner join " + self.dbname + "classes cl on cl.baseProjectId=p.id where p.isClass=1 and p.id in (select projectId from " + passOn.tempTableName + " where sindex>0);";
                            } else {
                                // A non-privileged user just sees active classes.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, t.sindex, p.isClass, cl.* from " + self.dbname + "projects p inner join " + passOn.tempTableName + " t on t.projectId=p.id inner join " + self.dbname + "classes cl on cl.baseProjectId=p.id where cl.active=1 and p.isClass=1 and p.id in (select projectId from " + passOn.tempTableName + " where sindex>0);";
                            }

                            // Online classes
                            if (req.body.userAllowedToCreateEditPurchProjs === "1") {
                                // A privileged user doesn't care about active.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, t.sindex, cl.level, cl.difficulty, cl.classDescription, cl.imageId as clImageId, cl.price, cl.schedule, cl.active, cl.classNotes from " + self.dbname + "projects p inner join " + passOn.tempTableName + " t on t.projectId=p.id inner join " + self.dbname + "onlineclasses cl on cl.baseProjectId=p.id where p.isOnlineClass=1 and p.id in (select projectId from " + passOn.tempTableName + " where sindex>0);";
                            } else {
                                // A non-privileged user just sees active classes.
                                strQuery += "select distinct p.id as projectId, p.name as projectName, p.description as projectDescription, p.imageId as projectImageId, t.sindex, p.isOnlineClass, cl.* from " + self.dbname + "projects p inner join " + passOn.tempTableName + " t on t.projectId=p.id inner join " + self.dbname + "onlineclasses cl on cl.baseProjectId=p.id where cl.active=1 and p.isOnlineClass=1 and p.id in (select projectId from " + passOn.tempTableName + " where sindex>0);";
                            }
                        }

                        sql.execute(strQuery,
                            function(rows){

                                let numRows = rows.length;
                                switch (numRows) {
                                    case 0:
                                        return cb(new Error('Unknown failure of search query.'), null);
                                    case 1:
                                        passOn.projects = Array(6);
                                        if (req.body.userAllowedToCreateEditPurchProjs === '1') {
                                            passOn.projects[0] = rows;
                                        } else {
                                            passOn.projects[0] = new Array();
                                        }

                                        for (let i = 1; i < 6; i++) {
                                            passOn.projects[i] = new Array();
                                        }
                                        break;
                                    case 6:
                                        passOn["projects"] = rows;
                                        if (passOn.tempTableName.length) {

                                            // Do sorting by sindex here on each row's sindex in DESCENDING order.
                                            for (let i = 0; i < 6; i++) {

                                                if (passOn.projects[i].length) {

                                                    passOn.projects[i].sort(
                                                        function(a,b) {
                                                            if (a.sindex > b.sindex)
                                                                return -1;
                                                            if (a.sindex < b.sindex)
                                                                return 1;
                                                            return 0;
                                                        }
                                                    )
                                                }
                                            }
                                        }
                                        break;
                                    default:
                                        return cb(new Error('Unknown failure of search query.'), null);
                                }

                                return cb(null, passOn);
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
                    // In (4c), (4d) and (4e) we check if Products, Online Classes or Classes are amongst the user's own projects in [1]. (This is synchronous.)
                    function(passOn, cb) {

                        if (req.body.userAllowedToCreateEditPurchProjs === "0") {
                            // A normal user, retrieving classes, gets only active ones (already handled in the query) and
                            // only only those starting within 3 months. They also must be within 35 miles of req.body.nearZip.
                            // Any non-qualified are removed from passOn.projects[4].

                            let mntNow = moment();

                            async.eachSeries(passOn.projects[4],
                                function(projectIth, cb) {

                                    projectIth.remove = false;
                                    let strClass1Date = JSON.parse(projectIth.schedule)[0].date;
                                    // This date must exist or the class could not have been made active.
                                    // As must the zipcode used below.

                                    let mntClass1Date = moment(strClass1Date, "YYYY-MM-DD");
                                    if (mntClass1Date.isBefore(mntNow) || mntClass1Date.isAfter(mntNow.clone().add(3, "months"))) {
                                        
                                        // Class started in the past or starts more than 3 months from now.
                                        projectIth.remove = true;
                                        return cb(null);

                                    } else {

                                        // Class is not disqualified due to start date. We'll do the zipcode distance check.
                                        // https://www.zipcodeapi.com/rest/<zipcodekey>/distance.<format>/<zip_code1>/<zip_code2>/<units>.
                                        let url = "https://www.zipcodeapi.com/rest/" + app.get("zipcodekey") + "/distance.json/" + projectIth.zip + "/" + passOn.zipcode + "/mile";
                                        let xhr = new XMLHttpRequest();
                                        xhr.open("GET", url, true);     // true means async (which is default)
                                        xhr.onload = function (e) {

                                            if (xhr.status === 200) {
                                                // A good result to test.
                                                console.log("Got xhr.responseText: " + xhr.responseText);
                                                let distanceJSON = JSON.parse(xhr.responseText);
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
                                    for (let i = passOn.projects[4].length - 1; i >= 0; i--) {
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

                        if (req.body.userAllowedToCreateEditPurchProjs === "0") {
                            // A normal user, retrieving online classes, gets only active ones (already handled in the query) and
                            // only only those starting within 3 months.
                            // Any non-qualified are removed from passOn.projects[5].

                            let mntNow = moment();

                            async.eachSeries(passOn.projects[5],
                                function(projectIth, cb) {

                                    projectIth.remove = false;
                                    let strClass1Date = JSON.parse(projectIth.schedule)[0].date;
                                    // This date must exist or the class could not have been made active.
                                    // As must the zipcode used below.

                                    let mntClass1Date = moment(strClass1Date, "YYYY-MM-DD");
                                    if (mntClass1Date.isBefore(mntNow) || mntClass1Date.isAfter(mntNow.clone().add(3, "months"))) {
                                        
                                        // Class started in the past or starts more than 3 months from now.
                                        projectIth.remove = true;
                                    }
                                    return cb(null);
                                },
                                function(err) {

                                    // err is always null.
                                    for (let i = passOn.projects[5].length - 1; i >= 0; i--) {
                                        if (passOn.projects[5][i].remove) {
                                            passOn.projects[5].splice(i, 1);
                                        }
                                    }
                                    return cb(null, passOn);
                                }
                            );
                        } else { return cb(null, passOn); }
                    },
                    // (4c)
                    function (passOn, cb) {

                        if (req.body.userAllowedToCreateEditPurchProjs === "0") {
                            // Loop through products left in passOn.projects[3] and add property alreadyBought by comparing to all projects in passOn.projects[1].

                            for (let i = 0; i < passOn.projects[3].length; i++) {

                                let pIth = passOn.projects[3][i];
                                pIth.alreadyBought = false;

                                for (let j = 0; j < passOn.projects[1].length; j++) {

                                    let pJth = passOn.projects[1][j];
                                    if (pJth.baseProjectId === pIth.projectId) {

                                        pIth.alreadyBought = true;
                                        break;
                                    }
                                }
                            }

                            return cb(null, passOn);

                        } else { return cb(null, passOn); }
                    },
                    // (4d)
                    function (passOn, cb) {

                        if (req.body.userAllowedToCreateEditPurchProjs === "0") {
                            // Loop through online classes left in passOn.projects[5] and add property alreadyEnrolled by comparing to all projects in passOn.projects[1].

                            for (let i = 0; i < passOn.projects[5].length; i++) {

                                let pIth = passOn.projects[5][i];
                                pIth.alreadyEnrolled = false;

                                for (let j = 0; j < passOn.projects[1].length; j++) {

                                    let pJth = passOn.projects[1][j];
                                    if (pJth.baseProjectId === pIth.projectId) {

                                        pIth.alreadyEnrolled = true;
                                        break;
                                    }
                                }
                            }

                            return cb(null, passOn);

                        } else { return cb(null, passOn); }
                    },
                    // (4e)
                    function (passOn, cb) {

                        if (req.body.userAllowedToCreateEditPurchProjs === "0") {
                            // Loop through classes left in passOn.projects[2] and add property alreadyEnrolled by comparing to all projects in passOn.projects[1].

                            for (let i = 0; i < passOn.projects[4].length; i++) {

                                let pIth = passOn.projects[4][i];
                                pIth.alreadyEnrolled = false;

                                for (let j = 0; j < passOn.projects[1].length; j++) {

                                    let pJth = passOn.projects[1][j];
                                    if (pJth.baseProjectId === pIth.projectId) {

                                        pIth.alreadyEnrolled = true;
                                        break;
                                    }
                                }
                            }

                            return cb(null, passOn);

                        } else { return cb(null, passOn); }
                    },
                    // (5)
                    function (passOn, cb) {

                        async.eachSeries(passOn.projects[4],
                            function (projectIth, cb) {

                                let strQuery = "select count(*) as cnt from " + self.dbname + "projects where baseProjectId=" + projectIth.projectId + " and id<>" + projectIth.projectId + ";";

                                sql.execute(strQuery,
                                    function (rows) {

                                        if (rows.length === 0) {
                                            projectIth.numEnrollees = 0;
                                        } else {
                                            projectIth.numEnrollees = rows[0].cnt;
                                        }

                                        return cb(null, passOn);
                                        // },
                                        // function(strError) { return cb(new Error(strError)); }
                                        // );
                                    },
                                    function (err) {
                                        return cb(err, passOn);
                                    }
                                );
                            },
                            function(err) { return cb(err, passOn); }
                        );
                    },
                    // (6)
                    function(passOn, cb) {

                        if (!passOn.tempTableName.length) { return cb(null, passOn); }

                        // If this drop of the temp table fails, we ignore it. MySql will clean it up eventually.
                        let strQuery = "drop table " + passOn.tempTableName + ";";
                        sql.execute(strQuery,
                            function(rows) {
                                return cb(null, passOn);
                            },
                            function(err) { return cb(null, passOn); }
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

                    sql.queryWithCxn(connection,
                        "select count(*) as cnt from " + self.dbname + "waitlist where projectId=" + req.body.projectId + " and userId=" + req.user.userId + " and userName=" + connection.escape(req.user.userName) + ";",
                        function (err, rows) {

                            if (err) {

                                return res.json({
                                    success: false,
                                    message: 'Could not check for prior existance on the waitlist: ' + err.message
                                });
                            }

                            if (rows.length === 0) {

                                return res.json({
                                    success: false,
                                    message: 'Could not check for prior existance on the waitlist.'
                                });
                            }

                            if (rows[0].cnt) {

                                // Already on waitlist. Make like it worked fine.
                                return res.json({
                                    success: true
                                });
                            }

                            // We're good to insert.
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
                }
            );
        } catch(e) {

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

    var m_createGuid = function() {

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
    }
};

