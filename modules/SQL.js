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

    self.getCxnFromPool = function (callback) {

        try {
            m_pool.getConnection(function(err, connection) {

                // if err then connection is null and vice-versa.
                callback(err, connection);  
            });
        } catch (e) {

            callback(new Error("Error getting database connection"), null);
        }
    }

    self.queryWithCxn = function (connection, strQuery, callback, passbackWithCallback) {

        try {
            
            connection.query(strQuery, function(err, rows) {

                try {
                    if (err) { throw err; }

                    // Notes:   SELECT returns rows[] with each array row a JS object containing all selected fields.
                    //          INSERT returns rows.insertId (primary key of inserted row)
                    //          UPDATE returns rows.changedRows (# of changed rows)
                    //          DELETE returns rows.affectedRows (# of deleted rows)
                    // If strSql is of the form "SELECT * FROM x; SELECT * FROM y;", rows[0] and rows[1] will respectively contain results of each SELECT.
                    if (rows.constructor === Array) {

                        callback(null, rows, passbackWithCallback, strQuery);
                    
                    } else {

                        // rows is a non-array js object. Turn it into an array.
                        var newRows = [];
                        newRows.push(rows);
                        callback(null, newRows, passbackWithCallback, strQuery);
                    }
                } catch (e) {

                    connection.rollback(function() { callback(e, null);});
                }
            });
        } catch (e) {

            connection.rollback(function() { callback(e, null);});
        }
    }

    self.commitCxn = function (connection, callback) {

        try {
            connection.commit(function (err) {

                if (err) { throw err; }

                callback(null);
            });
        } catch (e) {

            connection.rollback(function() { callback(e, null);});
        }
    }
    
    // Process sql query.

    ///////////////////////////////////////////////////////////////////
    //
    // Incorporate optional transactioning like
    //
    // connection.beginTransaction(function(err) {
    //   if (err) { throw err; }
    //   connection.query('INSERT INTO posts SET title=?', title, function(err, result) {
    //     if (err) {
    //       return connection.rollback(function() {
    //         throw err;
    //       });
    //     }
     
    //     var log = 'Post ' + result.insertId + ' added';
     
    //     connection.query('INSERT INTO log SET data=?', log, function(err, result) {
    //       if (err) {
    //         return connection.rollback(function() {
    //           throw err;
    //         });
    //       }  
    //       connection.commit(function(err) {
    //         if (err) {
    //           return connection.rollback(function() {
    //             throw err;
    //           });
    //         }
    //         console.log('success!');
    //       });
    //     });
    //   });
    // });

    // Question: how should this work with a complex routine that calls sql.execute many times?
    //
    ///////////////////////////////////////////////////////////////////////

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
                                            // console.log("sql.execute result: " + rows.length + " item" + (rows.length === 1 ? "" : "s") + " returned.");
                                            functionSuccess(rows);
                                        
                                        } else {

                                            // rows is a non-array js object. Turn it into an array.
                                            var newRows = [];
                                            newRows.push(rows);
                                            // console.log("sql.execute result: " + JSON.stringify(rows));
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
