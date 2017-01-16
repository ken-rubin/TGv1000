///////////////////////////////////////
// Navbar module.
//
// Gui component responsible for
// creating a normal project or a purchasable project.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/lpModes",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/DialogHost",
    "NextWave/source/utility/List",
    "NextWave/source/utility/ListItem",
    "NextWave/source/utility/PictureListItem",
    "NextWave/source/utility/glyphs",
	"Core/resourceHelper",
	"Core/errorHelper"
    ],
    function (prototypes, settings, lpModes, Point, Size, Area, DialogHost, List, ListItem, PictureListItem, glyphs, resourceHelper, errorHelper) {

        try {

            // Constructor function.
            var functionRet = function Navbar() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from DialogHost.
                    self.inherits(DialogHost);

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Navbar: Instance already created!" };
                            }

                            // Create the dialog.
							let objectConfiguration = {
								toggleLandingPageButton: {
									type: "Button",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									text: glyphs.home,
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 2,
									y: 2 * settings.general.margin,
									width: 30,
									height: 30,
									click: function() {
										manager.toggleLPLayer();
									}
								},
								runButton: {
									type: "Button",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									text: glyphs.play,
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 2,
									y: 2 * settings.general.margin + 50,
									width: 30,
									height: 30,
									click: function() {

										try {

											var exceptionRet = manager.runButtonClicked();
											if (exceptionRet) { errorHelper.show(exceptionRet); }

											// Protect run, unprotect stop.
											self.dialog.controlObject["runButton"].setProtected(true);
											self.dialog.controlObject["stopButton"].setProtected(false);

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								stopButton: {
									type: "Button",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									text: glyphs.stop,
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 2,
									y: 2 * settings.general.margin + 100,
									width: 30,
									height: 30,
									click: function() {

										try {

											var exceptionRet = manager.stopButtonClicked();
											if (exceptionRet) { errorHelper.show(exceptionRet); }

											// Unprotect run, protect stop.
											self.dialog.controlObject["runButton"].setProtected(false);
											self.dialog.controlObject["stopButton"].setProtected(true);

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								testButton: {
									type: "Button",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									text: "Test: Click to Protect",
									constructorParameterString: "'15px Arial'",
									x: settings.general.margin,
									yType: "reserve",
									y: 200,
									width: 230,
									height: 30,
									click: function() {

										try {

											let testBtn = self.dialog.controlObject["testButton"];
											testBtn.setProtected(true);

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
							                                 	(m_bPrivileged ? lpModes.privilegeduser : lpModes.normaluser)
							);
                            if (exceptionRet) {
                                return exceptionRet;
                            }

                            // Because it is!
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Decompose instance.
                    self.destroy = function () {

                        try {

                            // Can only destroy a created instance.
                            if (!m_bCreated) {

                                throw { message: "Instance not created!" };
                            }

                            window.navbarDialog = null;
                            m_bCreated = false;

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

					///////////////////////
					// Private methods

                    ///////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
					// Hold maximalArea.
					var m_area = null;
					// Privileged user or not.
					var m_bPrivileged = false;

                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
