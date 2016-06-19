///////////////////////////////////////
// TypeSection module.
//
// Base class for all sections of a Type: 
//      methods, properties, and events.... 
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
    "NextWave/source/type/SectionPart"],
    function (prototypes, settings, Point, Size, Area, glyphs, SectionPart) {

        try {

            // Constructor function.
        	var functionRet = function TypeSection(typeOwner, strName, strSettingsNode, arrayParts) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // The type that owns this Section.
                    self.owningType = typeOwner || null;
                    // Name of this type object.
                    self.name = strName || "Default";
                    // Collection of contained method objects.
                    self.parts = arrayParts || [];
                    // Indicates the type is open.
                    self.open = false;
                    // Indicates the TypeSection is highlighted.
                    self.highlight = false;
                    // Get a reference to the settings for this object.
                    self.settingsNode = settings.tree[strSettingsNode || "TypeSection"];
                    // The area, relative to the canvas, occupied by this instance.
                    self.area = null;
                    // Remember which object has the highlight.
                    self.highlightChild = null;

                    ////////////////////////
                    // Public Methods.

                    // Add a part to ths TypeSection.
                    self.addPart = function (partNew) {

                        try {

                            self.parts.push(partNew);
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove a part from ths TypeSection.
                    self.removePart = function (partToRemove) {

                        try {

                            for (var i = 0; i < self.parts.length; i++) {

                                if (self.parts[i].name === partToRemove.name) {

                                    self.parts.splice(i, 1);
                                    break;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Returns the height of this type.
                    self.getHeight = function () {

                        var dHeight = self.settingsNode.lineHeight + 2 * settings.general.margin;
                        if (self.open) {

                            // Add in child height and borders....
                            dHeight += self.innerGetHeight();
                        }

                        return dHeight;
                    };

                    // Virtual method, defaults to method, override if not desired.
                    self.createMethod = function () {

                        return "createMethod";
                    };

                    // Virtual method overridden for meta.
                    self.innerGetHeight = function () {

                        // If parts, then they are all the same height.
                        if (self.parts.length > 0) {

                            return (self.parts[0].getHeight() * self.parts.length);
                        } else {

                            return 0;
                        }
                    };

                    // Invoked when the mouse is pressed down over the type.
                    self.mouseDown = function (objectReference) {

                        try {

                            // Can't do much if no area.
                            if (!self.area) {

                                return null;
                            }

                            // If over the title.
                            if (self.overName(objectReference.pointCursor)) {

                                // Toggle openness.
                                var bIn = m_areaGlyph.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor);

                                if (bIn) {

                                    // Toggle openness.
                                    if (self.open) {

                                        self.open = false;
                                    } else {

                                        self.open = true;
                                    }
                                } else if (m_areaAddNew.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor)) {

                                    // Add new, empty Method or property to the owning Type.
                                    return window.manager[self.createMethod()](self.owningType);
                                }
                            } else if (self.highlightChild) {

                                // Store the cursor item as the drag object.
                                var exceptionRet = window.manager.setDragObject(self.highlightChild);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }

                                // Pass down to highlight object.
                                return self.highlightChild.mouseDown(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved over the type.
                    self.mouseMove = function (objectReference) {

                        try {

                            // Can't do much if no area.
                            if (!self.area) {

                                return null;
                            }

                            // Reset highlight.
                            var exceptionRet = self.mouseOut(objectReference);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // If over the title.
                            if (self.overName(objectReference.pointCursor)) {

                                // Toggle openness.
                                var bIn = m_areaGlyph.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor);

                                if (bIn) {

                                    objectReference.cursor = "cell";
                                } else if (m_areaAddNew.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor)) {

                                    objectReference.cursor = "cell";
                                }
                            } else {

                                // Call virtual.
                                exceptionRet = self.innerMouseMove(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked to handle mouse move if not over name.
                    self.innerMouseMove = function (objectReference) {

                        try {

                            // Figure out which.
                            self.highlightChild = self.over(objectReference.pointCursor);
                            if (self.highlightChild) {

                                self.highlightChild.highlight = true;

                                if ($.isFunction(self.highlightChild.mouseMove)) {

                                    return self.highlightChild.mouseMove(objectReference);
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
                            if (self.highlightChild) {

                                self.highlightChild.highlight = false;
                                self.highlightChild = null;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is clicked over the Type.
                    self.click = function (objectReference) {

                        try {

                            // Reset highlight.
                            if (self.highlightChild &&
                                $.isFunction(self.highlightChild.click)) {

                                // Pass down.
                                return self.highlightChild.click(objectReference);
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
                    self.render = function (contextRender, areaRender, dYOffset) {

                        try {

                            // Define the containing area.
                            self.area = new Area(
                                new Point(areaRender.location.x + settings.general.margin, 
                                    areaRender.location.y + settings.general.margin + dYOffset),
                                new Size(areaRender.extent.width - 2 * settings.general.margin, 
                                    self.getHeight() - 2 * settings.general.margin)
                            );

                            // Generate the path.
                            var exceptionRet = self.area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Fill and stroke the path.
                            if (window.draggingObject) {

                                contextRender.fillStyle = settings.general.fillDrag;
                                contextRender.strokeStyle = settings.general.strokeDrag;
                            } else if (self.highlight) {

                                contextRender.fillStyle = settings.general.fillBackgroundHighlight;
                                contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                            } else {

                                contextRender.fillStyle = self.settingsNode.fillBackground;
                                contextRender.strokeStyle = settings.general.strokeBackground;
                            }
                            contextRender.fill();
                            contextRender.stroke();

                            // Render the name.
                            contextRender.font = self.settingsNode.font;
                            if (self.highlight) {

                                contextRender.fillStyle = settings.general.fillText;
                            } else {

                                contextRender.fillStyle = settings.general.fillText;
                            }
                            contextRender.fillText(self.name,
                                self.area.location.x + settings.general.margin,
                                self.area.location.y,
                                self.area.extent.width - settings.general.margin - 2 * settings.glyphs.width);

                            // If open, render TypeSection.
                            var glyph = glyphs.expand;
                            if (self.open) {

                                exceptionRet = self.innerRender(contextRender, areaRender, dYOffset);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                glyph = glyphs.contract;
                            }

                            // Draw the open/close glyphs.
                            m_areaGlyph = new Area(
                                new Point(self.area.location.x + self.area.extent.width - settings.glyphs.width + settings.general.margin,
                                    self.area.location.y),
                                new Size(settings.glyphs.width - settings.general.margin, 
                                    settings.glyphs.height - settings.general.margin));

                            // Render glyph.
                            var exceptionRet = glyphs.render(contextRender,
                                m_areaGlyph,
                                glyph, 
                                settings.manager.showIconBackgrounds);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Draw the add new glyph.
                            m_areaAddNew = new Area(
                                new Point(self.area.location.x + self.area.extent.width - 2 * settings.glyphs.width + settings.general.margin,
                                    self.area.location.y),
                                new Size(settings.glyphs.width - settings.general.margin, 
                                    settings.glyphs.height - settings.general.margin));

                            // Render glyph.
                            exceptionRet = glyphs.render(contextRender,
                                m_areaAddNew,
                                glyphs.addNew, 
                                settings.manager.showIconBackgrounds);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Virtual method to render the open part of the TypeSection.
                    self.innerRender = function (contextRender, areaRender, dYOffset) {

                        try {

                            // Render TypeSection.
                            var dYOffsetOffset = self.settingsNode.lineHeight;
                            for (var i = 0; i < self.parts.length; i++) {

                                var sectionPartIth = self.parts[i];

                                // Render out the section part.
                                var exceptionRet = sectionPartIth.render(contextRender,
                                    self.area,
                                    dYOffsetOffset);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // Adjust for the next typesection.
                                dYOffsetOffset += sectionPartIth.getHeight();
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method returns bool if eponymous.
                    self.overName = function (pointCursor) {

                        // No area = no parts.
                        if (!self.area) {

                            return false;
                        }

                        // Figure out where, over the type, the cursor is.
                        var dHeightRelativeToTopOfType = pointCursor.y - self.area.location.y;

                        // If over the title.
                        return (dHeightRelativeToTopOfType < self.settingsNode.lineHeight);
                    };

                    // Helper method returns method or property under cursor.
                    self.over = function (pointCursor) {

                        // No area = no parts.
                        if (!self.area) {

                            return null;
                        }

                        // Figure out where, over the parent, the cursor is.
                        var dHeightRelative = pointCursor.y - (self.area.location.y + self.settingsNode.lineHeight);

                        // No part if no parts.
                        if (self.parts.length === 0) {

                            return null;
                        }

                        // Calcuate index into collection based on first element.
                        var iIndex = Math.floor(dHeightRelative / self.parts[0].getHeight());
                        return self.parts[iIndex];
                    };

                    //////////////////////////
                    // Private fields.

                    // Area of glyph.
                    var m_areaGlyph = null;
                    // Area of add new icon.
                    var m_areaAddNew = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
