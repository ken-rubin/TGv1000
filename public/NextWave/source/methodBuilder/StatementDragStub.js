///////////////////////////////////////
// StatementDragStub module.
//
// A stub to where statements can be dragged.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "utility/settings",
    "utility/Point",
    "utility/Size",
    "utility/Area"],
    function (prototypes, settings, Point, Size, Area) {

        try {

            // Constructor function.
        	var functionRet = function StatementDragStub() {

                try {

            		var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public fields.

                    // Indicates this instance is so.
                    self.highlight = false;

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
                    self.getHeight = function () {

                        return settings.statementDragStub.height + 2 * settings.general.margin;
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
                    self.render = function (contextRender, areaRender, dY) {

                        try {

                            // Define the containing area.
                            m_area = new Area(
                                new Point(areaRender.location.x + areaRender.extent.width * settings.statementDragStub.widthMarginPercent, 
                                    areaRender.location.y + settings.general.margin + dY),
                                new Size(areaRender.extent.width  * (1 - 2 * settings.statementDragStub.widthMarginPercent), 
                                    self.getHeight() - 2 * settings.general.margin)
                            );

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Fill and stroke the path.
                            if (self.highlight) {

                                contextRender.fillStyle = settings.statementDragStub.fillHighlight;
                            } else {

                                if (Math.floor(new Date().getTime() / 500) % 2 === 0) {

                                    contextRender.fillStyle = settings.statementDragStub.fillEven;
                                } else {

                                    contextRender.fillStyle = settings.statementDragStub.fillOdd;
                                }
                            }
                            contextRender.strokeStyle = settings.general.strokeBackground;

                            contextRender.fill();
                            contextRender.stroke();

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
