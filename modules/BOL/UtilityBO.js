//////////////////////////////////
// UtilityBO.js module
//
//////////////////////////////////
fs = require("fs");
jade = require("jade");

module.exports = function UtilityBO(app, sql, logger) {

    var self = this;                // Über closure.

    self.dbname = app.get("dbname");
    
    ////////////////////////////////////
    // Public methods
    
    // Router handler functions.
    // self.routeSearch = function (req, res) {

    //     try {

    //         console.log("Entered UtilityBO/routeSearch with req.body = " + JSON.stringify(req.body));
    //         // req.body.tags
    //         // req.body.userId
    //         // req.body.userGroupId

    //         var ccArray = req.body.tags.match(/[A-Za-z0-9_\-]+/g); // guaranteed to have some tags

    //         var ccString = '';
    //         for (var i = 0; i < ccArray.length; i++) {

    //             if (i > 0) {

    //                 ccString = ccString + ',';
    //             }

    //             ccString = ccString + "'" + ccArray[i] + "'";
    //         }

    //         var sqlString = "select id from " + self.dbname + "tags where description in (" + ccString + ");";
    //         console.log(sqlString);
    //         // We have to get the same number of rows back from the query as ccArray.length.

    //         var exceptionRet = sql.execute(sqlString,
    //             function (arrayRows) {
                
    //                 if (arrayRows.length !== ccArray.length) {

    //                     // Success as far as the function is concerned but no result array
    //                     res.json({
    //                         success:true,
    //                         arrayRows: new Array()
    //                     });
    //                 } else {

    //                     // We can proceed since all tags exist and their id's are in arrayRows
    //                     var idString = '';
    //                     for (var i = 0; i < arrayRows.length; i++) {

    //                         if (i > 0) {

    //                             idString = idString + ',';
    //                         }
    //                         idString = idString + arrayRows[i].id.toString();
    //                     }

    //                     var strFirstCondition;
    //                     if (req.body.userGroupId === '1' || req.body.userGroupId === '2' || req.body.userGroupId === '3') {

    //                         strFirstCondition = '';

    //                     } else {

    //                         strFirstCondition = "(createdByUserId=" + req.body.userId + " or public=1) and ";
    //                     }

    //                     sqlString = "select * from " + self.dbname + "resources where " + strFirstCondition + "id in (select distinct resourceId from " + self.dbname + "resources_tags rt where " + arrayRows.length.toString() + "=(select count(*) from " + self.dbname + "resources_tags rt2 where rt2.resourceId=rt.resourceId and tagId in (" + idString + ")));";
    //                     exceptionRet = sql.execute(sqlString,
    //                         function(rows){
    //                             res.json({
    //                                 success:true,
    //                                 arrayRows: rows
    //                             });
    //                         },
    //                         function(err){
    //                             res.json({
    //                                 success:false,
    //                                 message: err
    //                             });
    //                         });
    //                 }
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

    self.routeForgotPW = function (req, res, next) {
    
        // req.body = {
        //                  "userName":"Ken"
        //    }
        
        try {
        
            console.log("Entered UtilityBO/routeForgotPW with req.body = " + JSON.stringify(req.body));

            var exceptionRet = logger.logItem(1, {"userName":req.body.userName});

            if (exceptionRet) {

                res.json({
                    success: false,
                    message: exceptionRet.message
                });
            } else {

                res.json({
                    
                    success: true
                });
            }
        } catch (e) {
        
             // Return success: false
            res.json({
                
                success: false,
                message: e.message
            });
        }
    };

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

