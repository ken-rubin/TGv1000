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

            var request = req;

            // 1. See if parent exists. If so, grab id. Otherwise, create parent; grab id.
            // 2. Gen password for user. Hash the password. Create the user. Grab the id as userId.
            // 3. Return success and userId.

            var exceptionRet1 = null;
            var exceptionRet2 = null;
            var exceptionRet3 = null;
            var exceptionRet4 = null;

            var functionSendEnrollmentEmail = function(strPassword, userId) {

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

                    var fullUrl = request.protocol + '://' + request.get('host'); // + request.originalUrl;

                    mailOptions = {
             
                        from: "TechGroms <techgroms@gmail.com>", // sender address
                        to: req.body.parentEmail, // list of receivers
                        subject: "TechGroms Registration ✔", // Subject line
                        text: "Hi. You have successfully enrolled " + req.body.userName + " in TechGroms." + 
                        "\r\n\r\nWe have created a login user for your child. Your child will use the e-mail address you entered along with" +
                        " this password: " + strPassword + ". Go to " + fullUrl + " to sign in." +
                        "\r\n\r\nThank you for signing your child up with TechGroms!\r\n\r\nWarm regards, The Grom Team",
                        html: "Hi. You have successfully enrolled " + req.body.userName + " in TechGroms." + 
                        "<br><br>We have created a login user for your child. Your child will use the e-mail address you entered along with" +
                        " this password: " + strPassword + ". Go to <a href='" + fullUrl + "'>" + fullUrl + "</a> to sign in." +
                        "<br><br>Thank you for signing your child up with TechGroms!<br><br>Warm regards, The Grom Team"
                    };

                    // send mail with defined transport object
                    smtpTransport.sendMail(mailOptions, function(error, response){
                    
                        if (error) {
                        
                            res.json({
                                success: false,
                                message: "Error sending enrollment e-mail: " + error.toString()
                            });
                        }

                        res.json({
                            success: true,
                            userId: userId
                        });

                        // if you don't want to use this transport object anymore, uncomment following line
                        //smtpTransport.close(); // shut down the connection pool, no more messages
                    });
                } catch (e) {

                    res.json({
                        success: false,
                        message: "Error sending enrollment e-mail: " + e.message
                    });
                }
            }

            var functionEnrollmentStep2 = function (parentId) {

                try {

                    // Have new or old parentId (based on email).
                    // Check to make sure userId isn't in use yet.
                    exceptionRet1 = sql.execute("select count(*) as cnt from " + self.dbname + "user where userName='" + req.body.userName + "';",
                        function(rows){

                            if (rows.length === 0) {

                                res.json({
                                    success: false,
                                    message: "Error checking database for prior use of user Id."
                                });
                            } else if (rows[0].cnt > 0) {

                                res.json({
                                    success: false,
                                    message: "The e-mail address " + req.body.userName + " is already in use."
                                });
                            } else {

                                // userName is ok.
                                // Generate and encrypt a password.
                                var strPassword = (Math.random() * 10000).toFixed(0);

                                // Change john, ken and jerry password to 'a'.
                                var uName = req.body.userName.toLowerCase();
                                if (req.body.userName === 'jerry@rubintech.com' || req.body.userName === 'ken.rubin@live.com' || req.body.userName === 'techgroms@gmail.com') {
                                    strPassword = 'a';
                                }
                                bcrypt.hash(strPassword, null, null, function(err, hash){

                                    if (err) {

                                        res.json({
                                            success: false,
                                            message: "Error received encrypting password."
                                        });

                                    } else {

                                        exceptionRet2 = sql.execute("insert " + self.dbname + "user (userName,pwHash,parentId) values ('" + req.body.userName + "','" + hash + "'," + parentId + ");",
                                            function(rows){

                                                if (rows.length === 0) {

                                                    res.json({
                                                        success: false,
                                                        message: "Database error inserting new user into database."
                                                    });
                                                }
                                                functionSendEnrollmentEmail(strPassword, rows[0].insertId);
                                            },
                                            function(strError) {

                                                res.json({
                                                    success: false,
                                                    message: strError
                                                });
                                            }
                                        );

                                        if (exceptionRet2) {

                                            res.json({
                                                success: false,
                                                message: exceptionRet2.message
                                            });
                                        }
                                    }
                                });
                            }
                        },
                        function(strError) {

                            res.json({
                                success: false,
                                message: "Error checking database for prior use of user Id."
                            });
                        }
                    );
                    if (exceptionRet1){

                        res.json({
                            success: false,
                            message: exceptionRet1.message
                        });
                    }
                } catch (e) {

                    res.json({
                        success: false,
                        message: e.message
                    });
                }
            }

            exceptionRet1 = sql.execute("select id from " + self.dbname + "parent where email='" + req.body.parentEmail + "';",
                function(rows) {

                    if (rows.length === 0) {

                        // Need to insert parent
                        exceptionRet2 = sql.execute("insert " + self.dbname + "parent (email) values ('" + req.body.parentEmail + "');",
                            function(rows) {

                                if (rows.length > 0) {

                                    functionEnrollmentStep2(rows[0].insertId);
                                }
                            },
                            function(strError) {

                                res.json({
                                    success: false,
                                    message: "Error gotten adding parent to database: " + strError
                                });
                            }
                        );
                        if (exceptionRet2) {

                            res.json({
                                success: false,
                                message: "Error gotten adding parent to database: " + exceptionRet2.message
                            });
                        }
                    } else {

                        // parent already existed
                        functionEnrollmentStep2(rows[0].id);
                    }
                },
                function(strError) {

                    res.json({
                        success: false,
                        message: "Error gotten retrieving parent from database: " + strError
                    });
                }
            );

            if (exceptionRet1) {

                res.json({
                    success: false,
                    message: exceptionRet1.message
                });
            }
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

