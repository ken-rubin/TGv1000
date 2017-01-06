///////////////////////////////
// Client module runs client state and manages gui/server interaction.
//
// Return constructor function.
//

// Define module and require dependencies.
define(["Core/errorHelper",
		"Dialogs/OpenProjectDialog/OpenProjectDialog",
		"Dialogs/SaveProjectAsDialog/SaveProjectAsDialog",
		"Dialogs/ImageDiskDialog/ImageDiskDialog",
		"Dialogs/ImageURLDialog/ImageURLDialog",
		"Dialogs/ImageSearchDialog/ImageSearchDialog",
		"Dialogs/BuyDialog/BuyDialog",
		"Dialogs/AZActivatePPDialog/AZActivatePPDialog",
		"Dialogs/AZUsersDialog/AZUsersDialog",
		"Dialogs/AZProjectsDialog/AZProjectsDialog",
		"Dialogs/AZSavePPDataDialog/AZSavePPDataDialog",
		"Dialogs/AZPPBuyersDialog/AZPPBuyersDialog"
		],
	function (errorHelper,
				OpenProjectDialog,
				SaveProjectAsDialog,
				ImageDiskDialog,
				ImageURLDialog,
				ImageSearchDialog,
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

					// This is the official repo for a project. Manager holds a reference to it, and we'll save this.
					self.project = null;

					//////////////////////////////
					// Public methods.

					// Start off the client.
					self.create = function (callback) {

						try {

							// "Normal" users get their last project loaded automatically.
							if (!manager.userCanWorkWithSystemLibsAndTypes) {

								// The following code is here, not in main.js, because localStorage.getItem is synchronous, but it acts like asynchronous.
								var lastProject = g_profile["lastProject"];
								var lastProjectId = 0;
								if (g_profile["lastProjectId"]) {

									lastProjectId = parseInt(g_profile["lastProjectId"], 10);
								}

								// If lastProjectId, fetch it and load it into manager.
								if (lastProjectId) {

									self.openProjectFromDB(lastProjectId, 'editOwn',
										function() {

											BootstrapDialog.show({
												type: BootstrapDialog.TYPE_INFO,
												message: "Your latest project, " + lastProject + ", has been loaded. (Click outside this area to proceed.)",
												closable: true, // <-- Default value is false
												draggable: true // <-- Default value is false
											});

											if ($.isFunction(callback)) { callback(); }
										}
									);
								} else {

									if ($.isFunction(callback)) { callback(); }
								}
							} else {
								// Privileged user.

								self.openProjectFromDB(6, 'new',
									function() {

										self.project.isCoreProject = false;

										// We could also do these things that used to be done in the BO, but we aren't--at least for now.
						                        //     comicIth.id = 0;

										self.project.name = 'noname';
										self.project.tags = '';
										self.project.description = '';
										if (self.project.imageId) {
											self.project.altImagePath = '';
										}
										self.project.ownedByUserId = parseInt(g_profile["userId"], 10);

										// Now we'll add the fields to the project that will both tell the rest of the UI how to handle it and will affect how it gets saved to the database.
										let spd = {
											userAllowedToCreateEditPurchProjs: manager.userAllowedToCreateEditPurchProjs,
											userCanWorkWithSystemLibsAndTypes: manager.userCanWorkWithSystemLibsAndTypes,
											ownedByUser: true,
											othersProjects: false,
											normalProject: true,
											coreProject: false,
											classProject: false,
											productProject: false,
											onlineClassProject: false,
											comicsEdited: false,
											systemTypesEdited: false,
											openMode: 'new'
										};
										self.project.specialProjectData = Object.assign(self.project.specialProjectData, spd);
							    		var exceptionRet = manager.loadProject(self.project);
							    		if (exceptionRet) { throw exceptionRet; }

										if ($.isFunction(callback)) { callback(); }
									}
								);
							}

							return null;

						} catch (e) { return e; }
					}

					// Called here in client, but also by navbar.
					// self.loadSystemTypesAndPinPanels = function (callback) {

					// 	// While others get all system types, statements, literals and expressions loaded.
					// 	var posting = $.post("/BOL/ProjectBO/FetchForPanels_S_L_E_ST",
					// 		{},
					// 		'json');
					// 	posting.done(function(data){

					// 		if (data.success) {

					// 			var exceptionRet = manager.loadSystemTypesProject(data.data);
					// 			if (exceptionRet) {

					// 				errorHelper.show(exceptionRet);
					// 			}

					// 			if ($.isFunction(callback)) {
					// 				callback();
					// 			}
					// 		} else {

					// 			// !data.success
					// 			errorHelper.show(data.message);

					// 			if ($.isFunction(callback)) {
					// 				callback();
					// 			}
					// 		}
					// 	});
					// }

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

					self.showNewProjectDialog = function (arrayAvailProjTypes) {

						try {

/*							m_openDialog = new NewProjectDialog();
							var exceptionRet = m_openDialog.create(arrayAvailProjTypes);
							if (exceptionRet) { throw exceptionRet; }
*/
							// Switch center panel to new version of NewProjectDialog.
							exceptionRet = manager.createNewProject(arrayAvailProjTypes);
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
							if (exceptionRet) { throw exceptionRet; }

							// Also show OpenProject in center panel. It will replace OpenProjectDialog.
							exceptionRet = manager.openProject();
							if (exceptionRet) { throw exceptionRet; }

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

							// Also show new SaveProject in center panel until it replaces SaveProjectAsDialog.
							exceptionRet = manager.saveProject();
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
					self.saveProjectToDB = function (callback) {

						try {

							// Call manager.save(). Manager will use its reference to self.project (self = Client.js) to
							// update the project in client so we can go forward with the save.
							var exceptionRet = manager.save();

							if (exceptionRet) { return exceptionRet; }

							var data = {
									// userId: g_profile["userId"], not needed; sent in JWT
									// userName: g_profile["userName"], not needed; sent in JWT
									projectJson: self.project,
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

										errorHelper.show('Your project, ' + objectData.project.name + ', was saved.', 2000);

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
										self.project = objectData.project;
										self.loadProjectIntoManager();
										self.setBrowserTabAndBtns();

										return callback(null);

									} else {

										// !objectData.success -- error message in objectData.message
										// self.closeCurrentDialog();
										// self.unloadProject(null, false);

										return callback(new Error(objectData.message));
									}
								},
								error: function (jqxhr, strTextStatus, strError) {

									// Non-computational error in strError
									return new callback(new Error(strError));
								}
							});
						} catch (e) { return callback(e); }
					}

					// strWhatToSave = 'project' saves self.project.
					//				 = '0,2' saves self.project.comics[0].libraries[2].
					// nameToUse is required.
					self.saveAsJSON = function (strWhatToSave, nameToUse) {

						try {

							var exceptionRet = manager.save();
							if (exceptionRet) {

								return exceptionRet;
							}

							var objectData = null;
							if (strWhatToSave === 'project') {

								objectData = self.project;

							} else {

								var arrInts = $.map(strWhatToSave.split(','), function(val){ return parseInt(val, 10)});
								objectData = self.project.comics[arrInts[0]].libraries[arrInts[1]];
							}

							var jsonArray = JSON.stringify(objectData, undefined, 4).split('\r\n');
							var file = new File(jsonArray, nameToUse + ".json", {type: "text/plain;charset=utf-8"});
							saveAs(file);

							return null;

						} catch(e) {

							return e;
						}
					}

					// Called by BuyDialog.
					self.saveProjectToDBNoGetFromManager = function (callback) {

						try {

							var data = {
									// userId: g_profile["userId"], not needed; sent in JWT
									// userName: g_profile["userName"], not needed; sent in JWT
									projectJson: self.project,
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
										self.project = objectData.project;
										self.loadProjectIntoManager();
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

					self.searchLibraries = function (searchPhrase, callback) {

						try {

							var posting = $.post("/BOL/UtilityBO/SearchLibraries",
								{
									searchPhrase: searchPhrase
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									return callback(null, data.libraries);
								} else {

									// !data.success
									return callback(new Error(data.message), null);
								}
							});
						} catch (e) { return callback(e, null); }
					}

					self.openProjectFromDB = function (iProjectId, strMode, callback) {

						try {

							var posting = $.post("/BOL/ProjectBO/RetrieveProject",
								{
									projectId: iProjectId,
									mode: strMode
									// userId: g_profile["userId"] not needed; sent in JWT
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									self.project = data.project;

									// This might be a temporary work-around.
									if (iProjectId <= 6) {

										callback();

									} else {

										var exceptionRet = self.loadProjectIntoManager(callback);
										if (exceptionRet) { errorHelper.show(exceptionRet); }

										self.setBrowserTabAndBtns();
									}
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
					// callback is always present to complete the process.
					self.openProjectFromDBNoLoadIntoManager = function (iProjectId, strMode, callback) {

						try {

							var posting = $.post("/BOL/ProjectBO/RetrieveProject",
								{
									projectId: iProjectId,
									mode: strMode
									// userId: g_profile["userId"] not needed; sent in JWT
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									self.project = data.project;
									callback();

								} else {

									// !data.success
									errorHelper.show(data.message);
								}
							});

							return null;

						} catch (e) { return e; }
					}

					self.loadProjectIntoManager = function (callback) {

						try {

							// Send the project into manager.
				    		var exceptionRet = manager.loadProject(self.project);
				    		if (exceptionRet) { return exceptionRet; }

							if ($.isFunction(callback)) {

								// For some reason the callback is calling client.setBrowserTabAndBtns().
								callback();

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

							inDBAlready: (client.project.id > 0),
							userOwnsProject: (client.project.ownedByUserId === test),
							allRequiredFieldsFilled: (	nih.trim().length > 0
											&& (client.project.imageId > 0 || client.project.altImagePath.length > 0)
										),
							projectNameIsFilled: (client.project.name.trim().length > 0)
						};
					};

					// If no active project, returns call unloadedCallback in order to proceed to New Project or whatever.
					// If active project, displays BootstrapDialog asking user.
					// If user says to abandon, it empties and clears project and returns null.
					// If user says not to abandon, it returns project.
					// On exception, it also returns project, but state may be compromised (i.e., partially removed)--needs further work.
					self.unloadProject = function (unloadedCallback, bShowAbandonDlg, bFromCloseProjectMenuItem) {

						try {

							var closeProjectMenuItem = bFromCloseProjectMenuItem || false;

							if (manager.projectLoaded || manager.systemTypesLoaded) {

								m_functionAbandonProjectDialog(function() {

									// This callback will be called if the user wants to abandon the open project.
									try {

										var exceptionRet;
										if (bFromCloseProjectMenuItem || false) {

											exceptionRet = manager.loadProject(null);	// Used to be manager.loadNoProject(), but that's gone now.

										} else {

											exceptionRet = manager.loadProject(null);
										}
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

						if (navbar === null) {

							return;
						}

						document.title = "NWC";
						if (manager.projectLoaded) {

							if (client.project.name.length > 0) { document.title += " / " + client.project.name; }
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
