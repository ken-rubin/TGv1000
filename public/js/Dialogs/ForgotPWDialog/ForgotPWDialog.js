////////////////////////////////////
// ForgotPWDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

		try {

			// Define the ForgotPWDialog constructor function.
			var functionForgotPWDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function(userName) {

						try {

							m_userName = userName;

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/ForgotPWDialog/forgotPWDialog"
								}, 
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionRenderJadeSnippetResponse).error(errorHelper.show);

							return null;
						} catch (e) {

							return e;
						}
					};

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the ForgotPWDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "Request Password Reset",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		id: 'SendButton',
					            		label: "Send Email",
					            		cssClass: 'btn-primary',
					            		hotkey: 13,
					            		action: function () {

					            			m_functionSendButtonClick();
					            		}
					            	},
					            	{
						                label: "Close",
						                icon: "glyphicon glyphicon-remove-circle",
						                cssClass: "btn-warning",
						                action: function(dialogItself){

						                    dialogItself.close();
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

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;
							// set and focus
							$("#email").val(m_userName);
							$("#email").focus();

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Expose enroll event.
					m_functionSendButtonClick = function () {

						try {

							// Initial validation. email not empty. Email address passes regexp test.
							var errMsg = "";
							var email = $("#email").val().trim().toLowerCase();
							if (email.length === 0) {

								errMsg = "You must enter an email address.";
							
							} else {

								var eReg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;	/* ' */
								var emailOK = email.match(eReg);

								if (!emailOK) {

									errMsg = "That email address does not pass our validation test. Please enter another.";

								}
							}

							if (errMsg.length) {

								m_wellMessage(errMsg, null);
								return;
							}

							// Things look good. Time to go to the server.
							var posting = $.post("/BOL/ValidateBO/SendPasswordResetEmail", 
												{
													userName: email
												}, 
												'json');
        					posting.done(function(data){

            					if (data.success) {

                					m_wellMessage("Please check for the email we just sent for further instructions.", 
                									{waittime: 20000, callback: function(){	m_dialog.close(); /*location.href = '/';*/}});
            					} else {

                					// !data.success
                					m_wellMessage(data.message, null);
            					}
        					});
						} catch (e) {

							m_wellMessage(e.message, null);
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
				var m_userName = null;
			};

			// Return the constructor function as the module object.
			return functionForgotPWDialog;

		} catch (e) {

			errorHelper.show(e.message);
		}
	});
