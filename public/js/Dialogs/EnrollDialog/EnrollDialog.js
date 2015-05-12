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

					// Expose new event.
					self.new = function () {

						try {


							// Dismiss the dialog.
					        m_dialog.close();

					        // Call the callback.
					        if ($.isFunction(m_callbackNew)) {

					        	return m_callbackNew();
					        }

					    	return null;
						} catch (e) {

							return e;
						}
					};

					//////////////////////////////////
					// Private functions.

					// Invoked when the new button is clicked.
					var m_functionNewButtonClick = function () {

						try {

					        // Call this object's new handler.
					        var exceptionRet = self.new();
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
							$("#NewButton").click(m_functionNewButtonClick);

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
				// Invoked when the dialog is dismissed for a new Type.
				var m_callbackNewEnrollee = null;
			};

			// Return the constructor function as the module object.
			return functionEnrollDialog;

		} catch (e) {

			errorHelper.show(e.message);
		}
	});
