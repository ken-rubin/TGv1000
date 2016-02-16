//////////////////////////////////
// ValidateBO.js module
//
//////////////////////////////////

var bcrypt = require("bcrypt-nodejs");
var nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');
var async = require("async");

module.exports = function ValidateBO(app, sql, logger) {

    var self = this;                // Über closure.
    self.dbname = app.get("dbname");

    // Private fields
    var m_permissions = [];

    // Fill m_permissions from database for quick use during login.
    try {

        var exceptionRet = sql.execute("select * from " + self.dbname + "permissions",
            function(rows) {

                if (rows.length === 0) {

                    throw new Error('Failed to read permissions from database. Cannot proceed.');

                } else {

                    // Make sure rows are sorted by id.
                    rows.sort(function(a,b){return a.id - b.id;})
                    for (var i = 0; i < rows.length; i++) {
                        var rowIth = rows[i];
                        m_permissions.push({id: rowIth.id, description: rowIth.description});
                    }
                }
            },
            function (strError) {

                throw new Error("Received error reading permissions from database. Cannot proceed. " + strError);

            });
        if (exceptionRet) {

            throw exceptionRet;
        }

    } catch (e) {

        throw e;
    }
    
    var m_ug_permissions = [];

    // Fill m_ug_permissions from database for quick use during login.
    try {

        var exceptionRet = sql.execute("select * from " + self.dbname + "ug_permissions",
            function(rows) {

                if (rows.length === 0) {

                    throw new Error('Failed to read ug_permissions from database.');

                } else {

                    // Make sure rows are sorted by usergroupId.
                    rows.sort(function(a,b){return a.usergroupId - b.usergroupId;})
                    for (var i = 0; i < rows.length; i++) {
                        var rowIth = rows[i];
                        m_ug_permissions.push({usergroupId: rowIth.usergroupId, permissionId: rowIth.permissionId});
                    }
                }
            },
            function (strError) {

                throw new Error("Received error reading ug_permissions from database. Cannot proceed. " + strError);

            });
        if (exceptionRet) {

            throw exceptionRet;
        }

    } catch (e) {

        throw e;
    }
    
    ////////////////////////////////////
    // Public methods
    
    // Router handler function.
    self.routeNewEnrollment = function (req, res) {
        // req.body.userName -- user email address
        // req.body.firstName
        // req.body.lastName

        try {
        
            console.log("Entered routeNewEnrollment with req.body=" + JSON.stringify(req.body));

            // Use async.waterfall to perform these steps in series, passing results from step to step:
            async.waterfall([

                function(cb) {
                    // (1) Check for username availability.
                    var profile = {
                        userName: req.body.userName,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName
                    };
                    
                    var exceptionRet = sql.execute("select count(*) as cnt from " + self.dbname + "user where userName='" + profile.userName + "';",
                        function(rows){

                            if (rows.length === 0) {

                                return cb(new("Error checking database for prior use of email address."), null);

                            } else if (rows[0].cnt > 0) {

                                return cb(new Error("The email address " + profile.userName + " is already in use."), null);
                            }

                            return cb(null, profile);
                        },
                        function(strError) {

                            return cb(new Error("Error checking database for prior use of email address: " + strError), null);
                        }
                    );
                    if (exceptionRet){

                        return cb(new Error("Error checking database for prior use of email address: " + exceptionRet.message), null);
                    }
                },
                function(profile, cb) {
                    // (2) Generate password, set usergroupId and insert user into DB.
                    try {

                        // Generate and encrypt a password.
                        var password = (Math.random() * 10000).toFixed(0);
                        if (profile.userName === 'a@a.com') {
                            console.log('Generated password: ' + password.toString());
                        }
                        var usergroupId = 3;

                        // Change john, ken and jerry password to 'a' and assign to "developer" usergroup.
                        if (profile.userName === 'jerry@rubintech.com' || profile.userName === 'ken.rubin@live.com' || profile.userName === 'techgroms@gmail.com') {
                            password = 'a';
                            usergroupId = 1;
                        }

                        bcrypt.hash(password, null, null, function(err, hash){

                            if (err) {

                                return cb(new Error("Error received encrypting password."), null);

                            } else {

                                var exceptionRet = sql.execute("insert " + self.dbname + "user (userName,firstName,lastName,pwHash,usergroupId) values ('" + profile.userName + "','" + profile.firstName + "','" + profile.lastName + "','" + hash + "'," + usergroupId + ");",
                                    function(rows){

                                        if (rows.length === 0) {

                                            return cb(new Error("Database error inserting new user into database."), null);
                                        }

                                        profile.usergroupId = usergroupId;
                                        profile.userId = rows[0].insertId;
                                        profile.password = password;
                                        cb(null, profile);
                                    },
                                    function(strError) {

                                        return cb(new Error("Database error inserting new user into database: " + strError), null);
                                    }
                                );

                                if (exceptionRet) {

                                    return cb(new Error("Database error inserting new user into database: " + exceptionRet.message), null);
                                }
                            }
                        });
                    } catch(e) {

                        return cb(new Error("Database error inserting new user into database: " + e.message), null);
                    }
                },
                function(profile, cb) {
                    // (3) Send email informing user of password.
                    try {

                        console.log(JSON.stringify(profile));

                        // A special bypass. We don't send an email to a@a.com. Instead, we write his p/w to console.log.
                        if (profile.userName !== 'a@a.com') {

                            var smtpTransport = nodemailer.createTransport("SMTP", {
                            
                                service: "Gmail",
                                auth: {
                                
                                    user: "techgroms@gmail.com",
                                    pass: "Albatross!1"
                                }
                            });

                            // setup email data with unicode symbols
                            var mailOptions = null;

                            var fullUrl = req.protocol + '://' + req.get('host'); // + req.originalUrl;

                            mailOptions = {
                     
                                from: "TechGroms <techgroms@gmail.com>", // sender address
                                to: profile.userName, // list of receivers
                                subject: "TechGroms Registration ✔", // Subject line
                                text: "Hi, " + profile.firstName + ". You have successfully enrolled " + profile.userName + " in TechGroms." + 
                                "\r\n\r\nWe have created a login user for you. You will use the email address you entered along with" +
                                " this password: " + profile.password + ". Go to " + fullUrl + " to sign in." +
                                "\r\n\r\nThank you for signing up with TechGroms!\r\n\r\nWarm regards, The Grom Team",
                                html: "Hi, " + profile.firstName + ". You have successfully enrolled " + profile.userName + " in TechGroms." + 
                                "<br><br>We have created a login user for you. You will use the email address you entered along with" +
                                " this password: <b>" + profile.password + "</b>. Go to <a href='" + fullUrl + "'>" + fullUrl + "</a> to sign in." +
                                "<br><br>Thank you for signing up with TechGroms!<br><br>Warm regards, The Grom Team"
                            };

                            // send mail with defined transport object
                            smtpTransport.sendMail(mailOptions, function(error, response){
                            
                                if (error) {
                                
                                    return cb(new Error("Error sending enrollment email: " + error.toString()), null);
                                }

                                // If you don't want to use this transport object anymore, uncomment following line
                                //smtpTransport.close(); // shut down the connection pool, no more messages

                                delete profile.password;
                                return cb(null, profile);

                            });
                        } else {

                            delete profile.password;
                            return cb(null, profile);
                        }
                    } catch (e) {

                        return cb(new Error("Error sending enrollment email: " + e.message), null);
                    }
                }
            ], function(err, profile) {
                // (4) If err, return failure with message. Else generate JWT and return success.
                if (err) {
                    res.json({
                        success: false,
                        message: err.message
                    });
                } else {

                    // Add permissions to profile, based on usergroupId.
                    m_ug_permissions.forEach(function(ug_permission) {
                        if (ug_permission.usergroupId === profile.usergroupId) {
                            var permissionId = ug_permission.permissionId;
                            m_permissions.forEach(function(permission) {
                                if (permission.id === permissionId) {
                                    profile[permission.description] = true;
                                }
                            });
                        }
                    });

                    var token = jwt.sign(profile, app.get("jwt_secret"), { expiresIn: 60*60*5});
                    res.cookie('token', token, {maxAge: 60*60*1000, httpOnly: false, secure: false});    // Expires in 1 hour (in ms); change to secure: true in production
                    res.json({
                        success: true
                    });
                }
            });
        } catch (e) {

            res.json({
                
                success: false,
                message: 'Enrollment exception: ' + e.message
            });
        }
    }

    self.routeSendPasswordResetEmail = function (req, res) {
        // req.body.userName

        try {
        
            console.log("Entered routeSendPasswordResetEmail with req.body=" + JSON.stringify(req.body));

            async.series(
                [
                    // (1)
                    function(cb) {

                        // Verify that userName is in the DB.
                        var strQuery = "select count(*) as cnt from " + self.dbname + "user where userName='" + req.body.userName + "';";
                        
                        var exceptionRet = sql.execute(
                            strQuery, 
                            function(rows) {   
                                if (rows.length === 0) { return cb(new Error('Sorry. We received an error accessing our database.')); }
                                if (rows[0].cnt !== 1) { return cb(new Error('That email address is not registered as a user name in TechGroms.')); }
                                return cb(null);
                            },
                            function(strError) { return cb(new Error(strError)); }
                        );
                        if (exceptionRet) { return cb(err); }
                    },
                    // (2)
                    function(cb) {

                        // Compose and send the email.
                        try {

                            var smtpTransport = nodemailer.createTransport("SMTP", {
                            
                                service: "Gmail",
                                auth: {
                                
                                    user: "techgroms@gmail.com",
                                    pass: "Albatross!1"
                                }
                            });

                            // setup email data with unicode symbols
                            var mailOptions = null;

                            var profile = { userName: req.body.userName};
                            // Note: we do not sign this token with our special, server-side secret.
                            // Instead, we use one that can be employed client-side for token verification. No big deal.
                            var token = jwt.sign(profile, "jwt_secret", { expiresIn: 60*60});  // expires in one hour.
                            // token is a base64 encoded JWT to append to email URL.

                            var fullUrl = req.protocol + '://' + req.get('host') + '/?reset=' + token;
                            var partialUrl = req.protocol + '://' + req.get('host');

                            mailOptions = {
                     
                                from: "TechGroms <techgroms@gmail.com>", // sender address
                                to: profile.userName, // list of receivers
                                subject: "TechGroms Password Reset", // Subject line
                                text: "Hi. Per your request we have generated a password reset link for " + profile.userName + "." + 
                                "\r\n\r\nPlease click the link below or paste it into a browser address line. Then enter your new password." +
                                "\r\nFor your account's security the link expires in 60 minutes." +
                                "\r\n\r\nReset link: " + fullUrl +
                                "\r\n\r\n\r\n\r\nRegards from The Grom Team",
                                html: "Hi. Per your request we have generated a password reset link for " + profile.userName + "." + 
                                "<br><br>Please click the link below or paste it into a browser address line. Then enter your new password." +
                                "<br>For your account's security the link expires in 60 minutes." +
                                "<br><br>Reset link:  <a href='" + fullUrl + "'>" + partialUrl + "</a>" +
                                "<br><br><br>Regards from The Grom Team"
                            };

                            // send mail with defined transport object
                            smtpTransport.sendMail(mailOptions, function(error, response){
                            
                                if (error) {
                                
                                    return cb(new Error("Error sending password reset email: " + error.toString()));
                                }

                                // If you don't want to use this transport object anymore, uncomment following line
                                //smtpTransport.close(); // shut down the connection pool, no more messages

                                return cb(null);

                            });
                        } catch (e) {

                            return cb(new Error("Error sending reset email: " + e.message), null);
                        }
                    }
                ],
                // final callback for series
                function(err){ 
                    
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        }) ;
                    } else {
                        res.json({ success: true });
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

    self.routePasswordReset = function (req, res) {
        // req.body.userName
        // req.body.newPassword

        try {
        
            console.log("Entered routePasswordReset with req.body=" + JSON.stringify(req.body));

            bcrypt.hash(req.body.newPassword, null, null, function(err, hash){

                if (err) {

                    res.json({
                        success: false,
                        message: "Error received encrypting password."
                    });
                } else {

                    var exceptionRet = sql.execute("update " + self.dbname + "user set pwHash='" + hash + "' where userName='" + req.body.userName + "';",
                        function(rows){

                            res.json({ success: true });
                        },
                        function(strError) {

                            res.json({
                                success: false,
                                message: "Database error updating user in database."
                            });
                        }
                    );

                    if (exceptionRet) {

                        res.json({
                            success: false,
                            message: "Database error updating user in database."
                        });
                    }
                }
            });
        } catch (e) {

            res.json({
                success: false,
                message: "Database error updating user in database."
            });
        }
    }

    self.routeUserAuthenticate = function (req, res) {
        // req.body.userName
        // req.body.password
        
        try {
        
            console.log("Entered routeUserAuthenticate with req.body=" + JSON.stringify(req.body));

            // Retrieve and validate password against hash.
            var exceptionRet = sql.execute("select id, pwHash, usergroupId from " + self.dbname + "user where userName='" + req.body.userName + "';",
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
                        var usergroupId = rows[0].usergroupId;

                        bcrypt.compare(req.body.password, pwHash, function(err, result){

                            if (!result) {
                                res.json({
                                    success: false,
                                    message: 'Error received validating user.'
                                });
                            } else {
                                var profile = {
                                    userName: req.body.userName,
                                    userId: id,
                                    usergroupId: usergroupId
                                };

                                // Add permissions to profile, based on usergroupId.
                                m_ug_permissions.forEach(function(ug_permission) {
                                    if (ug_permission.usergroupId === profile.usergroupId) {
                                        var permissionId = ug_permission.permissionId;
                                        m_permissions.forEach(function(permission) {
                                            if (permission.id === permissionId) {
                                                profile[permission.description] = true;
                                            }
                                        });
                                    }
                                });
                                
                                var token = jwt.sign(profile, app.get("jwt_secret"), { expiresIn: 60*60*5});
                                res.cookie('token', token, {maxAge: 60*60*1000, httpOnly: false, secure: false});    // Expires in 1 hour (in ms); change to secure: true in production
                                res.json({
                                    success: true
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
        } catch (e) {
        
            res.json({
                
                success: false,
                message: 'Login exception: ' + e.message
            });
        }
    };
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                  Method to fetch lists for marketing page
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   self.routeRetrieveProjectsForLists = function (req, res) {

        try {

            res.json({
                success: true,
                frees:
                {
                    items: [
                        {
                            name: "Game",
                            imgsrc: "/media/images/gameProject.png",
                            description: "This is the type of project that you will use most often. It teaches you to create a graphical game, one player for now with multi-player coming soon."
                        },
                        {
                            name: "Console",
                            imgsrc: "/media/images/consoleProject.png",
                            description: "This is the...."
                        },
                        {
                            name: "Web Site",
                            imgsrc: "/media/images/websiteProject.png",
                            description: "This is the...."
                        },
                        {
                            name: "HoloLens",
                            imgsrc: "/media/images/hololensProject.png",
                            description: "This is the...."
                        },
                        {
                            name: "Mapping",
                            imgsrc: "/media/images/mappingProject.png",
                            description: "This is the...."
                        }
                    ]
                },
                products:
                {
                    items: [
                        {
                            name: "Robot Mayhem",
                            level: "4",
                            difficulty: "4",
                            description: "Following all of the steps in this product will....",
                            imgsrc: "/media/images/robotmayhem.png",
                            price: "29.99"
                        }
                    ]
                },
                classes:
                {
                    items: [
                        {
                            name: "Object Oriented Concepts",
                            level: 3,
                            difficulty: 4,
                            description: "In this series of classes, students will learn....",
                            imgsrc: "/media/images/OOP.png",
                            price: 149.99,
                            location: "Weston Community Center~123 Main Street~Room 255~Westport, CT 06823",
                            instructor: "Peter Leventhal",
                            schedule: {
                                items: [
                                    {when: "Sunday, March 16, 2016, 7-8pm"},
                                    {when: "Sunday, March 23, 2016, 7-8pm"},
                                    {when: "Sunday, March 30, 2016, 7-8pm"},
                                    {when: "Sunday, March 37, 2016, 7-8pm"},
                                    {when: "Sunday, March 44, 2016, 7-8pm"},
                                    {when: "Sunday, March 51, 2016, 7-8pm"},
                                    {when: "Sunday, March 58, 2016, 7-8pm"},
                                ]
                            },
                            notes: "Please send your child with a laptop or tablet (iPad or ChromeBook), but if you can't, some will be available. Please call beforehand if you will need one.",
                            phone: "(203) 544-1966"
                        },
                        {
                            name: "Building a Web Site",
                            level: 2,
                            difficulty: 2,
                            description: "In this series of classes, students will learn....",
                            imgsrc: "/media/images/website.png",
                            price: 129.99,
                            location: "Weston Community Center~123 Main Street~Room 255~Westport, CT 06823",
                            instructor: "Linda Scarpetti",
                            schedule: {
                                items: [
                                    {when: "Sunday~March 16, 2016~6-7pm"},
                                    {when: "Sunday~March 23, 2016~6-7pm"},
                                    {when: "Sunday~March 30, 2016~6-7pm"},
                                    {when: "Sunday~March 37, 2016~6-7pm"},
                                    {when: "Sunday~March 44, 2016~6-7pm"},
                                    {when: "Sunday~March 51, 2016~6-7pm"},
                                    {when: "Sunday~March 58, 2016~6-7pm"},
                                ]
                            },
                            notes: "Please bring a laptop or tablet (iPad or ChromeBook), but if not, some will be available. Please call beforehand if you will need one.",
                            phone: "(203) 544-1966"
                        }
                    ]
                }
            });
        } catch(e) {

            res.json({success: false, message: e.message});
        }
    }
};

