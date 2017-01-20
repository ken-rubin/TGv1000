///////////////////////////////////////
// LayerDialogHost module.
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
        "NextWave/source/manager/Layer",
        "NextWave/source/utility/Dialog",
		"NextWave/source/utility/List",
		"NextWave/source/utility/ListItem",
		"NextWave/source/utility/PictureListItem",
		"NextWave/source/utility/glyphs",
		"Core/resourceHelper",
		"Core/errorHelper"
        ],
    function(prototypes, settings, dialogModes, Area, Point, Size, Layer, Dialog, List, ListItem, PictureListItem, glyphs, resourceHelper, errorHelper) {

        try {

            // Constructor function.
            var functionRet = function LayerDialogHost(rgbaBackground, bSetHandledOnMouseMove) {

                try {

                    var self = this; // Uber closure.

                    // Inherit from base class.
                    self.inherits(Layer);

                    ////////////////////////
                    // Public fields.

                    // The dialog.
					self.dialog = new Dialog();
					// The size of this thing.
					self.areaMaximal = null;
					// Save background color
					self.rgbaBackground = rgbaBackground;
					// Save.
					self.bSetHandledOnMouseMove = bSetHandledOnMouseMove;

                    // Destroy LayerDialogHost--we're about to create a new one with a different configuration.
                    self.destroy = function() {

						self.dialog.destroy();
                    }

                    // Handle mouse down.
                    self.innerMouseDown = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.mouseMove)) {

                                return self.dialog.mouseDown(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse up.
                    self.innerMouseUp = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.mouseMove)) {

                                return self.dialog.mouseUp(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse wheel.
                    self.innerMouseWheel = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.mouseMove)) {

                                return self.dialog.mouseWheel(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved over the tree.
                    self.innerMouseMove = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.mouseMove)) {

								// When true, stops lower layers from changing cursor.
								objectReference.handled = self.bSetHandledOnMouseMove;

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

							self.areaMaximal = new Area(new Point(0, 0),
								sizeExtent);

                            // Render the dialog (payload).
                            var exceptionRet = self.dialog.calculateLayout(self.areaMaximal,
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

							// Opaque it somewhat.
							self.areaMaximal.generateRectPath(contextRender);
							contextRender.fillStyle = self.rgbaBackground;
                            contextRender.fill();

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

                } catch (e) {

                    alert(e.message);
                }
        	};

            // Inherit from Layer.  Wire
            // up prototype chain to Layer.
            functionRet.inheritsFrom(Layer);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
