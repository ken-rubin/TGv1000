///////////////////////////////
// Type.  A sort of thing.
//
// Return constructor function.
//

// Define Type module.
define(["Core/errorHelper", "Navbar/Comic", "Navbar/Comics", "SourceScanner/converter", "SourceScanner/processor", "SourceScanner/coder"],
	function (errorHelper, comic, comics, converter, processor, coder) {

		try {

			// Define the type constructor function.
			var functionConstructor = function Type() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					// The data this instance wrapps.
					// Schema:
					// add -- indicates this is the addtype type.
					// app -- indicates this is the app type.
					// properties -- collection of properties of type.
					// methods -- collection of methods of type.
					// events -- collection of events of type.
					// dependencies -- collection of dependencies of type.
					// id -- the DB id of type.
					// name -- the name of type.
					// imageId -- the image id.
					self.data = null;

					/////////////////////////////
					// Public methods.

					// Create this instance.
// used					
					self.load = function (typesItem) {

						try {

							// Save data.
							self.data = typesItem;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Activate/select type instance.
// not used					
					self.activate = function () {

						try {

							// Cause types to fill the type well with this type.
							return types.select(self);
							
						} catch (e) {

							return e;
						}
					};

					// Activate/select type instance.
// used					
					self.setActive = function (iIndex, arrayActive) {

						try {

							m_arrayActive = arrayActive;
							m_iActiveIndex = iIndex;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Destroy this instance.
//not used					
					self.destroy = function () {

						try {

							// Remove type from DOM.
							m_jType.remove();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method returns the specified method.
// used					
					self.getMethod = function (strMethod) {

						// Loop over and add the methods.
						for (var i = 0; i < self.data.methods.length; i++) {

							// Get the method and test it for name.
							var methodIth = self.data.methods[i];
							if (methodIth.name === strMethod) {

								// Return the specified method.
								return methodIth;
							}
						}

						return null;
					};

					// Loop over all methods, indicate if the specified
					// string is found in any of their workspaces.
					// Returns the method referenced or null.
// used					
					self.isReferencedInWorkspace = function (strTest) {

						// Loop over the collection of methods.
						for (var i = 0; i < self.data.methods.length; i++) {

							var methodIth = self.data.methods[i];

							// Get the workspace.
							var strWorkspace = methodIth.workspace;

							// Check.
							if (strWorkspace.indexOf(strTest) !== -1) {

								// Save this type in the method to make it 
								// easier to report on who the method is.
								methodIth.type = self;
								return methodIth;
							}
						}

						return null;
					};

					// Loop over all methods, updates their workspace with the replacement.
					// Returns the method referenced or null.
// used					
					self.replaceInWorkspaces = function (strOld, strNew) {

						// Loop over the collection of methods.
						for (var i = 0; i < self.data.methods.length; i++) {

							var methodIth = self.data.methods[i];

							// Construct the global RegExp and apply to workspace.
							// In keeping with convention, concatenating surrounding quotation marks has not been done yet, but is put off till the replace.
							var re = new RegExp('"' + strOld + '+',"g");
							if (methodIth.workspace) {

								methodIth.workspace = methodIth.workspace.replace(re,
									'"' + strNew + '"');
							}
						}

						return null;
					};

					var blocklyChangeListenerTimeoutId = null;

					// Update the blockly data in the active member.
					self.update = function (strWorkspace) {

						try {

							// Drop out if no active member.
							if (m_iActiveIndex == -1 ||
								!m_arrayActive) {

								return null;
							}

							if (blocklyChangeListenerTimeoutId) {

								window.clearTimeout(blocklyChangeListenerTimeoutId);
							}
							
							blocklyChangeListenerTimeoutId = window.setTimeout(
								function(){ m_functionUpdateActiveMethodWorkspace(strWorkspace); }, 
								1500);

							return null;

						} catch (e) {

							return e;
						}
					};

					self.updateYourImage = function(imageId) {

						m_functionOnGotResourceId(imageId);
					}

					///////////////////////////////////////
					// Private methods

//used
					// TODO finish this
					var m_functionUpdateActiveMethodWorkspace = function(strWorkspace) {

						try {

							// Get the item.
							var activeMethod = m_arrayActive[m_iActiveIndex];
							var copyOfActiveMethod = activeMethod;

							// Set bool to be used below to display an error box if they try to change the name of either the initialize or construct methods.
							var methodIsAppInitializeOrConstruct = (types.isAppInitializeActive()) || (activeMethod.name === "construct");

							// This method's name, parameters, even method type could have changed.
							// As could the user's implementation of the method or its return value.
							// Or, if App initialize is active, size or position of TIs could have been changed.
							// We will examine the workspace and adjust what needs adjusting in activeMethod.
							
							/*	This is the structure have to work with (both variations):

										<xml xmlns="http://www.w3.org/1999/xhtml">
										  <block type="procedures_defreturn">		or procedures_defnoreturn
										    <mutation>
										    	<arg> elements with parameters
										    </mutation>
										    <field name="NAME">method name</field>
										    <statement name="STACK">
										    	<block> with guts </block>
										    </statement>
											
										procedures_defreturn adds the following return block here:
											<value name="RETURN">
												<block> with return items </block>
											</value>								

										  </block>
										</xml>
			                */

				            var workspaceJSON = converter.toJSON(strWorkspace);
				            if (!workspaceJSON.children) {

				            	// They must have dragged the function block to trash.
				            	return m_functionRestoreWorkspaceFromMethod(activeMethod, workspaceJSON);
				            }

				            // Look among the children for the **first one** with a c-block (type="procedures_def...") signature.
				            var bHandledACBlock = false;
				            for (var i = 0; i < workspaceJSON.children.length; i++) {

				            	var childIth = workspaceJSON.children[i];

			                    // Check if childIth matches what we need.
			                    if (childIth.hasOwnProperty("nodeName") && 
			                        childIth.hasOwnProperty("type") &&
			                        childIth.hasOwnProperty("children")) {

			                        if (childIth.nodeName === "block" &&
			                            childIth.type.substr(0, 11) === "procedures_" &&
			                            childIth.children.length > 1) {     // mutation, field, statement and (if procedures_defreturn) return.

			                            if (childIth.children[1].hasOwnProperty("contents")) {	// This means the function has a name; i.e., it hasn't been blanked out.

			                            	/////////////////////////////////////////
			                            	// We have a c-block. We'll work with it.
			                            	/////////////////////////////////////////

			                            	// First, the method name. This is the only one that can cause a grid refresh.
			                            	// And it kicks them out of this method if they've changed initialize or construct.
			                            	var methodName = childIth.children[1].contents;

							                if (methodName !== activeMethod.name) {

							                	if (methodIsAppInitializeOrConstruct) {

							                		//errorHelper.show("The " + activeMethod.name + " method cannot be renamed.", 3000);

													var exceptionRet = code.load(activeMethod.workspace);
													if (exceptionRet) { throw exceptionRet; }

													return null;
							                	}

								                // Dup checking and automatic name adjustment.
			           							var exceptionRet = validator.isMethodNameAvailableInActiveType(methodName, m_iActiveIndex);

			           							if (exceptionRet) {

			           								// This isn't really an exception. It just means that the name isn't available.
			           								return new Error("The name '" + methodName + "' isn't available. Please change the name to be unique.");
			           							}

							                	activeMethod.name = methodName;
							                	types.changeTypeWellHeader();
							                	types.regenTWMethodsTable();

							                	// Call code to update schema since method name changed.
							                	JL().info("About to call code.replaceMethod with new method name=" + activeMethod.name + " and original method name=" + copyOfActiveMethod.name);
							                	code.replaceMethod(activeMethod, copyOfActiveMethod, types.getActiveClType(false));
							                }

			                            	// Now the methodTypeId. It's possible that the user dragged out a function block of the other type,
			                            	// set it all up and then dragged it above the original function block (or dragged the original to trash).
			                            	//
			                            	// methodTypeIds are:
			                            	// 1 - statement (no return value)
			                            	// 2 - expression (return value)
			                            	// 3 - initialize (no return value)
			                            	// 4 - construct (no return value)
			                            	var type = childIth.type;

			                            	// Cannot change method type of initialize or construct from defnoreturn.
			                            	if (methodIsAppInitializeOrConstruct && type === "procedures_defreturn") {

						                		//errorHelper.show(activeMethod.name + "'s method type cannot be changed.", 3000);

												var exceptionRet = code.load(activeMethod.workspace);
												if (exceptionRet) { throw exceptionRet; }

												return null;
			                            	}

			                            	if (!methodIsAppInitializeOrConstruct) {

				                            	var thisMethodTypeId = (type === "procedures_defreturn" ? 2 : 1);
				                            	activeMethod.methodTypeId = thisMethodTypeId;
			                            	}

			                            	// Now the parameters (args).
			                            	if (childIth.children[0].hasOwnProperty("nodeName") &&
			                            		childIth.children[0].hasOwnProperty("children")) {

			                            		if (childIth.children[0].nodeName === "mutation" &&
			                            			childIth.children[0].children.length) {

				                            		var currArgs = [];
				                            		for (var j = 0; j < childIth.children[0].children.length; j++) {

				                            			var nameJth = childIth.children[0].children[j].name;
				                            			if (nameJth !== "self") {

				                            				currArgs.push(nameJth);
				                            			}
				                            		}

				                            		if (activeMethod.name === "initialize" && currArgs.length > 0) {

								                		//errorHelper.show("The initialize method cannot have parameters (beyond 'self').", 5000);

														var exceptionRet = code.load(activeMethod.workspace);
														if (exceptionRet) { throw exceptionRet; }

														return null;
				                            		}

				                            		activeMethod.parameters = currArgs.join(', ');
			                            		}
			                            	}
							            } else {

							            	// The fact that we're here means the user has just blanked out the method name.
							            	// We'll tell the user how to handle this.
							            	if (methodIsAppInitializeOrConstruct) {

						                		//errorHelper.show("The " + activeMethod.name + " method cannot be renamed.", 3000);

							            	} else {

					                			//errorHelper.show("The procedure for completely changing a method name is to double-click on it and begin typing. Then either type Enter or click away.", 7500);
							            	}

											var exceptionRet = code.load(activeMethod.workspace);
											if (exceptionRet) { throw exceptionRet; }

							            	return null;
							            }

							            bHandledACBlock = true;
							            break;	// Out of loop looking for c-blocks. We have handled the first (highest) one.
							        }
							    }
				            }

				            if (!bHandledACBlock) {

				            	// They must have dragged the function block to trash.
				            	return m_functionRestoreWorkspaceFromMethod(activeMethod, workspaceJSON);
				            }

                            // If the current type is App, and the current method is "initialize", then
                            // need to play changes into the Designer pane in case a position or size change was made to a TI.
                            if (types.isAppInitializeActive()) { 

			                    // Prepare objectResult to hold parameters for all ToolInstances. Then pass to designer to effect changes, if any.
				                var objectResult = {};
				                var strValue = null;
				                var parts = [];

				                // Scan.
				                var objectCursor = processor.getPrimaryBlockChain(workspaceJSON);
				                if (objectCursor) {

				                    do {

				                        //  Look for "new_" and "set_".
				                        //  Set in designer.
				                        var re = new RegExp(g_clTypeApp.data.name + "_set(.+)");
				                        var arrayMatches = objectCursor.type.match(re);
				                        
				                        if (arrayMatches && arrayMatches.length > 1) {

				                            objectResult[arrayMatches[1]] = {};

				                        } else {

				                            var props = ["X", "Y", "Width", "Height"];
				                            for (var i = 0; i < props.length; i++) {

				                                var propIth = props[i];
				                                strValue = coder.functionDoProperty(objectCursor, propIth);

				                                if (strValue) {

				                                    parts = strValue.split('~');
				                                    objectResult[parts[0]][propIth] = parts[1];
				                                    break;
				                                }                                
				                            }
				                        }

				                        objectCursor = objectCursor.next;

				                    } while (objectCursor)
				                }

				            	// Load up the parsed data into the designer.
			            		var exceptionRet = designer.updateInstances(objectResult);
								if (exceptionRet) { throw exceptionRet; }
							}

							// Finally, replace the workspace of the active method.
							activeMethod.workspace = strWorkspace;

							return null;

						} catch (e) {

							return e;
						}
					}

					var m_functionRestoreWorkspaceFromMethod = function(activeMethod, workspaceJSON) {

						try {

							// There are either no procedures_def... block amongst workspaceJSON.children or we didn't find one while
							// looping that met sufficient criteria.
							// If there are any children (there don't have to be), they are chaff--extraneous work blocks.
							// We're going to re-load activeMethod.workspace into code, but we'd like to retain any chaff.
							// So we'll do this cleverly and carefully.

							var methodWorkspaceJSON = converter.toJSON(activeMethod.workspace);

							if (!workspaceJSON.children) {

								workspaceJSON.children = methodWorkspaceJSON.children;
							
							} else {

								workspaceJSON.children.unshift(methodWorkspaceJSON.children[0]);
							}

	                		//errorHelper.show("You are not allowed to trash (delete) the function block.", 5000);

							var exceptionRet = code.load(converter.toXML(workspaceJSON));
							if (exceptionRet) { throw exceptionRet; }

							return null;
						
						} catch (e) {

							return e;
						}
					}

//used
					var m_functionOnGotResourceId = function (iResourceId) {

						try {

							if (typeof iResourceId !== 'undefined' && iResourceId !== null && iResourceId > 0) {

								// Save off the new resource in state.
								self.data.imageId = iResourceId;

								// Call off to the designer to update the picture in the designer surface.
								var exceptionRet = designer.updateImage(self);
								if (exceptionRet) {

									throw exceptionRet;
								}

								// Call off to Types to change the image in the TypeWell and the toolstrip.
								exceptionRet = types.updateActiveTypeImage();
								if (exceptionRet) {

									throw exceptionRet;
								}

							} else {

								throw new Error("Bad ResourceId received from ImageSoundDialog chain.");
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					///////////////////////////////////////
					// Private fields.

					// The root GUI container object.
					var m_jType = null;
					// The active index for this type.
					var m_iActiveIndex = -1;
					// Active collection of members.
					var m_arrayActive = null;
					// Original name about to be renamed.
					var m_strOriginalName = "";
					
				} catch (e) {

					errorHelper.show(e);
				};
			};

			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
