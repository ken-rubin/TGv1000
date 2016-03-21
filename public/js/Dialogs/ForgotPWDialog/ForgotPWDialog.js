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
							$("#email").keyup(m_setStatePrimaryBtn);
							m_setStatePrimaryBtn();

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					var m_setStatePrimaryBtn = function () {

						var email = $("#email").val().trim();
						var bValid = (email.length > 0);
						if (!bValid) {
							$("#SendButton").prop("disabled", true);
						} else {
							var eReg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;	/* ' */
							bValid = email.match(eReg);
							if (!bValid) {
								$("#SendButton").prop("disabled", true);
							} else {
								$("#SendButton").prop("disabled", false);
							}
						}
					}

					// Expose enroll event.
					m_functionSendButtonClick = function () {

						try {

							$("#SendButton").prop("disabled", true);
							var posting = $.post("/BOL/ValidateBO/SendPasswordResetEmail", 
												{
													userName: $("#email").val().trim().toLowerCase()
												}, 
												'json');
        					posting.done(function(data){

            					if (data.success) {

                					m_wellMessage("Please check for the email we just sent for further instructions.", 
                									{waittime: 10000, callback: function() {	
                																				m_dialog.close();
                																		   }
                									}
                					);
            					} else {

                					// !data.success
                					$("#SendButton").prop("disabled", false);
                					m_wellMessage(data.message, null);
            					}
        					});
						} catch (e) {

							$("#SendButton").prop("disabled", false);
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
