///////////////////////////
// List module.
//
// Base class for lists.
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
    "NextWave/source/manager/ListItem"],
    function (prototypes, settings, Point, Size, Area, ListItem) {

        try {

            // Constructor function.
        	var functionRet = function List(bVertical) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Collection of held items.
                    self.items = [];
                    // Indicates how things are measured and how they scroll.
                    self.vertical = bVertical;
                    // Access this property based on orientation.
                    self.propertyAccessor = (self.vertical ? "height" : "width");
                    // Access this method based on orientation.
                    self.methodAccessor = (self.vertical ? "getHeight" : "getWidth");
                    // Access scroll cursor based on orientation.
                    self.scrollCursor = [(self.vertical ? "n-resize" : "w-resize"),
                        (self.vertical ? "s-resize" : "e-resize")];
                    // Indicates that the corresponding scroll stud is visible--set in render.
                    self.scrollStubVisible = [false, false];
                    // Indicates that the corresponding scroll stud is visible--set in render.
                    self.scrollStubArea = [null, null];

                    ///////////////////////
                    // Public methods.

                    // Add item to list of items.
                    self.addItem = function (itemNew) {

                        try {

                            // Stow.
                            self.items.push(itemNew);

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
                            if (iIndex >= self.items.length) {

                                return self.addItem(itemNew);
                            }

                            // ...or insert.
                            self.items.splice(iIndex,
                                0,
                                itemNew);

                            // Identify parent.
                            itemNew.collection = self;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove iteem from list of items.
                    self.removeItem = function (itemRemove) {

                        try {

                            for (var i = 0; i < self.items.length; i++) {

                                // Get the ith, to test.
                                var itemIth = self.items[i];

                                // If find a match...
                                if (itemIth === itemRemove) {

                                    // ...remove it.
                                    self.items.splice(i, 1);

                                    // And done.
                                    break;
                                }
                            }

                            // Unidentify parent.
                            itemRemove.collection = null;
                            itemRemove.highlight = false;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear out every item from the collection.
                    self.clearItems = function () {


                        try {

                            self.items = [];
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Attach instance to DOM and initialize state.
                    self.create = function (arrayItems) {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
                            }

                            // Call down inheritance chain.
                            var exceptionRet = self.innerCreate(arrayItems || []);
                            if (exceptionRet) {

                            	throw exceptionRet;
                            }

                            // Because it is!
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Default behavior in base class, override to build custom collection.
                    self.innerCreate = function (arrayItems) {

                        try {

                            // Add the Expressions.
                            for (var i = 0; i < arrayItems.length; i++) {

                                var exceptionRet = self.addItem(arrayItems[i]);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove all items.
                    self.clear = function () {

                        try {

                            // Clean on items.
                            self.items = [];

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Decompose instance.
                    self.destroy = function () {

                        try {

                            // Can only destroy a created instance.
                            if (!m_bCreated) {

                                throw { message: "Instance not created!" };
                            }

                            // Clear items.
                            var exceptionRet = self.create();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method calculates usable total extent of list.
                    self.getTotalExtent = function (contextRender) {

                        // Sum each Expression.
                        var dExtent = 0;
                        for (var i = 0; i < self.items.length; i++) {

                            // Get the ith Expression.
                            var itemIth = self.items[i];

                            // Ask the Expression how tall or wide it is.
                            dExtent += itemIth[self.methodAccessor](contextRender);
                        }
                        return dExtent;
                    };

                    // Test if the point is in this List.
                    self.pointIn = function (contextRender, point) {

                        // Return false if never rendered.
                        if (!m_areaMaximal) {

                            return false;
                        }

                        // Return simple hit-test against area.
                        return m_areaMaximal.pointInArea(contextRender,
                            point,
                            true);
                    }

                    // Invoked when the mouse is pressed down over the canvas.
                    self.mouseDown = function (objectReference) {

                        try {

                            // Call helper method to test the cursor point.
                            var exceptionRet = m_functionTestPoint(objectReference);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Pass mouse down to type, if cursor over type.
                            if (m_itemCursor) {

                                // Store the cursor item as the drag object.
                                exceptionRet = window.manager.setDragObject(m_itemCursor);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }

                                // Pass it down.
                                if ($.isFunction(m_itemCursor.mouseDown)) {

                                    exceptionRet = m_itemCursor.mouseDown(objectReference);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }

                                // Adjust scroll offset, if necessary.
                                exceptionRet = self.possiblyAdjustScrollOffset();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Force a render.
                            self.render(objectReference.contextRender);

                            // Call helper method (again) to test the cursor  
                            // point this clears out and updates any selection.
                            return m_functionTestPoint(objectReference);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is let up over the canvas.
                    self.mouseUp = function (objectReference) {

                        try {

                            // Call helper method to test the cursor point.
                            var exceptionRet = m_functionTestPoint(objectReference);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Pass mouse up to type, if cursor over type.
                            if (m_itemCursor) {

                                // Pass it down.
                                if ($.isFunction(m_itemCursor.mouseUp)) {

                                    var exceptionRet = m_itemCursor.mouseUp(objectReference);
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

                    // Invoked when the mouse is clicked over the canvas.
                    self.click = function (objectReference) {

                        try {

                            // Call helper method to test the cursor point.
                            var exceptionRet = m_functionTestPoint(objectReference);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Pass mouse up to type, if cursor over type.
                            if (m_itemCursor) {

                                // Pass it down.
                                if ($.isFunction(m_itemCursor.click)) {

                                    var exceptionRet = m_itemCursor.click(objectReference);
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

                    // Invoked when the mouse is moved over the list.
                    self.mouseMove = function (objectReference) {

                        try {

                            // Test for scrolling.
                            if (self.scrollStubVisible[0] &&
                                self.scrollStubArea[0].pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor)) {

                                // Start scrolling, if not already.
                                if (!m_functionScroll) {

                                    // Remove any selection.
                                    self.mouseOut(objectReference);

                                    // Set the scroll function to "up".
                                    m_functionScroll = function () {

                                        // Special case, scroll down.
                                        if (m_dScrollOffset > 0) {

                                            m_dScrollOffset -= settings.general.scrollStub.amount;
                                        }
                                        // Pin to bounds.
                                        if (m_dScrollOffset < 0) {

                                            m_dScrollOffset = 0;
                                        }
                                    };
                                }

                                // Set the cursor.
                                objectReference.cursor = self.scrollCursor[0];

                                // Possibly mouseout selection....
                                return null;
                            } else if (self.scrollStubVisible[1] &&
                                self.scrollStubArea[1].pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor)) {

                                // Start scrolling, if not already.
                                if (!m_functionScroll) {

                                    // Remove any selection.
                                    self.mouseOut(objectReference);

                                    // Calculate the total height.
                                    var dTotalExtent = self.getTotalExtent(objectReference.contextRender);

                                    // Set the scroll function to "down".
                                    m_functionScroll = function () {

                                        // Special case, scroll up.
                                        if (m_dScrollOffset < (dTotalExtent - m_areaMaximal.extent[self.propertyAccessor])) {

                                            m_dScrollOffset += settings.general.scrollStub.amount;
                                        }
                                        // Pin to bounds.
                                        if (m_dScrollOffset > (dTotalExtent - m_areaMaximal.extent[self.propertyAccessor])) {

                                            m_dScrollOffset = (dTotalExtent - m_areaMaximal.extent[self.propertyAccessor]);
                                        }
                                    };
                                }

                                // Set the cursor.
                                objectReference.cursor = self.scrollCursor[1];

                                // Possibly mouseout selection....
                                return null;
                            } else {

                                // Stop all scrolling.
                                m_functionScroll = null;
                            }

                            // Call helper method to test the cursor point.
                            return m_functionTestPoint(objectReference);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse wheel is scrolled over the canvas.
                    self.mouseWheel = function (objectReference) {

                        try {

                            // Calculate the total height.
                            var dTotalExtent = self.getTotalExtent(objectReference.contextRender);

                            // Do nothing if nothing to scroll.
                            if (dTotalExtent < m_areaMaximal.extent[self.propertyAccessor]) {

                                return null;
                            }

                            // Get the direction of scrolling based on wheel change.
                            // For now, I don't think you can scroll to ther side...test....
                            var strDeltaAccessor = (self.vertical ? "deltaY" : "deltaY");

                            // Calculate distance.
                            var dAmount = -objectReference.event[strDeltaAccessor] * objectReference.event.deltaFactor;

                            // Scroll up if negative, else, down.
                            if (dAmount < 0) {

                                // Move it.
                                if (m_dScrollOffset > 0) {

                                    m_dScrollOffset += dAmount;
                                }
                                // Pin to bounds.
                                if (m_dScrollOffset < 0) {

                                    m_dScrollOffset = 0;
                                }
                            } else {

                                // Move it.
                                if (m_dScrollOffset < (dTotalExtent - m_areaMaximal.extent[self.propertyAccessor])) {

                                    m_dScrollOffset += dAmount;
                                }
                                // Pin to bounds.
                                if (m_dScrollOffset > (dTotalExtent - m_areaMaximal.extent[self.propertyAccessor])) {

                                    m_dScrollOffset = (dTotalExtent - m_areaMaximal.extent[self.propertyAccessor]);
                                }
                            }

                            // Remove item selection.
                            return self.mouseMove(objectReference);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved away from the canvas.
                    self.mouseOut = function (objectReference) {

                        try {

                            // Stop scrolling, if scrolling.
                            if (m_functionScroll) {

                                m_functionScroll = null;
                            }

                            // Reset the item under the cursor.
                            if (m_itemCursor) {

                                // Don't check return...just mouse out.
                                if ($.isFunction(m_itemCursor.mouseOut)) {
    
                                    m_itemCursor.mouseOut(objectReference);
                                }
                                m_itemCursor.highlight = false;
                                m_itemCursor = null;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Adjust the scroll offset if sizes have changed on next render.
                    self.possiblyAdjustScrollOffset = function () {

                        try {

                            m_bPossiblyAdjustScrollOffsets = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Expose private field.
                    self.scrollOffset = function () {

                        return m_dScrollOffset;
                    };

                    // Expose private field.
                    self.areaMaximal = function () {

                        return m_areaMaximal;
                    };

                    // Calculate the section rectangles.
                    self.calculateLayout = function (areaMaximal, contextRender) {

                        try {

                            // Make a slightly smaller copy of the maximal area--with borders.
                            areaMaximal = new Area(new Point(areaMaximal.location.x + settings.general.margin,
                                    areaMaximal.location.y + settings.general.margin),
                                new Size(Math.max(0, areaMaximal.extent.width - 2 * settings.general.margin),
                                    Math.max(0, areaMaximal.extent.height - 2 * settings.general.margin)));

                            // Calculate the maximal area.
                            m_areaMaximal = areaMaximal;

                            if (self.vertical) {

                                self.scrollStubArea[0] = new Area(new Point(areaMaximal.location.x + (areaMaximal.extent.width - settings.general.scrollStub.width) / 2, 
                                        areaMaximal.location.y + settings.general.scrollStub.yOffset), 
                                    new Size(settings.general.scrollStub.width, settings.general.scrollStub.height));

                                self.scrollStubArea[1] = new Area(new Point(areaMaximal.location.x + (areaMaximal.extent.width - settings.general.scrollStub.width) / 2, 
                                        areaMaximal.location.y + areaMaximal.extent.height + settings.general.scrollStub.yOffset), 
                                    new Size(settings.general.scrollStub.width, settings.general.scrollStub.height));
                            } else {

                                self.scrollStubArea[0] = new Area(new Point(m_areaMaximal.location.x - settings.general.scrollStub.height / 2, 
                                        m_areaMaximal.location.y - settings.general.scrollStub.yOffset / 5), 
                                    new Size(settings.general.scrollStub.height /* this one is on its side */, 
                                        m_areaMaximal.extent.height + 2 * settings.general.scrollStub.yOffset / 5));

                                self.scrollStubArea[1] = new Area(new Point(m_areaMaximal.location.x + m_areaMaximal.extent.width - settings.general.scrollStub.height / 2, 
                                        m_areaMaximal.location.y - settings.general.scrollStub.yOffset / 5), 
                                    new Size(settings.general.scrollStub.height /* this one is on its side */, 
                                        m_areaMaximal.extent.height + 2 * settings.general.scrollStub.yOffset / 5));
                            }

                            // Adjust scroll offset, if necessary.
                            return self.possiblyAdjustScrollOffset();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the objects.
                    self.render = function (contextRender) {
                        
                        try {

                            // If scrolling, then scroll first.
                            if (m_functionScroll) {

                                // Just call it.
                                m_functionScroll();
                            }

                            // If previously instructed, possibly adjust scroll offsets here.
                            if (m_bPossiblyAdjustScrollOffsets) {

                                // Calculate the total extent.
                                var dTotalExtent = self.getTotalExtent(contextRender);

                                // Adjust down the scroll, if necessary.
                                if (m_dScrollOffset > (dTotalExtent - m_areaMaximal.extent[self.propertyAccessor])) {

                                    m_dScrollOffset = Math.max(0, 
                                        dTotalExtent - m_areaMaximal.extent[self.propertyAccessor]);
                                }
                            }

                            // Draw the rounded body background.
                            var exceptionRet = m_areaMaximal.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Draw focus recangle if highlighted.
                            if (self.highlight) {

                                contextRender.fillStyle = settings.general.fillBackgroundHighlight;
                                contextRender.fill();
                                contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                                contextRender.stroke();
                            } else {

                                contextRender.fillStyle = settings.general.fillBackground;
                                contextRender.fill();
                            }

                            // Save canvas state.
                            contextRender.save();

                            // Set clip to background shape
                            contextRender.clip();

                            // Render each item.
                            var dCursor = -m_dScrollOffset;
                            for (var i = 0; i < self.items.length; i++) {

                                // Get the ith item.
                                var itemIth = self.items[i];

                                // Ask the parent how tall it is.
                                var dExtent = itemIth[self.methodAccessor](contextRender);

                                // Don't start rendering until at least
                                // partially visible and stop rendering
                                // as soon as no longer visible at all.
                                if (dCursor + dExtent < 0) {

                                    // Move down/over--before continuing....
                                    dCursor += dExtent;

                                    // Reset area if not visible.
                                    exceptionRet = itemIth.clearArea();
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    continue;
                                } else if (dCursor > m_areaMaximal.extent[self.propertyAccessor]) {

                                    // Move down/over--before continuing....
                                    // This one just short-cuts to calculating the total height.
                                    dCursor += dExtent;

                                    // Reset area if not visible.
                                    exceptionRet = itemIth.clearArea();
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    continue;
                                }

                                // Render out the item.
                                exceptionRet = itemIth.render(contextRender,
                                    m_areaMaximal,
                                    dCursor);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // Move down.
                                dCursor += dExtent;
                            }

                            self.scrollStubVisible[0] = false;
                            self.scrollStubVisible[1] = false;
                            // Only show scroll stubs if can scroll.
                            if (dCursor + m_dScrollOffset > m_areaMaximal.extent[self.propertyAccessor]) {

                                // Render the scroll up region.
                                if (Math.floor(m_areaMaximal.extent[self.propertyAccessor]) < Math.floor(dCursor)) {

                                    exceptionRet = self.scrollStubArea[1].generateRoundedRectPath(contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                    contextRender.fillStyle = settings.general.scrollStub.fillBackground;
                                    contextRender.fill();
                                    contextRender.strokeStyle = settings.general.strokeBackground;
                                    contextRender.stroke();

                                    self.scrollStubVisible[1] = true;
                                }

                                // Render the scroll down region.
                                if (m_dScrollOffset > 0) {

                                    exceptionRet = self.scrollStubArea[0].generateRoundedRectPath(contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                    contextRender.fillStyle = settings.general.scrollStub.fillBackground;
                                    contextRender.fill();
                                    contextRender.strokeStyle = settings.general.strokeBackground;
                                    contextRender.stroke();

                                    self.scrollStubVisible[0] = true;
                                }
                            }

                            // Restore original canvas state.
                            contextRender.restore();
                            
                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    ///////////////////////
                    // Private methods.

                    // Helper method tests cursor point, 
                    // sets cursor item and mouse cursor.
                    var m_functionTestPoint = function (objectReference) {

                        try {

                            // Do nothing if no cursor.
                            if (!objectReference.pointCursor) {

                                return null;
                            }

                            // Remember the current Expression cursor.
                            var itemOriginal = m_itemCursor;

                            // See if the cursor point is in any item.
                            if (m_itemCursor) {

                                m_itemCursor.highlight = false;
                                m_itemCursor = null;
                            }

                            // Loop over all items.
                            for (var i = 0; i < self.items.length; i++) {

                                // Get the ith Expression.
                                var itemIth = self.items[i];

                                // Ask the Expression if it contains the point.
                                var bContainsPoint = itemIth.pointIn(objectReference.contextRender,
                                    objectReference.pointCursor);
                                if (bContainsPoint) {

                                    m_itemCursor = itemIth;
                                    m_itemCursor.highlight = true;

                                    // Call mouse move on the new type.
                                    if ($.isFunction(m_itemCursor.mouseMove)) {

                                        var exceptionRet = m_itemCursor.mouseMove(objectReference);
                                        if (exceptionRet) {

                                            throw exceptionRet;
                                        }
                                    }

                                    break;
                                }
                            }

                            // Deactivate the selection in the 
                            // current type, if it changed.
                            if (itemOriginal &&
                                m_itemCursor !== itemOriginal) {

                                if ($.isFunction(itemOriginal.mouseOut)) {

                                    var exceptionRet = itemOriginal.mouseOut(objectReference);
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

                    ///////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    // The whole area.
                    var m_areaMaximal = null;
                    // How far the tree is scrolled.
                    var m_dScrollOffset = 0;
                    // Type under cursor.
                    var m_itemCursor = null;
                    // Scroll callback--set for up or down when cursor over stub.
                    var m_functionScroll = null;
                    // Update the scroll offset if necessary.
                    var m_bPossiblyAdjustScrollOffsets = false;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });

