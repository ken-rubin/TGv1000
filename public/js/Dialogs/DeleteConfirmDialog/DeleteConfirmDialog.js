////////////////////////////////////
// DeleteConfirmDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper", "Code/Property"], 
	function (snippetHelper, errorHelper, resourceHelper, Property) {

		try {

			// Define the DeleteConfirmDialog constructor function.
			var functionDeleteConfirmDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function(objectType, index) {

						try {

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/DeleteConfirmDialog/DeleteConfirmDialog"
								}, 
								dataProperty: "HTML",
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

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the PropertysDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "Confirm Deletion",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Create Property",
					            		id: 'CreatePropertyBtn',
					            		cssClass: "btn-primary",
					            		action: function(){

					            			m_functionCreateProperty();
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

					// Wire up Property handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;
							// $("#PropertyName").focus();

							// $("#PropertyName").blur(m_functionBlurPropertyName);

							// m_setStateCreateBtn();

						} catch (e) {

							errorHelper.show(e);
						}
					};

					// var m_functionBlurPropertyName = function() {

					// 		m_setStateCreateBtn();
					// }

					// var m_setStateCreateBtn = function() {

					// 	var nameStatus = $("#PropertyName").val().trim().length > 0;

					// 	if (!nameStatus) {
					// 		$("#CreatePropertyBtn").addClass("disabled");
					// 	} else {
					// 		$("#CreatePropertyBtn").removeClass("disabled");
					// 	}
					// }

					// var m_functionCreateProperty = function () {

					// 	try {

					// 		var PropertyName = $("#PropertyName").val().trim();
							
					// 		// if (!client.isPropertyNameAvailableInActiveComic(PropertyName)) {

					// 		// 	errorHelper.show("That name is already used. Please enter another.");
					// 		// 	return;
					// 		// }

					// 		// // Create minimal Property based on the dialog's fields--or lack thereof.
					// 		// // Call client to inject it throughout.
					// 		// var PropertyJO = 
					// 		// {
					// 		// 	isApp: false,
					// 		// 	id: 0,
					// 		// 	ordinal: client.getNumberOfPropertysInActiveComic(),
					// 		// 	tags: $("#PropertyTags").val() || "",
					// 		// 	properties: [],
					// 		// 	methods: [],
					// 		// 	Propertys: [],
					// 		// 	dependencies: [],
					// 		// 	name: PropertyName,
					// 		// 	imageResourceId: m_imageResourceId
					// 		// };

					// 		// var clProperty = new Property();
					// 		// clProperty.load(PropertyJO);

					// 		// var exceptionRet = client.addPropertyToProject(clProperty);
					// 		// if (exceptionRet) {

					// 		// 	throw exceptionRet;
					// 		// }

					// 		// m_dialog.close();

					// 	} catch (e) {

					// 		errorHelper.show(e);
					// 	}
					// }

					// // 3 functions to handle the Image changing link clicks.
					// var m_functionSearchClick = function () {

					// 	try {

					// 		var exceptionRet = client.showImageSearchDialog(true, m_functionSetImageSrc);
					// 		if (exceptionRet) {

					// 			throw exceptionRet;
					// 		}
					// 	} catch(e) {

					// 		errorHelper.show(e);
					// 	}
					// }
					
					// var m_functionURLClick = function () {

					// 	try {

					// 		var exceptionRet = client.showImageURLDialog(true, m_functionSetImageSrc);
					// 		if (exceptionRet) {

					// 			throw exceptionRet;
					// 		}
					// 	} catch(e) {

					// 		errorHelper.show(e);
					// 	}
					// }
					
					// var m_functionDiskClick = function () {

					// 	try {

					// 		var exceptionRet = client.showImageDiskDialog(true, m_functionSetImageSrc);
					// 		if (exceptionRet) {

					// 			throw exceptionRet;
					// 		}
					// 	} catch(e) {

					// 		errorHelper.show(e);
					// 	}
					// }

					// // Display the chosen image.
					// var m_functionSetImageSrc = function (imageResourceId) {

					// 	m_imageResourceId = imageResourceId;
					// 	$("#PropertyImage").attr("src", resourceHelper.toURL("resources", m_imageResourceId, "image"));
					// 	m_setStateCreateBtn();
					// }
				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
			};

			// Return the constructor function as the module object.
			return functionDeleteConfirmDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
