///////////////////////////////
// Property.  A sort of thing.
//
// Return constructor function.
//

// Define Property module.
define(["Core/errorHelper", "Core/resourceHelper", "Core/contextMenu", "Navbar/Comic", "Navbar/Comics"],
	function (errorHelper, resourceHelper, contextMenu, comic, comics) {

		try {

			// Define the Property constructor function.
			var functionConstructor = function Property() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					// The data this instance wrapps.
					// Schema:
					// add -- indicates this is the addProperty Property.
					// app -- indicates this is the app Property.
					// properties -- collection of properties of Property.
					// Propertys -- collection of Propertys of Property.
					// events -- collection of events of Property.
					// dependencies -- collection of dependencies of Property.
					// id -- the DB id of Property.
					// name -- the name of Property.
					// resourceId -- the resource id.
					self.data = null;

					// Height of a line in the GUI in pixlels.
					self.lineHeight = 30;
					// Height of a button in the GUI in pixlels.
					self.buttonHeight = 26;

					/////////////////////////////
					// Public Propertys.

					// Create this instance.
					self.load = function (PropertysItem) {

						try {

							// Save data.
							self.data = PropertysItem;

							// process properties Propertys events and dependencies collections.

							return null;

						} catch (e) {

							return e;
						}
					};

					// Activate/select Property instance.
					self.activate = function () {

						try {

							// Cause Propertys to fill the Property well with this Property.
							return Propertys.select(self);
							
						} catch (e) {

							return e;
						}
					};

					// Destroy this instance.
					self.destroy = function () {

						try {

							// Remove Property from DOM.
							m_jProperty.remove();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Return the DOM element representing a prototypical item.
					self.generateDOM = function () {

						// Allocate the Property.
						m_jProperty = $("<div id='" + 
							self.data.name + 
							"' class='Propertystripitem' style='background:black;'></div>");

						// Add the contents to the newly allocated Property.
						var exceptionRet = m_functionGeneratePropertyContents();
						if (exceptionRet) {

							throw exceptionRet;
						}

						return m_jProperty;
					};

					// Loop over all Propertys, indicate if the specified
					// string is found in any of their workspaces.
					// Returns the Property referenced or null.
					self.isReferencedInWorkspace = function (strTest) {

						// Loop over the collection of Propertys.
						for (var i = 0; i < self.data.Propertys.length; i++) {

							var PropertyIth = self.data.Propertys[i];

							// Get the workspace.
							var strWorkspace = PropertyIth.workspace;

							// Check.
							if (strWorkspace.indexOf(strTest) !== -1) {

								// Save this Property in the Property to make it 
								// easier to report on who the Property is.
								PropertyIth.Property = self;
								return PropertyIth;
							}
						}

						return null;
					};

					// Loop over all Propertys, updates their workspace with the replacement.
					// Returns the Property referenced or null.
					self.replaceInWorkspaces = function (strOld, strNew) {

						// Loop over the collection of Propertys.
						for (var i = 0; i < self.data.Propertys.length; i++) {

							var PropertyIth = self.data.Propertys[i];

							// Construct the global RegExp and apply to workspace.
							var re = new RegExp(strOld,"g");
							if (PropertyIth.workspace) {

								PropertyIth.workspace = PropertyIth.workspace.replace(re,
									strNew);
							}
						}

						return null;
					};

					// Update the blockly data in the active member.
					self.update = function (strWorkspace, strProperty) {

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
								Property: strProperty
							});
							return null;
						} catch (e) {

							return e;
						}
					};

					// These three are initiated by clicking links in PropertyWell.
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
					// Private Propertys

					// Helper Property builds or rebuilds the Property contents and replaces the Propertys contents.
					var m_functionGeneratePropertyContents = function () {

						// try {

						// 	// Start empty.
						// 	m_jProperty.empty();

						// 	// Add first TGAction button. It applies to the whole Property.
						// 	var jMainTGActionButton = $("<button style='background-color:Transparent;border:none;outline:none;cursor:pointer;position:absolute;left:48px;top:8px;'>" +
						// 		"<img id='PropertyTGAction' class='TGAction' src='" +
						// 			resourceHelper.toURL("images", null, null, "TGAction.png") +
						// 			"'></img>" + 
						// 		"</button>");
						// 	m_jProperty.append(jMainTGActionButton);
						// 	jMainTGActionButton.click(m_functionMainTGActionBtnClick);

						// 	// Generate the name to add to the Property.
						// 	var jPropertyName = $("<div style='position:absolute;left:8px;top:38px;right:72px'>" + 
						// 		self.data.name + 
						// 		"</div>");
						// 	m_jProperty.append(jPropertyName);
						// 	jPropertyName.contextMenu({

						// 		menuSelector: "#PropertyMemberContextMenu",
						// 		menuSelected: m_functionPropertyContextMenu
						// 	});

						// 	// Generate the image for the Property.
						// 	var jPropertyImage = $("<img src='" + 
						// 		resourceHelper.toURL('resources', self.data.imageResourceId, 'image', '') + 
						// 		"' style='position:absolute;width:64px;top:8px;height:64px;right:8px'></img>");
						// 	m_jProperty.append(jPropertyImage);
						// 	jPropertyImage.contextMenu({

						// 		menuSelector: "#PropertyImageContextMenu",
						// 		menuSelected: m_functionPropertyImageContextMenu
						// 	});

						// 	/////////////////////////
						// 	// Properties.
						// 	var jPropertyProperties = $("<div style='color:rgb(250,250,200);position:absolute;left:8px;top:72px;right:8px;height:" + 
						// 		self.buttonHeight + 
						// 		"px;'>" + 
						// 		"properties" + 
						// 		"</div>");
						// 	m_jProperty.append(jPropertyProperties);

						// 	// Add Properties.
						// 	var jPropertyAddProperties = $("<button class='Propertybutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:102px;right:8px;height:" +
						// 		self.buttonHeight +
						// 		"px;width:26px;'>" + 
						// 		"<img class='Propertystripitem' id='AddProperty' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
						// 		resourceHelper.toURL('images', null, null, 'plus.png') +
						// 		"'></img>" + 
						// 		"</button>");
						// 	m_jProperty.append(jPropertyAddProperties);
						// 	jPropertyAddProperties.click(m_functionAddPropertyClick);

						// 	// Loop over and add the properties.
						// 	var iCursorY = 132;
						// 	for (var i = 0; i < self.data.properties.length; i++) {

						// 		var propertyIth = self.data.properties[i];

						// 		// Add the property.
						// 		var jPropertyProperty = $("<button data-index='" + 
						// 			i + 
						// 			"' class='Propertybutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 			iCursorY +
						// 			"px;right:8px;height:" + 
						// 			self.buttonHeight + 
						// 			"px;'>" + 
						// 			propertyIth.propertyName + 
						// 			"</button>");
						// 		m_jProperty.append(jPropertyProperty);
						// 		jPropertyProperty.click(m_functionPropertyClick);
						// 		jPropertyProperty.contextMenu({

						// 			menuSelector: "#PropertyMemberContextMenu",
						// 			menuSelected: m_functionPropertyContextMenu
						// 		});

						// 		// Move to the next row.
						// 		iCursorY += self.lineHeight;
						// 	}

						// 	/////////////////////////
						// 	// Space before Propertys.
						// 	iCursorY += self.lineHeight;

						// 	// Propertys.
						// 	var jPropertyPropertys = $("<div style='position:absolute;left:8px;top:" + 
						// 		iCursorY + 
						// 		"px;right:8px;height:" + 
						// 		self.buttonHeight + 
						// 		"px;'>" + 
						// 		"Propertys" + 
						// 		"</div>");
						// 	m_jProperty.append(jPropertyPropertys);
						// 	iCursorY += self.lineHeight;

						// 	// Add Propertys.
						// 	var jPropertyAddPropertys = $("<button class='Propertybutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 		iCursorY + 
						// 		"px;right:8px;height:" +
						// 		self.buttonHeight +
						// 		"px;width:26px;'>" + 
						// 		"<img class='Propertystripitem' id='AddProperty' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
						// 		resourceHelper.toURL('images', null, null, 'plus.png') +
						// 		"'></img>" + 
						// 		"</button>");
						// 	m_jProperty.append(jPropertyAddPropertys);
						// 	iCursorY += self.lineHeight;
						// 	jPropertyAddPropertys.click(m_functionAddPropertyClick);

						// 	// Loop over and add the Propertys.
						// 	for (var i = 0; i < self.data.Propertys.length; i++) {

						// 		var PropertyIth = self.data.Propertys[i];

						// 		// Add the property.
						// 		var jPropertyProperty = $("<button data-index='" + 
						// 			i + 
						// 			"' class='Propertybutton' style='position:absolute;left:8px;top:" + 
						// 			iCursorY +
						// 			"px;right:8px;height:" + 
						// 			self.buttonHeight + 
						// 			"px;'>" + 
						// 			PropertyIth.name + 
						// 			"</button>");
						// 		m_jProperty.append(jPropertyProperty);
						// 		jPropertyProperty.click(m_functionPropertyClick);
						// 		jPropertyProperty.contextMenu({

						// 			menuSelector: "#PropertyMemberContextMenu",
						// 			menuSelected: m_functionPropertyContextMenu
						// 		});

						// 		// Move to the next row.
						// 		iCursorY += self.lineHeight;
						// 	}

						// 	/////////////////////////
						// 	// Space before events.
						// 	iCursorY += self.lineHeight;

						// 	// Events.
						// 	var jPropertyEvents = $("<div style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 		iCursorY + 
						// 		"px;right:8px;height:" + 
						// 		self.buttonHeight + 
						// 		"px;'>" + 
						// 		"events" + 
						// 		"</div>");
						// 	m_jProperty.append(jPropertyEvents);
						// 	iCursorY += self.lineHeight;

						// 	// Add Events.
						// 	var jPropertyAddEvents = $("<button class='Propertybutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 	 	iCursorY + 
						// 	 	"px;right:8px;height:" +
						// 		self.buttonHeight +
						// 		"px;width:26px;'>" + 
						// 		"<img class='Propertystripitem' id='AddProperty' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
						// 		resourceHelper.toURL('images', null, null, 'plus.png') +
						// 		"'></img>" + 
						// 		"</button>");
						// 	m_jProperty.append(jPropertyAddEvents);
						// 	iCursorY += self.lineHeight;
						// 	jPropertyAddEvents.click(m_functionAddEventClick);

						// 	// Loop over and add the events.
						// 	for (var i = 0; i < self.data.events.length; i++) {

						// 		var eventsIth = self.data.events[i];

						// 		// Add the Events.
						// 		var jPropertyEvent = $("<button data-index='" + 
						// 			i + 
						// 			"' class='Propertybutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 			iCursorY +
						// 			"px;right:8px;height:" + 
						// 			self.buttonHeight + 
						// 			"px;'>" + 
						// 			eventsIth.name + 
						// 			"</button>");
						// 		m_jProperty.append(jPropertyEvent);
						// 		jPropertyEvent.click(m_functionEventClick);
						// 		jPropertyEvent.contextMenu({

						// 			menuSelector: "#PropertyMemberContextMenu",
						// 			menuSelected: m_functionEventContextMenu
						// 		});

						// 		// Move to the next row.
						// 		iCursorY += self.lineHeight;
						// 	}
						// 	return null;
						// } catch (e) {

						// 	return e;
						// }

						return null;
					};

					var m_functionMainTGActionBtnClick = function() {

						alert('got click on main TGAction btn');
					}

					// General handler to process a selection of a member.
					var m_functionSelect = function (arrayActive, jMember) {

						try {

							// Clear the existing selection, if set.
							$(".SelectedProperty").removeClass("SelectedProperty");
							$(".SelectedPropertyMember").removeClass("SelectedPropertyMember");

							// Set the selection to this item.
							m_jProperty.addClass("SelectedProperty");
							jMember.addClass("SelectedPropertyMember");

							// Store module instance selection state.
							var strIndex = jMember.attr("data-index");
							var iIndex = parseInt(strIndex);
							m_iActiveIndex = iIndex;
							m_arrayActive = arrayActive;

							// Tell the Propertys that "this" item was just selected.
							var exceptionRet = Propertys.select(self);
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
					var m_functionDeleteDialogHelper = function (strProperty, arrayCollection, iIndex, objectMember) {

						try {

							// Figure out if this Property is referenced anywhere
							var PropertyReference = null;
							if (strProperty === "Property") {

								PropertyReference = code.isPropertyReferencedInWorkspace(self);
							} else if (strProperty === "property") {

								PropertyReference = code.isPropertyReferencedInWorkspace(self, objectMember);
							} else if (strProperty === "Property") {

								PropertyReference = code.isPropertyReferencedInWorkspace(self, objectMember);
							} else if (strProperty === "event") {


							}

							// If a reference was found, report it and drop out.
							if (PropertyReference) {

								BootstrapDialog.alert({

									title: "WARNING",
									message: "Can not delete! Object in use: " + PropertyReference.Property.data.name + " :: " + PropertyReference.name,
									Property: BootstrapDialog.Property_WARNING, // <-- Default value is BootstrapDialog.Property_PRIMARY
									closable: true, // <-- Default value is false
									draggable: true // <-- Default value is false
								});
								return;
       						}

							BootstrapDialog.confirm({

							    title: 'WARNING',
							    message: 'Warning! Confirm delete of ' + strProperty + ', ' + objectMember.name + '?',
							    Property: BootstrapDialog.Property_WARNING, // <-- Default value is BootstrapDialog.Property_PRIMARY
							    closable: true, // <-- Default value is false
							    draggable: true, // <-- Default value is false
							    btnCancelLabel: 'Do not delete!', // <-- Default value is 'Cancel',
							    btnOKLabel: 'Delete!', // <-- Default value is 'OK',
							    btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog Property will be used,
							    callback: function(result) {

							        // result will be true if button was click, while it will be false if users close the dialog directly.
							        if (result) {

							        	if (strProperty === "Property") {

							        		// Handle the Property itself:

							        		// Remove from code/blockly.
											var exceptionRet = code.removeProperty(self);
											if (exceptionRet) {

												throw exceptionRet;
											}

							        		// Remove from the Property.
											exceptionRet = Property.removeItem(self);
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
							        		if (strProperty === "property") {

												var exceptionRet = code.removeProperty(self, 
													objectMember);
												if (exceptionRet) {

													throw exceptionRet;
												}
											} else if (strProperty === "Property") {

												var exceptionRet = code.removeProperty(self, 
													objectMember);
												if (exceptionRet) {

													throw exceptionRet;
												}
											}

								        	// Actually delete it.
								        	arrayCollection.splice(iIndex, 
								        		1);

											// Refresh display.
											exceptionRet = m_functionGeneratePropertyContents();
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
					var m_functionRenameDialogHelper = function (strProperty, objectMember, bNew) {

						try {

							// Build up the string defining the GUI for the rename dialog.
							var strMessage = "<span>Specify " + (bNew ? "" : "a new ") + "name for " + 
								strProperty +
								":&nbsp;&nbsp;</span><input id='RenameDialogTextInput' Property='text' value='" + 
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
										var exceptionRet = m_functionGeneratePropertyContents();
										if (exceptionRet) {

											throw exceptionRet;
										}

										if (strProperty === "property") {

											// Update code module.
											exceptionRet = code.renameProperty(self,
												objectMember,
												m_strOriginalName);
											if (exceptionRet) {

												throw exceptionRet;
											}
										} else if (strProperty === "Property") {

											// Update code module.
											exceptionRet = code.renameProperty(self,
												objectMember,
												m_strOriginalName);
											if (exceptionRet) {

												throw exceptionRet;
											}
										} else if (strProperty === "Property") {

											// Update code module.
											exceptionRet = code.renameProperty(self,
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

					// Invoked when a Property name is right-clicked.
					var m_functionPropertyContextMenu = function (invokedOn, selectedMenu) {

						try {

							// Handle different menu items differently.
							if (selectedMenu.text() === "rename") {

								// Save off original name.
								m_strOriginalName = self.data.name;

								// Show rename dialog.
								var exceptionRet = m_functionRenameDialogHelper("Property",
									self.data);
								if (exceptionRet) {

									throw exceptionRet;
								}
							} else if (selectedMenu.text() === "delete") {

								// Show confirmation dialog.
								var exceptionRet = m_functionDeleteDialogHelper("Property",
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

					// Invoked when a Property image is right-clicked.
					var m_functionPropertyImageContextMenu = function (invokedOn, selectedMenu) {

						// try {

						// 	// Handle different menu items differently.
						// 	if (selectedMenu.text() === "Search for a Property Image") {

						// 		var exceptionRet = client.showImageSearchDialog(true, m_functionOnGotResourceId);
						// 		if (exceptionRet) {

						// 			throw exceptionRet;
						// 		}
						// 	}
						// 	if (selectedMenu.text() === "Load a new Property Image using a URL") {

						// 		var exceptionRet = client.showImageURLDialog(true, m_functionOnGotResourceId);
						// 		if (exceptionRet) {

						// 			throw exceptionRet;
						// 		}
						// 	}
						// 	if (selectedMenu.text() === "Load a new Property Image that's already on your computer") {

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

							// if (Propertyof iResourceId !== 'undefined' && iResourceId !== null && iResourceId > 0) {

							// 	// Save off the new resource in state.
							// 	self.data.imageResourceId = iResourceId;

							// 	// Cause Property to regenerate.
							// 	// var exceptionRet = m_functionGeneratePropertyContents();
							// 	// if (exceptionRet) {

							// 	// 	throw exceptionRet;
							// 	// }

							// 	// Call off to the designer to update the picture in the designer surface.
							// 	var exceptionRet = designer.updateImage(self);
							// 	if (exceptionRet) {

							// 		throw exceptionRet;
							// 	}

							// 	// Call off to Propertys to change the image in the PropertyWell, Property Propertystrip and the toolstrip.
							// 	exceptionRet = Propertys.updateActivePropertyImage();
							// 	if (exceptionRet) {

							// 		throw exceptionRet;
							// 	}

							// } else {

							// 	throw new Error("Bad ResourceId received from ImageSoundDialog chain.");
							// }
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when the add property button is clicked in this Property.
					var m_functionAddPropertyClick = function (e) {

						try {

							var property = { 

								name: "new property", 
								workspace: "", 
								Property: "" 
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

					// Invoked when a property button is clicked in this Property.
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

					// Invoked when the add Property button is clicked in this Property.
					var m_functionAddPropertyClick = function (e) {

						try {

							self.data.Propertys.push({ name: "new Property", codeDOM: "", workspace: "" });

							// Add the contents to the newly allocated Property.
							var exceptionRet = m_functionGeneratePropertyContents();
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Add the Property to code too.
							exceptionRet = code.addProperty(self, 
								self.data.Propertys[self.data.Propertys.length - 1]);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a Property button is clicked in this Property.
					var m_functionPropertyClick = function (e) {

						try {

							// Get the Property clicked.
							var jPropertyClicked = $(this);

							// Call unified click handler.
							var exceptionRet = m_functionSelect(self.data.Propertys,
								jPropertyClicked);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a Property button is right-clicked.
					var m_functionPropertyContextMenu = function (invokedOn, selectedMenu) {

						try {

							// Get the index of the item clicked.
							var strIndex = invokedOn.attr("data-index");
							var iIndex = parseInt(strIndex);

							// Get the item clicked.
							var PropertyClicked = self.data.Propertys[iIndex];
							if (!PropertyClicked) {

								return;
							}

							// Handle different menu items differently.
							if (selectedMenu.text() === "rename") {

								// Save off original name.
								m_strOriginalName = PropertyClicked.name;

								// Show rename dialog.
								var exceptionRet = m_functionRenameDialogHelper("Property",
									PropertyClicked);
								if (exceptionRet) {

									throw exceptionRet;
								}
							} else if (selectedMenu.text() === "delete") {

								// Show confirmation dialog.
								var exceptionRet = m_functionDeleteDialogHelper("Property",
									self.data.Propertys,
									iIndex,
									PropertyClicked);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when the add event button is clicked in this Property.
					var m_functionAddEventClick = function (e) {

						try {

							self.data.events.push({ name: "new event", codeDOM: "" });

							// Add the contents to the newly allocated Property.
							var exceptionRet = m_functionGeneratePropertyContents();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a event button is clicked in this Property.
					var m_functionEventClick = function (e) {

						try {

							// Get the Property clicked.
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
					var m_jProperty = null;
					// The active index for this Property.
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
