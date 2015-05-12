//////////////////////////////////
// ValidateBO.js module
//
//////////////////////////////////

var bcrypt = require("bcrypt-nodejs");
module.exports = function ValidateBO(app, sql, logger) {

    var self = this;                // Über closure.

    self.dbname = app.get("dbname");
    
    ////////////////////////////////////
    // Public methods
    
    // Router handler function.
    self.routeNewEnrollment = function (req, res) {
        // req.body.userName
        // req.body.parentEmail

        try {
        
            console.log("Entered routeNewEnrollment with req.body=" + JSON.stringify(req.body));

            // 1. See if parent exists. If so, grab id. Otherwise, create parent; grab id.
            // 2. Gen password for user. Hash the password. Create the user. Grab the id as userId.
            // 3. Return success and userId.

            sql.execute("select id from " + self.dbname + "parent where email='" + req.body.parentEmail + "';",
                function(rows) {

                    if (rows.length === 0) {

                        // Need to insert parent

                    } else {

                        // parent already existed
                        
                    }
                },
                function(strError) {

                    res.json({
                        success: false,
                        message: "Error gotten retrieving parent from database: " + strError
                    });
                }
            );
        } catch (e) {

            res.json({
                
                success: false,
                message: 'Enrollment exception: ' + e.message
            });
        }
    }

    self.routeForgotPassword = function (req, res) {
        // req.body.userName

        try {
        
            console.log("Entered routeForgotPassword with req.body=" + JSON.stringify(req.body));

        } catch (e) {

            res.json({
                
                success: false,
                message: 'Forgot exception: ' + e.message
            });
        }
    }

    self.routeUserAuthenticate = function (req, res) {
        // req.body.userName
        // req.body.password
        
        try {
        
            console.log("Entered routeUserAuthenticate with req.body=" + JSON.stringify(req.body));

            var exceptionRet = sql.execute("select count(*) as cnt from " + self.dbname + "user;",
                function(rows) {

                    if (!rows) {
                        res.json({
                            success:false,
                            message:'Could not access user table to get record count'
                        });
                    } else if (rows.length === 0) {
                        res.json({
                            success:false,
                            message:'Could not access user table to get record count'
                        });
                    } else {

                        var cnt = rows[0].cnt;

                        if (cnt === 0) {

                            // First user. Auto-enroll, setting password hash.
                            bcrypt.hash(req.body.password, null, null, function(err, hash){

                                if (err) {
                                    res.json({success:false,
                                        message:'Error received hashing password: ' + err
                                    });
                                } else {

                                    exceptionRet = sql.execute("insert " + self.dbname + "user (userName, pwHash) values ('" + req.body.userName + "','" + hash + "');",
                                        function(rows){

                                            if (!rows) {
                                                res.json({
                                                    success: false,
                                                    message: 'Error received inserting first user in user table.'
                                                });
                                            } else if (rows.length === 0){
                                                res.json({
                                                    success: false,
                                                    message: 'Error received inserting first user in user table.'
                                                });
                                            } else {
                                                res.json({
                                                    success: true,
                                                    userId: rows[0].insertId
                                                });
                                            }
                                        },
                                        function(strError){
                                            res.json({
                                                success: false,
                                                message: 'Error received inserting first user in user table: ' + strError
                                            });
                                        });
                                    if (exceptionRet) {
                                        res.json({
                                            success: false,
                                            message: 'Error received inserting first user in user table: ' + exceptionRet.message
                                        });
                                    }
                                }
                            });
                        } else {

                            // Retrieve and validate password against hash.
                            exceptionRet = sql.execute("select id, pwHash from " + self.dbname + "user where userName='" + req.body.userName + "';",
                                function(rows){

                                    if (!rows) {
                                        res.json({
                                            success: false,
                                            message: 'Error received validating user.'
                                        });
                                    } else if (rows.length === 0){
                                        res.json({
                                            success: false,
                                            message: 'Error received validating user.'
                                        });
                                    } else {

                                        var id = rows[0].id;
                                        var pwHash = rows[0].pwHash;

                                        bcrypt.compare(req.body.password, pwHash, function(err, result){

                                            if (!result) {
                                                res.json({
                                                    success: false,
                                                    message: 'Error received validating user.'
                                                });
                                            } else {
                                                res.json({
                                                    success: true,
                                                    userId: id
                                                });
                                            }
                                        });
                                    }
                                },
                                function(strError){
                                    res.json({
                                        success: false,
                                        message: 'Error received validating user: ' + strError
                                    });
                                });
                            if (exceptionRet) {
                                res.json({
                                    success: false,
                                    message: 'Error received validating user: ' + exceptionRet.message
                                });
                            }
                        }
                    }
                },
                function(strError){
                    res.json({
                        success:false,
                        message:'Could not access user table to get record count: ' + strError
                    });
                });

            if (exceptionRet) {
                    res.json({
                        success:false,
                        message:'Could not access user table to get record count: ' + exceptionRet.message
                    });
            }
        } catch (e) {
        
            res.json({
                
                success: false,
                message: 'Login exception: ' + e.message
            });
        }
    };
    
    // Private fields
};

