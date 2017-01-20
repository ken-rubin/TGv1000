///////////////////////////////////////
// Tooltip module.
//
// Holds information for locating and displaying a Tooltip.
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
        	var functionRet = function Tooltip(strText) {

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

                        // Do nothing, Tooltips are static.
                        return null;
                    };

                    // Inner load.
                    self.innerCreate = function () {

                        self.text = self.configuration.text;
                        return null;
                    };

                    // Give this object a crack at the layout pipeline.
                    self.innerCalculateLayout = function (areaMaximal, contextRender) {

                        try {

                            m_area = areaMaximal;

                            return null;
                        } catch (e) {

                            return e;
                        }
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
                                var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                contextRender.fill();
                                contextRender.stroke();
                            }

                            // Render.
                            contextRender.fillStyle = settings.general.fillText;
                            contextRender.fillText(self.text,
                                m_area.location.x,
                                m_area.location.y,
                                m_area.extent.width);
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // Placement of this instance.
                    var m_area = null;

                } catch (e) {

                    alert(e.message);
                }
        	};

            // Inherit from Control.  Wire
            // up prototype chain to Control.
//            functionRet.inheritsFrom(Control);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
