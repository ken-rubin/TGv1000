////////////////////////////////////
// NewPropertyDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

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
							$("#DataType").change(m_functionHandleDataTypeSelectChange);

							if (m_strNewOrEdit === 'New') {

								$("#DataType").val("0");

							} else {

								// Edit mode for properties[m_iIndexIfEdit].
								m_property = types.getActiveClType().data.properties[m_iIndexIfEdit];
								$("#PropertyName").val(m_property.name);
								
								$("#DataType").val(m_property.propertyTypeId.toString());

								if (m_property.propertyTypeId === 1 || m_property.propertyTypeId === 3) {

									$("#NumberOrStringInitial").val(m_property.initialValue);
									$("#NumberOrStringValue").css("display", "block");
									$("#InitialContainer").css("display", "block");
								
								} else if (m_property.propertyTypeId === 2) {

									var parts = m_property.initialValue.split("-");
									if (parts.length === 2) {

										$("#RangeFromInitial").val(parts[0]);
										$("#RangeThruInitial").val(parts[1]);
										$("#NumberRangeValue").css("display", "block");
										$("#InitialContainer").css("display", "block");
									}
								} else if (m_property.propertyTypeId === 4) {

									if (m_property.initialValue === 'true') {

										$("#TrueRadio").prop("checked", true);

									} else {

										$("#FalseRadio").prop("checked", true);

									}
									$("#BooleanValue").css("display", "block");
									$("#InitialContainer").css("display", "block");

								} else if (m_property.propertyTypeId === 5) {


									$("#PicklistInitial").val(m_property.initialValue);
									$("#PicklistValue").css("display", "block");
									$("#InitialContainer").css("display", "block");
								
								} else {

									$("#TypeValue").css("display", "block");
									$("#InitialContainer").css("display", "block");
								}
							}

							m_setStateCreateBtn();

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionBlurPropertyName = function() {

							m_setStateCreateBtn();
					}

					var m_functionHandleDataTypeSelectChange = function(event) {

						var selVal = $("#DataType option:selected").val();	// numeric







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

							var propertyName = $("#PropertyName").val().trim();
							
							if (!client.isPropertyNameAvailableInActiveType(propertyName)) {

								errorHelper.show("That name is already used. Please enter another.");
								return;
							}

							// Create Property based on the dialog's fields.
							// Call client to inject it throughout.
							var property = 
							{
								id: 0,






							};

							var exceptionRet = client.addPropertyToActiveType(property);
							if (exceptionRet) { throw exceptionRet; }

							m_dialog.close();

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
				var m_property = null;
			};

			// Return the constructor function as the module object.
			return functionNewPropertyDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
