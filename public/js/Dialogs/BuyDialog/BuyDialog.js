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

						if (m_clProject.data.specialProjectData.classProject) {

							jQuery(function($){
								$("#Phone").mask("(999) 999-9999? x99999");
								$("#Zip").mask("99999");
								$("#Price").mask("$999.99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999/99/99         99:99 - 99:99")
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
								var whenIth = m_clProject.data.specialProjectData.classData.schedule[i-1];
								if (whenIth.date.length > 0 || whenIth.from.length > 0 || whenIth.thru.length > 0) {
									var when = (whenIth.date + '          ').substr(0,10) + '         ' + (whenIth.from + '     ').substr(0,5) + '   ' + (whenIth.thru + '     ').substr(0,5);
									$("#When" + i).val(when);
								}
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
							// formatted price
							$("#Price").val(m_clProject.data.specialProjectData.classData.price.dollarFormat());
							$("#Notes").val(m_clProject.data.specialProjectData.classData.classNotes);
						
						} else if (m_clProject.data.specialProjectData.productProject) {

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
							
							// formatted price
							$("#Price").val(m_clProject.data.specialProjectData.productData.price.dollarFormat());
						
						} else if (m_clProject.data.specialProjectData.onlineClassProject) {

							jQuery(function($){
								$("#Price").mask("$999.99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999/99/99         99:99 - 99:99")
								}
							});
							$("#ProjectDescription").val(m_clProject.data.specialProjectData.onlineClassData.classDescription);
							$("#InstructorFirst").val(m_clProject.data.specialProjectData.onlineClassData.instructorFirstName);
							$("#InstructorLast").val(m_clProject.data.specialProjectData.onlineClassData.instructorLastName);
							$("#Email").val(m_clProject.data.specialProjectData.onlineClassData.instructorEmail);
							// when array
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = m_clProject.data.specialProjectData.onlineClassData.schedule[i-1];
								if (whenIth.date.length > 0 || whenIth.from.length > 0 || whenIth.thru.length > 0) {
									var when = (whenIth.date + '          ').substr(0,10) + '         ' + (whenIth.from + '     ').substr(0,5) + '   ' + (whenIth.thru + '     ').substr(0,5);
									$("#When" + i).val(when);
								}
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
							// formatted price
							$("#Price").val(m_clProject.data.specialProjectData.onlineClassData.price.dollarFormat());
							$("#Notes").val(m_clProject.data.specialProjectData.onlineClassData.classNotes);
						}
					}

					var m_functionBuy = function() {

						switch (m_buyMode) {

							case 1: 	
								// Reveal the charge form. Change BuyBtn text. Set mode to 2.
								$("#ChargeSection").css("display", "block");
								$("#BuyBtn").text("Complete the purchase");
								m_buyMode = 2;
								break;
							case 2: 	
								// Due to keyup event handlers, we couldn't get here if all CC fields weren't filled and somewhat good.
								// 2a. Ajax to TG server to get stripe's PK (based on whether we're running in dev or prod).
								// 2b. Ajax to Stripe (via included Stripe.js code) to request a token.
								// 2c. Using the token, Ajax to TG server again to complete CC charging.
								// 2d. Report to user. Set m_buyMode = 3;
		                        $.ajax({

		                            url: "/BOL/UtilityBO/GetStripePK",
		                            dataType: "jsonp",
		                            success: function (response,
		                                strTextStatus,
		                                jqxhr) {

		                                try {

		                                    // Check for processing error.
		                                    if (response.success === false) {

		                                        // On error, throw error.
		                                        throw {
		                                            
		                                            message: response.reason
		                                        };
		                                    }

		                                    // Set the publish key here, now that it is known.
		                                    Stripe.setPublishableKey(response.key);

		                                    // Create the token to send to the server.
		                                    Stripe.card.createToken({
		                                    
		                                        name: m_strChargeName,
		                                        number: m_strChargeNumber,
		                                        cvc: m_strCVC,
		                                        exp_month: m_iExpMonth,
		                                        exp_year: m_iExpYear
		                                    }, function (status,
		                                        response) {
		                                    
		                                        try {
		                                        
		                                            // If error.
		                                            if (response.error) {
		                                            
		                                                // Invoke error handler.
		                                                throw response.error;
		                                            } else {
		                                            
		                                                // Extract the safe-token.
		                                                var strToken = response.id;
		                                                
		                                                $.ajax({

		                                                    url: '/BOL/UtilityBO/ProcessCharge',
		                                                    data: { token:response.id },
		                                                    dataType: "jsonp",
		                                                    success: function (response,
		                                                        strTextStatus,
		                                                        jqxhr) {

		                                                        try {

		                                                            // Check for processing error.
		                                                            if (response.success === false) {

		                                                                // If response.reason starts with "suggest:",
		                                                                // then alert user as to duplicate child name and suggest what follows.
		                                                                if (response.reason === "Name") {

		                                                                    throw {

		                                                                        message: strChildName + " is already a user name in TechGroms.  Please enter a different user name for your child."
		                                                                    };
		                                                                }

		                                                                // On error, throw error.
		                                                                throw {
		                                                                        
		                                                                    message: response.reason
		                                                                };
		                                                            }

		                                                            // Extract the payload result and pass on to the callback.
		                                                            functionSuccess(response.chargeId);
		                                                        } catch (e) {

		                                                            // Call error handler.
		                                                            functionError(e.message);
		                                                        }
		                                                    },
		                                                    error: function (jqxhr,
		                                                        strTextStatus,
		                                                        strError) {

		                                                        // Call error handler.
		                                                        functionError("Communication error: " + strError);
		                                                    }
		                                                });
		                                            }
		                                        } catch (e) {
		                                        
		                                            functionError("Request error: " + e.message);
		                                        }
		                                    });
		                                } catch (e) {

		                                    errorHelper("Processing error: " + e.message);
		                                }
		                            },
		                            error: function (jqxhr,
		                                strTextStatus,
		                                strError) {

		                                errorHelper("Communication error: " + strError);
		                            }
		                        });



								m_buyMode = 3;
								break;
							case 3: 	// Charge was processed.
										// Notify user.
										// Close dialog.
								break;
						}
					}

				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_clProject = null;
				var m_buyMode = 1;
				var m_strChargeName;
				var m_strChargeNumber;
				var m_iExpMonth;
				var m_iExpYear;
				var m_strCVC;
			};

			// Return the constructor function as the module object.
			return functionBuyDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
