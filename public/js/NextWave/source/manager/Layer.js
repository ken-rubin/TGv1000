///////////////////////////////////////
// Layer module.
//
// Base class for all layers.  The Manager manages layers.
// Each layer is responsible for its own domain of activity.
// E.g. the debug layer outputs debugging information, but
//      doesn't respond to mouse interaction, additionally
//      the Panel layer is responsible for displaying the
//      interactive user-panels and managing their use, etc....
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size"],
    function (prototypes, settings, Area, Point, Size) {

        try {

            // Constructor function.
        	var functionRet = function Layer() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Size of layer.
                    self.extent = new Size(0, 0);
                    // Indicates that this layer is active,
                    // displays itself and responds to events.
                    self.active = true;

                    ////////////////////////
                    // Public methods.

                    // Initialze instance.
                    self.create = function () {

                        return null;
                    };

                    // Render out the layer.
                    self.render = function (contextRender, iMS) {

                        if (self.active) {

                            return self.innerRender(contextRender,
                                iMS);
                        }
                        return null;
                    };

                    // Render out the layer.
                    self.innerRender = function (contextRender) {

                        return null;
                    };

                    // Set the size of this layer.
                    self.calculateLayout = function (sizeExtent, contextRender) {

                        self.extent = sizeExtent;
                        if (self.active) {

                            return self.innerCalculateLayout(sizeExtent,
                                contextRender);
                        }
                        return null;
                    };

                    // Render out the layer.
                    self.innerCalculateLayout = function (sizeExtent, contextRender) {

                        return null;
                    };

                    // Handle mouse down.
                    self.mouseDown = function (objectReference) {

                        if (self.active) {

                            return self.innerMouseDown(objectReference);
                        }
                        return null;
                    };

                    // Handle mouse down.
                    self.innerMouseDown = function (objectReference) {

                        return null;
                    };

                    // Handle mouse up.
                    self.mouseUp = function (objectReference) {

                        if (self.active) {

                            return self.innerMouseUp(objectReference);
                        }
                        return null;
                    };

                    // Handle mouse up.
                    self.innerMouseUp = function (objectReference) {

                        return null;
                    };

                    // Take mouse move--set handled in reference object if handled.
                    self.mouseMove = function (objectReference) {

                        if (self.active) {

                            return self.innerMouseMove(objectReference);
                        }
                        return null;
                    };

                    // Take mouse move--set handled in reference object if handled.
                    self.innerMouseMove = function (objectReference) {

                        return null;
                    };

                    // Handle mouse wheel.
                    self.mouseWheel = function (objectReference) {

                        if (self.active) {

                            return self.innerMouseWheel(objectReference);
                        }
                        return null;
                    };

                    // Handle mouse wheel.
                    self.innerMouseWheel = function (objectReference) {

                        return null;
                    };

                    // Handle mouse out do nothing.
                    self.mouseOut = function (objectReference) {

                        if (self.active) {

                            return self.innerMouseOut(objectReference);
                        }
                        return null;
                    };

                    // Handle mouse out do nothing.
                    self.innerMouseOut = function (objectReference) {

                        return null;
                    };

                    // Handle mouse up.
                    self.click = function (objectReference) {

                        if (self.active) {

                            return self.innerClick(objectReference);
                        }
                        return null;
                    };

                    // Handle mouse up.
                    self.innerClick = function (objectReference) {

                        return null;
                    };
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
