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
		"Dialogs/TypeSearchDialog/TypeSearchDialog", 
		"Dialogs/ImageDiskDialog/ImageDiskDialog", 
		"Dialogs/ImageURLDialog/ImageURLDialog", 
		"Dialogs/ImageSearchDialog/ImageSearchDialog",
		"Dialogs/MethodSearchDialog/MethodSearchDialog",
		"Dialogs/BuyDialog/BuyDialog",
		"Dialogs/AZActivatePPDialog/AZActivatePPDialog",
		"Dialogs/AZUsersDialog/AZUsersDialog",
		"Dialogs/AZProjectsDialog/AZProjectsDialog",
		"Dialogs/AZSavePPDataDialog/AZSavePPDataDialog",
		"Dialogs/AZPPBuyersDialog/AZPPBuyersDialog"
		],
	function (errorHelper, 
				NewProjectDialog, 
				OpenProjectDialog,
				SaveProjectAsDialog,
				TypeSearchDialog, 
				ImageDiskDialog, 
				ImageURLDialog, 
				ImageSearchDialog, 
				MethodSearchDialog,
				BuyDialog,
				AZActivatePPDialog,
				AZUsersDialog,
				AZProjectsDialog,
				AZSavePPDataDialog,
				AZPPBuyersDialog
				) {

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

					// To remedy an order of creation problem.
					self.postCreate = function () {

						try {

							// "Normal" users get their last project loaded automatically.
							if (!manager.userCanWorkWithSystemTypesAndAppBaseTypes) {

								// The following code is here, not in main.js, because localStorage.getItem is synchronous, but asynchronous-like. I think.
								// At least it didn't work at the bottom of the callback in main.js.
								var lastProject = g_profile["lastProject"];
								var lastProjectId = 0;
								if (g_profile["lastProjectId"]) {

									lastProjectId = parseInt(g_profile["lastProjectId"], 10);
								}

								// If lastProjectId, fetch it and load it into manager.
								if (lastProjectId) {

									self.openProjectFromDB(lastProjectId,
										function(project) {

											BootstrapDialog.show({
												type: BootstrapDialog.TYPE_INFO,
												message: "Your latest project, " + lastProject + ", has been loaded. (Click outside this area to proceed.)",
												closable: true, // <-- Default value is false
												draggable: true // <-- Default value is false
											});
										}
									);
								}
							} else {

								self.loadSystemTypesAndPinPanels();
							}

							return null;

						} catch (e) { return e; }
					}

					self.loadSystemTypesAndPinPanels = function () {

						// While others get all system types, statements, literals and expressions loaded.
						var posting = $.post("/BOL/ProjectBO/FetchForPanels_S_L_E_ST", 
							{},
							'json');
						posting.done(function(data){

							if (data.success) {

								manager.clearPanels();

								// data.data is a 4xN ragged array of [0] systemtypes; [1] statements; [2] literals; [3] expressions.
								// Load them into the manager
								var exceptionRet = manager.loadSystemTypes(data.data[0]);
								if (exceptionRet) { errorHelper.show(exceptionRet); }
								exceptionRet = manager.loadStatements(data.data[1]);
								if (exceptionRet) { errorHelper.show(exceptionRet); }
								exceptionRet = manager.loadLiterals(data.data[2]);
								if (exceptionRet) { errorHelper.show(exceptionRet); }
								exceptionRet = manager.loadExpressions(data.data[3]);
								if (exceptionRet) { errorHelper.show(exceptionRet); }

								manager.openAndPinAllPanels();

								self.setBrowserTabAndBtns();

							} else {

								// !data.success
								errorHelper.show(data.message);
							}
						});
					}

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

					self.showBuyDialog = function (ppData) {

						try {

							m_openDialog = new BuyDialog();
							var exceptionRet = m_openDialog.create(ppData);
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

					// This is done without a pre-save dialog.
					self.saveSystemTypes = function () {

						try {

							var arraySystemTypes = manager.saveSystemTypes();

							var posting = $.post("/BOL/ProjectBO/SaveSystemTypes", 
								{
									systemtypesarray: arraySystemTypes
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									if (data.scriptSuccess) {
										errorHelper.show("System types were saved to the database, and ST.sql was saved to your drive.", 5000);
									} else {
										errorHelper.show("System types were saved to the database, but we could not save ST.sql to your drive. Error received: " + data.saveError);
									}
								} else {

									// !data.success
									errorHelper.show("System types failed to save to the database with error: " + data.message);
								}
							});
						} catch (e) {

							errorHelper.show("System types failed to save to the database with error: " + e.message);
						}
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

					self.showMethodSearchDialog = function (functionOK) {

						try {

							m_openDialog = new MethodSearchDialog();
							var exceptionRet = m_openDialog.create(functionOK);
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

					self.showAZSitesDialog = function() {

						try {

							m_openDialog = new AZSitesDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showSZUsersDialog = function() {

						try {

							m_openDialog = new SZUsersDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					self.showSZProjectsDialog = function() {

						try {

							m_openDialog = new SZProjectsDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch (e) { return e; }
					}

					//////////////////////////////
					// "functionOK" links.
					// These are callbacks from, e.g., Select or Create buttons in dialogs.
					// Not all of these come back through client. Some places handle the processing internally.

					// Called by SaveProjectAsDialog.
					self.saveProjectToDB = function () {

						try {

							// Retrieve content of manager: the whole project.
							var objProject = manager.save();

							var data = {
									// userId: g_profile["userId"], not needed; sent in JWT
									// userName: g_profile["userName"], not needed; sent in JWT
									projectJson: objProject,
									changeableName: false
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

										if (!objectData.project.specialProjectData.systemTypesEdited) {

											errorHelper.show('Project was saved', 2000);

										} else {
											
											if (objectData.scriptSuccess) {
												errorHelper.show("Your project was saved to the database and the System Type script ST.sql was created.", 5000);
											} else {
												errorHelper.show("Your project was saved to the database, but the System Type script COULD NOT be created. Writing the script failed with message: " + objectData.saveError.message + ".");
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
										// self.closeCurrentDialog();
										// self.unloadProject(null, false);

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

					// Called by BuyDialog.
					self.saveProjectToDBNoGetFromManager = function (project, callback) {

						try {

							var data = {
									// userId: g_profile["userId"], not needed; sent in JWT
									// userName: g_profile["userName"], not needed; sent in JWT
									projectJson: project,
									changeableName: true
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

										// objectData holds a completely filled in (likely modified) project: objectData.project.
										// We need to replace this with that. Let's try:
										
										// self.unloadProject(null, false);	// We just saved. No callback and block displaying the "Abandon Project" dialog.
										// 									// This is the only place that calls client.unloadProject with 2nd param = false.
										
										// Set up the modified project.
										// specialProjectData.openMode might be "new". Change to "searched". It's no longer new.
										// This will get saving to work correctly down the road.
										objectData.project.specialProjectData.openMode = "searched";
										self.loadProjectIntoManager(objectData.project);
										self.setBrowserTabAndBtns();

										callback(null);

									} else {

										callback(new Error(objectData.message));
									}
								},
								error: function (jqxhr, strTextStatus, strError) {

									// Non-computational error in strError
									callback(new Error(strError));
								}
							});
						} catch (e) { callback(e); }
					}

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

									self.setBrowserTabAndBtns();

								} else {

									// !data.success
									errorHelper.show(data.message);
								}
							});

							return null;

						} catch (e) { return e; }
					}

					// This one is used in BuyDialog after a purchase is completed.
					// It is also used when client is created to load latest project.
					// callback is always present to return the project.
					self.openProjectFromDBNoLoadIntoManager = function (iProjectId, callback) {

						try {

							var posting = $.post("/BOL/ProjectBO/RetrieveProject", 
								{
									projectId: iProjectId
									// userId: g_profile["userId"] not needed; sent in JWT
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									callback(data.project);

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
				    		var exceptionRet = manager.load(project);
				    		if (exceptionRet) { return exceptionRet; }

							if ($.isFunction(callback)) {

								// For some reason the callback is calling client.setBrowserTabAndBtns().
								callback(project);
							
							} else {

								self.setBrowserTabAndBtns();
							}

							return null;

						} catch (e) { return e; }
					};

					self.getProjectStatus = function (nameInHolding) {

						var test = parseInt(g_profile['userId'], 10);
						var nih = nameInHolding || '';
						return {

							inDBAlready: (manager.projectData.id > 0),
							userOwnsProject: (manager.projectData.ownedByUserId === test),
							allRequiredFieldsFilled: (	nih.trim().length > 0
											&& (manager.projectData.imageId > 0 || manager.projectData.altImagePath.length > 0)
										),
							projectNameIsFilled: (manager.projectData.name.trim().length > 0)
						};
					};


// //used
// 					self.addTypeToProject = function(clType) {

// 						try {

// 							return m_clProject.addType(clType);

// 						} catch (e) { return e; }
// 					}

// //used
// 					// Note: updateClType has .data; origType doesn't.
// 					self.updateTypeInProject = function(updatedClType, activeClComic, origType, iTypeIndex) {

// 						try {

// 							activeClComic.data.types.items[iTypeIndex] = updatedClType.data;

// 							var origClType = new Type();
// 							origClType.load(origType);
// 							exceptionRet = code.replaceType(updatedClType, origClType);
// 							if (exceptionRet) { throw exceptionRet; }
							
// 							return null;

// 						} catch (e) { return e; }
// 					}

// //used
// 					self.addTypeToProjectFromDB = function (iTypeId) {

// 						try {

// 							var posting = $.post("/BOL/ProjectBO/RetrieveType", 
// 								{
// 									typeId: iTypeId
// 								},
// 								'json');
// 							posting.done(function(data){

// 								if (data.success) {

// 									var clType = new Type();
// 									clType.load(data.type);
// 									return m_clProject.addType(clType);

// 								} else {

// 									// !data.success
// 									return new Error(data.message);
// 								}
// 							});
// 							return null;

// 						} catch (e) { return e; }
// 					}

// //used
// 					// We are going to add the method to the bottom of the methods array
// 					// of the active Type; then add requisite info to code's schema info;
// 					// then rebuild the TypeWell methods grid;
// 					// then we'll hand-click the method in the grid.
// 					self.addMethodToActiveType = function (method) {

// 						try {

// 							var activeClType = types.getActiveClType();
// 							activeClType.data.methods.push(method);

// 							var iMethodIndex = activeClType.data.methods.length - 1;

// 							// var exceptionRet = types.functionSetActiveMethodIndex(iMethodIndex);
// 							// if (exceptionRet) { throw exceptionRet; }

// 							// Add the method to code.
// 							var exceptionRet = code.addMethod(activeClType, 
// 								method);
// 							if (exceptionRet) { throw exceptionRet; }

// 							// exceptionRet = code.load(method.workspace);
// 							// if (exceptionRet) { throw exceptionRet; }

// 							exceptionRet = types.regenTWMethodsTable();
// 							if (exceptionRet) { throw exceptionRet; }

// 							// Scroll the methods grid to the bottom.
// 							$("#methodrename_" + iMethodIndex.toString()).scrollintoview();

// 							// Now click the new method in the grid to load the code pane.
// 							$("#method_" + iMethodIndex.toString()).click();

// 							return null;

// 						} catch (e) { return e; }
// 					}
// // used
// 					self.updateMethodInActiveType = function(updatedMethod, origMethod, iMethodIndex, activeClType) {

// 						try {

// 							activeClType.data.methods[iMethodIndex] = updatedMethod;

// 							var exceptionRet = types.regenTWMethodsTable();
// 							if (exceptionRet) { throw exceptionRet; }

// 							exceptionRet = code.replaceMethod(updatedMethod, origMethod, activeClType);
// 							if (exceptionRet) { throw exceptionRet; }
							
// 							// Now click the updated method in the grid to load the code pane.
// 							$("#method_" + iMethodIndex.toString()).click();

// 							return null;

// 						} catch (e) { return e; }
// 					}

// //used
// 					self.addEventToActiveType = function (event) {

// 						try {

// 							var activeClType = types.getActiveClType();
// 							activeClType.data.events.push(event);

// 							// Add the method to code.
// 							var exceptionRet = code.addEvent(activeClType, 
// 								event);
// 							if (exceptionRet) { throw exceptionRet; }

// 							exceptionRet = types.regenTWEventsTable();
// 							if (exceptionRet) { throw exceptionRet; }

// 							// Now do something to scroll the events grid to the bottom.
// 							$("#eventrename_" + (activeClType.data.events.length - 1).toString()).scrollintoview();

// 							return null;

// 						} catch (e) { return e; }
// 					}

// //used
// 					self.addPropertyToActiveType = function (property) {

// 						try {

// 							var activeClType = types.getActiveClType();
// 							return self.addPropertyToType(property,
// 								activeClType);

// 						} catch (e) { return e; }
// 					}

// 					self.addPropertyToType = function (property, clType) {

// 						try {

// 							clType.data.properties.push(property);

// 							// Add the property to code.
// 							var exceptionRet = code.addProperty(clType, 
// 								property);
// 							if (exceptionRet) { throw exceptionRet; }

// 							exceptionRet = types.regenTWPropertiesTable();
// 							if (exceptionRet) { throw exceptionRet; }

// 							// Now do something to scroll the props grid to the bottom.
// 							$("#propertyedit_" + (clType.data.properties.length - 1).toString()).scrollintoview();

// 							return null;

// 						} catch (e) { return e; }
// 					}

// //used
// 					self.updatePropertyInActiveType	= function (property, index, strOriginalName) {

// 						try {

// 							var activeClType = types.getActiveClType();
// 							activeClType.data.properties[index] = property;

// 							// Add the property to code.
// 							var exceptionRet = code.replaceProperty(activeClType, 
// 								property,
// 								strOriginalName);
// 							if (exceptionRet) { throw exceptionRet; }

// 							exceptionRet = types.regenTWPropertiesTable();
// 							if (exceptionRet) { throw exceptionRet; }

// 							return null;

// 						} catch (e) { return e; }
// 					}

// //used
// 					self.renameEventInActiveType = function (strNewName, index, strOriginalName) {

// 						try {

// 							var activeClType = types.getActiveClType();
// 							var oldEvent = activeClType.data.events[index];
// 							oldEvent.name = strNewName;
// 							activeClType.data.events[index] = oldEvent;

// 							// Call Code.js#renameEvent(clType, event, strOriginalName).
// 							var exceptionRet = code.renameEvent(activeClType, oldEvent, strOriginalName);
// 							if (exceptionRet) { throw exceptionRet; }

// 							return types.regenTWEventsTable();

// 						} catch (e) { return e; }
// 					}

// //used
// 					self.addMethodToTypeFromDB = function (iMethodId) {

// 						try {

// 							var posting = $.post("/BOL/ProjectBO/RetrieveMethod", 
// 								{
// 									methodId: iMethodId
// 								},
// 								'json');
// 							posting.done(function(data){

// 								if (data.success) {

// 									return self.addMethodToActiveType(data.method);

// 								} else {

// 									// !data.success
// 									return new Error(data.message);
// 								}
// 							});

// 							return null;

// 						} catch (e) { return e; }
// 					}

// 					// Delete types.getActiveClType() from ???
// 					// Remove from code, toolstrip, designer, etc.
// //used					
// 					self.deleteType = function() {

// 						try {

// 							var clType = types.getActiveClType(true);	// Param true tells method we're removing so a new active type needs assigning.

// 							var exceptionRet = comics.removeType(clType);
// 							if (exceptionRet) { return exceptionRet; }

// 							exceptionRet = code.removeType(clType);
// 							if (exceptionRet) { return exceptionRet; }

// 							// clType has been returned so we can now remove it from tools. It has already been spliced out of project.comic.types.
// 							// This will remove it from the tools strip and tidy that up (height of Slider, etc.).
// 							exceptionRet = tools.removeItem(clType);
// 							if (exceptionRet) { return exceptionRet; }

// 							return null;

// 						} catch (e) { return e; }
// 					}

// 					// Delete types.getActiveClType().data.methods[index].
// 					// Remove from code.
// //used					
// 					self.deleteMethod = function(index) {

// 						try {

// 							return types.deleteMethod(index);

// 						} catch (e) { return e; }
// 					}

// 					// Delete types.getActiveClType().data.properties[index].
// 					// Remove from code.
// //used					
// 					self.deleteProperty = function(index) {

// 						try {

// 							return types.deleteProperty(index);

// 						} catch (e) { return e; }
// 					}

// 					// Delete types.getActiveClType().data.events[index].
// 					// Remove from code.
// //used					
// 					self.deleteEvent = function(index) {
						
// 						try {

// 							return types.deleteEvent(index);

// 						} catch (e) { return e; }
// 					}

// 					//////////////////////////////
// 					// Miscellaneous helpers.
// 					self.getNumberOfTypesInActiveComic = function () {

// 						try {

// 							return types.getLength();

// 						} catch (e) { throw e; }
// 					}

					// If no active project, returns call unloadedCallback in order to proceed to New Project or whatever.
					// If active project, displays BootstrapDialog asking user.
					// If user says to abandon, it empties and clears project and returns null.
					// If user says not to abandon, it returns project.
					// On exception, it also returns project, but state may be compromised (i.e., partially removed)--needs further work.
					self.unloadProject = function (unloadedCallback, bShowAbandonDlg) {

						try {

							if (manager.projectLoaded || manager.systemTypesLoaded) {
							
								m_functionAbandonProjectDialog(function() {	

									// This callback will be called if the user wants to abandon the open project.
									try {

										var exceptionRet = manager.clearPanels();
										if (exceptionRet) { throw exceptionRet; }

										self.setBrowserTabAndBtns();

										if ($.isFunction(unloadedCallback)) {
											unloadedCallback();
										}
									} catch(e) { errorHelper.show(e); return; }
								},
								bShowAbandonDlg);	// If bShowAbandonDlg is false, will just return. No better way.
							} else {
								
								if ($.isFunction(unloadedCallback)) {
									unloadedCallback();
								}
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

						document.title = "NWC";
						if (manager.projectLoaded) {

							if (manager.projectData.name.length > 0) { document.title += " / " + manager.projectData.name; }
							navbar.setSaveBtnText("Save Project");
						
						} else if (manager.systemTypesLoaded) {

							document.title += " / System types";
							navbar.setSaveBtnText("Save System Types");
						}

						// Something happened so refresh the navbar.
						navbar.enableOrDisableProjAndTypeMenuItems();
						navbar.enableOrDisablePlayAndStopButtons();

						if (g_profile.can_visit_adminzone) {

							navbar.enableOrDisableAminZoneMenuItems();
						}

						if (g_profile.can_manage_site) {

							navbar.enableOrDisableSiteZoneMenuItems();
						}
					}

					// self.getProject = function () {

					// 	return m_clProject;
					// };

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
