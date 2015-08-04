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
							$("#PropertyName").blur(m_setStateCreateBtn);
							$("#PicklistInitial").blur(m_setStateCreateBtn);
							$("#DataType").change(m_functionHandleDataTypeSelectChange);

							if (m_strNewOrEdit === 'New') {

								$("#DataType").val("0");
								m_iDataType = 0;
								m_property = {
									id: 0,
                                    originalPropertyId: 0,
                                    name: '',
                                    initialValue: '',
                                    ordinal: 0
								};
							} else {

								// Edit mode for properties[m_iIndexIfEdit].
								m_property = types.getActiveClType().data.properties[m_iIndexIfEdit];
								m_strOriginalNameIfEdit = m_property.name;
								$("#PropertyName").val(m_strOriginalNameIfEdit);
								m_iDataType = m_property.propertyTypeId;
								$("#DataType").val(m_iDataType.toString());

								if (m_iDataType === 1 || m_iDataType === 3) {

									$("#NumberOrStringInitial").val(m_property.initialValue);
									$("#NumberOrStringValue").css("display", "block");
									$("#InitialContainer").css("display", "block");
								
								} else if (m_iDataType === 2) {

									var parts = m_property.initialValue.split("-");
									if (parts.length === 2) {

										$("#RangeFromInitial").val(parts[0]);
										$("#RangeThruInitial").val(parts[1]);
										$("#NumberRangeValue").css("display", "block");
										$("#InitialContainer").css("display", "block");
									}
								} else if (m_iDataType === 4) {

									if (m_property.initialValue === 'true') {

										$("#TrueRadio").prop("checked", true);

									} else if (m_property.initialValue === 'false') {

										$("#FalseRadio").prop("checked", true);

									}
									$("#BooleanValue").css("display", "block");
									$("#InitialContainer").css("display", "block");

								} else if (m_iDataType === 5) {


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

					var m_functionHandleDataTypeSelectChange = function(event) {

						m_iDataType = parseInt($("#DataType option:selected").val(), 10);

						$("#InitialContainer").css("display", "none");
						$("#PropertyInitial").css("display", "none");
						$("#NumberOrStringValue").css("display", "none");
						$("#NumberRangeValue").css("display", "none");
						$("#BooleanValue").css("display", "none");
						$("#PicklistValue").css("display", "none");
						$("#TypeValue").css("display", "none");

						if (m_iDataType === 0) {

						} else {

							if (m_iDataType === 1 || m_iDataType === 3) {

								$("#NumberOrStringInitial").val("");
								$("#NumberOrStringValue").css("display", "block");
								$("#InitialContainer").css("display", "block");
							
							} else if (m_iDataType === 2) {

								$("#RangeFromInitial").val("");
								$("#RangeThruInitial").val("");
								$("#NumberRangeValue").css("display", "block");
								$("#InitialContainer").css("display", "block");

							} else if (m_iDataType === 4) {

								$("#BooleanValue").css("display", "block");
								$("#InitialContainer").css("display", "block");

							} else if (m_iDataType === 5) {

								$("#PicklistInitial").val("");
								$("#PicklistValue").css("display", "block");
								$("#InitialContainer").css("display", "block");
							
							} else {

								$("#TypeValue").css("display", "block");
								$("#InitialContainer").css("display", "block");
							}

							$("#PropertyInitial").css("display", "block");
						}

						m_setStateCreateBtn();
					}

					var m_setStateCreateBtn = function() {

						var nameStatus = $("#PropertyName").val().trim().length > 0;
						var strPicklistInitialVal = $("#PicklistInitial").val().trim();
						var initialValueStatus = strPicklistInitialVal.length > 0;			// Required only for picklist (m_iDataType === 5)

						if (nameStatus && ((m_iDataType === 5 && initialValueStatus) || (m_iDataType !== 5 && m_iDataType > 0))) {

							$("#SavePropertyBtn").removeClass("disabled");
						
						} else {

							$("#SavePropertyBtn").addClass("disabled");
						}
					}

					var m_functionSaveProperty = function () {

						try {

							if (m_iDataType === 0) {

								errorHelper.show("Please select a Data type.");
								return;
							}

							var propertyName = $("#PropertyName").val().trim();
							
							if (!client.isPropertyNameAvailableInActiveType(propertyName, m_iIndexIfEdit)) {

								errorHelper.show("That name is already used. Please enter another.");
								return;
							}

							var strInitialValue = "";
							switch (m_iDataType) {
								case 1:
									strInitialValue = $("#NumberOrStringInitial").val().trim();
									if (strInitialValue.length > 0) {

										if (!$.isNumeric(strInitialValue)) {

											errorHelper.show("Initial value must be numeric.");
											return;
										}
									}
									break;
								case 2:
									var strFrom = $("#RangeFromInitial").val().trim();
									var strThru = $("#RangeThruInitial").val().trim();
									var num = (strFrom.length > 0 ? 1 : 0) + (strThru.length > 0 ? 1 : 0);
									if (num > 0) {

										if (num === 1) {

											errorHelper.show("A Number range requires both from and thru.");
											return;
										}

										if (!$.isNumeric(strFrom) || !$.isNumeric(strThru)) {

											errorHelper.show("Non-numeric values are not allowed for Number ranges.");
											return;
										}

										var numFrom = parseFloat(strFrom);
										var numThru = parseFloat(strThru);
										if (numThru < numFrom) {

											errorHelper.show("Please reverse your numbers. The first must be less than the second.");
											return;
										}

										strInitialValue = strFrom + '-' + strThru;
									}
									break;
								case 3:
									strInitialValue = $("#NumberOrStringInitial").val().trim();
									break;
								case 4:
									if ($('input[value=1').prop("checked")) {

										strInitialValue = 'true';

									} else if ($('input[value=0').prop("checked")) {

										strInitialValue = 'false';
									}
									break;
								case 5:
									var strCheck = $("#PicklistInitial").val().trim();

									if (strCheck.length > 0) {

										var inputArray = strCheck.match(/([\w\-]+)/g);

										// Uniquify picks: there will be at least one....
									    var outputArray = [];
									    
									    for (var i = 0; i < inputArray.length; i++)
									    {
									        if (($.inArray(inputArray[i], outputArray)) == -1)
									        {
									            outputArray.push(inputArray[i]);
									        }
									    }
								
										strInitialValue = outputArray.join(' ');
									}
									break;
							}

							// Create Property based on the dialog's fields.
							// Call client to inject it throughout.
							var property = 
							{
								id: m_property.id || 0,
								name: propertyName,
								propertyTypeId: m_iDataType,
								ordinal: 0,
								initialValue: strInitialValue
							};

							if (m_strNewOrEdit === 'New') {

								var exceptionRet = client.addPropertyToActiveType(property);
								if (exceptionRet) { throw exceptionRet; }

							} else {

								var exceptionRet = client.updatePropertyInActiveType(property, m_iIndexIfEdit, m_strOriginalNameIfEdit);
								if (exceptionRet) { throw exceptionRet; }
							}

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
				var m_strOriginalNameIfEdit = "";
				var m_iDataType = 0;
			};

			// Return the constructor function as the module object.
			return functionNewPropertyDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
