//////////////////////////////////
// Cron.js module
//
//////////////////////////////////

var schedule = require("node-schedule");
var async = require("async");
var nodemailer = require("nodemailer");

module.exports = function Cron(app, sql, logger) {

	var self = this;					// Über closure.

	self.dbname = app.get("dbname");

	try {

		// Schedule a job to run every night at 1am to send emails.
		var rule = new schedule.RecurrenceRule();
		// rule.hour = 1;
		rule.minute = [0,15,30,45];

		var job = schedule.scheduleJob(rule, function() {

				try {

					console.log('');
					console.log('');
					console.log('MY CHRON HAS HIT');
					console.log('');
					console.log('');

				} catch(ex) {
					throw ex;
				}
			}
		);
	} catch(e) {
		throw e;
	}
}

