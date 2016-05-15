///////////////////////////////////////
// CodeLiteral base module.
//
// Base class for all code literals.
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
    "NextWave/source/utility/glyphs",
    "NextWave/source/utility/InPlaceEditHelper",
    "NextWave/source/methodBuilder/CodeStatement"],
    function (prototypes, settings, Point, Size, Area, glyphs, InPlaceEditHelper, CodeStatement) {

        try {

            // Constructor function.
        	var functionRet = function CodeLiteral(strPayload) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Indicates the type is highlighted.
                    self.highlight = false;
                    // For now, all literals are strings.
                    self.payload = strPayload || "";
                    // Set the maximum horizontal extent.
                    self.maxWidth = null;
                    // Allocate the in place editor helper.
                    self.inPlaceEditor = new InPlaceEditHelper(self, 
                        "payload",      // Value member.
                        "collection");  // Focus member.

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a CodeLiteral.
                    self.clone = function () {

                        return new self.constructor(self.payload);
                    };

                    // Generate JavaScript for this literal.
                    self.generateJavaScript = function () {

                        var strBlock = " ";

                        strBlock += self.payload;

                        strBlock += " ";
                        return strBlock;
                    };

                    // Save constructor parameters.
                    self.save = function () {

                        return [{

                                type: "String",
                                value: self.payload
                            }
                        ];
                    };

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

                        // If max width set, always use it.
                        if (self.maxWidth) {

                            return self.maxWidth;
                        }

                        if (!self.payload) {

                            return settings.codeLiteral.emptyWidth;
                        }
                        return contextRender.measureText(self.payload).width + 
                            2 * settings.general.margin;
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

                            // Draw border on highlight.
                            if (self.highlight) {

                                contextRender.strokeStyle = "#000";
                                contextRender.stroke();
                            }

                            // After defining location, and generating the path,
                            // defer to the in place editor to handle rendering.
                            // If will call back to the function parameter to
                            // handle non-focused rendering that is non in-place.
                            return self.inPlaceEditor.render(contextRender,
                                m_area,
                                function () {

                                    try {

                                        // Now render the label.
                                        contextRender.fillStyle = settings.general.fillText;
                                        contextRender.fillText(self.payload,
                                            m_area.location.x + settings.general.margin,
                                            m_area.location.y,
                                            m_area.extent.width - 2 * settings.general.margin);
                                        return null;
                                    } catch (e) {

                                        return e;
                                    }
                                });
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
