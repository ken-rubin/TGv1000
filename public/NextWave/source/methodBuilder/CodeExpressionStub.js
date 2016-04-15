///////////////////////////////////////
// CodeExpressionSub module.
//
// GUI module contains an expression.
// Owned by statements and expressions.
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
    "methodBuilder/CodeExpression"],
    function (prototypes, settings, Point, Size, Area, glyphs, CodeExpression) {

        try {

            // Constructor function.
        	var functionRet = function CodeExpressionStub(cePayload) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Indicates the type is highlighted.
                    self.highlight = false;
                    // The contained CodeExpression.
                    self.payload = cePayload;               // May be null.
                    // The render area.
                    self.area = null;

                    // If payload is not null, then set collection.
                    if (self.payload) {

                        self.payload.collection = self;
                    }

                    ////////////////////////
                    // Public methods.

                    // Add payload.
                    self.addItem = function (itemNew) {

                        try {

                            // Stow.
                            self.payload = itemNew;

                            // Identify parent.
                            itemNew.collection = self;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove item from list of items.
                    self.removeItem = function (itemRemove) {

                        try {

                            // If match...
                            if (itemRemove === self.payload) {

                                // ...remove.
                                self.payload = null;
                                itemRemove.collection = null;
                                itemRemove.highlight = false;
                            }

                            // Identify parent.
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear area.
                    self.clearArea = function () {

                        try {

                            self.area = null;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Returns the width of this stub.
                    self.getWidth = function (contextRender) {

                        // Defer to payload, or...
                        if (self.payload) {

                            return self.payload.getWidth(contextRender);
                        }
                        // ...return empty stub width.
                        return settings.codeExpressionStub.emptyWidth;
                    };

                    // Invoked when the mouse is pressed down over the type.
                    self.mouseDown = function (objectReference) {

                        try {

                            if (m_objectHighlight) {

                                // Store the cursor item as the drag object.
                                var exceptionRet = window.manager.setDragObject(m_objectHighlight);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }

                                // Pass down to highlight object.
                                return m_objectHighlight.mouseDown(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved over the type.
                    self.mouseMove = function (objectReference) {

                        try {

                            // If there is a payload, ...
                            if (self.payload) {

                                // If the point is in the block, then highlight it.
                                var bRet = self.payload.pointIn(objectReference.contextRender, 
                                    objectReference.pointCursor);
                                if (bRet) {

                                    m_objectHighlight = self.payload;
                                    m_objectHighlight.highlight = true;
                                }

                                // If over an object, pass mouse move to it.
                                if (m_objectHighlight) {

                                    var exceptionRet = m_objectHighlight.mouseMove(objectReference);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved out of the type.
                    self.mouseOut = function (objectReference) {

                        try {

                            // Reset highlight.
                            if (m_objectHighlight) {

                                // Don't check return...just a mouse out.
                                m_objectHighlight.mouseOut(objectReference);
                                m_objectHighlight.highlight = false;
                                m_objectHighlight = null;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Test if the point is in this Type.
                    self.pointIn = function (contextRender, point) {

                        // Return false if never rendered.
                        if (!self.area) {

                            return false;
                        }

                        // Return hit-test against generated path.
                        return self.area.pointInArea(contextRender,
                            point);
                    }

                    // Render out this type.
                    self.render = function (contextRender, areaRender, dX) {

                        try {

                            // Define the containing area.
                            self.area = new Area(
                                new Point(areaRender.location.x + dX, 
                                    areaRender.location.y),
                                new Size(self.getWidth(contextRender), 
                                    areaRender.extent.height)
                            );

                            // Defer to payload, if set...
                            if (self.payload) {

                                return self.payload.render(contextRender,
                                    self.area,
                                    0);
                            }

                            // ...else, generate the path.
                            var exceptionRet = self.area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Determine if connected to statement.
                            var objectCollection = self.collection;
                            while (objectCollection &&
                                !(objectCollection.isStatement)) {

                                objectCollection = objectCollection.collection;
                            }
                            var bConnectedToStatement = objectCollection;

                            // Fill and stroke the path.
                            if ((window.draggingStatement || window.draggingExpression) &&
                                bConnectedToStatement) {

                                if (window.draggingExpression) {

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
                                } else {

                                    contextRender.fillStyle = settings.general.fillDrag;
                                    contextRender.strokeStyle = settings.general.strokeDrag;
                                }
                                contextRender.stroke();
                            } else if (self.highlight) {

                                contextRender.fillStyle = settings.codeExpressionStub.fillBackgroundHighlight;
                            } else {

                                contextRender.fillStyle = settings.codeExpressionStub.fillBackground;
                            }
                            contextRender.fill();

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };
                    // Remember which object has the highlight.
                    var m_objectHighlight = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });