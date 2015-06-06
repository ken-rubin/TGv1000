////////////////////////////////////
// ImageSoundDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

		try {

			// Define the ImageSoundDialog constructor function.
			var functionImageSoundDialog = function (bImage,
						functionOK) {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					// bImage: true means image; false means sound
					// functionOK is callback with resourceId as parameter.
					self.create = function() {

						try {

							// Save params in private fields.
							m_bImage = bImage;
							m_functionOK = functionOK;

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/ImageSoundDialog/imageSoundDialog"
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

					self.closeYourself = function() {

						m_dialog.close();
					}

					self.callFunctionOK = function(iResourceId) {

						try {

							m_functionOK(iResourceId);
							m_dialog.close();

						} catch (e) {

							errorHelper.show(e);
						}
					}

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the ImageSoundDialog jade HTML-snippet.
							m_dialog = BootstrapDialog.show({

								title: bImage ? "Image" : "Sound",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [{

					                label: "Close",
					                icon: "glyphicon glyphicon-remove-circle",
					                cssClass: "btn-warning",
					                action: function(dialogItself){

					                    dialogItself.close();
					                }
					            }],
					            draggable: true,
					            onshown: m_functionOnShownDialog	// wires click handlers for New and Search btns.
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function () {

						try {

							// Wire click events.
							$("#NewResourceButton").click(m_functionNewButtonClick);
							$("#SearchResourceButton").click(m_functionSearchButtonClick);

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Invoked when the server request 
					// to get the search snippet returns.
					var m_functionNewSnippetResponse = function (htmlData) {

						try {

							// Inject result.
							var exceptionRet = snippetHelper.process({ dialog:m_dialog, parent:self },
								htmlData,
								"#ImageSoundWell",
								"#ImageSoundDialogNewSnippet");
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Invoked when a Type item is clicked.
					var m_functionNewButtonClick = function () {

						try {

							// Get the search snippet.
							$.ajax({

								cache: false,
								data: {

									templateFile: "Dialogs/ImageSoundDialog/imageSoundDialogNewSnippet"
								},
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionNewSnippetResponse).error(errorHelper.show);
						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Invoked when the server request 
					// to get the search snippet returns.
					var m_functionSearchSnippetResponse = function (htmlData) {

						try {

							// Inject result.
							var exceptionRet = snippetHelper.process({ dialog:m_dialog, parent:self },
								htmlData,
								"#ImageSoundWell",
								"#ImageSoundDialogSearchSnippet");
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Invoked when a Search btn is clicked.
					var m_functionSearchButtonClick = function () {

						try {

							// Get the search snippet.
							$.ajax({

								cache: false,
								data: {

									templateFile: "Dialogs/ImageSoundDialog/imageSoundDialogSearchSnippet"
								},
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionSearchSnippetResponse).error(errorHelper.show);
						} catch (e) {

							errorHelper.show(e.message);
						}
					};

				} catch (e) {

					errorHelper.show(e.message);
				}

				/////////////////////////////////
				// Private fields.

				var m_dialog = null;
				var m_bImage = null;
				var m_functionOK = null;
			};

			// Return the constructor function as the module object.
			return functionImageSoundDialog;

		} catch (e) {

			errorHelper.show(e.message);
		}
	});
