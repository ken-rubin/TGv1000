///////////////////////////////
// Type.  A sort of thing.
//
// Return constructor function.
//

// Define Type module.
define(["Core/errorHelper", "Core/resourceHelper", "Core/contextMenu", "Navbar/Comic", "Navbar/Comics"],
	function (errorHelper, resourceHelper, contextMenu, comic, comics) {

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
					// resourceId -- the resource id.
					self.data = null;

					// Height of a line in the GUI in pixlels.
					self.lineHeight = 30;
					// Height of a button in the GUI in pixlels.
					self.buttonHeight = 26;

					/////////////////////////////
					// Public methods.

					// Activate/select type instance.
					self.activate = function () {

						try {

							// Cause types to fill the type well with this type.
							return types.select(self.data);
							
						} catch (e) {

							return e;
						}
					};

					// Create this instance.
					self.load = function (typesItem) {

						try {

							// Save data.
							self.data = typesItem;

							// process properties methods events and dependencies collections.

							return null;
						} catch (e) {

							return e;
						}
					};

					// Destroy this instance.
					self.destroy = function () {

						try {

							// Remove type from DOM.
							m_jType.remove();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Return the DOM element representing a prototypical item.
					self.generateDOM = function () {

						// Allocate the type.
						m_jType = $("<div id='" + 
							self.data.name + 
							"' class='typestripitem' style='background:black;'></div>");

						// Add the contents to the newly allocated type.
						var exceptionRet = m_functionGenerateTypeContents();
						if (exceptionRet) {

							throw exceptionRet;
						}

						return m_jType;
					};

					// Loop over all methods, indicate if the specified
					// string is found in any of their workspaces.
					// Returns the method referenced or null.
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
					self.replaceInWorkspaces = function (strOld, strNew) {

						// Loop over the collection of methods.
						for (var i = 0; i < self.data.methods.length; i++) {

							var methodIth = self.data.methods[i];

							// Construct the global RegExp and apply to workspace.
							var re = new RegExp(strOld,"g");
							if (methodIth.workspace) {

								methodIth.workspace = methodIth.workspace.replace(re,
									strNew);
							}
						}

						return null;
					};

					// Update the blockly data in the active member.
					self.update = function (strWorkspace, strMethod) {

						try {

							// Drop out if no active member.
							if (m_iActiveIndex == -1 ||
								!m_arrayActive) {

								return null;
							}

							// Get the item.
							var itemActive = m_arrayActive[m_iActiveIndex];

							// Splice the item at the array index.
							m_arrayActive.splice(m_iActiveIndex, 1, { 

								name: itemActive.name,
								workspace: strWorkspace,
								method: strMethod
							});
							return null;
						} catch (e) {

							return e;
						}
					};

					// These three are initiated by clicking links in TypeWell.
					self.imageSearch = function () {

						try {

							var exceptionRet = client.showImageSearchDialog(true, m_functionOnGotResourceId);
							if (exceptionRet) {

								throw exceptionRet;
							}
							return null;

						} catch (e) {

							return e;
						}
					}
					self.imageFromURL = function () {

						try {

							var exceptionRet = client.showImageURLDialog(true, m_functionOnGotResourceId);
							if (exceptionRet) {

								throw exceptionRet;
							}
							return null;

						} catch (e) {

							return e;
						}
					}
					self.imageFromDisk = function () {

						try {

							var exceptionRet = client.showImageDiskDialog(true, m_functionOnGotResourceId);
							if (exceptionRet) {

								throw exceptionRet;
							}
							return null;

						} catch (e) {

							return e;
						}
					}

					///////////////////////////////////////
					// Private methods

					// Helper method builds or rebuilds the type contents and replaces the types contents.
					var m_functionGenerateTypeContents = function () {

						// try {

						// 	// Start empty.
						// 	m_jType.empty();

						// 	// Add first TGAction button. It applies to the whole Type.
						// 	var jMainTGActionButton = $("<button style='background-color:Transparent;border:none;outline:none;cursor:pointer;position:absolute;left:48px;top:8px;'>" +
						// 		"<img id='typeTGAction' class='TGAction' src='" +
						// 			resourceHelper.toURL("images", null, null, "TGAction.png") +
						// 			"'></img>" + 
						// 		"</button>");
						// 	m_jType.append(jMainTGActionButton);
						// 	jMainTGActionButton.click(m_functionMainTGActionBtnClick);

						// 	// Generate the name to add to the type.
						// 	var jTypeName = $("<div style='position:absolute;left:8px;top:38px;right:72px'>" + 
						// 		self.data.name + 
						// 		"</div>");
						// 	m_jType.append(jTypeName);
						// 	jTypeName.contextMenu({

						// 		menuSelector: "#TypeMemberContextMenu",
						// 		menuSelected: m_functionTypeContextMenu
						// 	});

						// 	// Generate the image for the type.
						// 	var jTypeImage = $("<img src='" + 
						// 		resourceHelper.toURL('resources', self.data.imageResourceId, 'image', '') + 
						// 		"' style='position:absolute;width:64px;top:8px;height:64px;right:8px'></img>");
						// 	m_jType.append(jTypeImage);
						// 	jTypeImage.contextMenu({

						// 		menuSelector: "#TypeImageContextMenu",
						// 		menuSelected: m_functionTypeImageContextMenu
						// 	});

						// 	/////////////////////////
						// 	// Properties.
						// 	var jTypeProperties = $("<div style='color:rgb(250,250,200);position:absolute;left:8px;top:72px;right:8px;height:" + 
						// 		self.buttonHeight + 
						// 		"px;'>" + 
						// 		"properties" + 
						// 		"</div>");
						// 	m_jType.append(jTypeProperties);

						// 	// Add Properties.
						// 	var jTypeAddProperties = $("<button class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:102px;right:8px;height:" +
						// 		self.buttonHeight +
						// 		"px;width:26px;'>" + 
						// 		"<img class='typestripitem' id='AddType' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
						// 		resourceHelper.toURL('images', null, null, 'plus.png') +
						// 		"'></img>" + 
						// 		"</button>");
						// 	m_jType.append(jTypeAddProperties);
						// 	jTypeAddProperties.click(m_functionAddPropertyClick);

						// 	// Loop over and add the properties.
						// 	var iCursorY = 132;
						// 	for (var i = 0; i < self.data.properties.length; i++) {

						// 		var propertyIth = self.data.properties[i];

						// 		// Add the property.
						// 		var jTypeProperty = $("<button data-index='" + 
						// 			i + 
						// 			"' class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 			iCursorY +
						// 			"px;right:8px;height:" + 
						// 			self.buttonHeight + 
						// 			"px;'>" + 
						// 			propertyIth.propertyName + 
						// 			"</button>");
						// 		m_jType.append(jTypeProperty);
						// 		jTypeProperty.click(m_functionPropertyClick);
						// 		jTypeProperty.contextMenu({

						// 			menuSelector: "#TypeMemberContextMenu",
						// 			menuSelected: m_functionPropertyContextMenu
						// 		});

						// 		// Move to the next row.
						// 		iCursorY += self.lineHeight;
						// 	}

						// 	/////////////////////////
						// 	// Space before methods.
						// 	iCursorY += self.lineHeight;

						// 	// Methods.
						// 	var jTypeMethods = $("<div style='position:absolute;left:8px;top:" + 
						// 		iCursorY + 
						// 		"px;right:8px;height:" + 
						// 		self.buttonHeight + 
						// 		"px;'>" + 
						// 		"methods" + 
						// 		"</div>");
						// 	m_jType.append(jTypeMethods);
						// 	iCursorY += self.lineHeight;

						// 	// Add Methods.
						// 	var jTypeAddMethods = $("<button class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 		iCursorY + 
						// 		"px;right:8px;height:" +
						// 		self.buttonHeight +
						// 		"px;width:26px;'>" + 
						// 		"<img class='typestripitem' id='AddType' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
						// 		resourceHelper.toURL('images', null, null, 'plus.png') +
						// 		"'></img>" + 
						// 		"</button>");
						// 	m_jType.append(jTypeAddMethods);
						// 	iCursorY += self.lineHeight;
						// 	jTypeAddMethods.click(m_functionAddMethodClick);

						// 	// Loop over and add the methods.
						// 	for (var i = 0; i < self.data.methods.length; i++) {

						// 		var methodIth = self.data.methods[i];

						// 		// Add the property.
						// 		var jTypeMethod = $("<button data-index='" + 
						// 			i + 
						// 			"' class='typebutton' style='position:absolute;left:8px;top:" + 
						// 			iCursorY +
						// 			"px;right:8px;height:" + 
						// 			self.buttonHeight + 
						// 			"px;'>" + 
						// 			methodIth.name + 
						// 			"</button>");
						// 		m_jType.append(jTypeMethod);
						// 		jTypeMethod.click(m_functionMethodClick);
						// 		jTypeMethod.contextMenu({

						// 			menuSelector: "#TypeMemberContextMenu",
						// 			menuSelected: m_functionMethodContextMenu
						// 		});

						// 		// Move to the next row.
						// 		iCursorY += self.lineHeight;
						// 	}

						// 	/////////////////////////
						// 	// Space before events.
						// 	iCursorY += self.lineHeight;

						// 	// Events.
						// 	var jTypeEvents = $("<div style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 		iCursorY + 
						// 		"px;right:8px;height:" + 
						// 		self.buttonHeight + 
						// 		"px;'>" + 
						// 		"events" + 
						// 		"</div>");
						// 	m_jType.append(jTypeEvents);
						// 	iCursorY += self.lineHeight;

						// 	// Add Events.
						// 	var jTypeAddEvents = $("<button class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 	 	iCursorY + 
						// 	 	"px;right:8px;height:" +
						// 		self.buttonHeight +
						// 		"px;width:26px;'>" + 
						// 		"<img class='typestripitem' id='AddType' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
						// 		resourceHelper.toURL('images', null, null, 'plus.png') +
						// 		"'></img>" + 
						// 		"</button>");
						// 	m_jType.append(jTypeAddEvents);
						// 	iCursorY += self.lineHeight;
						// 	jTypeAddEvents.click(m_functionAddEventClick);

						// 	// Loop over and add the events.
						// 	for (var i = 0; i < self.data.events.length; i++) {

						// 		var eventsIth = self.data.events[i];

						// 		// Add the Events.
						// 		var jTypeEvent = $("<button data-index='" + 
						// 			i + 
						// 			"' class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 			iCursorY +
						// 			"px;right:8px;height:" + 
						// 			self.buttonHeight + 
						// 			"px;'>" + 
						// 			eventsIth.name + 
						// 			"</button>");
						// 		m_jType.append(jTypeEvent);
						// 		jTypeEvent.click(m_functionEventClick);
						// 		jTypeEvent.contextMenu({

						// 			menuSelector: "#TypeMemberContextMenu",
						// 			menuSelected: m_functionEventContextMenu
						// 		});

						// 		// Move to the next row.
						// 		iCursorY += self.lineHeight;
						// 	}
						// 	return null;
						// } catch (e) {

						// 	return e;
						// }
					};

					var m_functionMainTGActionBtnClick = function() {

						alert('got click on main TGAction btn');
					}

					// General handler to process a selection of a member.
					var m_functionSelect = function (arrayActive, jMember) {

						try {

							// Clear the existing selection, if set.
							$(".SelectedType").removeClass("SelectedType");
							$(".SelectedTypeMember").removeClass("SelectedTypeMember");

							// Set the selection to this item.
							m_jType.addClass("SelectedType");
							jMember.addClass("SelectedTypeMember");

							// Store module instance selection state.
							var strIndex = jMember.attr("data-index");
							var iIndex = parseInt(strIndex);
							m_iActiveIndex = iIndex;
							m_arrayActive = arrayActive;

							// Tell the Types that "this" item was just selected.
							var exceptionRet = types.select(self);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Load workspace string into blockly frame.
							return code.load(self,
								m_arrayActive[m_iActiveIndex],
								m_arrayActive[m_iActiveIndex].workspace);
						} catch (e) {

							return e;
						}
					};

					// Helper shows the delete dialog.
					var m_functionDeleteDialogHelper = function (strType, arrayCollection, iIndex, objectMember) {

						try {

							// Figure out if this type is referenced anywhere
							var methodReference = null;
							if (strType === "type") {

								methodReference = code.isTypeReferencedInWorkspace(self);
							} else if (strType === "property") {

								methodReference = code.isPropertyReferencedInWorkspace(self, objectMember);
							} else if (strType === "method") {

								methodReference = code.isMethodReferencedInWorkspace(self, objectMember);
							} else if (strType === "event") {


							}

							// If a reference was found, report it and drop out.
							if (methodReference) {

								BootstrapDialog.alert({

									title: "WARNING",
									message: "Can not delete! Object in use: " + methodReference.type.data.name + " :: " + methodReference.name,
									type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
									closable: true, // <-- Default value is false
									draggable: true // <-- Default value is false
								});
								return;
       						}

							BootstrapDialog.confirm({

							    title: 'WARNING',
							    message: 'Warning! Confirm delete of ' + strType + ', ' + objectMember.name + '?',
							    type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
							    closable: true, // <-- Default value is false
							    draggable: true, // <-- Default value is false
							    btnCancelLabel: 'Do not delete!', // <-- Default value is 'Cancel',
							    btnOKLabel: 'Delete!', // <-- Default value is 'OK',
							    btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog type will be used,
							    callback: function(result) {

							        // result will be true if button was click, while it will be false if users close the dialog directly.
							        if (result) {

							        	if (strType === "type") {

							        		// Handle the type itself:

							        		// Remove from code/blockly.
											var exceptionRet = code.removeType(self);
											if (exceptionRet) {

												throw exceptionRet;
											}

							        		// Remove from the type.
											exceptionRet = type.removeItem(self);
											if (exceptionRet) {

												throw exceptionRet;
											}
							        	} else {

											// Reset selection if just deleted selected item.
											if (m_iActiveIndex === iIndex &&
												m_arrayActive === arrayCollection) {

												m_iActiveIndex = -1;
												m_arrayActive = null;
											}

							        		// Handle member:

							        		// Remove from code/blockly.
							        		if (strType === "property") {

												var exceptionRet = code.removeProperty(self, 
													objectMember);
												if (exceptionRet) {

													throw exceptionRet;
												}
											} else if (strType === "method") {

												var exceptionRet = code.removeMethod(self, 
													objectMember);
												if (exceptionRet) {

													throw exceptionRet;
												}
											}

								        	// Actually delete it.
								        	arrayCollection.splice(iIndex, 
								        		1);

											// Refresh display.
											exceptionRet = m_functionGenerateTypeContents();
											if (exceptionRet) {

												throw exceptionRet;
											}
										}
							        }
							    }
							});
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Helper shows the rename dialog.
					var m_functionRenameDialogHelper = function (strType, objectMember, bNew) {

						try {

							// Build up the string defining the GUI for the rename dialog.
							var strMessage = "<span>Specify " + (bNew ? "" : "a new ") + "name for " + 
								strType +
								":&nbsp;&nbsp;</span><input id='RenameDialogTextInput' type='text' value='" + 
								objectMember.name + 
								"'></input>";

							BootstrapDialog.confirm({

							    title: (bNew ? 'Add' : 'Rename'),
							    message: strMessage,
							    closable: true, // <-- Default value is false
							    draggable: true, // <-- Default value is false
							    btnOKLabel: (bNew ? 'Add' : 'Rename'), // <-- Default value is 'OK',
							    callback: function(result) {

							        // result will be true if button was click, while it will be false if users close the dialog directly.
							        if (result) {

							        	// Rename.
							        	objectMember.name = $("#RenameDialogTextInput").val();

										// Refresh display.
										var exceptionRet = m_functionGenerateTypeContents();
										if (exceptionRet) {

											throw exceptionRet;
										}

										if (strType === "property") {

											// Update code module.
											exceptionRet = code.renameProperty(self,
												objectMember,
												m_strOriginalName);
											if (exceptionRet) {

												throw exceptionRet;
											}
										} else if (strType === "method") {

											// Update code module.
											exceptionRet = code.renameMethod(self,
												objectMember,
												m_strOriginalName);
											if (exceptionRet) {

												throw exceptionRet;
											}
										} else if (strType === "type") {

											// Update code module.
											exceptionRet = code.renameType(self,
												m_strOriginalName);
											if (exceptionRet) {

												throw exceptionRet;
											}
										}
							        }
							    }
							});
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a type name is right-clicked.
					var m_functionTypeContextMenu = function (invokedOn, selectedMenu) {

						try {

							// Handle different menu items differently.
							if (selectedMenu.text() === "rename") {

								// Save off original name.
								m_strOriginalName = self.data.name;

								// Show rename dialog.
								var exceptionRet = m_functionRenameDialogHelper("type",
									self.data);
								if (exceptionRet) {

									throw exceptionRet;
								}
							} else if (selectedMenu.text() === "delete") {

								// Show confirmation dialog.
								var exceptionRet = m_functionDeleteDialogHelper("type",
									null,
									-1,
									self.data);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a type image is right-clicked.
					var m_functionTypeImageContextMenu = function (invokedOn, selectedMenu) {

						// try {

						// 	// Handle different menu items differently.
						// 	if (selectedMenu.text() === "Search for a Type Image") {

						// 		var exceptionRet = client.showImageSearchDialog(true, m_functionOnGotResourceId);
						// 		if (exceptionRet) {

						// 			throw exceptionRet;
						// 		}
						// 	}
						// 	if (selectedMenu.text() === "Load a new Type Image using a URL") {

						// 		var exceptionRet = client.showImageURLDialog(true, m_functionOnGotResourceId);
						// 		if (exceptionRet) {

						// 			throw exceptionRet;
						// 		}
						// 	}
						// 	if (selectedMenu.text() === "Load a new Type Image that's already on your computer") {

						// 		var exceptionRet = client.showImageDiskDialog(true, m_functionOnGotResourceId);
						// 		if (exceptionRet) {

						// 			throw exceptionRet;
						// 		}
						// 	}
						// } catch (e) {

						// 	errorHelper.show(e);
						// }
					};

					var m_functionOnGotResourceId = function (iResourceId) {

						try {

							if (typeof iResourceId !== 'undefined' && iResourceId !== null && iResourceId > 0) {

								// Save off the new resource in state.
								self.data.imageResourceId = iResourceId;

								// Cause type to regenerate.
								var exceptionRet = m_functionGenerateTypeContents();
								if (exceptionRet) {

									throw exceptionRet;
								}

								// Call off to the designer to update the picture in the toolstrip and the designer surface.
								exceptionRet = designer.updateImage(self);
								if (exceptionRet) {

									throw exceptionRet;
								}

								// Call off to Types to change the image in the TypeWell.
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

					// Invoked when the add property button is clicked in this type.
					var m_functionAddPropertyClick = function (e) {

						try {

							var property = { 

								name: "new property", 
								workspace: "", 
								method: "" 
							};

							// Add a new, empty member.
							self.data.properties.push(property);

							// Add the property to code.
							var exceptionRet = code.addProperty(self, 
								property);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Save original.
							m_strOriginalName = property.name;

							// Show rename dialog.
							exceptionRet = m_functionRenameDialogHelper("property",
								property,
								true);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a property button is clicked in this type.
					var m_functionPropertyClick = function (e) {

						try {

							// Take no action.
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a property button is right-clicked.
					var m_functionPropertyContextMenu = function (invokedOn, selectedMenu) {

						try {

							// Get the index of the item clicked.
							var strIndex = invokedOn.attr("data-index");
							var iIndex = parseInt(strIndex);

							// Get the item clicked.
							var propertyClicked = self.data.properties[iIndex];
							if (!propertyClicked) {

								return;
							}

							// Handle different menu items differently.
							if (selectedMenu.text() === "rename") {

								// Save original.
								m_strOriginalName = propertyClicked.name;

								// Show rename dialog.
								var exceptionRet = m_functionRenameDialogHelper("property",
									propertyClicked);
								if (exceptionRet) {

									throw exceptionRet;
								}
							} else if (selectedMenu.text() === "delete") {

								// Show confirmation dialog.
								var exceptionRet = m_functionDeleteDialogHelper("property",
									self.data.properties,
									iIndex,
									propertyClicked);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when the add method button is clicked in this type.
					var m_functionAddMethodClick = function (e) {

						try {

							self.data.methods.push({ name: "new method", codeDOM: "", workspace: "" });

							// Add the contents to the newly allocated type.
							var exceptionRet = m_functionGenerateTypeContents();
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Add the method to code too.
							exceptionRet = code.addMethod(self, 
								self.data.methods[self.data.methods.length - 1]);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a method button is clicked in this type.
					var m_functionMethodClick = function (e) {

						try {

							// Get the type clicked.
							var jMethodClicked = $(this);

							// Call unified click handler.
							var exceptionRet = m_functionSelect(self.data.methods,
								jMethodClicked);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a method button is right-clicked.
					var m_functionMethodContextMenu = function (invokedOn, selectedMenu) {

						try {

							// Get the index of the item clicked.
							var strIndex = invokedOn.attr("data-index");
							var iIndex = parseInt(strIndex);

							// Get the item clicked.
							var methodClicked = self.data.methods[iIndex];
							if (!methodClicked) {

								return;
							}

							// Handle different menu items differently.
							if (selectedMenu.text() === "rename") {

								// Save off original name.
								m_strOriginalName = methodClicked.name;

								// Show rename dialog.
								var exceptionRet = m_functionRenameDialogHelper("method",
									methodClicked);
								if (exceptionRet) {

									throw exceptionRet;
								}
							} else if (selectedMenu.text() === "delete") {

								// Show confirmation dialog.
								var exceptionRet = m_functionDeleteDialogHelper("method",
									self.data.methods,
									iIndex,
									methodClicked);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when the add event button is clicked in this type.
					var m_functionAddEventClick = function (e) {

						try {

							self.data.events.push({ name: "new event", codeDOM: "" });

							// Add the contents to the newly allocated type.
							var exceptionRet = m_functionGenerateTypeContents();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a event button is clicked in this type.
					var m_functionEventClick = function (e) {

						try {

							// Get the type clicked.
							var jEventClicked = $(this);

							// Call unified click handler.
							var exceptionRet = m_functionSelect(self.data.events,
								jEventClicked);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a event button is right-clicked.
					var m_functionEventContextMenu = function (invokedOn, selectedMenu) {

						try {

							// Get the index of the item clicked.
							var strIndex = invokedOn.attr("data-index");
							var iIndex = parseInt(strIndex);

							// Get the item clicked.
							var eventClicked = self.data.events[iIndex];
							if (!eventClicked) {

								return;
							}

							// Handle different menu items differently.
							if (selectedMenu.text() === "rename") {

								// Save off original name.
								m_strOriginalName = eventClicked.name;

								// Show rename dialog.
								var exceptionRet = m_functionRenameDialogHelper("event",
									eventClicked);
								if (exceptionRet) {

									throw exceptionRet;
								}
							} else if (selectedMenu.text() === "delete") {

								// Show confirmation dialog.
								var exceptionRet = m_functionDeleteDialogHelper("event",
									self.data.events,
									iIndex,
									eventClicked);
								if (exceptionRet) {

									throw exceptionRet;
								}
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
