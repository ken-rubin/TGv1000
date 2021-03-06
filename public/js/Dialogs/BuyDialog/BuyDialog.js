////////////////////////////////////
// BuyDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the BuyDialog constructor function.
			var functionBuyDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Buying shows a series of dialogs, each closing the prior, but being able to back up to the prior, including OpenProjectDialog in its state when closed.
					//
					// User has already selected a candidate from the ScrollRegion in OpenProjectDialog. That project has been loaded and has been found to be a Purchasable Project.
					//
					// In Buy1 we will display the contents of m_clProject.specialProjectData.classData or .onlineClassData or .productData.
					//
					// If user decides to purchase, we replace dialog with a credit card entry form, Buy2. On Purchase button click, we go to the
					// server to process the charge the credit card.
					// If unsuccessful, we show errorHelper.
					// If successful, we call the server to save the project (with specialProjectData.openMode set to 'bought'). Success returns the project
					// with its new id. We set other specialProjectData, etc.
					//
					// On success from the save, we close Buy2 and open Buy3. We display the new version of the project in Buy3. Buy3 gives the user a chance to 
					// change the name, insert tags, change the picture, etc. These changes are kept in memory until the project is saved.
					// When Buy3 is closed the workspace is shown with the newly purchased project. User cannot back up out of Buy3 since the CC has been charged and
					// the user's new project has been created and written to the DB.

					self.create = function(ppData) {

						try {

							m_ppData = ppData;

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/BuyDialog/BuyDialog"
								}, 
								dataProperty: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionRenderJadeSnippetResponse).error(errorHelper.show);

							return null;
						} catch (e) {

							return e;
						}
					};

					self.closeYourself = function() {

						m_dialog.close();
					}

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the PropertysDialog jade HTML-snippet.
							BootstrapDialog.show({

								closable: false,
								title: "Decide Whether or Not to Purchase",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Enter secure charge information",
					            		id: 'BuyBtn',
					            		cssClass: "btn-primary",
					            		action: function(){

					            			m_functionBuy();
					            		}
					            	},
					            	{
						                label: "Don't buy.",
						                id: 'CancelBtn',
						                icon: "glyphicon glyphicon-remove-circle",
						                cssClass: "btn-warning",
						                action: function(dialogItself){

						                    dialogItself.close();
						                    // client.unloadProject(null, false);	// No callback; no abandon dialog.
						                }
					            	}
					            ],
					            draggable: true,
					            onshown: m_functionOnShownDialog
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up Property handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;

							// Get the appropriate snippet and display the second form of the buy dialog.
							// If this new project is a Class or Product, fetch the specific jade/html template to insert into the dialog.
							var templateToGet = null;
							if (m_ppData.isClass) {

								templateToGet = 'Dialogs/NewProjectDialog/classDetails.jade';

							} else if (m_ppData.isProduct) {

								templateToGet = 'Dialogs/NewProjectDialog/productDetails.jade';

							} else if (m_ppData.isOnlineClass) {

								templateToGet = 'Dialogs/NewProjectDialog/onlineClassDetails.jade';
							}
							if (templateToGet) {

								// Get the dialog DOM.
								$.ajax({

									cache: false,
									data: { 

										templateFile: templateToGet
									}, 
									dataType: "HTML",
									method: "POST",
									url: "/renderJadeSnippet"
								}).done(m_functionRenderJadeSnippetResponse2).error(errorHelper.show);
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionRenderJadeSnippetResponse2 = function(htmlData) {

						if (!Number.prototype.dollarFormat) {
							Number.prototype.dollarFormat = function() {
								if (!isNaN(this)) {
									var n = this < 0 ? true : false,
										a = (n ? this * -1 : this).toFixed(2).toString().split("."),
										b = a[0].split("").reverse().join("").replace(/.{3,3}/g, "$&,").replace(/\,$/, "").split("").reverse().join("");
									return((n ? "(" : "") + "$" + b + "." + a[1] + (n ? ")" : ""));
								}
							};
						}

						$("#DescriptionDiv").html(htmlData);
						$("#ProjectName").focus();
						$("#ProjectName").val(m_ppData.projectName);
						$("#ProjectName")[0].setSelectionRange(0, 0);	// The [0] changes jQuery object to DOM element.

						$("#ProjectDescription").val(m_ppData.projectDescription);

						$("#BuyHeader").empty();
						if (m_ppData.isClass) {

							var strNewBuyHeader = '<h4 style="margin-top:-5px;"><b>Here are the details for the Class you selected.</b></h4>';
							strNewBuyHeader += '<h5>If you want to enroll, click the <b><i>Enter secure charge information</i></b> button.</h5>';
							strNewBuyHeader += '<h5>After completing the purchase, you will receive two emails: a charge receipt and a reminder with dates, times and location.</h5>';
							$("#BuyHeader").append(strNewBuyHeader);

							$(".OnlyForPrivileged").css("display","none");

							// jQuery(function($){
							// 	$("#Phone").mask("(999) 999-9999? x99999");
							// 	$("#Zip").mask("99999");
							// 	$("#Price").mask("$999.99");
							// 	for (var i=1; i<=8; i++) {
							// 		$("#When" + i).mask("9999-99-99         99:99 - 99:99")
							// 	}
							// });
							$("#ProjectDescription").val(m_ppData.classDescription);
							$("#InstructorFirst").val(m_ppData.instructorFirstName);
							$("#InstructorLast").val(m_ppData.instructorLastName);
							$("#Phone").val(m_ppData.instructorPhone);
							$("#Facility").val(m_ppData.facility);
							$("#Address").val(m_ppData.address);
							$("#Room").val(m_ppData.room);
							$("#City").val(m_ppData.city);
							// state combo
							if(m_ppData.state.length > 0) {
								$('#State > option').each(
									function() {
 										if ($(this).text() === m_ppData.state)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							$("#Zip").val(m_ppData.zip);
							// when array
							m_ppData.schedule = JSON.parse(m_ppData.schedule);
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = m_ppData.schedule[i-1];	// {date: 'UTC datetime including from', duration: in ms}
								$("#When" + i).val(m_getWhenString(whenIth));
							}
							// level combo
							if(m_ppData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === m_ppData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(m_ppData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === m_ppData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}

							m_dPriceToCharge = m_ppData.price;

							// formatted price
							$("#Price").val(m_ppData.price.dollarFormat());
							$("#Notes").val(m_ppData.classNotes);
						
						} else if (m_ppData.isProduct) {

							var strNewBuyHeader = '<h4 style="margin-top:-5px;"><b>Here are the details for the Product you selected.</b></h4>';
							strNewBuyHeader += '<h5>If you want to buy it, click the <b><i>Enter secure charge information</i></b> button.</h5>';
							strNewBuyHeader += '<h5>After completing the purchase, you will receive two emails: a charge receipt and one with information on getting started.</h5>';
							$("#BuyHeader").append(strNewBuyHeader);
							jQuery(function($){
								$("#Price").mask("$999.99");
							});
							$("#ProjectDescription").val(m_ppData.productDescription);
							
							// level combo
							if(m_ppData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === m_ppData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							
							// difficulty combo
							if(m_ppData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === m_ppData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							
							m_dPriceToCharge = m_ppData.price;

							// formatted price
							$("#Price").val(m_ppData.price.dollarFormat());
						
						} else if (m_ppData.isOnlineClass) {

							var strNewBuyHeader = '<h4 style="margin-top:-5px;"><b>Here are the details for the Online Class you selected.</b></h4>';
							strNewBuyHeader += '<h5>If you want to enroll, click the <b><i>Enter secure charge information</i></b> button.</h5>';
							strNewBuyHeader += '<h5>After completing the purchase, you will receive two emails: a charge receipt and one with login information.</h5>';
							$("#BuyHeader").append(strNewBuyHeader);
							jQuery(function($){
								$("#Price").mask("$999.99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999-99-99         99:99 - 99:99")
								}
							});
							$("#ProjectDescription").val(m_ppData.classDescription);
							$("#InstructorFirst").val(m_ppData.instructorFirstName);
							$("#InstructorLast").val(m_ppData.instructorLastName);
							$("#Email").val(m_ppData.instructorEmail);
							// when array
							m_ppData.schedule = JSON.parse(m_ppData.schedule);
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = m_ppData.schedule[i-1];	// {date: 'UTC datetime including from', duration: in ms}
								$("#When" + i).val(m_getWhenString(whenIth));
							}
							// level combo
							if(m_ppData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === m_ppData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(m_ppData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === m_ppData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							m_dPriceToCharge = m_ppData.onlineClassData.price;
							// formatted price
							$("#Price").val(m_ppData.price.dollarFormat());
							$("#Notes").val(m_ppData.classNotes);
						}

						$("#TheFieldset").prop("disabled", true);
					}

					var m_getWhenString = function(whenIth) {

						// whenIth is JS object of form { date: 'utc datetime of class start', duraction: in ms}.
						// date could be ''. Duration could be 0. If one of them is, so is the other.
						// If non-empty, return string like '2016/02/01.........20:00.-.20:55' in user's timezone.
						// If empty, return ''.
						if (whenIth.date.length === 0) { return ''; }

						var mntDate = moment(whenIth.date).local();
						var strDate = mntDate.format('YYYY-MM-DD');
						var strFrom = mntDate.format('HH:mm');
						var mntEndDate = mntDate.add(whenIth.duration - 60000, 'ms');
						var strThru = mntEndDate.format('HH:mm');
						return strDate + '         ' + strFrom + ' - ' + strThru;
					}

					var m_functionValCCFields = function() {

						m_strChargeNumber = $("#ChargeNumber").val().trim();	//.replace(/\D+/g, '');	// Remove everything but digits.
						m_strCVC = $("#CVC").val().trim();
						var t = $("#ExpMo option:selected").val();
						m_iExpMo = parseInt(t, 10) + 1;
						t = $("#ExpYr option:selected").val();
						m_iExpYr = parseInt(t, 10) + 2016;

						var errFields = [];
						if (!Stripe.card.validateCardNumber(m_strChargeNumber)) {
							errFields.push('Card number');
						}
						if (!Stripe.card.validateCVC(m_strCVC)) {
							errFields.push('Security code');
						}

						if (errFields.length === 0) {
							return '';
						}

						if (errFields.length === 1) {
							return 'The ' + errFields[0] + ' appears to be invalid.';
 						} else {
							return 'Both the ' + errFields[0] + ' and the ' + errFields[1] + ' appear to be invalid.';
 						}
					}

					var m_functionBuy = function() {

						switch (m_buyMode) {

							case 1: 	
								// Reveal the charge form. Change BuyBtn text. Set mode to 2.
								$("#ChargeSection").css("display", "block");
								$("#ChargeNumber").focus();
								$("#BuyBtn").text("Complete the purchase");
								m_buyMode = 2;
								break;

							case 2: 	
								var errMsg = m_functionValCCFields();
								if (errMsg.length > 0) {

									errorHelper.show(errMsg);
									return;
								}

								// We're proceeding. Disable #BuyBtn to prevent double-clicking.
								$("#BuyBtn").prop("disabled", true);
								// We're also disabling #CancelBtn giving the user no way to screw things up during Ajax processing.
								$("#CancelBtn").prop("disabled", true);

								// 2a. Ajax to TG server to get stripe's PK (based on whether we're running in dev or prod). Set the PK in Stripe.
								m_functionBuyStep2a(
									function(err) {

										if (err) {

											errorHelper.show('We had a problem before submitting your charge information. Tech support has been notified and you will receive an email when you can try again. Sorry.');
											$("#BuyBtn").prop("disabled", false);
											$("#CancelBtn").prop("disabled", false);
											return;
										}

										// 2b. Ajax to Stripe (via included Stripe.js script) to request a token representing CC info.
										m_functionBuyStep2b(
											function(err, token) {

												if (err) {

													errorHelper.show(err);	// This will usually display an error in full sentence form from Stripe.
													$("#BuyBtn").prop("disabled", false);
													$("#CancelBtn").prop("disabled", false);
													return;
												}

												// 2c. Ajax to TG server again to complete CC charging using the m_token. Send email to user if charge succeeds.
												m_functionBuyStep2c(
													token, 
													function(err, chargeId) {
														
														if (err) {

															// This is most likely a charge card error.
															errorHelper.show(err);
															$("#BuyBtn").prop("disabled", false);
															$("#CancelBtn").prop("disabled", false);
															return;
														}

														// m_ppData doesn't have a full project. We have to go get the correct project so that we can convert it into a "bought" project with suitable data changes.
														var exceptionRet = client.openProjectFromDBNoLoadIntoManager(m_ppData.projectId, 'new',
															function() {

																client.project.ownedByUserId = parseInt(g_profile['userId'], 10);
																client.project.chargeId = chargeId;

																if (client.project.specialProjectData.hasOwnProperty('classData')) {
																	delete client.project.specialProjectData.classData;
																	client.project.isClass = false;
																	client.project.specialProjectData.classProject = false;
																} else if (client.project.specialProjectData.hasOwnProperty('onlineClassData')) {
																	delete client.project.specialProjectData.onlineClassData;
																	client.project.isOnlineClass = false;
																	client.project.specialProjectData.onlineClassProject = false;
																} else if (client.project.specialProjectData.hasOwnProperty('productData')) {
																	delete client.project.specialProjectData.productData;
																	client.project.isProduct = false;
																	client.project.specialProjectData.productProject = false;
																}
																client.project.specialProjectData.userAllowedToCreateEditPurchProjs = false;
																client.project.specialProjectData.ownedByUser = true;
																client.project.specialProjectData.normalProject = true;
																client.project.specialProjectData.openMode = 'bought';

																// Generate a unique-ish name.
																var momNow = new moment();
																client.project.name += "_" + momNow.format("MM-DD-YYYY");

																// Now we need to save the project to the DB and load it into manager.
																// We can't use client.saveProjectToDB because it doesn't take a project object, but instead it gets the project via manager.save().
																// After the save, the project is returned to saveProjectToDBNoGetFromManager. That function will load it into manager.
																var exceptionRet = client.saveProjectToDBNoGetFromManager(
																	function(err) {

																		if (err) {

																			errorHelper.show("An unexpected error occurred: after we processed your credit card, we could not save your purchased project.<br><br>Please contact us so we can investigate and process a refund. Tell tech support error received was: " + err.message);

																		} else {

																			self.closeYourself();
																			errorHelper.show("Your purchase is complete, and your project has been saved with the unique name <b>" + client.project.name + "</b>.<br><br>You may wish to save it again (use the menu item Projects/Save Project) and choose a name more to your liking, maybe some search tags, a description and even a new project image.<br><br>Whatever you like. It's yours now!",
																				250000);	// The purpose of the large autoclose number (250 seconds) is not really to autoclose errorHelper. It's used so the dialog title is "Note" instead of "Error".
																		}
																	}
																);
															}
														);
													}
												);
											}
										);
									}
								);
								break;
						}
					}

					// 2a. Ajax to TG server to get stripe's PK (based on whether we're running in dev or prod).
					//     Set the PK in Stripe.
					var m_functionBuyStep2a = function(callback) {

						try {

		                    var posting = $.post("/BOL/UtilityBO/GetStripePK",
		                    		{},
		                            'json');
		                    posting.done(function(data) {

		                    	if (data.success) {

                                    // Set the publish key here, now that it is known. Why 'publish' key? Why not 'public' key? Note Stripe's method name.
                                    Stripe.setPublishableKey(data.pk);
                                    return callback(null);
		                    	}

		                    	return callback(new Error("Could not retrieve public key."));
		                    });
		                } catch(e) { return callback(e); }
		            }

					// 2b. Ajax to Stripe (via included Stripe.js script) to request a token representing CC info.
					var m_functionBuyStep2b = function(callback) {

						try {

                            // Create the token to send to the server.
                            Stripe.card.createToken(
	                            {
	                                number: m_strChargeNumber,
	                                cvc: m_strCVC,
	                                exp_month: m_iExpMo,
	                                exp_year: m_iExpYr
	                            }, 
	                            function (status, response) {
                            
                                    if (response.error) { return callback(response.error, null); }	// response.error has its own message property.

									// response.id is the safe-token.                                    
                                    return callback(null, response.id);
                            	}
                            );
						} catch(e) { return callback(new Error("We couldn't contact our charge processor. TechGroms support has been notified. We will send an email to you when the problem is resolved. Sorry."), null); }
					}

					// 2c. Ajax to TG server again to complete CC charging using m_token. Send email to user if charge succeeds.
					var m_functionBuyStep2c = function(token, callback) {

						try {

		                    var posting = $.post("/BOL/UtilityBO/ProcessCharge",
		                    		{
		                    			token: token,
		                    			dAmount: m_dPriceToCharge,
		                    			descriptionForReceipt: 'Purchase of NextWaveCoders product: ' + m_ppData.projectName,	// An arbitrary string to be attached to the charge object. It is included in the receipt email sent to the user by Stripe.
		                    			statementDescriptor: 'NextWaveCoders'		// An arbitrary string to be displayed (most of the time) on user's credit card statement. Limited to 22 chars, so kind of useless.
		                    		},
		                            'json');
		                    posting.done(function(data) {

		                    	if (data.success) {

                                    return callback(null, data.chargeId);
		                    	}

		                    	return callback(data.message);
		                    });
		                } catch(e) { return callback(e); }
					}
				} catch (e) { errorHelper.show(e); }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_ppData = null;
				var m_buyMode = 1;
				var m_strChargeNumber;
				var m_iExpMonth;
				var m_iExpYear;
				var m_strCVC;
				var m_dPriceToCharge;
			};

			// Return the constructor function as the module object.
			return functionBuyDialog;

		} catch (e) { errorHelper.show(e); }
	});
