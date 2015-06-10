////////////////////////////////////////
// SQL.js -- MySql Database Server.
//
// Export constructor function.

// EasyDNS: kenrubin2 / cho-bang-late-one.   add to passwords....
// We are now: ChocolateAlbatross.com!

// Allocate underlying database object.
var mysql = require("mysql");

// Attach and define constructor function.
module.exports = function SQL(app) {

    var self = this;                // Über closure.

    self.dbname = app.get("dbname");
    self.dbname = self.dbname.substring(0, self.dbname.length - 1);

    
    ////////////////////////////////////
    // Public methods
    
    // Setup m_pool
    self.setPool = function (strUser, strPassword) {
        
        m_pool = mysql.createPool({

            port: "3306",
            host: "localhost",
            user: strUser,
            database: self.dbname,
            password: strPassword,
            multipleStatements: true
        });  
        console.log("Created pool for " + strUser + "/'" + strPassword + "' for database: " + self.dbname + ".");
        
    };
    
    // Router handler function.
    // self.routeHandler = function (req, res, next) {
    
    //     try {
        
    //         // Execute sql if specified.
    //         if (req.body &&
    //             req.body.sql) {

    //             console.log("Process sql: " + req.body.sql + ".");
                
    //             // Call execute pass the sql from the client request.
    //             var exceptionRet = self.execute(req.body.sql,
    //                 function (rows) {
                    
    //                     try {
                        
    //                         // Return success.
    //                         res.json({
                            
    //                             success: true,
    //                             result: rows
    //                         });
    //                     } catch (e) {
                        
    //                         // Return error.
    //                         res.json({
                            
    //                             success: false,
    //                             reason: e.message
    //                         });
    //                     }
    //                 },
    //                 function (strError) {
                    
    //                     try {
                        
    //                         // Return error.
    //                         res.json({
                            
    //                             success: false,
    //                             reason: strError
    //                         });
    //                     } catch (e) {
                        
    //                         // Return error.
    //                         res.json({
                            
    //                             success: false,
    //                             reason: e.message
    //                         });
    //                     }
    //                 });
                
    //             if (exceptionRet !== null) {
                
    //                 // Return error.
    //                 res.json({
                    
    //                     success: false,
    //                     reason: exceptionRet.message
    //                 });
    //             }
    //         } else {
            
    //             // Call the next route.
    //             next();
    //         }
    //     } catch (e) {
        
    //         console.log("Error: " + e.message + ".");
            
    //         // Call the next route errorly.
    //         next("Error: " + e.message + ".");
    //     }
    // };

    // Process sql query.
    self.execute = function (strSql, functionSuccess, functionError) {
    
        try {
            //console.log("In SQL execute with strSql=" + strSql);
            // First, grab a connection.
            m_pool.getConnection(function (err, connection) {

                try {
                
                    if (err) {

                        // Log error.
                        console.log("Error: " + err + ".");

                        // Call the callback.
                        functionError("Error getting connection: " + err + ".");
                    } else {
            
                        // Use the connection
                        connection.query(strSql,
                            function (err, rows) {

                                try {
                                
                                    // And done with the connection.
                                    connection.release();

                                    if (err) {

                                        // Log error.
                                        console.log("Error: " + err + ".");

                                        // Call the callback.
                                        functionError("Error executing query: " + err + ".");
                                    } else {

                                        // Log result.
                                        // Notes:   SELECT returns rows[] with each array row a JS object containing all selected fields.
                                        //          INSERT returns rows.insertId (primary key of inserted row)
                                        //          UPDATE returns rows.changedRows (# of changed rows)
                                        //          DELETE returns rows.affectedRows (# of deleted rows)
                                        // If strSql is of the form "SELECT * FROM x; SELECT * FROM y;", rows[0] and rows[1] will respectively contain results of each SELECT.
                                        //console.log("sql.execute result: " + rows.length + " item" + (rows.length === 1 ? "" : "s") + " returned.");

                                        if (rows.constructor === Array) {

                                            // Call the callback.
                                            console.log("sql.execute result: " + rows.length + " item" + (rows.length === 1 ? "" : "s") + " returned.");
                                            functionSuccess(rows);
                                        
                                        } else {

                                            // rows is a non-array js object. Turn it into an array.
                                            var newRows = [];
                                            newRows.push(rows);
                                            console.log("sql.execute result: " + JSON.stringify(rows));
                                            functionSuccess(newRows);
                                        }
                                    }
                                } catch (e) {
                
                                    // Call the callback.
                                    functionError("Error: " + e.message + ".");
                                }
                            });
                    }
                } catch (e) {
                
                    // Call the callback.
                    functionError("Error: " + e.message + ".");
                }
            });
            return null;
        } catch (e) {
        
            return e;
        }
    };

    ////////////////////////////////////
    // Private fields

    // Pool of database connections.
    var m_pool;
};
