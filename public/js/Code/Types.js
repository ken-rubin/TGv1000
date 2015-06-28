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
							$("#TWimageSearchLink").click(m_functionClickTWimageSearchLink);
							$("#TWnewImageURLLink").click(m_functionClickTWnewImageURLLink);
							$("#TWnewImageDiskLink").click(m_functionClickTWnewImageDiskLink);
							$("#TWdeleteTypeBtn").click(m_functionClickTWdeleteTypeLink);
							$("#TWnewTypeBtn").click(m_functionClickTWnewTypeLink);
							$("#TWsearchTypeBtn").click(m_functionClickTWsearchTypeLink);
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

						        // Add the type.
								exceptionRet = self.addItem(clType);
								if (exceptionRet) {

									throw exceptionRet;
								}

						        // Also add to the designer/tool strip.
								exceptionRet = tools.addItem(clType,
									true);								// This parameter is used only here, when a project is opened or created or a comic is changed.
																		// It disables scrolling the toolstrip so that the item being added can be seen, thus
																		// starting off with the isApp type/tool at the top of the toolstrip.
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Automatically allocate the first type.
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

					// Add Type to strip.
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

							return null;

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
					self.isReferencedInWorkspace = function (strTest) {

						// Loop over the collection of types.
						for (var i = 0; i < m_arrayClTypes.length; i++) {

							var typeIth = m_arrayClTypes[i];

							// Get the method which references the string, if any.
							var methodReferenced = typeIth.isReferencedInWorkspace(strTest);
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

					// Remove item from DOM and state.
					self.removeItem = function (type) {

						try {

							// Remove the type from the collection of types.
							for (var i = 0; i < m_arrayClTypes.length; i++) {

								// Splice on match.
								if (m_arrayClTypes[i] === type) {

									m_arrayClTypes.splice(i, 1);
									break;
								}
							}

							// Remove form GUI.
							var exceptionRet = type.destroy();
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Remove from tools.
							return tools.removeItem(type);

						} catch (e) {

							return e;
						}
					};

					// Unload.
					self.unload = function () {

						try {

							for (var i = 0; i < m_arrayClTypes.length; i++) {

								var itemIth = m_arrayClTypes[i];
								var exceptionRet = self.removeItem(itemIth);
							}

							// m_srTypeStrip.empty();
							m_arrayClTypes = [];

							return null;

						} catch (e) {

							return e;
						}
					}

					self.getLength = function () {

						return m_arrayClTypes.length;
					}

					// Update the blockly data in the active type/method.
					self.update = function (strWorkspace, strMethod) {

						try {

							// Drop out if no active item.
							if (!m_clTypeActive) {

								return null;
							}

							// Else, update the type.
							return m_clTypeActive.update(strWorkspace,
								strMethod);

						} catch (e) {

							return e;
						}
					};

					// Image has been changed. Update it in the TypeWell.
					self.updateActiveTypeImage = function() {

						try {

							// Note: the images have already been changed on the designer surface if any were there and in toolstrip.

							var strUrl = resourceHelper.toURL('resources', m_clTypeActive.data.imageResourceId, 'image', '');
							
							// Update the image in the TypeWell
							$("#TWimage").attr("src", strUrl);

							return null;

						} catch(e) {

							return e;
						}
					}

					// For delete confirmation or renaming or editing.
					self.getActiveClType = function () {

						return m_clTypeActive;
					}

					///////////////////////////////////
					// Private methods.

					// Invoked when a type is activated, thus causing its representatrion in the type well for maintenance by the user.
					var m_functionSetUpTheWell = function() {

						try {

							if (m_clTypeActive) {	// There will actually always be an active type.

								$("#TWtypeName").text(m_clTypeActive.data.name);
								$("#TWimage").attr("src", resourceHelper.toURL('resources', m_clTypeActive.data.imageResourceId, 'image', ''));

								if (m_clTypeActive.data.isApp) {

									$("#TWdeleteTypeBtn").prop("disabled", true);

								} else {

									$("#TWdeleteTypeBtn").prop("disabled", false);
								}

								var strBuild;
								// Methods
								$("#TWmethodsTbody").empty();
								for (var i = 0; i < m_clTypeActive.data.methods.length; i++) {

									var m = m_clTypeActive.data.methods[i];
									if (m.name === 'initialize') {
										strBuild = '<tr><td class="col-xs-10"><button class="button-as-link" id="method_' + i + '" href="#">' + m.name + '</button></td><td class="col-xs-1"></td><td class="col-xs-1"></td></tr>';
										$("#TWmethodsTbody").append(strBuild);
										$("#method_" + i).click(m_functionMethodClicked);
									} else {
										strBuild = '<tr><td class="col-xs-10;"><button class="button-as-link" id="method_' + i + '" href="#">' + m.name + '</button></td><td class="col-xs-1"><button class="edit-button" data-toggle="tooltip" title="Rename this Method" id="methodrename_' + i + '" /></td><td class="col-xs-1"><button class="delete-button" data-toggle="tooltip" title="Delete this Method" id="methoddelete_' + i + '" /></td></tr>';
										$("#TWmethodsTbody").append(strBuild);
										$("#method_" + i).click(m_functionMethodClicked);
										$("#methodrename_" + i).click(m_functionMethodRenameClicked);
										$("#methoddelete_" + i).click(m_functionMethodDeleteClicked);
									}
								};

								// Properties
								$("#TWpropertiesTbody").empty();
								for (var i = 0; i < m_clTypeActive.data.properties.length; i++) {

									var m = m_clTypeActive.data.properties[i];
									strBuild = '<tr><td class="col-xs-10">' + m.name + '</td><td class="col-xs-1"><button class="edit-button" data-toggle="tooltip" title="Edit this Property" id="propertyedit_' + i + '" /></td><td class="col-xs-1"><button class="delete-button" data-toggle="tooltip" title="Delete this Property" id="propertydelete_' + i + '" /></td></tr>';
									$("#TWpropertiesTbody").append(strBuild);
									$("#propertyedit_" + i).click(m_functionPropertyEditClicked);
									$("#propertydelete_" + i).click(m_functionPropertyDeleteClicked);
								};

								// Events
								$("#TWeventsTbody").empty();
								for (var i = 0; i < m_clTypeActive.data.events.length; i++) {

									var m = m_clTypeActive.data.events[i];
									strBuild = '<tr><td class="col-xs-10">' + m.name + '</td><td class="col-xs-1"><button class="edit-button" data-toggle="tooltip" title="Rename this Event" id="eventrename_' + i + '" /></td><td class="col-xs-1"><button class="delete-button" data-toggle="tooltip" title="Delete this Event" id="eventdelete_' + i + '" /></td></tr>';
									$("#TWeventsTbody").append(strBuild);
									$("#eventrename_" + i).click(m_functionEventRenameClicked);
									$("#eventdelete_" + i).click(m_functionEventDeleteClicked);
								};
							}

							$("#TypeWell .edit-button").tooltip();
							$("#TypeWell .delete-button").tooltip();
							// var jqTWimage = $("#TWimage");
							// jqTWimage.data("tooltip", false);
							// jqTWimage.tooltip({title: m_clTypeActive.data.name});
							// jqTWimage.tooltip();

							return null;

						} catch(e) {

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

							var index = m_functionParseOutIndex(e);

							var exceptionRet = code.load(m_clTypeActive, m_clTypeActive.data.methods[index], m_clTypeActive.data.methods[index].workspace);
							if (exceptionRet) {

								throw exceptionRet;
							}

						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionMethodRenameClicked = function(e) {
						
						try {

							var index = m_functionParseOutIndex(e);

							var exceptionRet = client.showGenericRenameDialog('method', index);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionMethodDeleteClicked = function(e) {
						
						try {

							var index = m_functionParseOutIndex(e);

							var exceptionRet = client.showDeleteConfirmDialog('method', index);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionPropertyEditClicked = function(e) {
						
						try {

							var index = m_functionParseOutIndex(e);

							var exceptionRet = client.showEditPropertyDialog(index);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionPropertyDeleteClicked = function(e) {
						
						try {

							var index = m_functionParseOutIndex(e);

							var exceptionRet = client.showDeleteConfirmDialog('property', index);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionEventRenameClicked = function(e) {
						
						try {

							var index = m_functionParseOutIndex(e);

							var exceptionRet = client.showGenericRenameDialog('event', index);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionEventDeleteClicked = function(e) {
						
						try {

							var index = m_functionParseOutIndex(e);

							var exceptionRet = client.showDeleteConfirmDialog('event', index);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionClickTWimageSearchLink = function () {

						try {

							var exceptionRet = m_clTypeActive.imageSearch();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionClickTWnewImageURLLink = function () {

						try {

							var exceptionRet = m_clTypeActive.imageFromURL();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionClickTWnewImageDiskLink = function () {

						try {

							var exceptionRet = m_clTypeActive.imageFromDisk();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionClickTWdeleteTypeLink = function () {

						try {

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

							var exceptionRet = client.showNewTypeDialog();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionClickTWsearchTypeLink = function () {

						try {

							var exceptionRet = client.showTypeSearchDialog(function(iTypeId) {

								if (iTypeId > 0) {

									exceptionRet = client.addTypeToProjectFromDB(iTypeId);

									if (exceptionRet) {

										throw exceptionRet;
									}
								} else {

									throw new Error("Invalid project id returned.")
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

							var exceptionRet = client.showNewEventDialog();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					// Invoked when the types dialog exist newly.
					// var m_functionNewType = function () {

					// 	try {

				 //    		// Allocate project.
				 //    		var clType = new Type();
				 //    		var exceptionRet = clType.load({ 

	    // 						properties: [],
	    // 						methods: [],
	    // 						events: [],
	    // 						dependencies: [],
	    // 						name: "new type",
	    // 						id: m_arrayClTypes.length + 1,
	    // 						resourceId: 0
				 //    		});
				 //    		if (exceptionRet) {

				 //    			return exceptionRet;
				 //    		}

				 //    		// Add the type.
					// 		exceptionRet = self.addItem(clType);
					// 		if (exceptionRet) {

					// 			throw exceptionRet;
					// 		}

					//         // Also add to the designer/tool strip.
					// 		exceptionRet = tools.addItem(clType);
					// 		if (exceptionRet) {

					// 			throw exceptionRet;
					// 		}
					// 	} catch (e) {

					// 		return e;
					// 	}
					// };

					// Invoked when the types dialog exist clonely.
					// var m_functionCloneType = function (strId) {

					// 	try {

				 //    		BootstrapDialog.alert(":Clone " + strId + " type....");

					// 		return null;
					// 	} catch (e) {

					// 		return e;
					// 	}
					// };

					// Create a new type.
					// var m_functionAddNewType = function (e) {

					// 	try {

					// 		// Show the types dialog.
					// 		var exceptionRet = client.showTypesDialog(m_functionNewType,
					// 			m_functionCloneType);
					// 		if (exceptionRet) {

					// 			throw exceptionRet;
					// 		}
					// 	} catch (e) {

					// 		errorHelper.show(e);
					// 	}
					// };

					// Create the add button.
					// var m_functionCreateAddButton = function () {

					// 	try {

					// 		var jAdd = $("<img class='typestripitem' id='AddType' src='" +
					// 			resourceHelper.toURL('images', null, null, 'plus.png') +
					// 			"'></img>");

					// 		// Add to the DOM.
					// 		m_jStrip.append(jAdd);

					// 		jAdd.click(m_functionAddNewType);

					// 		return null;
					// 	} catch (e) {

					// 		return e;
					// 	}
					// };

					///////////////////////////////////
					// Private fields.

					// The container for the strip items.
					var m_arrayClTypes = [];
					// Active item.
					var m_clTypeActive = null;
					var m_ActiveTypeIndex = -1;

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