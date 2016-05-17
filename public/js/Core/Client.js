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
		"Dialogs/PropertyGrid/PropertyGrid",
		"Dialogs/BuyDialog/BuyDialog",
		"Dialogs/AZActivatePPDialog/AZActivatePPDialog",
		"Dialogs/AZUsersDialog/AZUsersDialog",
		"Dialogs/AZProjectsDialog/AZProjectsDialog",
		"Dialogs/AZSavePPDataDialog/AZSavePPDataDialog",
		"Dialogs/AZPPBuyersDialog/AZPPBuyersDialog",
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
				PropertyGrid,
				BuyDialog,
				AZActivatePPDialog,
				AZUsersDialog,
				AZProjectsDialog,
				AZSavePPDataDialog,
				AZPPBuyersDialog,
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

					//////////////////////////////
					// Dialog creators/openers
					
					self.showAZPPBuyersDialog = function (iProjectId) {

						try {

							m_openDialog2 = new AZPPBuyersDialog();
							var exceptionRet = m_openDialog2.create(iProjectId);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showNewProjectDialog = function () {

						try {

							m_openDialog = new NewProjectDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showBuyDialog = function () {

						try {

							m_openDialog = new BuyDialog();
							var exceptionRet = m_openDialog.create(m_clProject);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showOpenProjectDialog = function (functionOK) {

						try {

							// functionOK is an anonymous function in Navbar.js.
							// It will be called with iProjectId and specialProjectData if a project is selected.
							// It will then call client to fetch and open the project. Then to possibly complete a purchase.

							m_openDialog = new OpenProjectDialog();
							var exceptionRet = m_openDialog.create(functionOK);
							return exceptionRet;

						} catch (e) { return e; }
					}

					self.putUserOnWaitlist = function (iProjectId) {

						try {

							var posting = $.post("/BOL/UtilityBO/PutUserOnWaitlist", 
								{
									projectId: iProjectId
									// userId: g_profile["userId"] not needed; sent in JWT
									// userName: g_profile["userName"] not needed; sent in JWT
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									BootstrapDialog.show({

										title: "Waitlist",
										message: "You have been added to the waitlist for the selected class. We will update you by email.",
										closable: true, // <-- Default value is false
										draggable: true, // <-- Default value is false
										buttons: [{
											label: "OK",
											action: function(d) { d.close(); }
										}]
									});
								} else {

									// !data.success
									return new Error(data.message);
								}
							});

							return null;

						} catch (e) { return e; }
					}

					self.showSaveProjectDialog = function () {

						try {

							m_openDialog = new SaveProjectAsDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showNewTypeDialog = function () {

						try {

							m_openDialog = new NewTypeDialog();
							var exceptionRet = m_openDialog.create("New", -1);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showEditTypeDialog = function (index) {

						try {

							m_openDialog = new NewTypeDialog();
							var exceptionRet = m_openDialog.create("Edit", index);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showTypeSearchDialog = function (functionOK) {

						try {

							m_openDialog = new TypeSearchDialog();
							var exceptionRet = m_openDialog.create(functionOK);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showNewMethodDialog = function () {

						try {

							m_openDialog = new NewMethodDialog();
							var exceptionRet = m_openDialog.create("New", -1);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showEditMethodDialog = function (index) {

						try {

							m_openDialog = new NewMethodDialog();
							var exceptionRet = m_openDialog.create("Edit", index);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showMethodSearchDialog = function (functionOK) {

						try {

							m_openDialog = new MethodSearchDialog();
							var exceptionRet = m_openDialog.create(functionOK);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showNewPropertyDialog = function () {

						try {

							m_openDialog = new NewPropertyDialog();
							var exceptionRet = m_openDialog.create('New', -1);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showEditPropertyDialog = function (index) {

						try {

							m_openDialog = new NewPropertyDialog();
							var exceptionRet = m_openDialog.create('Edit', index);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showNewEventDialog = function () {

						try {

							m_openDialog = new NewEventDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showGenericRenameDialog = function (itemType, index) {

						try {

							m_openDialog = new GenericRenameDialog();
							var exceptionRet = m_openDialog.create(itemType, index);
							if (exceptionRet) { throw exceptionRet; }
							
							return null;

						} catch (e) { return e; }
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
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showImageDiskDialog = function (bImage, functionOK) {

						try {

							// If image mode, show for images, otherwise, sounds....
							m_openDialog2 = new ImageDiskDialog();
							var exceptionRet = m_openDialog2.create(bImage,
								functionOK);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					};

					self.showImageSearchDialog = function (bImage, functionOK) {

						try {

							// If image mode, show for images, otherwise, sounds....
							m_openDialog2 = new ImageSearchDialog();
							var exceptionRet = m_openDialog2.create(bImage,
								functionOK);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					};

					self.showImageURLDialog = function (bImage, functionOK) {

						try {

							// If image mode, show for images, otherwise, sounds....
							m_openDialog2 = new ImageURLDialog();
							var exceptionRet = m_openDialog2.create(bImage,
								functionOK);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					};

					self.showPropertyGrid = function(toolInstance, functionManipulate) {

						try {

							m_openDialog = new PropertyGrid();
							var exceptionRet = m_openDialog.create(toolInstance, functionManipulate);
							if (exceptionRet) { throw exceptionRet; }
							
							return null;

						} catch (e) { return e; }
					}

					self.showAZUsersDialog = function() {

						try {

							m_openDialog = new AZUsersDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showAZProjectsDialog = function() {

						try {

							m_openDialog = new AZProjectsDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showAZActivatePPDialog = function() {

						try {

							m_openDialog = new AZActivatePPDialog();
							var exceptionRet = m_openDialog.create(function(jsPPData) {

								try {

									m_openDialog = new AZSavePPDataDialog();
									var exceptionRet = m_openDialog.create(jsPPData);
									if (exceptionRet) { throw exceptionRet; }
									return null;

								} catch(e) { return e; }
							});
							if (exceptionRet) { throw exceptionRet; }
							return null;

						} catch (e) { return e; }
					}

					//////////////////////////////
					// "functionOK" links.
					// These are callbacks from, e.g., Select or Create buttons in dialogs.
					// Not all of these come back through client. Some places handle the processing internally.

					// Called by BuyDialog with bChangeableName=true.
					// Called by SaveProjectAsDialog with bChangeableName=false.
					self.saveProjectToDB = function (bChangeableName) {

						try {

							// Retrieve content of manager: the whole project.
							var objProject = manager.save();

							var data = {
									// userId: g_profile["userId"], not needed; sent in JWT
									// userName: g_profile["userName"], not needed; sent in JWT
									projectJson: objProject,
									changeableName: bChangeableName || false
							};

							// If !projectJson.specialProjectData.systemTypesEdited, then success and error mean that the project was or wasn't saved to the database.
							// If not saved, it was rolled back.
							//
							// If projectJson.specialProjectData.systemTypesEdited, the save code will collect and try to write a complete SQL script to the project root
							// directory that can be run to propagate any changes or additions to System Types. This script is written to ST.sql.
							// We attempt to write the SQL script only if the saving of the project to the database succeeded and wasn't rolled back.
							// This means that we could encounter two cases: the project was saved to the database and the script file was created successfully;
							// or the project was saved to the database and the script file wasn't created.
							// Object data is returned for both these cases with success=true.
							$.ajax({

								type: 'POST',
								url: '/BOL/ProjectBO/SaveProject',
								contentType: 'application/json',
								data: JSON.stringify(data),
								dataType: 'json',
								success: function (objectData, strTextStatus, jqxhr) {

									if (objectData.success) {

										// If was called from SaveProjectAsDialog, bChangeableName===false and we'll display results here.
										// If called from BuyDialog, results will be displayed by that dialog.
										if (!bChangeableName) {

											if (!objectData.project.specialProjectData.systemTypesEdited) {

												errorHelper.show('Project was saved', 2000);

											} else {
												
												if (objectData.scriptSuccess) {
													errorHelper.show("Your project was saved to the database and the System Type script ST.sql was created.", 5000);
												} else {
													errorHelper.show("Your project was saved to the database, but the System Type script COULD NOT be created. Writing the script failed with message: " + objectData.saveError.message + ".");
												}
											}
										}

										// objectData holds a completely filled in (likely modified) project: objectData.project.
										// We need to replace this with that. Let's try:
										
										self.unloadProject(null, false);	// We just saved. No callback and block displaying the "Abandon Project" dialog.
																			// This is the only place that calls client.unloadProject with 2nd param = false.
										
										// cause whichever dialog was open to close.
										self.closeCurrentDialog();

										// Set up the modified project.
										// specialProjectData.openMode might be "new". Change to "searched". It's no longer new.
										// This will get saving to work correctly down the road.
										objectData.project.specialProjectData.openMode = "searched";
										self.loadProjectIntoManager(objectData.project);
										self.setBrowserTabAndBtns();

										return null;

									} else {

										// !objectData.success -- error message in objectData.message
										self.closeCurrentDialog();
										self.unloadProject(null, false);

										return new Error(objectData.message);
									}
								},
								error: function (jqxhr, strTextStatus, strError) {

									// Non-computational error in strError
									return new Error(strError);
								}
							});

							return null;

						} catch (e) { return e; }
					}

					// If iProjectId = 1-5 (New Projects), then projectType will be defined as a string telling
					// the BO what kind of Project to build. Otherwise, it will be undefined.
					self.openProjectFromDB = function (iProjectId, callback) {

						try {

							var posting = $.post("/BOL/ProjectBO/RetrieveProject", 
								{
									projectId: iProjectId
									// userId: g_profile["userId"] not needed; sent in JWT
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									var exceptionRet = self.loadProjectIntoManager(data.project, callback);
									if (exceptionRet) { errorHelper.show(exceptionRet); }

								} else {

									// !data.success
									errorHelper.show(data.message);
								}
							});

							return null;

						} catch (e) { return e; }
					}

					self.loadProjectIntoManager = function (project, callback) {

						try {

							// Send the passed-in project into manager.
				    		exceptionRet = manager.load(project);
				    		if (exceptionRet) { return exceptionRet; }

							if ($.isFunction(callback)) {

								callback(project);
							
							} else {

					    		exceptionRet = manager.load(project);
					    		if (exceptionRet) { return exceptionRet; }

								self.setBrowserTabAndBtns();
							}

							return null;

						} catch (e) { return e; }
					};

					self.getProjectStatus = function (nameInHolding) {

						var objProject = manager.save();
						var test = parseInt(g_profile['userId'], 10);
						var nih = nameInHolding || '';
						return {

							inDBAlready: (objProject.id > 0),
							userOwnsProject: (objProject.ownedByUserId === test),
							allRequiredFieldsFilled: (	nih.trim().length > 0
											&& (objProject.imageId > 0 || objProject.altImagePath.length > 0)
										),
							projectNameIsFilled: (objProject.name.trim().length > 0)
						};
					};


//used
					self.addTypeToProject = function(clType) {

						try {

							return m_clProject.addType(clType);

						} catch (e) { return e; }
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

						} catch (e) { return e; }
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
							return null;

						} catch (e) { return e; }
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

							return null;

						} catch (e) { return e; }
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

						} catch (e) { return e; }
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

							return null;

						} catch (e) { return e; }
					}

//used
					self.addPropertyToActiveType = function (property) {

						try {

							var activeClType = types.getActiveClType();
							return self.addPropertyToType(property,
								activeClType);

						} catch (e) { return e; }
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

						} catch (e) { return e; }
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

						} catch (e) { return e; }
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

						} catch (e) { return e; }
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

							return null;

						} catch (e) { return e; }
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

						} catch (e) { return e; }
					}

					// Delete types.getActiveClType().data.methods[index].
					// Remove from code.
//used					
					self.deleteMethod = function(index) {

						try {

							return types.deleteMethod(index);

						} catch (e) { return e; }
					}

					// Delete types.getActiveClType().data.properties[index].
					// Remove from code.
//used					
					self.deleteProperty = function(index) {

						try {

							return types.deleteProperty(index);

						} catch (e) { return e; }
					}

					// Delete types.getActiveClType().data.events[index].
					// Remove from code.
//used					
					self.deleteEvent = function(index) {
						
						try {

							return types.deleteEvent(index);

						} catch (e) { return e; }
					}

					//////////////////////////////
					// Miscellaneous helpers.
					self.getNumberOfTypesInActiveComic = function () {

						try {

							return types.getLength();

						} catch (e) { throw e; }
					}

					// If no active project, returns call unloadedCallback in order to proceed to New Project or whatever.
					// If active project, displays BootstrapDialog asking user.
					// If user says to abandon, it empties and clears project and returns null.
					// If user says not to abandon, it returns project.
					// On exception, it also returns project, but state may be compromised (i.e., partially removed)--needs further work.
					self.unloadProject = function (unloadedCallback, bShowAbandonDlg) {

						try {

							if (manager.loaded) {
							
								m_functionAbandonProjectDialog(function() {	

									// This callback will be called if the user wants to abandon the open project.
									try {

										var exceptionRet = manager.clearPanels();
										if (exceptionRet) { throw exceptionRet; }

										// m_clProject = null;

										self.setBrowserTabAndBtns();

										// Disable the TypeWell icons that are enabled if a project is loaded.
										// $(".disabledifnoproj").prop("disabled", true);

										// Remove tooltip functionality from TypeWell icons.
										// $(".disabledifnoproj").powerTip({
										// 	smartPlacement: true,
										// 	manual: true
										// });
										
										// Empty the toolstrip, designer, comicstrip and typewell.
										// tools.empty();

										if ($.isFunction(unloadedCallback)) {
 											unloadedCallback();
										}

									} catch(e) { errorHelper.show(e); }
								},
								bShowAbandonDlg);	// If bShowAbandonDlg is false, will just return. No better way.

							} else {

								if ($.isFunction(unloadedCallback))
									unloadedCallback();
							}
						} catch (e) { errorHelper.show(e); }
					}

					// Helper method replaces spaces with underscores.
					self.removeSpaces = function (strPossiblyWithSpaces) {

						return strPossiblyWithSpaces.replace(/ /g, '_');
					};

					//////////////////////////////
					// Project helper methods.
					self.setBrowserTabAndBtns = function () {

						document.title = "TechGroms";
						if (manager.loaded) {

							var objProject = manager.save();
							if (objProject.name.length > 0) { document.title = document.title + " / " + objProject.name; }
						}

						// Something happened so refresh the navbar.
						navbar.enableOrDisableProjAndTypeMenuItems();
						navbar.enableOrDisablePlayAndStopButtons();

						if (g_profile.can_visit_adminzone) {

							navbar.enableOrDisableAminZoneMenuItems();
						}
					}

					self.getProject = function () {

						return m_clProject;
					};

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
					// var m_clProject = null;
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
