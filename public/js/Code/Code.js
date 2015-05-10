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

							// Point the blocky frame at its destination.
							$("#BlocklyIFrame")[0].src = "./frameworks/blockly/blocklyframe.html";
							return null;
						} catch (e) {

							return e;
						}
					};

					// Load code into frame.
					self.load = function (strCodeDOM) {

						try {

							// Load the specified code DOM string into the blockly frame.
							$("#BlocklyIFrame")[0].contentWindow.setWorkspaceString(strCodeDOM);

							self.workspace = strCodeDOM;

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

					// Save code from frame.
					self.setWorkspace = function (strWorkspace) {

						self.workspace = strWorkspace;
					};

					// Sets the workspace string in the blockly frame.
					self.setWorkspaceStringInBlocklyFrame = function () {

						$("#BlocklyIFrame")[0].contentWindow.getWorkspaceString(self.workspace);
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

					// Helper method adds a type's new_ constructor function.
					var m_functionAdd_Type_New = function (type) {

						try {

							////////////////////////
							// Blocks.
							self.blocks["new_" + type.data.name] = {

						        init: function() {

						            this.appendDummyInput()
						                .appendField("new_" + type.data.name);
						            this.setColour(10);
						            this.setOutput(true);
						            this.setInputsInline(true);
						           this.setTooltip("Allocate new type instance.");
						        }
						    };

							////////////////////////
							// JavaScript.
							self.javaScript["new_" + type.data.name] = function() {

						        return [" new " + type.data.name + "() ", 1];	// 1 --> ORDER_MEMBER
						    };

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
							self.blocks[strGetName] = {

						        init: function() {

						            this.appendDummyInput()
						                .appendField(strGetName);
						            this.appendValueInput("SELF")
              							.appendField("self");
						            this.setColour(20);
						            this.setOutput(true);
						            this.setInputsInline(true);
						           this.setTooltip(strGetName);
						        }
						    };

							////////////////////////
							// JavaScript.
							self.javaScript[strGetName] = function(block) {

								var blockly = m_ifBlockly.contentWindow.Blockly;
						        var strId = blockly.JavaScript.valueToCode(block, 
						        	"SELF", 
						        	blockly.JavaScript.ORDER_ADDITION) || "";
						        return [" " + 
							        	strId + 
							        	"['" + 
							        	property.name + 
							        	"'] ", 
						        	blockly.JavaScript.ORDER_MEMBER];
						    };

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
							self.blocks[strSetName] = {

						        init: function() {

						            this.appendDummyInput()
						                .appendField(strSetName);
						            this.appendValueInput("SELF")
              							.appendField("self");
						            this.appendValueInput("VALUE")
              							.appendField("value");
						            this.setColour(30);
						            this.setPreviousStatement(true);
						            this.setNextStatement(true);
						            this.setInputsInline(true);
						           this.setTooltip(strSetName);
						        }
						    };

							////////////////////////
							// JavaScript.
							self.javaScript[strSetName] = function(block) {

								var blockly = m_ifBlockly.contentWindow.Blockly;
						        var strId = blockly.JavaScript.valueToCode(block, 
						        	"SELF", 
						        	blockly.JavaScript.ORDER_ADDITION) || "";
						        var strValue = blockly.JavaScript.valueToCode(block, 
						        	"VALUE", 
						        	blockly.JavaScript.ORDER_ADDITION) || "";
						        return " " + 
							        	strId + 
							        	"['" + 
							        	property.name + 
							        	"'] = " + 
							        	strValue + 
							        	"; ";
						    };

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
							self.blocks[strGetName] = self.blocks[strOriginalName];
							delete self.blocks[strOriginalName];

							////////////////////////
							// JavaScript.
							self.javaScript[strGetName] = self.javaScript[strOriginalName];
							delete self.javaScript[strOriginalName];

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
							self.blocks[strSetName] = self.blocks[strOriginalSetName];
							delete self.blocks[strOriginalSetName];

							////////////////////////
							// JavaScript.
							self.javaScript[strSetName] = self.javaScript[strOriginalSetName];
							delete self.javaScript[strOriginalSetName];

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
