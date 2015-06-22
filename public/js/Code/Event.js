///////////////////////////////
// Event.  A sort of thing.
//
// Return constructor function.
//

// Define Event module.
define(["Core/errorHelper", "Core/resourceHelper", "Core/contextMenu", "Navbar/Comic", "Navbar/Comics"],
	function (errorHelper, resourceHelper, contextMenu, comic, comics) {

		try {

			// Define the Event constructor function.
			var functionConstructor = function Event() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					// The data this instance wrapps.
					// Schema:
					// add -- indicates this is the addEvent Event.
					// app -- indicates this is the app Event.
					// properties -- collection of properties of Event.
					// Events -- collection of Events of Event.
					// events -- collection of events of Event.
					// dependencies -- collection of dependencies of Event.
					// id -- the DB id of Event.
					// name -- the name of Event.
					// resourceId -- the resource id.
					self.data = null;

					// Height of a line in the GUI in pixlels.
					self.lineHeight = 30;
					// Height of a button in the GUI in pixlels.
					self.buttonHeight = 26;

					/////////////////////////////
					// Public Events.

					// Create this instance.
					self.load = function (EventsItem) {

						try {

							// Save data.
							self.data = EventsItem;

							// process properties Events events and dependencies collections.

							return null;

						} catch (e) {

							return e;
						}
					};

					// Activate/select Event instance.
					self.activate = function () {

						try {

							// Cause Events to fill the Event well with this Event.
							return Events.select(self);
							
						} catch (e) {

							return e;
						}
					};

					// Destroy this instance.
					self.destroy = function () {

						try {

							// Remove Event from DOM.
							m_jEvent.remove();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Return the DOM element representing a prototypical item.
					self.generateDOM = function () {

						// Allocate the Event.
						m_jEvent = $("<div id='" + 
							self.data.name + 
							"' class='Eventstripitem' style='background:black;'></div>");

						// Add the contents to the newly allocated Event.
						var exceptionRet = m_functionGenerateEventContents();
						if (exceptionRet) {

							throw exceptionRet;
						}

						return m_jEvent;
					};

					// Loop over all Events, indicate if the specified
					// string is found in any of their workspaces.
					// Returns the Event referenced or null.
					self.isReferencedInWorkspace = function (strTest) {

						// Loop over the collection of Events.
						for (var i = 0; i < self.data.Events.length; i++) {

							var EventIth = self.data.Events[i];

							// Get the workspace.
							var strWorkspace = EventIth.workspace;

							// Check.
							if (strWorkspace.indexOf(strTest) !== -1) {

								// Save this Event in the Event to make it 
								// easier to report on who the Event is.
								EventIth.Event = self;
								return EventIth;
							}
						}

						return null;
					};

					// Loop over all Events, updates their workspace with the replacement.
					// Returns the Event referenced or null.
					self.replaceInWorkspaces = function (strOld, strNew) {

						// Loop over the collection of Events.
						for (var i = 0; i < self.data.Events.length; i++) {

							var EventIth = self.data.Events[i];

							// Construct the global RegExp and apply to workspace.
							var re = new RegExp(strOld,"g");
							if (EventIth.workspace) {

								EventIth.workspace = EventIth.workspace.replace(re,
									strNew);
							}
						}

						return null;
					};

					// Update the blockly data in the active member.
					self.update = function (strWorkspace, strEvent) {

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
								Event: strEvent
							});
							return null;
						} catch (e) {

							return e;
						}
					};

					// These three are initiated by clicking links in EventWell.
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
					// Private Events

					// Helper Event builds or rebuilds the Event contents and replaces the Events contents.
					var m_functionGenerateEventContents = function () {

						// try {

						// 	// Start empty.
						// 	m_jEvent.empty();

						// 	// Add first TGAction button. It applies to the whole Event.
						// 	var jMainTGActionButton = $("<button style='background-color:Transparent;border:none;outline:none;cursor:pointer;position:absolute;left:48px;top:8px;'>" +
						// 		"<img id='EventTGAction' class='TGAction' src='" +
						// 			resourceHelper.toURL("images", null, null, "TGAction.png") +
						// 			"'></img>" + 
						// 		"</button>");
						// 	m_jEvent.append(jMainTGActionButton);
						// 	jMainTGActionButton.click(m_functionMainTGActionBtnClick);

						// 	// Generate the name to add to the Event.
						// 	var jEventName = $("<div style='position:absolute;left:8px;top:38px;right:72px'>" + 
						// 		self.data.name + 
						// 		"</div>");
						// 	m_jEvent.append(jEventName);
						// 	jEventName.contextMenu({

						// 		menuSelector: "#EventMemberContextMenu",
						// 		menuSelected: m_functionEventContextMenu
						// 	});

						// 	// Generate the image for the Event.
						// 	var jEventImage = $("<img src='" + 
						// 		resourceHelper.toURL('resources', self.data.imageResourceId, 'image', '') + 
						// 		"' style='position:absolute;width:64px;top:8px;height:64px;right:8px'></img>");
						// 	m_jEvent.append(jEventImage);
						// 	jEventImage.contextMenu({

						// 		menuSelector: "#EventImageContextMenu",
						// 		menuSelected: m_functionEventImageContextMenu
						// 	});

						// 	/////////////////////////
						// 	// Properties.
						// 	var jEventProperties = $("<div style='color:rgb(250,250,200);position:absolute;left:8px;top:72px;right:8px;height:" + 
						// 		self.buttonHeight + 
						// 		"px;'>" + 
						// 		"properties" + 
						// 		"</div>");
						// 	m_jEvent.append(jEventProperties);

						// 	// Add Properties.
						// 	var jEventAddProperties = $("<button class='Eventbutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:102px;right:8px;height:" +
						// 		self.buttonHeight +
						// 		"px;width:26px;'>" + 
						// 		"<img class='Eventstripitem' id='AddEvent' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
						// 		resourceHelper.toURL('images', null, null, 'plus.png') +
						// 		"'></img>" + 
						// 		"</button>");
						// 	m_jEvent.append(jEventAddProperties);
						// 	jEventAddProperties.click(m_functionAddPropertyClick);

						// 	// Loop over and add the properties.
						// 	var iCursorY = 132;
						// 	for (var i = 0; i < self.data.properties.length; i++) {

						// 		var propertyIth = self.data.properties[i];

						// 		// Add the property.
						// 		var jEventProperty = $("<button data-index='" + 
						// 			i + 
						// 			"' class='Eventbutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 			iCursorY +
						// 			"px;right:8px;height:" + 
						// 			self.buttonHeight + 
						// 			"px;'>" + 
						// 			propertyIth.propertyName + 
						// 			"</button>");
						// 		m_jEvent.append(jEventProperty);
						// 		jEventProperty.click(m_functionPropertyClick);
						// 		jEventProperty.contextMenu({

						// 			menuSelector: "#EventMemberContextMenu",
						// 			menuSelected: m_functionPropertyContextMenu
						// 		});

						// 		// Move to the next row.
						// 		iCursorY += self.lineHeight;
						// 	}

						// 	/////////////////////////
						// 	// Space before Events.
						// 	iCursorY += self.lineHeight;

						// 	// Events.
						// 	var jEventEvents = $("<div style='position:absolute;left:8px;top:" + 
						// 		iCursorY + 
						// 		"px;right:8px;height:" + 
						// 		self.buttonHeight + 
						// 		"px;'>" + 
						// 		"Events" + 
						// 		"</div>");
						// 	m_jEvent.append(jEventEvents);
						// 	iCursorY += self.lineHeight;

						// 	// Add Events.
						// 	var jEventAddEvents = $("<button class='Eventbutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 		iCursorY + 
						// 		"px;right:8px;height:" +
						// 		self.buttonHeight +
						// 		"px;width:26px;'>" + 
						// 		"<img class='Eventstripitem' id='AddEvent' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
						// 		resourceHelper.toURL('images', null, null, 'plus.png') +
						// 		"'></img>" + 
						// 		"</button>");
						// 	m_jEvent.append(jEventAddEvents);
						// 	iCursorY += self.lineHeight;
						// 	jEventAddEvents.click(m_functionAddEventClick);

						// 	// Loop over and add the Events.
						// 	for (var i = 0; i < self.data.Events.length; i++) {

						// 		var EventIth = self.data.Events[i];

						// 		// Add the property.
						// 		var jEventEvent = $("<button data-index='" + 
						// 			i + 
						// 			"' class='Eventbutton' style='position:absolute;left:8px;top:" + 
						// 			iCursorY +
						// 			"px;right:8px;height:" + 
						// 			self.buttonHeight + 
						// 			"px;'>" + 
						// 			EventIth.name + 
						// 			"</button>");
						// 		m_jEvent.append(jEventEvent);
						// 		jEventEvent.click(m_functionEventClick);
						// 		jEventEvent.contextMenu({

						// 			menuSelector: "#EventMemberContextMenu",
						// 			menuSelected: m_functionEventContextMenu
						// 		});

						// 		// Move to the next row.
						// 		iCursorY += self.lineHeight;
						// 	}

						// 	/////////////////////////
						// 	// Space before events.
						// 	iCursorY += self.lineHeight;

						// 	// Events.
						// 	var jEventEvents = $("<div style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 		iCursorY + 
						// 		"px;right:8px;height:" + 
						// 		self.buttonHeight + 
						// 		"px;'>" + 
						// 		"events" + 
						// 		"</div>");
						// 	m_jEvent.append(jEventEvents);
						// 	iCursorY += self.lineHeight;

						// 	// Add Events.
						// 	var jEventAddEvents = $("<button class='Eventbutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 	 	iCursorY + 
						// 	 	"px;right:8px;height:" +
						// 		self.buttonHeight +
						// 		"px;width:26px;'>" + 
						// 		"<img class='Eventstripitem' id='AddEvent' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
						// 		resourceHelper.toURL('images', null, null, 'plus.png') +
						// 		"'></img>" + 
						// 		"</button>");
						// 	m_jEvent.append(jEventAddEvents);
						// 	iCursorY += self.lineHeight;
						// 	jEventAddEvents.click(m_functionAddEventClick);

						// 	// Loop over and add the events.
						// 	for (var i = 0; i < self.data.events.length; i++) {

						// 		var eventsIth = self.data.events[i];

						// 		// Add the Events.
						// 		var jEventEvent = $("<button data-index='" + 
						// 			i + 
						// 			"' class='Eventbutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						// 			iCursorY +
						// 			"px;right:8px;height:" + 
						// 			self.buttonHeight + 
						// 			"px;'>" + 
						// 			eventsIth.name + 
						// 			"</button>");
						// 		m_jEvent.append(jEventEvent);
						// 		jEventEvent.click(m_functionEventClick);
						// 		jEventEvent.contextMenu({

						// 			menuSelector: "#EventMemberContextMenu",
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
							$(".SelectedEvent").removeClass("SelectedEvent");
							$(".SelectedEventMember").removeClass("SelectedEventMember");

							// Set the selection to this item.
							m_jEvent.addClass("SelectedEvent");
							jMember.addClass("SelectedEventMember");

							// Store module instance selection state.
							var strIndex = jMember.attr("data-index");
							var iIndex = parseInt(strIndex);
							m_iActiveIndex = iIndex;
							m_arrayActive = arrayActive;

							// Tell the Events that "this" item was just selected.
							var exceptionRet = Events.select(self);
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
					var m_functionDeleteDialogHelper = function (strEvent, arrayCollection, iIndex, objectMember) {

						try {

							// Figure out if this Event is referenced anywhere
							var EventReference = null;
							if (strEvent === "Event") {

								EventReference = code.isEventReferencedInWorkspace(self);
							} else if (strEvent === "property") {

								EventReference = code.isPropertyReferencedInWorkspace(self, objectMember);
							} else if (strEvent === "Event") {

								EventReference = code.isEventReferencedInWorkspace(self, objectMember);
							} else if (strEvent === "event") {


							}

							// If a reference was found, report it and drop out.
							if (EventReference) {

								BootstrapDialog.alert({

									title: "WARNING",
									message: "Can not delete! Object in use: " + EventReference.Event.data.name + " :: " + EventReference.name,
									Event: BootstrapDialog.Event_WARNING, // <-- Default value is BootstrapDialog.Event_PRIMARY
									closable: true, // <-- Default value is false
									draggable: true // <-- Default value is false
								});
								return;
       						}

							BootstrapDialog.confirm({

							    title: 'WARNING',
							    message: 'Warning! Confirm delete of ' + strEvent + ', ' + objectMember.name + '?',
							    Event: BootstrapDialog.Event_WARNING, // <-- Default value is BootstrapDialog.Event_PRIMARY
							    closable: true, // <-- Default value is false
							    draggable: true, // <-- Default value is false
							    btnCancelLabel: 'Do not delete!', // <-- Default value is 'Cancel',
							    btnOKLabel: 'Delete!', // <-- Default value is 'OK',
							    btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog Event will be used,
							    callback: function(result) {

							        // result will be true if button was click, while it will be false if users close the dialog directly.
							        if (result) {

							        	if (strEvent === "Event") {

							        		// Handle the Event itself:

							        		// Remove from code/blockly.
											var exceptionRet = code.removeEvent(self);
											if (exceptionRet) {

												throw exceptionRet;
											}

							        		// Remove from the Event.
											exceptionRet = Event.removeItem(self);
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
							        		if (strEvent === "property") {

												var exceptionRet = code.removeProperty(self, 
													objectMember);
												if (exceptionRet) {

													throw exceptionRet;
												}
											} else if (strEvent === "Event") {

												var exceptionRet = code.removeEvent(self, 
													objectMember);
												if (exceptionRet) {

													throw exceptionRet;
												}
											}

								        	// Actually delete it.
								        	arrayCollection.splice(iIndex, 
								        		1);

											// Refresh display.
											exceptionRet = m_functionGenerateEventContents();
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
					var m_functionRenameDialogHelper = function (strEvent, objectMember, bNew) {

						try {

							// Build up the string defining the GUI for the rename dialog.
							var strMessage = "<span>Specify " + (bNew ? "" : "a new ") + "name for " + 
								strEvent +
								":&nbsp;&nbsp;</span><input id='RenameDialogTextInput' Event='text' value='" + 
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
										var exceptionRet = m_functionGenerateEventContents();
										if (exceptionRet) {

											throw exceptionRet;
										}

										if (strEvent === "property") {

											// Update code module.
											exceptionRet = code.renameProperty(self,
												objectMember,
												m_strOriginalName);
											if (exceptionRet) {

												throw exceptionRet;
											}
										} else if (strEvent === "Event") {

											// Update code module.
											exceptionRet = code.renameEvent(self,
												objectMember,
												m_strOriginalName);
											if (exceptionRet) {

												throw exceptionRet;
											}
										} else if (strEvent === "Event") {

											// Update code module.
											exceptionRet = code.renameEvent(self,
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

					// Invoked when a Event name is right-clicked.
					var m_functionEventContextMenu = function (invokedOn, selectedMenu) {

						try {

							// Handle different menu items differently.
							if (selectedMenu.text() === "rename") {

								// Save off original name.
								m_strOriginalName = self.data.name;

								// Show rename dialog.
								var exceptionRet = m_functionRenameDialogHelper("Event",
									self.data);
								if (exceptionRet) {

									throw exceptionRet;
								}
							} else if (selectedMenu.text() === "delete") {

								// Show confirmation dialog.
								var exceptionRet = m_functionDeleteDialogHelper("Event",
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

					// Invoked when a Event image is right-clicked.
					var m_functionEventImageContextMenu = function (invokedOn, selectedMenu) {

						// try {

						// 	// Handle different menu items differently.
						// 	if (selectedMenu.text() === "Search for a Event Image") {

						// 		var exceptionRet = client.showImageSearchDialog(true, m_functionOnGotResourceId);
						// 		if (exceptionRet) {

						// 			throw exceptionRet;
						// 		}
						// 	}
						// 	if (selectedMenu.text() === "Load a new Event Image using a URL") {

						// 		var exceptionRet = client.showImageURLDialog(true, m_functionOnGotResourceId);
						// 		if (exceptionRet) {

						// 			throw exceptionRet;
						// 		}
						// 	}
						// 	if (selectedMenu.text() === "Load a new Event Image that's already on your computer") {

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

							// if (Eventof iResourceId !== 'undefined' && iResourceId !== null && iResourceId > 0) {

							// 	// Save off the new resource in state.
							// 	self.data.imageResourceId = iResourceId;

							// 	// Cause Event to regenerate.
							// 	// var exceptionRet = m_functionGenerateEventContents();
							// 	// if (exceptionRet) {

							// 	// 	throw exceptionRet;
							// 	// }

							// 	// Call off to the designer to update the picture in the designer surface.
							// 	var exceptionRet = designer.updateImage(self);
							// 	if (exceptionRet) {

							// 		throw exceptionRet;
							// 	}

							// 	// Call off to Events to change the image in the EventWell, Event Eventstrip and the toolstrip.
							// 	exceptionRet = Events.updateActiveEventImage();
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

					// Invoked when the add property button is clicked in this Event.
					var m_functionAddPropertyClick = function (e) {

						try {

							var property = { 

								name: "new property", 
								workspace: "", 
								Event: "" 
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

					// Invoked when a property button is clicked in this Event.
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

					// Invoked when the add Event button is clicked in this Event.
					var m_functionAddEventClick = function (e) {

						try {

							self.data.Events.push({ name: "new Event", codeDOM: "", workspace: "" });

							// Add the contents to the newly allocated Event.
							var exceptionRet = m_functionGenerateEventContents();
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Add the Event to code too.
							exceptionRet = code.addEvent(self, 
								self.data.Events[self.data.Events.length - 1]);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a Event button is clicked in this Event.
					var m_functionEventClick = function (e) {

						try {

							// Get the Event clicked.
							var jEventClicked = $(this);

							// Call unified click handler.
							var exceptionRet = m_functionSelect(self.data.Events,
								jEventClicked);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a Event button is right-clicked.
					var m_functionEventContextMenu = function (invokedOn, selectedMenu) {

						try {

							// Get the index of the item clicked.
							var strIndex = invokedOn.attr("data-index");
							var iIndex = parseInt(strIndex);

							// Get the item clicked.
							var EventClicked = self.data.Events[iIndex];
							if (!EventClicked) {

								return;
							}

							// Handle different menu items differently.
							if (selectedMenu.text() === "rename") {

								// Save off original name.
								m_strOriginalName = EventClicked.name;

								// Show rename dialog.
								var exceptionRet = m_functionRenameDialogHelper("Event",
									EventClicked);
								if (exceptionRet) {

									throw exceptionRet;
								}
							} else if (selectedMenu.text() === "delete") {

								// Show confirmation dialog.
								var exceptionRet = m_functionDeleteDialogHelper("Event",
									self.data.Events,
									iIndex,
									EventClicked);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when the add event button is clicked in this Event.
					var m_functionAddEventClick = function (e) {

						try {

							self.data.events.push({ name: "new event", codeDOM: "" });

							// Add the contents to the newly allocated Event.
							var exceptionRet = m_functionGenerateEventContents();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a event button is clicked in this Event.
					var m_functionEventClick = function (e) {

						try {

							// Get the Event clicked.
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
					var m_jEvent = null;
					// The active index for this Event.
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
