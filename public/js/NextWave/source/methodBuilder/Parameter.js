///////////////////////////////////////
// Parameter module.
//
// Gui component for parameter.
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
    "NextWave/source/utility/Edit"],
    function (prototypes, settings, Point, Size, Area, glyphs, Edit) {

        try {

            // Constructor function.
        	var functionRet = function Parameter(strName, strTypeName) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Name of this Parameter object.
                    self.name = new Edit(strName || "default");
                    // Name of the type of this Parameter object.
                    self.typeName = strTypeName || "";
                    // Indicates the type is highlighted.
                    self.highlight = false;

                    // Wire up the name enter focus to set the 
                    // name of the parameter before it is changed.
                    self.name.enterFocus = function (localSelf) {

                        try {

                            // Set the name in the field.
                            localSelf.originalName = localSelf.getText();
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Wire up the name exit focus to update the 
                    // name of the parameter when it is changed.
                    self.name.exitFocus = function (localSelf) {

                        try {

                            // If the name has changed, update it.
                            if (localSelf.originalName !== localSelf.getText()) {

                                // Generate unique renamer.
                                var strBetterName = window.manager.getUniqueName(localSelf.getText());

                                // Store back in Edit.
                                var exceptionRet = localSelf.setText(strBetterName);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // Update.
                                exceptionRet = window.manager.editNameType(localSelf.originalName,
                                    strBetterName);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    ////////////////////////
                    // Public methods.

                    // Return private area field.
                    self.area = function () {

                        return m_area;
                    };

                    // Return a new instance of a Parameter.
                    self.clone = function () {

                        return new self.constructor(strName,
                            strTypeName);
                    };

                    // Generates JavaScript string for this parameter.
                    self.generateJavaScript = function () {

                        var strParameter = " ";

                        strParameter += self.name.getText();

                        strParameter += " ";

                        return strParameter;
                    };

                    // Return the area for dragging rendering.
                    self.getDragArea = function () {

                        return new Area(m_area.location,
                            new Size(m_area.extent.width, 
                                m_area.extent.height + 2 * settings.general.margin));
                    };

                    // Return a new object for this Parameter.
                    self.save = function () {

                        var objectRet = {

                            type: self.constructor.name,
                            parameters: [
                                { type: "String", value: self.name.text },
                                { type: "String", value: self.typeName }
                            ]
                        }
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

                    // Wire events to self.name:
                    self.mouseMove = function (objectReference) {

                        return self.name.mouseMove(objectReference);
                    };
                    self.mouseOut = function (objectReference) {

                        return self.name.mouseOut(objectReference);
                    };
                    self.mouseDown = function (objectReference) {

                        // Set the focus to the Edit.
                        var exceptionRet = window.manager.setFocus(self.name);
                        if (exceptionRet) {

                            return exceptionRet;
                        }
                        return self.name.mouseDown(objectReference);
                    };

                    // Returns the width of this type.
                    self.getWidth = function (contextRender) {

                        return self.name.getWidth(contextRender) + 
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
                                new Point(areaRender.location.x + dX + settings.general.margin, 
                                    areaRender.location.y + settings.general.margin),
                                new Size(self.getWidth(contextRender) - 2 * settings.general.margin, 
                                    areaRender.extent.height - 2 * settings.general.margin)
                            );

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            if (self.parameterDragStub) {

                                // Fill and stroke the path.
                                if (self.highlight) {

                                    contextRender.fillStyle = settings.statementDragStub.fillHighlight;
                                } else {

                                    // Blinky blinky.
                                    if (Math.floor(new Date().getTime() / settings.statementDragStub.blinkMS) % 2 === 0) {

                                        contextRender.fillStyle = settings.statementDragStub.fillEven;
                                    } else {

                                        contextRender.fillStyle = settings.statementDragStub.fillOdd;
                                    }
                                }
                                contextRender.fill();
                            } else {

                                // Fill and stroke the path.
                                if (self.dragObject) {

                                    contextRender.fillStyle = settings.parameter.fillBackground;
                                    contextRender.strokeStyle = settings.general.strokeBackground;
                                } else if (window.draggingObject) {

                                    contextRender.fillStyle = settings.general.fillDrag;
                                    contextRender.strokeStyle = settings.general.strokeDrag;
                                } else if (self.highlight) {

                                    contextRender.fillStyle = settings.general.fillBackgroundHighlight;
                                    contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                                } else {

                                    contextRender.fillStyle = settings.parameter.fillBackground;
                                    contextRender.strokeStyle = settings.general.strokeBackground;
                                }
                                contextRender.fill();
                                contextRender.stroke();
                            }

                            // Let the name edit render itself.
                            return self.name.render(contextRender,
                                false,
                                m_area);
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
