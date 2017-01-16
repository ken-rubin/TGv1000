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
        "NextWave/source/utility/lpModes",
        "NextWave/source/utility/Area",
        "NextWave/source/utility/Point",
        "NextWave/source/utility/Size",
        "NextWave/source/manager/Layer",
        "NextWave/source/utility/Dialog",
		"NextWave/source/utility/List",
		"NextWave/source/utility/ListItem",
		"NextWave/source/utility/PictureListItem",
		"NextWave/source/utility/glyphs",
		"Core/resourceHelper",
		"Core/errorHelper"
        ],
    function(prototypes, settings, lpModes, Area, Point, Size, Layer, Dialog, List, ListItem, PictureListItem, glyphs, resourceHelper, errorHelper) {

        try {

            // Constructor function.
            var functionRet = function LayerNavbar() {

                try {

                    var self = this; // Uber closure.

                    // Inherit from base class.
                    self.inherits(Layer);

                    ////////////////////////
                    // Public fields.

                    // The Navbar dialog.
                    self.dialog = null;

                    ////////////////////////
                    // Public methods.

                    // Initialze instance.
                    self.create = function() {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw {

                                    message: "LayerNavbar: Instance already created!"
                                };
                            }

							// Allocate and create the Navbar "Dialog", passing the initialization object.
							self.dialog = new Dialog();
							let objectConfiguration = {
								toggleLandingPageButton: {
									type: "Button",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									text: glyphs.home,
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 4,
									y: 2 * settings.general.margin,
									width: 30,
									height: 30,
									click: function(objectReference) {
										manager.toggleLPLayer();
										objectReference.handled = true;
									}
								},
								runButton: {
									type: "Button",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									text: glyphs.play,
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 4,
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
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									text: glyphs.stop,
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: settings.dialog.firstColumnWidth / 4,
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

                    // Destroy LayerNavbar--we're about to create a new one with a different configuration.
                    self.destroy = function() {

						self.dialog.destroy();
                    }

                    // Invoked when the mouse is moved over the tree.
                    self.innerMouseMove = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.mouseMove)) {

                                return self.dialog.mouseMove(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved away from the canvas.
                    self.innerMouseOut = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.mouseOut)) {

                                return self.dialog.mouseOut(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is clicked over the canvas.
                    self.innerClick = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.click)) {

                                return self.dialog.click(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set the size of this layer and children.
                    // Also handle responsiveness of application.
                    self.innerCalculateLayout = function(sizeExtent, contextRender) {

                        try {

							let areaMaximal = new Area(new Point(0, 0),
								sizeExtent);

                            // Render the dialog (payload).
                            var exceptionRet = self.dialog.calculateLayout(areaMaximal,
                                contextRender);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the layer.
                    self.innerRender = function(contextRender, iMS) {

                        try {

                            // Render the dialog (payload).
                            var exceptionRet = self.dialog.render(contextRender);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private methods.

                    //////////////////////////
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

            // Do function injection.
            functionRet.inheritsFrom(Layer);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
