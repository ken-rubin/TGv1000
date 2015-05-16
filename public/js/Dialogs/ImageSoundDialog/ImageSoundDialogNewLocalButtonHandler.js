//////////////////////////////////////////
// ImageSoundDialog new LOCAL FILE button handler. 
//
// Return constructor function.
//

// Define an AMD module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

		try {

			// Define the function constructor returned as "this" module.
			var functionHandler = function () {

				var self = this;

				//////////////////////////////////////
				// Public methods.

				// Initialize this object.
				self.create = function (objectContext) {

					try {

						// Save context state.  This is known to be a dialog because this module
						// is always loaded as the result of a button click in a popup dialog.
						m_dialogContext = objectContext.dialog;
						m_pdParent = objectContext.parent;

						// // Activate tooltips.
						// $("[data-toggle='tooltip']").tooltip();

						// Wire buttons.
						$("#OpenCommonFileDialogButton").click(m_functionOpenCommonFileDialog);
						
					} catch (e) {

						errorHelper.show(e.message);
					}
				};

				//////////////////////////////////////
				// Private methods.

				// Invoked to open CommonFileDialog
				var m_functionOpenCommonFileDialog = function() {

					try {

						$("#resourcename").trigger("click");
						
					} catch (e) {

						errorHelper(e);
					}
				}

				// // Invoked when user clicks local resource desired.
				// var m_functionNewLocalSnippetResponse = function (htmlData) {

				// 	try {

				// 		// Inject result.
				// 		var exceptionRet = snippetHelper.process({ dialog:m_dialogContext, parent:m_pdParent },
				// 			htmlData,
				// 			"#ImageSoundNewWell",
				// 			"#ImageSoundDialogNewLocalSnippet");
				// 		if (exceptionRet) {

				// 			throw exceptionRet;
				// 		}
				// 	} catch (e) {

				// 		errorHelper.show(e.message);
				// 	}
				// }

				// // Invoked when the load local resource button is clicked.
				// var m_functionLocalResourceClick = function () {

				// 	try {

				// 		// Get the snippet.
				// 		$.ajax({

				// 			cache: false,
				// 			data: {

				// 				templateFile: "Dialogs/ImageSoundDialog/imageSoundDialogNewLocalSnippet"
				// 			},
				// 			dataType: "HTML",
				// 			method: "POST",
				// 			url: "/renderJadeSnippet"
				// 		}).done(m_functionNewLocalSnippetResponse).error(errorHelper.show);
				// 	} catch (e) {

				// 		errorHelper.show(e.message);
				// 	}
				// }

				// // Invoked when user clicks internet resource desired.
				// var m_functionNewInternetSnippetResponse = function (htmlData) {

				// 	try {

				// 		// Inject result.
				// 		var exceptionRet = snippetHelper.process({ dialog:m_dialogContext, parent:m_pdParent },
				// 			htmlData,
				// 			"#ImageSoundNewWell",
				// 			"#ImageSoundDialogNewInternetSnippet");
				// 		if (exceptionRet) {

				// 			throw exceptionRet;
				// 		}
				// 	} catch (e) {

				// 		errorHelper.show(e.message);
				// 	}
				// }

				// // Invoked when the load internet resource button is clicked.
				// var m_functionInternetResourceClick = function () {

				// 	try {

				// 		// Get the snippet.
				// 		$.ajax({

				// 			cache: false,
				// 			data: {

				// 				templateFile: "Dialogs/ImageSoundDialog/imageSoundDialogNewInternetSnippet"
				// 			},
				// 			dataType: "HTML",
				// 			method: "POST",
				// 			url: "/renderJadeSnippet"
				// 		}).done(m_functionNewInternetSnippetResponse).error(errorHelper.show);
				// 	} catch (e) {

				// 		errorHelper.show(e.message);
				// 	}
				// }

				// Invoked when a project item is clicked.
				// var m_functionResourceClick = function () {

				// 	try {

				// 		// Get the project id from this (i.e. what was clicked).
				// 		var strResourceId = $(this).attr("id");

				//         // Call the ImageSoundDialog's open handler.
				//         var exceptionRet = m_pdParent.open(strResourceId);
				//         if (exceptionRet) {

				//         	throw exceptionRet;
				//         }
				// 	} catch (e) {

				// 		errorHelper.show(e.message);
				// 	}
				// };

				//////////////////////////////////////
				// Private fields.

				// The owning dialog.
				var m_dialogContext = null;
				// The ImageSoundDialog object which owns the "owning dialog".
				var m_pdParent = null;
			};

			return functionHandler;
		} catch (e) {

			alert(e.message);
		}
	});
