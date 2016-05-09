////////////////////////////////////////
// MailWrapper - a wrapper for nodemailer.
//

var nodemailer = require("nodemailer");

module.exports = function MailWrapper() {

    var self = this;                // Über closure.

    ////////////////////////////////////
    // Public method

    self.mail = function (options, callback) {

        try {

            var smtpTransport = nodemailer.createTransport('smtps://techgroms@gmail.com:Albatross!1@smtp.gmail.com');
            smtpTransport.verify(function(err, success) {
                if (err) {
                    return callback(err);
                }
            });

            mailOptions = options;

            smtpTransport.sendMail(mailOptions, function(error, response){
            
                if (error) {
                    return callback(error);
                }

                // If you don't want to use this transport object anymore, uncomment following line
                //smtpTransport.close(); // shut down the connection pool, no more messages

                return callback(null);

            });
        } catch (e) {

            return callback(e);
        }
	}
}