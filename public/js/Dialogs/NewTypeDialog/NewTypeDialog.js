////////////////////////////////////
// NewTypeDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper", "Code/Type"], 
	function (snippetHelper, errorHelper, resourceHelper, Type) {

		try {

			// Define the NewTypeDialog constructor function.
			var functionNewTypeDialog = function () {

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

									templateFile: "Dialogs/NewTypeDialog/newTypeDialog"
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

								title: "New Type",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Create Type",
					            		id: 'CreateTypeBtn',
					            		cssClass: "btn-primary",
					            		action: function(){

					            			m_functionCreateType();
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
							$("#TypeName").focus();

							$("#TypeName").blur(m_functionBlurTypeName);

							m_setStateCreateBtn();

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionBlurTypeName = function() {

							m_setStateCreateBtn();
					}

					var m_setStateCreateBtn = function() {

						var nameStatus = $("#TypeName").val().trim().length > 0;
						var imgStatus = m_imageResourceId > 0;

						if (!nameStatus || !imgStatus) {
							$("#CreateTypeBtn").addClass("disabled");
						} else {
							$("#CreateTypeBtn").removeClass("disabled");
						}
					}

					var m_functionCreateType = function () {

						try {

							var typeName = $("#TypeName").val().trim();
							if (!client.isTypeNameAvailableInActiveComic(typeName, -1)) {

								errorHelper.show("That name is already used. Please enter another.");
								return;
							}

							// Create minimal Type based on the dialog's fields--or lack thereof.
							// Call client to inject it throughout.
							var typeJO = 
							{
								isApp: false,
								id: 0,
								ordinal: client.getNumberOfTypesInActiveComic(),
								tags: $("#TypeTags").val() || "",
								properties: [{ 

										name: "X", type: 1, initialValue: 0 
									}, { 

										name: "Y", type: 1, initialValue: 0 
									}, { 

										name: "Width", type: 1, initialValue: 0  
									}, { 

										name: "Height", type: 1, initialValue: 0  
								}],
								methods: [],
								events: [],
								dependencies: [],
								name: typeName,
								imageResourceId: m_imageResourceId
							};

							var clType = new Type();
							clType.load(typeJO);

							var exceptionRet = client.addTypeToProject(clType);
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
					var m_functionSetImageSrc = function (imageResourceId) {

						m_imageResourceId = imageResourceId;
						$("#TypeImage").attr("src", resourceHelper.toURL("resources", m_imageResourceId, "image"));
						m_setStateCreateBtn();
					}
				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_imageResourceId = 0;
			};

			// Return the constructor function as the module object.
			return functionNewTypeDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
