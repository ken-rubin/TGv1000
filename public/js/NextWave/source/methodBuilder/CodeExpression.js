///////////////////////////////////////
// CodeExpression base module.
//
// Base class for all code expressions.
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
    "NextWave/source/methodBuilder/CodeLiteral",
    "NextWave/source/methodBuilder/CodeName",
    "NextWave/source/methodBuilder/CodeVar"
    ],
    function (prototypes, settings, Point, Size, Area, glyphs, CodeLiteral, CodeName, CodeVar) {

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

                    // Get all argument lists.
                    self.accumulateExpressionPlacements = function (arrayAccumulator) {

                        try {

                            // Ensure parsed.
                            if (!self.parsed) {

                                var exceptionRet = m_functionParse();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Loop over each child.
                            for (var i = 0; i < self.children.length; i++) {

                                var itemIth = self.children[i];

                                // If stub, ...
                                if (itemIth.constructor.name === "ParameterList") {

                                    // ...add one, and...
                                    arrayAccumulator.push({

                                        collection: itemIth
                                    });

                                    // ...recurse.
                                    var exceptionRet = itemIth.accumulateExpressionPlacements(arrayAccumulator);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                } else if (itemIth.constructor.name === "CodeExpressionStub") {

                                    // ...recurse.
                                    var exceptionRet = itemIth.accumulateExpressionPlacements(arrayAccumulator);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Get all the drag targets from all the statements.
                    self.accumulateDragTargets = function (arrayAccumulator) {

                        try {

                            // Ensure parsed.
                            if (!self.parsed) {

                                var exceptionRet = m_functionParse();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Loop over each child stub.
                            for (var i = 0; i < self.children.length; i++) {

                                var itemIth = self.children[i];

                                // If stub, ...
                                if (itemIth.constructor.name === "CodeExpressionStub") {

                                    // ...and there is a payload (which is not a literal or name...
                                    if (itemIth.payload &&
                                        !(itemIth.payload instanceof CodeLiteral) &&
                                        !(itemIth.payload instanceof CodeVar) &&
                                        !(itemIth.payload instanceof CodeName)) {

                                        // ...recurse.
                                        var exceptionRet = itemIth.payload.accumulateDragTargets(arrayAccumulator);
                                        if (exceptionRet) {

                                            return exceptionRet;
                                        }
                                    } else {

                                        // else, got one!
                                        arrayAccumulator.push(itemIth);
                                    }
                                } else if (itemIth.constructor.name === "ParameterList") {

                                    // Scan it as well.
                                    var exceptionRet = itemIth.accumulateDragTargets(arrayAccumulator);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Get all names from all the children.
                    // Or maybe just return null and let classes that inherit CodeExpression do their work.
                    self.accumulateNames = function (arrayNames) {

                        try {

                            var exceptionRet = null;

                            if (!self.parsed) {

                                // Parse it.
                                exceptionRet = m_functionParse();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            exceptionRet = self.innerAccumulateNames(arrayNames);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return null;

                        } catch (e) {

                            return e;
                        }
                    };

                    self.innerAccumulateNames = function (arrayNames) {

                        return null;
                    };

                    //
                    self.changeName = function (strOriginalName, strNewName) {

                        try {

                            if (self.children) {

                                for (var i = 0; i < self.children.length; i++) {

                                    var exceptionRet = self.children[i].changeName(strOriginalName, strNewName);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }
                            }

                            return null;

                        } catch (e) {

                            return e;
                        }
                    }

                    //
                    self.changeMethodName = function (strTypeName, strOriginalMethodName, strNewMethodName) {

                        try {

                            if (self.children) {

                                for (var i = 0; i < self.children.length; i++) {

                                    var exceptionRet = self.children[i].changeMethodName(strTypeName, strOriginalMethodName, strNewMethodName);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }
                            }

                            return null;

                        } catch (e) {

                            return e;
                        }
                    }

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

                    // Virtual method in base class.
                    self.clone = function () {

                        // Just clone the base....
                        return new self.constructor(strDisplayTemplate);
                    };

                    // Return the area for dragging rendering.
                    self.getDragArea = function () {

                        return m_area.clone();
                    };

                    // Returns the height of this type.
                    self.getWidth = function (contextRender) {

                        var exceptionRet = null;

                        // No better place to do this....
                        if (!self.parsed) {

                            exceptionRet = m_functionParse();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return null;
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
                                } else if ($.isFunction(self[strProperty].getTotalExtent)) {

                                    // ...or do it for it.
                                    dWidth += Math.min(200,
                                        self[strProperty].getTotalExtent(contextRender));
                                } else {

                                    dWidth += 10;
                                }
                            } else {

                                // Else do a measure text.
                                contextRender.font = settings.codeStatement.font;
                                dWidth += contextRender.measureText(strIth).width;
                            }
                        }

                        return dWidth;
                    };

                    // Generate JavaScript for this expression.
                    self.generateJavaScript = function () {

                        var strExpression = " ";

                        // Process display template:
                        var arrayDisplayTemplate = self.displayTemplate.split(/(.*?)(\[.*?\])/g).filter(function (strItem) { return (strItem.length > 0); });
                        for (var i = 0; i < arrayDisplayTemplate.length; i++) {

                            // Get the ith component.
                            var strIth = arrayDisplayTemplate[i];

                            // If the first character is a '[', then render the object.
                            if (strIth[0] === '[') {

                                // Extract the property.
                                var strProperty = strIth.substring(1, strIth.length - 1);

                                strExpression += self[strProperty].generateJavaScript();
                            } else {

                                strExpression += " " + strIth + " ";
                            }
                        }

                        strExpression += " ";
                        return strExpression;
                    };

                    // Save.
                    self.save = function () {

                        var objectRet = {};

                        objectRet.type = self.constructor.name;
                        objectRet.parameters = self.innerSave();

                        return objectRet;
                    };

                    // Inner save.  Base class returns no parameters.
                    self.innerSave = function () {

                        return [];
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
                                if ($.isFunction(m_objectHighlight.mouseDown)) {

                                    return m_objectHighlight.mouseDown(objectReference);
                                }
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
                            if (m_objectHighlight &&
                                $.isFunction(m_objectHighlight.mouseMove)) {

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
                                if ($.isFunction(m_objectHighlight.mouseOut)) {

                                    m_objectHighlight.mouseOut(objectReference);
                                }
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
                            if ((window.draggingObject) &&
                                self.collection) {

                                //contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                                //contextRender.stroke();
                            } else if (self.highlight) {

                                contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                                contextRender.stroke();
                            }

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
                                    var strProperty = strIth.substring(1, 
                                        strIth.length - 1);

                                    // Get width, if specified.
                                    var dWidthOfThisObject = 0;
                                    if ($.isFunction(self[strProperty].getWidth)) {

                                        dWidthOfThisObject = self[strProperty].getWidth(contextRender);
                                    } else if ($.isFunction(self[strProperty].getTotalExtent)) {

                                        dWidthOfThisObject = self[strProperty].getTotalExtent(contextRender);
                                    }

                                    // If calculateLayout is defined, call it before render.
                                    if ($.isFunction(self[strProperty].calculateLayout)) {

                                        var areaMaximal = new Area(new Point(areaRenderDisplay.location.x + dCursorX,
                                                areaRenderDisplay.location.y),
                                            new Size(dWidthOfThisObject,
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
                                    dCursorX += dWidthOfThisObject;
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
                    // Private methods.

                    // Scan for children.
                    var m_functionParse = function () {

                        try {

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
                                    objectIth instanceof CodeVar ||
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
