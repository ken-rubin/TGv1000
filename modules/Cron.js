//////////////////////////////////
// Cron.js module
//
//////////////////////////////////

var schedule = require("node-schedule");
var async = require("async");
var moment = require("moment-timezone");

module.exports = function Cron(app, sql, logger, mailWrapper) {

	var self = this;					// Über closure.

	self.dbname = app.get("dbname");

	try {

		// Schedule a job to run every night at 1am to send emails.
		var rule1 = new schedule.RecurrenceRule();
		rule1.hour = 1;

		var job1 = schedule.scheduleJob(rule1, function() {

				try {

					// These are the emails we need to send:
					// (1) Class someone has registered and paid for has first class one week from today.
					// (2) Online class someone has registered and paid for has first class one week from today.
					// (3) Someone bought a Product two weeks ago and hasn't touched it. "Do you need help?"

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

													                        var aORz = (userIth.userName === 'a@a.com' || userIth.userName === 'z@z.com');
													                        var when = classIth.mntClass1Date.format('dddd, MMMM Do YYYY [at] h:mm:ss a');
													                        mailOptions = {
													                 
													                            from: "TechGroms <techgroms@gmail.com>", // sender address
													                            to: (!aORz) ? userIth.userName : 'jerry@rubintech.com, ken.rubin@live.com, jdsurf@gmail.com',
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

													                        mailWrapper.mail(mailOptions, 
													                        	function(error) {

													                            	if (error) {
													                                	return cb(new Error("Error sending 7-day warning email: " + error.toString()), null);
													                            	}

													                            	return cb(null);
													                        	}
													                        );
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

													                        var aORz = (userIth.userName === 'a@a.com' || userIth.userName === 'z@z.com');
													                        var when = classIth.mntClass1Date.format('dddd, MMMM Do YYYY [at] h:mm:ss a');
													                        mailOptions = {
													                 
													                            from: "TechGroms <techgroms@gmail.com>", // sender address
													                            to: (!aORz) ? userIth.userName : 'jerry@rubintech.com', // list of receivers -- eventually add ken and john
													                            subject: "Your nextwavecoders.com class is coming up", // Subject line
													                            text: "Hi, " + userIth.firstName + ". " +
													                            "This is a reminder that the online coding class you signed up for will have its first session in one week, " +
													                            "on " + when + "." +
													                            // Add in URL, etc.
   													                            "\r\n\r\n\r\n\r\nWarm regards, The nextwavecoders Team",
													                            html: "Hi, " + userIth.firstName + ". " +
													                            "This is a reminder that the coding class you signed up for will have its first session in one week, " +
													                            "on " + when + "." +
													                            // Add URL, etc.
   													                            "<br><br><br><br>Warm regards, The nextwavecoders Team"
													                        };

													                        mailWrapper.mail(mailOptions,
													                        	function(error) {

													                        		if (error) {
													                                	return cb(new Error("Error sending 7-day warning email: " + error.toString()), null);
													                                }

														                            return cb(null);
													                        	}
													                        );
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

								try {

									async.waterfall(
										[
											// Retrieve id of all active base projects that are Products.
											function(cb) {
												var strQuery = "select baseProjectId from " + self.dbname + "products where active=1;";
												sql.execute(strQuery,
													function(rows) {
														return cb(null, { projectIds: rows });
													},
													function(strError) {
														return cb(new Error(strError), null);
													}
												);
											},
											// Construct an idString out of passOn.projectIds; retrieve all projects (where isProduct=0) in idString.
											function(passOn, cb) {
												var idString = '';
						                        for (var i = 0; i < passOn.projectIds.length; i++) {

						                            if (i > 0) {

						                                idString = idString + ',';
						                            }

						                            idString = idString + passOn.projectIds[i].baseProjectId.toString();
						                        }

						                        var strQuery = "select * from " + self.dbname + "projects p inner join " + self.dbname + "user u on u.id = p.ownedByUserId where p.isProduct=0;";
						                        sql.execute(strQuery,
						                        	function(rows) {
						                        		passOn.projectsUsers = rows;
						                        		return cb(null, passOn);
						                        	},
													function(strError) {
														return cb(new Error(strError), null);
													}
						                        );
											},
											// Check dates of passOn.projectsUsers to see if an email needs to be sent.
											function(passOn, cb) {

												async.eachSeries(passOn.projectsUsers,
													function(projectUserIth, cb) {

														try {
															
															// We have all the information to figure out if we need to send a Help? email to the user in projectUserIth.
															var momFirstSaved = moment(projectUserIth.firstSaved);
															var momLastSaved = moment(projectUserIth.lastSaved);

															if (momLastSaved.diff(momFirstSaved, 'days') !== 14) {
																// No email.
																return cb(null);
															}

									                        var aORz = (userIth.userName === 'a@a.com' || userIth.userName === 'z@z.com');
									                        var when = classIth.mntClass1Date.format('dddd, MMMM Do YYYY [at] h:mm:ss a');
									                        mailOptions = {
									                 
									                            from: "TechGroms <techgroms@gmail.com>", // sender address
									                            to: (!aORz) ? userIth.userName : 'jerry@rubintech.com, ken.rubin@live.com, jdsurf@gmail.com',
									                            subject: "We see you haven't gotten to your newwavecoders project in 2 weeks", // Subject line
									                            text: "Hi, " + userIth.firstName + ". " +
									                            // Add in stuff, etc.
										                        "\r\n\r\n\r\n\r\nWarm regards, The nextwavecoders Team",
									                            html: "Hi, " + userIth.firstName + ". " +
									                            // Add stuff, etc.
										                        "<br><br><br><br>Warm regards, The nextwavecoders Team"
									                        };

									                        mailWrapper.mail(mailOptions,
									                        	function(error) {

									                        		if (error) {

									                                	return cb(new Error("Error sending 7-day warning email: " + error.toString()), null);
									                                }

										                            return cb(null);
									                        	}
									                        );
														} catch(e) {
															return cb(e);
														}
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

		// Schedule a job to run every minute and check for expiring or expired waitlist invitees.
		var rule2 = new schedule.RecurrenceRule();
		rule2.minute = [new schedule.Range()]; // every minute

		var job2 = schedule.scheduleJob(rule2, function() {

				try {

					var strQuery = "select w.*, u.*, p.name from " + self.dbname + " waitlist w inner join user u on w.userId=u.id inner join projects p on p.id=w.projectId where dtInvited is not null;";
					sql.execute (
						strQuery,
						function(rows) {
							if (rows.length) {

								rows.forEach(row, 
									function() {

										// If within 4 hours of expiring, send a warning version of the invite.



										// If expired, send an expired email and, if there's someone else on the waitlist, invite that user, giving a new 24-hour deadline.


										// Some will be in their first 20 hours. We do nothing with them.
									}
								);
							}
						},
						function(strError) {
							throw new Error("Received this error fetching Invitees: " + strError);
						}
					);
				} catch(ex) {
					throw ex;
				}
			}
		)
	} catch(e) {
		console.log("***");
		console.log("CRON ERROR: " + e.message);
		console.log("***");
	}
}

