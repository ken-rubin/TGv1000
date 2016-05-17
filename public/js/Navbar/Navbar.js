/////////////////////////////////////////
// Navbar wraps code associated with the navbar.
//
// Return constructor function.
//

// Define module.
define(["Core/errorHelper"], 
	function (errorHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function Navbar() {

				try {

					var self = this;			// Uber closure.

					////////////////////////////////
					// Pulbic methods.

					// Create instance to DOM.
					self.create = function () {

						try {

							// Wire projects buttons.
							$("#NewProjectButton").click(function () {

								try {

									client.unloadProject(function() {		// callback is executed if client decided to abandon or if there was no project to begin with.

										var exceptionRet = client.showNewProjectDialog();
										if (exceptionRet) { throw exceptionRet; }
									}, 
									true);	// true means to show the Abandon dlg if applicable.
								} catch (e) { errorHelper.show(e); }
							});

							$("#OpenProjectButton").click(
								// This is the click event handler--not strictly a callback.
								function () {

									try {

										client.unloadProject(
											// This callback is executed if user decided to abandon or if there was no project to begin with.
											// If user decides not to abandon the current project, OpenProjectDialog won't call this callback
											// and he'll continue with the current project as if he never clicked the Search menu item.
											function() {		

												try {
													var exceptionRet = client.showOpenProjectDialog(
														// This callback is executed if the user searches for and chooses a project to open.
														// It is called m_functionOK in OpenProjectDialog.
														// OpenProjectDialog will come here only in these cases:
														// (1) A privileged user is opening a project.
														// (2) A non-privileged user is NOT considering buying a purchasable project.
														// If a non-privileged user selects a purchasable project, OpenProjectDialog will close itself and call client to open BuyDialog with all the info
														// that BuyDialog needs.

														// iProjectId is the project to fetch.
														function (iProjectId, bPrivilegedUser, bOnlyOwnedByUser, bOnlyOthersProjects) {

															try {

																var exceptionRet = null;

																if (iProjectId > 0) {

																	exceptionRet = client.openProjectFromDB(iProjectId,
																		// This callback is called from client.loadProjectIntoManager to add specialProjectData to the project.
																		// Note: if the project is a Product, Class or Online Class, then that extra information is already
																		// in the project in specialProjects when it is retrieved from the BO. Thus we extend and merge here, not set =.
																		function(objProject) {

																			try {

																				// objProject.specialProjectData exists, but it's empty unless its a Purchasable Project in
																				// which case is contains a property holding class, product or onlineClass data.
																				// Create and merge rest of specialProjectData in.
																				specialProjectData = {
																					privilegedUser: bPrivilegedUser,
																					ownedByUser: bOnlyOwnedByUser,
																					othersProjects: bOnlyOthersProjects,
																					normalProject: (objProject.isCoreProject+objProject.isClass+objProject.isProduct+objProject.isOnlineClass === 0),
																					coreProject: objProject.isCoreProject,
																					classProject: objProject.isClass,
																					productProject: objProject.isProduct,
																					onlineClassProject: objProject.isOnlineClass,
																					comicsEdited: false,
																					systemTypesEdited: false,
																					openMode: 'searched'
																				};

																				$.extend(true, objProject.specialProjectData, specialProjectData);

																			} catch (e) { errorHelper.show(e); }
																		}
																	);
																	if (exceptionRet) { throw exceptionRet; }

																} else {

																	throw new Error("Invalid project id returned.");
																}
															} catch (e) { errorHelper.show(e); }
														}
													);
													if (exceptionRet) { throw exceptionRet; }

												} catch (e) { errorHelper.show(e); }
											},
											true		// true means to show the Abandon dlg if applicable.
										);
									} catch (e) { errorHelper.show(e); }
								}
							);

							$("#SaveProjectButton").click(function () {
								try {
									var exceptionRet = client.showSaveProjectDialog();
									if (exceptionRet) { throw exceptionRet; }
								} catch (e) { errorHelper.show(e); }
							});

							$("#CloseProjectButton").click(function () {

								client.unloadProject(function(){ 
									self.enableOrDisableProjAndTypeMenuItems(); 
									self.enableOrDisableAminZoneMenuItems(); 
									self.enableOrDisablePlayAndStopButtons();
								}, true);
							});

							$("#NewTypeButton").click(function() {
								try {
									var exceptionRet = client.showNewTypeDialog();
									if (exceptionRet) { throw exceptionRet; }
								} catch(e) { errorHelper.show(e); }
							});

							$("#SearchTypeButton").click(function() {
								try {
									var exceptionRet = client.showTypeSearchDialog(function(iTypeId) {
										try {
											if (iTypeId > 0) {
												exceptionRet = client.addTypeToProjectFromDB(iTypeId);
												if (exceptionRet) { throw exceptionRet; }
											} else { throw new Error("Invalid type id returned."); }
										} catch(e) { errorHelper.show(e); }
									});
									if (exceptionRet) { throw exceptionRet; }
								} catch (e) { errorHelper.show(e); }
							});

							$("#NewMethodButton").click(function() {
								try {
									var exceptionRet = client.showNewMethodDialog();
									if (exceptionRet) { throw exceptionRet; }
								} catch(e) { errorHelper.show(e); }
							});

							$("#SearchMethodButton").click(function() {
								try {
									var exceptionRet = client.showMethodSearchDialog(function(iMethodId) {
										try {
											if (iMethodId > 0) {
												exceptionRet = client.addMethodToTypeFromDB(iMethodId);
												if (exceptionRet) { throw exceptionRet; }
											} else { throw new Error("Invalid method id returned."); }
										} catch(e) { errorHelper.show(e); }
									});
									if (exceptionRet) { throw exceptionRet; }
								} catch (e) { errorHelper.show(e); }
							});

							$("#NewPropertyButton").click(function() {
								try {
									var exceptionRet = client.showNewPropertyDialog();
									if (exceptionRet) { throw exceptionRet; }
								} catch(e) { errorHelper.show(e); }
							});

							$("#NewEventButton").click(function() {
								try {
									var exceptionRet = client.showNewEventDialog();
									if (exceptionRet) { throw exceptionRet; }
								} catch(e) { errorHelper.show(e); }
							});

							if (g_profile.can_visit_adminzone) {

								// Show Adminzone button.
								$("#AdminzoneLI").css("display", "block");

								$("#UsersButton").click(function() {

									// AZUsersDialog is where user maintenance takes place, including usergroup creation, modification
									// and assignment. Other user maintenance might be forcing a password reset, etc.
									try {
										client.unloadProject(
											function() {		// callback is executed if client decided to abandon or if there was no project to begin with.
												var exceptionRet = client.showAZUsersDialog();
												if (exceptionRet) { throw exceptionRet; }
										},
										true);
									} catch(e) { errorHelper.show(e); }
								});

								$("#ProjectsButton").click(function() {

									// AZProjectsDialog is the place for making non-public projects public. Maybe it will also
									// do Types and Methods. It may also un-quarantine images, videos and sounds.
									try {
										client.unloadProject(
											function() {		// callback is executed if client decided to abandon or if there was no project to begin with.
												var exceptionRet = client.showAZProjectsDialog();
												if (exceptionRet) { throw exceptionRet; }
										},
										true);
									} catch(e) { errorHelper.show(e); }
								});

								$("#ActivatePPButton").click(function() {

									// AZActivatePPDialog is where Purchasable Projects are finalized, activated or de-activated.
									// This dialog is not meant to load the project for actual maintenance, just the data from the
									// classes, onlineclasses or products table for editing.
									try {
										client.unloadProject(
											function() {		// callback is executed if client decided to abandon or if there was no project to begin with.
												var exceptionRet = client.showAZActivatePPDialog();
												if (exceptionRet) { throw exceptionRet; }
										},
										true);
									} catch(e) { errorHelper.show(e); }
								});

								// This is how to connect enabled/disabled tooltips to menu items:
								//
								// $("#ComicsButton").powerTip({ manual: true });
								// $("#ComicsButton").on({
								// 	mouseenter: function(event) {

								// 		if ($("#ComicsLI").hasClass("disabled")) {
								// 			$("#ComicsButton")('powertip', 'You have to open a project before you can work on comics.');
								// 			$.powerTip.show(this, event);
								// 		} else {
								// 			$("#ComicsButton")('powertip', '');
								// 			$.powerTip.hide(this);
								// 		}

								// 	},
								// 	mouseleave: function() {
								// 		$.powerTip.hide(this);
								// 	}
								// });
							}

							client.setBrowserTabAndBtns();

							return null;

						} catch (e) { return e; }
					};

					// A bunch of functions that enable/disable navbar menu items.
					// During the buying process there's a project, but the user must not be allowed to do
					// anything with it. I believe this handles itself with modal dialogs in the right places.
					self.enableOrDisableProjAndTypeMenuItems = function () {

						// New and search are enabled. others are disabled.
						m_functionEnable("NewProject");
						m_functionEnable("OpenProject");
						m_functionDisable("SaveProject");
						m_functionDisable("CloseProject");
						m_functionDisable("NewType");
						m_functionDisable("SearchType");
						m_functionDisable("NewMethod");
						m_functionDisable("SearchMethod");
						m_functionDisable("NewProperty");
						m_functionDisable("NewEvent");

						if (manager.loaded) {

							// Any open project can be closed (with appropriate warning, if warranted.)
							m_functionEnable("CloseProject");
							m_functionEnable("SaveProject");
							m_functionEnable("NewType");
							m_functionEnable("SearchType");
							m_functionEnable("NewMethod");
							m_functionEnable("SearchMethod");
							m_functionEnable("NewProperty");
							m_functionEnable("NewEvent");
						}
					}

					self.enableOrDisableAminZoneMenuItems = function () {

						if (g_profile.can_edit_permissions) {
							m_functionEnable("Users");
						} else {
							m_functionDisable("Users");
						}

						if (g_profile.can_unquarantine) {
							m_functionEnable("Projects");
						} else {
							m_functionDisable("Projects");
						}
							
						if (g_profile.can_activate_PPs) {
							m_functionEnable("ActivatePP");
						} else {
							m_functionDisable("ActivatePP");
						}
					}

					self.enableOrDisablePlayAndStopButtons = function () {

						if (manager.loaded) {
							$("#PlayBtn").removeClass("disabled");
						} else {
							$("#PlayBtn").addClass("disabled");
						}

						$("#StopBtn").addClass("disabled");
					}

					// Private methods
					var m_functionEnable = function (part) {

						$("#" + part + "LI").removeClass("disabled");
						$("#" + part + "LI").addClass("enabled");
					}

					var m_functionDisable = function (part) {

						$("#" + part + "LI").addClass("disabled");
						$("#" + part + "LI").removeClass("enabled");
					}

				} catch (e) {

					errorHelper.show(e);
				}
			};

			// Return constructor function.
			return functionConstructor;

		} catch (e) {

			errorHelper.show(e);
		}
	});
