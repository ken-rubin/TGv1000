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
					            		id: 'CreateMethodBtn',
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

							$(".tt-selector .btn-default").tooltip();

							// Save the dailog object reference.
							m_dialog = dialogItself;
							m_functionSetImageSrc(0);
							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);
							$("#MethodName").focus();

							$("#MethodName").blur(m_functionBlurMethodName);

							m_setStateCreateBtn();

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionBlurMethodName = function() {

							m_setStateCreateBtn();
					}

					var m_setStateCreateBtn = function() {

						var nameStatus = $("#MethodName").val().trim().length > 0;
						var imgStatus = m_imageId > 0;

						if (!nameStatus || !imgStatus) {
							$("#CreateMethodBtn").addClass("disabled");
						} else {
							$("#CreateMethodBtn").removeClass("disabled");
						}
					}

					var m_functionCreateMethod = function () {

						try {

							var methodName = $("#MethodName").val().trim();


							if (!client.isMethodNameAvailableInActiveType(methodName, -1)) {

								errorHelper.show("That name is already used. Please enter another.");
								return;
							}

							// Create Method based on the new Method dialog's fields--or lack thereof.
							// Call client to inject it.
							var method = 
							{
								id: 0,
								name: methodName,
								workspace: "",
								method: "",
								tags: $("#MethodTags").val().trim(),
								imageId: m_imageId,
								ordinal: 0,
								price: 0.0,
								description: $("#MethodDescription").val() || ''
							};

							var exceptionRet = client.addMethodToActiveType(method);
							if (exceptionRet) {

								throw exceptionRet;
							}

							m_dialog.close();

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
					var m_functionSetImageSrc = function (imageId) {

						m_imageId = imageId;
						$("#MethodImage").attr("src", resourceHelper.toURL("resources", m_imageId, "image"));
						m_setStateCreateBtn();
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
				var m_imageId = 0;
			};

			// Return the constructor function as the module object.
			return functionNewMethodDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
