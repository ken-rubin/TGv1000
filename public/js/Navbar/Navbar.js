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
								} catch (e) {

									errorHelper.show(e);
								}
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
														// iProjectId is the project to fetch.
														function (iProjectId, bPrivilegedUser, bOnlyOwnedByUser, bOnlyOthersProjects) {

															try {

																if (iProjectId > 0) {

																	var exceptionRet = client.openProjectFromDB(iProjectId,
																		// This callback is called from client.load_m_clProject to add specialProjectData to the project.
																		// Note: if the project is a Product, Class or Online Class, then that extra information is already
																		// in the project in specialProjects when it is retrieved from the BO. Thus we extend and merge here, not set =.
																		function(clProject) {

																			try {

																				// clProject.data.specialProjectData exists, but it's empty unless its a Purchasable Project in
																				// which case is contains a property holding class, product or onlineClass data.
																				// Create and merge rest of specialProjectData in.
																				specialProjectData = {
																					privilegedUser: bPrivilegedUser,
																					ownedByUser: bOnlyOwnedByUser,
																					othersProjects: bOnlyOthersProjects,
																					normalProject: (clProject.data.isCoreProject+clProject.data.isClass+clProject.data.isProduct+clProject.data.isOnlineClass === 0),
																					coreProject: clProject.data.isCoreProject,
																					classProject: clProject.data.isClass,
																					productProject: clProject.data.isProduct,
																					onlineClassProject: clProject.data.isOnlineClass,
																					comicsEdited: false,
																					systemTypesEdited: false,
																					openMode: 'searched'
																				};

																				$.extend(true, clProject.data.specialProjectData, specialProjectData);

																				if (clProject.data.specialProjectData.productProject || clProject.data.specialProjectData.classProject || clProject.data.specialProjectData.onlineClassProject) {

																					var exceptionRet = client.showBuyDialog();
																				}
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

								} catch (e) {

									errorHelper.show(e);
								}
							});

							$("#CloseProjectButton").click(function () {

								client.unloadProject(function(){ 
									self.enableDisableProjectsMenuItems(); 
									self.enableDisableAdminZoneMenuItems(); 
								}, true);
							});

							if (g_profile.can_visit_adminzone) {

								// Show Adminzone button.
								$("#AdminzoneLI").css("display", "block");

								// Wire Adminzone button click.
								$("#ComicsButton").click(function () {

									try {

										// Switch to Adminzone.
										var exceptionRet = client.showComicsDialog();
										if (exceptionRet) { throw exceptionRet; }
									} catch (e) {

										errorHelper.show(e);
									}
								});

								// Wire special tooltip functionality.
								$("#ComicsButton").powerTip({ manual: true });
								$("#ComicsButton").on({
									mouseenter: function(event) {

										if ($("#ComicsLI").hasClass("disabled")) {
											$("#ComicsButton").data('powertip', 'You have to open a project before you can work on comics.');
											$.powerTip.show(this, event);
										} else {
											$("#ComicsButton").data('powertip', '');
											$.powerTip.hide(this);
										}

									},
									mouseleave: function() {
										$.powerTip.hide(this);
									}
								});
							}

							// Wire Play button click.
							$("#PlayBtn").click(function () {

								try {

									// Let client handle this.
									var exceptionRet = client.play();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							// Wire Play button click.
							$("#StopBtn").click(function () {

								try {

									// Let client handle this.
									var exceptionRet = client.stop();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							client.setBrowserTabAndBtns();

							return null;

						} catch (e) {

							return e;
						}
					};

					// A bunch of functions that enable/disable navbar menu items.
					self.enableDisableProjectsMenuItems = function () {

						var clProject = client.getProject();

						// New and search are enabled. others are disabled.
						m_functionEnable("NewProject");
						m_functionEnable("OpenProject");
						m_functionDisable("SaveProject");
						m_functionDisable("CloseProject");

						if (clProject !== null) {

							// Any open project can be closed (with appropriate warning, if warranted.)
							m_functionEnable("CloseProject");
							m_functionEnable("SaveProject");
						}
					}

					self.enableDisableAdminZoneMenuItems = function () {

						var clProject = client.getProject();
						if (clProject !== null) {
							m_functionEnable("Comics");
						}
						else {
							m_functionDisable("Comics");
						}
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
