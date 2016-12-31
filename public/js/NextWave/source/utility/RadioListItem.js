///////////////////////////////////////
// RadioListItem module.
//
// Class for all picture list items.
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
    "Core/resourceHelper"],
    function (prototypes, settings, Point, Size, Area, glyphs, resourceHelper) {

        try {

            // Constructor function.
        	var functionRet = function RadioListItem(projMode, index) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Words for this object.
                    self.name = projMode;
                    // Save the index (0-?) of this item.
                    self.index = index;
                    // Indicates the item is highlighted.
                    self.highlight = false;
                    // Indicates it is outlined.
                    self.outline = false;
                    // Also provide a selected coloring.
                    self.selected = false;
                    // Get a reference to the settings for this object.
                    self.settingsNode = settings.list["radio"];
                    // Callback to handle click event.
                    // Callback must accept click-event-object 
                    // reference and return an Exception.
                    self.clickHandler = null;

                    ////////////////////////
                    // Initialization.

                    ////////////////////////
                    // Public methods.

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

                        if (m_area) {

                            return m_area.clone();
                        } else {

                            return new Area();
                        }
                    };

                    // Returns the height of this item.
                    self.getHeight = function () {

                        var dHeight = self.settingsNode.lineHeight + 2 * settings.general.margin;
                        return dHeight;
                    };

                    // Returns the width of this item.
                    self.getWidth = function (contextRender) {

                        contextRender.font = self.settingsNode.font;
                        var dWidth = contextRender.measureText(self.name).width + 
                            4 * settings.general.margin;

                        return dWidth;
                    };

                    // Test if the point is in this item.
                    self.pointIn = function (contextRender, point) {

                        // Return false if never rendered.
                        if (!m_area) {

                            return false;
                        }

                        // Return hit-test against generated path.
                        return m_area.pointInArea(contextRender,
                            point);
                    };

                    // Overridable method to get at name.
                    // This is the default.
                    self.getName = function () {

                        return self.name;
                    };

                    // Invoked when the mouse is clicked over the canvas.
                    self.click = function (objectReference) {

                        try {

                            // If click is defined, call it.
                            if ($.isFunction(self.clickHandler)) {

                                // Pass the click event the id of the RLI clicked.
                                return self.clickHandler(self.index);
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Outline self.
                    self.setOutline = function(b) {

                        self.outline = b;
                    }

                    // Change cursor if over delete handler.
                    self.mouseMove = function (objectReference) {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse down.
                    self.mouseDown = function(objectReference) {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out this type.
                    self.render = function (contextRender, areaRender, dOffset, bVertical) {

                        try {

                            // Default vertical to true.
                            if (bVertical === undefined) {

                                bVertical = true;
                            }

                            // Define the containing area.
                            if (bVertical) {

                                m_area = new Area(
                                    new Point(areaRender.location.x + settings.general.margin, 
                                        areaRender.location.y + settings.general.margin + dOffset),
                                    new Size(areaRender.extent.width - 2 * settings.general.margin, 
                                        self.getHeight() - 2 * settings.general.margin)
                                );
                            } else {

                                m_area = new Area(
                                    new Point(areaRender.location.x + settings.general.margin + dOffset, 
                                        areaRender.location.y + settings.general.margin),
                                    new Size(self.getWidth(contextRender) - 2 * settings.general.margin, 
                                        areaRender.extent.height - 2 * settings.general.margin)
                                );
                            }

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Fill and stroke the path.
                            if ((window.draggingObject) &&
                                self.collection) {

                                contextRender.fillStyle = settings.general.fillDrag;
                                contextRender.strokeStyle = settings.general.strokeDrag;
                            } else if (self.selected) {

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

                            // Render the radio button.
                            try {

                                contextRender.font = self.settingsNode.font;
                                contextRender.fillStyle = settings.general.fillText;
                                contextRender.fillText(self.getName(),
                                    m_area.location.x + settings.general.margin,
                                    m_area.location.y + settings.general.margin,
                                    m_area.extent.width - 2 * settings.general.margin);
                            } finally {

                                contextRender.restore();
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
                    // Remember where the delete icon is--if delete handler is handled.
                    var m_areaDeleteIcon = null;

                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
