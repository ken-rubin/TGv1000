//////////////////////////////////
// ValidateBO.js module
//
//////////////////////////////////

var bcrypt = require("bcrypt-nodejs");
module.exports = function ValidateBO(app, sql) {

    var self = this;                // Über closure.

    self.dbname = app.get("dbname");
    
    ////////////////////////////////////
    // Public methods
    
    // Router handler function.
    self.routeUserAuthenticate = function (req, res) {
    
        // req.body.userName
        // req.body.password
        
        try {
        
            console.log("Entered routeUserAuthenticate with req.body = " + JSON.stringify(req.body));

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


                        } else {

                            // Retrieve and validate password against hash.
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

