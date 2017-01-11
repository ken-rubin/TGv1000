///////////////////////////////////////
// ListHost module.
//
// Hosts a list.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/Control",
    "NextWave/source/utility/List"],
    function (prototypes, settings, Point, Size, Area, Control, List) {

        try {

            // Constructor function.
        	var functionRet = function ListHost(...objectParameters) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from Control.  Call parent Control
                    // constructor.  Pass parameters, if specified.
                    self.inherits(Control);

                    ///////////////////////
                    // Public fields.

                    // Indicate if this object is highlighted.
                    self.highlight = false;
                    // The hosted object.
                    self.list = null;

					// Ensure defaults for List construction parameters are there, because we don't know if user passed in 0, 1 or 2.
					objectParameters.push(false);
					objectParameters.push(false);
					self.list = new List(objectParameters[0], objectParameters[1]);

                    ///////////////////////
                    // Public methods.

                    // We are about to highlight a PictureListItem. Turn all highlights off first.
                    self.removeAllOutlines = function() {
                        self.list.removeAllOutlines();
                    }

                    // Render object.
                    self.render = function (contextRender) {

                        return self.list.render(contextRender);
                    };

                    // Pass to payload.
                    self.mouseMove = function (objectReference) {

                        return self.list.mouseMove(objectReference);
                    };

                    // Pass to payload.
                    self.mouseUp = function (objectReference) {

                        return self.list.mouseUp(objectReference);
                    };

                    // Pass to payload.
                    self.mouseDown = function (objectReference) {

                        return self.list.mouseDown(objectReference);
                    };

                    // Pass to payload.
                    self.mouseOut = function (objectReference) {

                        return self.list.mouseOut(objectReference);
                    };

                    // Pass to payload.
                    self.mouseWheel = function (objectReference) {

                        return self.list.mouseWheel(objectReference);
                    };

                    // Pass to payload.
                    self.click = function (objectReference) {

                        return self.list.click(objectReference);
                    };

                    // Clear list.
                    self.innerClear = function () {

                        try {

                            // Clear out list.
                            return self.list.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Give derived modules a crack at the create pipeline.
                    self.innerCreate = function () {

                        return self.list.create(self.configuration.items);
                    };

                    // Give derived modules a crack at the layout pipeline.
                    self.innerCalculateLayout = function (areaMaximal, contextRender) {

                        return self.list.calculateLayout(areaMaximal, contextRender);
                    };
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Inherit from Control.  Wire
            // up prototype chain to Control.
            functionRet.inheritsFrom(Control);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
