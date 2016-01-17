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
					self.create = function() {

						try {

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/EnrollDialog/enrollDialog"
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
							// the EnrollDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "Enroll",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		id: 'EnrollButton',
					            		label: "Enroll",
					            		cssClass: 'btn-primary',
					            		hotkey: 13,
					            		action: function () {

					            			m_functionEnrollButtonClick();
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
							// focus
							$("#email").focus();

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Expose enroll event.
					m_functionEnrollButtonClick = function () {

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
							var posting = $.post("/BOL/ValidateBO/NewEnrollment", 
												{
													userName: email
												}, 
												'json');
        					posting.done(function(data){

            					if (data.success) {

					            	// The following is included just to remind us in the future how to log from client into server console.
									JL().info("<<< Successful enrollment occurred >>>");

					            	// The JWT has been saved to a cookie ("token") so it will be sent with each subsequent request.
					                // Save JWT profile info to localStorage for use on client side (user id and permissions).
					                var ca = document.cookie.split(';');
					                var getCookie = function(name) {
					                	var nameEQ = name + "=";
					                	for (var i = 0; i < ca.length; i++) {
        									var cIth = ca[i];
        									while (cIth.charAt(0) == ' ') {
        										cIth = cIth.substring(1, cIth.length);
        									}
        									if (cIth.indexOf(nameEQ) === 0) {
        										return cIth.substring(nameEQ.length, cIth.length);
        									}
        								}
        								return null;
					                };
					                var token = getCookie("token");
					                if (token) {

					                	var profileJSON = window.atob(token.split('.')[1]);
					                	localStorage.setItem("profile", profileJSON);
					                	g_profile = JSON.parse(profileJSON);
					                }

                					m_wellMessage("You hav been enrolled. Please check for the email with log-in instructions we just sent to you.", 
                									{waittime: 2000, callback: function(){	m_dialog.close(); location.href = '/';}});
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
			};

			// Return the constructor function as the module object.
			return functionEnrollDialog;

		} catch (e) {

			errorHelper.show(e.message);
		}
	});
