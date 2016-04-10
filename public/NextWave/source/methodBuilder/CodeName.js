///////////////////////////////////////
// CodeName base module.
//
// Base class for all code literals.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "utility/settings",
    "utility/Point",
    "utility/Size",
    "utility/Area",
    "utility/glyphs",
    "methodBuilder/CodeStatement"],
    function (prototypes, settings, Point, Size, Area, glyphs, CodeStatement) {

        try {

            // Constructor function.
            var functionRet = function CodeName(strPayload) {

                try {

                    var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Indicates the type is highlighted.
                    self.highlight = false;
                    // For now, all literals are strings.
                    self.payload = strPayload || "";

                    ////////////////////////
                    // Public methods.

                    // Clear area.
                    self.clearArea = function () {

                        try {

                            m_area = null;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Returns the height of this type.
                    self.getWidth = function (contextRender) {

                        if (!self.payload) {

                            return settings.codeName.emptyWidth;
                        }
                        return contextRender.measureText(self.payload).width + 
                            2 * settings.general.margin;
                    };

                    // Invoked when the mouse is pressed down over the type.
                    self.mouseDown = function (objectReference) {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved over the type.
                    self.mouseMove = function (objectReference) {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved out of the type.
                    self.mouseOut = function (objectReference) {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Test if the point is in this Type.
                    self.pointIn = function (contextRender, point) {

                        // Return false if never rendered.
                        if (!m_area) {

                            return false;
                        }

                        // Return hit-test against generated path.
                        return m_area.pointInArea(contextRender,
                            point);
                    }

                    // Render out this type.
                    self.render = function (contextRender, areaRender, dX) {

                        try {

                            // Define the containing area.
                            m_area = new Area(
                                new Point(areaRender.location.x + dX, 
                                    areaRender.location.y),
                                new Size(self.getWidth(contextRender), 
                                    areaRender.extent.height)
                            );

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Determine if connected to statement.
                            var objectCollection = self.collection;
                            while (objectCollection &&
                                !(objectCollection.isStatement)) {

                                objectCollection = objectCollection.collection;
                            }
                            var bConnectedToStatement = (objectCollection != null);

                            // Fill and stroke the path.
                            if ((window.draggingStatement || window.draggingExpression) &&
                                bConnectedToStatement) {

                                contextRender.fillStyle = settings.general.fillDrag;
                            } else if (self.highlight) {

                                contextRender.fillStyle = settings.general.fillBackgroundHighlight;
                            } else {

                                contextRender.fillStyle = settings.list.name.fillBackground;
                            }
                            contextRender.fill();

                            // Render the payload.
                            contextRender.fillStyle = settings.general.fillText;
                            contextRender.fillText(self.payload,
                                m_area.location.x + settings.general.margin,
                                m_area.location.y,
                                m_area.extent.width - 2 * settings.general.margin);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // The area, relative to the canvas, occupied by this instance.
                    var m_area = null;
                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
