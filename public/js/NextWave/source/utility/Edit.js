///////////////////////////////////////
// Edit module.
//
// Allows typed input of user data.
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
    "NextWave/source/utility/InPlaceEditHelper"],
    function (prototypes, settings, Point, Size, Area, Control, InPlaceEditHelper) {

        try {

            // Constructor function.
        	var functionRet = function Edit(strText) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from Control.  Call parent Control
                    // constructor.  Pass parameters, if specified.
                    self.inherits(Control);

                    ///////////////////////
                    // Public fields.

                    // Indicate if this object is highlighted.
                    self.highlight = false;
                    // Content.
                    self.text = strText || "";
                    // Allocate the in place editor helper.
                    self.inPlaceEditor = new InPlaceEditHelper(self, 
                        "text",         // Value member.
                        "self");        // Focus member is self.  Self implies
                                        // This object itself has focus (or not).
                                        // This is as opposed to CodeLiterals, 
                                        // for example, where an expression
                                        // usually has focus for the object.

                    ///////////////////////
                    // Public methods.

                    // Inner clear data.
                    self.innerClear = function () {

                        self.text = "";
                        return null;
                    };

                    // Render object.
                    self.render = function (contextRender) {

                        try {

                            // Generate the path.
                            var exceptionRet = self.position.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Draw focus recangle if highlighted.
                            if (self.highlight) {

                                contextRender.fillStyle = settings.general.fillBackgroundHighlight;
                                contextRender.fill();
                                contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                                contextRender.stroke();
                            } else {

                                contextRender.fillStyle = settings.general.fillBackground;
                                contextRender.fill();
                            }

                            contextRender.font = settings.general.font;

                            // After generating the rounded rectangular path,
                            // defer to the in place editor to handle rendering.
                            // If will call back to the function parameter to
                            // handle non-focused rendering that is non in-place.
                            return self.inPlaceEditor.render(contextRender,
                                self.position,
                                function () {

                                    try {

                                        // Now render the label.
                                        contextRender.fillStyle = settings.general.fillText;
                                        contextRender.fillText(self.text,
                                            self.position.location.x + settings.general.margin,
                                            self.position.location.y,
                                            self.position.extent.width - 2 * settings.general.margin);
                                        return null;
                                    } catch (e) {

                                        return e;
                                    }
                                });
                        } catch (e) {

                            return e;
                        }
                    };

                    // Give derived modules a crack at the layout pipeline.
                    self.innerCalculateLayout = function (areaMaximal, contextRender) {

                        self.maxWidth = areaMaximal.extent.width - 2 * settings.general.margin;
                        return null;
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
