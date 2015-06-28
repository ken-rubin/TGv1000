////////////////////////////////////
// NewMethodDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the NewMethodDialog constructor function.
			var functionNewMethodDialog = function () {

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

									templateFile: "Dialogs/NewMethodDialog/newMethodDialog"
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

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the TypesDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "New Method",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Create Method",
					            		cssClass: "btn-primary",
					            		action: function(){

					            			m_functionCreateMethod();
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
							m_functionSetImageSrc(0);
							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);
							$("#MethodName").focus();

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionCreateMethod = function () {

						try {

							// Create minimal Method based on the new Method dialog's fields--or lack thereof.
							// Call client to inject it throughout.
							// var Method = 
							// {
							// 	name: $("#MethodName").val() || '',
							// 	id: 0,
							// 	description: $("#MethodDescription").val() || '',
							// 	tags: $("#MethodTags").val() || '',
							// 	imageResourceId: m_imageResourceId,
							// 	price: 0,
							// 	createdByUserId: client.getTGCookie('userId'),
							// 	isDirty: $("#MethodName").val().trim().length > 0 || $("#MethodDescription").val().trim().length > 0 || $("#MethodTags").val().trim().length > 0 || m_imageResourceId > 0,
							// 	comics: {
							// 		items: [{
							// 			imageResourceId: 0,
							// 			id: 0,
							// 			name: 'default',
							// 			tags: 'tagComic',
							// 			ordinal: 0,
							// 			types: {
							// 				items: [
							// 					{
							// 						isApp: true,
							// 						id: 0,
							// 						ordinal: 0,
							// 						tags: 'tagType',
							// 						properties: [{name: "property1", propType: "number", initialValue: "0"}],
							// 						methods: [{ name: "initialize", workspace: "", method: "" },{ name: "method1", workspace: "", method: "" },{ name: "method2", workspace: "", method: "" },{ name: "method3", workspace: "", method: "" }],
							// 						events: [{name: "event1", handler: "method1"}],
							// 						dependencies: [],
							// 						name: "app",
							// 						imageResourceId: 0
							// 					},
							// 					{
							// 						isApp: false,
							// 						id: 0,
							// 						ordinal: 1,
							// 						tags: 'tagType1',
							// 						properties: [],
							// 						methods: [],
							// 						events: [],
							// 						dependencies: [],
							// 						name: "Type1",
							// 						imageResourceId: 0
							// 					}
							// 				]
							// 			}
							// 		}]
							// 	}
							// };

							// var exceptionRet = client.functionNewMethod(Method);
							// if (exceptionRet) {

							// 	throw exceptionRet;
							// }

							// m_dialog.close();

						} catch (e) {

							errorHelper.show(e);
						}
					}

					// 3 functions to handle the Image changing link clicks.
					var m_functionSearchClick = function () {

						try {

							var exceptionRet = client.showImageSearchDialog(true, m_functionSetImageSrc);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch(e) {

							errorHelper.show(e);
						}
					}
					
					var m_functionURLClick = function () {

						try {

							var exceptionRet = client.showImageURLDialog(true, m_functionSetImageSrc);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch(e) {

							errorHelper.show(e);
						}
					}
					
					var m_functionDiskClick = function () {

						try {

							var exceptionRet = client.showImageDiskDialog(true, m_functionSetImageSrc);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch(e) {

							errorHelper.show(e);
						}
					}

					// Display the chosen image.
					var m_functionSetImageSrc = function (imageResourceId) {

						m_imageResourceId = imageResourceId;
						$("#MethodImage").attr("src", resourceHelper.toURL("resources", m_imageResourceId, "image"));
					}
				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_comicName = '';
				var m_comicTags = '';
				var m_imageResourceId = 0;
			};

			// Return the constructor function as the module object.
			return functionNewMethodDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});