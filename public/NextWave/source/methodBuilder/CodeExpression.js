///////////////////////////////////////
// CodeExpression base module.
//
// Base class for all code expressions.
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
    "methodBuilder/CodeLiteral",
    "methodBuilder/CodeName"],
    function (prototypes, settings, Point, Size, Area, glyphs, CodeLiteral, CodeName) {

        try {

            // Constructor function.
        	var functionRet = function CodeExpression(strDisplayTemplate) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Indicates the type is highlighted.
                    self.highlight = false;
                    // The display template for this CodeExpression.
                    self.displayTemplate = strDisplayTemplate || "";
                    // Array containing children.
                    self.children = [];
                    // Boolean indicates expression properties have been parsed.
                    self.parsed = false;

                    ////////////////////////
                    // Public methods.

                    // Get all the drag targets from all the statements.
                    self.accumulateDragTargets = function (arrayAccumulator) {

                        try {

                            // Loop over each child stub.
                            for (var i = 0; i < self.children.length; i++) {

                                var itemIth = self.children[i];

                                // If stub, ...
                                if (itemIth.constructor.name === "CodeExpressionStub") {

                                    // ...and there is a payload...
                                    if (itemIth.payload) {

                                        // ...recurse.
                                        var exceptionRet = itemIth.payload.accumulateDragTargets(arrayAccumulator);
                                        if (exceptionRet) {

                                            return exceptionRet;
                                        }
                                    } else {

                                        // else, got one!
                                        arrayAccumulator.push(itemIth);
                                    }
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Add item to list of items.
                    self.addItem = function (itemNew) {

                        try {

                            // Stow.
                            self.children.push(itemNew);

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

                            for (var i = 0; i < self.children.length; i++) {

                                // Get the ith, to test.
                                var itemIth = self.children[i];

                                // If find a match...
                                if (itemIth === itemRemove) {

                                    // ...remove it.
                                    self.children.splice(i, 1);

                                    // And done.
                                    break;
                                }
                            }

                            // Identify parent.
                            itemRemove.collection = null;
                            itemRemove.highlight = false;
                            return null;
                        } catch (e) {

                            return e;
                        }
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

                    // Return the area for dragging rendering.
                    self.getDragArea = function () {

                        return m_area.clone();
                    };

                    // Returns the height of this type.
                    self.getWidth = function (contextRender) {

                        // No better place to do this....
                        if (!self.parsed) {

                            // Scan for blocks and expressionStubs.
                            var arrayKeys = Object.keys(self);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                // Extract the key.
                                var strKeyIth = arrayKeys[i];

                                // Definately skip collection--it causes a circular reference.
                                if (strKeyIth === "collection") {

                                    continue;
                                } 

                                // Extract the object.
                                var objectIth = self[strKeyIth];

                                // Test object.
                                if (objectIth &&
                                    (objectIth instanceof CodeName ||
                                    objectIth instanceof CodeLiteral ||
                                    // Can't require CodeExpressionStub type because it 
                                    // requires this type (cyclic reference), thus....
                                    objectIth.constructor.name === "CodeExpressionStub" ||
                                    // Also....
                                    objectIth.constructor.name === "ParameterList")) {

                                    // Add the item.
                                    var exceptionRet = self.addItem(objectIth);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }
                            }

                            self.parsed = true;
                        }

                        /////////
                        // Process display template:
                        var arrayDisplayTemplate = self.displayTemplate.split(/(.*?)(\[.*?\])/g).filter(function (strItem) { return (strItem.length > 0); });

                        // Render out the display parts.
                        var dWidth = 0;
                        for (var i = 0; i < arrayDisplayTemplate.length; i++) {

                            // Get the ith component.
                            var strIth = arrayDisplayTemplate[i];

                            // If the first character is a '[', then render the object.
                            if (strIth[0] === '[') {

                                // Extract the property.
                                var strProperty = strIth.substring(1, strIth.length - 1);
                                // Ask it for its width....
                                if ($.isFunction(self[strProperty].getWidth)) {

                                    dWidth += self[strProperty].getWidth(contextRender);
                                } else {

                                    // ...or do it for it.
                                    dWidth += Math.min(200,
                                        self[strProperty].getTotalExtent(contextRender));
                                }
                            } else {

                                // Else do a measure text.
                                contextRender.font = settings.codeStatement.font;
                                dWidth += contextRender.measureText(strIth).width;
                            }
                        }

                        return dWidth;
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

                            // Reset highlight.
                            var exceptionRet = self.mouseOut(objectReference);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Test if over a child.
                            for (var i = 0; i < self.children.length; i++) {

                                var childIth = self.children[i];

                                // If the point is in the block, then highlight it.
                                var bRet = childIth.pointIn(objectReference.contextRender, 
                                    objectReference.pointCursor);
                                if (bRet) {

                                    m_objectHighlight = childIth;
                                    m_objectHighlight.highlight = true;
                                    break;
                                }
                            }

                            // If over an object, pass mouse move to it.
                            if (m_objectHighlight) {

                                exceptionRet = m_objectHighlight.mouseMove(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
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

                            // Fill and stroke the path.
                            if ((window.draggingStatement || window.draggingExpression) &&
                                self.collection) {

                                contextRender.fillStyle = settings.general.fillDrag;
                            } else if (self.highlight) {

                                contextRender.fillStyle = settings.general.fillBackgroundHighlight;
                                contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                                contextRender.stroke();
                            } else {

                                contextRender.fillStyle = settings.list.expression.fillBackground;
                            }
                            //contextRender.fill();

                            /////////
                            // Process display template:
                            var arrayDisplayTemplate = self.displayTemplate.split(/(.*?)(\[.*?\])/g).filter(function (strItem) { return (strItem.length > 0); });

                            // Define where to render it.
                            var areaRenderDisplay = new Area(new Point(m_area.location.x,
                                    m_area.location.y),
                                new Size(m_area.extent.width, 
                                    m_area.extent.height));

                            // Render out the display parts.
                            var dCursorX = 0;
                            for (var i = 0; i < arrayDisplayTemplate.length; i++) {

                                // Get the ith component.
                                var strIth = arrayDisplayTemplate[i];

                                // If the first character is a '[', then render the object.
                                if (strIth[0] === '[') {

                                    // Extract the property.
                                    var strProperty = strIth.substring(1, strIth.length - 1);

                                    // If calculateLayout is defined, call it before render.
                                    if ($.isFunction(self[strProperty].calculateLayout)) {

                                        var areaMaximal = new Area(new Point(areaRenderDisplay.location.x + dCursorX,
                                                areaRenderDisplay.location.y),
                                            new Size(Math.min(200,
                                                    self[strProperty].getTotalExtent(contextRender)),
                                                areaRenderDisplay.extent.height));
                                        exceptionRet = self[strProperty].calculateLayout(areaMaximal,
                                            contextRender);
                                        if (exceptionRet) {

                                            throw exceptionRet;
                                        }
                                    }

                                    // Expression to render....
                                    contextRender.font = settings.codeStatement.font;
                                    var exceptionRet = self[strProperty].render(contextRender, 
                                        areaRenderDisplay, 
                                        dCursorX);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }

                                    // Get width, if specified.
                                    if ($.isFunction(self[strProperty].getWidth)) {

                                        dCursorX += self[strProperty].getWidth(contextRender);
                                    } else {

                                        dCursorX += Math.min(200,
                                            self[strProperty].getTotalExtent(contextRender));
                                    }
                                } else {

                                    // Else do a fill text.
                                    contextRender.font = settings.codeStatement.font;
                                    contextRender.fillStyle = settings.general.fillText;
                                    contextRender.fillText(strIth,
                                        areaRenderDisplay.location.x + dCursorX,
                                        areaRenderDisplay.location.y,
                                        areaRenderDisplay.extent.width);
                                    dCursorX += contextRender.measureText(strIth).width;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // The area, relative to the canvas, occupied by this instance.
                    var m_area = null;
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
