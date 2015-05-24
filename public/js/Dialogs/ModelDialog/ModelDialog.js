////////////////////////////////////
// ModelDialog module. This is just a template.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/contextMenu"], 
	function (snippetHelper, errorHelper, contextMenu) {

		try {

			// Define the ModelDialog constructor function.
			var functionModelDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					// Pass user id,
					// New callback -- void.
					// Clone callback -- takes strId.
					self.create = function() {

						try {

							// Show the dialog--load the content from 
							// the ModelDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "Model",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $("<div></div>").load("/modelDialog"),
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

					//////////////////////////////////
					// Private functions.

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;

							// var jqMW = $("#ModelWell");
							// jqMW.contextMenu({
							// 	menuSelector: "#ModelContextMenu",
							// 	menuSelected: m_functionMenuHandler
							// });

						} catch (e) {

							errorHelper.show(e.message);
						}
					};
				} catch (e) {

					errorHelper.show(e.message);
				}

				// var m_functionMenuHandler = function (invokedOn, selectedMenu) {

				// 	try {

				// 		// Handle different menu items differently.
				// 		if (selectedMenu.text() === "Change...") {

				// 			// Show rename dialog.
				// 			// var exceptionRet = m_functionImageDialogHelper();
				// 			// if (exceptionRet) {

				// 			// 	throw exceptionRet;
				// 			// }
				// 		}
				// 	} catch (e) {

				// 		errorHelper.show(e);
				// 	}
				// }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
			};

			// Return the constructor function as the module object.
			return functionModelDialog;
		} catch (e) {

			errorHelper.show(e.message);
		}
	});
