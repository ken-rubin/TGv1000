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
        "NextWave/source/utility/orientation",
        "NextWave/source/utility/Area",
        "NextWave/source/utility/Point",
        "NextWave/source/utility/Size",
        "NextWave/source/manager/Layer",
        "NextWave/source/utility/Panel",
        "NextWave/source/project/Navbar"
        ],
    function(prototypes, settings, orientation, Area, Point, Size, Layer, Panel, Navbar) {

        try {

            // Constructor function.
            var functionRet = function LayerNavbar() {

                try {

                    var self = this; // Uber closure.

                    // Inherit from base class.
                    self.inherits(Layer);

                    ////////////////////////
                    // Public fields.

                    // The only panel. Hang on to it.
                    self.panel = null;

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

							self.panel = new Panel("Navbar",
								orientation.full,
								new Point(0,0),
								new Size(self.extent.width, self.extent.height));

							self.panel.open = true;
							self.panel.closed = false;
							self.panel.opening = false;
							self.panel.closing = false;
							self.panel.pinned = true;

							// Add the Navbar to the panel.
							try {

								// Allocate and create the Navbar "Dialog", passing the initialization object.
								window.navbarDialog = new Navbar();
								var exceptionRet = window.navbarDialog.create();
								if (exceptionRet) {

									throw exceptionRet;
								}

								// Set it.
								self.panel.setPayload("Navbar",window.navbarDialog);
							} catch (e) {

								throw exceptionRet;
							}

							// Compile to generic list of panels for looping operations.
							m_arrayPanels = [
								self.panel
							];

                            // Indicate current state.
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Destroy LayerNavbar--we're about to create a new one with a different configuration.
                    self.destroy = function() {

						self.panel.destroy();
                        window.openProjectDialog.destroy();
                    }

                    // Take mouse move--set handled in reference object if handled.
                    self.innerMouseMove = function(objectReference) {

                        try {

                            // Must be created.
                            if (!m_bCreated) {

                                return null;
                            }

                            // Save off the current active panel, if.
                            var panelOriginal = m_panelActive;

                            // Clear the active panel.
                            m_panelActive = null;

                            // Test all the panels.
                            for (var i = 0; i < m_arrayPanels.length; i++) {

                                if (m_arrayPanels[i]) {

                                    var exceptionRet = m_arrayPanels[i].mouseMove(objectReference);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // If handled, then drop out.
                                    if (objectReference.handled) {

                                        m_panelActive = m_arrayPanels[i];
                                        break;
                                    }
                                }
                            }

                            // Deactivate the old activation in
                            // the current panel, if it changed.
                            if (panelOriginal &&
                                m_panelActive !== panelOriginal) {

                                var exceptionRet = panelOriginal.mouseOut(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse down.
                    self.innerMouseDown = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // If active panel, just pass to it.
                            if (m_panelActive) {

                                // Panel handles down--even if not over a control.
                                objectReference.handled = true;

                                return m_panelActive.mouseDown(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse up.
                    self.innerMouseUp = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // If active panel, just pass to it.
                            if (m_panelActive) {

                                // Panel handles down--even if not over a control.
                                objectReference.handled = true;

                                return m_panelActive.mouseUp(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse wheel.
                    self.innerMouseWheel = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // If active panel, just pass to it.
                            if (m_panelActive) {

                                // Panel handles down--even if not over a control.
                                objectReference.handled = true;

                                return m_panelActive.mouseWheel(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse out.
                    self.innerMouseOut = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // Deactivate the activation in
                            // the current panel, if activated.
                            if (m_panelActive) {

                                var exceptionRet = m_panelActive.mouseOut(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // Reset active state.
                            m_panelActive = null;
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Handle click.
                    self.innerClick = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // If active panel, just pass to it.
                            if (m_panelActive) {

                                // Panel handles down--even if not over a control.
                                objectReference.handled = true;

                                return m_panelActive.click(objectReference);
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

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // Set the extents of the panels.
                            for (var i = 0; i < m_arrayPanels.length; i++) {

                                if (m_arrayPanels[i]) {

                                    var exceptionRet = m_arrayPanels[i].calculateLayout(sizeExtent, contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the layer.
                    self.innerRender = function(contextRender, iMS) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

							// Render background.
							contextRender.fillStyle = "rgba(255,255,255,0.10)";
							contextRender.fillRect(0,
								0,
								self.extent.width,
								self.extent.height);

                            // Render the panels.
                            for (var i = m_arrayPanels.length - 1; i >= 0; i--) {

                                if (m_arrayPanels[i]) {

                                    var exceptionRet = m_arrayPanels[i].render(contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
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
                    // Collection of managed panels.
                    var m_arrayPanels = null;
                    // Panel in which the mouse is located.
                    var m_panelActive = null;

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
