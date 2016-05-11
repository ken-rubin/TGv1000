///////////////////////////////////////
// Panel module.
//
// Panels are special GUI components managed by the panel layer.
// The present menu/collection-like information to the user and
// pop out from an edge when the user touches or mouse-moves over.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/orientation",
    "NextWave/source/utility/glyphs",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area"],
    function (prototypes, settings, orientation, glyphs, Point, Size, Area) {

        try {

            // Constructor function.
        	var functionRet = function Panel(strTitle, orientationDock, pointLocationPercent, sizeExtentPercent) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Title of panel.
                    self.title = strTitle || "[title]";
                    // Docking of panel.
                    self.dock = orientationDock || orientation.north;
                    // Indicates the panel is open.
                    self.open = false;
                    // Indicates the panel is opening.
                    self.opening = false;
                    // Indicates the panel is closing.
                    self.closing = false;
                    // Indicates the panel is open and pinned thus.
                    self.pinned = false;
                    // Percentage for responsive design.
                    self.locationPercent = pointLocationPercent || new Point(0, 0);
                    // Percentage for responsive design.
                    self.extentPercent = sizeExtentPercent || new Size(0, 0);
                    // Location of panel.
                    self.location = new Point(0, 0);
                    // Size of panel when fully open.
                    self.openExtent = new Size(0, 0);
                    // Size of panel when closed.
                    self.closedExtent = new Size(0, 0);
                    // Size of panel when opening or closing.
                    self.currentExtent = new Size(0, 0);
                    // Contents of panel.
                    self.payload = null;
                    // Perform a calc layout on next render.
                    self.requiresCalculateLayout = false;

                    ////////////////////////
                    // Public methods.

                    // Initialze instance.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
                            }

                            // Now it is.
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Take mouse move--set handled in reference object if handled.
                    self.mouseMove = function (objectReference) {

                        try {

                            // Extract coordinates.
                            var dX = objectReference.pointCursor.x;
                            var dY = objectReference.pointCursor.y;

                            // Pass to payload if in its bounds.
                            if (self.payload &&
                                self.open &&
                                m_areaPayload.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor,
                                    true)) {

                                // Indicate that over payload = true, 
                                // subsequent mouse events can short-cut.
                                m_bInPayload = true;

                                // Have to tell the manager this panel handled the 
                                // call, because of the return statement just here.
                                objectReference.handled = true;

                                // Pass down to payload directly.
                                return self.payload.mouseMove(objectReference);
                            } else if (m_bInPayload) {

                                // May or may not be in this panel, in any case,
                                // certainly not over payload, just call mouse-out.
                                m_bInPayload = false;
                                var exceptionRet = self.payload.mouseOut(objectReference);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Test against bounds of panel.
                            if (dX > self.location.x &&
                                dX <= self.location.x + self.currentExtent.width &&
                                dY > self.location.y &&
                                dY <= self.location.y + self.currentExtent.height) {

                                // If in this bounds, then handled = true.
                                // This is important for the manager's state.
                                objectReference.handled = true;

                                // Since in panel, open if not already so.
                                if (!self.open &&
                                    !self.opening) {

                                    // Stop closing, if closing.
                                    if (self.closing) {

                                        self.closing = false;
                                    }

                                    // Start the opening.
                                    self.opening = true;
                                }

                                // Change cursor if over m_areaGlyph.
                                if (m_areaGlyph &&
                                    m_areaGlyph.pointInArea(objectReference.contextRender,
                                        objectReference.pointCursor,
                                        true)) {

                                    // Set the cursor.
                                    objectReference.cursor = "cell";
                                } else if (m_areaAddNew &&
                                    m_areaAddNew.pointInArea(objectReference.contextRender,
                                        objectReference.pointCursor,
                                        true)) {

                                    // Set the cursor.
                                    objectReference.cursor = "cell";
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse down.
                    self.mouseDown = function (objectReference) {

                        try {

                            // Pass to payload if in its bounds.
                            if (self.open &&
                                m_bInPayload) {

                                return self.payload.mouseDown(objectReference);
                            }

                            // If inside the pin-glyph bounds, toggle pinning.
                            // Test against approximate bounds.
                            if (m_areaGlyph &&
                                m_areaGlyph.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor,
                                    true)) {

                                // Toggle pinned-ed-ness.
                                self.pinned = !self.pinned;
                            } else if (m_areaAddNew &&
                                m_areaAddNew.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor,
                                    true) &&
                                $.isFunction(self.addNew)) {

                                // Invoke the callback.
                                var exceptionRet = self.addNew();
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            return null;
                         } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse up.
                    self.mouseUp = function (objectReference) {

                        try {

                            // Pass to payload if in its bounds.
                            if (self.open &&
                                m_bInPayload) {

                                return self.payload.mouseUp(objectReference);
                            }

                            return null;
                         } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse wheel.
                    self.mouseWheel = function (objectReference) {

                        try {

                            // Either just return or pass mouseWheel to payload.
                            if (!self.payload ||
                                !self.open) {

                                return null;
                            }

                            // Pass to payload if in its bounds.
                            if (m_bInPayload) {

                                return self.payload.mouseWheel(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse out.
                    self.mouseOut = function (objectReference) {

                        try {

                            // Pass mouseOut to payload.
                            if (self.payload) {

                                m_bInPayload = false;
                                var exceptionRet = self.payload.mouseOut(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // Do nothing if pinned.
                            if (self.pinned) {

                                return null;
                            }

                            // Stop opening, if opening, and close.
                            if (self.opening) {

                                self.opening = false;
                            }

                            // No longer really open.
                            if (self.open) {

                                self.open = false;
                            }

                            // Start closing.
                            if (!self.closing) {

                                self.closing = true;
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle click.
                    self.click = function (objectReference) {

                        try {

                            // Pass to payload if in its bounds.
                            if (self.open &&
                                m_bInPayload &&
                                self.payload &&
                                $.isFunction(self.payload.click)) {

                                return self.payload.click(objectReference);
                            }

                            return null;
                         } catch (e) {

                            return e;
                        }
                    };

                    // Set and position the panel.
                    self.setPayload = function (strTitle, objectPayload) {

                        try {

                            // Set title.
                            self.title = strTitle;

                            // Set and...
                            self.payload = objectPayload;

                            // ...forget it.
                            self.requiresCalculateLayout = true;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Position and size the instance.
                    self.calculateLayout = function (sizeExtent, contextRender) {

                        try {

                            // Save for opening/closing code.
                            self.totalExtent = sizeExtent;

                            // First, calculate location and openExtent from the percentages.
                            self.location = new Point(self.locationPercent.x * sizeExtent.width + settings.panel.gap, 
                                self.locationPercent.y * sizeExtent.height + settings.panel.gap);
                            self.openExtent = new Size(self.extentPercent.width * sizeExtent.width - 2 * settings.panel.gap, 
                                self.extentPercent.height * sizeExtent.height - 2 * settings.panel.gap);

                            // Set the closed and current extent 
                            // based on the extent and dock.
                            if (self.dock === orientation.north) {

                                self.location.y = 0;
                                self.closedExtent = new Size(self.openExtent.width,
                                    settings.panel.closedExtent);

                                // Also set the payload area.
                                if (self.open) {

                                    m_areaPayload = new Area(new Point(self.location.x,
                                            0),
                                        new Size(self.openExtent.width,
                                            self.openExtent.height - settings.panel.closedExtent));
                                } else {

                                    m_areaPayload = new Area(new Point(self.location.x,
                                            0),
                                        new Size(self.openExtent.width,
                                            0));
                                }
                            } else if (self.dock === orientation.south) {

                                if (self.open) {

                                    self.location.y = sizeExtent.height - self.openExtent.height;
                                } else {

                                    self.location.y = sizeExtent.height - settings.panel.closedExtent;
                                }
                                self.closedExtent = new Size(self.openExtent.width,
                                    settings.panel.closedExtent);

                                // Also set the payload area.
                                if (self.open) {

                                    m_areaPayload = new Area(new Point(self.location.x,
                                            sizeExtent.height - self.openExtent.height + settings.panel.closedExtent),
                                        new Size(self.openExtent.width,
                                            self.openExtent.height - settings.panel.closedExtent));
                                } else {

                                    m_areaPayload = new Area(new Point(self.location.x,
                                            sizeExtent.height),
                                        new Size(self.openExtent.width,
                                            0));
                                }
                            } else if (self.dock === orientation.west) {

                                self.location.x = 0;
                                self.closedExtent = new Size(settings.panel.closedExtent,
                                    self.openExtent.height);

                                // Also set the payload area.
                                if (self.open) {

                                    m_areaPayload = new Area(new Point(0,
                                            self.location.y),
                                        new Size(self.openExtent.width - settings.panel.closedExtent,
                                            self.openExtent.height));
                                } else {

                                    m_areaPayload = new Area(new Point(0,
                                            self.location.y),
                                        new Size(0,
                                            self.openExtent.height));
                                }
                            }

                            // If opening or closing, then size must have been set aleady,
                            // else, initialize or just set again, but non-destructively.
                            if (!self.opening && !self.closing) {

                                if (self.open) {

                                    self.currentExtent = self.openExtent.clone();
                                } else {

                                    self.currentExtent = self.closedExtent.clone();
                                }
                            }

                            // Either just return or calculate layout of payload.
                            if (!self.payload) {

                                return null;
                            }
                            return self.payload.calculateLayout(m_areaPayload, contextRender);
                        } catch (e) {

                            return e;
                        } finally {

                            // Always reset.
                            self.requiresCalculateLayout = false;
                        }
                    };

                    // Render out the panel.
                    self.render = function (contextRender) {
                        
                        try {

                            // Open if opening, close if closing.
                            if (self.opening) {

                                m_functionOpening(contextRender);
                            } else if (self.closing) {

                                m_functionClosing(contextRender);
                            } else if (self.requiresCalculateLayout) {

                                self.calculateLayout(self.totalExtent,
                                    contextRender);
                            }

                            var dCornerRadius = settings.panel.cornerRadius;

                            // Render flat against the docked edge.
                            contextRender.beginPath();
                            if (self.dock === orientation.north) {

                                contextRender.moveTo(self.location.x,
                                    self.location.y);
                                contextRender.lineTo(self.location.x,
                                    (self.location.y + self.currentExtent.height) - dCornerRadius);
                                contextRender.quadraticCurveTo(self.location.x,
                                    (self.location.y + self.currentExtent.height),
                                    (self.location.x + dCornerRadius),
                                    (self.location.y + self.currentExtent.height));
                                contextRender.lineTo(self.location.x + self.currentExtent.width - dCornerRadius,
                                    (self.location.y + self.currentExtent.height));
                                contextRender.quadraticCurveTo(self.location.x + self.currentExtent.width,
                                    (self.location.y + self.currentExtent.height),
                                    (self.location.x + self.currentExtent.width),
                                    (self.location.y + self.currentExtent.height - dCornerRadius));
                                contextRender.lineTo(self.location.x + self.currentExtent.width,
                                    (self.location.y));
                            } else if (self.dock === orientation.south) {

                                contextRender.moveTo(self.location.x,
                                    self.location.y + self.currentExtent.height);
                                contextRender.lineTo(self.location.x,
                                    self.location.y + dCornerRadius);
                                contextRender.quadraticCurveTo(self.location.x,
                                    self.location.y,
                                    self.location.x + dCornerRadius,
                                    self.location.y);
                                contextRender.lineTo(self.location.x + self.currentExtent.width - dCornerRadius,
                                    self.location.y);
                                contextRender.quadraticCurveTo(self.location.x + self.currentExtent.width,
                                    self.location.y,
                                    self.location.x + self.currentExtent.width,
                                    self.location.y + dCornerRadius);
                                contextRender.lineTo(self.location.x + self.currentExtent.width,
                                    self.location.y + self.currentExtent.height);
                            } else if (self.dock === orientation.west) {

                                contextRender.moveTo(self.location.x,
                                    self.location.y);
                                contextRender.lineTo(self.location.x + self.currentExtent.width - dCornerRadius,
                                    self.location.y);
                                contextRender.quadraticCurveTo(self.location.x + self.currentExtent.width,
                                    self.location.y,
                                    self.location.x + self.currentExtent.width,
                                    self.location.y + dCornerRadius);
                                contextRender.lineTo(self.location.x + self.currentExtent.width,
                                    self.location.y + self.currentExtent.height - dCornerRadius);
                                contextRender.quadraticCurveTo(self.location.x + self.currentExtent.width,
                                    self.location.y + self.currentExtent.height,
                                    self.location.x +  + self.currentExtent.width - dCornerRadius,
                                    self.location.y + self.currentExtent.height);
                                contextRender.lineTo(self.location.x,
                                    self.location.y + self.currentExtent.height);
                            }
                            contextRender.closePath();

                            contextRender.fillStyle = settings.panel.fillBackground;
                            contextRender.fill();
                            contextRender.strokeStyle = settings.general.strokeBackground;
                            contextRender.stroke();

                            // Render title, add-new (if specified) and pushpin.
                            contextRender.fillStyle = settings.panel.fillTitle;
                            contextRender.font = settings.panel.fontTitle;
                            if (self.dock === orientation.north) {

                                // Render title.
                                contextRender.fillText(self.title,
                                    self.location.x + settings.panel.north.offsetWidth,
                                    self.location.y + self.currentExtent.height - settings.panel.north.lineHeight + settings.panel.gap,
                                    self.location.x + self.currentExtent.width - settings.glyphs.width - self.location.x - settings.panel.north.offsetWidth - settings.panel.gap);

                                // Render the pin if open.
                                if (self.open) {

                                    var glyph = null;
                                    if (self.pinned) {

                                        glyph = glyphs.arrowNorth;
                                    } else {

                                        glyph = glyphs.pushpin;
                                    }

                                    // Calculate where the pin is, also used for hittesting.
                                    m_areaGlyph = new Area(
                                        new Point(self.location.x + self.currentExtent.width - settings.glyphs.width, 
                                            self.location.y + self.currentExtent.height - settings.panel.north.lineHeight),
                                        new Size(settings.panel.north.lineHeight, 
                                            settings.panel.north.lineHeight));

                                    // Render pushpin.
                                    var exceptionRet = glyphs.render(contextRender,
                                        m_areaGlyph,
                                        glyph, 
                                        settings.manager.showIconBackgrounds);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            } else if (self.dock === orientation.south) {

                                contextRender.fillText(self.title,
                                    self.location.x + settings.panel.north.offsetWidth,
                                    self.location.y + settings.panel.gap);

                                // Render the pin if open.
                                if (self.open) {

                                    var glyph = null;
                                    if (self.pinned) {

                                        glyph = glyphs.arrowSouth;
                                    } else {

                                        glyph = glyphs.pushpin;
                                    }

                                    // Calculate where the pin is, also used for hittesting.
                                    m_areaGlyph = new Area(
                                        new Point(self.location.x + self.currentExtent.width - settings.glyphs.width, 
                                            self.location.y),
                                        new Size(settings.panel.north.lineHeight, 
                                            settings.panel.north.lineHeight));

                                    // Render pushpin.
                                    var exceptionRet = glyphs.render(contextRender,
                                        m_areaGlyph,
                                        glyph, 
                                        settings.manager.showIconBackgrounds);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            } else if (self.dock === orientation.west) {

                                contextRender.save();
                                contextRender.rotate(Math.PI/2);
                                contextRender.fillText(self.title,
                                    self.location.y + settings.panel.west.offsetHeight,
                                    -self.location.x - self.currentExtent.width + settings.panel.gap);
                                contextRender.restore();

                                // Render the pin if open.
                                if (self.open) {

                                    // If the function is set, then render.
                                    if ($.isFunction(self.addNew)) {

                                        // Need to know how big the title is.
                                        var dTitleWidth = contextRender.measureText(self.title).width;

                                        // Calculate where the add new is, also used for hittesting.
                                        m_areaAddNew = new Area(
                                            new Point(self.location.x + self.currentExtent.width - settings.glyphs.width, 
                                                self.location.y + 4 * settings.panel.gap + dTitleWidth),
                                            new Size(settings.panel.north.lineHeight, 
                                                settings.panel.north.lineHeight));

                                        // Render pushpin.
                                        var exceptionRet = glyphs.render(contextRender,
                                            m_areaAddNew,
                                            glyphs.addNew, 
                                            settings.manager.showIconBackgrounds);
                                        if (exceptionRet) {

                                            throw exceptionRet;
                                        }
                                    }

                                    var glyph = null;
                                    if (self.pinned) {

                                        glyph = glyphs.arrowWest;
                                    } else {

                                        glyph = glyphs.pushpin;
                                    }

                                    m_areaGlyph = new Area(
                                        new Point(self.location.x + (self.currentExtent.width - self.closedExtent.width),
                                            self.location.y + self.currentExtent.height - settings.panel.north.lineHeight),
                                        new Size(settings.panel.north.lineHeight, 
                                            settings.panel.north.lineHeight));

                                    // Render pushpin.
                                    var exceptionRet = glyphs.render(contextRender,
                                        m_areaGlyph,
                                        glyph, 
                                        settings.manager.showIconBackgrounds);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }

                            // Either just return or render payload.
                            if (self.payload) {

                                try {

                                    // Fade in/out if opening or closing.
                                    if (self.opening || self.closing) {

                                        contextRender.globalAlpha = m_dPercentOpen * m_dPercentOpen;
                                    }
                                    return self.payload.render(contextRender);
                                } finally {

                                    // Always back to normal.
                                    if (self.opening || self.closing) {

                                        contextRender.globalAlpha = 1.0;
                                    }
                                }
                            }
                            return null;
                        } catch (e) {
                            
                            alert(e.message);
                        }
                    };

                    //////////////////////////
                    // Private methods.

                    // Called to open panel.
                    var m_functionOpening = function (contextRender) {

                        try {

                            if (self.dock === orientation.north) {

                                // If there's more work to do.
                                if (self.currentExtent.height < self.openExtent.height) {

                                    self.currentExtent.height += settings.panel.heightDelta;
                                    m_areaPayload.extent.height += settings.panel.heightDelta;

                                    // Calculate how much open the panel is.
                                    m_dPercentOpen = self.currentExtent.height / self.openExtent.height;
                                } else {

                                    self.currentExtent.height = self.openExtent.height;
                                    m_areaPayload.extent.height = self.openExtent.height - settings.panel.closedExtent;

                                    self.open = true;
                                    self.opening = false;
                                }
                            } else if (self.dock === orientation.south) {

                                // If there's more work to do.
                                if (self.currentExtent.height < self.openExtent.height) {

                                    self.currentExtent.height += settings.panel.heightDelta;
                                    self.location.y -= settings.panel.heightDelta;
                                    m_areaPayload.extent.height += settings.panel.heightDelta;
                                    m_areaPayload.location.y -= settings.panel.heightDelta;

                                    // Calculate how much open the panel is.
                                    m_dPercentOpen = self.currentExtent.height / self.openExtent.height;
                                } else {

                                    self.currentExtent.height = self.openExtent.height;
                                    m_areaPayload.extent.height = self.openExtent.height - settings.panel.closedExtent;
                                    self.location.y = self.totalExtent.height - self.openExtent.height;
                                    m_areaPayload.location.y = self.location.y + settings.panel.closedExtent;

                                    self.open = true;
                                    self.opening = false;
                                }
                            } else if (self.dock === orientation.west) {

                                // If there's more work to do.
                                if (self.currentExtent.width < self.openExtent.width) {

                                    self.currentExtent.width += settings.panel.heightDelta;
                                    m_areaPayload.extent.width += settings.panel.heightDelta;

                                    // Calculate how much open the panel is.
                                    m_dPercentOpen = self.currentExtent.width / self.openExtent.width;
                                } else {

                                    self.currentExtent.width = self.openExtent.width;
                                    m_areaPayload.extent.width = self.openExtent.width - settings.panel.closedExtent;

                                    self.open = true;
                                    self.opening = false;
                                }
                            }

                            // Either just return or calculate layout of payload.
                            if (!self.payload) {

                                return;
                            }
                            var exceptionRet = self.payload.calculateLayout(m_areaPayload, 
                                contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Called to close panel.
                    var m_functionClosing = function (contextRender) {

                        try {

                            if (self.dock === orientation.north) {

                                // If there's more work to do.
                                if (self.currentExtent.height > self.closedExtent.height) {

                                    self.currentExtent.height -= settings.panel.heightDelta;
                                    m_areaPayload.extent.height -= settings.panel.heightDelta;

                                    // Calculate how much open the panel is.
                                    m_dPercentOpen = self.currentExtent.height / self.openExtent.height;
                                } else {

                                    self.currentExtent.height = self.closedExtent.height;
                                    m_areaPayload.extent.height = 0;

                                    self.closed = true;
                                    self.closing = false;
                                }
                            } else if (self.dock === orientation.south) {

                                // If there's more work to do.
                                if (self.currentExtent.height > self.closedExtent.height) {

                                    self.currentExtent.height -= settings.panel.heightDelta;
                                    self.location.y += settings.panel.heightDelta;
                                    m_areaPayload.extent.height -= settings.panel.heightDelta;
                                    m_areaPayload.location.y += settings.panel.heightDelta;

                                    // Calculate how much open the panel is.
                                    m_dPercentOpen = self.currentExtent.height / self.openExtent.height;
                                } else {

                                    self.currentExtent.height = self.closedExtent.height;
                                    self.location.y = self.totalExtent.height - self.closedExtent.height;
                                    m_areaPayload.extent.height = 0;
                                    m_areaPayload.location.y = self.totalExtent.height;

                                    self.closed = true;
                                    self.closing = false;
                                }
                            } else if (self.dock === orientation.west) {

                                // If there's more work to do.
                                if (self.currentExtent.width > self.closedExtent.width) {

                                    self.currentExtent.width -= settings.panel.heightDelta;
                                    m_areaPayload.extent.width -= settings.panel.heightDelta;

                                    // Calculate how much open the panel is.
                                    m_dPercentOpen = self.currentExtent.width / self.openExtent.width;
                                } else {

                                    self.currentExtent.width = self.closedExtent.width;
                                    m_areaPayload.extent.width = 0;

                                    self.closed = true;
                                    self.closing = false;
                                }
                            }

                            // Either just return or calculate layout of payload.
                            if (!self.payload) {

                                return;
                            }
                            var exceptionRet = self.payload.calculateLayout(m_areaPayload,
                                contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    // Location of the pin glyph.
                    var m_areaGlyph = null;
                    // Location of the add-new, if specified.
                    var m_areaAddNew = null;
                    // Placement of the payload.
                    var m_areaPayload = null;
                    // Indicates the mouse is inside the payload.
                    var m_bInPayload = false;
                    // The percentage of open.
                    var m_dPercentOpen = 0;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
