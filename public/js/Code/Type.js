///////////////////////////////
// Type.  A sort of thing.
//
// Return constructor function.
//

// Define Type module.
define(["Core/errorHelper", "Core/resourceHelper", "Core/contextMenu"],
	function (errorHelper, resourceHelper, contextMenu) {

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

					// Create this instance.
					self.load = function (objectData) {

						try {

							// Save data.
							self.data = objectData;

							// process properties methods events and dependencies collections.

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

					///////////////////////////////////////
					// Private methods

					// Helper method builds or rebuilds the type contents and replaces the types contents.
					var m_functionGenerateTypeContents = function () {

						try {

							// Start empty.
							m_jType.empty();

							// Generate the name to add to the type.
							var jTypeName = $("<div style='position:absolute;left:8px;top:8px;right:72px'>" + 
								self.data.name + 
								"</div>");
							m_jType.append(jTypeName);
							jTypeName.contextMenu({

								menuSelector: "#TypeMemberContextMenu",
								menuSelected: m_functionTypeContextMenu
							});

							// Generate the image for the type.
							var jTypeImage = $("<img src='" + 
								resourceHelper.toURL(self.data.resourceId) + 
								"' style='position:absolute;width:64px;top:8px;height:64px;right:8px'></img>");
							m_jType.append(jTypeImage);

							/////////////////////////
							// Properties.
							var jTypeProperties = $("<div style='color:rgb(250,250,200);position:absolute;left:8px;top:72px;right:8px;height:" + 
								self.buttonHeight + 
								"px;'>" + 
								"properties" + 
								"</div>");
							m_jType.append(jTypeProperties);

							// Add Properties.
							var jTypeAddProperties = $("<button class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:102px;right:8px;height:" +
								self.buttonHeight +
								"px;width:26px;'>" + 
								"<img class='typestripitem' id='AddType' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
								resourceHelper.toURL(2) +
								"'></img>" + 
								"</button>");
							m_jType.append(jTypeAddProperties);
							jTypeAddProperties.click(m_functionAddPropertyClick);

							// Loop over and add the properties.
							var iCursorY = 132;
							for (var i = 0; i < self.data.properties.length; i++) {

								var propertyIth = self.data.properties[i];

								// Add the property.
								var jTypeProperty = $("<button data-index='" + 
									i + 
									"' class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
									iCursorY +
									"px;right:8px;height:" + 
									self.buttonHeight + 
									"px;'>" + 
									propertyIth.name + 
									"</button>");
								m_jType.append(jTypeProperty);
								jTypeProperty.click(m_functionPropertyClick);
								jTypeProperty.contextMenu({

									menuSelector: "#TypeMemberContextMenu",
									menuSelected: m_functionPropertyContextMenu
								});

								// Move to the next row.
								iCursorY += self.lineHeight;
							}

							/////////////////////////
							// Space before methods.
							iCursorY += self.lineHeight;

							// Methods.
							var jTypeMethods = $("<div style='position:absolute;left:8px;top:" + 
								iCursorY + 
								"px;right:8px;height:" + 
								self.buttonHeight + 
								"px;'>" + 
								"methods" + 
								"</div>");
							m_jType.append(jTypeMethods);
							iCursorY += self.lineHeight;

							// Add Methods.
							var jTypeAddMethods = $("<button class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
								iCursorY + 
								"px;right:8px;height:" +
								self.buttonHeight +
								"px;width:26px;'>" + 
								"<img class='typestripitem' id='AddType' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
								resourceHelper.toURL(2) +
								"'></img>" + 
								"</button>");
							m_jType.append(jTypeAddMethods);
							iCursorY += self.lineHeight;
							jTypeAddMethods.click(m_functionAddMethodClick);

							// Loop over and add the methods.
							for (var i = 0; i < self.data.methods.length; i++) {

								var methodIth = self.data.methods[i];

								// Add the property.
								var jTypeMethod = $("<button data-index='" + 
									i + 
									"' class='typebutton' style='position:absolute;left:8px;top:" + 
									iCursorY +
									"px;right:8px;height:" + 
									self.buttonHeight + 
									"px;'>" + 
									methodIth.name + 
									"</button>");
								m_jType.append(jTypeMethod);
								jTypeMethod.click(m_functionMethodClick);
								jTypeMethod.contextMenu({

									menuSelector: "#TypeMemberContextMenu",
									menuSelected: m_functionMethodContextMenu
								});

								// Move to the next row.
								iCursorY += self.lineHeight;
							}

							/////////////////////////
							// Space before events.
							iCursorY += self.lineHeight;

							// Events.
							var jTypeEvents = $("<div style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
								iCursorY + 
								"px;right:8px;height:" + 
								self.buttonHeight + 
								"px;'>" + 
								"events" + 
								"</div>");
							m_jType.append(jTypeEvents);
							iCursorY += self.lineHeight;

							// Add Events.
							var jTypeAddEvents = $("<button class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
							 	iCursorY + 
							 	"px;right:8px;height:" +
								self.buttonHeight +
								"px;width:26px;'>" + 
								"<img class='typestripitem' id='AddType' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
								resourceHelper.toURL(2) +
								"'></img>" + 
								"</button>");
							m_jType.append(jTypeAddEvents);
							iCursorY += self.lineHeight;
							jTypeAddEvents.click(m_functionAddEventClick);

							// Loop over and add the events.
							for (var i = 0; i < self.data.events.length; i++) {

								var eventsIth = self.data.events[i];

								// Add the Events.
								var jTypeEvent = $("<button data-index='" + 
									i + 
									"' class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
									iCursorY +
									"px;right:8px;height:" + 
									self.buttonHeight + 
									"px;'>" + 
									eventsIth.name + 
									"</button>");
								m_jType.append(jTypeEvent);
								jTypeEvent.click(m_functionEventClick);
								jTypeEvent.contextMenu({

									menuSelector: "#TypeMemberContextMenu",
									menuSelected: m_functionEventContextMenu
								});

								// Move to the next row.
								iCursorY += self.lineHeight;
							}
							return null;
						} catch (e) {

							return e;
						}
					};

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

							// Tell the TypeStrip that "this" item was just selected.
							var exceptionRet = typeStrip.select(self);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Load workspace string into blockly frame.
							return code.load(m_arrayActive[m_iActiveIndex].workspace);
						} catch (e) {

							return e;
						}
					};

					// Helper shows the delete dialog.
					var m_functionDeleteDialogHelper = function (strType, arrayCollection, iIndex, objectMember) {

						try {

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

							        		// Remove from the typeStrip.
											var exceptionRet = typeStrip.removeItem(self);
											if (exceptionRet) {

												throw exceptionRet;
											}
							        	} else {

							        		// Handle member:

								        	// Actually delete it.
								        	arrayCollection.splice(iIndex, 
								        		1);

											// Refresh display.
											var exceptionRet = m_functionGenerateTypeContents();
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
					var m_functionRenameDialogHelper = function (strType, objectMember) {

						try {

							// Build up the string defining the GUI for the rename dialog.
							var strMessage = "<span>Please specify new name for " + 
								strType +
								"," + 
								objectMember.name + 
								":</span>&nbsp;<input id='RenameDialogTextInput' type='text' value='" + 
								objectMember.name + 
								"'></input>";

							BootstrapDialog.confirm({

							    title: 'Rename',
							    message: strMessage,
							    closable: true, // <-- Default value is false
							    draggable: true, // <-- Default value is false
							    btnOKLabel: 'Rename!', // <-- Default value is 'OK',
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

					// Invoked when the add property button is clicked in this type.
					var m_functionAddPropertyClick = function (e) {

						try {

							// Add a new, empty member.
							self.data.properties.push({ 

								name: "new property", 
								workspace: "", 
								method: "" 
							});

							// Add the contents to the newly allocated type.
							var exceptionRet = m_functionGenerateTypeContents();
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Add the property to code too.
							exceptionRet = code.addProperty(self, 
								self.data.properties[self.data.properties.length - 1]);
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

							/* Get the type clicked.
							var jPropertyClicked = $(this);

							// Call unified click handler.
							var exceptionRet = m_functionSelect(self.data.properties,
								jPropertyClicked);
							if (exceptionRet) {

								throw exceptionRet;
							}
							*/
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

							self.data.methods.push({ name: "new method", codeDOM: "" });

							// Add the contents to the newly allocated type.
							var exceptionRet = m_functionGenerateTypeContents();
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
