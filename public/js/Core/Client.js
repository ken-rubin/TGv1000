///////////////////////////////
// Client module runs client state and manages gui/server interaction.
//
// Return constructor function.
//

// Define module and require dependencies.
define(["Core/errorHelper", 
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
		"Core/Project",
		"Code/Type"],
	function (errorHelper, 
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

							// Save.
							m_iUserId = self.getTGCookie('userId');

							return null;
						} catch (e) {

							return e;
						}
					};

					// Start off the client.
					self.debug = function () {

						try {

							// 
							alert($("#BlocklyIFrame")[0].contentWindow.getMethodString());

							return null;
						} catch (e) {

							return e;
						}
					};

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

							m_openDialog = new SaveProjectAsDialog('save');
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showSaveProjectAsDialog = function () {

						try {

							m_openDialog = new SaveProjectAsDialog('saveAs');
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
							var exceptionRet = m_openDialog.create();
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
							var exceptionRet = m_openDialog.create();
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
							var exceptionRet = m_openDialog.create('New', 0);
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

					//////////////////////////////
					// "functionOK" links.
					// These are callbacks from, e.g., Select or Create buttons in dialogs.
					// Not all of these come back through client. Some places handle the processing internally.
					self.openProjectFromDB = function (iProjectId, callback) {

						try {

							var posting = $.post("/BOL/ProjectBO/RetrieveProject", 
								{
									projectId: iProjectId,
									userName: self.getTGCookie("userName")	// for tag elimination
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									var exceptionRet = self.functionNewProject(data.project, callback);
									if (exceptionRet) { return exceptionRet; }

									return null;

								} else {

									// !data.success
									return new Error(data.message);
								}
							});
						} catch (e) {

							return e;
						}
					}

					self.addTypeToProject = function(clType) {

						try {

							return m_clProject.addType(clType);

						} catch (e) {

							return e;
						}
					}

					self.addTypeToProjectFromDB = function (iTypeId) {

						try {

							var posting = $.post("/BOL/ProjectBO/RetrieveType", 
								{
									typeId: iTypeId,
									userName: self.getTGCookie("userName")	// for tag elimination
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

							return null;

						} catch (e) {

							return e;
						}
					}

//used
					self.addMethodToActiveType = function (method) {

						try {

							var activeClType = types.getActiveClType();
							activeClType.data.methods.push(method);

							// Add the method to code.
							var exceptionRet = code.addMethod(activeClType, 
								method);
							if (exceptionRet) { throw exceptionRet; }

							exceptionRet = types.regenTWMethodsTable();
							if (exceptionRet) { throw exceptionRet; }

							// Now do something to scroll the methods grid to the bottom.
							$("#methodrename_" + (activeClType.data.methods.length - 1).toString()).scrollintoview();

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
							activeClType.data.properties.push(property);

							// Add the property to code.
							var exceptionRet = code.addProperty(activeClType, 
								property);
							if (exceptionRet) { throw exceptionRet; }

							exceptionRet = types.regenTWPropertiesTable();
							if (exceptionRet) { throw exceptionRet; }

							// Now do something to scroll the props grid to the bottom.
							$("#propertyedit_" + (activeClType.data.properties.length - 1).toString()).scrollintoview();

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
							var exceptionRet = code.updateProperty(activeClType, 
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
					self.renameTypeInActiveComic = function (strNewName, index, strOriginalName) {

						try {

							var activeClType = types.getActiveClType();
							activeClType.data.name = strNewName;		// Since it's a reference, it's updated everywhere important.

							// Call Code.js#renameType(clType, strOriginalName).
							var exceptionRet = code.renameType(activeClType, strOriginalName);
							if (exceptionRet) { throw exceptionRet; }

							// Have types.js change header of TypeWell.
							exceptionRet = types.changeTypeWellHeader(strNewName);
							if (exceptionRet) { throw exceptionRet; }

							// Need to call someone to update the tooltip of the correct tool in toolstrip.
							// Everything else should be handled.
							return tools.changeTooltipAndId(strOriginalName, strNewName);

						} catch(e) {

							return e;
						}
					}

//used
					self.renameMethodInActiveType = function (strNewName, index, strOriginalName) {

						try {

							var activeClType = types.getActiveClType();
							var oldMethod = activeClType.data.methods[index];
							oldMethod.name = strNewName;
							activeClType.data.methods[index] = oldMethod;

							// Call Code.js#renameMethod(clType, method, strOriginalName).
							var exceptionRet = code.renameMethod(activeClType, oldMethod, strOriginalName);
							if (exceptionRet) { throw exceptionRet; }

							return types.regenTWMethodsTable();

						} catch(e) {

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

					self.addMethodToTypeFromDB = function (iMethodId) {

						try {

							var posting = $.post("/BOL/ProjectBO/RetrieveMethod", 
								{
									methodId: iMethodId,
									userName: self.getTGCookie("userName")	// for tag elimination
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									return types.getActiveClType().addMethod(data.method);

								} else {

									// !data.success
									return new Error(data.message);
								}
							});

							return null;

						} catch (e) {

							return e;
						}
					}

					self.addPropertyToType = function (property) {

						try {

							return types.getActiveClType().addProperty(property);

						} catch (e) {

							return e;
						}
					}

					self.addEventToType = function (event) {

						try {

							return types.getActiveClType().addEvent(event);

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
							var exceptionRet = code.removeType(clType);
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
					self.quickSaveProject = function () {

						try {

							var exceptionRet = m_clProject.saveToDatabase();
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

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

					self.unloadProject = function () {


						try {

							// Warn if project is dirty.






							var exceptionRet = m_clProject.unload();
							if (exceptionRet) {

								throw exceptionRet;
							}

							m_clProject = null;

							// Disable the TypeWell icons that are enabled if a project is loaded.
							$(".disabledifnoproj").prop("disabled", true);

							// Remove tooltip functionality from TypeWell icons.
							$(".disabledifnoproj").tooltip("destroy");

							// Empty the toolstrip, designer and comicstrip.
							tools.empty();

							return null;

						} catch (e) {

							errorHelper.show(e);
						}
					}

					self.getTGCookie = function (name) {

					    var value = "; " + document.cookie;
					    var parts = value.split("; " + name + "=");
					    if (parts.length == 2) {

					        return parts.pop().split(";").shift();
					    }
					};

					// Helper method replaces spaces with underscores.
					self.removeSpaces = function (strPossiblyWithSpaces) {

						return strPossiblyWithSpaces.replace(/ /g, '_');
					};

					//////////////////////////////
					// Project helper methods.
					self.setProjectDirtyBool = function (bVal) {

						if (m_clProject) {

							m_clProject.setDirtyBool(bVal);
							document.title = "TechGroms";
							if (m_clProject.data.name.length > 0) {

								document.title = document.title + " / " + m_clProject.data.name;

							}
						} else {

							document.title = "TechGroms";
						}

						// Something happened. Refresh the navbar.
						navbar.enableDisableProjectsMenuItems();
					}

					// Even though New Project Dialog no longer calls the following method (since it retrieves the Project with id=1 from the DB),
					// the following method is called after saving a project, since it needs to be reloaded following the setting of probably
					// new id's for all of the parts of the project.
					self.functionNewProject = function (project, callback) {

						try {

							// Enable the TypeWell icons that are disabled if no project is loaded.
							// Doing this before loading the project, because the Delete type icon is going to be disabled once the isApp type is selected.
							$(".disabledifnoproj").prop("disabled", false);

				    		// Allocate project.
				    		m_clProject = new Project();
				    		var exceptionRet = m_clProject.load(project);
				    		if (exceptionRet) { return exceptionRet; }

							// Fire bootstrap tooltip opt-in.
							$(".disabledifnoproj").tooltip();

							// Use project data and user history to determine initial display settings for comic and panels strips (along with width of designer and code sections).
							if (m_clProject.data.comics.items.length > 1) {

								// Set globael var so comic stuff will be displayed on resize and force a resize.
								self.functionSetBDisplayComics(true);

							} else {

								// If project has only 1 comic, it means it's a project a user started with New Project.
								// Determine if showing help (comic) based on number of projects user has played with.
								var posting = $.post("/BOL/ProjectBO/RetrieveCountUsersProjects", 
									{
										userId: self.getTGCookie("userId")
									},
									'json');
								posting.done(function(data){

									if (data.success) {

										if (data.cnt > 5) {

											self.functionSetBDisplayComics(false);

										} else if (data.cnt < 4) {

											self.functionSetBDisplayComics(true);

										} else {

											self.functionSetBDisplayComics(false);
											errorHelper.show("Based on your experience level, Help is turned off. You may turn it back on with the Show Help menu item.", 7500);
										}

									} else {

										// !data.success
										// This can't be good. We'll just turn help on.
										self.functionSetBDisplayComics(true);
									}
								});
							}

							if ($.isFunction(callback)) {

								callback(m_clProject);
							}

							return null;

						} catch (e) {

							return e;
						}
					};

					self.getProject = function () {

						return m_clProject;
					};

					self.saveProjectAs = function () {

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

					self.isComicNameAvailable = function(strName) {

						if (m_clProject) {

							for (var i = 0; i < m_clProject.data.comics.items.length; i++) {

								var comicIth = m_clProject.data.comics.items[i];
								if (comicIth.name === strName) {

									return false;
								}

								return true;
							}
						}

						return false;
					}

					self.isTypeNameAvailableInActiveComic = function(strName, myIndex) {

						return comics.isTypeNameAvailableInActiveComic(strName, myIndex);
					}

					self.isEventNameAvailableInActiveType = function(strName, myIndex) {

						return types.isEventNameAvailableInActiveType(strName, myIndex);
					}

					self.isMethodNameAvailableInActiveType = function(strName, myIndex) {

						return types.isMethodNameAvailableInActiveType(strName, myIndex);
					}

					self.isPropertyNameAvailableInActiveType = function(strName, myIndex) {

						return types.isPropertyNameAvailableInActiveType(strName, myIndex);
					}

					// Set global var governing display of comic and panels strips and Show/Hide Help menu item.
					self.functionSetBDisplayComics = function(bDisplayComicsStuff) {

						bDisplayComics = bDisplayComicsStuff;

						if (bDisplayComics) {

							$("#ComicsOn").css("display", "none");
							$("#ComicsOff").css("display", "block");

						} else {

							$("#ComicsOn").css("display", "block");
							$("#ComicsOff").css("display", "none");
						}

						$(window).resize();
					}

					// Private variables.
					var m_clProject = null;
					var m_openDialog = null;

					// This second one is used for the Image Search, Disk and URL dialogs, since they can open over another open dialog.
					var m_openDialog2 = null;

				} catch (e) { errorHelper.show(e); }
			};

			// Return constructor function.
			return functionConstructor;

		} catch (e) {

			errorHelper.show(e);
		}
	});
