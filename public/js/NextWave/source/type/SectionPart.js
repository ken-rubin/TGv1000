///////////////////////////////////////
// SectionPart module.
//
// Base class for all parts of a Type: 
//      a method, aproperty, or an event.... 
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/glyphs",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area"],
    function (prototypes, settings, glyphs, Point, Size, Area) {

        try {

            // Constructor function.
        	var functionRet = function SectionPart(strName, strSettingsNode) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Name of this method object.
                    self.name = strName || "default";
                    // Indicates the method is highlighted.
                    self.highlight = false;
                    // Get a reference to the settings for this object.
                    self.settingsNode = settings.tree[strSettingsNode || "TypeSection"];

                    ////////////////////////
                    // Public methods.

                    // Return the area for dragging rendering.
                    self.getDragArea = function () {

                        return m_area.clone();
                    };

                    // Returns the height of this sectionpart.
                    self.getHeight = function () {

                        var dHeight = self.settingsNode.lineHeight + 2 * settings.general.margin;
                        return dHeight;
                    };

                    // Virtual method to determine selection.
                    self.getSelected = function () {

                        return false;
                    };

                    // Virtual name of the method to remove this section.  Overtride if not satisfied with method.
                    self.removeMethod = function () {

                        return "removeMethod";
                    }

                    // Invoked when the mouse is pressed down over the type.
                    self.mouseDown = function (objectReference) {

                        try {

                            // Can't do much if no area.
                            if (!m_area ||
                                !m_areaRemove) {

                                return null;
                            }

                            // Remove if clicked.
                            if (m_areaRemove.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor)) {

                                return window.manager[self.removeMethod()](self.owner, self);
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
                            if (!m_area ||
                                !m_areaRemove) {

                                return null;
                            }

                            // Remove if clicked.
                            if (m_areaRemove.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor)) {

                                objectReference.cursor = "cell";
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out this part.
                    self.render = function (contextRender, areaRender, dYOffset) {

                        try {

                            // Height needed in a few places, save off here.
                            var dHeight = self.getHeight();

                            // Define the containing area.
                            m_area = new Area(
                                new Point(areaRender.location.x + settings.general.margin, 
                                    areaRender.location.y + settings.general.margin + dYOffset),
                                new Size(areaRender.extent.width - 2 * settings.general.margin, 
                                    dHeight - 2 * settings.general.margin)
                            );

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Call virtual to determine if this is a selected element.
                            var bSelected = self.getSelected();

                            // Fill and stroke the path.
                            if (window.draggingObject) {

                                contextRender.fillStyle = settings.general.fillDrag;
                                contextRender.strokeStyle = settings.general.strokeDrag;
                            } else if (bSelected) {

                                contextRender.fillStyle = settings.general.fillBackgroundSelected;
                                contextRender.strokeStyle = settings.general.strokeBackgroundSelected;
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
                                m_area.location.y + settings.general.margin,
                                m_area.extent.width - dHeight);

                            // Render the delete icon.
                            m_areaRemove = new Area(
                                new Point(m_area.location.x + m_area.extent.width - (dHeight - settings.general.margin),
                                    m_area.location.y),
                                new Size(dHeight - 2 * settings.general.margin, 
                                    dHeight - 2 * settings.general.margin));

                            // Render glyph.
                            exceptionRet = glyphs.render(contextRender,
                                m_areaRemove,
                                glyphs.remove, 
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
                    // Private fields.

                    // The area, relative to the canvas, occupied by this instance.
                    var m_area = null;
                    // The delete icon location.
                    var m_areaRemove = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
