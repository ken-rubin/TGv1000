//////////////////////////////////
// Cron.js module
//
//////////////////////////////////

var schedule = require("node-schedule");
var async = require("async");
var nodemailer = require("nodemailer");
var moment = require("moment");

module.exports = function Cron(app, sql, logger) {

	var self = this;					// Über closure.

	self.dbname = app.get("dbname");

	try {

		// Schedule a job to run every night at 1am to send emails.
		var rule = new schedule.RecurrenceRule();
		rule.hour = 1;

		var job = schedule.scheduleJob(rule, function() {

				try {

					// These are the emails we need to send:
					// (1) Class someone has registered and paid for has first class one week from today.
					// (2) Online class someone has registered and paid for has first class one week from today.
					// (3) Someone bought a Product two weeks ago and hasn't touched it. (How to know?) "Do you need help?"

					async.series(
						[
							// (1) Classes
							function(cb) {
								try {
									async.waterfall(
										[
											// Retrieve all active classes.
											// We understand that at any step we could have 0 classes left. That should be handled properly.
											function(cb) {
                                				
                                				var strQuery = "select p.id, cl.baseProjectId, cl.schedule, cl.active, cl.facility, cl.address, cl.room, cl.city, cl.state, cl.zip, cl.instructorPhone from " + self.dbname + "projects p inner join " + self.dbname + "classes cl on cl.baseProjectId=p.id where cl.active=1;";
                                				sql.execute(strQuery,
                                					function(rows) {
                                						return cb(null, {classes: rows});
                                					},
                                					function(strError) {
                                						return cb(new Error(strError), null);
                                					}
                                				);
											},
											// Filter out any rows in passOn.classes that don't start in 7 days.
											function(passOn, cb) {
					
					                            var mnt7 = moment().add(7, 'days');

					                            for (var i=0; i < passOn.classes.length; i++) {

					                            	var classIth = passOn.classes[i];
					                            	var strClass1Date = JSON.parse(classIth.schedule)[0].date;
               	                                    var mntClass1Date = moment(strClass1Date).local();
               	                                    if (!mnt7.isSame(mntClass1Date, 'day')) {
               	                                    	classIth.remove = true;
               	                                    	classIth.mntClass1Date = mntClass1Date;
               	                                    } else {
               	                                    	classIth.remove = false;
               	                                    }
					                            }

			                                    for (var i = passOn.classes.length - 1; i >= 0; i--) {
			                                        if (passOn.classes[i].remove) {
			                                            passOn.classes.splice(i, 1);
			                                        }
			                                    }

			                                    return cb(null, passOn);
											},
											// In async.eachSeries for each class left in passOn.classes, retrieve all buyers and send email to each.
											function(passOn, cb) {
												async.eachSeries(passOn.classes,
													function(classIth, cb) {

														var strQuery = "select distinct u.userName, u.firstName from " + self.dbname + "user u inner join " + self.dbname + "projects p on u.id = p.ownedByUserId where p.comicProjectId=" + classIth.baseProjectId + " and p.isClass=0;";
														sql.execute(strQuery,
															function(rows) {

																async.eachSeries(rows,
																	function(userIth, cb) {

																		// Send email about upcoming classIth to userIth.
																		try {

													                        var smtpTransport = nodemailer.createTransport('smtps://techgroms@gmail.com:Albatross!1@smtp.gmail.com');

													                        smtpTransport.verify(function(err, success) {
													                            if (err) {
													                                return cb(new Error("Error setting up transport for 7-day warning email: " + err), null);
													                            }
													                        });

													                        // setup email data with unicode symbols
													                        var mailOptions = null;

													                        var aORz = (userIth.userName === 'a@a.com' || userIth.userName === 'z@z.com');
													                        var when = classIth.mntClass1Date.format('dddd, MMMM Do YYYY [at] h:mm:ss a');
													                        mailOptions = {
													                 
													                            from: "TechGroms <techgroms@gmail.com>", // sender address
													                            to: (!aORz) ? userIth.userName : 'jerry@rubintech.com', // list of receivers -- eventually add ken and john
													                            subject: "Your nextwavecoders.com class is coming up", // Subject line
													                            text: "Hi, " + userIth.firstName + ". " +
													                            "This is a reminder that the coding class you signed up for will have its first session in one week, " +
													                            "on " + when + ". The class takes place at " + classIth.facilty + ", Room " + classIth.room + ", " + classIth.address + ", " + classIth.city +
													                            ", " + classIth.state + " " + classIth.zip + "." +
													                            "\r\n\r\nIf you don't have a wifi-capable computer or tablet, please let us know as soon as possible by calling " + classIth.instructorPhone + "." +
													                            "\r\n\r\nWe sincerely look forward to seeing you at " + classIth.name + "." +
   													                            "\r\n\r\n\r\n\r\nWarm regards, The nextwavecoders Team",
													                            html: "Hi, " + userIth.firstName + ". " +
													                            "This is a reminder that the coding class you signed up for will have its first session in one week, " +
													                            "on " + when + ". The class takes place at " + classIth.facilty + ", Room " + classIth.room + ", " + classIth.address + ", " + classIth.city +
													                            ", " + classIth.state + " " + classIth.zip + "." +
													                            "<br><br>If you don't have a wifi-capable computer or tablet, please let us know as soon as possible by calling " + classIth.instructorPhone + "." +
													                            "<br><br>We sincerely look forward to seeing you at " + classIth.name + "." +
   													                            "<br><br><br><br>Warm regards, The nextwavecoders Team"
													                        };

													                        // send mail with defined transport object
													                        smtpTransport.sendMail(mailOptions, function(error, response){
													                        
													                            if (error) {
													                                return cb(new Error("Error sending 7-day warning email: " + error.toString()), null);
													                            }

													                            // If you don't want to use this transport object anymore, uncomment following line
													                            //smtpTransport.close(); // shut down the connection pool, no more messages

													                            return cb(null);

													                        });
																		} catch(e) {
																			return cb(e);
																		}
																	},
																	function(err) {
																		return cb(err);
																	}
																);
															},
															function(strError) {
																return cb(new Error(strError));
															}
														);
													},
													// Inner inner async.eachSeries final function.
													function(err) {
														return cb(err);
													}
												);
											}
										],
										// Inner async.waterfall final function.
										function(err, passOn) {
											return cb(err);
										}
									);
								} catch(e) {
									return cb(e);
								}
							},
							// (2) Online classes
							function(cb) {
								try {
									async.waterfall(
										[
											// Retrieve all active classes.
											// We understand that at any step we could have 0 classes left. That should be handled properly.
											function(cb) {
                                				
                                				var strQuery = "select p.id, cl.baseProjectId, cl.schedule, cl.active, cl.instructorEmail from " + self.dbname + "projects p inner join " + self.dbname + "onlineclasses cl on cl.baseProjectId=p.id where cl.active=1;";
                                				sql.execute(strQuery,
                                					function(rows) {
                                						return cb(null, {classes: rows});
                                					},
                                					function(strError) {
                                						return cb(new Error(strError), null);
                                					}
                                				);
											},
											// Filter out any rows in passOn.classes that don't start in 7 days.
											function(passOn, cb) {
					
					                            var mnt7 = moment().add(7, 'days');

					                            for (var i=0; i < passOn.classes.length; i++) {

					                            	var classIth = passOn.classes[i];
					                            	var strClass1Date = JSON.parse(classIth.schedule)[0].date;
               	                                    var mntClass1Date = moment(strClass1Date).local();
               	                                    if (!mnt7.isSame(mntClass1Date, 'day')) {
               	                                    	classIth.remove = true;
               	                                    	classIth.mntClass1Date = mntClass1Date;
               	                                    } else {
               	                                    	classIth.remove = false;
               	                                    }
					                            }

			                                    for (var i = passOn.classes.length - 1; i >= 0; i--) {
			                                        if (passOn.classes[i].remove) {
			                                            passOn.classes.splice(i, 1);
			                                        }
			                                    }

			                                    return cb(null, passOn);
											},
											// In async.eachSeries for each class left in passOn.classes, retrieve all buyers and send email to each.
											function(passOn, cb) {
												async.eachSeries(passOn.classes,
													function(classIth, cb) {

														var strQuery = "select distinct u.userName, u.firstName from " + self.dbname + "user u inner join " + self.dbname + "projects p on u.id = p.ownedByUserId where p.comicProjectId=" + classIth.baseProjectId + " and p.isClass=0;";
														sql.execute(strQuery,
															function(rows) {

																async.eachSeries(rows,
																	function(userIth, cb) {

																		// Send email about upcoming classIth to userIth.
																		try {

													                        var smtpTransport = nodemailer.createTransport('smtps://techgroms@gmail.com:Albatross!1@smtp.gmail.com');

													                        smtpTransport.verify(function(err, success) {
													                            if (err) {
													                                return cb(new Error("Error setting up transport for 7-day warning email: " + err), null);
													                            }
													                        });

													                        // setup email data with unicode symbols
													                        var mailOptions = null;

													                        var aORz = (userIth.userName === 'a@a.com' || userIth.userName === 'z@z.com');
													                        var when = classIth.mntClass1Date.format('dddd, MMMM Do YYYY [at] h:mm:ss a');
													                        mailOptions = {
													                 
													                            from: "TechGroms <techgroms@gmail.com>", // sender address
													                            to: (!aORz) ? userIth.userName : 'jerry@rubintech.com', // list of receivers -- eventually add ken and john
													                            subject: "Your nextwavecoders.com class is coming up", // Subject line
													                            text: "Hi, " + userIth.firstName + ". " +
													                            "This is a reminder that the online coding class you signed up for will have its first session in one week, " +
													                            "on " + when + ". The class takes place at " + classIth.facilty + ", Room " + classIth.room + ", " + classIth.address + ", " + classIth.city +
													                            ", " + classIth.state + " " + classIth.zip + "." +
													                            "\r\n\r\nIf you don't have a wifi-capable computer or tablet, please let us know as soon as possible by calling " + classIth.instructorPhone + "." +
													                            "\r\n\r\nWe sincerely look forward to seeing you at " + classIth.name + "." +
   													                            "\r\n\r\n\r\n\r\nWarm regards, The nextwavecoders Team",
													                            html: "Hi, " + userIth.firstName + ". " +
													                            "This is a reminder that the coding class you signed up for will have its first session in one week, " +
													                            "on " + when + ". The class takes place at " + classIth.facilty + ", Room " + classIth.room + ", " + classIth.address + ", " + classIth.city +
													                            ", " + classIth.state + " " + classIth.zip + "." +
													                            "<br><br>If you don't have a wifi-capable computer or tablet, please let us know as soon as possible by calling " + classIth.instructorPhone + "." +
													                            "<br><br>We sincerely look forward to seeing you at " + classIth.name + "." +
   													                            "<br><br><br><br>Warm regards, The nextwavecoders Team"
													                        };

													                        // send mail with defined transport object
													                        smtpTransport.sendMail(mailOptions, function(error, response){
													                        
													                            if (error) {
													                                return cb(new Error("Error sending 7-day warning email: " + error.toString()), null);
													                            }

													                            // If you don't want to use this transport object anymore, uncomment following line
													                            //smtpTransport.close(); // shut down the connection pool, no more messages

													                            return cb(null);

													                        });
																		} catch(e) {
																			return cb(e);
																		}
																	},
																	function(err) {
																		return cb(err);
																	}
																);
															},
															function(strError) {
																return cb(new Error(strError));
															}
														);
													},
													// Inner inner async.eachSeries final function.
													function(err) {
														return cb(err);
													}
												);
											}
										],
										// Inner async.waterfall final function.
										function(err, passOn) {
											return cb(err);
										}
									);
								} catch(e) {
									return cb(e);
								}
							},
							// (3) Untouched Products.
							function(cb) {
								// Not implemented yet.
								return cb(null);
							}
						],
						// Outer async.series final function.
						function(err) {
							if (err) {
								console.log('Encountered this error in email cron job: ' + err.msg);	// console.log just isn't going to cut it.
							}
						}
					);
				} catch(ex) {
					throw ex;
				}
			}
		);
	} catch(e) {
		throw e;	// Who's catching this error?????
	}
}

