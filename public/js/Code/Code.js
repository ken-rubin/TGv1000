/////////////////////////////////////////
// Code allows the user to build and manipulate 
// types for use in the designer and simulator.
//
// Return constructor function.

// Define AMD module.
define(["Core/errorHelper", "SourceScanner/processor"], 
	function (errorHelper, processor) {

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
//used					
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

							// Add events.

							

							// Rebuild.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Method renames a type in blockly.
					self.renameType = function (clType, strOriginalName) {

						try {

							// Rename type.
							var exceptionRet = m_functionRename_Type_New(clType, 
								strOriginalName);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Rename properties.
							for (var i = 0; i < clType.data.properties.length; i++) {

								var propertyIth = clType.data.properties[i];
								var exceptionRet = m_functionRename_Type_Property(clType,
									propertyIth,
									propertyIth.name, 
									strOriginalName);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Rename methods.
							for (var i = 0; i < clType.data.methods.length; i++) {

								var methodIth = clType.data.methods[i];
								var exceptionRet = m_functionRename_Type_Method(clType,
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
//used					
					self.removeType = function (clType) {

						try {

							// Remove the new.
							var exceptionRet = m_functionRemove_Type_New(clType);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Remove properties.
							for (var i = 0; i < clType.data.properties.length; i++) {

								var propertyIth = clType.data.properties[i];
								var exceptionRet = m_functionRemove_Type_Property(clType,
									propertyIth);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Remove methods.
							for (var i = 0; i < clType.data.methods.length; i++) {

								var methodIth = clType.data.methods[i];
								var exceptionRet = m_functionRemove_Type_Method(clType,
									methodIth);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Remove events.
							for (var i = 0; i < clType.data.events.length; i++) {

								var eventIth = clType.data.events[i];
								var exceptionRet = m_functionRemove_Type_Event(clType,
									eventIth);
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
//used
					self.isTypeReferencedInWorkspace = function (clType) {

						try {

							// Test if the type-new function is referenced.
							var methodReferenced = m_functionIsReferenced_Type_New(clType);
							if (methodReferenced) {

								return methodReferenced;
							}

							// Test if any of the properties are referenced.
							for (var i = 0; i < clType.data.properties.length; i++) {

								var propertyIth = clType.data.properties[i];
								var methodReferenced = m_functionIsReferenced_Type_Property(clType,
									propertyIth);
								if (methodReferenced) {

									return methodReferenced;
								}
							}

							// Test if any of the methods are referenced.
							for (var i = 0; i < clType.data.methods.length; i++) {

								var methodIth = clType.data.methods[i];
								var methodReferenced = m_functionIsReferenced_Type_Method(clType,
									methodIth);
								if (methodReferenced) {

									return methodReferenced;
								}
							}

							// Test if any of the events are referenced.
							for (var i = 0; i < clType.data.events.length; i++) {

								var eventIth = clType.data.events[i];
								var methodReferenced = m_functionIsReferenced_Type_Event(clType,
									eventIth);
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
//used					
					self.addProperty = function (clType, property) {

						try {

							// Add a new for the type.
							var exceptionRet = m_functionAdd_Type_Property(clType,
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

//used -  not finished
					self.updateProperty = function (clType, property, strOriginalName) {

						try {



							return null;

						} catch(e) {

							return e;
						}
					}					

					// Method adds an event to a type to blockly.
//used					
					self.addEvent = function (clType, event) {

						try {

							// Add a new for the type.
							var exceptionRet = m_functionAdd_Type_Event(clType,
								event);
							if (exceptionRet) { throw exceptionRet; }

							// Rebuild.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Method renames a property of a type to blockly.
					self.renameProperty = function (clType, property, strOriginalName) {

						try {

							// Rename a property for the type.
							var exceptionRet = m_functionRename_Type_Property(clType,
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
					self.removeProperty = function (clType, property) {

						try {

							var exceptionRet = m_functionRemove_Type_Property(clType,
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

					// Generic name reference checker
//used - needs to be written					
					self.isReferencedInWorkspace = function(strTest) {

						return null;
					}

					// Return referencing method for the specified property.
//used
					self.isPropertyReferencedInWorkspace = function (clType, property) {

						return m_functionIsReferenced_Type_Property(clType,
							property);
					};

					// Method adds a method to a type to blockly.
//used					
					self.addMethod = function (clType, method) {

						try {

							// Add method for the type.
							var exceptionRet = m_functionAdd_Type_Method(clType,
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

					self.renameEvent = function (clType, event, strOriginalName) {

						try {


							return null;

						} catch(e) {

							return e;
						}
					}

					// Method renmes a method of a type to blockly.
					self.renameMethod = function (clType, method, strOriginalName) {

						try {

							// Rename a method for the type.
							var exceptionRet = m_functionRename_Type_Method(clType,
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
					self.removeMethod = function (clType, method) {

						try {

							var exceptionRet = m_functionRemove_Type_Method(clType,
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
//used
					self.isMethodReferencedInWorkspace = function (clType, method) {

						return m_functionIsReferenced_Type_Method(clType,
							method);
					};

//used
					self.isEventReferencedInWorkspace = function (clType, event) {

						return m_functionIsReferenced_Type_Event(clType,
							event);
					}

					// Attach instance to DOM.
					self.create = function () {

						try {

							// Wire up to reposition elements in the main window when the browser is resized.
							// The main window has the following items:
							//    (1) Vertical toolstrip on the left in a .col-xs-1. This is fixed in place (vertically) when scrolling.
							//    (2) Designer and code .gzsections in the middle in a .col-xs-10.
							//    (3) A .col-xs-1 on the right with two elements that also remain fixed vertically when scrolling:
							//        (a) The narrow horizontal scrolling comicstrip
							//        (b) The vertical comicpanelsstrip taking up most of the remaining height of the visible column.

							$(window).resize(function () {

								try {

									var iViewportHeight = $(window).height();
									var iTypeWellHeight = $("#TypeWell").height();
									var iColXs1Width = $(".toGetLeftCol").width();
									var iNavbarHeight = $(".navbar").height();

									var iBordersAndSpacingPadding = 70;

									if (bDisplayComics) {

										// The comicstrip WILL be displayed.
										// Designer and code sections should take care of themselves.
										$(".toGetRightCol").removeClass("hidden");
										$(".toGetMiddleCol").removeClass("col-xs-11");
										$(".toGetMiddleCol").addClass("col-xs-10");

										// Position the fixed comicstrip.
										var iComicstripTop = iNavbarHeight + 10;
										$("#comicstrip").css("top", iComicstripTop.toString() + "px");
										$("#comicstrip").height((iViewportHeight - iComicstripTop - 60 ).toString() + "px");
										var iComicstripWidth = $("#comicstrip").width();
										var strComicstripLeft = ((iColXs1Width - iComicstripWidth) / 2 - 40).toString() + "px";
										$("#comicstrip").css("margin-left", strComicstripLeft);

									} else {

										// comicstrip and comicpanelstrip WILL NOT be displayed.
										// Designer and code sections should take care of themselves.
										$(".toGetRightCol").addClass("hidden");
										$(".toGetMiddleCol").removeClass("col-xs-10");
										$(".toGetMiddleCol").addClass("col-xs-11");
									}

									// Center the vertical toolstrip vertically in the viewport. It will remain fixed.
									var iToolstripTop = iNavbarHeight + 10;
									$("#toolstrip").css("top", iToolstripTop.toString() + "px");
									$("#toolstrip").height((iViewportHeight - iToolstripTop - 60).toString() + "px");
									var iToolstripWidth = $("#toolstrip").width();
									var strToolstripLeft = ((iColXs1Width - iToolstripWidth) / 2).toString() + "px";
									$("#toolstrip").css("margin-left", strToolstripLeft);
									
									$("#BlocklyIFrame").height(iViewportHeight - 
										iTypeWellHeight -
										iBordersAndSpacingPadding -
										iNavbarHeight);

								} catch (e) {

									errorHelper.show(e);
								}
							});

							// Allocate and create the scanner.
							//m_scanner = new Scanner();
							return null;//m_scanner.create();
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

                            // If the current type is app, and the current method is initialize, then
                            // need to play changes into the designer incase anything changes here.

                            var bAppInitializeActive = types.isAppInitializeActive();
                            if (!bAppInitializeActive) {

                            	return;
                            }

		                    // .
		                    var objectWorkspace = processor.getWorkspaceJSONObject();
		                    if (!objectWorkspace) {

		                        throw { messgage: "Failed to get the workspace object." };
		                    }

		                    // Get the block with which to work.
		                    var objectPrimaryBlockChain = processor.getPrimaryBlockChain(objectWorkspace);

		            		// Clear designer.
		            		var objectResult = {};

		            		// Scan.
			                var objectCursor = objectPrimaryBlockChain;
			                if (objectCursor) {

			    	            do {

				            		//	Look for "new_" and "set_".
				            		//	Set in designer.
				            		var arrayMatches = objectCursor.type.match(/App_set(.+)/);
				            		if (arrayMatches &&
				            			arrayMatches.length > 1) {

				            			objectResult[arrayMatches[1]] = {};
				            		} else {

					            		if (objectCursor.type.match(/_setX/)) {

					            			// Get the thing to set.
					            			var objectToSet = objectCursor.children[0].children[0];
					            			var strTypeToSet = objectToSet.type;
					            			var arrayTypes = strTypeToSet.match(/App_get(.+)/);
					            			var strTheType = arrayTypes[1];

					            			var objectValue = objectCursor.children[1].children[0].children[0];
					            			var strValue = objectValue.contents;

					            			objectResult[strTheType]["X"] = strValue;
		                                } else if (objectCursor.type.match(/_setY/)) {

		                                    // Get the thing to set.
		                                    var objectToSet = objectCursor.children[0].children[0];
		                                    var strTypeToSet = objectToSet.type;
		                                    var arrayTypes = strTypeToSet.match(/App_get(.+)/);
		                                    var strTheType = arrayTypes[1];

		                                    var objectValue = objectCursor.children[1].children[0].children[0];
		                                    var strValue = objectValue.contents;

		                                    objectResult[strTheType]["Y"] = strValue;
		                                } else if (objectCursor.type.match(/_setWidth/)) {

		                                    // Get the thing to set.
		                                    var objectToSet = objectCursor.children[0].children[0];
		                                    var strTypeToSet = objectToSet.type;
		                                    var arrayTypes = strTypeToSet.match(/App_get(.+)/);
		                                    var strTheType = arrayTypes[1];

		                                    var objectValue = objectCursor.children[1].children[0].children[0];
		                                    var strValue = objectValue.contents;

		                                    objectResult[strTheType]["Width"] = strValue;
		                                } else if (objectCursor.type.match(/_setHeight/)) {

		                                    // Get the thing to set.
		                                    var objectToSet = objectCursor.children[0].children[0];
		                                    var strTypeToSet = objectToSet.type;
		                                    var arrayTypes = strTypeToSet.match(/App_get(.+)/);
		                                    var strTheType = arrayTypes[1];

		                                    var objectValue = objectCursor.children[1].children[0].children[0];
		                                    var strValue = objectValue.contents;

		                                    objectResult[strTheType]["Height"] = strValue;
		                                }
				            		}

			        	            objectCursor = objectCursor.next
			            	    } while (objectCursor)
			            	}

			            	// Load up the parsed data into the designer.
		            		var exceptionRet = designer.updateInstances(objectResult);
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

					// Helper method generates the function string for a app property get function.
					var m_functionGenerateBlocksAppPropertyGetFunctionString = function (strName) {

						return "this.appendDummyInput().appendField('"+strName+"');" +
							"this.setColour(20);" +
							"this.setOutput(true);" +
							"this.setInputsInline(true);" +
							"this.setTooltip('"+strName+"');";
					};

					// Helper method generates the javascript string for a property get function.
					var m_functionGenerateJavaScriptAppPropertyGetFunctionString = function (strName) {

						return 'return [" self.app[\'' + strName + '\'] ", Blockly.JavaScript.ORDER_MEMBER];';
					};

					// Helper method generates the function string for a property set function.
					var m_functionGenerateBlocksAppPropertySetFunctionString = function (strName) {

						return "this.appendDummyInput().appendField('"+strName+"');" +
							"this.appendValueInput('VALUE').appendField('to');" +
							"this.setColour(30);" +
							"this.setPreviousStatement(true);" +
							"this.setNextStatement(true);" +
							"this.setInputsInline(true);" +
							"this.setTooltip('"+strName+"');";
					};

					// Helper method generates the javascript string for a property set function.
					var m_functionGenerateJavaScriptAppPropertySetFunctionString = function (strName) {

						return 'var strValue = Blockly.JavaScript.valueToCode(block, "VALUE",Blockly.JavaScript.ORDER_ADDITION) || "";' +
					        'return " self.app[\'' + strName + '\'] = " + strValue + "; "';
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
					var m_functionRemove_Type_New = function (clType) {

						try {

							////////////////////////
							// Blocks.

							delete self.blocks["new_" + clType.data.name];

							////////////////////////
							// JavaScript.
							delete self.javaScript["new_" + clType.data.name];

							////////////////////////
							// Schema.
							if (self.schema &&
								self.schema.Types) {

								delete self.schema.Types[clType.data.name];
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method renames a type's new_ constructor function.
					var m_functionRename_Type_New = function (clType, strOriginalName) {

						try {

							////////////////////////
							// Blocks.

							delete self.blocks["new_" + strOriginalName];
							self.blocks["new_" + clType.data.name] = m_functionGenerateBlocksTypeNewFunctionString(clType.data.name);

							////////////////////////
							// JavaScript.
							delete self.javaScript["new_" + strOriginalName];
							self.javaScript["new_" + clType.data.name] = m_functionGenerateJavaScriptTypeNewFunctionString(clType.data.name);

							////////////////////////
							// Workspace.
							if (self.workspace) {

								var re = new RegExp("new_" + strOriginalName,"g");
								self.workspace = self.workspace.replace(re,
									"new_" + clType.data.name);
								var exceptionRet = types.replaceInWorkspaces("new_" + strOriginalName,
									"new_" + clType.data.name);
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
							var typeNew = objectTypes[clType.data.name];

							// Remove the old name.
							delete objectTypes[strOriginalName];

							if (!typeNew) {

								typeNew = {};
							}
							typeNew["new_" + clType.data.name] = true
							objectTypes[clType.data.name] = typeNew;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method determines if the type's new is referenced 
					// anywhere.  Returns the referencing method if found.
//used					
					var m_functionIsReferenced_Type_New = function (clType) {

						try {

							// Look for this:
							var strLookFor = "new_" + clType.data.name;

							return types.isReferencedInWorkspace(strLookFor);
						} catch (e) {

							return e;
						}
					};

					// Helper method adds a type's property accessor functions.
//used					
					var m_functionAdd_Type_Property = function (clType, property) {

						try {

							////////////////////////
							////////////////////////
							////////////////////////
							// Get

							////////////////////////
							// Blocks.
							var strGetName = clType.data.name + "_get" + property.name;

							if (property.isApp) {

								self.blocks[strGetName] = m_functionGenerateBlocksAppPropertyGetFunctionString(strGetName);
							} else {

								self.blocks[strGetName] = m_functionGenerateBlocksPropertyGetFunctionString(strGetName);
							}

							////////////////////////
							// JavaScript.
							if (property.isApp) {

								self.javaScript[strGetName] = m_functionGenerateJavaScriptPropertyGetFunctionString(property.name);
							} else {

								self.javaScript[strGetName] = m_functionGenerateJavaScriptPropertyGetFunctionString(property.name);
							}

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[clType.data.name];
							objectType[strGetName] = true;


							////////////////////////
							////////////////////////
							////////////////////////
							// Set

							////////////////////////
							// Blocks.
							var strSetName = clType.data.name + "_set" + property.name;

							if (property.isApp) {

								self.blocks[strSetName] = m_functionGenerateBlocksAppPropertySetFunctionString(strSetName);
							} else {

								self.blocks[strSetName] = m_functionGenerateBlocksPropertySetFunctionString(strSetName);
							}

							////////////////////////
							// JavaScript.
							if (property.isApp) {

								self.javaScript[strSetName] = m_functionGenerateJavaScriptAppPropertySetFunctionString(property.name);
							} else {

								self.javaScript[strSetName] = m_functionGenerateJavaScriptPropertySetFunctionString(property.name);
							}

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[clType.data.name];
							objectType[strSetName] = true;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method adds a type's event accessor functions.
//used - Ken has to decide what gets done here			
					var m_functionAdd_Type_Event = function (clType, event) {

						try {

							// ////////////////////////
							// ////////////////////////
							// ////////////////////////
							// // Get

							// ////////////////////////
							// // Blocks.
							// var strGetName = clType.data.name + "_get" + event.name;
							// self.blocks[strGetName] = m_functionGenerateBlocksEventGetFunctionString(strGetName);

							// ////////////////////////
							// // JavaScript.
							// self.javaScript[strGetName] = m_functionGenerateJavaScriptEventGetFunctionString(event.name);

							// ////////////////////////
							// // Schema.
							// if (!self.schema.Types) {

							// 	self.schema.Types = {};
							// }
							// var objectTypes = self.schema.Types;
							// var objectType = objectTypes[clType.data.name];
							// objectType[strGetName] = true;


							// ////////////////////////
							// ////////////////////////
							// ////////////////////////
							// // Set

							// ////////////////////////
							// // Blocks.
							// var strSetName = clType.data.name + "_set" + property.name;
							// self.blocks[strSetName] = m_functionGenerateBlocksPropertySetFunctionString(strSetName);

							// ////////////////////////
							// // JavaScript.
							// self.javaScript[strSetName] = m_functionGenerateJavaScriptPropertySetFunctionString(property.name);

							// ////////////////////////
							// // Schema.
							// if (!self.schema.Types) {

							// 	self.schema.Types = {};
							// }
							// var objectTypes = self.schema.Types;
							// var objectType = objectTypes[clType.data.name];
							// objectType[strSetName] = true;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method removes a type's new_ constructor function.
//used					
					var m_functionRemove_Type_Property = function (clType, property) {

						try {

							var strGet = clType.data.name + "_get" + property.name;
							var strSet = clType.data.name + "_set" + property.name;

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
								self.schema.Types[clType.data.name]) {

								var objectType = self.schema.Types[clType.data.name];
								delete objectType[strGet];
								delete objectType[strSet];
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method renames a type's property accessor functions.
					var m_functionRename_Type_Property = function (clType, property, strOriginal, strOriginalTypeName) {

						try {

							if (!strOriginalTypeName) {

								strOriginalTypeName = clType.data.name;
							}
							////////////////////////
							////////////////////////
							////////////////////////
							// Get

							////////////////////////
							// Blocks.
							var strOriginalName = strOriginalTypeName + "_get" + strOriginal;
							var strGetName = clType.data.name + "_get" + property.name;
							delete self.blocks[strOriginalName];

							if (property.isApp) {

								self.blocks[strGetName] = m_functionGenerateBlocksAppPropertyGetFunctionString(strGetName);
							} else {

								self.blocks[strGetName] = m_functionGenerateBlocksPropertyGetFunctionString(strGetName);
							}

							////////////////////////
							// JavaScript.
							delete self.javaScript[strOriginalName];

							if (property.isApp) {

								self.javaScript[strGetName] = m_functionGenerateJavaScriptAppPropertyGetFunctionString(property.name);
							} else {

								self.javaScript[strGetName] = m_functionGenerateJavaScriptPropertyGetFunctionString(property.name);
							}

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
							var objectType = objectTypes[clType.data.name];
							objectType[strGetName] = true;
							delete objectType[strOriginalName];

							////////////////////////
							////////////////////////
							////////////////////////
							// Set

							////////////////////////
							// Blocks.
							var strOriginalSetName = strOriginalTypeName + "_set" + strOriginal;
							var strSetName = clType.data.name + "_set" + property.name;
							delete self.blocks[strOriginalSetName];

							if (property.isApp) {

								self.blocks[strSetName] = m_functionGenerateBlocksAppPropertySetFunctionString(strSetName);
							} else {

								self.blocks[strSetName] = m_functionGenerateBlocksPropertySetFunctionString(strSetName);
							}

							////////////////////////
							// JavaScript.
							delete self.javaScript[strOriginalSetName];

							if (property.isApp) {

								self.javaScript[strSetName] = m_functionGenerateJavaScriptAppPropertySetFunctionString(property.name);
							} else {

								self.javaScript[strSetName] = m_functionGenerateJavaScriptPropertySetFunctionString(property.name);
							}

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
							var objectType = objectTypes[clType.data.name];
							objectType[strSetName] = true;
							delete objectType[strOriginalSetName];

							return null;
						} catch (e) {

							return e;
						}
					};

//used
					// Helper method determines if the type's new is referenced 
					// anywhere.  Returns the referencing method if found.
					var m_functionIsReferenced_Type_Property = function (clType, property) {

						try {

							// Look for this:
							var strGetName = clType.data.name + "_get" + property.name;
							var strSetName = clType.data.name + "_set" + property.name;

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
//used					
					var m_functionAdd_Type_Method = function (clType, method) {

						try {

							////////////////////////
							// Blocks.
							var strName = clType.data.name + "_" + method.name;
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
							var objectType = objectTypes[clType.data.name];
							objectType[strName] = true;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method removes a type's new_ constructor function.
					var m_functionRemove_Type_Method = function (clType, method) {

						try {

							var strName = clType.data.name + "_" + method.name;

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
								self.schema.Types[clType.data.name]) {

								var objectType = self.schema.Types[clType.data.name];
								delete objectType[strName];
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method renames a type's method accessor functions.
					var m_functionRename_Type_Method = function (clType, method, strOriginal, strOriginalTypeName) {

						try {

							if (!strOriginalTypeName) {

								strOriginalTypeName = clType.data.name;
							}

							////////////////////////
							// Blocks.
							var strOriginalName = strOriginalTypeName + "_" + strOriginal;
							var strName = clType.data.name + "_" + method.name;
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
							var objectType = objectTypes[clType.data.name];
							objectType[strName] = true;
							delete objectType[strOriginalName];

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method determines if the type's new is referenced 
					// anywhere.  Returns the referencing method if found.
//used					
					var m_functionIsReferenced_Type_Method = function (clType, method) {

						try {

							// Look for this:
							var strName = clType.data.name + "_" + method.name;

							return types.isReferencedInWorkspace(strName);
						} catch (e) {

							return e;
						}
					};

					// Helper method removes a type's new_ constructor function.
//used					
					var m_functionRemove_Type_Event = function (clType, event) {

						try {

							// var strGet = clType.data.name + "_get" + property.name;
							// var strSet = clType.data.name + "_set" + property.name;

							// ////////////////////////
							// // Blocks.

							// delete self.blocks[strGet];
							// delete self.blocks[strSet];

							// ////////////////////////
							// // JavaScript.

							// delete self.javaScript[strGet];
							// delete self.javaScript[strSet];

							// ////////////////////////
							// // Schema.
							// if (self.schema &&
							// 	self.schema.Types &&
							// 	self.schema.Types[clType.data.name]) {

							// 	var objectType = self.schema.Types[clType.data.name];
							// 	delete objectType[strGet];
							// 	delete objectType[strSet];
							// }

							return null;
						} catch (e) {

							return e;
						}
					};

//used					
					var m_functionIsReferenced_Type_Event = function (clType, event) {

						try {

							// Look for this:
							var strName = clType.data.name + "_" + event.name;

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
					// The code scanner, updates the designer when the app initialize code is modified.
					var m_scanner = null;
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
