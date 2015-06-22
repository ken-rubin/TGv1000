////////////////////////////////////
// NewPropertyDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper", "Code/Property"], 
	function (snippetHelper, errorHelper, resourceHelper, Property) {

		try {

			// Define the NewPropertyDialog constructor function.
			var functionNewPropertyDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function(strNewOrEdit, iIndexIfEdit) {

						try {

							m_strNewOrEdit = strNewOrEdit;
							m_iIndexIfEdit = iIndexIfEdit;

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/NewPropertyDialog/newPropertyDialog"
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

								title: (m_strNewOrEdit === "New") ? "Add new Property" : "Edit Property",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Save Property",
					            		id: 'SavePropertyBtn',
					            		cssClass: "btn-primary",
					            		action: function(){

					            			m_functionSaveProperty();
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
							$("#PropertyName").focus();

							$("#PropertyName").blur(m_functionBlurPropertyName);

							m_setStateCreateBtn();

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionBlurPropertyName = function() {

							m_setStateCreateBtn();
					}

					var m_setStateCreateBtn = function() {

						var nameStatus = $("#PropertyName").val().trim().length > 0;

						if (!nameStatus) {
							$("#CreatePropertyBtn").addClass("disabled");
						} else {
							$("#CreatePropertyBtn").removeClass("disabled");
						}
					}

					var m_functionSaveProperty = function () {

						try {

							var PropertyName = $("#PropertyName").val().trim();
							
							// if (!client.isPropertyNameAvailableInActiveComic(PropertyName)) {

							// 	errorHelper.show("That name is already used. Please enter another.");
							// 	return;
							// }

							// // Create minimal Property based on the dialog's fields--or lack thereof.
							// // Call client to inject it throughout.
							// var PropertyJO = 
							// {
							// 	isApp: false,
							// 	id: 0,
							// 	ordinal: client.getNumberOfPropertysInActiveComic(),
							// 	tags: $("#PropertyTags").val() || "",
							// 	properties: [],
							// 	methods: [],
							// 	Propertys: [],
							// 	dependencies: [],
							// 	name: PropertyName,
							// 	imageResourceId: m_imageResourceId
							// };

							// var clProperty = new Property();
							// clProperty.load(PropertyJO);

							// var exceptionRet = client.addPropertyToProject(clProperty);
							// if (exceptionRet) {

							// 	throw exceptionRet;
							// }

							// m_dialog.close();

						} catch (e) {

							errorHelper.show(e);
						}
					}
				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_strNewOrEdit = "";
				var m_iIndexIfEdit = -1;
			};

			// Return the constructor function as the module object.
			return functionNewPropertyDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
