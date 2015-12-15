/////////////////////////////////////////
// Types
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Code/Type", "Core/ScrollRegion", "Core/resourceHelper"],
	function (errorHelper, Type, ScrollRegion, resourceHelper) {

		try {

			// Define Types constructor function. 
			var functionConstructor = function Types() {

				try {

					var self = this;			// Uber closure.

					///////////////////////////////////
					// Public methods.

					// Create the Type strip.
					// Attach to specified element.
					self.create = function () {

						try {

							// Add click handlers for TypeWell.
							$("#TWdeleteTypeBtn").click(m_functionClickTWdeleteTypeLink);
							$("#TWnewTypeBtn").click(m_functionClickTWnewTypeLink);
							$("#TWsearchTypeBtn").click(m_functionClickTWsearchTypeLink);
							$("#TWEditTypeLink").click(m_functionClickTWeditTypeLink);
							$("#TWaddMethodBtn").click(m_functionClickTWnewMethod);
							$("#TWsearchMethodBtn").click(m_functionClickTWsearchMethod);
							$("#TWaddPropertyBtn").click(m_functionClickTWnewProperty);
							$("#TWaddEventBtn").click(m_functionClickTWnewEvent);

						} catch (e) {

							return e;
						}
					};

					// Load the Type strip item collection.
					self.load = function (activeComicTypes) {

						try {

							// First destroy typestrip.
							tools.empty();

							// And the collection.
							m_arrayClTypes = [];

							// Loop over items and insert into the DOM.
							for (var i = 0; i < activeComicTypes.items.length; i++) {

								// Extract the item (type).
								var itemIth = activeComicTypes.items[i];

								// Allocate the type object which holds/wrapps the data.
								var clType = new Type();
								exceptionRet = clType.load(itemIth);
								if (exceptionRet) {

									throw exceptionRet;
								}

								if (clType.data.isApp) {

									g_clTypeApp = clType;	// So the App Type is always available globally.
								}

						        // Add the type.
								exceptionRet = self.addItem(clType);
								if (exceptionRet) {

									throw exceptionRet;
								}

						        // Also add to the designer/tool strip.
								exceptionRet = tools.addItem(clType,
									i,									// passing along what amounts to the ordinal so async position in the scroll region can be forced.
									true);								// This parameter is used only here, when a project is opened or created or a comic is changed.
																		// It disables scrolling the toolstrip so that the item being added can be seen, thus
																		// starting off with the isApp type/tool at the top of the toolstrip.
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Automatically activate the first type (the App type).
							if (m_arrayClTypes.length > 0) {

								// Following will activate the 0th type and set it up for maintenance in the type well.
								var exceptionRet = m_arrayClTypes[0].activate();
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							return null;

						} catch (e) {

							return e;
						}
					};

					// Add Type to array of types.
					self.addItem = function (clType) {

						try {

							// Add to the collection of types.
							m_arrayClTypes.push(clType);

							// Also add to code.
							return code.addType(clType);
							
						} catch (e) {

							return e;
						}
					};

					// Add Type to strip.
					self.getType = function (strType) {

						if (strType === "App") {

							return g_clTypeApp;
						}

						// Loop over types.
						for (var i = 0; i < m_arrayClTypes.length; i++) {

							var typeIth = m_arrayClTypes[i];

							// Look by name.
							if (typeIth.data.name === strType) {

								return typeIth;
							}
						}

						// Failed.
						return null;							
					};

					// Add Type to strip.
					self.getTypeByIndex = function (index) {

						if (index > -1 && index < m_arrayClTypes.length) {

							return m_arrayClTypes[index];
						}

						// Failed.
						return null;							
					};

					// Return true if the app's initialize is active.
					self.isAppInitializeActive = function () {

						if (!m_clTypeActive ||
							m_iActiveMethodIndex === -1) {

							return false;
						}

						if (!m_clTypeActive.data.isApp) {

							return false;
						}

						return (m_clTypeActive.data.methods[m_iActiveMethodIndex].name === "initialize");
					};

					// Cause the code to reload the current type.
					self.reloadActiveMethod = function () {

						try {

							client.projectIsDirty();

							if (!m_clTypeActive ||
								m_iActiveMethodIndex === -1) {

								return null;
							}

							return code.load(m_clTypeActive.data.methods[m_iActiveMethodIndex].workspace);

						} catch (e) {

							return e;
						}
					};

					// Specify the active type.  Called from 
					// a type when its image is clicked in the tool strip.
					self.select = function (clType) {

						try {

							m_clTypeActive = clType;
							for (var i = 0; i < m_arrayClTypes.length; i++) {

								if (m_arrayClTypes[i].data.name === clType.data.name) {

									m_ActiveTypeIndex = i;
									break;
								}
							}

							// Scroll toolstrip so this one is visible.
							// Only times it wouldn't be (since we most likely just clicked on it or the top one-app-was selected at project load) are:
							// (1) when a new Type was added and activated/selected;
							// (2) if a Type is deleted, depending on which type we then select. If app, then we might have to scroll. If next one down, we're probably good.
							// The following doesn't work in case (1), since the image load/add to toolstrip is async, so it fails to find it.
							// But we'll keep the call here AND do it in the ScrollRegion load handler, too.
							var exceptionRet = tools.functionMakeSureToolIsVisible(clType);
							if (exceptionRet) { return exceptionRet; }

							exceptionRet = m_functionSetUpTheWell();
							if (exceptionRet) { return exceptionRet; }

							exceptionRet = self.functionSetActiveMethodIndex(m_clTypeActive.data.methods.length === 0 ? -1 : 0);
							if (exceptionRet) { return exceptionRet; }

							if (m_iActiveMethodIndex > -1) {

								// Set the code pane by clicking on the first method.
								$("#method_0").click();
							}
						} catch (e) {

							return e;
						}
					};

					// Mousedown event handler calls this from toolstrip.
					self.handleMouseDOwnOnToolStrip = function(strId) {

						var parts = strId.split('-');
						if (parts.length === 2) {

							for (var i = 0; i < m_arrayClTypes.length; i++) {

								var clTypeIth = m_arrayClTypes[i];
								if (parts[1] === client.removeSpaces(clTypeIth.data.name)) {

									self.select(clTypeIth);
									break;
								}
							}
						}
					}

					// Loop over all Types, indicate if the specified
					// string is found in any of their workspaces.
					// Returns the method referenced or null.
//used					
					self.isReferencedInWorkspace = function (strTest) {

						// Loop over the collection of types.
						for (var i = 0; i < m_arrayClTypes.length; i++) {

							var clTypeIth = m_arrayClTypes[i];

							// Get the method which references the string, if any.
							var methodReferenced = clTypeIth.isReferencedInWorkspace(strTest);
							if (methodReferenced) {

								return methodReferenced;
							}
						}

						return null;
					};

					// Loop over all Types, update any occurrences  
					// of the specified unique proper string.
					self.replaceInWorkspaces = function (strOld, strNew) {

						try {

							client.projectIsDirty();

							// Loop over the collection of types.
							for (var i = 0; i < m_arrayClTypes.length; i++) {

								var typeIth = m_arrayClTypes[i];

								// Get the method which references the string, if any.
								var exceptionRet = typeIth.replaceInWorkspaces(strOld, 
									strNew);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Unload.
//used					
					self.unload = function () {

						try {

							for (var i = 0; i < m_arrayClTypes.length; i++) {

								var itemIth = m_arrayClTypes[i];
								var exceptionRet = m_functionRemoveItem(itemIth);
							}

							m_arrayClTypes = [];
							m_functionEmptyTheWell();

							return null;

						} catch (e) {

							return e;
						}
					}

					self.getLength = function () {

						return m_arrayClTypes.length;
					}

					// Update the blockly data in the active type/method.
					self.update = function (strWorkspace) {

						try {

							// Drop out if no active item.
							if (!m_clTypeActive) {

								return null;
							}

							client.projectIsDirty();

							// Else, update the type.
							return m_clTypeActive.update(strWorkspace);

						} catch (e) {

							return e;
						}
					};

					// Image has been changed. Update it in the TypeWell.
					self.updateActiveTypeImage = function() {

						try {

							// Note: the images have already been changed on the designer surface if any were there and in toolstrip.

							client.projectIsDirty();

							var strUrl = m_clTypeActive.data.altImagePath.length ? m_clTypeActive.data.altImagePath : resourceHelper.toURL('resources', m_clTypeActive.data.imageId, 'image', '');
							
							// Update the image in the TypeWell
							$("#TWimage").attr("src", strUrl);

							return null;

						} catch(e) {

							return e;
						}
					}

					// For delete confirmation or renaming or editing.
					self.getActiveClType = function (bDeleting) {

						// Make a reference copy of the current active type to return from this function.
						// If we're deleting, we'll make a non-referential copy, since we're about to reset to a new active.
						var clType = m_clTypeActive;

						// bDeleting means we're retrieving for purpose of deleting the active type. A new active type must be chosen.
						if (bDeleting) {

							// Make a true copy of the current active type, divorcing it, since we're about to reset it.
							clType = JSON.parse(JSON.stringify(m_clTypeActive));

							// The isApp type can never be deleted. 
							// We will either make the type with the same index the new active type or,
							// if the one being deleted was the last one, we'll go up one.
							for (var i = 0; i < m_arrayClTypes.length; i++)	{

								if (m_arrayClTypes[i].data.name === m_clTypeActive.data.name) {

									if (i === m_arrayClTypes.length - 1) {

										// Last one in the array.
										self.select(m_arrayClTypes[i - 1]);

									} else {

										self.select(m_arrayClTypes[i + 1]);
									}

									m_arrayClTypes.splice(i, 1);
								}
							}
						}

						// Return our former active type for removal from everything.
						return clType;
					}

					// Called by client after confirmation by user.
//used
					self.deleteMethod = function (index) {

						try {

							client.projectIsDirty();

							var method = m_clTypeActive.data.methods[index];

							var exceptionRet = code.removeMethod(m_clTypeActive, method);
							if (exceptionRet) { return exceptionRet; }

							m_clTypeActive.data.methods.splice(index, 1);

							exceptionRet = m_functionRegenTWMethodsTable();
							if (exceptionRet) { return exceptionRet; }

							var newMethodIndex = -1;
							var lastMethodIndexNow = m_clTypeActive.data.methods.length - 1;
							if (lastMethodIndexNow === -1) {

								// User deleted the only method.
								// Clear the code pane.
								exceptionRet = code.reset(false);	// Force complete reset.
								if (exceptionRet) { throw exceptionRet; }

								return null;

							} else if (lastMethodIndexNow >= index) {

								// User deleted a method in the middle.
								// Keep methods[index] as the active one and fill the code pane.
								newMethodIndex = index;

							} else {

								// User deleted the last method in the methods table.
								// Make new last method the active one and fill the code pane.
								newMethodIndex = lastMethodIndexNow;
							}

							$("#method_" + newMethodIndex.toString()).click();

							return null;
						
						} catch (e) {

							return e;
						}
					}

					// Called by client after confirmation by user.
//used
					self.deleteProperty = function (index) {

						try {

							client.projectIsDirty();

							var property = m_clTypeActive.data.properties[index];
							var exceptionRet = code.removeProperty(m_clTypeActive, property);
							if (exceptionRet) { return exceptionRet; }

							m_clTypeActive.data.properties.splice(index, 1);

							return m_functionRegenTWPropertiesTable();
						
						} catch (e) {

							return e;
						}
					}

					// Called by client after confirmation by user.
//used
					self.deleteEvent = function (index) {

						try {

							client.projectIsDirty();

							var event = m_clTypeActive.data.events[index];
							var exceptionRet = code.removeEvent(m_clTypeActive, event);
							if (exceptionRet) { return exceptionRet; }

							m_clTypeActive.data.events.splice(index, 1);

							return m_functionRegenTWEventsTable();
						
						} catch (e) {

							return e;
						}
					}

					// Called by client after adding.
//used
					self.regenTWMethodsTable = function () {

						try {

							client.projectIsDirty();

							return m_functionRegenTWMethodsTable();

						} catch (e) {

							return e;
						}
					}

					// Called by client after adding.
//used
					self.regenTWPropertiesTable = function () {

						try {

							client.projectIsDirty();

							return m_functionRegenTWPropertiesTable();

						} catch (e) {

							return e;
						}
					}

					// Called by client after adding.
//used
					self.regenTWEventsTable = function () {

						try {

							client.projectIsDirty();

							return m_functionRegenTWEventsTable();

						} catch (e) {

							return e;
						}
					}

					// Called when a method is activated or deactivated, such as by:
					//  selecting a new Type, clicking on a mthod, adding a method, renaming a method, deleting a method.
					self.functionSetActiveMethodIndex = function(index) {

						m_iActiveMethodIndex = index;

						return m_functionSetTypewellHeader();
					}

//used
					self.changeTypeWellHeader = function () {

						try {

							return m_functionSetTypewellHeader();

						} catch(e) {

							return e;
						}
					}

					///////////////////////////////////
					// Private methods.

					// Remove item from DOM and state.
//used					
					var m_functionRemoveItem = function (clType) {

						try {

							client.projectIsDirty();

							// Remove the type from the collection of types.
							for (var i = 0; i < m_arrayClTypes.length; i++) {

								// Splice on match.
								if (m_arrayClTypes[i] === clType) {

									m_arrayClTypes.splice(i, 1);
									break;
								}
							}

							// Remove form GUI.
							var exceptionRet = clType.destroy();
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Remove from tools.
							return tools.removeItem(clType);

						} catch (e) {

							return e;
						}
					};

					var m_functionEmptyTheWell = function() {

						m_functionSetTypewellHeader();
						$("#TWimage").attr("src","");
						$(".disabledifnoproj").prop("disabled", true);
						$("#TWmethodsTbody").empty();
						$("#TWpropertiesTbody").empty();
						$("#TWeventsTbody").empty();
					}

					// Invoked when a type is activated, thus causing its representatrion in the type well for maintenance by the user.
					var m_functionSetUpTheWell = function() {

						try {

							m_functionSetTypewellHeader();
							$("#TWimage").attr("src", m_clTypeActive.data.altImagePath.length ? m_clTypeActive.data.altImagePath : resourceHelper.toURL('resources', m_clTypeActive.data.imageId, 'image', ''));

							// App type and system types cannot be deleted.
							if (m_clTypeActive.data.isApp || m_clTypeActive.data.ordinal === 10000) {

								$("#TWdeleteTypeBtn").prop("disabled", true);

							} else {

								$("#TWdeleteTypeBtn").prop("disabled", false);
							}

							// System types cannot be editing, but all other types can be.
							if (m_clTypeActive.data.ordinal === 10000) {

								$("#TWEditTypeLink").prop("disabled", true);

							} else {

								$("#TWEditTypeLink").prop("disabled", false);
							}

							// There will be other TW buttons that are disabled or enabled based on type of the active Type.
							// TBD.

							var exceptionRet = m_functionRegenTWMethodsTable();
							if (exceptionRet) { return exceptionRet; }

							exceptionRet = m_functionRegenTWPropertiesTable();
							if (exceptionRet) { return exceptionRet; }

							exceptionRet = m_functionRegenTWEventsTable();
							if (exceptionRet) { return exceptionRet; }

							// And clear out the code frame.
							try {

								code.reset(false);	// Force partial reset. Do not reset schema data.
							
							} catch(e) {}
							
							return null;

						} catch(e) {

							return e;
						}
					}

					// Called if Type is renamed.
//used
					var m_functionSetTypewellHeader = function () {

						try {

							client.projectIsDirty();

							if (m_clTypeActive) {

								$("#TWtypeName").text(m_clTypeActive.data.name);
								$("#TWmethodName").text(m_iActiveMethodIndex === -1 ? "n/a" : m_clTypeActive.data.methods[m_iActiveMethodIndex].name);

							} else {

								$("#TWtypeName").text('');
								$("#TWmethodName").text('');
							}

							return null;
						
						} catch(e) {

							return e;
						}
					}

//used
					var m_functionRegenTWMethodsTable = function () {

						try {

							var strBuild = '<div class="TWParent">';
							for (var i = 0; i < m_clTypeActive.data.methods.length; i++) {

								var m = m_clTypeActive.data.methods[i];
								if (m.name === 'initialize' || m.name === 'construct') {
									// These two don't get delete, rename.

									strBuild += '<div class="TWChild">' +
													'<div class="TWMethCol1">' + 
														'<img class="TWMethCol1Image" src="' + 
															resourceHelper.toURL("images",null,null,m.name === "initialize" ? "initialize.png" : "construct.png") + 
															'">'+
														'</img>'+
													'</div>' +
													'<div class="TWMethCol2">'+
														'<button class="button-as-link" id="method_' + 
															i + 
															'" href="#">' + 
															m.name + 
														'</button>'+
													'</div>'+
													'<div class="TWMethCol3">'+
													'</div>'+
													'<div class="TWMethCol4">'+
													'</div>'+
												'</div>';
								} else {

									strBuild += '<div class="TWChild" >' +
													'<div class="TWMethCol1">'+
														'<img class="TWMethCol1Image" src="' + 
															resourceHelper.toURL("resources",m.imageId,'image') + 
															'">'+
														'</img>'+
													'</div>'+
													'<div class="TWMethCol2">'+
														'<button class="button-as-link" id="method_' + 
															i + 
															'" href="#">' + 
															m.name + 
														'</button>'+
													'</div>'+
													'<div class="TWMethCol3">'+
														'<button class="btn btn-default" type="button" title="Edit this Method" id="methodrename_' + 
															i + 
															'">'+
															'<span class="glyphicon glyphicon-pencil" aria-hidden="true">'+
															'</span>'+
														'</button>'+
													'</div>'+
													'<div class="TWMethCol4">'+
														'<button class="btn btn-default" type="button" title="Delete this Method" id="methoddelete_' + 
															i + 
															'">'+
															'<span class="glyphicon glyphicon-trash" aria-hidden="true">'+
															'</span>'+
														'</button>'+
													'</div>'+
												'</div>';
								}
							};
							strBuild += '</div>';

							$("#TWmethodsTbody").empty();
							$("#TWmethodsTbody").append(strBuild);

							for (var i = 0; i < m_clTypeActive.data.methods.length; i++) {

								if (m.name === 'initialize' || m.name === 'construct') {
									$("#method_" + i).click(m_functionMethodClicked);
								} else {
									$("#method_" + i).click(m_functionMethodClicked);
									$("#methodrename_" + i).click(m_functionMethodEditClicked);
									$("#methoddelete_" + i).click(m_functionMethodDeleteClicked);
								}
							}
							$("#TWmethodsTbody .btn-default").powerTip({
								smartPlacement: true
							});

							return null;

						} catch (e) { 

							return e; 
						}
					}

//used
					var m_functionRegenTWPropertiesTable = function () {

						try {

							var strBuild = '<div class="TWParent">';
							for (var i = 0; i < m_clTypeActive.data.properties.length; i++) {

								var m = m_clTypeActive.data.properties[i];
								if (!m.isHidden) {

									strBuild += '<div class="TWChild">'+
													'<div class="TWPropCol1">' + 
														m.name + 
													'</div>'+
													'<div class="TWPropCol2">'+
														'<button class="btn btn-default" type="button" title="Edit this Property" id="propertyedit_' + 
															i + 
															'">'+
															'<span class="glyphicon glyphicon-pencil" aria-hidden="true">'+
															'</span>'+
														'</button>'+
													'</div>'+
													'<div class="TWPropCol3">'+
														'<button class="btn btn-default" type="button" title="Delete this Property" id="propertydelete_' + 
															i + 
															'">'+
															'<span class="glyphicon glyphicon-trash" aria-hidden="true">'+
															'</span>'+
														'</button>'+
													'</div>'+
												'</div>';
								};
							};
							strBuild += '</div>';

							$("#TWpropertiesTbody").empty();
							$("#TWpropertiesTbody").append(strBuild);

							for (var i = 0; i < m_clTypeActive.data.properties.length; i++) {
								$("#propertyedit_" + i).click(m_functionPropertyEditClicked);
								$("#propertydelete_" + i).click(m_functionPropertyDeleteClicked);
							}
							$("#TWpropertiesTbody .btn-default").powerTip({
								smartPlacement: true
							});

							return null;

						} catch (e) { 

							return e; 
						}
					}

//used
					var m_functionRegenTWEventsTable = function () {

						try {

							var strBuild = '<div class="TWParent">';
							for (var i = 0; i < m_clTypeActive.data.events.length; i++) {

								var m = m_clTypeActive.data.events[i];
								strBuild += '<div class="TWChild">'+
									'<div class="TWEvtCol1">' + 
										m.name + 
									'</div>'+
									'<div class="TWEvtCol2">'+
										'<button class="btn btn-default" type="button" title="Rename this Event" id="eventrename_' + 
											i + 
											'">'+
											'<span class="glyphicon glyphicon-pencil" aria-hidden="true">'+
											'</span>'+
										'</button>'+
									'</div>'+
									'<div class="TWEvtCol3">'+
										'<button class="btn btn-default" type="button" title="Delete this Event" id="eventdelete_' + i + '">'+
											'<span class="glyphicon glyphicon-trash" aria-hidden="true">'+
											'</span>'+
										'</button>'+
									'</div>'+
								'</div>';
							};
							strBuild += '</div>';

							$("#TWeventsTbody").empty();
							$("#TWeventsTbody").append(strBuild);

							for (var i = 0; i < m_clTypeActive.data.events.length; i++) {
								$("#eventrename_" + i).click(m_functionEventRenameClicked);
								$("#eventdelete_" + i).click(m_functionEventDeleteClicked);
							}
							$("#TWeventsTbody .btn-default").powerTip({
								smartPlacement: true
							});
							return null;

						} catch (e) { 

							return e; 
						}
					}

					// TypeWell click handlers and helpers
					var m_functionParseOutIndex = function (event) {

						try {

							return parseInt(event.currentTarget.id.split('_')[1], 10);

						} catch (e) {

							throw e;
						}
					}

					var m_functionMethodClicked = function(e) {

						try {

							client.projectIsDirty();

							var index = m_functionParseOutIndex(e);

							// Save the active method.
							self.functionSetActiveMethodIndex(index);

							var exceptionRet = m_clTypeActive.setActive(index, m_clTypeActive.data.methods);
							if (exceptionRet) { throw exceptionRet; }

							exceptionRet = code.load(m_clTypeActive.data.methods[m_iActiveMethodIndex].workspace);
							if (exceptionRet) { throw exceptionRet; }

						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionEventRenameClicked = function(e) {
						
						try {

							client.projectIsDirty();

							var index = m_functionParseOutIndex(e);

							var exceptionRet = client.showGenericRenameDialog('event', index);
							if (exceptionRet) { throw exceptionRet; }
							
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionMethodEditClicked = function(e) {
						
						try {

							client.projectIsDirty();

							var index = m_functionParseOutIndex(e);

							var exceptionRet = client.showEditMethodDialog(index);
							if (exceptionRet) { throw exceptionRet; }
							
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionMethodDeleteClicked = function(e) {
						
						try {

							client.projectIsDirty();

							var index = m_functionParseOutIndex(e);

							var exceptionRet = client.showDeleteConfirmDialog('method', index);
							if (exceptionRet) { throw exceptionRet; }
							
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionPropertyEditClicked = function(e) {
						
						try {

							client.projectIsDirty();

							var index = m_functionParseOutIndex(e);

							var exceptionRet = client.showEditPropertyDialog(index);
							if (exceptionRet) { throw exceptionRet; }
							
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionPropertyDeleteClicked = function(e) {
						
						try {

							client.projectIsDirty();

							var index = m_functionParseOutIndex(e);

							var exceptionRet = client.showDeleteConfirmDialog('property', index);
							if (exceptionRet) { throw exceptionRet; }
							
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionEventDeleteClicked = function(e) {
						
						try {

							client.projectIsDirty();

							var index = m_functionParseOutIndex(e);

							var exceptionRet = client.showDeleteConfirmDialog('event', index);
							if (exceptionRet) { throw exceptionRet; }
							
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionClickTWdeleteTypeLink = function () {

						try {

							// If this type is a base type for any other type in this comic,
							// user cannot delete.
							var activeClComic = comics.getActiveComic();
							var typeArray = activeClComic.getYourTypesArray();
							var activeTypeId = m_clTypeActive.data.id;
							var arrDerivedTypes = [];
							for (var i = 0; i < typeArray.length; i++) {

								var typeIth = typeArray[i];
								if (typeIth.baseTypeId === activeTypeId) {
									arrDerivedTypes.push(typeIth.name);
								}
							}
							if (arrDerivedTypes.length){
								errorHelper.show("The type " + m_clTypeActive.data.name + " is a base type for these other types: " + arrDerivedTypes.join(', ') + " and may not be deleted.");
								return;
							}

							client.projectIsDirty();

							var exceptionRet = client.showDeleteConfirmDialog('type', -1);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}
					
					var m_functionClickTWnewTypeLink = function () {

						try {

							client.projectIsDirty();

							var exceptionRet = client.showNewTypeDialog();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionClickTWeditTypeLink = function () {

						try {

							client.projectIsDirty();

							var exceptionRet = client.showEditTypeDialog(m_ActiveTypeIndex);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionClickTWsearchTypeLink = function () {

						try {

							client.projectIsDirty();

							var exceptionRet = client.showTypeSearchDialog(function(iTypeId) {

								if (iTypeId > 0) {

									exceptionRet = client.addTypeToProjectFromDB(iTypeId);

									if (exceptionRet) {

										throw exceptionRet;
									}
								} else {

									throw new Error("Invalid type id returned.")
								}
							});
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionClickTWnewMethod = function () {

						try {

							client.projectIsDirty();

							var exceptionRet = client.showNewMethodDialog();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionClickTWsearchMethod = function () {

						try {

							client.projectIsDirty();

							var exceptionRet = client.showMethodSearchDialog(function(iMethodId) {

								if (iMethodId > 0) {

									exceptionRet = client.addMethodToTypeFromDB(iMethodId);

									if (exceptionRet) {

										throw exceptionRet;
									}
								} else {

									throw new Error("Invalid method id returned.")
								}
							});
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionClickTWnewProperty = function () {

						try {

							client.projectIsDirty();

							var exceptionRet = client.showNewPropertyDialog();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionClickTWnewEvent = function () {

						try {

							client.projectIsDirty();

							var exceptionRet = client.showNewEventDialog();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					///////////////////////////////////
					// Private fields.

					// The container for the strip items.
					var m_arrayClTypes = [];
					// Active item.
					var m_clTypeActive = null;
					var m_ActiveTypeIndex = -1;
					var m_iActiveMethodIndex = -1;

				} catch (e) {

					errorHelper.show(e);
				}
			};

			// Return the constructor function.
			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
