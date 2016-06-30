///////////////////////////////////////
// CodeStatement base module.
//
// Base class for all code statements.
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
    "NextWave/source/methodBuilder/Block",
    "NextWave/source/methodBuilder/CodeExpressionStub"],
    function (prototypes, settings, Point, Size, Area, glyphs, Edit, Block, CodeExpressionStub) {

        try {

            // Constructor function.
        	var functionRet = function CodeStatement(strSettingsNode, strDisplayTemplate) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Indicates this is a statement.
                    self.isStatement = true;
                    // Indicates the type is highlighted.
                    self.highlight = false;
                    // Save the settings node for the specific type.
                    self.settingsNode = settings.codeStatement[strSettingsNode];
                    // The main-line render macro.
                    self.displayTemplate = strDisplayTemplate || "";
                    // Array containing Blocks.
                    self.blocks = [];
                    // Array containing CodeExpressionStubs.
                    self.expressionStubs = [];
                    // Array containing other objects (not blocks and not stubs).
                    self.others = [];
                    // Boolean indicates statement properties have been parsed.
                    self.parsed = false;
                    // Indicates that this object is displayed as and functions as a drag stub.
                    self.dragStub = false;

                    ////////////////////////
                    // Public methods.

                    // Get all the drag targets from all the expressions.
                    self.accumulateDragTargets = function (arrayAccumulator) {

                        try {

                            // Loop over each expression stub.
                            for (var i = 0; i < self.expressionStubs.length; i++) {

                                var itemIth = self.expressionStubs[i];

                                // If no payload, add it, else recurse.
                                if (itemIth.payload) {

                                    var exceptionRet = itemIth.payload.accumulateDragTargets(arrayAccumulator);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                } else {

                                    // Got one!
                                    arrayAccumulator.push(itemIth);
                                }
                            }

                            // Loop over all blocks, accumulate from each.
                            for (var i = 0; i < self.blocks.length; i++) {

                                var exceptionRet = self.blocks[i].accumulateDragTargets(arrayAccumulator);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Get all nameTypes from self.expressionStubs and self.blocks.
                    self.accumulateNameTypes = function (arrayNameTypes) {

                        try {

                            // Loop over each expression stub.
                            // for (var i = 0; i < self.expressionStubs.length; i++) {

                            //     var itemIth = self.expressionStubs[i];

                            //     // If no payload, add it, else recurse.
                            //     if (itemIth.payload) {

                            //         var exceptionRet = itemIth.payload.accumulateNameTypes(arrayNameTypes);
                            //         if (exceptionRet) {

                            //             return exceptionRet;
                            //         }
                            //     } else {

                            //         // Got one!
                            //         arrayNameTypes.push(itemIth);
                            //     }
                            // }

                            // // Loop over all blocks, accumulate from each.
                            // for (var i = 0; i < self.blocks.length; i++) {

                            //     var exceptionRet = self.blocks[i].accumulateNameTypes(arrayNameTypes);
                            //     if (exceptionRet) {

                            //         return exceptionRet;
                            //     }
                            // }

                            return null;
                            
                        } catch (e) {

                            return e;
                        }
                    };

                    // Add in statements around all elements in the 
                    // self.methodStatements list and all sub-blocks.
                    self.accumulateDragStubInsertionPoints = function (arrayAccumulator, statementDragStub, areaMethodBuilder) {

                        try {

                            // Can't add yourself to any block in yourself!
                            if (self.dragStub) {

                                return null;
                            }

                            // Loop over each block.
                            for (var i = 0; i < self.blocks.length; i++) {

                                var blockIth = self.blocks[i];

                                // If it is open, then ask it for its drag stubs.
                                if (blockIth.open) {

                                    // Call down.
                                    var exceptionRet = blockIth.accumulateDragStubInsertionPoints(arrayAccumulator,
                                        statementDragStub, 
                                        areaMethodBuilder);
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

                    // Remove statements from around all elements in 
                    // self.methodStatements list and all sub-blocks.
                    self.purgeStatementDragStubs = function () {

                        try {

                            // Loop over each statement.
                            for (var i = 0; i < self.blocks.length; i++) {

                                // Else, ask the statement to purge all SDSs too.
                                var exceptionRet = self.blocks[i].purgeStatementDragStubs();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }
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

                    // Return private area field.
                    self.area = function () {

                        return m_area;
                    };

                    // Virtual method in base class.
                    self.clone = function () {

                        // Just clone the base....
                        return new self.constructor(strSettingsNode, 
                            strDisplayTemplate);
                    };

                    // Method closes up all the blocks.
                    self.closeBlocks = function () {

                        try {

                            // No better place to do this....
                            if (!self.parsed) {

                                // Parse it.
                                var exceptionRet = m_functionParse();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Loop over them all and close them.
                            for (var i = 0; i < self.blocks.length; i++) {

                                self.blocks[i].open = false;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Return the area for dragging rendering.
                    self.getDragArea = function () {

                        return m_area.clone();
                    };

                    // Returns the height of this type with all blocks closed.
                    self.getClosedHeight = function () {

                        // If other is set, for now at least, there can be only one.
                        // And in this case, it is always an Edit--return its height.
                        if (self.others.length > 0) {

                            return self.others[0].getHeight() + 2 * settings.general.margin;
                        }

                        // All statements have an initial line.
                        var dHeight = settings.codeStatement.lineHeight + 2 * settings.general.margin;

                        // If blocks, then more than just a line.
                        for (var i = 0; i < self.blocks.length; i++) {

                            // Add in the height of the block, and also an extra margin.
                            dHeight += self.blocks[i].getClosedHeight() + settings.general.margin;
                        }

                        return dHeight;
                    };

                    // Returns the height of this type.
                    self.getHeight = function () {

                        // No better place to do this....
                        if (!self.parsed) {

                            // Parse it.
                            var exceptionRet = m_functionParse();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                        }

                        // If other is set, for now at least, there can be only one.
                        // And in this case, it is always an Edit--return its height.
                        if (self.others.length > 0) {

                            return self.others[0].getHeight() + 2 * settings.general.margin;
                        }

                        // All statements have an initial line.
                        var dHeight = settings.codeStatement.lineHeight + 2 * settings.general.margin;

                        // If blocks, then more than just a line.
                        for (var i = 0; i < self.blocks.length; i++) {

                            // Add in the height of the block, and also an extra margin.
                            dHeight += self.blocks[i].getHeight() + settings.general.margin;
                        }

                        return dHeight;
                    };

                    // Generate JavaScript for this statement.
                    self.generateJavaScript = function () {

                        var strStatement = " ";

                        // Process display template:
                        var arrayDisplayTemplate = self.displayTemplate.split(/(.*?)(\[.*?\])/g).filter(function (strItem) { return (strItem.length > 0); });

                        for (var i = 0; i < arrayDisplayTemplate.length; i++) {

                            // Get the ith component.
                            var strIth = arrayDisplayTemplate[i];

                            // If the first character is a '[', then render the object.
                            if (strIth[0] === '[') {

                                // Extract the property.
                                var strProperty = strIth.substring(1, strIth.length - 1);

                                strStatement += self[strProperty].generateJavaScript();
                            } else {

                                strStatement += " " + strIth + " ";
                            }
                        }

                        for (var i = 0; i < self.blocks.length; i++) {

                            var blockIth = self.blocks[i];
                            strStatement += blockIth.generateJavaScript();
                        }

                        return strStatement;
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

                                // If other is set, for now at least, there can be only one.
                                // And in this case, it is always an Edit--set focus to it.
                                if (self.others.length > 0) {

                                    // Set focus object.
                                    var exceptionRet = window.manager.setFocus(m_objectHighlight);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                } else {

                                    // Store the cursor item as the drag object.
                                    var exceptionRet = window.manager.setDragObject(m_objectHighlight);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
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

                            // If other is set, for now at least, there can be only one.
                            // And in this case, it is always an Edit--pass event to it.
                            if (self.others.length > 0) {

                                m_objectHighlight = self.others[0];
                                m_objectHighlight.highlight = true;
                                return m_objectHighlight.mouseMove(objectReference);
                            }

                            // Reset highlight.
                            var exceptionRet = self.mouseOut(objectReference);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Test if over a CodeExpression.
                            for (var i = 0; i < self.expressionStubs.length; i++) {

                                var cesIth = self.expressionStubs[i];

                                // If the point is in the block, then highlight it.
                                var bRet = cesIth.pointIn(objectReference.contextRender, 
                                    objectReference.pointCursor);
                                if (bRet) {

                                    m_objectHighlight = cesIth;
                                    m_objectHighlight.highlight = true;
                                    break;
                                }
                            }

                            // Test if over a Block.
                            if (!m_objectHighlight) {

                                for (var i = 0; i < self.blocks.length; i++) {

                                    var blockIth = self.blocks[i];

                                    // If the point is in the block, then highlight it.
                                    var bRet = blockIth.pointIn(objectReference.contextRender, 
                                        objectReference.pointCursor);
                                    if (bRet) {

                                        m_objectHighlight = blockIth;
                                        m_objectHighlight.highlight = true;
                                        break;
                                    }
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

                    // Invoked when the mouse wheel is spun over the item.
                    self.mouseWheel = function (objectReference) {

                        try {

                            if (m_objectHighlight &&
                                $.isFunction(m_objectHighlight.mouseWheel)) {

                                // Pass down to highlight object.
                                return m_objectHighlight.mouseWheel(objectReference);
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
                    self.render = function (contextRender, areaRender, dY) {

                        try {

                            // Define the containing area.
                            m_area = new Area(
                                new Point(areaRender.location.x + settings.general.margin, 
                                    areaRender.location.y + settings.general.margin + dY),
                                new Size(areaRender.extent.width - 2 * settings.general.margin, 
                                    self.getHeight() - 2 * settings.general.margin)
                            );

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Fill the path.
                            if (self.dragStub) {

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
                            } else {

                                if ((window.draggingObject) &&
                                    (self.collection)) {

                                    contextRender.fillStyle = settings.general.fillDrag;
                                } else if (self.highlight) {

                                    contextRender.fillStyle = settings.general.fillBackgroundHighlight;
                                } else {

                                    contextRender.fillStyle = self.settingsNode.fillBackground;
                                }
                            }
                            contextRender.fill();

                            // Save before clipping...
                            contextRender.save();
                            // ...clip to statement.
                            contextRender.clip();

                            /////////
                            // Render the primary line:

                            // Process display template:
                            var arrayDisplayTemplate = self.displayTemplate.split(/(.*?)(\[.*?\])/g).filter(function (strItem) { return (strItem.length > 0); });

                            // Define where to render it.
                            var areaRenderDisplay = new Area(new Point(m_area.location.x + settings.general.margin,
                                    m_area.location.y + settings.general.margin),
                                new Size(m_area.extent.width - 2 * settings.general.margin, 
                                    settings.codeStatement.lineHeight - 2 * settings.general.margin));

                            // Render out the main-line parts.
                            var dCursorX = 0;
                            for (var i = 0; i < arrayDisplayTemplate.length; i++) {

                                // Get the ith component.
                                var strIth = arrayDisplayTemplate[i];

                                // If the first character is a '[', then render the object.
                                if (strIth[0] === '[') {

                                    // Extract the property.
                                    var strProperty = strIth.substring(1, strIth.length - 1);

                                    // Handle edits differently....
                                    if (self[strProperty] instanceof Edit) {

                                        // Make it symmetric.
                                        var dWidth = areaRenderDisplay.extent.width - 2 * dCursorX;
                                        var exceptionRet = self[strProperty].render(contextRender, 
                                            false,
                                            new Area(new Point(areaRenderDisplay.location.x + dCursorX, 
                                                areaRenderDisplay.location.y), new Size(dWidth, 
                                                settings.dialog.lineHeight * 5)));
                                        if (exceptionRet) {

                                            return exceptionRet;
                                        }
                                        dCursorX += dWidth;
                                    } else {

                                        // Expression to render....
                                        contextRender.font = settings.codeStatement.font;
                                        var exceptionRet = self[strProperty].render(contextRender, 
                                            areaRenderDisplay, 
                                            dCursorX);
                                        if (exceptionRet) {

                                            return exceptionRet;
                                        }
                                        dCursorX += self[strProperty].getWidth(contextRender);
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

                            // Restore, blocks handle themselves.
                            contextRender.restore();

                            // Generate the path.
                            exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Stroke the path.
                            if (window.draggingObject) {

                                contextRender.strokeStyle = settings.general.strokeDrag;
                            } else if (self.highlight) {

                                contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                            } else {

                                contextRender.strokeStyle = settings.general.strokeBackground;
                            }
                            contextRender.stroke();

                            // Allocate a new area for the blocks.
                            var areaBlocks = new Area(
                                new Point(m_area.location.x + 20, 
                                    m_area.location.y + settings.general.margin + settings.codeStatement.lineHeight),
                                new Size(m_area.extent.width - 40, 
                                    m_area.extent.height - (settings.general.margin + settings.codeStatement.lineHeight))
                            );

                            // Also render the blocks.
                            var dYCursor = 0;
                            for (var i = 0; i < self.blocks.length; i++) {

                                var blockIth = self.blocks[i];

                                exceptionRet = blockIth.render(contextRender, 
                                    areaBlocks,
                                    dYCursor);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                                dYCursor += blockIth.getHeight() + settings.general.margin;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private methods.

                    var m_functionParse = function () {

                        try {

                            // Scan for blocks and expressionStubs.
                            var arrayKeys = Object.keys(self);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                // Extract the key.
                                var strKeyIth = arrayKeys[i];

                                // Don't permit collection, causes circular reference.
                                if (strKeyIth === "collection" ||
                                    strKeyIth === "dragCollection") {

                                    continue;
                                }

                                // Extract the object.
                                var objectIth = self[strKeyIth];

                                // Test object.
                                if (objectIth instanceof Block) {

                                    self.blocks.push(objectIth);
                                } else if (objectIth instanceof CodeExpressionStub) {

                                    objectIth.collection = self;
                                    self.expressionStubs.push(objectIth);
                                } else if (objectIth instanceof Edit) {

                                    objectIth.collection = self;
                                    self.others.push(objectIth);
                                }
                            }

                            // Now parsed, set object state.
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
