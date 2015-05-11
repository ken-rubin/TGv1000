/////////////////////////////////////////
// Code allows the user to build and manipulate 
// types for use in the designer and simulator.
//
// Return constructor function.

// Define AMD module.
define(["Core/errorHelper"], 
	function (errorHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function Code() {

				try {

					var self = this;			// Uber closure.

					////////////////////////////////
					// Pulbic fields.
 
					// Blockly schema as defined by the types loaded from the comic.
					self.schema = {};
					// Blockly Blocks defined by the types.
					self.blocks = {};
					// Blockly JavaScript defined by the types.
					self.javaScript = {};

					// Current workspace or null.
					self.workspace = null;

					// Callback invoked (if set) when the blockly frame is loaded or re-loaded.
					BlocklyIFrame_OnLoad = null;

					////////////////////////////////
					// Pulbic methods.

					// Method adds a type to blockly.
					self.addItem = function (type) {

						try {

							// Add a new for the type.
							var exceptionRet = m_functionAdd_Type_New(type);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Add properties.
							for (var i = 0; i < type.properties; i++) {

								var propertyIth = type.properties[i];
								exceptionRet = m_functionAdd_Type_Property(type,
									propertyIth);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Rebuild.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Method adds a property to a type to blockly.
					self.addProperty = function (type, property) {

						try {

							// Add a new for the type.
							var exceptionRet = m_functionAdd_Type_Property(type,
								property);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Rebuild.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Method renmes a property of a type to blockly.
					self.renameProperty = function (type, property, strOriginalName) {

						try {

							// Rename a property for the type.
							var exceptionRet = m_functionRename_Type_Property(type,
								property,
								strOriginalName);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Rebuild blockly.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Attach instance to DOM.
					self.create = function () {

						try {

							// Wire up resize to resize the code window when the browser is.
							$(window).resize(function () {

								try {

									var iViewportHeight = $(window).height();

									var iProjectItemHeight = $("#typestriprow").height();
									var iNavbarHeight = $(".navbar").height();
									var iBordersAndSpacingPadding = 48;

									$("#BlocklyIFrame").height(iViewportHeight - 
										iProjectItemHeight -
										iNavbarHeight -
										iBordersAndSpacingPadding);
								} catch (e) {

									errorHelper.show(e);
								}
							});

							return null;
						} catch (e) {

							return e;
						}
					};

					// Load code into frame.
					self.load = function (strCodeDOM) {

						try {

							// Save off workspace string.
							self.workspace = strCodeDOM;

							// Define a function which is invoked either immediately, or when the page loads.
							var functionLoad = function () {

								try {

									// Load the specified code DOM string into the blockly frame.
									$("#BlocklyIFrame")[0].contentWindow.setWorkspaceString(self.workspace);
								} catch (e) {

									errorHelper.show(e);
								}
							};

							// First time, point the frame at the blockly page.
							if (!m_bLoaded) {

								// Set the callback.
								self.BlocklyIFrame_OnLoad = functionLoad;

								// Load up blockly.
								$("#BlocklyIFrame")[0].src = "./frameworks/blockly/blocklyframe.html";
								m_bLoaded = true;
							} else {

								functionLoad();
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Save code from frame.
					self.save = function () {

						// Save the specified code DOM string into the blockly frame.
						return $("#BlocklyIFrame")[0].contentWindow.getWorkspaceString();
					};

					// Method invoked when the blockly frame content changes.
					self.blocklyChangeListener = function () {

						try {

                            // Get the new workspace and code.
                            self.workspace = $("#BlocklyIFrame")[0].contentWindow.getWorkspaceString();
                            var strMethod = $("#BlocklyIFrame")[0].contentWindow.getMethodString();

                            // Set the new data in the type strip.
                            var exceptionRet = typeStrip.update(self.workspace,
                            	strMethod);
                            if (exceptionRet) {

                            	throw exceptionRet;
                            }
						} catch (e) {

							errorHelper.show(e);
						}
					};

					///////////////////////////////////////
					// Private methods.

					// Helper method generates the function string for a "new" type function.
					var m_functionGenerateBlocksTypeNewFunctionString = function (strName) {

						return "this.appendDummyInput().appendField('new_"+strName+"');" +
							"this.setColour(10);" +
							"this.setOutput(true);" +
							"this.setInputsInline(true);" +
							"this.setTooltip('Allocate new type instance.');";
					};

					// Helper method generates the javascript string for a property get function.
					var m_functionGenerateJavaScriptTypeNewFunctionString = function (strName) {

						return 'return [" new ' + strName + '() ", Blockly.JavaScript.ORDER_MEMBER];';
					};

					// Helper method generates the function string for a property get function.
					var m_functionGenerateBlocksPropertyGetFunctionString = function (strName) {

						return "this.appendDummyInput().appendField('"+strName+"');" +
							"this.appendValueInput('SELF').appendField('self');" +
							"this.setColour(20);" +
							"this.setOutput(true);" +
							"this.setInputsInline(true);" +
							"this.setTooltip('"+strName+"');";
					};

					// Helper method generates the javascript string for a property get function.
					var m_functionGenerateJavaScriptPropertyGetFunctionString = function (strName) {

						return 'var strId = Blockly.JavaScript.valueToCode(block,"SELF",Blockly.JavaScript.ORDER_ADDITION) || "";' +
            				'return [" " + strId + "[\'' + strName + '\'] ", Blockly.JavaScript.ORDER_MEMBER];';
					};

					// Helper method generates the function string for a property set function.
					var m_functionGenerateBlocksPropertySetFunctionString = function (strName) {

						return "this.appendDummyInput().appendField('"+strName+"');" +
							"this.appendValueInput('SELF').appendField('self');" +
							"this.appendValueInput('VALUE').appendField('value');" +
							"this.setColour(30);" +
							"this.setPreviousStatement(true);" +
							"this.setNextStatement(true);" +
							"this.setInputsInline(true);" +
							"this.setTooltip('"+strName+"');";
					};

					// Helper method generates the javascript string for a property set function.
					var m_functionGenerateJavaScriptPropertySetFunctionString = function (strName) {

						return 'var strId = Blockly.JavaScript.valueToCode(block,"SELF",Blockly.JavaScript.ORDER_ADDITION) || "";' +
					        'var strValue = Blockly.JavaScript.valueToCode(block, "VALUE",Blockly.JavaScript.ORDER_ADDITION) || "";' +
					        'return " " + strId + "[\'' + strName + '\'] = " + strValue + "; "';
					};

					// Helper method adds a type's new_ constructor function.
					var m_functionAdd_Type_New = function (type) {

						try {

							////////////////////////
							// Blocks.

							self.blocks["new_" + type.data.name] = m_functionGenerateBlocksTypeNewFunctionString(type.data.name);

							////////////////////////
							// JavaScript.
							self.javaScript["new_" + type.data.name] = m_functionGenerateJavaScriptTypeNewFunctionString(type.data.name);

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var typeNew = { };
							typeNew["new_" + type.data.name] = true
							objectTypes[type.data.name] = typeNew;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method adds a type's property accessor functions.
					var m_functionAdd_Type_Property = function (type, property) {

						try {

							////////////////////////
							////////////////////////
							////////////////////////
							// Get

							////////////////////////
							// Blocks.
							var strGetName = type.data.name + "_get" + property.name;
							self.blocks[strGetName] = m_functionGenerateBlocksPropertyGetFunctionString(strGetName);

							////////////////////////
							// JavaScript.
							self.javaScript[strGetName] = m_functionGenerateJavaScriptPropertyGetFunctionString(property.name);

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[type.data.name];
							objectType[strGetName] = true;


							////////////////////////
							////////////////////////
							////////////////////////
							// Set

							////////////////////////
							// Blocks.
							var strSetName = type.data.name + "_set" + property.name;
							self.blocks[strSetName] = m_functionGenerateBlocksPropertySetFunctionString(strSetName);

							////////////////////////
							// JavaScript.
							self.javaScript[strSetName] = m_functionGenerateJavaScriptPropertySetFunctionString(property.name);

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[type.data.name];
							objectType[strSetName] = true;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method renames a type's property accessor functions.
					var m_functionRename_Type_Property = function (type, property, strOriginal) {

						try {

							////////////////////////
							////////////////////////
							////////////////////////
							// Get

							////////////////////////
							// Blocks.
							var strOriginalName = type.data.name + "_get" + strOriginal;
							var strGetName = type.data.name + "_get" + property.name;
							delete self.blocks[strOriginalName];
							self.blocks[strGetName] = m_functionGenerateBlocksPropertyGetFunctionString(strGetName);

							////////////////////////
							// JavaScript.
							delete self.javaScript[strOriginalName];
							self.javaScript[strGetName] = m_functionGenerateJavaScriptPropertyGetFunctionString(property.name);

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[type.data.name];
							objectType[strGetName] = true;
							delete objectType[strOriginalName];

							////////////////////////
							////////////////////////
							////////////////////////
							// Set

							////////////////////////
							// Blocks.
							var strOriginalSetName = type.data.name + "_set" + strOriginal;
							var strSetName = type.data.name + "_set" + property.name;
							delete self.blocks[strOriginalSetName];
							self.blocks[strSetName] = m_functionGenerateBlocksPropertySetFunctionString(strSetName);

							////////////////////////
							// JavaScript.
							delete self.javaScript[strOriginalSetName];
							self.javaScript[strSetName] = m_functionGenerateJavaScriptPropertySetFunctionString(property.name);

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[type.data.name];
							objectType[strSetName] = true;
							delete objectType[strOriginalSetName];

							return null;
						} catch (e) {

							return e;
						}
					};

					///////////////////////////////////////
					// Private fields.

					// Reference to the blockly frame.
					var m_ifBlockly = null;
					// Indicates there is something to save.
					var m_bDirty = false;
					// Indicates load has been called on this instance.
					var m_bLoaded = false;
				} catch (e) {

					errorHelper.show(e);
				}
			};

			// Return constructor function.
			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
