﻿///////////////////////////////////////
// Type module.
//
// A data entity composed of methods, properties, and events.
// Here, contained as a main element of the TypeTree GUI element.
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
    "type/TypeSection"],
    function (prototypes, settings, Point, Size, Area, glyphs, TypeSections) {

        try {

            // Constructor function.
        	var functionRet = function Type(strName, arrayTypeSections) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Name of this type object.
                    self.name = strName || "default";
                    // Collection of contained method objects.
                    self.typeSections = arrayTypeSections || [];
                    // Indicates the type is open.
                    self.open = false;
                    // Indicates the type is highlighted.
                    self.highlight = false;
                    // Get the node containing settings for this type.
                    self.settingsNode = settings.tree.type;

                    ////////////////////////
                    // Public methods.

                    // Returns the height of this type.
                    self.getHeight = function () {

                        var dHeight = self.settingsNode.lineHeight + 2 * settings.general.margin;
                        if (self.open && self.typeSections.length > 0) {

                            // Add in child height and borders....
                            for (var i = 0; i < self.typeSections.length; i++) {

                                dHeight += self.typeSections[i].getHeight();
                            }
                            dHeight += settings.general.margin * (self.typeSections.length - 1);
                        }

                        return dHeight;
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

                    // Invoked when the mouse is pressed down over the type.
                    self.mouseDown = function (objectReference) {

                        try {

                            // Can't do much if no area.
                            if (!m_area) {

                                return null;
                            }

                            // If over the title.
                            if (m_functionOverName(objectReference.pointCursor) &&
                                m_areaGlyph) {

                                // Toggle openness.
                                var bIn = m_areaGlyph.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor);

                                if (bIn) {

                                    if (self.open) {

                                        self.open = false;
                                    } else {

                                        self.open = true;
                                    }
                                }
                            } else if (m_objectHighlight) {

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

                            // Can't do much if no area.
                            if (!m_area) {

                                return null;
                            }

// Sears claim: 4143633, 800-927-7836 option 5.

                            // Reset highlight.
                            var exceptionRet = self.mouseOut(objectReference);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // If over the title.
                            if (m_functionOverName(objectReference.pointCursor)) {

                                // Toggle openness.
                                var bIn = m_areaGlyph.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor);

                                if (bIn) {

                                    objectReference.cursor = "cell";
                                }
                            } else {

                                // Figure out which.
                                for (var i = 0; i < self.typeSections.length; i++) {

                                    var typeSectionIth = self.typeSections[i];

                                    // Test mouse.
                                    if (typeSectionIth.pointIn(objectReference.contextRender, 
                                            objectReference.pointCursor)) {

                                        // Highlight.
                                        m_objectHighlight = typeSectionIth;
                                        typeSectionIth.highlight = true;

                                        // Pass down to methods.
                                        exceptionRet = typeSectionIth.mouseMove(objectReference);
                                        if (exceptionRet) {

                                            throw exceptionRet;
                                        }

                                        // There can be only one!
                                        break;
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

                            // Fill and stroke the path.
                            if (window.draggingStatement || window.draggingExpression) {

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
                            contextRender.fillStyle = settings.general.fillText;
                            contextRender.fillText(self.name,
                                m_area.location.x + settings.general.margin,
                                m_area.location.y,
                                m_area.extent.width - settings.general.margin - settings.glyphs.width);

                            // If open, render methods and properties.
                            var glyph = glyphs.expand;
                            if (self.open) {

                                // Figure out which.
                                var dYOffset = self.settingsNode.lineHeight;
                                for (var i = 0; i < self.typeSections.length; i++) {

                                    var typeSectionIth = self.typeSections[i];

                                    // Render type section.
                                    exceptionRet = typeSectionIth.render(contextRender, 
                                        m_area,
                                        dYOffset);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Adjust for the next typesection.
                                    dYOffset += typeSectionIth.getHeight() + settings.general.margin;
                                }
                                glyph = glyphs.contract;
                            }

                            // Draw the open/close glyphs.
                            m_areaGlyph = new Area(
                                new Point(m_area.location.x + m_area.extent.width - settings.glyphs.width,
                                    m_area.location.y + settings.general.margin),
                                new Size(settings.glyphs.width, 
                                    settings.glyphs.height));

                            // Render glyph.
                            var exceptionRet = glyphs.render(contextRender,
                                m_areaGlyph,
                                glyph, 
                                settings.manager.showIconBackgrounds);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private methods.

                    // Helper method returns bool if eponymous.
                    var m_functionOverName = function (pointCursor) {

                        // Figure out where, over the type, the cursor is.
                        var dHeightRelativeToTopOfType = pointCursor.y - m_area.location.y;

                        // If over the title.
                        return (dHeightRelativeToTopOfType < self.settingsNode.lineHeight);
                    };

                    //////////////////////////
                    // Private fields.

                    // The area, relative to the canvas, occupied by this instance.
                    var m_area = null;
                    // The area of the open/close glyph.
                    var m_areaGlyph = null;
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