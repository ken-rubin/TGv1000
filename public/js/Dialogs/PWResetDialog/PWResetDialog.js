////////////////////////////////////
// PWResetDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

		try {

			// Define the PWResetDialog constructor function.
			var functionPWResetDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function(token) {

						try {

							var isValid = KJUR.jws.JWS.verifyJWT(token, "jwt_secret", {alg: ["HS256"]});
							if (!isValid) {
								return new Error("Your link appears invalid. Perhaps it is more than an hour old. Please request a new email.");
							}

							var profileJSON = window.atob(token.split('.')[1]);
							var profile = JSON.parse(profileJSON);
							m_userName = profile.userName;

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/PWResetDialog/pWResetDialog"
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
							// the PWResetDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "Password Reset - Step 2",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		id: 'ResetButton',
					            		label: "Reset Password",
					            		cssClass: 'btn-primary',
					            		hotkey: 13,
					            		action: function () {

					            			m_functionResetButtonClick();
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
							$("#email").text(m_userName + '.');
							$("#password").focus();

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Expose enroll event.
					m_functionResetButtonClick = function () {

						try {

							// Initial validation. email not empty. Email address passes regexp test.
							var errMsg = "";
							var password = $("#password").val().trim();
							if (password.length === 0) {

								errMsg = "You must enter a new password.";
							
							} else if (password.includes("'" || password.includes('"'))) {

								errMsg = "Didn't we tell you not to use one of those two characters?"
							}
							if (errMsg.length) {

								m_wellMessage(errMsg, null);
								return;
							}

							// Things look good. Time to go to the server.
							var posting = $.post("/BOL/ValidateBO/ResetPassword", 
												{
													userName: m_userName,
													newPassword: password
												}, 
												'json');
        					posting.done(function(data){

            					if (data.success) {

                					m_wellMessage("You may now sign in with your new password.", 
                									{waittime: 2000, callback: function(){	m_dialog.close(); /*location.href = '/';*/}});
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
			return functionPWResetDialog;

		} catch (e) {

			errorHelper.show(e.message);
		}
	});
