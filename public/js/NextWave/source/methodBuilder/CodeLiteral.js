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
    "NextWave/source/utility/Edit",
    "NextWave/source/methodBuilder/CodeStatement"],
    function (prototypes, settings, Point, Size, Area, glyphs, Edit, CodeStatement) {

        try {

            // Constructor function.
        	var functionRet = function CodeLiteral(strPayload, bMultiline) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Indicates the type is highlighted.
                    self.highlight = false;
                    // Indicates this is a multiline edit.
                    self.multiline = bMultiline || false;
                    // For now, all literals are Edits.
                    self.payload = new Edit(strPayload || "",
                        self.multiline);
                    // Set the maximum horizontal extent.
                    self.maxWidth = null;

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a CodeLiteral.
                    self.clone = function () {

                        return new self.constructor(self.payload.text, 
                            self.multiline);
                    };

                    // Generate JavaScript for this literal.
                    self.generateJavaScript = function () {

                        var strBlock = " ";

                        // Call virtual, which defaults to the payload text.
                        strBlock += self.innerGenerateJavaScript();

                        strBlock += " ";
                        return strBlock;
                    };

                    // Generate JavaScript for this literal.
                    self.innerGenerateJavaScript = function () {

                        return self.payload.text;
                    };

                    // Save constructor parameters.
                    self.save = function () {

                        var objectRet = {};

                        objectRet.type = self.constructor.name;
                        objectRet.parameters = [{

                                type: "String",
                                value: self.payload.text
                            }
                        ];

                        return objectRet;
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

                    // Returns the width of this type.
                    self.getWidth = function (contextRender) {

                        // If max width set, always use it.
                        if (self.maxWidth) {

                            return self.maxWidth;
                        }

                        return self.payload.getWidth(contextRender);
                    };

                    // Test if the point is in this Type.
                    self.pointIn = function (contextRender, point) {

                        // Return hit-test against payload.
                        return self.payload.pointIn(contextRender,
                            point);
                    };

                    // Wire up events:

                    // Pass events to payload.
                    self.mouseOut = function (objectReference) {

                        try {

                            return self.payload.mouseOut(objectReference);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass events to payload.
                    self.mouseDown = function (objectReference) {

                        try {

                            // Set the payload as the selected object.
                            var exceptionRet = window.manager.setFocus(self.payload);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return self.payload.mouseDown(objectReference);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass events to payload.
                    self.mouseMove = function (objectReference) {

                        try {

                            return self.payload.mouseMove(objectReference);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass events to payload.
                    self.mouseWheel = function (objectReference) {

                        try {

                            return self.payload.mouseWheel(objectReference);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass events to payload.
                    self.click = function (objectReference) {

                        try {

                            return self.payload.click(objectReference);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out this type.
                    self.render = function (contextRender, areaRender, dX) {

                        try {

                            // Ask the payload to render itself.
                            return self.payload.render(contextRender,
                                false,
                                new Area(
                                    new Point(areaRender.location.x + dX, 
                                        areaRender.location.y),
                                    new Size(self.getWidth(contextRender), 
                                        areaRender.extent.height)));
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // The area, relative to the canvas, occupied by this instance.
                    //var m_area = null;
                    // The last area rendered.  Helps call 
                    // calculate layout in the Edit when necessary.
                    //var m_areaLast = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
