///////////////////////////////////////
// Button module.
//
// A GUI button Control element.
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
        "NextWave/source/utility/Area",
        "NextWave/source/utility/Control"],
    function(prototypes, settings, glyphs, Point, Size, Area, Control) {

        try {

            // Constructor function.
			// objectParameters may contain 0, 1 or 3 strings: override font, protected tooltip, !protected tooltip.
            var functionRet = function Button(...objectParameters) {

                try {

                    var self = this; // Uber closure.

                    // Inherit from Control.  Call parent Control
                    // constructor.  Pass parameters, if specified.
                    self.inherits(Control);

					// If nothing in objectParameters, push on the default font.
					if (!objectParameters.length) {
						objectParameters.push(settings.general.font);
					}

					// In case there are no elements for protectedTooltip and unProtectedTooltip, push on a couple of nulls.
					// If all 3 elements are present, this will have no effect. Otherwise, it will set the tooltips to null.
					objectParameters.push(null);
					objectParameters.push(null);

					self.font = objectParameters[0];
					self.protectedTooltip = objectParameters[1];
					self.unProtectedTooltip = objectParameters[2];

                    ////////////////////////
                    // Public methods.

                    // Give derived modules a crack at the create pipeline.
                    self.innerCreate = function () {

                        try {

                            // Save off sections.
                            //self.sections = ;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Give this object a crack at the layout pipeline.
                    self.innerCalculateLayout = function (areaMaximal, contextRender) {

                        try {

                            m_area = areaMaximal;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render object.
                    self.render = function (contextRender) {

                        try {

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            try {

                                contextRender.save();
                                contextRender.clip();

                                // Fill and stroke the path. If self.protected, no mouse-influenced background.
                                if (self.protected) {

                                    contextRender.fillStyle = settings.button.background;

                                } else {

                                    contextRender.fillStyle = (m_bMouseIn ?
                                                                (m_bMouseDown ?
                                                                    settings.button.backgroundMouseDown :
                                                                    settings.button.backgroundMouseIn) :
                                                                	settings.button.background);
                                }
                                contextRender.strokeStyle = settings.general.strokeBackground;
                                contextRender.fill();
                                contextRender.stroke();

                                // Content of Button is either a glyph or a text string. Thus, the following if:
								if (self.configuration.text instanceof Area) {
									// We have a glyph to render.

									let gly = self.configuration.text;

									if (self.protected) {
		                                // Again, if self.protected, no special offset.

										glyphs.render(contextRender,
											self.position,
											gly,
											settings.manager.showIconBackgrounds,
											true);
									} else {

										glyphs.render(contextRender,
											new Area(new Point(self.position.location.x + (m_bMouseDown ? 3 : 0),
																self.position.location.y + (m_bMouseDown ? 3 : 0)),
													self.position.extent
											),
											gly,
											settings.manager.showIconBackgrounds);
									}
								} else {
									// We have a text string to render.

									contextRender.font = "bold " + self.font;
									contextRender.fillStyle = "rgba(0,0,0,0.7)";
									contextRender.textBaseline = "middle";
									contextRender.textAlign = "center";

									if (self.protected) {
		                                // Again, if self.protected, no special offset.

										contextRender.globalAlpha = 0.35;
										contextRender.fillText(self.configuration.text,
											m_area.location.x + m_area.extent.width / 2,
											m_area.location.y + m_area.extent.height / 2);
										contextRender.globalAlpha = 1.0;

									} else {

										contextRender.fillText(self.configuration.text,
											m_area.location.x + m_area.extent.width / 2 + (m_bMouseDown ? 3 : 0),
											m_area.location.y + m_area.extent.height / 2 + (m_bMouseDown ? 3 : 0));
									}
								}
                        } finally {

                                contextRender.restore();
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
                    self.mouseMove = function (objectReference) {

                        try {

                            m_bMouseIn = true;

							// Mouse is over this button.
							// Possibly draw one of 2 tooltips.
							if (self.visible) {

								if (self.protected && self.protectedTooltip) {

									return manager.drawSmartTooltip(self.protectedTooltip, m_area);
								} else if (!self.protected && self.unProtectedTooltip) {

									return manager.drawSmartTooltip(self.unProtectedTooltip, m_area);
								}
							}

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
                    self.mouseDown = function (objectReference) {

                        try {

                            m_bMouseDown = true;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
                    self.mouseUp = function (objectReference) {

                        try {

                            m_bMouseDown = false;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
					// Also, cause last (possible) tooltip to disappear.
                    self.mouseOut = function (objectReference) {

                        try {

                            m_bMouseIn = false;
                            m_bMouseDown = false;

							if (self.visible && (self.protectedTooltip || self.unProtectedTooltip)) {

								return manager.stopDrawingSmartTooltip();
							}

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
                    self.click = function (objectReference) {

                        try {

                            if (self.protected || !self.visible) {

                                return null;
                            }

                            // Raise event handler, if specified.
                            if (self.configuration.click) {

                                self.configuration.click(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // Placement of this instance.
                    var m_area = null;
                    // Keep track of mouse in button.
                    let m_bMouseIn = false;
                    // Keep track of mouse down.
                    let m_bMouseDown = false;
                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
