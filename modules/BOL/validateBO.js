//////////////////////////////////
// ValidateBO.js module
//
//////////////////////////////////

var bcrypt = require("bcrypt-nodejs");
var nodemailer = require("nodemailer");
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

            var exceptionRet = sql.execute("select id from " + self.dbname + "parent where email='" + req.body.parentEmail + "';",
                function(rows) {

                    if (rows.length === 0) {

                        // Need to insert parent
                        sql.execute("insert " + self.dbname + "parent (email) values ('" + req.body.parentEmail + "');",
                            function(rows) {

                                if (rows.length > 0) {

                                    exceptionRet = m_finishEnrollment(rows[0].insertId, req, res);
                                    if (exceptionRet) {

                                        res.json({
                                            success: false,
                                            message: exceptionRet.message
                                        });
                                    }
                                }
                            },
                            function(strError) {

                                res.json({
                                    success: false,
                                    message: "Error gotten adding parent to database: " + strError
                                });
                            }
                        );

                    } else {

                        // parent already existed
                        exceptionRet = m_finishEnrollment(rows[0].id, req, res);
                        if (exceptionRet) {
                            
                            res.json({
                                success: false,
                                message: exceptionRet.message
                            });
                        }
                    }
                },
                function(strError) {

                    res.json({
                        success: false,
                        message: "Error gotten retrieving parent from database: " + strError
                    });
                }
            );

            if (exceptionRet) {

                res.json({
                    success: false,
                    message: exceptionRet.message
                });
            }
        } catch (e) {

            res.json({
                
                success: false,
                message: 'Enrollment exception: ' + e.message
            });
        }
    }

    var m_finishEnrollment = function (parentId, req, res) {

        try {

            // Have new or old parentId (based on email).
            // Check to make sure userId isn't in use yet.
            var exceptionRet = sql.execute("select count(*) as cnt from " + self.dbname + "user where userName='" + req.body.userName + "';",
                function(rows){

                    if (rows.length === 0) {

                        return new Error("Error checking database for prior use of user Id.");
                    }
                    if (rows[0].cnt > 0) {

                        return new Error("User Id " + req.body.userName + " is already in use.");
                    }

                    // userName is ok.
                    // Generate and encrypt a password.
                    var strPassword = (Math.random() * 100000000).toFixed(0);
                    bcrypt.hash(strPassword, null, null, function(err, hash){

                        if (err) {

                            return new Error("Error received encrypting password.");
                        } else {

                            exceptionRet = sql.execute("insert " + self.dbname + "user (userName,pwHash,parentId) values ('" + req.body.userName + "','" + hash + "'," + parentId + ");",
                                function(rows){

                                    if (rows.length === 0) {

                                        return new Error("Database error inserting new user into database.");
                                    }
                                    exceptionRet = m_sendEnrollmentEmail(strPassword, req, res);
                                    if (exceptionRet) {

                                        return exceptionRet;

                                    } else {

                                        res.json({
                                            success: true,
                                            userId: rows[0].insertId
                                        });
                                        return null;
                                    }
                                },
                                function(strError) {

                                    return new Error(strError);
                                }
                            );
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                        }
                    });
                },
                function(strError) {

                    return new Error("Error checking database for prior use of user Id.");
                }
            );
            if (exceptionRet){

                return exceptionRet;
            }
        } catch (e) {

            return e;
        }
    }

    var m_sendEnrollmentEmail = function(strPassword, req, res) {

        try {

            var smtpTransport = nodemailer.createTransport("SMTP", {
            
                service: "Gmail",
                auth: {
                
                    user: "techgroms@gmail.com",
                    pass: "Albatross!1"
                }
            });

            // setup e-mail data with unicode symbols
            var mailOptions = null;

            mailOptions = {
     
                from: "TechGroms <techgroms@gmail.com>", // sender address
                to: req.body.parentEmail, // list of receivers
                subject: "TechGroms Registration ✔", // Subject line
                text: "Hi. You have successfully enrolled " + req.body.userName + " in TechGroms." + 
                "\r\n\r\n    We have created a login user for your child. Your child will use the name you entered along with" +
                " this password: " + strPassword + " . There will some day be a URL here to click on." +
                "\r\n\r\n    Thank you for signing your child up for a class with TechGroms!\r\n\r\n    Warm regards, The Grom Team"
            };

            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function(error, response){
            
                if (error) {
                
                    return new Error("Error sending enrollment e-mail: " + error.toString());

                } else {

                    return null;
                }

                // if you don't want to use this transport object anymore, uncomment following line
                //smtpTransport.close(); // shut down the connection pool, no more messages
            });
        } catch (e) {

            return new Error("Error sending enrollment e-mail: " + e.message);
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

