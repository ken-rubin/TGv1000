///////////////////////////////////////
// Block module.
//
// GUI component .
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
    "NextWave/source/methodBuilder/StatementDragStub"],
    function (prototypes, settings, Point, Size, Area, glyphs, StatementDragStub) {

        try {

            // Constructor function.
        	var functionRet = function Block(strName, arrayStatements) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Collection of statements.
                    self.statements = arrayStatements || [];
                    // Indicates the block is open.
                    self.open = true;
                    // The name of this block.
                    self.name = strName || "default";

                    // If there are statements, then need to parent them.
                    if (self.statements.length) {

                        // Loop over each statement.
                        for (var i = 0; i < self.statements.length; i++) {

                            self.statements[i].collection = self;
                        }
                    }

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

                    // Get all nameTypes from all the statements
                    self.accumulateNameTypes = function (arrayNameTypes) {

                        try {

                            // Loop over each statement.
                            for (var i = 0; i < self.statements.length; i++) {

                                var exceptionRet = self.statements[i].accumulateNameTypes(arrayNameTypes);
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

                    // Add item to list of items.
                    self.insertAt = function (itemNew, iIndex) {

                        try {

                            // Add...
                            if (iIndex >= self.statements.length) {

                                return self.addItem(itemNew);
                            }

                            // ...or insert.
                            self.statements.splice(iIndex,
                                0,
                                itemNew);

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
                    self.accumulateDragStubInsertionPoints = function (arrayAccumulator, statementDragStub, areaMethodBuilder) {

                        try {

                            // Drop out if no area.
                            if (!m_area) {

                                return null;
                            }

                            // First, check the "before all statements" location.
                            if (m_area.location.y > areaMethodBuilder.location.y &&
                                m_area.location.y < areaMethodBuilder.location.y + areaMethodBuilder.extent.height) {

                                // If the top is visible, then add  
                                // the first spot as a potential.
                                arrayAccumulator.push({

                                    index: 0,
                                    y: m_area.location.y,
                                    collection: self,
                                    type: (self.statements.length > 0 ? self.statements[0].dragStub : false)
                                });
                            }

                            // Loop over each statement.
                            for (var i = 0; i < self.statements.length; i++) {

                                // Extract the ith statement.
                                var statementIth = self.statements[i];
                                if (!statementIth ||
                                    !statementIth.area) {

                                    continue;
                                }

                                // Check in each statement for block....
                                var exceptionRet = statementIth.accumulateDragStubInsertionPoints(arrayAccumulator,
                                    statementDragStub, 
                                    areaMethodBuilder);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }

                                // Also check after each statement.

                                // If the bottom + the full drag statement is fully visible.
                                var areaStatement = statementIth.area();
                                if (areaStatement) {

                                    if (areaStatement.location.y + areaStatement.extent.height < areaMethodBuilder.location.y + areaMethodBuilder.extent.height) {

                                        arrayAccumulator.push({

                                            index: i,
                                            y: areaStatement.location.y + areaStatement.extent.height,
                                            collection: self,
                                            type: (statementIth.dragStub ||
                                                ((self.statements.length > i + 1) ? self.statements[i + 1].dragStub : false))
                                        });
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
                            for (var i = 0; i < self.statements.length; i++) {

                                // Extract the ith element.
                                var itemIth = self.statements[i];

                                // If it is a SDS...
                                if (itemIth.dragStub) {

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

                    // Return a new instance of a while statement.
                    self.clone = function () {

                        // Clone the parameter too.
                        var blockClone = new self.constructor(strName);

                        // And add in clones of all statements.
                        for (var i = 0; i < self.statements.length; i++) {

                            blockClone.statements.push(self.statements[i].clone());
                        }
                        return blockClone;
                    };

                    // Generate JavaScript for this expression.
                    self.generateJavaScript = function () {

                        var strBlock = " { ";

                        for (var i = 0; i < self.statements.length; i++) {

                            strBlock += self.statements[i].generateJavaScript();
                        }

                        strBlock += " } ";
                        return strBlock;
                    };

                    // Save block.
                    self.save = function () {

                        // Pre-allocate array of statement parameters for this block.
                        var arrayParameters = [];

                        // Add them all.
                        for (var i = 0; i < self.statements.length; i++) {

                            arrayParameters.push(self.statements[i].save());
                        }

                        // Return array of the name and the Array of parameters.
                        return {

                                type: "Block",
                                parameters: [{ 

                                        type: "String", 
                                        value: self.name
                                    }, {

                                        type: "Array",
                                        parameters: arrayParameters
                                    }
                                ]
                            };
                    };

                    // Returns the height of this block as closed.
                    self.getClosedHeight = function () {

                        // The height is 2 margins + header.
                        var dHeight = settings.block.lineHeight + 2 * settings.general.margin;
                        return dHeight;
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
                            if (window.draggingObject) {

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
