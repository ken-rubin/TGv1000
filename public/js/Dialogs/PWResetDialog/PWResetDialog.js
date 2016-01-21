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
							$("#password").keyup(m_setStatePrimaryBtn);
							m_setStatePrimaryBtn();

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					var m_setStatePrimaryBtn = function () {

						var password = $("#password").val().trim();
						var bValid = (password.length > 0) && !(password.includes("'" || password.includes('"')));
						if (!bValid) {
							$("#ResetButton").addClass("disabled");
						} else {
							$("#ResetButton").removeClass("disabled");
						}
					}

					// Expose enroll event.
					m_functionResetButtonClick = function () {

						try {

							$("#ResetButton").addClass("disabled");
							var posting = $.post("/BOL/ValidateBO/ResetPassword", 
												{
													userName: m_userName,
													newPassword: $("#password").val().trim()
												}, 
												'json');
        					posting.done(function(data){

            					if (data.success) {

                					m_wellMessage("You may now sign in with your new password.", 
                									{waittime: 2000, callback: function(){	
                										$("#inputName").val(m_userName);
                										m_dialog.close(); 
                										$("#inputPassword").focus(); }
                									}
                								);
            					} else {

                					// !data.success
                					$("#ResetButton").removeClass("disabled");
                					m_wellMessage(data.message, null);
            					}
        					});
						} catch (e) {

							$("#ResetButton").removeClass("disabled");
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
