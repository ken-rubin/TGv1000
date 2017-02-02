///////////////////////////////////////
// LayerNavbar module.
//
// Maintains collection of panels (one of which can be active, e.g. has focus).
// Also responsible for scaling to the display dimension (e.g. responsiveness).
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
        "NextWave/source/utility/settings",
        "NextWave/source/utility/dialogModes",
        "NextWave/source/utility/Area",
        "NextWave/source/utility/Point",
        "NextWave/source/utility/Size",
        "NextWave/source/manager/LayerDialogHost",
        "NextWave/source/utility/Dialog",
		"NextWave/source/utility/List",
		"NextWave/source/utility/ListItem",
		"NextWave/source/utility/PictureListItem",
		"NextWave/source/utility/glyphs",
		"Core/resourceHelper",
		"Core/errorHelper"
        ],
    function(prototypes, settings, dialogModes, Area, Point, Size, LayerDialogHost, Dialog, List, ListItem, PictureListItem, glyphs, resourceHelper, errorHelper) {

        try {

            // Constructor function.
            var functionRet = function LayerNavbar() {

                try {

                    var self = this; // Uber closure.

					// To hold references to the 13 buttons so we have to search for them in self.dialog only once, after creation.
					self.toggleLandingPageButton = null;
					self.runButton = null;
					self.stopButton = null;
					self.editProjectButton = null;
					self.createProjectButton = null;
					self.buyEnrollButton = null;
					self.saveProjectButton = null;
					self.closeProjectButton = null;
					self.azUsersPermissionsButton = null;
					self.azProjectsButton = null;
					self.azPurchProjectsButton = null;
					self.cancelButton = null;
					self.logoutButton = null;

                    // Inherit from base class.
                    self.inherits(LayerDialogHost,
						"rgba(255,255,255,.05)",		// Required for Layers inheriting LayerDialogHost.
						false							// Tells LayerDialogHost to NOT set objectReference.handled in mouse move.
					);

                    // Initialze instance.
                    self.create = function() {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw {

                                    message: "LayerNavbar: Instance already created!"
                                };
                            }

							// LayerDebug's info box ends about 80px up from the bottom (area.extent.height - 80).
							// stopButton ends at 2 * settings.general.margin + 130 = 138.
							// Space the buttons beneath stopButton starting at y=100 and ending at area.extent.height - 180.

							let objectConfiguration = {

								toggleLandingPageButton: {
									type: "Button",
									modes: ["notBeingUsed"/*dialogModes.normaluserinitialstate,dialogModes.privilegeduserinitialstate*/],
									text: glyphs.home,
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 35,
									y: 2 * settings.general.margin,
									width: 30,
									height: 30,
									click: function(objectReference) {
										manager.toggleLandingPageAndTooltipLayers();
										objectReference.handled = true;
									}
								},
								runButton: {
									type: "Button",
									modes: [dialogModes.normaluserinitialstate,dialogModes.privilegeduserinitialstate],
									text: glyphs.play,
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 35,
									y: 2 * settings.general.margin + 50,
									width: 30,
									height: 30,
									click: function(objectReference) {

										try {

											var exceptionRet = manager.runButtonClicked();
											if (exceptionRet) { errorHelper.show(exceptionRet); }

											// Protect run, unprotect stop.
											self.runButton.setProtected(true);
											self.stopButton.setProtected(false);

											objectReference.handled = true;
										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								stopButton: {
									type: "Button",
									modes: [dialogModes.normaluserinitialstate,dialogModes.privilegeduserinitialstate],
									text: glyphs.stop,
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 35,
									y: 2 * settings.general.margin + 100,
									width: 30,
									height: 30,
									click: function(objectReference) {

										try {

											var exceptionRet = manager.stopButtonClicked();
											if (exceptionRet) { errorHelper.show(exceptionRet); }

											// Unprotect run, protect stop.
											self.runButton.setProtected(false);
											self.stopButton.setProtected(true);

											objectReference.handled = true;
										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								editProjectButton: {
									type: "Button",
									modes: [dialogModes.normaluserinitialstate,dialogModes.privilegeduserinitialstate],
									text: "Edit Project",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 80,
									yType: "callback",
									y: function(area) {
										return (area.extent.height - 180) / 10 + 100 + 1 * 40;
									},
									width: 120,
									height: 30,
									click: function(objectReference) {

										try {

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								createProjectButton: {
									type: "Button",
									modes: [dialogModes.normaluserinitialstate,dialogModes.privilegeduserinitialstate],
									text: "Create Project",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 80,
									yType: "callback",
									y: function(area) {
										return (area.extent.height - 180) / 10 + 100 + 2 * 40;
									},
									width: 120,
									height: 30,
									click: function(objectReference) {

										try {

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								buyEnrollButton: {
									type: "Button",
									modes: [dialogModes.normaluserinitialstate,dialogModes.privilegeduserinitialstate],
									text: "Buy/Enroll",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 70,
									yType: "callback",
									y: function(area) {
										return (area.extent.height - 180) / 10 + 100 + 3 * 40;
									},
									width: 100,
									height: 30,
									click: function(objectReference) {

										try {

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								saveProjectButton: {
									type: "Button",
									modes: [dialogModes.normaluserinitialstate,dialogModes.privilegeduserinitialstate],
									text: "Save Project",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 70,
									yType: "callback",
									y: function(area) {
										return (area.extent.height - 180) / 10 + 100 + 4 * 40;
									},
									width: 100,
									height: 30,
									click: function(objectReference) {

										try {

											var exceptionRet = client.showSaveProjectDialog();
											if (exceptionRet) { throw exceptionRet; }

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								closeProjectButton: {
									type: "Button",
									modes: [dialogModes.normaluserinitialstate,dialogModes.privilegeduserinitialstate],
									text: "Close Project",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 80,
									yType: "callback",
									y: function(area) {
										return (area.extent.height - 180) / 10 + 100 + 5 * 40;
									},
									width: 120,
									height: 30,
									click: function(objectReference) {

										try {

											let exceptionRet = client.unloadProject(null, true, true);
											if (exceptionRet) {
												throw exceptionRet;
											}

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								azUsersPermissionsButton: {
									type: "Button",
									modes: [dialogModes.privilegeduserinitialstate],
									text: "Users/Permissions",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 95,
									yType: "callback",
									y: function(area) {
										return (area.extent.height - 180) / 10 + 100 + 6 * 40;
									},
									width: 150,
									height: 30,
									click: function(objectReference) {

										try {

											var exceptionRet = client.showAZUsersDialog();
											if (exceptionRet) { throw exceptionRet; }

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								azProjectsButton: {
									type: "Button",
									modes: [dialogModes.privilegeduserinitialstate],
									text: "Projects",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 70,
									yType: "callback",
									y: function(area) {
										return (area.extent.height - 180) / 10 + 100 + 7 * 40;
									},
									width: 100,
									height: 30,
									click: function(objectReference) {

										try {

											var exceptionRet = client.showAZProjectsDialog();
											if (exceptionRet) { throw exceptionRet; }

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								azPurchProjectsButton: {
									type: "Button",
									modes: [dialogModes.privilegeduserinitialstate],
									text: "Purchasables",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 80,
									yType: "callback",
									y: function(area) {
										return (area.extent.height - 180) / 10 + 100 + 8 * 40;
									},
									width: 120,
									height: 30,
									click: function(objectReference) {

										try {

											var exceptionRet = client.showAZActivatePPDialog();
											if (exceptionRet) { throw exceptionRet; }

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								cancelButton: {
									type: "Button",
									modes: [dialogModes.privilegeduserinitialstate],
									text: "Cancel",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 65,
									yType: "callback",
									y: function(area) {
										return (area.extent.height - 180) / 10 + 100 + 9 * 40;
									},
									width: 90,
									height: 30,
									click: function(objectReference) {

										try {

											// Reset some button states.
											self.editProjectButton.setPandV(true, true);
											self.createProjectButton.setPandV(true, true);
											self.cancelButton.setPandV(true, false);

											// Force LayerLandingPage back to search mode.
											manager.setLandingPageDialogMode((m_bPrivileged ? dialogModes.privilegedusersearching : dialogModes.normalusersearching));

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								logoutButton: {
									type: "Button",
									modes: [dialogModes.normaluserinitialstate,dialogModes.privilegeduserinitialstate],
									text: "Logout",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 70,
									yType: "callback",
									y: function(area) {
										return (area.extent.height - 180) / 10 + 100 + 10 * 40;
									},
									width: 100,
									height: 30,
									click: function(objectReference) {

										try {

											window.location = "/";

										} catch(e) {
											errorHelper.show(e);
										}
									}
								}
							};

							m_bPrivileged = (g_profile["can_create_classes"] || 					// Need to do it this way since manager.userAllowedToCreateEditPurchProjs not set yet.
												g_profile["can_create_products"] ||
												g_profile["can_create_onlineClasses"]);

							let exceptionRet = self.dialog.create(objectConfiguration //,
							                                 	//(m_bPrivileged ? dialogModes.privilegeduserinitialstate : dialogModes.normaluserinitialstate)
							);
                            if (exceptionRet) {
                                return exceptionRet;
                            }

							// Retrieve from self.dialog.controlObject for ease of use later.
							self.toggleLandingPageButton = self.dialog.controlObject["toggleLandingPageButton"];
							self.runButton = self.dialog.controlObject["runButton"];
							self.stopButton = self.dialog.controlObject["stopButton"];
							self.editProjectButton = self.dialog.controlObject["editProjectButton"];
							self.createProjectButton = self.dialog.controlObject["createProjectButton"];
							self.buyEnrollButton = self.dialog.controlObject["buyEnrollButton"];
							self.saveProjectButton = self.dialog.controlObject["saveProjectButton"];
							self.closeProjectButton = self.dialog.controlObject["closeProjectButton"];
							self.azUsersPermissionsButton = self.dialog.controlObject["azUsersPermissionsButton"];
							self.azProjectsButton = self.dialog.controlObject["azProjectsButton"];
							self.azPurchProjectsButton = self.dialog.controlObject["azPurchProjectsButton"];
							self.cancelButton = self.dialog.controlObject["cancelButton"];
							self.logoutButton = self.dialog.controlObject["logoutButton"];
							// We don't have to set the initial mode for self.dialog. Manager will control this by
							// calling navbarLayer.projectLoadedStateHasChangedTo with true or false.

                            // Indicate current state.
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

					// Project has just been loaded or unloaded in Manager.
					// Update protectedness of Navbar's run and stopButtons.
					// If !bLoaded, protect both buttons.
					// If bLoaded, unprotect run, protect stop.
					// In other words, always protect stop. Set run to !bLoaded.
					self.projectLoadedStateHasChangedTo = function(bLoaded) {

						// self.dialog.controlObject["runButton"].setProtected(!bLoaded);
						// self.dialog.controlObject["stopButton"].setProtected(true);
						// self.toggleLandingPageButton.setPandV(true, true);
						if (bLoaded) {

							// A project is loaded into manager.

							self.runButton.setPandV(false, true);
							self.stopButton.setPandV(true, true);
							self.editProjectButton.setPandV(true, false);
							self.createProjectButton.setPandV(true, false);
							self.buyEnrollButton.setPandV(true, false);
							self.saveProjectButton.setPandV(false, true);
							self.closeProjectButton.setPandV(false, true);
							if (m_bPrivileged) {

								self.azUsersPermissionsButton.setPandV(false, true);
								self.azProjectsButton.setPandV(false, true);
								self.azPurchProjectsButton.setPandV(false, true);
							} else {

								self.azUsersPermissionsButton.setPandV(true, true);
								self.azProjectsButton.setPandV(true, true);
								self.azPurchProjectsButton.setPandV(true, true);
							}
							self.cancelButton.setPandV(true, false);
							self.logoutButton.setPandV(true, true);
						} else {

							// No project is loaded into manager.

							self.runButton.setPandV(true, false);
							self.stopButton.setPandV(true, false);
							self.editProjectButton.setPandV(true, true);
							self.createProjectButton.setPandV(true, true);
							self.buyEnrollButton.setPandV(true, !m_bPrivileged);
							self.saveProjectButton.setPandV(true, false);
							self.closeProjectButton.setPandV(true, false);
							if (m_bPrivileged) {

								self.azUsersPermissionsButton.setPandV(false, true);
								self.azProjectsButton.setPandV(false, true);
								self.azPurchProjectsButton.setPandV(false, true);
							} else {

								self.azUsersPermissionsButton.setPandV(true, true);
								self.azProjectsButton.setPandV(true, true);
								self.azPurchProjectsButton.setPandV(true, true);
							}
							self.cancelButton.setPandV(true, false);
							self.logoutButton.setPandV(false, true);
						}

						self.dialog.setMode((m_bPrivileged ? dialogModes.privilegeduserinitialstate : dialogModes.normaluserinitialstate));
					}

					// User clicked on a PictureListItem in LayerLandingPage. (Or something else later.)

					// The mode parameter being passed in initially is one of:
					// dialogModes.normaluserclickstrip0-5 and dialogModes.privilegeduserclickstrip0-5. (The may be more coming.)
					// We will not change LayerNavbar's dialog mode. All changes will be made with self.xButton.setPandV(bool, bool).
					self.setNavbarLayerModes = function(mode) {

						switch(mode) {
							case dialogModes.privilegeduserclickstrip0:
								// Core strip--priv. user makes choice of editing a core project or starting a new normal or purchasable project based on the selected core project.
								// In LayerLandingPage user is seeing:
								// (1) reminder of project just clicked on;
								// (2) instructions on using editProject or selecting one of the 4 new project types and using createProject;
								// (3) 4 choices to make with createProject: new normal (selected by default); new classroom; new online; new product.
								// Or can cancel to go back to the strips.
								// We will enable editProjectButton, createProjectButton, cancelButton.
								self.editProjectButton.setPandV(false, true);
								self.createProjectButton.setPandV(false, true);
								self.cancelButton.setPandV(false, true);

								break;
							case dialogModes.privilegeduserclickstrip1:
								// Your own strip--editing. May save with new name. May also make public.


								break;
							case dialogModes.privilegeduserclickstrip2:
								// Shared strip--cloning. Another possibility is that it's being reviewed for approval to be made public.

								break;
							case dialogModes.privilegeduserclickstrip3:
								// Product strip--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.

								break;
							case dialogModes.privilegeduserclickstrip4:
								// Classroom strip--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.

								break;
							case dialogModes.privilegeduserclickstrip5:
								// Online strip--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.

								break;
							case dialogModes.normaluserclickstrip0:
								// Core strip--will create new normal project based on it. Cannot edit and save replacing itself.
								// In LayerLandingPage user is seeing all the normal user fields from NewProjectDialog.
								// Can cancel to go back to the strips.
								// We will hide editProjectButton, buyEnrollButton.
								// We will enable cancelButton.
								// createProjectButton will be enabled when a project name has been entered by the user.
								self.editProjectButton.setPandV(true, false);
								self.buyEnrollButton.setPandV(true, false);
								self.cancelButton.setPandV(false, true);

								break;
							case dialogModes.normaluserclickstrip1:
								// Your own strip--editing. May save with a new name as a new project.

								break;
							case dialogModes.normaluserclickstrip2:
								// Shared public project strip--cloning.

								break;
							case dialogModes.normaluserclickstrip3:
								// Product that is active strip--will make buying decision.

								break;
							case dialogModes.normaluserclickstrip4:
								// Classroom (active, soon and nearby) strip--will make buying or waitlist decision.

								break;
							case dialogModes.normaluserclickstrip5:
								// Online (active and soon) strip--will make buying decision. There is no max number of enrollees.

								break;
						}
					}

                    //////////////////////////
                    // Private methods.

					//
                    //////////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
					// Privileged user or not.
					var m_bPrivileged = false;

                } catch (e) {

                    alert(e.message);
                }
            };

            // Do function injection.
            functionRet.inheritsFrom(LayerDialogHost);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
