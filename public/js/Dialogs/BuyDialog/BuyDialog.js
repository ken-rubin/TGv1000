////////////////////////////////////
// BuyDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper", "Code/Types"], 
	function (snippetHelper, errorHelper, resourceHelper, Types) {

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

					self.create = function(clProject) {

						try {

							m_clProject = clProject;

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
						                    client.unloadProject(null, false);	// No callback; no abandon dialog.
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
							if (m_clProject.data.isClass) {

								templateToGet = 'Dialogs/NewProjectDialog/classDetails.jade';

							} else if (m_clProject.data.isProduct) {

								templateToGet = 'Dialogs/NewProjectDialog/productDetails.jade';

							} else if (m_clProject.data.isOnlineClass) {

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
						// $("#ProjectName").keyup(m_functionNameBlur);
						$("#ProjectName").val(m_clProject.data.name);
						$("#ProjectName")[0].setSelectionRange(0, 0);	// The [0] changes jQuery object to DOM element.

						$("#ProjectDescription").val(m_clProject.data.description);
						$("#ProjectTags").val(m_clProject.data.tags);

						// $("#ProjectDescription").blur(m_functionDescriptionBlur);
						// $("#ProjectTags").blur(m_functionTagsBlur);

						$("#BuyHeader").empty();
						if (m_clProject.data.specialProjectData.classProject) {

							var strNewBuyHeader = '<h4 style="margin-top:-5px;"><b>Here are the details for the Class you selected.</b></h4>';
							strNewBuyHeader += '<h5>If you want to enroll, click the <b><i>Enter secure charge information</i></b> button.</h5>';
							strNewBuyHeader += '<h5>After completing the purchase, you will receive two emails: a charge receipt and a reminder with dates, times and location.</h5>';
							$("#BuyHeader").append(strNewBuyHeader);
							jQuery(function($){
								$("#Phone").mask("(999) 999-9999? x99999");
								$("#Zip").mask("99999");
								$("#Price").mask("$999.99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999-99-99         99:99 - 99:99")
								}
							});
							$("#ProjectDescription").val(m_clProject.data.specialProjectData.classData.classDescription);
							$("#InstructorFirst").val(m_clProject.data.specialProjectData.classData.instructorFirstName);
							$("#InstructorLast").val(m_clProject.data.specialProjectData.classData.instructorLastName);
							$("#Phone").val(m_clProject.data.specialProjectData.classData.instructorPhone);
							$("#Facility").val(m_clProject.data.specialProjectData.classData.facility);
							$("#Address").val(m_clProject.data.specialProjectData.classData.address);
							$("#Room").val(m_clProject.data.specialProjectData.classData.room);
							$("#City").val(m_clProject.data.specialProjectData.classData.city);
							// state combo
							if(m_clProject.data.specialProjectData.classData.state.length > 0) {
								$('#State > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.classData.state)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							$("#Zip").val(m_clProject.data.specialProjectData.classData.zip);
							// when array
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = m_clProject.data.specialProjectData.classData.schedule[i-1];	// {date: 'UTC datetime including from', duration: in ms}
								$("#When" + i).val(m_getWhenString(whenIth));
							}
							// level combo
							if(m_clProject.data.specialProjectData.classData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.classData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(m_clProject.data.specialProjectData.classData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.classData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}

							m_dPriceToCharge = m_clProject.data.specialProjectData.classData.price;

							// formatted price
							$("#Price").val(m_clProject.data.specialProjectData.classData.price.dollarFormat());
							$("#Notes").val(m_clProject.data.specialProjectData.classData.classNotes);
						
						} else if (m_clProject.data.specialProjectData.productProject) {

							var strNewBuyHeader = '<h4 style="margin-top:-5px;"><b>Here are the details for the Product you selected.</b></h4>';
							strNewBuyHeader += '<h5>If you want to buy it, click the <b><i>Enter secure charge information</i></b> button.</h5>';
							strNewBuyHeader += '<h5>After completing the purchase, you will receive two emails: a charge receipt and one with information on getting started.</h5>';
							$("#BuyHeader").append(strNewBuyHeader);
							jQuery(function($){
								$("#Price").mask("$999.99");
							});
							$("#ProjectDescription").val(m_clProject.data.specialProjectData.productData.productDescription);
							
							// level combo
							if(m_clProject.data.specialProjectData.productData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.productData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							
							// difficulty combo
							if(m_clProject.data.specialProjectData.productData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.productData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							
							m_dPriceToCharge = m_clProject.data.specialProjectData.productData.price;

							// formatted price
							$("#Price").val(m_clProject.data.specialProjectData.productData.price.dollarFormat());
						
						} else if (m_clProject.data.specialProjectData.onlineClassProject) {

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
							$("#ProjectDescription").val(m_clProject.data.specialProjectData.onlineClassData.classDescription);
							$("#InstructorFirst").val(m_clProject.data.specialProjectData.onlineClassData.instructorFirstName);
							$("#InstructorLast").val(m_clProject.data.specialProjectData.onlineClassData.instructorLastName);
							$("#Email").val(m_clProject.data.specialProjectData.onlineClassData.instructorEmail);
							// when array
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = m_clProject.data.specialProjectData.classData.schedule[i-1];	// {date: 'UTC datetime including from', duration: in ms}
								$("#When" + i).val(m_getWhenString(whenIth));
							}
							// level combo
							if(m_clProject.data.specialProjectData.onlineClassData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.onlineClassData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(m_clProject.data.specialProjectData.onlineClassData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.onlineClassData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							m_dPriceToCharge = m_clProject.data.specialProjectData.onlineClassData.price;
							// formatted price
							$("#Price").val(m_clProject.data.specialProjectData.onlineClassData.price.dollarFormat());
							$("#Notes").val(m_clProject.data.specialProjectData.onlineClassData.classNotes);
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
													function(err) {
														
														if (err) {

															errorHelper.show(err);
															$("#BuyBtn").prop("disabled", false);
															$("#CancelBtn").prop("disabled", false);
															return;
														}

														// At this point the card has been charged. But the project in memory is still the original product.
														self.closeYourself();
														// Tell user in callback errorHelper. Use callback to open SaveProjectAsDialog.
														errorHelper.show('Your purchase is almost complete.<br><br>When you close this Note, we will open the Save Project window. Use it to choose a new name, maybe some tags, the description, perhaps a new Project Image.<br><br>Then click the Save button, and the project will be all yours!', 250000,	// I don't expect to auto-close errorHelper in 250 seconds.
																														// The purpose of this very large number is to get errorHelper to use the title 'Note' instead of 'Error'.
															function(){

																// Change some things about the project in memory so it doesn't look like a product anymore, but instead it looks like a normal project.
																m_clProject.data.ownedByUserId = parseInt(g_profile['userId'], 10);

																if (m_clProject.data.specialProjectData.hasOwnProperty('classData')) {
																	delete m_clProject.data.specialProjectData.classData;
																	m_clProject.data.isClass = false;
																	m_clProject.data.specialProjectData.classProject = false;
																} else if (m_clProject.data.specialProjectData.hasOwnProperty('onlineClassData')) {
																	delete m_clProject.data.specialProjectData.onlineClassData;
																	m_clProject.data.isOnlineClass = false;
																	m_clProject.data.specialProjectData.onlineClassProject = false;
																} else if (m_clProject.data.specialProjectData.hasOwnProperty('productData')) {
																	delete m_clProject.data.specialProjectData.productData;
																	m_clProject.data.isProduct = false;
																	m_clProject.data.specialProjectData.productProject = false;
																}

																m_clProject.data.specialProjectData.privilegedUser = false;
																m_clProject.data.specialProjectData.ownedByUser = true;
																m_clProject.data.specialProjectData.normalProject = true;
																m_clProject.data.specialProjectData.openMode = 'bought';

																// Open the Save dialog.
																client.showSaveProjectDialog();
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
		                    			descriptionForReceipt: 'receipt info',	// An arbitrary string to be attached to the charge object. It is included in the receipt email sent to the user by Stripe.
		                    			statementDescriptor: 'statement info'		// An arbitrary string to be displayed (most of the time) on user's credit card statement.
		                    		},
		                            'json');
		                    posting.done(function(data) {

		                    	if (data.success) {

                                    return callback(null);
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
				var m_clProject = null;
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
