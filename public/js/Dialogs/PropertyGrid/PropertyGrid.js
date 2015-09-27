////////////////////////////////////
// PropertyGrid module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the PropertyGrid constructor function.
			var functionPropertyGrid = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function(toolInstance, functionManipulateCallback) {	// functionManipulateCallback(changedProperty, newvalue)

						try {

							m_toolInstance = toolInstance;
							m_functionManipulateCallback = functionManipulateCallback;

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/PropertyGrid/propertyGrid"
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

								title: m_toolInstance.id + " Properties",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		id: "DeleteBtn",
					            		label: "Delete this Tool Instance",
					            		cssClass: "btn-primary"
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

							$("#DeleteBtn").click(m_functionDeleteToolInstance);

							$("#NewName").val(m_toolInstance.id);

							// Start a countdown timer for detecting NewName typing pause.
							// $("#NewName").keyup(function() {

							// 	clearTimeout(m_typingTimer);
							// 	if ($("#NewName").val()) {
							// 		m_typingTimer = setTimeout(function() {m_functionDoneTyping('NewName')}, m_doneTypingInterval); // Anonymous func needed for IE <= 9.
							// 	}
							// });

							$("#NewName").blur(m_functionChangeTIName);

							m_arrayProperties = [];

							// Build the table to display the toolinstance's properties.
							// Then use coder to get their current values.
							var clType = types.getType(m_toolInstance.type);

							if (clType) {

								clType.data.properties.forEach(function(prop){

									m_arrayProperties.push(
										{
											name: prop.name,
											propertyTypeId: prop.propertyTypeId,
											initialValue: prop.initialValue,
											currentValue: ''
										}
									);
								});
							}
							
							if (m_arrayProperties.length === 0) {

								throw new Error("Could not find Type in order to build complete property array.");
							}

							// Build the dialog's pseudo-grid.
							// Columns: name, property type, current value
							var strBuild = '<div class="PGParent">';
							for (var i = 0; i < m_arrayProperties.length; i++) {

								var m = m_arrayProperties[i];
								strBuild += '<div class="PGChild"><div class="PGPropCol1">' + m.name + '</div>';

								// Get the current value for this property--if it exists.
								m.currentValue = code.getPropertyCurrentValue(m.name, m_toolInstance.id, m_toolInstance.type);	// May return empty string, but not null.

								if (m.propertyTypeId === 1) {	// Number

									if (m.currentValue === '' && m.initialValue !== '') {

										m.currentValue = parseFloat(m.initialValue);
									}
									strBuild += '<div class="PGPropCol2">Number</div>';
									strBuild += '<div class="PGPropCol3"><input id="t1-'+i+'" type="text" placeHolder="Enter number" value="' + m.currentValue + '"></div>';
									var strVal = "$('#t1-" + i + "').val()";
									strBuild += '<div class="PGPropCol4"><button id="b1-'+i+'" type="button" onclick="m_functionManipulateCallback(1, &apos;' + m.name + '&apos;,' + strVal + ',null);" data-toggle="tooltip" aria-label="Save" title="Save" class="btn btn-default" ><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button></div>';

								} else if (m.propertyTypeId === 2) {	// Number range

									// initialValue was mandatory (x-y)
									strBuild += '<div class="PGPropCol2">Number in range&nbsp;'+m.initialValue+'</div>';
									strBuild += '<div class="PGPropCol3"><input id="t2-'+i+'" type="text" placeHolder="Enter number" value="' + m.currentValue + '"></div>';
									var strVal = "$('#t2-" + i + "').val()";
									strBuild += '<div class="PGPropCol4"><button id="b2-'+i+'" type="button" onclick="m_functionManipulateCallback(2, &apos;' + m.name + '&apos;,' + strVal + ',&apos;'+m.initialValue+'&apos;);" data-toggle="tooltip" aria-label="Save" title="Save" class="btn btn-default" ><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button></div>';

								} else if (m.propertyTypeId === 3) {	// String

									if (m.currentValue === '') {

										m.currentValue = m.initialValue;
									}
									strBuild += '<div class="PGPropCol2">String</div>';
									strBuild += '<div class="PGPropCol3"><input id="t3-'+i+'" type="text" placeHolder="Enter string" value="' + m.currentValue + '"></div>';
									var strVal = "$('#t3-" + i + "').val()";
									strBuild += '<div class="PGPropCol4"><button id="b3-'+i+'" type="button" onclick="m_functionManipulateCallback(3, &apos;' + m.name + '&apos;,&apos;' + strVal + '&apos;,null);" data-toggle="tooltip" aria-label="Save" title="Save" class="btn btn-default" ><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button></div>';

								} else if (m.propertyTypeId === 4) {	// Bool

									strBuild += '<div class="PGPropCol2">True or false</div>';
									strBuild += '<div class="PGPropCol3 style="display:inline-block;"><input type="radio" name="b-'+i+'" value="1" style="width:25px;"><span>true</span>&nbsp;&nbsp;&nbsp;<input type="radio" name="b-'+i+'" value="0" style="width:25px;"><span>false</span></div>';
									var strVal = "$('input[name=b-"+i+"]:checked').val()";
									strBuild += '<div class="PGPropCol4"><button id="b4-'+i+'" type="button" onclick="m_functionManipulateCallback(4, &apos;' + m.name + '&apos;,' + strVal + ',null);" data-toggle="tooltip" aria-label="Save" title="Save" class="btn btn-default" ><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button></div>';

								} else if (m.propertyTypeId === 5) {	// Picklist

									// m.initialValue is used to build the select list.
									// m.currentValue, if <> '', should be used to select current; defaulting to 'Select pick...'.
									strBuild += '<div class="PGPropCol2">Picklist</div>';
									strBuild += '<div class="PGPropCol3"><select id="t5-'+i+'" class="form-control"><option value="Select pick...">Select pick...</option>';

									var pickArray = m.initialValue.match(/([\w\-]+)/g);
									for (var j = 0; j < pickArray.length; j++) {

										var pickIth = pickArray[j];
										strBuild += '<option value="'+pickIth+'">'+pickIth+'</option>';
									}

									strBuild += '</select></div>';	// close <div class="PGPropCol3" and its child <select>
									var strVal = "$('#t5-"+i+" option:selected').text()";
									strBuild += '<div class="PGPropCol4"><button id="b5-'+i+'" type="button" onclick="m_functionManipulateCallback(5, &apos;' + m.name + '&apos;,' + strVal + ',null);" data-toggle="tooltip" aria-label="Save" title="Save" class="btn btn-default" ><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button></div>';

								} else if (m.propertyTypeId === 6) {	// Typelist

									// Actual Types in project (excluding App type and current type) are used to build the select list.
									// m.currentValue, if <> '', should be used to select current; defaulting to 'Select type...'.
									strBuild += '<div class="PGPropCol2">Type</div>';
									strBuild += '<div class="PGPropCol3"><select id="t6-'+i+'" class="form-control"><option value="Select type...">Select type...</option>';

									for (var j = 0; j < types.getLength(); j++) {

										var clTypeIth = types.getTypeByIndex(j);
										if (!clTypeIth.data.isApp && !(clTypeIth.data.name === m_toolInstance.type)) {

											strBuild += '<option value="'+clTypeIth.data.name+'">'+clTypeIth.data.name+'</option>';
										}
									}

									strBuild += '</select></div>';	// close <div class="PGPropCol3" and its child <select>
									var strVal = "$('#t6-"+i+" option:selected').text()";
									strBuild += '<div class="PGPropCol4"><button id="b6-'+i+'" type="button" onclick="m_functionManipulateCallback(6, &apos;' + m.name + '&apos;,' + strVal + ',null);" data-toggle="tooltip" aria-label="Save" title="Save" class="btn btn-default" ><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button></div>';

								} else {

									// We will only get here if someone adds a property type and forgets to handle the code here.
									errorHelper.show('Fell thru the property type loop in PropertyGrid.js');
								} 

								strBuild += '</div>';	// close <div class="PGChild"
							};
							strBuild += '</div>';

							$("#PropertiesTbody").empty();
							$("#PropertiesTbody").append(strBuild);

							// Styling
							var jqInput = $("input");
							jqInput.css("color", "blue");
							jqInput.css("font-family", "Verdana");
							jqInput.css("background-color", "aliceblue");

							// Special processing for propertyTypeIds 4,5,6
							for (var i = 0; i < m_arrayProperties.length; i++) {

								var m = m_arrayProperties[i];
								if (m.propertyTypeId === 4) {

									if (m.currentValue !== '') {
										// m.currentValue = '0' or '1'.
										$('input[name=b-'+i+'][value='+m.currentValue+']').prop('checked', true);
									}

								} else if (m.propertyTypeId === 5) {

									var jq5 = $("#t5-"+i);
									if (m.currentValue === '')
										jq5.val('Select pick...');
									else
										jq5.val(m.currentValue);

								} else if (m.propertyTypeId === 6) {

									var jq6 = $("#t6-"+i);
									if (m.currentValue === '')
										jq6.val('Select type...');
									else
										jq6.val(m.currentValue);
								}
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// If non-empty, change the name (id) of this tool instance (m_toolInstance).
					var m_functionChangeTIName = function () {

						var strVal = $("#NewName").val().trim();
						if (strVal.length === 0)
							return;
						
						if (strVal !== m_toolInstance.id) {

							// Validate:
							// cannot be the same as another tool instance ID
							// cannot be X,Y,Width,Height
							// cannot be the same as a type name--unless it is this tool instance's type
							if ($.inArray(strVal,['X','Y','Width','Height']) > -1) {

								errorHelper.show("X,Y,Width and Height are reserved words. Please choose a different name.");
								return;
							}

							var activeClComic = comics.getActiveComic();
							if (activeClComic) {

								var typesArray = activeClComic.getYourTypesArray();
								if (typesArray) {

									for (var i = 0; i < typesArray.length; i++) {

										var typeIth = typesArray[i];	// no data member
										if (strVal === typeIth.name && m_toolInstance.strType !== strVal) {

											errorHelper.show("That is the name of one of your Types. Please choose a different name.");
											return;
										}
									}
								}
							}

							if (!designer.isToolInstanceIdAvailable(strVal)) {
								
								errorHelper.show("That is the name of one of your tool instances. Please enother a different name.");
								return;
							}

							var exceptionRet = designer.changeToolInstanceId(m_toolInstance.id, strVal);
							if (exceptionRet) { throw exceptionRet; }

							// Update this dialog's tool instance, too.
							m_toolInstance.id = strVal;
							m_dialog.setTitle(strVal + " Properties");
						}
					}

					// Delete the double-clicked dropped Tool. No need for second confirmation, since user can just drop again.
					var m_functionDeleteToolInstance = function () {

						try {

							var exceptionRet = designer.deleteToolInstance(m_toolInstance);
							if (exceptionRet) { throw exceptionRet; }

							m_dialog.close();

						} catch (e) {

							errorHelper.show(e);
						}
					}

					// var m_functionDoneTyping = function(strWhichInput) {

					// 	try {

					// 		// Select the element.
					// 		var jqElem = $('#' + strWhichInput);

					// 		// Extract the value from the element.
					// 		var strVal = jqElem.val();
					// 		if (strWhichInput === 'NewName') {

					// 			if (strVal === m_toolInstance.id){
					// 				return;
					// 			}
					// 			var exceptionRet = designer.changeToolInstanceId(m_toolInstance.id, strVal);
					// 			if (exceptionRet) { throw exceptionRet; }

					// 			// Update this dialog's tool instance, too.
					// 			m_toolInstance.id = strVal;
					// 			m_dialog.setTitle(strVal + " Properties");
					// 		}
							
					// 	} catch(e) {

					// 		errorHelper.show(e);
					// 	}
					// }
				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_toolInstance = null;
				var m_dialog = null;
				var m_arrayProperties;
				var m_typingTimer;
				var m_doneTypingInterval = 500;	// A 3.5 sec pause in typing triggers an update.
			};

			// Return the constructor function as the module object.
			return functionPropertyGrid;

		} catch (e) {

			errorHelper.show(e);
		}
	});
m_functionManipulateCallback = null;
