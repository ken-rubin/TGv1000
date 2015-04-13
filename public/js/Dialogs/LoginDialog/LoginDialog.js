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

				// Expose new event.
				// self.new = function () {

				// 	try {


				// 		// Dismiss the dialog.
				//         m_dialog.close();

				//         // Call the callback.
				//         if ($.isFunction(m_callbackNew)) {

				//         	return m_callbackNew();
				//         }

				//     	return null;
				// 	} catch (e) {

				// 		return e;
				// 	}
				// }

				// // Expose open event.
				// // Takes the id of the project to open.
				// self.open = function (strId) {

				// 	try {

				// 		// Dismiss the dialog.
				//         m_dialog.close();

				//         // Call the callback.
				//         if ($.isFunction(m_callbackOpen)) {

				//         	return m_callbackOpen(strId);
				//         }
				//     	return null;
				// 	} catch (e) {

				// 		return e;
				// 	}
				// }

				// // Expose clone event.
				// // Takes the id of the project to clone.
				// self.clone = function (strId) {

				// 	try {

				// 		// Dismiss the dialog.
				//         m_dialog.close();

				//         // Call the callback.
				//         if ($.isFunction(m_callbackClone)) {

				//         	return m_callbackClone(strId);
				//         }

				//         return null;
				// 	} catch (e) {

				// 		return e;
				// 	}
				// }

				// //////////////////////////////////
				// // Private functions.

				// // Invoked when the new button is clicked.
				// var m_functionNewButtonClick = function () {

				// 	try {

				//         // Call this object's new handler.
				//         var exceptionRet = self.new();
				//         if (exceptionRet) {

				//         	throw exceptionRet;
				//         }
				// 	} catch (e) {

				// 		errorHelper.show(e);
				// 	}
				// };

				// // Invoked when the server request 
				// // to get the search snippet returns.
				// var m_functionSearchSnippetResponse = function (htmlData) {

				// 	try {

				// 		// Inject result.
				// 		var exceptionRet = snippetHelper.process({ dialog:m_dialog, parent:self },
				// 			htmlData,
				// 			"#TypeWell",
				// 			"#LoginDialogSearchSnippet");
				// 		if (exceptionRet) {

				// 			throw exceptionRet;
				// 		}
				// 	} catch (e) {

				// 		errorHelper.show(e.message);
				// 	}
				// };

				// // Invoked when the search button is clicked.
				// var m_functionSearchButtonClick = function () {

				// 	try {

				// 		// Get the search snippet.
				// 		$.ajax({

				// 			cache: false,
				// 			data: {

				// 				templateFile: "Dialogs/LoginDialog/loginDialogSearchSnippet"
				// 			},
				// 			dataType: "HTML",
				// 			method: "POST",
				// 			url: "/renderJadeSnippet"
				// 		}).done(m_functionSearchSnippetResponse).error(errorHelper.show);
				// 	} catch (e) {

				// 		errorHelper.show(e.message);
				// 	}
				// };

				// Wire up event handlers to dialog controls.
				var m_functionOnShownDialog = function (dialogItself) {

					try {

						// Save the dailog object reference.
						m_dialog = dialogItself;

						// Wire click events.
						// $("#NewButton").click(m_functionNewButtonClick);
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
