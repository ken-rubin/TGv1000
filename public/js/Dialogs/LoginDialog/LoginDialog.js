////////////////////////////////////
// LoginDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

		try {

			// Define the LoginDialog constructor function.
			var functionLoginDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function() {

						try {

							// Show the dialog--load the content from 
							// the loginDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "TechGroms Login",
								closable: false,
								animate: false,
								size: BootstrapDialog.SIZE_NORMAL,
					            message: $("<div></div>").load("/loginDialog"),
					            buttons: [],
					            draggable: true,
					            onshown: m_functionOnShownDialog
					        });

							return null;
						} catch (e) {

							return e;
						}
					};
					
					//////////////////////////////////
					// Private functions.

					// Wire up event handlers to dialog controls.
					var m_functionSignInButtonClick = function() {

						try {

	alert('a');
							var posting = $.post("/BOL/ValidateBO/UserAuthenticate", 
								{
									userName:$("#inputUsername").val(), 
									password:$("#inputPassword").val()
								}, 
								'json');
					        posting.done(function(data){

					            if (data.success) {

					            	var userId = data.userId;
					            	m_dialog.close();

					            } else {

					                // !data.success
					                errorHelper.show(data.message);
					            }
					        });
					    } catch(e) {

					    	errorHelper.show(e.message);
					    }
					}

					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;

							// Wire click events.
							var jButton = $("#SignInButton");
							jButton.click(m_functionSignInButtonClick);
							// $("#SearchButton").click(m_functionSearchButtonClick);
						} catch (e) {

							errorHelper.show(e.message);
						}
					};
				} catch (e) {

					errorHelper.show(e.message);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
			};

			// Return the constructor function as the module object.
			return functionLoginDialog;
		} catch (e) {

			errorHelper.show(e.message);
		}
	});
