///////////////////////////////
// Client module runs client state and manages gui/server interaction.
//
// Return constructor function.
//

// Define module and require dependencies.
define(["Core/errorHelper",
		"Core/Simulator", 
		"Dialogs/NewProjectDialog/NewProjectDialog", 
		"Dialogs/OpenProjectDialog/OpenProjectDialog", 
		"Dialogs/SaveProjectAsDialog/SaveProjectAsDialog", 
		"Dialogs/NewTypeDialog/NewTypeDialog", 
		"Dialogs/TypeSearchDialog/TypeSearchDialog", 
		"Dialogs/ImageDiskDialog/ImageDiskDialog", 
		"Dialogs/ImageURLDialog/ImageURLDialog", 
		"Dialogs/ImageSearchDialog/ImageSearchDialog",
		"Dialogs/DeleteConfirmDialog/DeleteConfirmDialog",
		"Dialogs/GenericRenameDialog/GenericRenameDialog",
		"Dialogs/MethodSearchDialog/MethodSearchDialog",
		"Dialogs/NewEventDialog/NewEventDialog",
		"Dialogs/NewMethodDialog/NewMethodDialog",
		"Dialogs/NewPropertyDialog/NewPropertyDialog",
		"Dialogs/PropertyGrid/PropertyGrid",
		"Dialogs/ComicsDialog/ComicsDialog",
		"Core/Project",
		"Code/Type"],
	function (errorHelper, 
				Simulator,
				NewProjectDialog, 
				OpenProjectDialog,
				SaveProjectAsDialog,
				NewTypeDialog, 
				TypeSearchDialog, 
				ImageDiskDialog, 
				ImageURLDialog, 
				ImageSearchDialog, 
				DeleteConfirmDialog,
				GenericRenameDialog,
				MethodSearchDialog,
				NewEventDialog,
				NewMethodDialog,
				NewPropertyDialog,
				PropertyGrid,
				ComicsDialog,
				Project,
				Type) {

		try {

			// Define the client constructor function.
			var functionConstructor = function Client() {

				try {

					var self = this;		// Uber closure.

					//////////////////////////////
					// Public properties.

					// Main client state field.
					// Initialize, steadystate, closing.
					self.state = "initialize";

					//////////////////////////////
					// Public methods.

					// Start off the client.
					self.create = function () {

						try {

							// Set global profile for everyone to use.
							var profileJSON = localStorage.getItem("profile");
							g_profile = JSON.parse(profileJSON);
							return null;

						} catch (e) { return e; }
					};

					// Run (play) the Project
					self.play = function () {

						try {

							/* For now, just hard-code the environment to build.
				            var objectProject = {

				                comics: [{

				                    evaluator: {

				                        // Index across window.instances
				                        target: "window.app.ship",
				                        condition: {

				                            x: 200
				                        }
				                    },
				                    types: [{

				                        name: "App",
				                        methods: [{

				                            name: "initialize",
				                            workspace: "<xml>Some stuff...</xml>",
				                            code: " self.ship = new Ship(self);  self.ship.x = 0;  self.ship.y = 0; self.ship.dx = 2; self.ship.dy = 1; window.eventCollection['keypress'].push({ target: self.ship, method: 'HandleKeyPress' }); window.eventCollection['bounce'].push({ target: self.ship, method: 'HandleBounce' }); "
				                        }],
				                        properties: [{

				                            name: "ship"
				                        }, {

				                            name: "context"
				                        }],
				                        events: []
				                    }, {

				                        name: "Ship",                
				                        methods: [{

				                            name: "HandleBounce",
				                            parameters: ["ea"],
				                            workspace: "<xml>Other stuff...</xml>",
				                            code: " if (self.color === 'yellow') { self.color = 'green'; } else { self.color = 'yellow'; } "
				                        }, {

				                            name: "HandleKeyPress",
				                            parameters: ["ea"],
				                            workspace: "<xml>Other stuff...</xml>",
				                            code: " document.title = ea.key; "
				                        }, {

				                            name: "update",
				                            workspace: "<xml>Other stuff...</xml>",
				                            code: " self.x += self.dx; " + 
				                                " if (self.x > 780 || self.x < 0) { self.dx *= -1; self.x += self.dx * 2; window.raiseEvent('bounce', {}); } " + 
				                                "self.y += self.dy; " +
				                                " if (self.y > 580 || self.y < 0) { self.dy *= -1; self.y += self.dy * 2; window.raiseEvent('bounce', {}); } "
				                        }, {

				                            name: "render",
				                            workspace: "<xml>Other stuff...</xml>",
				                            code: " self.app.context.fillStyle = self.color; " + 
				                                "self.app.context.fillRect(self.x, self.y, 20, 20); "
				                        }],
				                        properties: [{

				                            name: "x"
				                        },{

				                            name: "dx"
				                        },{

				                            name: "y"
				                        }, {

				                            name: "dy"
				                        }, {

				                            name: "color",
				                            initialValue: "red",
				                            initialValueQuoted: true
				                        }],
				                        events: [{

				                            name: "bounce"
				                        }]
				                    }]
				                }]
				            };*/

				            // Allocate simulator.
				            m_simulator = new Simulator();
				            var exceptionRet = m_simulator.create(m_clProject.data);
				            if (exceptionRet) {

				                throw exceptionRet;
				            }

				            // Start simulation.
				            exceptionRet = m_simulator.start();
				            if (exceptionRet) {

				                throw exceptionRet;
				            }

				            $(".hiddenifrunning").css("display", "none");
							$(".hiddenifnotrunning").css("display", "inherit");

							return null;
						} catch (e) {

							errorHelper.show(e);
						}
					}

					// Method invoked when the nav-bar stop button is pressed.
					self.stop = function () {

						try {

				            // Start simulation.
				            var exceptionRet = m_simulator.stop();
				            if (exceptionRet) {

				                throw exceptionRet;
				            }

				            $(".hiddenifrunning").css("display", "inherit");
							$(".hiddenifnotrunning").css("display", "none");
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Start off the client.
					// self.debug = function () {

					// 	try {

					// 		// 
					// 		alert($("#BlocklyIFrame")[0].contentWindow.getMethodString());

					// 		return null;
					// 	} catch (e) {

					// 		return e;
					// 	}
					// };

					//////////////////////////////
					// Dialog creators/openers
					self.showNewProjectDialog = function () {

						try {

							m_openDialog = new NewProjectDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showOpenProjectDialog = function (functionOK) {

						try {

							// functionOK is an anonymous function in Navbar.js.
							// It will be called with iProjectId if a project is selected.
							// It will call client to fetch and open the project.

							m_openDialog = new OpenProjectDialog();
							var exceptionRet = m_openDialog.create(functionOK);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showSaveProjectDialog = function () {

						try {

							m_openDialog = new SaveProjectAsDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showComicsDialog = function() {

						try {

							m_openDialog = new ComicsDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) {

								throw exceptionRet;
							}
							return null;

						} catch (e) {

							return e;
						}
					}

					self.showNewTypeDialog = function () {

						try {

							m_openDialog = new NewTypeDialog();
							var exceptionRet = m_openDialog.create("New", -1);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showEditTypeDialog = function (index) {

						try {

							m_openDialog = new NewTypeDialog();
							var exceptionRet = m_openDialog.create("Edit", index);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showTypeSearchDialog = function (functionOK) {

						try {

							m_openDialog = new TypeSearchDialog();
							var exceptionRet = m_openDialog.create(functionOK);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showNewMethodDialog = function () {

						try {

							m_openDialog = new NewMethodDialog();
							var exceptionRet = m_openDialog.create("New", -1);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showEditMethodDialog = function (index) {

						try {

							m_openDialog = new NewMethodDialog();
							var exceptionRet = m_openDialog.create("Edit", index);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showMethodSearchDialog = function (functionOK) {

						try {

							m_openDialog = new MethodSearchDialog();
							var exceptionRet = m_openDialog.create(functionOK);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showNewPropertyDialog = function () {

						try {

							m_openDialog = new NewPropertyDialog();
							var exceptionRet = m_openDialog.create('New', -1);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showEditPropertyDialog = function (index) {

						try {

							m_openDialog = new NewPropertyDialog();
							var exceptionRet = m_openDialog.create('Edit', index);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showNewEventDialog = function () {

						try {

							m_openDialog = new NewEventDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showGenericRenameDialog = function (itemType, index) {

						try {

							m_openDialog = new GenericRenameDialog();
							var exceptionRet = m_openDialog.create(itemType, index);
							if (exceptionRet) { throw exceptionRet; }
							
							return null;

						} catch (e) {

							return e;
						}
					}

					self.showDeleteConfirmDialog = function (objectType, index) {

						try {

							// Figure out if this item is referenced anywhere
							var methodReference = null;
							var clActiveType = types.getActiveClType();
							if (objectType === "type") {

								methodReference = code.isTypeReferencedInWorkspace(clActiveType);

							} else if (objectType === "property") {

								methodReference = code.isPropertyReferencedInWorkspace(clActiveType, clActiveType.data.properties[index]);

							} else if (objectType === "method") {

								methodReference = code.isMethodReferencedInWorkspace(clActiveType, clActiveType.data.methods[index]);

							} else if (objectType === "event") {

								methodReference = code.isEventReferencedInWorkspace(clActiveType, clActiveType.data.events[index]);
							}

							// If a reference was found, report it and drop out.
							if (methodReference) {

								BootstrapDialog.alert({

									title: "WARNING",
									message: "Cannot delete! Object in use: " + methodReference.type.data.name + " :: " + methodReference.name,
									type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
									closable: true, // <-- Default value is false
									draggable: true // <-- Default value is false
								});
								return;
       						}

							m_openDialog = new DeleteConfirmDialog();
							var exceptionRet = m_openDialog.create(objectType, index);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showImageDiskDialog = function (bImage, functionOK) {

						try {

							// If image mode, show for images, otherwise, sounds....
							m_openDialog2 = new ImageDiskDialog();
							var exceptionRet = m_openDialog2.create(bImage,
								functionOK);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					self.showImageSearchDialog = function (bImage, functionOK) {

						try {

							// If image mode, show for images, otherwise, sounds....
							m_openDialog2 = new ImageSearchDialog();
							var exceptionRet = m_openDialog2.create(bImage,
								functionOK);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					self.showImageURLDialog = function (bImage, functionOK) {

						try {

							// If image mode, show for images, otherwise, sounds....
							m_openDialog2 = new ImageURLDialog();
							var exceptionRet = m_openDialog2.create(bImage,
								functionOK);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					self.showPropertyGrid = function(toolInstance, functionManipulate) {

						try {

							m_openDialog = new PropertyGrid();
							var exceptionRet = m_openDialog.create(toolInstance, functionManipulate);
							if (exceptionRet) { throw exceptionRet; }
							
							return null;

						} catch (e) {

							return e;
						}
					}

					//////////////////////////////
					// "functionOK" links.
					// These are callbacks from, e.g., Select or Create buttons in dialogs.
					// Not all of these come back through client. Some places handle the processing internally.

					// If iProjectId = 1-5 (New Projects), then projectType will be defined as a string telling
					// the BO what kind of Project to build. Otherwise, it will be undefined.
					self.openProjectFromDB = function (iProjectId, callback) {

						try {

							var posting = $.post("/BOL/ProjectBO/RetrieveProject", 
								{
									projectId: iProjectId,
									// userId: g_profile["userId"] not needed; sent in JWT
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									var exceptionRet = self.loadedProject(data.project, callback);
									if (exceptionRet) { errorHelper.show(exceptionRet); }

								} else {

									// !data.success
									errorHelper.show(data.message);
								}
							});
							// $.ajax({

							// 	type: 'POST',
							// 	url: '/BOL/ProjectBO/RetrieveProject',
							// 	contentType: 'application/json',
							// 	data: {
							// 		projectId: iProjectId,
							// 		userId: g_profile["userId"]
							// 	},
							// 	dataType: 'json',
							// 	success: function (data) {

							// 		if (data.success) {

							// 			var exceptionRet = self.loadedProject(data.project, callback);
							// 			if (exceptionRet) { errorHelper.show(exceptionRet); }

							// 		} else {

							// 			// !data.success -- error message in objectData.message
							// 			errorHelper.show(data.message);
							// 		}
							// 	},
							// 	error: function (jqxhr, strTextStatus, strError) {

							// 		// Non-computational error in strError
							// 		errorHelper.show(strError);
							// 	}
							// });
							return null;

						} catch (e) {

							return e;
						}
					}

//used
					self.addTypeToProject = function(clType) {

						try {

							return m_clProject.addType(clType);

						} catch (e) {

							return e;
						}
					}

//used
					// Note: updateClType has .data; origType doesn't.
					self.updateTypeInProject = function(updatedClType, activeClComic, origType, iTypeIndex) {

						try {

							activeClComic.data.types.items[iTypeIndex] = updatedClType.data;

							var origClType = new Type();
							origClType.load(origType);
							exceptionRet = code.replaceType(updatedClType, origClType);
							if (exceptionRet) { throw exceptionRet; }
							
							return null;

						} catch (e) {

							return e;
						}
					}

//used
					self.addTypeToProjectFromDB = function (iTypeId) {

						try {

							var posting = $.post("/BOL/ProjectBO/RetrieveType", 
								{
									typeId: iTypeId
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									var clType = new Type();
									clType.load(data.type);
									return m_clProject.addType(clType);

								} else {

									// !data.success
									return new Error(data.message);
								}
							});
							// $.ajax({

							// 	type: 'POST',
							// 	url: '/BOL/ProjectBO/RetrieveType',
							// 	contentType: 'application/json',
							// 	data: {
							// 		typeId: iTypeId
							// 	},
							// 	dataType: 'json',
							// 	success: function (data) {

							// 		if (data.success) {

							// 			var clType = new Type();
							// 			clType.load(data.type);
							// 			return m_clProject.addType(clType);

							// 		} else {

							// 			// !data.success -- error message in objectData.message
							// 			return new Error(data.message);
							// 		}
							// 	},
							// 	error: function (jqxhr, strTextStatus, strError) {

							// 		// Non-computational error in strError
							// 		return new Error(strError);
							// 	}
							// });

							return null;

						} catch (e) {

							return e;
						}
					}

//used
					// We are going to add the method to the bottom of the methods array
					// of the active Type; then add requisite info to code's schema info;
					// then rebuild the TypeWell methods grid;
					// then we'll hand-click the method in the grid.
					self.addMethodToActiveType = function (method) {

						try {

							var activeClType = types.getActiveClType();
							activeClType.data.methods.push(method);

							var iMethodIndex = activeClType.data.methods.length - 1;

							// var exceptionRet = types.functionSetActiveMethodIndex(iMethodIndex);
							// if (exceptionRet) { throw exceptionRet; }

							// Add the method to code.
							var exceptionRet = code.addMethod(activeClType, 
								method);
							if (exceptionRet) { throw exceptionRet; }

							// exceptionRet = code.load(method.workspace);
							// if (exceptionRet) { throw exceptionRet; }

							exceptionRet = types.regenTWMethodsTable();
							if (exceptionRet) { throw exceptionRet; }

							// Scroll the methods grid to the bottom.
							$("#methodrename_" + iMethodIndex.toString()).scrollintoview();

							// Now click the new method in the grid to load the code pane.
							$("#method_" + iMethodIndex.toString()).click();

						} catch (e) {

							return e;
						}
					}
// used
					self.updateMethodInActiveType = function(updatedMethod, origMethod, iMethodIndex, activeClType) {

						try {

							activeClType.data.methods[iMethodIndex] = updatedMethod;

							var exceptionRet = types.regenTWMethodsTable();
							if (exceptionRet) { throw exceptionRet; }

							exceptionRet = code.replaceMethod(updatedMethod, origMethod, activeClType);
							if (exceptionRet) { throw exceptionRet; }
							
							// Now click the updated method in the grid to load the code pane.
							$("#method_" + iMethodIndex.toString()).click();

							return null;

						} catch (e) {

							return e;
						}
					}

//used
					self.addEventToActiveType = function (event) {

						try {

							var activeClType = types.getActiveClType();
							activeClType.data.events.push(event);

							// Add the method to code.
							var exceptionRet = code.addEvent(activeClType, 
								event);
							if (exceptionRet) { throw exceptionRet; }

							exceptionRet = types.regenTWEventsTable();
							if (exceptionRet) { throw exceptionRet; }

							// Now do something to scroll the events grid to the bottom.
							$("#eventrename_" + (activeClType.data.events.length - 1).toString()).scrollintoview();

						} catch (e) {

							return e;
						}
					}

//used
					self.addPropertyToActiveType = function (property) {

						try {

							var activeClType = types.getActiveClType();
							return self.addPropertyToType(property,
								activeClType);
						} catch (e) {

							return e;
						}
					}

					self.addPropertyToType = function (property, clType) {

						try {

							clType.data.properties.push(property);

							// Add the property to code.
							var exceptionRet = code.addProperty(clType, 
								property);
							if (exceptionRet) { throw exceptionRet; }

							exceptionRet = types.regenTWPropertiesTable();
							if (exceptionRet) { throw exceptionRet; }

							// Now do something to scroll the props grid to the bottom.
							$("#propertyedit_" + (clType.data.properties.length - 1).toString()).scrollintoview();

							return null;
						} catch (e) {

							return e;
						}
					}

//used
					self.updatePropertyInActiveType	= function (property, index, strOriginalName) {

						try {

							var activeClType = types.getActiveClType();
							activeClType.data.properties[index] = property;

							// Add the property to code.
							var exceptionRet = code.replaceProperty(activeClType, 
								property,
								strOriginalName);
							if (exceptionRet) { throw exceptionRet; }

							exceptionRet = types.regenTWPropertiesTable();
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) {

							return e;
						}
					}

//used
					self.renameEventInActiveType = function (strNewName, index, strOriginalName) {

						try {

							var activeClType = types.getActiveClType();
							var oldEvent = activeClType.data.events[index];
							oldEvent.name = strNewName;
							activeClType.data.events[index] = oldEvent;

							// Call Code.js#renameEvent(clType, event, strOriginalName).
							var exceptionRet = code.renameEvent(activeClType, oldEvent, strOriginalName);
							if (exceptionRet) { throw exceptionRet; }

							return types.regenTWEventsTable();

						} catch(e) {

							return e;
						}
					}

//used
					self.addMethodToTypeFromDB = function (iMethodId) {

						try {

							var posting = $.post("/BOL/ProjectBO/RetrieveMethod", 
								{
									methodId: iMethodId
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									return self.addMethodToActiveType(data.method);

								} else {

									// !data.success
									return new Error(data.message);
								}
							});
							// $.ajax({

							// 	type: 'POST',
							// 	url: '/BOL/ProjectBO/RetrieveMethod',
							// 	contentType: 'application/json',
							// 	data: {
							// 		methodId: iMethodId
							// 	},
							// 	dataType: 'json',
							// 	success: function (data) {

							// 		if (data.success) {

							// 			return self.addMethodToActiveType(data.method);

							// 		} else {

							// 			// !data.success -- error message in objectData.message
							// 			return new Error(data.message);
							// 		}
							// 	},
							// 	error: function (jqxhr, strTextStatus, strError) {

							// 		// Non-computational error in strError
							// 		return new Error(strError);
							// 	}
							// });

							return null;

						} catch (e) {

							return e;
						}
					}

					// Delete types.getActiveClType() from ???
					// Remove from code, toolstrip, designer, etc.
//used					
					self.deleteType = function() {

						try {

							var clType = types.getActiveClType(true);	// Param true tells method we're removing so a new active type needs assigning.

							var exceptionRet = comics.removeType(clType);
							if (exceptionRet) { return exceptionRet; }

							exceptionRet = code.removeType(clType);
							if (exceptionRet) { return exceptionRet; }

							// clType has been returned so we can now remove it from tools. It has already been spliced out of project.comic.types.
							// This will remove it from the tools strip and tidy that up (height of Slider, etc.).
							exceptionRet = tools.removeItem(clType);
							if (exceptionRet) { return exceptionRet; }

							return null;

						}  catch(e) {

							return e;
						}
					}

					// Delete types.getActiveClType().data.methods[index].
					// Remove from code.
//used					
					self.deleteMethod = function(index) {

						try {

							return types.deleteMethod(index);

						}  catch(e) {

							return e;
						}
					}

					// Delete types.getActiveClType().data.properties[index].
					// Remove from code.
//used					
					self.deleteProperty = function(index) {

						try {

							return types.deleteProperty(index);

						}  catch(e) {

							return e;
						}
					}

					// Delete types.getActiveClType().data.events[index].
					// Remove from code.
//used					
					self.deleteEvent = function(index) {
						
						try {

							return types.deleteEvent(index);

						}  catch(e) {

							return e;
						}
					}

					//////////////////////////////
					// Non-dialog menu handlers

					self.navToAdminzone = function() {

						try {

							location.href = "/adminzone"

						} catch (e) {

							return e;
						}
					}

					//////////////////////////////
					// Miscellaneous helpers.
					self.getNumberOfTypesInActiveComic = function () {

						try {

							return types.getLength();

						} catch(e) {

							throw e;
						}
					}

					// If no active project, returns call unloadedCallback in order to proceed to New Project or whatever.
					// If active project, displays BootstrapDialog asking user.
					// If user says to abandon, it empties and clears project and returns null.
					// If user says not to abandon, it returns project.
					// On exception, it also returns project, but state may be compromised (i.e., partially removed)--needs further work.
					self.unloadProject = function (unloadedCallback, bShowAbandonDlg) {

						try {

							if (m_clProject) {
							
								m_functionAbandonProjectDialog(function() {	

									// This callback will be called if the user wants to abandon the open project.
									var exceptionRet = m_clProject.unload();
									if (exceptionRet) { throw exceptionRet; }

									m_clProject = null;

									// Disable the TypeWell icons that are enabled if a project is loaded.
									$(".disabledifnoproj").prop("disabled", true);

									// Remove tooltip functionality from TypeWell icons.
									$(".disabledifnoproj").powerTip({
										smartPlacement: true,
										manual: true
									});
									// Empty the toolstrip, designer, comicstrip and typewell.
									tools.empty();

									if ($.isFunction(unloadedCallback))
										unloadedCallback();
								},
								bShowAbandonDlg);	// If bShowAbandonDlg is false, will just return. No better way.

							} else {

								if ($.isFunction(unloadedCallback))
									unloadedCallback();
							}
						} catch (e) {

							errorHelper.show(e);

						}
					}

					// Helper method replaces spaces with underscores.
					self.removeSpaces = function (strPossiblyWithSpaces) {

						return strPossiblyWithSpaces.replace(/ /g, '_');
					};

					//////////////////////////////
					// Project helper methods.
					self.setBrowserTabAndBtns = function () {

						document.title = "TechGroms";
						if (m_clProject) {

							if (m_clProject.data.name.length > 0) { document.title = document.title + " / " + m_clProject.data.name; }
						}

						// Something happened so refresh the navbar.
						navbar.enableDisableProjectsMenuItems();

						if (g_profile.can_visit_adminzone) {

							navbar.enableDisableAdminZoneMenuItems();
						}
					}

					// Even though New Project Dialog no longer calls the following method (since it retrieves the Project with id=1-5 from the DB),
					// the following method is called after saving a project, since it needs to be reloaded following the setting of probably
					// new id's for the project and all of its parts.
					self.loadedProject = function (project, callback) {

						try {

							// Enable the TypeWell icons that are disabled if no project is loaded.
							// Doing this before loading the project, because the Delete type icon is going to be disabled once the isApp type is selected.
							$(".disabledifnoproj").prop("disabled", false);

				    		// Allocate project.
				    		m_clProject = new Project();
				    		var exceptionRet = m_clProject.load(project);
				    		if (exceptionRet) { return exceptionRet; }

				    		// Play App Type's initialize Method to set the initial state of the designer frame
		    				designer.initializeWithWorkspace();

							// Fire bootstrap tooltip opt-in.
							$(".disabledifnoproj").powerTip({
								smartPlacement: true,
								manual: false
							});

							if ($.isFunction(callback)) {

								callback(m_clProject);
							
							} else {

								self.setBrowserTabAndBtns();
							}

							return null;

						} catch (e) {

							return e;
						}
					};

					self.getProject = function () {

						return m_clProject;
					};

					self.saveProject = function () {

						try {

							return m_clProject.saveToDatabase();

						} catch (e) {

							return e;
						}
					}

					self.closeCurrentDialog = function () {

						if (m_openDialog) {

							m_openDialog.closeYourself();
							m_openDialog = null;
						
						} else if (m_openDialog2) {

							m_openDialog2.closeYourself();
							m_openDialog2 = null;
						}
					}

					var m_functionAbandonProjectDialog = function (abandonCallback, bShowAbandonDlg) {

						// The following seems stupid, but it may be the best way to prevent showing this dlg after a project save.
						if (!bShowAbandonDlg) {

							abandonCallback();
							return;
						}

						BootstrapDialog.show({
							type: BootstrapDialog.TYPE_DANGER,
							closable: false,
							title: 'Please Confirm',
							message: 'You have an open project. Are you sure you want to abandon it?',
							buttons:
							[
								{
									label: 'Yes, abandon it',
									action: function(dialog) {
										dialog.close();
										abandonCallback();
									}
								},
								{
									label: 'No, take me back',
									action: function(dialog) {
										dialog.close();
									}
								}
							]
						});
					}

					// Private variables.
					var m_clProject = null;
					var m_openDialog = null;

					// This second one is used for the Image Search, Disk and URL dialogs, since they can open over another open dialog.
					var m_openDialog2 = null;

					// This is the simulator object.
					var m_simulator = null;

				} catch (e) { errorHelper.show(e); }
			};

			// Return constructor function.
			return functionConstructor;

		} catch (e) {

			errorHelper.show(e);
		}
	});
