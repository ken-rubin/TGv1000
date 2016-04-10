///////////////////////////////////////
// CodeStatement base module.
//
// Base class for all code statements.
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
    "methodBuilder/Block",
    "methodBuilder/CodeExpressionStub"],
    function (prototypes, settings, Point, Size, Area, glyphs, Block, CodeExpressionStub) {

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
                    // Boolean indicates statement properties have been parsed.
                    self.parsed = false;

                    ////////////////////////
                    // Public methods.

                    // Get all the drag targets from all the statements.
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

                    // Add in statements around all elements in the 
                    // self.methodStatements list and all sub-blocks.
                    self.addStatementDragStubs = function (arrayAccumulator) {

                        try {

                            // Loop over each block.
                            for (var i = 0; i < self.blocks.length; i++) {

                                var exceptionRet = self.blocks[i].addStatementDragStubs(arrayAccumulator);
                                if (exceptionRet) {

                                    return exceptionRet;
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

                    // Method closes up all the blocks.
                    self.closeBlocks = function () {

                        try {

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

                    // Returns the height of this type.
                    self.getHeight = function () {

                        // No better place to do this....
                        if (!self.parsed) {

                            // Scan for blocks and expressionStubs.
                            var arrayKeys = Object.keys(self);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                // Extract the key.
                                var strKeyIth = arrayKeys[i];

                                // Don't permit collection, causes circular reference.
                                if (strKeyIth === "collection") {

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
                                }
                            }

                            self.parsed = true;
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
                            if ((window.draggingStatement || window.draggingExpression) &&
                                (self.collection)) {

                                contextRender.fillStyle = settings.general.fillDrag;
                            } else if (self.highlight) {

                                contextRender.fillStyle = settings.general.fillBackgroundHighlight;
                            } else {

                                contextRender.fillStyle = self.settingsNode.fillBackground;
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

                                    // Expression to render....
                                    contextRender.font = settings.codeStatement.font;
                                    var exceptionRet = self[strProperty].render(contextRender, 
                                        areaRenderDisplay, 
                                        dCursorX);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                    dCursorX += self[strProperty].getWidth(contextRender);
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
                            if (window.draggingStatement || window.draggingExpression) {

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
