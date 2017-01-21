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

							let objectConfiguration = {
								toggleLandingPageButton: {
									type: "Button",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
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
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
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
											self.dialog.controlObject["runButton"].setProtected(true);
											self.dialog.controlObject["stopButton"].setProtected(false);

											objectReference.handled = true;
										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								stopButton: {
									type: "Button",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
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
											self.dialog.controlObject["runButton"].setProtected(false);
											self.dialog.controlObject["stopButton"].setProtected(true);

											objectReference.handled = true;
										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								logoutButton: {
									type: "Button",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									text: "Logout",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 70,
									y: 2 * settings.general.margin + 600,
									width: 100,
									height: 30,
									click: function(objectReference) {

										try {

											// TODO: Will need Abandon Project stuff.

											window.location = "/";
										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								createNewButton: {
									type: "Button",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									text: "Create Project",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 80,
									y: 2 * settings.general.margin + 200,
									width: 120,
									height: 30,
									click: function(objectReference) {

										try {

											// TODO: Will need Abandon Project stuff.

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								buyEnrollButton: {
									type: "Button",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									text: "Buy/Enroll",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 70,
									y: 2 * settings.general.margin + 250,
									width: 100,
									height: 30,
									click: function(objectReference) {

										try {

											// TODO: Will need Abandon Project stuff.

											window.location = "/";
										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								saveProjectButton: {
									type: "Button",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									text: "Save Project",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 70,
									y: 2 * settings.general.margin + 300,
									width: 100,
									height: 30,
									click: function(objectReference) {

										try {

											// TODO: Will need Abandon Project stuff.

											window.location = "/";
										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								closeProjectButton: {
									type: "Button",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									text: "Close Project",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 80,
									y: 2 * settings.general.margin + 350,
									width: 120,
									height: 30,
									click: function(objectReference) {

										try {

											// TODO: Will need Abandon Project stuff.

											window.location = "/";
										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								azUsersPermissionsButton: {
									type: "Button",
									modes: [dialogModes.privilegeduser],
									text: "Users/Permissions",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 95,
									y: 2 * settings.general.margin + 400,
									width: 150,
									height: 30,
									click: function(objectReference) {

										try {

											// TODO: Will need Abandon Project stuff.

											window.location = "/";
										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								azProjectsButton: {
									type: "Button",
									modes: [dialogModes.privilegeduser],
									text: "Projects",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 70,
									y: 2 * settings.general.margin + 450,
									width: 100,
									height: 30,
									click: function(objectReference) {

										try {

											// TODO: Will need Abandon Project stuff.

											window.location = "/";
										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								azPurchProjectsButton: {
									type: "Button",
									modes: [dialogModes.privilegeduser],
									text: "Purchasables",
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 3 + 80,
									y: 2 * settings.general.margin + 500,
									width: 120,
									height: 30,
									click: function(objectReference) {

										try {

											// TODO: Will need Abandon Project stuff.

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

							let exceptionRet = self.dialog.create(objectConfiguration,
							                                 	(m_bPrivileged ? dialogModes.privilegeduser : dialogModes.normaluser)
							);
                            if (exceptionRet) {
                                return exceptionRet;
                            }

                            // Indicate current state.
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

					// Project has just been loaded or unloaded in Manager.
					// Update protectedness of Navbar's run and stopButtons.
					self.projectLoadedStateHasChangedTo = function(bLoaded) {

						self.dialog.controlObject["runButton"].setProtected(!bLoaded);
						self.dialog.controlObject["stopButton"].setProtected(bLoaded);
					}

                    //////////////////////////
                    // Private methods.

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
