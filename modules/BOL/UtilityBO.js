//////////////////////////////////
// UtilityBO.js module
//
//////////////////////////////////
fs = require("fs");
jade = require("jade");

module.exports = function UtilityBO(app, sql, logger) {

    var self = this;                // Über closure.

    // Private fields
    var m_resourceTypes = ['0-unused'];

    self.dbname = app.get("dbname");
    
    // Fill m_resourceTypes from database.
    try {

        var exceptionRet = sql.execute("select * from " + self.dbname + "resourceTypes order by id asc",
            function(rows) {

                if (rows.length === 0) {

                    throw new Error('Failed to read resource types from database. Cannot proceed.');

                } else {

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
    self.routeSearch = function (req, res) {

        try {

            console.log("Entered UtilityBO/routeSearch with req.body = " + JSON.stringify(req.body));
            // req.body.tags
            // req.body.userId
            // req.body.userName
            // req.body.resourceTypeId  1-5
            // req.body.onlyCreatedByUser   0 or 1

            // Add resource type description to the tags the user (may have) entered.
            var tags = req.body.tags + " " + m_resourceTypes[req.body.resourceTypeId];

            // If we're retrieving only items created by user, add userName to tags.
            if (req.body.onlyCreatedByUser === "1") {

                tags += " " + req.body.userName;
            }
            console.log("tags massaged='" + tags + "'");

            // Turn tags into string with commas between tags and tags surrounded by single quotes.
            var ccArray = req.body.tags.match(/[A-Za-z0-9_\-]+/g);

            var ccString = '';
            for (var i = 0; i < ccArray.length; i++) {

                if (i > 0) {

                    ccString = ccString + ',';
                }

                ccString = ccString + "'" + ccArray[i] + "'";
            }

            var sqlString = "select id from " + self.dbname + "tags where description in (" + ccString + ");";
            console.log('Query to get tag ids: ' + sqlString);

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

                        // We can proceed since all tags exist and their id's are in arrayRows
                        var idString = '';
                        for (var i = 0; i < arrayRows.length; i++) {

                            if (i > 0) {

                                idString = idString + ',';
                            }

                            idString = idString + arrayRows[i].id.toString();
                        }

                        // For non-project retrievals (resourceTypeId = 1, 2, 5) there's only one case.
                        // By including userName in tags if req.body.onlyCreatedByUser, we automatically make the "only mine" and "choose all matching" work.
                        // But to do so, we need something like: (createdByUserId=req.body.userId or public=1) along with the tag matching. Note: public=1 works even if req.body.onlyCreatedByUser, because of the userName match requirement.

                        if (req.body.resourceTypeId !== "3") {  // Non-projects.

                            sqlString = "select r.* from " + self.dbname + "resources r where (r.createdByUserId=" + req.body.userId + " or r.public=1) and id in (select distinct resourceId from " + self.dbname + "resources_tags rt where " + arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "resources_tags rt2 where rt2.resourceId=rt.resourceId and tagId in (" + idString + ")));";

                        } else {    // Projects -- a totally different query.

                            // Totally different retrieval for projects.
                            sqlString = "select distinct p.* from " + self.dbname + "resources r inner join " + self.dbname + "projects p on r.optnlFK=p.id where (r.createdByUserId=" + req.body.userId + " or r.public=1) and r.id in (select distinct resourceId from " + self.dbname + "resources_tags rt where " + arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "resources_tags rt2 where rt2.resourceId=rt.resourceId and tagId in (" + idString + "))) order by p.name asc;";

                            // Need to add union if templates are required.
                        }

                        console.log(' ');
                        console.log('Query: ' + sqlString);
                        console.log(' ');
                        exceptionRet = sql.execute(sqlString,
                            function(rows){
                                res.json({
                                    success:true,
                                    arrayRows: rows
                                });
                            },
                            function(err){
                                res.json({
                                    success:false,
                                    message: err
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

    // self.routeFetchCompiledJadeFile = function (req, res) {

    //     try {

    //         var jadeFilename = "public/adminzone/source/" + req.body.jadeFilename + ".jade";
    //         m_fsInstance.readFile(jadeFilename, {encoding: "utf-8"}, function (err, jadeFile) {

    //             if (err) {

    //                 res.json({
                        
    //                     success: false,
    //                     message: err
    //                 });
    //             }

    //             var html = "";

    //             try {

    //                 var fn = m_jadeInstance.compile(jadeFile,
    //                     {
    //                         basedir: __dirname,
    //                         pretty: true
    //                     });                
    //                 html = fn({});

    //             } catch (f) {

    //                 console.log("Error on jade.compile: " + f.message);
    //             }

    //             res.json({

    //                 success: true,
    //                 html: html
    //             });
    //         });

    //     } catch (e) {

    //          // Return success: false
    //         res.json({
                
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

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
    // var m_sqlInstance = sql;
    // var m_fsInstance = fs;
    // var m_jadeInstance = jade;
};

