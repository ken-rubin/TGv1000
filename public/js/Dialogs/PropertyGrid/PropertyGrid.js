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

								title: m_toolInstance.type + " Properties",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
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

							m_properties = [];

							// Build the table to display the toolinstance's properties.
							// Then use coder to get their current values.
							var clType = types.getType(m_toolInstance.type);

							if (clType) {

								clType.data.properties.forEach(function(prop){

									m_properties.push(
										{
											name: prop.name,
											propertyTypeId: prop.propertyTypeId,
											initialValue: prop.initialValue,
											currentValue: null
										}
									);
								});
							}
							
							if (m_properties.length === 0) {

								throw new Error("Could not find Type in order to build complete property array.");
							}

							// Build the dialog's pseudo-grid.
							// Columns: name, property type, current value
							var strBuild = '<div class="PGParent">';
							for (var i = 0; i < m_properties.length; i++) {

								var m = m_properties[i];
								strBuild += '<div class="PGChild"><div class="PGPropCol1">' + m.name + '</div>';

								// Get the current value for this property.
								// 

								m.currentValue = '';

								if (m.propertyTypeId === 1) {

									strBuild += '<div class="PGPropCol2">Number</div>';
									strBuild += '<div class="PGPropCol3"><input id="t1-'+i+'" type="text" placeHolder="Enter number" style="width:30%;" value="' + m.currentValue + '"></div>';
									var strVal = "$('#t1-" + i + "').val()";
									strBuild += '<div class="PGPropCol4"><button id="b1-'+i+'" type="button" onclick="m_functionManipulateCallback(&apos;' + m.name + '&apos;,' + strVal + ');" data-toggle="tooltip" aria-label="Save" title="Save" class="btn btn-default" ><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button></div>';

								} else if (m.propertyTypeId === 2) {

									strBuild += '<div class="PGPropCol2">Number range</div>';
									var v1 = '';
									var v2 = '';
									if (m.currentValue.length > 0){

										var parts = m.currentValue.split('-');
										v1 = parts[0];
										v2 = parts[1];
									}
									strBuild += '<div class="PGPropCol3" style="display:inline-block;"><input id="t2_1-'+i+'" type="text" style="width:40%;" placeHolder="From" value="' + v1 + '">&nbsp;-&nbsp;<input id="t2_2-'+i+'" type="text" style="width:40%;" placeHolder="Thru" value="' + v2 + '"></div>';
									strBuild += '<div class="PGPropCol4"><button id="b2-'+i+'" type="button" data-toggle="tooltip" aria-label="Save" title="Save" class="btn btn-default" ><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button></div>';

								} else if (m.propertyTypeId === 3) {

									strBuild += '<div class="PGPropCol2">String</div>';
									strBuild += '<div class="PGPropCol3"><input id="t3-'+i+'" type="text" placeHolder="Enter string" style="width:90%;" value="' + m.currentValue + '"></div>';
									strBuild += '<div class="PGPropCol4"><button id="b3-'+i+'" type="button" data-toggle="tooltip" aria-label="Save" title="Save" class="btn btn-default" ><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button></div>';

								} else if (m.propertyTypeId === 4) {

									strBuild += '<div class="PGPropCol2">True or false</div>';
									strBuild += '<div class="PGPropCol3 style="display:inline-block;"><input id="t4_true-'+i+'" type="radio" name="b-'+i+'" value="1" style="width:25px;"><span>true</span><input id="t4_false-'+i+'" type="radio" name="b-'+i+'" value="0" style="width:25px;"><span>false</span></div>';
									strBuild += '<div class="PGPropCol4"><button id="b4-'+i+'" type="button" data-toggle="tooltip" aria-label="Save" title="Save" class="btn btn-default" ><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button></div>';

								} else if (m.propertyTypeId === 5) {

									strBuild += '<div class="PGPropCol2">Picklist</div>';
									strBuild += '<div class="PGPropCol3"><textarea id="t5-'+i+'" cols="47" rows="2" style="height: 35px;" placeholder="Enter values separated by space" value="' + m.currentValue + '"></textarea></div>';
									strBuild += '<div class="PGPropCol4"><button id="b5-'+i+'" type="button" data-toggle="tooltip" aria-label="Save" title="Save" class="btn btn-default" ><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button></div>';

								} else if (m.propertyTypeId === 6) {

									strBuild += '<div class="PGPropCol2">Type</div>';
									strBuild += '<div class="PGPropCol3"><select id="t6-'+i+'" style="width: 99%;" class="form-control"><option value="0">Select type...</option>';

									for (var j = 0; j < types.getLength(); j++) {

										var clTypeIth = types.getTypeByIndex(j);
										if (!clTypeIth.data.isApp && !(clTypeIth.data.name === m_toolInstance.type)) {

											strBuild += '<option value="'+(j+1)+'">'+clTypeIth.data.name+'</option>';
										}
									}

									strBuild += '</select></div>';	// close <div class="PGPropCol3" and its child <select>
									strBuild += '<div class="PGPropCol4"><button id="b6-'+i+'" type="button" data-toggle="tooltip" aria-label="Save" title="Save" class="btn btn-default" ><span class="glyphicon glyphicon-save" aria-hidden="true"></span></button></div>';

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

							// Now attach all handlers
							// for (var i = 0; i < m_properties.length; i++) {

							// 	var m = m_properties[i];
							// 	if (m.propertyTypeId === 1) {

							// 		$("#b1-"+i).click(
							// 			function() {

							// 				m_functionManipulateCallback(m.name, $("#t1-"+i).val());
							// 			}
							// 		);

							// 	} else if (m.propertyTypeId === 2) {

							// 	} else if (m.propertyTypeId === 3) {

							// 	} else if (m.propertyTypeId === 4) {

							// 	} else if (m.propertyTypeId === 5) {

							// 	} else if (m.propertyTypeId === 6) {

							// 	} else {

							// 	}


							// }





						} catch (e) {

							errorHelper.show(e);
						}
					};
				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_toolInstance = null;
				var m_dialog = null;
				var m_properties;
			};

			// Return the constructor function as the module object.
			return functionPropertyGrid;

		} catch (e) {

			errorHelper.show(e);
		}
	});
m_functionManipulateCallback = null;
