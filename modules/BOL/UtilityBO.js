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
    self.routeSearch = function (req, res) {

        // This is a search for something based on tags. There are 6 kinds of things whose descriptions have been loaded into m_resourceTypes above.
        // ResourceTypeIds 1 and 2 (image and sound) use one type of query while the others (3=project, 5=type, 7=method) use a different query. This is because images and sounds have no
        // FK table relationship, but the others do.
        // One other thing: resourceTypeId=5 (type) needs to exclude all types where isApp===true.

        try {

            console.log("Entered UtilityBO/routeSearch with req.body = " + JSON.stringify(req.body));
            // req.body.tags
            // req.body.userId
            // req.body.userName
            // req.body.resourceTypeId  '1'-'7'
            // req.body.onlyCreatedByUser   '0' or '1'

            var iResourceTypeId = parseInt(req.body.resourceTypeId,10);
            var resourceTypeDescr = m_resourceTypes[iResourceTypeId];

            // Add resource type description to the tags the user (may have) entered.
            var tags = req.body.tags + " " + resourceTypeDescr;

            // If we're retrieving only items created by user, add userName to tags.
            if (req.body.onlyCreatedByUser === "1") {

                tags += " " + req.body.userName;
            }
            console.log("tags massaged='" + tags + "'");

            // Turn tags into string with commas between tags and tags surrounded by single quotes.
            var ccArray = tags.match(/([\w\-]+)/g);

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

                        // For non-FK retrievals (resourceTypeId = 1, 2) there's only one case.
                        // By including userName in tags if req.body.onlyCreatedByUser, we automatically make the "only mine" and "choose all matching" work.
                        // But to do so, we need something like: (createdByUserId=req.body.userId or public=1) along with the tag matching. Note: public=1 works all the time, because of the userName match requirement.

                        if (req.body.resourceTypeId < "3") {  // Non-FKs; e.g., image or sound

                            sqlString = "select r.* from " + self.dbname + "resources r where (r.createdByUserId=" + req.body.userId + " or r.public=1) and id in (select distinct resourceId from " + self.dbname + "resources_tags rt where " + arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "resources_tags rt2 where rt2.resourceId=rt.resourceId and tagId in (" + idString + "))) order by r.name asc;";

                        } else if (req.body.resourceTypeId !== "5") {    // Project, Method -- a different query.

                            sqlString = "select distinct p.*," + req.body.resourceTypeId + " as resourceTypeId from " + self.dbname + "resources r inner join " + self.dbname + resourceTypeDescr + "s p on r.optnlFK=p.id where (r.createdByUserId=" + req.body.userId + " or r.public=1) and r.id in (select distinct resourceId from " + self.dbname + "resources_tags rt where " + arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "resources_tags rt2 where rt2.resourceId=rt.resourceId and tagId in (" + idString + "))) order by p.name asc;";
                        
                        } else { // Type ('5')

                            sqlString = "select distinct p.*,5 as resourceTypeId from " + self.dbname + "resources r inner join " + self.dbname + "types p on r.optnlFK=p.id where p.isApp = 0 and (r.createdByUserId=" + req.body.userId + " or r.public=1) and r.id in (select distinct resourceId from " + self.dbname + "resources_tags rt where " + arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "resources_tags rt2 where rt2.resourceId=rt.resourceId and tagId in (" + idString + "))) order by p.name asc;";
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

