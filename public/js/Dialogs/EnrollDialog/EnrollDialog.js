////////////////////////////////////
// EnrollDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

		try {

			// Define the EnrollDialog constructor function.
			var functionEnrollDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					// Pass user id,
					// New callback -- void.
					// Clone callback -- takes strId.
					self.create = function(callbackNewEnrollee) {

						try {

							m_callbackNewEnrollee = callbackNewEnrollee;

							// Show the dialog--load the content from 
							// the EnrollDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "Enroll",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $("<div></div>").load("/enrollDialog"),
					            buttons: [{

					                label: "Close",
					                icon: "glyphicon glyphicon-remove-circle",
					                cssClass: "btn-warning",
					                action: function(dialogItself){

					                    dialogItself.close();
					                }
					            }],
					            draggable: true,
					            onshown: m_functionOnShownDialog
					        });
							return null;
						} catch (e) {

							return e;
						}
					};

					// Expose enroll event.
					self.enroll = function () {

						try {

							// Initial validation. UserId not empty. E-mail address passes regexp test.
							var errMsg = "";
							var userId = $("#UserId").val().trim().toLowerCase();
							var email = $("#Email").val().trim().toLowerCase();
							if (userId.length === 0) {

								errMsg = "You must enter a user Id. ";
							}
							if (email.length === 0) {

								errMsg += "Your e-mail address is missing.";
							} else {

								var eReg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
								if (!email.match(eReg)) {

									errMsg += "That doesn't appear to be a valid e-mail address.";
								}
							}

							if (errMsg.length) {

								m_wellMessage(errMsg, null);
								return null;
							}

							// Things look good. Time to go to the server.
							var posting = $.post("/BOL/ValidateBO/NewEnrollment", 
												{
													userName: userId, 
													parentEmail: email
												}, 
												'json');
        					posting.done(function(data){

            					if (data.success) {

                					document.cookie = "userId=" + data.userId.toString();
                					document.cookie = "userName=" + userId;

                					m_wellMessage("Your child has been enrolled. Please follow the e-mail just sent to you.", 
                									{waittime: 10000, callback: function(){	m_dialog.close(); location.href = '/index';}});
            					} else {

                					// !data.success
                					m_wellMessage(data.message, null);
            					}
        					});

					    	return null;

						} catch (e) {

							return e;
						}
					};

					//////////////////////////////////
					// Private functions.

					// Invoked when the new button is clicked.
					var m_functionEnrollButtonClick = function () {

						try {

					        // Call this object's enroll handler.
					        var exceptionRet = self.enroll();
					        if (exceptionRet) {

					        	throw exceptionRet;
					        }
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;

							// Wire click events.
							$("#EnrollButton").click(m_functionEnrollButtonClick);

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Put a message in the well, optionally closing the dialog after n ms.
					var m_wellMessage = function(msg, timeoutAction) {

						try {

							$("#EnrollWell").empty();
							$("#EnrollWell").append("<p class='text-danger'>" + msg + "</p>");

							if (timeoutAction !== null) {

								setTimeout(timeoutAction.callback, timeoutAction.waittime);
							}

						} catch (e) {

							errorHelper.show(msg);
						}
					}
				} catch (e) {

					errorHelper.show(e.message);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				// Invoked when the dialog is dismissed for a new Type.
				var m_callbackNewEnrollee = null;
			};

			// Return the constructor function as the module object.
			return functionEnrollDialog;

		} catch (e) {

			errorHelper.show(e.message);
		}
	});
