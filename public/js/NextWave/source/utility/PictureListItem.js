///////////////////////////////////////
// PictureListItem module.
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
			//
			// One of pxFixedWidth or pxFixedHeight will be 0 and the other will not be.
			// This will be used to determine which dimension of the image to fix and which to calculate
			// in order to maintain aspect ratio of the original image.
        	var functionRet = function PictureListItem(strName, id, index, url, pxFixedWidth, pxFixedHeight, tooltip) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Name of this type object.
                    self.name = strName || "default";
                    // Save the id (1-6) of this item.
                    self.id = id;
                    // Save the index (0-?) of this item.
                    self.index = index;
                    // Indicates the item is highlighted.
                    self.highlight = false;
                    // Indicates it is outlined.
                    self.outline = false;
                    // Also provide a selected coloring.
                    self.selected = false;
					// Save a possible tooltip.
					self.tooltip = tooltip || "";
                    // Get a reference to the settings for this object.
                    self.settingsNode = settings.list["picture"];
                    // Callback to handle click event.
                    // Callback must accept click-event-object
                    // reference and return an Exception.
                    self.clickHandler = null;
					// One of the next two will be zero. One will not.
					self.pxFixedWidth = pxFixedWidth;
					self.pxFixedHeight = pxFixedHeight;
					// Save url and initiate image retrieval.
					self.url = url;

					/////////////////////////
					// Image initialization.
                    var m_image = new Image();
                    var m_bLoaded = false;
                    m_image.onload = function() {
                        m_bLoaded = true;
                    }
                    m_image.src = self.url;

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

						if (self.pxFixedHeight) {
							return self.pxFixedHeight;
						}

						// Need to calculate height to preserve aspect ratio of original image.
						// Can do that only if m_bLoaded === true. Else, we have no idea, so we'll make it square
						// and hopefully be called again to make it right.
						if (!m_bLoaded) {
							return self.pxFixedHeight;
						}

						// The image exists in m_image. We know its true dimensions and we know the width we want.
						// So we'll calculate its height, given the other 3 numbers.
						return self.pxFixedWidth / m_image.width * m_image.height;
                    };

                    // Returns the width of this item.
                    self.getWidth = function (contextRender) {

						if (self.pxFixedWidth) {
							return self.pxFixedWidth;
						}

						// Need to calculate width to preserve aspect ratio of original image.
						// Can do that only if m_bLoaded === true. Else, we have no idea, so we'll make it square
						// and hopefully be called again to make it right.
						if (!m_bLoaded) {
							return self.pxFixedWidth;
						}

						// The image exists in m_image. We know its true dimensions and we know the height we want.
						// So we'll calculate its width, given the other 3 numbers.
						return self.pxFixedHeight / m_image.height * m_image.width;
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

                                // Pass the click event the id of the PLI clicked.
                                return self.clickHandler(self.id);
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

							// Mouse cursor is over this PLI.
							// Possibly draw a tooltip. (Will need to worry about erasing the tooltip if mouve out.)
							if (self.tooltip && m_area) {

								return manager.drawSmartTooltip(self.tooltip, m_area);
							}
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

                            if (!m_bLoaded || !m_image) {
                                return null;
                            }

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

                                // A special test just for the horizontal listHost's PictureListItem (which this is).
                                if (self.outline) {

                                    // First we'll draw the background (outline) rectangle at normal size.
                                    m_area = new Area(
                                        new Point(areaRender.location.x + settings.general.margin + dOffset,
                                            areaRender.location.y + settings.general.margin),
                                        new Size(self.getWidth(contextRender) - 2 * settings.general.margin,
                                            areaRender.extent.height - 2 * settings.general.margin)
                                    );
                                    contextRender.fillStyle = "rgba(255,0,0,1)";
                                    contextRender.fillRect(
                                        m_area.location.x,
                                        m_area.location.y,
                                        m_area.extent.width,
                                        m_area.extent.height);

                                    // Then we'll shrink down a bit so the image drawing below will appear indented.
                                    m_area = new Area(
                                        new Point(areaRender.location.x + settings.general.margin + dOffset + 5,
                                            areaRender.location.y + settings.general.margin + 5),
                                        new Size(self.getWidth(contextRender) - 2 * settings.general.margin - 10,
                                            areaRender.extent.height - 2 * settings.general.margin - 10)
                                    );
                                } else {

                                    m_area = new Area(
                                        new Point(areaRender.location.x + settings.general.margin + dOffset,
                                            areaRender.location.y + settings.general.margin),
                                        new Size(self.getWidth(contextRender) - 2 * settings.general.margin,
                                            areaRender.extent.height - 2 * settings.general.margin)
                                    );
                                }
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

                            // Render the image.
                            try {

                                contextRender.save();
                                contextRender.clip();
                                contextRender.drawImage(m_image,
                                    m_area.location.x,
                                    m_area.location.y,
                                    m_area.extent.width,
                                    m_area.extent.height);
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

                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
