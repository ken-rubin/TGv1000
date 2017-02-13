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

                    // Callback to handle click event.
                    // Callback must accept click-event-object
                    // reference and return an Exception.
                    self.clickHandler = null;

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

                    // Invoked when the mouse is clicked over the canvas.
                    self.click = function (objectReference) {

						if (self.protected || !self.visible) {

							return null;
						}

                        if ($.isFunction(self.configuration.clickHandler)) {

                            return self.configuration.clickHandler();
                        }
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

                                contextRender.font = (m_bMouseIn && $.isFunction(self.configuration.clickHandler) ? "italic " : "") + self.configuration.font;
                            } else {

                                contextRender.font = (m_bMouseIn && $.isFunction(self.configuration.clickHandler) ? "italic " : "") + settings.general.font;
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
							if (self.configuration.fillStyle) {

	                            contextRender.fillStyle = self.configuration.fillStyle;
							} else {

	                            contextRender.fillStyle = settings.general.fillText;
							}

							if (self.protected) {

								contextRender.fillText(self.text,
									m_area.location.x,
									m_area.location.y,
									m_area.extent.width);
							} else {

								contextRender.fillText(self.text,
									m_area.location.x + (m_bMouseDown ? 3 : 0),
									m_area.location.y + (m_bMouseDown ? 3 : 0),
									m_area.extent.width);
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
                    // Keep track of mouse in label.
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
