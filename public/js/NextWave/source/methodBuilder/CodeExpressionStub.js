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
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/glyphs",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area"],
    function (prototypes, settings, glyphs, Point, Size, Area) {

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
                    self.payload = cePayload;               // May be null or undefined--which is turned into null.
                    // The render area.
                    self.area = null;
                    // Indicates that this object is displayed as and  
                    // functions as an expression placement in an ArgumentList.
                    self.placement = false;
                    // Callback invoked when the payload is set.
                    self.onPayloadSet = null;

                    // If payload is not null, then set collection.
                    if (self.payload) {

                        self.payload.collection = self;
                    }

                    ////////////////////////
                    // Public methods.

                    // Pass onto payload, if set.
                    self.accumulateExpressionPlacements = function (arrayAccumulator) {

                        try {

                            // If there is a payload, check it.
                            if (self.payload) {

                                return self.payload.accumulateExpressionPlacements(arrayAccumulator);
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

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

                    // If self.payload exists, it is one of the CodeExpressionXxx's.
                    // They all inherit CodeExpression, so there is a self.accumulateTypeNames there that returns null
                    // and is overridden in any CodeExpressionXxx that should produce a Name.
                    // For example, for something like var i = 0; self.payload will be a CodeExpressionInfix.
                    self.accumulateNames = function (arrayNames) {

                        try {

                            // self.payload is one of CodeExpressionXxx; all derived from CodeExpression
                            // which will return null unless overridden.
                            if (self.payload) {

                                return self.payload.accumulateNames(arrayNames);

                            } else {

                                return null;
                            }
                        } catch (e) {
                            return e;
                        }
                    }

                    //
                    self.changeName = function (strOriginalName, strNewName) {

                        try {

                            if (self.payload) {

                                return self.payload.changeName(strOriginalName, strNewName);
                            }

                            return null;

                        } catch (e) {

                            return e;
                        }
                    }

                    //
                    self.changeMethodName = function (strTypeName, strOriginalMethodName, strNewMethodName) {

                        try {

                            if (self.payload) {

                                return self.payload.changeMethodName(strTypeName, strOriginalMethodName, strNewMethodName);
                            }

                            return null;

                        } catch (e) {

                            return e;
                        }
                    }

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

                    // Clone payload.
                    self.clone = function () {

                        if (self.payload) {

                            return self.payload.clone();
                        } else {

                            return null;
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

                    // Pass to payload.
                    self.generateJavaScript = function () {

                        if (self.payload) {

                            return self.payload.generateJavaScript();
                        }
                    };

                    // Just pass through to the payload.
                    self.save = function () {

                        // If set, otherwise...
                        if (self.payload) {

                            return self.payload.save();
                        }

                        // ...null?
                        return null;
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

                    // Invoked when the mouse is clicked over the item.
                    self.click = function (objectReference) {

                        try {

                            if (m_objectHighlight &&
                                $.isFunction(m_objectHighlight.click)) {

                                // Pass down to highlight object.
                                return m_objectHighlight.click(objectReference);
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

                    // Render out this stub.
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

                            // Fill and stroke the path:

                            // If dragging, display differently, unless this
                            // stub is not connected to a statement (i.e it
                            // is the thing being dragged, I think at least).
                            if (window.draggingObject &&
                                bConnectedToStatement) {

                                // If dragging an expression, then this is a possible
                                // drop target, so render as an active drop target,
                                // or as a potential drop target (e.g. blinking).
                                if (window.draggingObject.expression) {

                                    // Highlight means droppable.
                                    if (self.highlight) {

                                        contextRender.fillStyle = settings.statementDragStub.fillHighlight;
                                    } else {

                                        // Potential means blinking.
                                        if (Math.floor(new Date().getTime() / settings.statementDragStub.blinkMS) % 2 === 0) {

                                            contextRender.fillStyle = settings.statementDragStub.fillEven;
                                        } else {

                                            contextRender.fillStyle = settings.statementDragStub.fillOdd;
                                        }
                                    }
                                    contextRender.strokeStyle = settings.general.strokeBackground;
                                } else {

                                    // Dragging something other than an expression, 
                                    // so just render this as a normal drag-dimmed.
                                    contextRender.fillStyle = settings.general.fillDrag;
                                    contextRender.strokeStyle = settings.general.strokeDrag;
                                }
                                contextRender.stroke();
                                contextRender.fill();
                            } else if (self.highlight) {

                                // Non-dragging highlight.
                                contextRender.fillStyle = settings.codeExpressionStub.fillBackgroundHighlight;
                                contextRender.fill();
                            } else {

                                // Non-dragging, non-highlight.
                                contextRender.fillStyle = settings.codeExpressionStub.fillBackground;
                                contextRender.fill();
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////
                    // Private fields.

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
