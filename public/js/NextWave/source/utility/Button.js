///////////////////////////////////////
// Button module.
//
// A GUI button Control element.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
        "NextWave/source/utility/settings",
        "NextWave/source/utility/glyphs",
        "NextWave/source/utility/Point",
        "NextWave/source/utility/Size",
        "NextWave/source/utility/Area",
        "NextWave/source/utility/Control"],
    function(prototypes, settings, glyphs, Point, Size, Area, Control) {

        try {

            // Constructor function.
            var functionRet = function Button(objectParameters) {

                try {

                    var self = this; // Uber closure.

                    // Inherit from Control.  Call parent Control
                    // constructor.  Pass parameters, if specified.
                    self.inherits(Control);

                    ////////////////////////
                    // Public methods.

                    // Give derived modules a crack at the create pipeline.
                    self.innerCreate = function () {

                        try {

                            // Save off sections.
                            //self.sections = ;

                            return null;
                        } catch (e) {

                            return e;
                        }
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

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            try {

                                contextRender.save();
                                contextRender.clip();

                                // Fill and stroke the path.
                                contextRender.fillStyle = (m_bMouseIn ? (m_bMouseDown ? settings.button.backgroundMouseDown : settings.button.backgroundMouseIn) : settings.button.background);
                                contextRender.strokeStyle = settings.general.strokeBackground;
                                contextRender.fill();
                                contextRender.stroke();

                                contextRender.font = settings.general.largeFont;
                                contextRender.fillStyle = "rgba(0,0,0,0.7)";
                                contextRender.textBaseline = "middle"; 
                                contextRender.textAlign = "center";
                                contextRender.fillText(self.configuration.text,
                                    m_area.location.x + m_area.extent.width / 2 + (m_bMouseDown ? 3 : 0),
                                    m_area.location.y + m_area.extent.height / 2+ (m_bMouseDown ? 3 : 0)) 
                            } finally {

                                contextRender.restore();
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
                    self.mouseMove = function (objectReference) {

                        try {

                            m_bMouseIn = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
                    self.mouseDown = function (objectReference) {

                        try {

                            m_bMouseDown = true;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
                    self.mouseUp = function (objectReference) {

                        try {

                            m_bMouseDown = false;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
                    self.mouseOut = function (objectReference) {

                        try {

                            m_bMouseIn = false;
                            m_bMouseDown = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
                    self.click = function (objectReference) {

                        try {

                            if (self.protected) {

                                return null;
                            }

                            // Raise event handler, if specified.
                            if (self.configuration.click) {

                                self.configuration.click();
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // Placement of this instance.
                    var m_area = null;
                    // Keep track of mouse in button.
                    let m_bMouseIn = false;
                    // Keep track of mouse down.
                    let m_bMouseDown = false;
                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });