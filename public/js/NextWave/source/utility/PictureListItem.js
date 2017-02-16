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

							let exceptionRet = manager.stopDrawingSmartTooltip();
							if (exceptionRet) {

								throw exceptionRet;
							}

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

                    // Outline self. This is actually deprecated, but outlining is still present in the soon-to-allso-be-deprecated
					// NewProjectDialog.js, so it remains until then. NewProjectDialog used ListHost which creates a List, not PictureListHost
					// which creates a PictureList, but it still fills the List with PictureListItems. That's why we still have to handle outlining.
					// For a little while.
                    self.setOutline = function(b) {

                        self.outline = b;
                    }

                    // Possibly cause a tooltip to be rendered.
                    self.mouseMove = function (objectReference) {

                        try {

							// Mouse cursor is over this PLI.
                            m_bMouseIn = true;

							// Possibly draw a tooltip, depending upon whether there's text set up or not.
							if (self.tooltip && m_area) {

								return manager.drawSmartTooltip(self.tooltip, m_area);
							}
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

					// Cause last (possible) tooltip to disappear.
					self.mouseOut = function(objectReference) {

						try {

                            m_bMouseIn = false;

							if (!self.tooltip) {

								// There couldn't have been a tooltip rendered.
								return null;
							}

							// Cursor has moved out of this PLI.
							// If there had been a tooltip being rendered, kill it.
							// This will be as easy as setting the tooltip control's configuration.text = "".
							return manager.stopDrawingSmartTooltip();
						} catch(e) {

							return e;
						}
					}

                    // Handle mouse down.
                    self.mouseDown = function(objectReference) {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out this type.
                    self.render = function (contextRender, areaRender, dOffset) {

                        try {

                            if (!m_bLoaded || !m_image) {
                                return null;
                            }

                            // Define the containing area.
							// A temporary test (see setting of self.outline above) just for the horizontal listHost's PictureListItem.
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

								let expandedHeight = self.collection.areaMaximal.extent.height;
								let height = expandedHeight * settings.layerLandingPage.dVerticalPct;
								let width = height / m_image.height * m_image.width;
								let expandedWidth = expandedHeight / m_image.height * m_image.width;

								if (!m_bMouseIn) {

									// Since this is the non-mouse in case, pull the picture in and position it centrally.
									m_area = new Area(
										new Point(areaRender.location.x + dOffset + ((expandedWidth - width) * settings.layerLandingPage.dVerticalPct),
												self.collection.areaMaximal.location.y + (expandedHeight - height) * settings.layerLandingPage.dVerticalPct),
										new Size(width, height)
									);
								} else {

									// Will render expanded to height of list container and with width scaled.
									m_area = new Area(
										new Point(areaRender.location.x + dOffset,
												self.collection.areaMaximal.location.y),
										new Size(expandedWidth, expandedHeight)
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
                    // Keep track of mouse in PLI.
                    let m_bMouseIn = false;

                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
