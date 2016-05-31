///////////////////////////////////////
// Label module.
//
// Holds information for locating and displaying a label.
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
    "NextWave/source/utility/Control"],
    function (prototypes, settings, Point, Size, Area, Control) {

        try {

            // Constructor function.
        	var functionRet = function Label(strText) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from Control.  Call parent Control
                    // constructor.  Pass parameters, if specified.
                    self.inherits(Control);

                    ///////////////////////
                    // Public fields.

                    // Content.
                    self.text = strText || "";

                    ///////////////////////
                    // Public methods.

                    // Inner clear data.
                    self.innerClear = function () {

                        // Do nothing, labels are static.
                        return null;
                    };

                    // Inner load.
                    self.innerCreate = function () {

                        self.text = self.configuration.text;
                        return null;
                    };

                    // Render object.
                    self.render = function (contextRender) {

                        try {

                            // If font specified, set, else default.
                            if (self.configuration.font) {

                                contextRender.font = self.configuration.font;
                            } else {

                                contextRender.font = settings.general.font;
                            }

                            // If border, render border.
                            if (self.configuration.border) {

                                // Generate the path.
                                var exceptionRet = self.position.generateRoundedRectPath(contextRender);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                contextRender.fill();
                                contextRender.stroke();
                            }

                            // Render.
                            contextRender.fillStyle = settings.general.fillText;
                            contextRender.fillText(self.text,
                                self.position.location.x,
                                self.position.location.y,
                                self.position.extent.width);
                            return null;
                        } catch (e) {

                            return e;
                        }
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
