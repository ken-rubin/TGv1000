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
					self.create = function(callbackNewEnrollee) {

						try {

							m_callbackNewEnrollee = callbackNewEnrollee;

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

					// Expose enroll event.
					self.enroll = function () {

						try {

							// Initial validation. emailChild not empty. E-mail address passes regexp test.
							var errMsg = "";
							var emailChild = $("#EmailChild").val().trim().toLowerCase();
							var emailParent = $("#EmailParent").val().trim().toLowerCase();
							if (emailChild.length === 0) {

								errMsg = "You must enter an e-mail address for your child.";
							}
							if (emailParent.length === 0) {

								errMsg += "You must enter an e-mail address for yourself.";
							} else {

								var eReg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;	/* ' */
								var childOK = emailChild.match(eReg);
								var parentOK = emailParent.match(eReg);

								if (!childOK && !parentOK) {

									errMsg += "Neither e-mail address appears valid.";

								} else if (!childOK) {

									errMsg += "The child's e-mail address appears invalid.";

								} else if (!parentOK) {

									errMsg += "The parent's e-mail address appears invalid.";
								}
							}

							if (errMsg.length) {

								m_wellMessage(errMsg, null);
								return null;
							}

							// Things look good. Time to go to the server.
							var posting = $.post("/BOL/ValidateBO/NewEnrollment", 
												{
													userName: emailChild,
													parentEmail: emailParent
												}, 
												'json');
        					posting.done(function(data){

            					if (data.success) {

            						// These cookies don't expire, but they mau be overridden if a different user logs in.
            						var strDate = "; expires=Tue, 19 Jan 2038 03:14:07 GMT";

                					document.cookie = "userId=" + data.userId.toString() + strDate;
                					document.cookie = "userName=" + emailChild + strDate;

                					m_wellMessage("Your child has been enrolled. Please follow the log-in instructions just sent to you.", 
                									{waittime: 2000, callback: function(){	m_dialog.close(); location.href = '/';}});
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
							// focus
							$("#EmailChild").focus();

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
