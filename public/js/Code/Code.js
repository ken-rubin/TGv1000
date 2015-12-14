/////////////////////////////////////////
// Code allows the user to build and manipulate 
// types for use in the designer and simulator.
//
// Return constructor function.

// Define AMD module.
define(["Core/errorHelper", "SourceScanner/processor", "SourceScanner/coder"], 
	function (errorHelper, processor, coder) {

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
					self.BlocklyIFrame_OnLoad = null;

					// Control the display or non-display of the left-most column of the code pane (the schema categories).
					self.displaySchemaCategories = true;

					// Indicates that this object does not care about blockly code changes.
					self.deaf = false;

					////////////////////////////////
					// Pulbic methods.

					// Clear all block and state from this and the blockly workspace.
					// bComplete = true means reset schema data.
					self.reset = function (bComplete) {

						try {

							// Reset state of code back to pristine.
							if (bComplete) {

								self.schema = {};
								self.blocks = {};
								self.javaScript = {};
							}

							self.workspace = null;
							self.BlocklyIFrame_OnLoad = null;
							self.displaySchemaCategories = false;

							// Rebuild.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;

						} catch (e) {

							return e;
						}
					};

					// Method adds a type to blockly.
//used					
					self.addType = function (clType) {

						try {

							// Add a new for the type. This generates and adds:
							//		self.blocks["new_" + type.data.name]
							//		self.javaScript["new_" + type.data.name]
							//		self.schema[type.data.name]
							var exceptionRet = m_functionAdd_Type_New(clType);
							if (exceptionRet) { throw exceptionRet; }

							// Add properties.
							for (var i = 0; i < clType.data.properties.length; i++) {

								var propertyIth = clType.data.properties[i];

								// Don't add blocks for the App Type's X,Y,Width,Height properties.
								if (!clType.data.isApp || (clType.data.isApp && $.inArray(propertyIth.name, ['X','Y', 'Width', 'Height']) === -1)) {

									exceptionRet = m_functionAdd_Type_Property(clType,
										propertyIth);
									if (exceptionRet) { throw exceptionRet; }
								}
							}

							// Add methods.
							for (var i = 0; i < clType.data.methods.length; i++) {

								var methodIth = clType.data.methods[i];

								// Don't add block for App Type's initialize method.
								if (!clType.data.isApp || (clType.data.isApp && methodIth.name !== "initialize")) {

									// Also don't add blocks for ANY Type's construct method.
									if (methodIth.name !== "construct") {

										exceptionRet = m_functionAdd_Type_Method(clType,
											methodIth);
										if (exceptionRet) { throw exceptionRet; }
									}
								}
							}

							// Add events.
							for (var i = 0; i < clType.data.events.length; i++) {

								var eventIth = clType.data.events[i];
								exceptionRet = m_functionAdd_Type_Event(clType,
									eventIth.name);
								if (exceptionRet) { throw exceptionRet; }
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
							if (exceptionRet) { throw exceptionRet; }

							// Remove properties.
							for (var i = 0; i < clType.data.properties.length; i++) {

								var propertyIth = clType.data.properties[i];
								var exceptionRet = m_functionRemove_Type_Property(clType,
									propertyIth.name);
								if (exceptionRet) { throw exceptionRet; }
							}

							// Remove methods.
							for (var i = 0; i < clType.data.methods.length; i++) {

								var methodIth = clType.data.methods[i];
								var exceptionRet = m_functionRemove_Type_Method(clType,
									methodIth);
								if (exceptionRet) { throw exceptionRet; }
							}

							// Remove events.
							for (var i = 0; i < clType.data.events.length; i++) {

								var eventIth = clType.data.events[i];
								var exceptionRet = m_functionRemove_Type_Event(clType,
									eventIth.name);
								if (exceptionRet) { throw exceptionRet; }
							}

							// Rebuild.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Removes XML and JavaScript blocks for orignal type. Adds new blocks for updated type.
					// Cheats. Deletes old type and adds updated type.
					self.replaceType = function(updatedClType, origClType) {

						try {

							var exceptionRet = self.removeType(origClType);
							if (exceptionRet) { return exceptionRet; }

							return self.addType(updatedClType);

						} catch(e) {

							return e;
						}
					}

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
							if (exceptionRet) { throw exceptionRet; }

							// Rebuild.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;
						} catch (e) {

							return e;
						}
					};

//used
					// Remove property from schema, blocks and javaScript.  
					// It is already not in any workspace per validation.
					self.removeProperty = function (clType, propertyName) {

						try {

							var exceptionRet = m_functionRemove_Type_Property(clType,
								propertyName);
							if (exceptionRet) { throw exceptionRet; }

							// Rebuild.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;
						} catch (e) {

							return e;
						}
					};

//used
					// Cheats. Removes and adds.
					self.replaceProperty = function (clType, property, strOriginalName) {

						try {

							var exceptionRet = self.removeProperty(clType, strOriginalName);
							if (exceptionRet) { return exceptionRet; }

							return self.addProperty(clType, property);

						} catch(e) {

							return e;
						}
					}					

					// Method renames a property of a type to blockly.
					self.renameProperty = function (clType, property, strOriginalName) {

						try {

							// Rename a property for the type.
							var exceptionRet = m_functionRename_Type_Property(clType,
								property,
								strOriginalName);
							if (exceptionRet) { throw exceptionRet; }

							// Rebuild blockly.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Method adds an event to a type to blockly.
//used					
					self.addEvent = function (clType, event) {

						try {

							// Add a new for the type.
							var exceptionRet = m_functionAdd_Type_Event(clType,
								event.name);
							if (exceptionRet) { throw exceptionRet; }

							// Rebuild.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;
						} catch (e) {

							return e;
						}
					};

					self.renameEvent = function (clType, event, strOriginalName) {

						try {

							var exceptionRet = m_functionRemove_Type_Event(clType,
								strOriginalName);
							if (exceptionRet) { throw exceptionRet; }

							exceptionRet = self.addEvent(clType, event);
							if (exceptionRet) { throw exceptionRet; }

							// Rebuild.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;

						} catch(e) {

							return e;
						}
					}

					// Remove event from schema, blocks and javaScript.  
					// It is already not in any workspace per validation.
					self.removeEvent = function (clType, event) {

						try {

							var exceptionRet = m_functionRemove_Type_Event(clType,
								event.name);
							if (exceptionRet) { throw exceptionRet; }

							// Rebuild.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;

						} catch(e) {

							return e;
						}
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
							if (exceptionRet) { throw exceptionRet; }

							// Rebuild.
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
							if (exceptionRet) { throw exceptionRet; }

							// Rebuild.
							$("#BlocklyIFrame")[0].contentWindow.location.reload();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Removes XML and JavaScript blocks for orignal method. Adds new blocks for updated method.
					// Cheats. Does a remove and then an add.
					self.replaceMethod = function(updatedMethod, origMethod, clType) {

						try {

							var exceptionRet = self.removeMethod(clType, origMethod);
							if (exceptionRet) { return exceptionRet; }

							return self.addMethod(clType, updatedMethod);

						} catch(e) {

							return e;
						}
					}

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

							$(window).resize(m_functionHandleResize);
							m_functionHandleResize();

							// Allocate and create the scanner.
							//m_scanner = new Scanner();
							return null;//m_scanner.create();

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
									self.displaySchemaCategories = true;
									$("#BlocklyIFrame")[0].contentWindow.setWorkspaceString(self.workspace);
								} catch (e) {

									errorHelper.show(e);
								}
							};

							// First time, point the frame at the blockly page.
							// if (!m_bLoaded) {

								// Set the callback.
								self.BlocklyIFrame_OnLoad = functionLoad;

								// Load up blockly.
								$("#BlocklyIFrame")[0].src = "./frameworks/blockly/blocklyframe.html";
							// 	m_bLoaded = true;

							// } else {

							// 	functionLoad();
							// }

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

							// If don't want to listen, then just leave early.
							if (self.deaf) {

								return null;
							}

                            // Get the new workspace and code.
                            self.workspace = $("#BlocklyIFrame")[0].contentWindow.getWorkspaceString();

                            // Set the new data in the TypeWell. types calls type.js#update for the active type.
                            // In type.js m_functionUpdateActiveMethodWorkspace does all the parsing and updating.
                            var exceptionRet = types.update(self.workspace);
							if (exceptionRet) { throw exceptionRet; }

							return null;
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Following is used to fetch current value of a property of a toolinstance.
					// If not found, return ''.
					// On error, throw and handle higher up.
					self.getPropertyCurrentValue = function(strProperty, strInstance, strType) {

						try {

		                    var objectWorkspace = processor.getAppInitializeJSONObject();	// Get the App Type's initialize workspace (in JS).
		                    if (!objectWorkspace) {

		                        throw { message: "Failed to get the workspace object." };
		                    }

		                    // Get the block with which to work.
		                    var objectPrimaryBlockChain = processor.getPrimaryBlockChain(objectWorkspace);

			                var objectCursor = objectPrimaryBlockChain;

			                var strLookForFirst = strType + "_set" + strProperty;
			                var strLookForThen = g_clTypeApp.data.name + "_get" + strInstance;

			                if (objectCursor) {

			    	            do {

		    	            		if (objectCursor.type === strLookForFirst) {

			    	            		if (objectCursor.children[0].children[0].type === strLookForThen) {

			    	            			return objectCursor.children[1].children[0].children[0].contents;
			    	            		}
			    	            	}

			        	            objectCursor = objectCursor.next

			            	    } while (objectCursor)
			            	}

							// If no setter in app initialize, must return empty string.
							return '';

						} catch(e) {

							throw e;
						}
					}

					///////////////////////////////////////
					// Private methods.

					// Resize code components on window resize.
					var m_functionHandleResize = function () {

						try {

							// Size the code-section and the whole middle column.
							// The designer handler will handle only its own update.

							var jLeft = $(".toGetLeftCol");
							$(".toGetMiddleCol").height(jLeft.height() * 2);
							$("#code").height(jLeft.height());

							$("#BlocklyIFrame").height(jLeft.height() - 
								$("#TypeWell").height() - 40); // 40 = borders and padding and such.
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Helper method generates the function string for a "new" type function.
					// TODO: handle base Types.
					var m_functionGenerateBlocksTypeNewFunctionString = function (strName) {

						return "this.appendDummyInput().appendField('new_"+strName+"');" +
							"this.setColour(10);" +
							"this.setOutput(true);" +
							"this.setInputsInline(true);" +
							"this.setTooltip('Allocate new type instance.');";
					};

					// Helper method generates the javascript string for a property get function.
					// TODO: handle base Types.
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

					// Helper method generates the function string for a event raise function.
					var m_functionGenerateBlocksEventRaiseFunctionString = function (strName) {

						return "this.appendDummyInput().appendField('"+strName+"');" +
							"this.appendValueInput('SELF').appendField('from');" +
							"this.appendValueInput('EVENTARGS').appendField('args');" +
							"this.setColour(25);" +
							"this.setPreviousStatement(true);" +
							"this.setNextStatement(true);" +
							"this.setInputsInline(true);" +
							"this.setTooltip('"+strName+"');";
					};

					// Helper method generates the javascript string for a event raise function.
					var m_functionGenerateJavaScriptEventRaiseFunctionString = function (strName) {

						return 'var strId = Blockly.JavaScript.valueToCode(block,"SELF",Blockly.JavaScript.ORDER_ADDITION) || "";' +
							'var strEA = Blockly.JavaScript.valueToCode(block,"EVENTARGS",Blockly.JavaScript.ORDER_ADDITION) || "";' +
					        'return " window.raiseEvent(\''+strName+'\', "+strId+", "+strEA+"); "';
					};

					// Helper method generates the function string for a event subscribe function.
					var m_functionGenerateBlocksEventSubscribeFunctionString = function (strName) {

						return "this.appendDummyInput().appendField('"+strName+"');" +
							"this.appendValueInput('TARGET').appendField('target');" +
							"this.appendValueInput('METHOD').appendField('method');" +
							"this.setColour(35);" +
							"this.setPreviousStatement(true);" +
							"this.setNextStatement(true);" +
							"this.setInputsInline(true);" +
							"this.setTooltip('"+strName+"');";
					};

					// Helper method generates the javascript string for a event subscribe function.
					// window.eventCollection['bounce'].push({ target: self.ship, method: 'HandleBounce' });
					var m_functionGenerateJavaScriptEventSubscribeFunctionString = function (strName) {

						return 'var strTarget = Blockly.JavaScript.valueToCode(block,"SELF",Blockly.JavaScript.ORDER_ADDITION) || "";' +
					        'var strMethod = Blockly.JavaScript.valueToCode(block, "VALUE",Blockly.JavaScript.ORDER_ADDITION) || "";' +
					        'return "window.eventCollection[\''+strName+'\'].push({ target: "+strTarget+", method: \'"+strMethod+"\' });"';
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
					// strName is the name of the method prepended with its type name + "_".
					// method is passed in to have access to properties methodTypeId (effectively, statement or expression)
					// and parameters.
					var m_functionGenerateBlocksMethodFunctionString = function (strName, method) {

						var arrayParameters = method.parameters.split(/[\s,]+/);

						var strResult = "this.appendDummyInput().appendField('"+strName+"');" +
							"this.appendValueInput('SELF').appendField('using');";

						for (var i = 0; i < arrayParameters.length; i++) {

							var strIthParameter = arrayParameters[i];
							strResult += "this.appendValueInput('"+strIthParameter+"').appendField('"+strIthParameter+"');";
						}

						strResult += ("this.setColour(40);" +
							(method.methodTypeId === 1 ? 
								"this.setPreviousStatement(true);this.setNextStatement(true);" :
								"this.setOutput(true);") +
							"this.setInputsInline(true);" +
							"this.setTooltip('"+strName+"');");

						return strResult;
					};

					// Helper method generates the javascript string for a method function.
					var m_functionGenerateJavaScriptMethodFunctionString = function (method) {

						return 'var strId = Blockly.JavaScript.valueToCode(block,"SELF",Blockly.JavaScript.ORDER_ADDITION) || "";' +
            				'return [" " + strId + "[\'' + method.name + '\'](' + method.parameters + ') ", Blockly.JavaScript.ORDER_MEMBER];';
					};

					// Helper method adds a type's new_ constructor function.
					var m_functionAdd_Type_New = function (clType) {

						try {

							if (!clType.data.isApp) {

								// Skip doing all this for the App Type.

								////////////////////////
								// Blocks.

								self.blocks["new_" + clType.data.name] = m_functionGenerateBlocksTypeNewFunctionString(clType.data.name);

								////////////////////////
								// JavaScript.
								self.javaScript["new_" + clType.data.name] = m_functionGenerateJavaScriptTypeNewFunctionString(clType.data.name);

								////////////////////////
								// Schema

								if (!self.schema.Types) {

									self.schema.Types = {};
								}
								var objectTypes = self.schema.Types;
								var typeNew = { };
								typeNew["new_" + clType.data.name] = true;
								objectTypes[clType.data.name] = typeNew;
							}

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

							if (clType.data.isApp) {

								self.blocks[strGetName] = m_functionGenerateBlocksAppPropertyGetFunctionString(strGetName);
							} else {

								self.blocks[strGetName] = m_functionGenerateBlocksPropertyGetFunctionString(strGetName);
							}

							////////////////////////
							// JavaScript.
							if (clType.data.isApp) {

								self.javaScript[strGetName] = m_functionGenerateJavaScriptAppPropertyGetFunctionString(property.name);
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

							// The following test is necessary, because new_App is no longer added to self.schema.Types.
							if (!objectType) {

								objectTypes[clType.data.name] = {};
								objectTypes[clType.data.name][strGetName] = true;

							} else {

								objectType[strGetName] = true;
							}

							////////////////////////
							////////////////////////
							////////////////////////
							// Set

							////////////////////////
							// Blocks.
							var strSetName = clType.data.name + "_set" + property.name;

							if (clType.data.isApp) {

								self.blocks[strSetName] = m_functionGenerateBlocksAppPropertySetFunctionString(strSetName);
							} else {

								self.blocks[strSetName] = m_functionGenerateBlocksPropertySetFunctionString(strSetName);
							}

							////////////////////////
							// JavaScript.
							if (clType.data.isApp) {

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

							// The following test is necessary, because new_App is no longer added to self.schema.Types.
							if (!objectType) {

								objectTypes[clType.data.name] = {};
								objectTypes[clType.data.name][strSetName] = true;

							} else {

								objectType[strSetName] = true;
							}

							return null;

						} catch (e) {

							return e;
						}
					};

					// Helper method adds a type's event accessor functions.
					var m_functionAdd_Type_Event = function (clType, eventName) {

						try {

							////////////////////////
							////////////////////////
							////////////////////////
							// Raise

							////////////////////////
							// Blocks.
							var strRaiseName = clType.data.name + "_raise" + eventName;
							self.blocks[strRaiseName] = m_functionGenerateBlocksEventRaiseFunctionString(strRaiseName);

							////////////////////////
							// JavaScript.
							self.javaScript[strRaiseName] = m_functionGenerateJavaScriptEventRaiseFunctionString(eventName);

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[clType.data.name];

							// The following test is necessary, because new_App is no longer added to self.schema.Types.
							if (!objectType) {

								objectTypes[clType.data.name] = {};
								objectTypes[clType.data.name][strRaiseName] = true;

							} else {

								objectType[strRaiseName] = true;
							}

							////////////////////////
							////////////////////////
							////////////////////////
							// Subscribe.

							////////////////////////
							// Blocks.
							var strSubscribeName = clType.data.name + "_subscribe" + eventName;
							self.blocks[strSubscribeName] = m_functionGenerateBlocksEventSubscribeFunctionString(strSubscribeName);

							////////////////////////
							// JavaScript.
							self.javaScript[strSubscribeName] = m_functionGenerateJavaScriptEventSubscribeFunctionString(eventName);

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[clType.data.name];

							if (!objectType) {

								objectTypes[clType.data.name] = {};
								objectTypes[clType.data.name][strSubscribeName] = true;

							} else {

								objectType[strSubscribeName] = true;
							}

							return null;

						} catch (e) {

							return e;
						}
					};

					// Helper method removes a type's new_ constructor function.
//used					
					var m_functionRemove_Type_Property = function (clType, propertyName) {

						try {

							var strGet = clType.data.name + "_get" + propertyName;
							var strSet = clType.data.name + "_set" + propertyName;

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

							if (clType.data.isApp) {

								self.blocks[strGetName] = m_functionGenerateBlocksAppPropertyGetFunctionString(strGetName);
							} else {

								self.blocks[strGetName] = m_functionGenerateBlocksPropertyGetFunctionString(strGetName);
							}

							////////////////////////
							// JavaScript.
							delete self.javaScript[strOriginalName];

							if (clType.data.isApp) {

								self.javaScript[strGetName] = m_functionGenerateJavaScriptAppPropertyGetFunctionString(property.name);
							} else {

								self.javaScript[strGetName] = m_functionGenerateJavaScriptPropertyGetFunctionString(property.name);
							}

							////////////////////////
							// Workspace.
							// if (self.workspace) {

							// 	var re = new RegExp('"' + strOriginalName + '"',"g");
							// 	self.workspace = self.workspace.replace(re,
							// 		'"' + strGetName + '"');
								var exceptionRet = types.replaceInWorkspaces(strOriginalName,
									strGetName);
								if (exceptionRet) { throw exceptionRet; }
							// }

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[clType.data.name];
							// The following test is necessary, because new_App is no longer added to self.schema.Types.
							if (!objectType) {

								objectTypes[clType.data.name] = {};
								objectTypes[clType.data.name][strGetName] = true;

							} else {

								objectType[strGetName] = true;
							}
							// delete objectTypes[strOriginalTypeName];

							////////////////////////
							////////////////////////
							////////////////////////
							// Set

							////////////////////////
							// Blocks.
							var strOriginalSetName = strOriginalTypeName + "_set" + strOriginal;
							var strSetName = clType.data.name + "_set" + property.name;
							delete self.blocks[strOriginalSetName];

							if (clType.data.isApp) {

								self.blocks[strSetName] = m_functionGenerateBlocksAppPropertySetFunctionString(strSetName);
							} else {

								self.blocks[strSetName] = m_functionGenerateBlocksPropertySetFunctionString(strSetName);
							}

							////////////////////////
							// JavaScript.
							delete self.javaScript[strOriginalSetName];

							if (clType.data.isApp) {

								self.javaScript[strSetName] = m_functionGenerateJavaScriptAppPropertySetFunctionString(property.name);
							} else {

								self.javaScript[strSetName] = m_functionGenerateJavaScriptPropertySetFunctionString(property.name);
							}

							////////////////////////
							// Workspace.
							// if (self.workspace) {

							// 	var re = new RegExp('"' + strOriginalSetName + '"',"g");
							// 	self.workspace = self.workspace.replace(re,
							// 		'"' + strSetName + '"');
								var exceptionRet = types.replaceInWorkspaces(strOriginalSetName,
									strSetName);
								if (exceptionRet) { throw exceptionRet; }
							// }

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[clType.data.name];
							// The following test is necessary, because new_App is no longer added to self.schema.Types.
							if (!objectType) {

								objectTypes[clType.data.name] = {};
								objectTypes[clType.data.name][strSetName] = true;

							} else {

								objectType[strSetName] = true;
							}
							// delete objectTypes[strOriginalTypeName];

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
							self.blocks[strName] = m_functionGenerateBlocksMethodFunctionString(strName, method);

							////////////////////////
							// JavaScript.
							self.javaScript[strName] = m_functionGenerateJavaScriptMethodFunctionString(method);

							////////////////////////
							// Schema.
							if (!self.schema.Types) {

								self.schema.Types = {};
							}
							var objectTypes = self.schema.Types;
							var objectType = objectTypes[clType.data.name];

							// The following test is necessary, because new_App is no longer added to self.schema.Types.
							if (!objectType) {

								objectTypes[clType.data.name] = {};
								objectTypes[clType.data.name][strName] = true;

							} else {

								objectType[strName] = true;
							}

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
								if (objectType && objectType[strName]) {

									delete objectType[strName];
								}
							}

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

					// Helper method removes event.
//used					
					var m_functionRemove_Type_Event = function (clType, eventName) {

						try {

							////////////////////////
							////////////////////////
							////////////////////////
							// Raise

							var strRaiseName = clType.data.name + "_raise" + eventName;
							var strSubscribeName = clType.data.name + "_subscribe" + eventName;

							////////////////////////
							// Blocks.
							delete self.blocks[strRaiseName];
							delete self.blocks[strSubscribeName];

							////////////////////////
							// JavaScript.
							delete self.javaScript[strRaiseName];
							delete self.javaScript[strSubscribeName];

							////////////////////////
							// Schema.
							if (self.schema &&
								self.schema.Types &&
								self.schema.Types[clType.data.name]) {

								var objectType = self.schema.Types[clType.data.name];
								delete objectType[strRaiseName];
								delete objectType[strSubscribeName];
							}

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
					// var m_bLoaded = false;
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
