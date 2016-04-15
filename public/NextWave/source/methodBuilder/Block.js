///////////////////////////////////////
// Block module.
//
// GUI component .
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
    "methodBuilder/StatementDragStub"],
    function (prototypes, settings, Point, Size, Area, glyphs, StatementDragStub) {

        try {

            // Constructor function.
        	var functionRet = function Block(strName) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Collection of statements.
                    self.statements = [];
                    // Indicates the block is open.
                    self.open = false;
                    // The name of this block.
                    self.name = strName || "default";

                    ////////////////////////
                    // Public methods.

                    // Get all the drag targets from all the statements.
                    self.accumulateDragTargets = function (arrayAccumulator) {

                        try {

                            // Loop over each statement.
                            for (var i = 0; i < self.statements.length; i++) {

                                var exceptionRet = self.statements[i].accumulateDragTargets(arrayAccumulator);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Add item to list of items.
                    self.addItem = function (itemNew, itemReplace) {

                        try {

                            // If replace item is specified, then replace the item there.
                            if (itemReplace) {

                                // Loop away!
                                for (var i = 0; i < self.statements.length; i++) {

                                    // Test.
                                    if (self.statements[i] === itemReplace) {

                                        // Replace.
                                        self.statements.splice(i, 1, itemNew);
                                        break;
                                    }
                                }
                            } else {

                                // Just stow.
                                self.statements.push(itemNew);
                            }

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

                            for (var i = 0; i < self.statements.length; i++) {

                                // Get the ith, to test.
                                var itemIth = self.statements[i];

                                // If find a match...
                                if (itemIth === itemRemove) {

                                    // ...remove it.
                                    self.statements.splice(i, 1);

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

                    // Add in statements around all elements in the 
                    // self.methodStatements list and all sub-blocks.
                    self.addStatementDragStubs = function (arrayAccumulator) {

                        try {

                            // Add as the first element.
                            var sdsNew = new StatementDragStub();
                            sdsNew.collection = self;
                            arrayAccumulator.push(sdsNew);
                            self.statements.splice(0, 0, sdsNew);

                            // Loop over each statement.
                            for (var i = 1; i < self.statements.length; i+=2) {

                                var exceptionRet = self.statements[i].addStatementDragStubs(arrayAccumulator);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }

                                // Also add after each statement.
                                sdsNew = new StatementDragStub();
                                sdsNew.collection = self;
                                arrayAccumulator.push(sdsNew);
                                self.statements.splice(i + 1, 0, sdsNew);
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
                            for (var i = 0; i < self.statements.length; i++) {

                                // Extract the ith element.
                                var itemIth = self.statements[i];

                                // If it is a SDS...
                                if (itemIth instanceof StatementDragStub) {

                                    // ...then remove it...
                                    self.statements.splice(i, 1);
                                    // ...and adjust i.
                                    i--;
                                } else {

                                    // Else, ask the statement to purge all SDSs too.
                                    var exceptionRet = itemIth.purgeStatementDragStubs();
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
                    self.getHeight = function (contextRender) {

                    	// The height is 3 margins + header + the height of all contained statements if open.
                        var dHeight = settings.block.lineHeight;

                        if (self.open) {

                            // Add in the statements.
                            var bOne = false;
                            for (var i = 0; i < self.statements.length; i++) {

                            	// Extract statement.
                            	var statementIth = self.statements[i];
                            	if (!statementIth) {

                            		continue;
                            	}

                                // Remember that there was at least one.
                                bOne = true;

                            	// Add this statement.
                            	dHeight += statementIth.getHeight(contextRender);
                            }

                            // If no statement, then make some room.
                            if (!bOne) {

                                dHeight += settings.block.emptyHeight;
                            }
                        }

                        return dHeight + 2 * settings.general.margin;
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

                            // If inside the pin-glyph bounds, toggle pinning.
                            // Test against approximate bounds.
                            if (m_areaGlyph &&
                                m_areaGlyph.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor,
                                    true)) {

                                // Toggle pinned-ed-ness.
                                self.open = !self.open;
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

                            // Test if over any statements.
                            for (var i = 0; i < self.statements.length; i++) {

                            	// Get the ith Statement.
                            	var statementIth = self.statements[i];
                            	if (!statementIth) {

                            		continue;
                            	}

                                // If the point is in the statement, then highlight it.
                                var bRet = statementIth.pointIn(objectReference.contextRender, 
                                    objectReference.pointCursor);
                                if (bRet) {

                                    m_objectHighlight = statementIth;
                                    m_objectHighlight.highlight = true;
                                    break;
                                }
                            }

                            // If over a statement, pass mouse move to it.
                            if (m_objectHighlight) {

                                exceptionRet = m_objectHighlight.mouseMove(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // Change cursor if over m_areaGlyph.
                            if (m_areaGlyph &&
                                m_areaGlyph.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor,
                                    true)) {

                                // Set the cursor.
                                objectReference.cursor = "cell";
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
                                new Point(areaRender.location.x, 
                                    areaRender.location.y + dY),
                                new Size(areaRender.extent.width, 
                                    self.getHeight() - 2 * settings.general.margin)
                            );

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Fill and stroke the path.
                            if (window.draggingStatement || window.draggingExpression) {

                                contextRender.fillStyle = settings.general.fillDrag;
                                contextRender.strokeStyle = settings.general.strokeDrag;
                            } else if (self.highlight) {

                                contextRender.fillStyle = settings.block.fillBackgroundHighlight;
                                contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                            } else {

                                contextRender.fillStyle = settings.block.fillBackground;
                                contextRender.strokeStyle = settings.general.strokeBackground;
                            }
                            contextRender.fill();
                            contextRender.stroke();

                            // Render the header.
                            contextRender.font = settings.block.font;
                            contextRender.fillStyle = settings.general.fillText;
                            contextRender.fillText(self.name + (self.open ? "" : "..."),
                                m_area.location.x + settings.general.textOffset,
                                m_area.location.y + settings.general.margin,
                                m_area.extent.width - 2 * settings.general.textOffset - settings.block.glyphExtent - settings.general.margin);

                            // Now the glyph.
                            m_areaGlyph = new Area(
                                new Point(
                                    m_area.location.x + m_area.extent.width - settings.block.glyphExtent - settings.general.margin,
                                    m_area.location.y + settings.general.margin
                                ),
                                new Size(
                                    settings.block.glyphExtent,
                                    settings.block.glyphExtent
                                )
                            );

                            // Render open-state glyph.
                            exceptionRet = glyphs.render(contextRender,
                                m_areaGlyph,
                                (self.open ? glyphs.contract : glyphs.expand), 
                                settings.manager.showIconBackgrounds);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Render the sub-statements, if open.
                            if (self.open) {

                                var dYCursor = settings.block.lineHeight;
    	                        for (var i = 0; i < self.statements.length; i++) {

    	                        	// Extract statement.
    	                        	var statementIth = self.statements[i];
    	                        	if (!statementIth) {

    	                        		continue;
    	                        	}

    	                        	// Let it render.
    	                        	exceptionRet = statementIth.render(contextRender, 
    	                        		m_area, 
    	                        		dYCursor);
    	                            if (exceptionRet) {

    	                                throw exceptionRet;
    	                            }

    	                        	// Add this statement.
    	                        	dYCursor += statementIth.getHeight(contextRender);
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
                    // Place of the glyph.
                    var m_areaGlyph = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });