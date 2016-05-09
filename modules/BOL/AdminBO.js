//////////////////////////////////
// AdminBO.js module
//
//////////////////////////////////
var nodemailer = require("nodemailer");
module.exports = function AdminBO(app, sql, logger, mailWrapper) {

    var self = this; // Über closure.

    self.dbname = app.get("dbname");

    // Create reusable transport method (opens pool of SMTP connections).
    //
    // THE FOLLOWING HAS CHANGED WITH nodemailer@2.3.0. SEE OTHER USERS FOR INFO.
    //
    // self.smtpTransport = nodemailer.createTransport("SMTP", {
    
    //     service: "Gmail",
    //     auth: {
        
    //         user: "techgroms@gmail.com",
    //         pass: "Albatross!1"
    //     }
    // });

    ////////////////////////////////////
    // Public methods

    // Router handler functions.
    // self.routeSaveProjectToAnotherUser = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeSaveProjectToAnotherUser with req.body=" + JSON.stringify(req.body));
    //         // req.body.projectId
    //         // req.body.toUserId
    //         // req.body.projName

    //         var sqlString = "insert " + self.dbname + "projects (name,userId,detail,template,blocklyschema) select '" + req.body.projName + "'," + req.body.toUserId + ",detail,0,blocklyschema from " + self.dbname + "projects where id=" + req.body.projectId + ";";
    //         console.log(sqlString);
    //         var exceptionRet = sql.execute(sqlString,
    //             function(rows){

    //                 res.json({
    //                     success: true
    //                 });
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );

    //         if (exceptionRet) {

    //             res.json({
    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch(e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeFetchAllStudentsAndClasses = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeFetchAllStudentsAndClasses");

    //         var sqlString = "select ch.name, pa.lastname, ch.userId, count(ch.userId) from " + self.dbname + "students st inner join " + self.dbname + "children ch on ch.id = st.childId inner join " + self.dbname + "parents pa on ch.parentId = pa.id group by ch.userId having count(ch.userId)>=1 order by pa.lastname asc;";
    //         var exceptionRet = sql.execute(sqlString,
    //             function(rows){

    //                 res.json({
    //                     success: true,
    //                     arrayRows: rows
    //                 });
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );

    //         if (exceptionRet) {

    //             res.json({
    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch(e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeSwitchChildsClassForStudentMaint = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeSwitchChildsClassForStudentMaint with req.body=" + JSON.stringify(req.body));
    //         // req.body.childId
    //         // req.body.oldClassId
    //         // req.body.newClassId

    //         // First update enrollments. If that works, update students below.
    //         var sqlString = "update " + self.dbname + "enrollments set classId=" + req.body.newClassId + " where childId=" + req.body.childId + " and classId=" + req.body.oldClassId + ";";
    //         var exceptionRet = sql.execute(sqlString,
    //             function(rows){

    //                 if (rows.length === 0){

    //                     res.json({
    //                         success: false,
    //                         message: "Failed to switch child."
    //                     });
    //                 } else {

    //                     if (rows[0].affectedRows === 1) {

    //                         var sqlString = "update " + self.dbname + "students set classId=" + req.body.newClassId + " where childId=" + req.body.childId + " and classId=" + req.body.oldClassId + ";";
    //                         exceptionRet = sql.execute(sqlString,
    //                             function(rows){

    //                                 if (rows.length === 0) {

    //                                     res.json({
    //                                         success: false,
    //                                         message: "The change in enrollments worked, but got unknown error when updating students; FIX MANUALLY." 
    //                                     });
    //                                 } else {

    //                                     if (rows[0].affectedRows === 1) {

    //                                         res.json({success:true});
    //                                     } else {

    //                                         res.json({
    //                                             success: false,
    //                                             message: "The change in enrollments worked, but got unknown error when updating students; FIX MANUALLY." 
    //                                         });
    //                                     }
    //                                 }
    //                             },
    //                             function(strError){

    //                                 res.json({
    //                                     success: false,
    //                                     message: "The change in enrollments worked, but got this error when updating students: " + strError + "; FIX MANUALLY."
    //                                 });
    //                             });
    //                         if (exceptionRet) {

    //                             res.json({
    //                                 success: false,
    //                                 message: "The change in enrollments worked, but got this error when updating students: " + exceptionRet.message + "; FIX MANUALLY"
    //                             });
    //                         }
    //                     } else {

    //                         res.json({
    //                             success: false,
    //                             message: "The change in enrollments worked, but got unknown error when updating students; FIX MANUALLY." 
    //                         });
    //                     }
    //                 }
    //             },
    //             function(strError){
                    
    //                 res.json({
    //                     success: false,
    //                     message: "The change in enrollments worked, but got this error when updating students: " + strError + "; FIX MANUALLY."
    //                 });
    //             });
    //         if (exceptionRet) {

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

    // self.routeUpdateProjectSchema = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeUpdateProjectSchema with req.body=" + JSON.stringify(req.body));
    //         // req.body.projectId
    //         // req.body.schema

    //         var modifiedSchema = "NULL";
    //         if (!m_isEmpty(req.body.schema)) {

    //             modifiedSchema = "'" + JSON.stringify(req.body.schema) + "'";
    //         }

    //         var sqlString = "update " + self.dbname + "projects set blocklyschema=" + modifiedSchema + " where id=" + req.body.projectId.toString() + ";";
    //         var exceptionRet = sql.execute(sqlString,
    //             function(rows){

    //                 if (rows.length === 0){

    //                     res.json({
    //                         success: false,
    //                         message: "Failed to delete projects."
    //                     });
    //                 } else {

    //                     res.json({
    //                         success: true
    //                     });
    //                 }
    //             },
    //             function(strError){
                    
    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             });
    //         if (exceptionRet) {

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

    // self.routeDeleteProjects = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeDeleteProjects with req.body=" + JSON.stringify(req.body));
    //         // req.body.projectIds

    //         var exceptionRet = sql.execute("delete from " + self.dbname + "projects where id in (" + req.body.projectIds + ");",
    //             function(rows) {

    //                 if (rows.length === 0){

    //                     res.json({
    //                         success: false,
    //                         message: "Failed to delete project(s)."
    //                     });
    //                 } else {

    //                     res.json({
    //                         success: true
    //                     });
    //                 }
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );
    //         if (exceptionRet) {

    //             res.json({
    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch(e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeSetSchemasToNull = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeSetSchemasToNull with req.body=" + JSON.stringify(req.body));
    //         // req.body.projectIds

    //         var exceptionRet = sql.execute("update " + self.dbname + "projects set blocklyschema = NULL where id in (" + req.body.projectIds + ");",
    //             function(rows) {

    //                 if (rows.length === 0){

    //                     res.json({
    //                         success: false,
    //                         message: "Failed to update projects."
    //                     });
    //                 } else {

    //                     res.json({
    //                         success: true
    //                     });
    //                 }
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );
    //         if (exceptionRet) {

    //             res.json({
    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch(e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // var m_functionCheckRes = function(strIdsWorked, strIdsFailed, res) {

    //     if (strIdsWorked.length > 0 && strIdsFailed.length === 0) {

    //         res.json({success:true});
        
    //     } else if (strIdsFailed.length > 0 && strIdsWorked.length === 0) {

    //         res.json({
    //             success: false,
    //             message: "All updates failed"
    //         });
    //     } else {

    //         res.json({
    //             success:false,
    //             message: "These ids worked: " + strIdsWorked.substring(1) + "; these ids failed to update: " + strIdsFailed.substring(1)
    //         });
    //     }
    // }

    // self.routeSetToMinimalSchemas = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeSetToMinimalSchemas with req.body=" + JSON.stringify(req.body));
    //         // req.body.arr = arrChecked = [{projectId:id, blocklyschema: "xxx"},...]

    //         var exceptionRet = null;
    //         var strIdsWorked = '';
    //         var strIdsFailed = '';
    //         var counter = req.body.arr.length;
    //         for (var i = 0; i < req.body.arr.length; i++) {

    //             var arrIth = req.body.arr[i];
    //             var modifiedSchema = "NULL";
    //             if (!m_isEmpty(arrIth.blocklyschema)) {

    //                 modifiedSchema = "'" + JSON.stringify(arrIth.blocklyschema) + "'";
    //             }
    //             var sqlString = "update " + self.dbname + "projects set blocklyschema=" + modifiedSchema + " where id=" + arrIth.projectId + ";";
    //             exceptionRet = sql.execute(sqlString,
    //                 function(rows) {

    //                     if (rows.length === 0){

    //                         strIdsFailed = strIdsFailed + ',' + arrIth.projectId.toString();

    //                     } else {

    //                         strIdsWorked = strIdsWorked + ',' + arrIth.projectId.toString();
    //                     }
    //                     if (--counter === 0) {

    //                         m_functionCheckRes(strIdsWorked, strIdsFailed, res);
    //                     }
    //                 },
    //                 function(strError) {

    //                     strIdsFailed = strIdsFailed + ',' + arrIth.projectId.toString();
    //                     if (--counter === 0) {
                            
    //                         m_functionCheckRes(strIdsWorked, strIdsFailed, res);
    //                     }
    //                 }
    //             );

    //             if (exceptionRet) {

    //                 strIdsFailed = strIdsFailed + ',' + arrIth.projectId.toString();
    //             }
    //         }
    //     } catch(e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeFetchAllOfUsersProjects = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeFetchAllOfUsersProjects with req.body=" + JSON.stringify(req.body) + " req.user=" + JSON.stringify(req.user));
    //         // req.user.userId

    //         // Fetch all of userId's projects projects.

    //         var exceptionRet = sql.execute("select * from " + self.dbname + "projects where userId in (" + req.user.userId + ") order by name asc;",
    //             function(rows){

    //                 res.json({
    //                     success: true,
    //                     arrayRows: rows
    //                 });
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );

    //         if (exceptionRet) {

    //             res.json({
    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch(e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeFetchAllOfUsersPlusAdminsProjects = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeFetchAllOfUsersPlusAdminsProjects with req.body=" + JSON.stringify(req.body));
    //         // req.body.userId
    //         // req.body.adminUserId

    //         var exceptionRet = sql.execute("select p.id, p.name, p.template, u.name as uname from " + self.dbname + "projects p inner join " + self.dbname + "user u on p.userId = u.id where userId in (" + req.body.userId + "," + req.body.adminUserId + ") order by uname asc, p.template desc, p.name asc;",
    //             function(rows){

    //                 res.json({
    //                     success: true,
    //                     arrayRows: rows
    //                 });
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );

    //         if (exceptionRet) {

    //             res.json({
    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch(e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeDeleteRoute = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeDeleteRoute");
    //         // req.body.routeId

    //         var exceptionRet = sql.execute("delete from " + self.dbname + "routes where id=" + req.body.routeId.toString() + ";",
    //             function(rows){

    //                 exceptionRet = sql.execute("select * from " + self.dbname + "routes;",
    //                     function(rows){

    //                         res.json({
    //                             success: true,
    //                             arrayRows: rows
    //                         });
    //                     },
    //                     function(strError) {

    //                         res.json({
    //                             success: false,
    //                             message: "Delete worked, but refresh got " + strError
    //                         });
    //                     }
    //                 );

    //                 if (exceptionRet) {

    //                     res.json({
    //                         success: false,
    //                         message: "Delete worked, but refresh got " + exceptionRet.message
    //                     });
    //                 }
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );

    //         if (exceptionRet) {

    //             res.json({
    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch(e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeAddOrUpdateRoute = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeAddOrUpdateRoute with " + JSON.stringify(req.body));
    //         // req.body.route -- if req.body.id === -1, then add; else update

    //         var sqlcmd = "";
    //         var sqlBody = "set path = '" + req.body.path + "', " + "moduleName = '" + req.body.moduleName + "', " + "route = '" + req.body.route + "', " + "verb = '" + req.body.verb + "', " + "method = '" + req.body.method + "', " + "inuse = " + req.body.inuse + " ";
    //         if (req.body.id < 0)
    //             sqlCmd = "insert " + self.dbname + "routes " + sqlBody + ";";
    //         else
    //             sqlCmd = "update " + self.dbname + "routes " + sqlBody + " where id=" + req.body.id + ";";
    //         var exceptionRet = sql.execute(sqlCmd,
    //             function(result) {

    //                 // The INSERT or UPDATE worked.
    //                 // Retrieve the list again.
    //                 try {

    //                     exceptionRet = sql.execute("select * from " + self.dbname + "routes;",
    //                         function(rows) {
    //                             res.json({
    //                                 success: true,
    //                                 arrayRows: rows
    //                             });
    //                         },
    //                         function(strError) {

    //                             res.json({
    //                                 success: false,
    //                                 message: strError
    //                             });
    //                         }
    //                     );
    //                     if (exceptionRet) {

    //                         res.json({
    //                             success: false,
    //                             message: exceptionRet.message
    //                         });
    //                     }
    //                 } catch (e) {

    //                     res.json({
    //                         success: false,
    //                         message: e.message
    //                     });
    //                 }

    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );

    //         if (exceptionRet) {

    //             res.json({
    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch(e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeGetRoutes = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetRoutes");

    //         var exceptionRet = sql.execute("select * from " + self.dbname + "routes;",
    //             function(rows){

    //                 if (rows.length === 0){

    //                     res.json({
    //                         success: false,
    //                         message: "Failed to retrieve routes."
    //                     });
    //                 } else {

    //                     res.json({
    //                         success: true,
    //                         arrayRows: rows
    //                     });
    //                 }
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );

    //         if (exceptionRet) {

    //             res.json({
    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch(e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeMarkLogitemHandled = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeMarkLogitemHandled with " + JSON.stringify(req.body));
    //         // req.body.logitemId
    //         // rewq.body.userId

    //         var exceptionRet = sql.execute("update " + self.dbname + "logitems set processed=utc_timestamp(), processedbyUserId=" + req.body.userId + " where id=" + req.body.logitemId + ";",
    //             function(rows){

    //                 res.json({
    //                     success:true
    //                 });
    //             },
    //             function(strError){

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             });
    //     } catch(e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeGetLogitems = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetLogitems with " + JSON.stringify(req.body));

    //         logger.getLogItems(req.body.nums, true, req.body.datesWhere, function(rows){

    //             res.json({
    //                 success: true,
    //                 arrayRows: rows
    //             });
    //         });
    //     } catch (e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeGetLogtypes = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetLogtypes");

    //         var exceptionRet = sql.execute("select * from " + self.dbname + "logtypes;",
    //             function(rows) {

    //                 if (rows.length === 0){

    //                     res.json({
    //                         success: false,
    //                         message: "Failed to retrieve logtypes."
    //                     });
    //                 } else {

    //                     res.json({
    //                         success: true,
    //                         arrayRows: rows
    //                     });
    //                 }
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             });
    //         if (exceptionRet) {

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

    // self.routeGetCurrPWForStudentMaint = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetCurrPWForStudentMaint: " + JSON.stringify(req.body));

    //         var sqlStatement = "select password from " + self.dbname + "user INNER JOIN " + self.dbname + "children ON children.userId = user.id INNER JOIN " + self.dbname + "parents ON children.parentId = parents.id where children.name='" + req.body.childName + "' AND parents.name = '" + req.body.parentName +"';";
    //         var exceptionRet = sql.execute(sqlStatement,
    //             function(rows) {

    //                 if (rows.length === 0) {

    //                     res.json({
    //                         success: false,
    //                         message: "Child not found in users table."
    //                     })
    //                 }

    //                 res.json({
    //                     success: true,
    //                     arrayRows: rows
    //                 })
    //             },
    //             function(strError) {
    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 })
    //             });
    //         if (exceptionRet != null) {

    //             // Failure callback
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

    // self.routeChangePWForStudentMaint = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeChangePWForStudentMaint: " + JSON.stringify(req.body));

    //         var exceptionRet = sql.execute("update " + self.dbname + "user set password='" + req.body.newPW + "' where name='" + req.body.childName + "';",
    //             function(rows) {

    //                 if (rows.length === 0) {

    //                     res.json({
    //                         success: false,
    //                         message: "Child not found in users table."
    //                     })
    //                 }

    //                 res.json({
    //                     success: true,
    //                     arrayRows: rows
    //                 })
    //             },
    //             function(strError) {
    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 })
    //             });
    //         if (exceptionRet != null) {

    //             // Failure callback
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

    // self.routeRemoveStudentFromClassForStudentMaint = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeRemoveStudentFromClassForStudentMaint: " + JSON.stringify(req.body)); // childName, className, parentName

    //         // Will determine child's id, class id.
    //         // Then delete record from students.
    //         // Then will update status in enrollments to 'removed'.
    //         var exceptionRet = sql.execute("select children.id as childId from " + self.dbname + "children inner join " + self.dbname + "parents on parents.id = children.parentId where children.name='" + req.body.childName + "' and parents.name='" + req.body.parentName + "'; "
    //             + "select id as classId from classes where name='" + req.body.className + "';",
    //             function(rows){

    //                 if (rows.length !== 2) {

    //                     res.json({
    //                         success: false,
    //                         message: "Failed in child or class name lookup"
    //                     });
    //                 } else {

    //                     var childId = rows[0].childId.toString();
    //                     var classId = rows[1].classId.toString();

    //                     exceptionRet = sql.execute("delete from " + self.dbname + "students where childId=" + childId + " and classId=" + classId + "; update enrollments set status='removed' where childId=" + childId + " and classId=" + classId + ";",
    //                         function(rows) {
    //                             if (rows.length !== 2) {

    //                                 res.json({
    //                                     success: false,
    //                                     message: "Failed to delete either from students or from enrollments or both. Check the database."
    //                                 });
    //                             } else {

    //                                 res.json({
    //                                     success: true
    //                                 });
    //                             }
    //                         },
    //                         function(strError){
    //                             res.json({
    //                                 success: false,
    //                                 message: strError
    //                             });
    //                         });
    //                 }
    //             },
    //             function(strError){

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );

    //         if (exceptionRet) {

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

    // self.routeSendOpeningEmailForStudentMaint = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeSendOpeningEmailForStudentMaint: " + JSON.stringify(req.body));   // childName, className, parentName
    //         // Use parentName to get email.
    //         // Set up and send the e-mail.
    //         var exceptionRet = sql.execute("select email from " + self.dbname + "parents where name='" + req.body.parentName + "';",
    //             function(rows){

    //                 if (rows.length !== 1) {

    //                     res.json({
    //                         success: false,
    //                         message: "Failed to retrieve parent's e-mail address."
    //                     });
    //                 } else {

    //                     var mailOptions = {
                 
    //                         from: "TechGroms <techgroms@gmail.com>", // sender address
    //                         to: rows[0].email, // list of receivers
    //                         subject: "TechGroms Class Opening", // Subject line
    //                         text: "Hi.\r\n\r\n    We thought you'd be interested that there is an opening for " + req.body.childName + " TechGroms class " +
    //                             req.body.className + 
    //                             ".\r\n\r\n    If you would like to enroll again, please visit www." + self.dbname + "com and click Enroll Now" +
    //                             ".\r\n\r\n    Thank you for your interest in TechGroms!\r\n\r\n    Warm regards, The Grom Team" // plaintext body
    //                     };

    //                     exceptionRet = self.actuallySendMail(mailOptions, req, res);
    //                     if (exceptionRet) {

    //                         res.json({
    //                             success: false,
    //                             message: exceptionRet.message
    //                         });
    //                     } 
    //                 }
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }    
    //         );
    //     } catch (e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeSendNewEmailForStudentMaint = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeSendNewEmailForStudentMaint: " + JSON.stringify(req.body));   // childName, parentName

    //         // Get parent's email.
    //         // Set up and send the e-mail message.
    //         var exceptionRet = sql.execute("select email from " + self.dbname + "parents where name='" + req.body.parentName + "';",
    //             function(rows){

    //                 if (rows.length !== 1) {

    //                     res.json({
    //                         success: false,
    //                         message: "Failed to retrieve parent's e-mail address."
    //                     });
    //                 } else {

    //                     var mailOptions = {
                 
    //                         from: "TechGroms <techgroms@gmail.com>", // sender address
    //                         to: rows[0].email, // list of receivers
    //                         subject: "TechGroms New Class Announcement", // Subject line
    //                         text: "Hi.\r\n\r\n    We thought you'd be interested that there is a new class opening soon that is the same one that " +
    //                             "you wanted to enroll " + req.body.childName + " into" +
    //                             ".\r\n\r\n    If you would like to enroll again, please visit www." + self.dbname + "com and click Enroll Now" +
    //                             ".\r\n\r\n    Thank you for your interest in TechGroms!\r\n\r\n    Warm regards, The Grom Team" // plaintext body
    //                     };

    //                     exceptionRet = self.actuallySendMail(mailOptions, req, res);
    //                     if (exceptionRet) {

    //                         res.json({
    //                             success: false,
    //                             message: exceptionRet.message
    //                         });
    //                     } 
    //                 }
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }    
    //         );

    //     } catch (e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeSendBulkEmailForClass = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeSendBulkEmailForClass: " + JSON.stringify(req.body));

    //         // setup e-mail data with unicode symbols
    //         var strEMail = "gerald.rubin@gmail.com, techgroms@gmail.com, ken.rubin@live.com, geraldrubin@hotmail.com, jerry@rubintech.com";

    //         var mailOptions = {
     
    //             from: "TechGroms <techgroms@gmail.com>", // sender address
    //             to: strEMail, // list of receivers
    //             subject: "TechGroms New Class Announcement", // Subject line
    //             text: "Hi.\r\n\r\n    We thought you'd be interested in an upcoming TechGroms class. " +
    //                 "It is " + req.body.className + " and is scheduled for " + req.body.classSchedule +
    //                 ".\r\n\r\n    If you would like to check it out, please visit www." + self.dbname + "com and click Enroll Now" +
    //                 ".\r\n\r\n    Thank you for your interest in TechGroms!\r\n\r\n    Warm regards, The Grom Team" // plaintext body
    //         };

    //         var exceptionRet = self.actuallySendMail(mailOptions, req, res);
    //         if (exceptionRet) {

    //             res.json({
    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         } 
    //     } catch (e) {

    //         console.log("In sendMail catch: " + e.message);
    //         res.json({

    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.actuallySendMail = function(mailOptions, req, res) {

    //     try {

    //         // send mail with defined transport object
    //         console.log("About to sendMail. mailOptions: " + JSON.stringify(mailOptions));

    //         self.smtpTransport.sendMail(mailOptions, function(error, response){
            
    //             if (error) {
                
    //                 console.log("Error: " + error.toString());
    //                 res.json({
    //                     success: false,
    //                     message: error 
    //                 })

    //             } else {

    //                 console.log("New user e-mail sent to parent(s).");
    //                 res.json({
    //                    success: true
    //                 });
    //             }
    //         });

    //         return null;

    //     } catch (e) {

    //         return e;
    //     }
    // }

    // self.routeGetAllByParentIdForStudentMaint = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetAllByParentIdForStudentMaint with req.body=" + JSON.stringify(req.body));

    //         var exceptionRet = sql.execute("SELECT children.id as childid, children.name as childname, enrollments.*, classes.id as classid, classes.name as classname FROM " + self.dbname + "children INNER JOIN " + self.dbname + "enrollments ON children.id = enrollments.childId INNER JOIN " + self.dbname + "classes ON classes.id = enrollments.classId where children.parentId=" + req.body.parentId + ";",
    //             function(arrayRows) {

    //                 res.json({

    //                     success: true,
    //                     arrayRows: arrayRows
    //                 });
    //             },
    //             function(strError) {

    //                 console.log("The sql SELECT came back into the ERROR function");
    //                 // Failure callback
    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );
    //         if (exceptionRet != null) {

    //             // Failure callback
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

    // self.routeGetClassesByChildIdForStudentMaint = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetClassesByChildIdForStudentMaint with req.body=" + JSON.stringify(req.body));

    //         var exceptionRet = sql.execute("select enrollments.*, classes.id as classid, classes.name as classname, classes.display, parents.name as parentname from " + self.dbname + "enrollments INNER JOIN " + self.dbname + "classes ON enrollments.classId = classes.id INNER JOIN " + self.dbname + "children ON enrollments.childId = children.id INNER JOIN " + self.dbname + "parents ON children.parentId = parents.id where childId=" + req.body.childId + ";",
    //             function(arrayRows) {

    //                 res.json({

    //                     success: true,
    //                     arrayRows: arrayRows
    //                 });
    //             },
    //             function(strError) {

    //                 console.log("The sql SELECT came back into the ERROR function");
    //                 // Failure callback
    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );
    //         if (exceptionRet != null) {

    //             // Failure callback
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

    // self.routeGetAllChildrenByClassIdForStudentMaint = function(req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetAllChildrenByClassIdForStudentMaint with req.body=" + JSON.stringify(req.body));

    //         var exceptionRet = sql.execute("select enrollments.status, children.id, children.name, parents.id as parentid, parents.name as parentname" + " from " + self.dbname + "enrollments INNER JOIN " + self.dbname + "children ON enrollments.childId = children.id INNER JOIN " + self.dbname + "parents ON children.parentId = parents.id where classId=" + req.body.classId + ";",
    //             function(arrayRows) {

    //                 res.json({

    //                     success: true,
    //                     arrayRows: arrayRows
    //                 });
    //             },
    //             function(strError) {

    //                 console.log("The sql SELECT came back into the ERROR function");
    //                 // Failure callback
    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );
    //         if (exceptionRet != null) {

    //             // Failure callback
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

    // self.routeGetClassesForStudentMaint = function(req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetClassesForStudentMaint");

    //         var exceptionRet = sql.execute("select id as id, id as classid, name, display from " + self.dbname + "classes;",
    //             function(arrayRows) {

    //                 res.json({

    //                     success: true,
    //                     arrayRows: arrayRows
    //                 });
    //             },
    //             function(strError) {

    //                 console.log("The sql SELECT came back into the ERROR function");
    //                 // Failure callback
    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );
    //         if (exceptionRet != null) {

    //             // Failure callback
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

    // self.routeGetParentsForStudentMaint = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetParentsForStudentMaint");

    //         var exceptionRet = sql.execute("select * from " + self.dbname + "parents order by lastname asc;",
    //             function(arrayRows) {

    //                 res.json({

    //                     success: true,
    //                     arrayRows: arrayRows
    //                 });
    //             },
    //             function(strError) {

    //                 console.log("The sql SELECT came back into the ERROR function");
    //                 // Failure callback
    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );
    //         if (exceptionRet != null) {

    //             // Failure callback
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

    // self.routeGetChildrenForStudentMaint = function(req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetStudentsForStudentMaint");

    //         var exceptionRet = sql.execute("select children.*, parents.name as parentname from " + self.dbname + "children inner join " + self.dbname + "parents on children.parentId = parents.id;",
    //             function(arrayRows) {

    //                 res.json({

    //                     success: true,
    //                     arrayRows: arrayRows
    //                 });
    //             },
    //             function(strError) {

    //                 console.log("The sql SELECT came back into the ERROR function");
    //                 // Failure callback
    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );
    //         if (exceptionRet != null) {

    //             // Failure callback
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

    // self.routeGetSigninsForUserId = function(req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetSigninsForUserId with req.body = " + JSON.stringify(req.body));
    //         // req.body.userId
    //         // req.body.classId
    //         // req.body.startDate

    //         var additonalWhere = "created>='" + req.body.startDate + "' AND jsoncontext='{\"userId\":" + req.body.userId.toString() + "}'";
    //         var rows = logger.getLogItems('2', false, additonalWhere, function(rows){
                
    //             res.json({

    //                 success: true,
    //                 arrayRows: rows
    //             });
    //         });
    //     } catch (e) {

    //         res.json({

    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeGetStudentsByClassId = function(req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetStudentsByClassId with req.body = " + JSON.stringify(req.body));

    //         var exceptionRet = sql.execute("select c.* from " + self.dbname + "students s INNER JOIN " + self.dbname + "children c ON c.id = s.childId WHERE classId = " + req.body.classId + ";",
    //             function(arrayRows) {

    //                 res.json({

    //                     success: true,
    //                     arrayRows: arrayRows
    //                 });
    //             },
    //             function(strError) {

    //                 console.log("The sql INSERT came back into the ERROR function");
    //                 // Failure callback
    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );
    //     } catch (e) {

    //         res.json({

    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeAddOrUpdateClass = function(req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeAddOrUpdateClass with req.body=" + JSON.stringify(req.body));
    //         var sqlcmd = "";
    //         var sqlBody = "set name = '" + req.body.name + "', " + "description = '" + req.body.description + "', " + "schedule = '" + req.body.schedule + "', " + "cost = '" + req.body.cost + "', " + "summary = '" + req.body.summary + "', " + "location = '" + req.body.location + "', " + "size = " + (req.body.size.length === 0 ? null : req.body.size) + ", " + "cents = " + (req.body.cents.length === 0 ? null : req.body.cents) + ", " + "classday = '" + req.body.classday + "', " + "startdate = '" + req.body.startdate + "', " + "enddate = '" + req.body.enddate + "', " + "display = " + req.body.display + " ";
    //         if (req.body.id < 0)
    //             sqlCmd = "insert " + self.dbname + "classes " + sqlBody + ";";
    //         else
    //             sqlCmd = "update " + self.dbname + "classes " + sqlBody + " where id=" + req.body.id + ";";

    //         var exceptionRet = sql.execute(sqlCmd,
    //             function(result) {

    //                 // The INSERT or UPDATE worked.
    //                 // Retrieve the list again.
    //                 try {

    //                     var strWhere = (req.body.which === 'active' ? ' where display=1;' : ";");
    //                     exceptionRet = sql.execute("select * from " + self.dbname + "classes" + strWhere,
    //                         function(arrayRows) {
    //                             res.json({
    //                                 success: true,
    //                                 arrayRows: arrayRows
    //                             });
    //                         },
    //                         function(strError) {

    //                             res.json({
    //                                 success: false,
    //                                 message: strError
    //                             });
    //                         }
    //                     );
    //                 } catch (e) {

    //                     res.json({
    //                         success: false,
    //                         message: e.message
    //                     });
    //                 }

    //             },
    //             function(strError) {

    //                 console.log("The sql INSERT came back into the ERROR function");
    //                 // Failure callback
    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );
    //     } catch (e) {

    //         res.json({

    //             success: false,
    //             message: e.message
    //         });
    //     }
    // };

    // self.routeChangeDisplayValue = function(req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeChangeDisplayValue with req.body=" + JSON.stringify(req.body));
    //         var sqlCmd = "update " + self.dbname + "classes set display=" + req.body.display + " where id=" + req.body.id + ";";
    //         var exceptionRet = sql.execute(sqlCmd,
    //             function(result) {

    //                 // The UPDATE worked.
    //                 // Retrieve the list again.
    //                 try {

    //                     var strWhere = (req.body.which === 'active' ? ' where display=1;' : ";");
    //                     exceptionRet = sql.execute("select * from " + self.dbname + "classes" + strWhere,
    //                         function(arrayRows) {
    //                             res.json({
    //                                 success: true,
    //                                 arrayRows: arrayRows
    //                             });
    //                         },
    //                         function(strError) {

    //                             res.json({
    //                                 success: false,
    //                                 message: strError
    //                             });
    //                         }
    //                     );
    //                 } catch (e) {

    //                     res.json({
    //                         success: false,
    //                         message: e.message
    //                     });
    //                 }

    //             },
    //             function(strError) {

    //                 console.log("The sql INSERT came back into the ERROR function");
    //                 // Failure callback
    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );
    //     } catch (e) {

    //         res.json({

    //             success: false,
    //             message: e.message
    //         });
    //     }
    // };

    // self.routeGetTableNames = function(req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeGetTableNames.");

    //         // Select data.
    //         // remove the period at the end of self.dbname.
    //         var dbn = self.dbname.substring(0, self.dbname.length - 1);
    //         var sqlbody = "select DISTINCT(ISC.TABLE_NAME) as `table` from INFORMATION_SCHEMA.COLUMNS as ISC WHERE ISC.TABLE_SCHEMA='" + dbn + "' ORDER BY ISC.TABLE_NAME ASC;";
    //         console.log("sqlbody: " + sqlbody);
    //         var exceptionRet = sql.execute(sqlbody,
    //             function(arrayRows) {

    //                 res.json({

    //                     success: true,
    //                     arrayRows: arrayRows
    //                 });
    //             },
    //             function(strError) {

    //                 res.json({

    //                     success: false,
    //                     message: strError
    //                 });
    //             });
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

    // self.routeGetTableRows = function(req, res) {

    //     try {

    //         // req.body looks like: {table:'name'}

    //         console.log("Entered AdminBO/routeGetTableRows with req.body = " + JSON.stringify(req.body));

    //         // Select data.
    //         var exceptionRet = sql.execute("select * from " + self.dbname + req.body.table + ";",
    //             function(arrayRows) {

    //                 res.json({

    //                     success: true,
    //                     arrayRows: arrayRows
    //                 });
    //             },
    //             function(strError) {

    //                 res.json({

    //                     success: false,
    //                     message: strError
    //                 });
    //             });
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

    // Private methods
    // var m_isEmpty = function(obj) {
        
    //     for(var prop in obj) {
    //         if (obj.hasOwnProperty(prop))
    //             return false;
    //     }
    //     return true;
    // }
};