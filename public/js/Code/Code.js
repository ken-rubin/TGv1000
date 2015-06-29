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
					self.addType = function (clType) {

						try {

							// Add a new for the type.
							var exceptionRet = m_functionAdd_Type_New(clType);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Add properties.
							for (var i = 0; i < clType.data.properties.length; i++) {

								var propertyIth = clType.data.properties[i];
								exceptionRet = m_functionAdd_Type_Property(clType,
									propertyIth);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Add methods.
							for (var i = 0; i < clType.data.methods.length; i++) {

								var methodIth = clType.data.methods[i];
								exceptionRet = m_functionAdd_Type_Method(clType,
									methodIth);
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

					// Method renames a type in blockly.
					self.renameType = function (type, strOriginalName) {

						try {

							// Rename type.
							var exceptionRet = m_functionRename_Type_New(type, 
								strOriginalName);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Rename properties.
							for (var i = 0; i < type.data.properties.length; i++) {

								var propertyIth = type.data.properties[i];
								var exceptionRet = m_functionRename_Type_Property(type,
									propertyIth,
									propertyIth.name, 
									strOriginalName);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Rename methods.
							for (var i = 0; i < type.data.methods.length; i++) {

								var methodIth = type.data.methods[i];
								var exceptionRet = m_functionRename_Type_Method(type,
									methodIth,
									methodIth.name, 
									strOriginalName);
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

					// Remove type from schema, blocks and javaScript.  
					// It is already not in any workspace per validation.
					self.removeType = function (type) {

						try {

							// Remove the new.
							var exceptionRet = m_functionRemove_Type_New(type);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Remove properties.
							for (var i = 0; i < type.data.properties.length; i++) {

								var propertyIth = type.data.properties[i];
								var exceptionRet = m_functionRemove_Type_Property(type,
									propertyIth);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Remove methods.
							for (var i = 0; i < type.data.methods.length; i++) {

								var methodIth = type.data.methods[i];
								var exceptionRet = m_functionRemove_Type_Method(type,
									methodIth);
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

					// Return referencing method for the specified Type.
					self.isTypeReferencedInWorkspace = function (type) {

						try {

							// Test if the type-new function is referenced.
							var methodReferenced = m_functionIsReferenced_Type_New(type);
							if (methodReferenced) {

								return methodReferenced;
							}

							// Test if any of the properties are referenced.
							for (var i = 0; i < type.data.properties.length; i++) {

								var propertyIth = type.data.properties[i];
								var methodReferenced = m_functionIsReferenced_Type_Property(type,
									propertyIth);
								if (methodReferenced) {

									return methodReferenced;
								}
							}

							// Test if any of the methods are referenced.
							for (var i = 0; i < type.data.methods.length; i++) {

								var methodIth = type.data.methods[i];
								var methodReferenced = m_functionIsReferenced_Type_Method(type,
									methodIth);
								if (methodReferenced) {

									return methodReferenced;
								}
							}

							return null;
						} catch (e) {

							errorHelper.show(e);
							return null;
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

					// Remove property from schema, blocks and javaScript.  
					// It is already not in any workspace per validation.
					self.removeProperty = function (type, property) {

						try {

							var exceptionRet = m_functionRemove_Type_Property(type,
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

					// Return referencing method for the specified property.
					self.isPropertyReferencedInWorkspace = function (type, property) {

						return m_functionIsReferenced_Type_Property(type,
							property);
					};

					// Method adds a method to a type to blockly.
					self.addMethod = function (type, method) {

						try {

							// Add method for the type.
							var exceptionRet = m_functionAdd_Type_Method(type,
								method);
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

					// Method renmes a method of a type to blockly.
					self.renameMethod = function (type, method, strOriginalName) {

						try {

							// Rename a method for the type.
							var exceptionRet = m_functionRename_Type_Method(type,
								method,
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

					// Remove method from schema, blocks and javaScript.  
					// It is already not in any workspace per validation.
					self.removeMethod = function (type, method) {

						try {

							var exceptionRet = m_functionRemove_Type_Method(type,
								method);
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

					// Return referencing method for the specified property.
					self.isMethodReferencedInWorkspace = function (type, method) {

						return m_functionIsReferenced_Type_Method(type,
							method);
					};

					// Attach instance to DOM.
					self.create = function () {

						try {

							// Wire up resize to resize the code window when the browser is.
							$(window).resize(function () {

								try {

									var iViewportHeight = $(window).height();
									var iTypeWellHeight = $("#TypeWell").height();
									var iColXs1Width = $(".forgettingwidth").width();

									var iBordersAndSpacingPadding = 70;

									// Center the vertical toolstrip and panelstrip vertically in the viewport. It will remain fixed.
									var iToolstripTop = $("#toolstrip").position().top;
									$("#toolstrip").height(iViewportHeight - iToolstripTop * 2);
									var iToolstripWidth = $("#toolstrip").width();
									var strToolstripLeft = ((iColXs1Width - iToolstripWidth) / 2).toString() + "px";
									$("#toolstrip").css("margin-left", strToolstripLeft);
									
									var iComicPanelstripTop = $("#comicpanelstrip").position().top;
									$("#comicpanelstrip").height(iViewportHeight - iComicPanelstripTop * 2);
									var iComicpanelstripWidth = $("#comicpanelstrip").width();
									var strComicpanelstripLeft = ((iColXs1Width - iComicpanelstripWidth) / 2).toString() + "px";
									$("#comicpanelstrip").css("margin-left", strComicpanelstripLeft);

									$("#BlocklyIFrame").height(iViewportHeight - 
										iTypeWellHeight -
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
					self.load = function (clType,
						method,
						strCodeDOM) {

						try {

							// Set the title.
							// $("#titlediv").text(clType.data.name + " :: " + method.name);

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
                            var exceptionRet = types.update(self.workspace,
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
							"this.appendValueInput('SELF').appendField('from');" +
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
							"this.appendValueInput('SELF').appendField('in');" +
							"this.appendValueInput('VALUE').appendField('to');" +
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

					// Helper method generates the function string for a method function.
					var m_functionGenerateBlocksMethodFunctionString = function (strName) {

						return "this.appendDummyInput().appendField('"+strName+"');" +
							"this.appendValueInput('SELF').appendField('using');" +
							"this.setColour(40);" +
							"this.setOutput(true);" +
							"this.setInputsInline(true);" +
							"this.setTooltip('"+strName+"');";
					};

					// Helper method generates the javascript string for a method function.
					var m_functionGenerateJavaScriptMethodFunctionString = function (strName) {

						return 'var strId = Blockly.JavaScript.valueToCode(block,"SELF",Blockly.JavaScript.ORDER_ADDITION) || "";' +
            				'return [" " + strId + "[\'' + strName + '\']() ", Blockly.JavaScript.ORDER_MEMBER];';
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
							typeNew["new_" + type.data.name] = true;
							objectTypes[type.data.name] = typeNew;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method removes a type's new_ constructor function.
					var m_functionRemove_Type_New = function (type) {

						try {

							////////////////////////
							// Blocks.

							delete self.blocks["new_" + type.data.name];

							////////////////////////
							// JavaScript.
							delete self.javaScript["new_" + type.data.name];

							////////////////////////
							// Schema.
							if (self.schema &&
								self.schema.Types) {

								delete self.schema.Types[type.data.name];
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method renames a type's new_ constructor function.
					var m_functionRename_Type_New = function (type, strOriginalName) {

						try {

							////////////////////////
							// Blocks.

							delete self.blocks["new_" + strOriginalName];
							self.blocks["new_" + type.data.name] = m_functionGenerateBlocksTypeNewFunctionString(type.data.name);

							////////////////////////
							// JavaScript.
							delete self.javaScript["new_" + strOriginalName];
							self.javaScript["new_" + type.data.name] = m_functionGenerateJavaScriptTypeNewFunctionString(type.data.name);

							////////////////////////
							// Workspace.
							if (self.workspace) {

								var re = new RegExp("new_" + strOriginalName,"g");
								self.workspace = self.workspace.replace(re,
									"new_" + type.data.name);
								var exceptionRet = types.replaceInWorkspaces("new_" + strOriginalName,
									"new_" + type.data.name);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;

							// Bet the type.
							var typeNew = objectTypes[type.data.name];

							// Remove the old name.
							delete objectTypes[strOriginalName];

							if (!typeNew) {

								typeNew = {};
							}
							typeNew["new_" + type.data.name] = true
							objectTypes[type.data.name] = typeNew;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method determines if the type's new is referenced 
					// anywhere.  Returns the referencing method if found.
					var m_functionIsReferenced_Type_New = function (type) {

						try {

							// Look for this:
							var strLookFor = "new_" + type.data.name;

							return types.isReferencedInWorkspace(strLookFor);
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

					// Helper method removes a type's new_ constructor function.
					var m_functionRemove_Type_Property = function (type, property) {

						try {

							var strGet = type.data.name + "_get" + property.name;
							var strSet = type.data.name + "_set" + property.name;

							////////////////////////
							// Blocks.

							delete self.blocks[strGet];
							delete self.blocks[strSet];

							////////////////////////
							// JavaScript.

							delete self.javaScript[strGet];
							delete self.javaScript[strSet];

							////////////////////////
							// Schema.
							if (self.schema &&
								self.schema.Types &&
								self.schema.Types[type.data.name]) {

								var objectType = self.schema.Types[type.data.name];
								delete objectType[strGet];
								delete objectType[strSet];
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method renames a type's property accessor functions.
					var m_functionRename_Type_Property = function (type, property, strOriginal, strOriginalTypeName) {

						try {

							if (!strOriginalTypeName) {

								strOriginalTypeName = type.data.name;
							}
							////////////////////////
							////////////////////////
							////////////////////////
							// Get

							////////////////////////
							// Blocks.
							var strOriginalName = strOriginalTypeName + "_get" + strOriginal;
							var strGetName = type.data.name + "_get" + property.name;
							delete self.blocks[strOriginalName];
							self.blocks[strGetName] = m_functionGenerateBlocksPropertyGetFunctionString(strGetName);

							////////////////////////
							// JavaScript.
							delete self.javaScript[strOriginalName];
							self.javaScript[strGetName] = m_functionGenerateJavaScriptPropertyGetFunctionString(property.name);

							////////////////////////
							// Workspace.
							if (self.workspace) {

								var re = new RegExp(strOriginalName,"g");
								self.workspace = self.workspace.replace(re,
									strGetName);
								var exceptionRet = types.replaceInWorkspaces(strOriginalName,
									strGetName);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

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
							var strOriginalSetName = strOriginalTypeName + "_set" + strOriginal;
							var strSetName = type.data.name + "_set" + property.name;
							delete self.blocks[strOriginalSetName];
							self.blocks[strSetName] = m_functionGenerateBlocksPropertySetFunctionString(strSetName);

							////////////////////////
							// JavaScript.
							delete self.javaScript[strOriginalSetName];
							self.javaScript[strSetName] = m_functionGenerateJavaScriptPropertySetFunctionString(property.name);

							////////////////////////
							// Workspace.
							if (self.workspace) {

								var re = new RegExp(strOriginalSetName,"g");
								self.workspace = self.workspace.replace(re,
									strSetName);
								var exceptionRet = types.replaceInWorkspaces(strOriginalSetName,
									strSetName);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

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

					// Helper method determines if the type's new is referenced 
					// anywhere.  Returns the referencing method if found.
					var m_functionIsReferenced_Type_Property = function (type, property) {

						try {

							// Look for this:
							var strGetName = type.data.name + "_get" + property.name;
							var strSetName = type.data.name + "_set" + property.name;

							var methodReferenced = types.isReferencedInWorkspace(strGetName);
							if (methodReferenced) {

								return methodReferenced;
							}
							return types.isReferencedInWorkspace(strSetName);
						} catch (e) {

							return e;
						}
					};

					// Helper method adds a type's method accessor functions.
					var m_functionAdd_Type_Method = function (type, method) {

						try {

							////////////////////////
							// Blocks.
							var strName = type.data.name + "_" + method.name;
							self.blocks[strName] = m_functionGenerateBlocksMethodFunctionString(strName);

							////////////////////////
							// JavaScript.
							self.javaScript[strName] = m_functionGenerateJavaScriptMethodFunctionString(method.name);

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[type.data.name];
							objectType[strName] = true;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method removes a type's new_ constructor function.
					var m_functionRemove_Type_Method = function (type, method) {

						try {

							var strName = type.data.name + "_" + method.name;

							////////////////////////
							// Blocks.

							delete self.blocks[strName];

							////////////////////////
							// JavaScript.

							delete self.javaScript[strName];

							////////////////////////
							// Schema.
							if (self.schema &&
								self.schema.Types &&
								self.schema.Types[type.data.name]) {

								var objectType = self.schema.Types[type.data.name];
								delete objectType[strName];
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method renames a type's method accessor functions.
					var m_functionRename_Type_Method = function (type, method, strOriginal, strOriginalTypeName) {

						try {

							if (!strOriginalTypeName) {

								strOriginalTypeName = type.data.name;
							}

							////////////////////////
							// Blocks.
							var strOriginalName = strOriginalTypeName + "_" + strOriginal;
							var strName = type.data.name + "_" + method.name;
							delete self.blocks[strOriginalName];
							self.blocks[strName] = m_functionGenerateBlocksMethodFunctionString(strName);

							////////////////////////
							// JavaScript.
							delete self.javaScript[strOriginalName];
							self.javaScript[strName] = m_functionGenerateJavaScriptMethodFunctionString(method.name);

							////////////////////////
							// Workspace.
							if (self.workspace) {

								var re = new RegExp(strOriginalName,"g");
								self.workspace = self.workspace.replace(re,
									strName);
								var exceptionRet = types.replaceInWorkspaces(strOriginalName,
									strName);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[type.data.name];
							objectType[strName] = true;
							delete objectType[strOriginalName];

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method determines if the type's new is referenced 
					// anywhere.  Returns the referencing method if found.
					var m_functionIsReferenced_Type_Method = function (type, method) {

						try {

							// Look for this:
							var strName = type.data.name + "_" + method.name;

							return types.isReferencedInWorkspace(strName);
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
