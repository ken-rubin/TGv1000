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
define(["utility/prototypes",
    "utility/settings",
    "utility/Area",
    "utility/Point",
    "utility/Size"],
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
                    self.render = function (contextRender) {
                        
                        return null;
                    };

                    // Set the size of this layer.
                    self.calculateLayout = function (sizeExtent, contextRender) {

                        self.extent = sizeExtent;
                        return null;
                    };

                    // Handle mouse down.
                    self.mouseDown = function (objectReference) {

                        return null;
                    };

                    // Handle mouse up.
                    self.mouseUp = function (objectReference) {

                        return null;
                    };

                    // Take mouse move--set handled in reference object if handled.
                    self.mouseMove = function (objectReference) {

                        return null;
                    };

                    // Handle mouse wheel.
                    self.mouseWheel = function (objectReference) {

                        return null;
                    };

                    // Handle mouse out do nothing.
                    self.mouseOut = function (objectReference) {

                        return null;
                    };

                    // Handle mouse up.
                    self.click = function (objectReference) {

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
