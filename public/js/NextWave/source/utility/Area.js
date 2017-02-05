///////////////////////////////////////
// Area module.
//
// Represents a 2-dimensional area of a plane.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size"],
    function (prototypes, settings, Point, Size) {

        try {

            // Constructor function.
        	var functionRet = function Area(pointLocation, sizeExtent) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Location of this self.
                    self.location = pointLocation || new Point();
                    // Extent of this self.
                    self.extent = sizeExtent || new Size();

                    ///////////////////////
                    // Public methods.

                    // Make a copy.
                    self.clone = function () {

                        return new Area(self.location.clone(),
                            self.extent.clone());
                    };

                    // Generate path for the pinched rounded rect.
                    self.generateRectPath = function (contextRender) {

                        try {

                            // Simple square rect....
                            contextRender.beginPath();
                            contextRender.moveTo(self.location.x,
                                    self.location.y);
                            contextRender.lineTo(self.location.x + self.extent.width,
                                    self.location.y);
                            contextRender.lineTo(self.location.x + self.extent.width,
                                    self.location.y + self.extent.height);
                            contextRender.lineTo(self.location.x,
                                    self.location.y + self.extent.height);
                            contextRender.closePath();
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Generate path for the pinched rounded rect.
                    self.generateRoundedRectPath = function (contextRender) {

                        try {

                            // Calculate a good, relative corner radius.
                            var dCornerRadius = settings.area.cornerRadius;

                            // Ensure their are no calculated negative sizes.
                            if (dCornerRadius > self.extent.height) {

                                dCornerRadius = self.extent.height;
                            } else if (dCornerRadius > self.extent.width) {

                                dCornerRadius = self.extent.width;
                            }

                            // Generate the rounded path.
                            contextRender.beginPath();
                            contextRender.moveTo(self.location.x,
                                    self.location.y + dCornerRadius);
                            contextRender.lineTo(self.location.x,
                                    (self.location.y + self.extent.height) - dCornerRadius);
                            contextRender.quadraticCurveTo(self.location.x,
                                    (self.location.y + self.extent.height),
                                    (self.location.x + dCornerRadius),
                                    (self.location.y + self.extent.height));

                            contextRender.lineTo((self.location.x + self.extent.width) - dCornerRadius,
                                    (self.location.y + self.extent.height));

                            contextRender.quadraticCurveTo((self.location.x + self.extent.width),
                                    (self.location.y + self.extent.height),
                                    (self.location.x + self.extent.width),
                                    (self.location.y + self.extent.height) - dCornerRadius);

                            contextRender.lineTo((self.location.x + self.extent.width),
                                    (self.location.y + dCornerRadius));

                            contextRender.quadraticCurveTo((self.location.x + self.extent.width),
                                    self.location.y,
                                    (self.location.x + self.extent.width) - dCornerRadius,
                                    self.location.y);

                            contextRender.lineTo((self.location.x + dCornerRadius),
                                    (self.location.y));

                            contextRender.quadraticCurveTo(self.location.x,
                                    self.location.y,
                                    self.location.x,
                                    self.location.y + dCornerRadius);

                            contextRender.closePath();

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

					// innerCalculateLayout of the tooltip has figured out the configuration of the tooltip for which we're
					// about to generateRoundedTooltipPath. Save it for use below.
					// The config actually indicates the position of the tooltip's little arrow.
					// The tooltip's innerCalculateLayout has already adjusted self.pointLocation and self.sizeExtent.
					// The arrow's location is one of these 4 settings:
					//		"bl"	bottom + left
					//		"br"	bottom + right
					//		"tl"	top + left
					//		"tr"	top + right
					self.setTooltipArrowLoc = function (tooltipArrowLoc) {

						m_tooltipArrowLoc = tooltipArrowLoc;
					}

                    // Generate path for the pinched rounded rect.
					// The "normal" tooltip will be above its target and will extend from approx. its left edge toward the right.
					// However, that could cause us to go over the top edge or the right edge of the canvas (actually, LayerTooltip).
					// In the top edge case, move the tooltip down, below the target.
					// In the right edge case, move the tooltip so that its left side lines up with the target.
					// Unless that would push it off the top, in which case keep hor. alignment but move below the target.
                    self.generateRoundedTooltipPath = function (contextRender) {

                        try {

                            // Calculate a good, relative corner radius.
                            var dCornerRadius = settings.area.cornerRadius;

                            // Ensure their are no calculated negative sizes.
                            if (dCornerRadius > self.extent.height) {

                                dCornerRadius = self.extent.height;
                            } else if (dCornerRadius > self.extent.width) {

                                dCornerRadius = self.extent.width;
                            }

                            // Generate the rounded path.
                            contextRender.beginPath();

							switch(m_tooltipArrowLoc) {

								case "br":	// Arror is on right end of bottom line of rect.

									// Down the left side.
									contextRender.moveTo(self.location.x,
											self.location.y + dCornerRadius);
									contextRender.lineTo(self.location.x,
											(self.location.y + self.extent.height) - dCornerRadius);

									// SW corner.
									contextRender.quadraticCurveTo(self.location.x,
											(self.location.y + self.extent.height),
											(self.location.x + dCornerRadius),
											(self.location.y + self.extent.height));

									// Along the bottom until the drop-triangle.
									contextRender.lineTo((self.location.x + self.extent.width - dCornerRadius - 20),
											(self.location.y + self.extent.height));

									// Now the drop-triangle bottom point.
									contextRender.lineTo((self.location.x + self.extent.width - dCornerRadius - 10),
											(self.location.y + self.extent.height + 15));

									// Back to the bottom of the rect.
									contextRender.lineTo((self.location.x + self.extent.width - dCornerRadius - 10),
											(self.location.y + self.extent.height));

									// Rest of the bottom. And then proceed as normal to finish the rect....
									contextRender.lineTo((self.location.x + self.extent.width) - dCornerRadius,
											(self.location.y + self.extent.height));

									contextRender.quadraticCurveTo((self.location.x + self.extent.width),
											(self.location.y + self.extent.height),
											(self.location.x + self.extent.width),
											(self.location.y + self.extent.height) - dCornerRadius);

									contextRender.lineTo((self.location.x + self.extent.width),
											(self.location.y + dCornerRadius));

									contextRender.quadraticCurveTo((self.location.x + self.extent.width),
											self.location.y,
											(self.location.x + self.extent.width) - dCornerRadius,
											self.location.y);

									contextRender.lineTo((self.location.x + dCornerRadius),
											(self.location.y));

									contextRender.quadraticCurveTo(self.location.x,
											self.location.y,
											self.location.x,
											self.location.y + dCornerRadius);
									break;
								case "bl":	// Arror is on left end of bottom line of rect.

									// Down the left side.
									contextRender.moveTo(self.location.x,
											self.location.y + dCornerRadius);
									contextRender.lineTo(self.location.x,
											(self.location.y + self.extent.height) - dCornerRadius);

									// SW corner.
									contextRender.quadraticCurveTo(self.location.x,
											(self.location.y + self.extent.height),
											(self.location.x + dCornerRadius),
											(self.location.y + self.extent.height));

									// A bit before the drop-triangle.
									contextRender.lineTo((self.location.x + dCornerRadius + 10),
											(self.location.y + self.extent.height));

									// Now the drop-triangle bottom point.
									contextRender.lineTo((self.location.x + dCornerRadius + 10),
											(self.location.y + self.extent.height + 15));

									// Back to the bottom of the rect.
									contextRender.lineTo((self.location.x + dCornerRadius + 20),
											(self.location.y + self.extent.height));

									// Rest of the bottom. And then proceed as normal to finish the rect....
									contextRender.lineTo((self.location.x + self.extent.width) - dCornerRadius,
											(self.location.y + self.extent.height));

									contextRender.quadraticCurveTo((self.location.x + self.extent.width),
											(self.location.y + self.extent.height),
											(self.location.x + self.extent.width),
											(self.location.y + self.extent.height) - dCornerRadius);

									contextRender.lineTo((self.location.x + self.extent.width),
											(self.location.y + dCornerRadius));

									contextRender.quadraticCurveTo((self.location.x + self.extent.width),
											self.location.y,
											(self.location.x + self.extent.width) - dCornerRadius,
											self.location.y);

									contextRender.lineTo((self.location.x + dCornerRadius),
											(self.location.y));

									contextRender.quadraticCurveTo(self.location.x,
											self.location.y,
											self.location.x,
											self.location.y + dCornerRadius);
									break;
								case "tl":	// Arror is on left end of top line of rect.

									// Down the left side.
									contextRender.moveTo(self.location.x,
											self.location.y + dCornerRadius);
									contextRender.lineTo(self.location.x,
											(self.location.y + self.extent.height) - dCornerRadius);

									// SW corner.
									contextRender.quadraticCurveTo(self.location.x,
											(self.location.y + self.extent.height),
											(self.location.x + dCornerRadius),
											(self.location.y + self.extent.height));
									// Rest of the bottom.
									contextRender.lineTo((self.location.x + self.extent.width) - dCornerRadius,
											(self.location.y + self.extent.height));

									// SE corner.
									contextRender.quadraticCurveTo((self.location.x + self.extent.width),
											(self.location.y + self.extent.height),
											(self.location.x + self.extent.width),
											(self.location.y + self.extent.height) - dCornerRadius);

									// Right side.
									contextRender.lineTo((self.location.x + self.extent.width),
											(self.location.y + dCornerRadius));

									// NE corner.
									contextRender.quadraticCurveTo((self.location.x + self.extent.width),
											self.location.y,
											(self.location.x + self.extent.width) - dCornerRadius,
											self.location.y);

									// Across the top to the rising-triangle.
									contextRender.lineTo((self.location.x + dCornerRadius + 20),
											(self.location.y));

									// Now the rising-triangle bottom point.
									contextRender.lineTo((self.location.x + dCornerRadius + 10),
											(self.location.y - 15));

									// Back to the top of the rect.
									contextRender.lineTo((self.location.x + dCornerRadius + 10),
											(self.location.y));

									// Rest of the top.
									contextRender.lineTo((self.location.x + dCornerRadius),
											(self.location.y));

									contextRender.quadraticCurveTo(self.location.x,
											self.location.y,
											self.location.x,
											self.location.y + dCornerRadius);
									break;
								case "tr":	// Arror is on right end of top line of rect.

									// Down the left side.
									contextRender.moveTo(self.location.x,
											self.location.y + dCornerRadius);
									contextRender.lineTo(self.location.x,
											(self.location.y + self.extent.height) - dCornerRadius);

									// SW corner.
									contextRender.quadraticCurveTo(self.location.x,
											(self.location.y + self.extent.height),
											(self.location.x + dCornerRadius),
											(self.location.y + self.extent.height));
									// Rest of the bottom.
									contextRender.lineTo((self.location.x + self.extent.width) - dCornerRadius,
											(self.location.y + self.extent.height));

									// SE corner.
									contextRender.quadraticCurveTo((self.location.x + self.extent.width),
											(self.location.y + self.extent.height),
											(self.location.x + self.extent.width),
											(self.location.y + self.extent.height) - dCornerRadius);

									// Right side.
									contextRender.lineTo((self.location.x + self.extent.width),
											(self.location.y + dCornerRadius));

									// NE corner.
									contextRender.quadraticCurveTo((self.location.x + self.extent.width),
											self.location.y,
											(self.location.x + self.extent.width) - dCornerRadius,
											self.location.y);

									// A bit before the rising-triangle.
									contextRender.lineTo((self.location.x + self.extent.width - dCornerRadius - 10),
											(self.location.y));

									// Now the rising-triangle bottom point.
									contextRender.lineTo((self.location.x + self.extent.width - dCornerRadius - 10),
											(self.location.y - 15));

									// Back to the top of the rect.
									contextRender.lineTo((self.location.x + self.extent.width - dCornerRadius - 20),
											(self.location.y));

									// Rest of the top.
									contextRender.lineTo((self.location.x + dCornerRadius),
											(self.location.y));

									contextRender.quadraticCurveTo(self.location.x,
											self.location.y,
											self.location.x,
											self.location.y + dCornerRadius);
									break;
							}

                            contextRender.closePath();

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Test if the point is in the self.
                    self.pointInArea = function (contextRender, point, bSimple) {

                        // First, try the coordinates.
                        if (point.x < self.location.x ||
                            point.x > self.location.x + self.extent.width ||
                            point.y < self.location.y ||
                            point.y > self.location.y + self.extent.height) {

                            return false;
                        }

                        // Don't compute the area, if simple compare--faster.
                        if (bSimple || true) {

                            return true;
                        }

                        // Generate path.
                        var exceptionRet = self.generateRoundedRectPath(contextRender);
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        // Return hit-test against generated path.
                        return contextRender.isPointInPath(point.x,
                            point.y);
                    }

					// Private fields.

					// Layer's config for tooltip outline use.
					var m_tooltipArrowLoc = null;

                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
