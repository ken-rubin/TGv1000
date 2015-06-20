/////////////////////////////////////////
// Types
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Code/Type", "Core/ScrollRegion2", "Core/resourceHelper"],
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
								exceptionRet = tools.addItem(clType);
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

							var exceptionRet = m_functionSetUpTheWell();
							if (exceptionRet) {

								return exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					};

					// Mousedown event handler calls this from toolstrip.
					self.handleMouseDOwnOnToolStrip = function(strId) {

						var parts = strId.split('-');
						if (parts.length === 2) {

							m_arrayClTypes.some(function(clType) {

								if (parts[1] === client.removeSpaces(clType.data.name)) {

									self.select(clType);
									return true;
								}
							});
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

					///////////////////////////////////
					// Private methods.

					// Invoked when a type is activated, thus causing its representatrion in the type well for maintenance by the user.
					var m_functionSetUpTheWell = function() {

						try {

							if (m_clTypeActive) {	// There will always be an active type.

								$("#TWtypeName").val(m_clTypeActive.data.name);
								$("#TWimage").attr("src", resourceHelper.toURL('resources', m_clTypeActive.data.imageResourceId, 'image', ''));

								if (m_clTypeActive.isApp) {

									$("#TWdeleteTypeBtn").prop("disabled", true);

								} else {

									$("#TWdeleteTypeBtn").prop("disabled", false);
								}

								var strBuild;
								// Methods
								$("#TWmethodsTbody").empty();
								var haveAnyMethods = false;
								for (var i = 0; i < m_clTypeActive.data.methods.length; i++) {

									haveAnyMethods = true;
									var m = m_clTypeActive.data.methods[i];
									if (m.name === 'initialize') {
										strBuild = "<tr><td>" + m.name + "</td><td></td><td></td></tr>";
										$("#TWmethodsTbody").append(strBuild);
									} else {
										strBuild = '<tr><td><a id="method_' + i + '" href="#">' + m.name + '</a></td><td><a href="#" onclick="alert(\'rename dlg\');">rename</a></td><td><a href="#" onclick="alert(\'delete dlg\');">delete</a></td></tr>';
										$("#TWmethodsTbody").append(strBuild);
										$("#method_" + i).click(m_functionMethodClicked);
									}
								};
								if (haveAnyMethods){
									$("#TWclickMsg").css("display", "block");
								} else {
									$("#TWclickMsg").css("display", "none");
								}

								// Properties
								$("#TWpropertiesTbody").empty();
								strBuild = "";
								m_clTypeActive.data.properties.forEach(function(m) {

									strBuild += "<tr><td>" + m.name + "</td><td><a href='#'>edit</a></td><td><a href='#'>delete</a></td></tr>";
								});
								$("#TWpropertiesTbody").append(strBuild);

								// Events
								$("#TWeventsTbody").empty();
								strBuild = "";
								m_clTypeActive.data.properties.forEach(function(m) {

									strBuild += "<tr><td>" + m.name + "</td><td><a href='#'>edit</a></td><td><a href='#'>delete</a></td></tr>";
								});
								$("#TWeventsTbody").append(strBuild);

								if (m_arrayClTypes.length > 1) {

									$("#TypeWellMsg2").text("Click another type to work with it.");
	
								} else {

									$("#TypeWellMsg2").text("");
								}
							}

							return null;

						} catch(e) {

							return e;
						}
					}

					// TypeWell click handlers
					var m_functionMethodClicked = function(e) {

						try {

							var parts = e.currentTarget.id.split('_');
							var index = parseInt(parts[1], 10);

							var exceptionRet = code.load(m_clTypeActive, m_clTypeActive.data.methods[index], m_clTypeActive.data.methods[index].workspace);
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

					// Invoked when the types dialog exist newly.
					var m_functionNewType = function () {

						try {

				    		// Allocate project.
				    		var clType = new Type();
				    		var exceptionRet = clType.load({ 

	    						properties: [],
	    						methods: [],
	    						events: [],
	    						dependencies: [],
	    						name: "new type",
	    						id: m_arrayClTypes.length + 1,
	    						resourceId: 0
				    		});
				    		if (exceptionRet) {

				    			return exceptionRet;
				    		}

				    		// Add the type.
							exceptionRet = self.addItem(clType);
							if (exceptionRet) {

								throw exceptionRet;
							}

					        // Also add to the designer/tool strip.
							exceptionRet = tools.addItem(clType);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							return e;
						}
					};

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
