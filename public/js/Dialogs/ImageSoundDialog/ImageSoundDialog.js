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
			var functionImageSoundDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					// bImage: true means image; false means sound
					// functionOK is callback with resourceId as parameter.
					self.create = function(bImage,
						functionOK) {

						try {

							// Save params in private fields.
							m_bImage = bImage;
							m_functionOK = functionOK;

							// Show the dialog--load the content from 
							// the ImageSoundDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: bImage ? "Image" : "Sound",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $("<div></div>").load("/ImageSoundDialog"),
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

					// Expose clone event.
					// Takes the id of the Type to clone.
					self.clone = function (strId) {

						try {

							// Dismiss the dialog.
					        m_dialog.close();

					        // Call the callback.
					        if ($.isFunction(m_callbackClone)) {

					        	return m_callbackClone(strId);
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

					// Invoked when the request to get the open button snippet returns.
					var m_functionInnerSearchSnippetResponse = function (htmlData) {

						try {

							var exceptionRet = snippetHelper.process({ dialog:m_dialog, parent:self },
								htmlData,
								"#SearchWell",
								"#ImageSoundDialogInnerSearchSnippet");
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Invoked when a Type item is clicked.
					var m_functionInnerSearchButtonClick = function () {

						try {

							// Get the string from the search input.
							var strSearchString = $("#SearchInput").val();

							// Get the search results.
							$.ajax({

								cache: false,
								data: {

									templateFile: "Dialogs/ImageSoundDialog/ImageSoundDialogInnerSearchSnippet",
									businessObject: {

										module: "GUI/Dialogs/ImageSoundDialog/ImageSoundDialogInnerSearchSnippet",
										method: "process"
									}
								},
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionInnerSearchSnippetResponse).error(errorHelper.show);

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;

							// Wire click events.
							$("#NewButton").click(m_functionNewButtonClick);
							$("#InnerSearchButton").click(m_functionInnerSearchButtonClick);
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
