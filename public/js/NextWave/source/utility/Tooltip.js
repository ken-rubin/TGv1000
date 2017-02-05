///////////////////////////////////////
// Tooltip module.
//
// Holds information for locating and displaying a Tooltip.
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
    "NextWave/source/utility/Control"],
    function (prototypes, settings, Point, Size, Area, Control) {

        try {

            // Constructor function.
        	var functionRet = function Tooltip(strText) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from Control.  Call parent Control
                    // constructor.  Pass parameters, if specified.
                    self.inherits(Control);

                    ///////////////////////
                    // Public fields.

                    // Content.
                    self.text = strText || "";
					// So LayerTooltip can set up to draw the tooltip.
					self.requiresCalculateLayout = false;

                    ///////////////////////
                    // Public methods.

                    // Inner clear data.
                    self.innerClear = function () {

                        // Do nothing, Tooltips are static.
                        return null;
                    };

                    // Inner load.
                    self.innerCreate = function () {

                        self.text = self.configuration.text;
                        return null;
                    };

                    // Give this object a crack at the layout pipeline.
                    self.innerCalculateLayout = function (dummyArea, contextRender) {

                        try {

							if (!self.requiresCalculateLayout) {

								return null;
							}

							// Unlike the usual case, we ignore dummyArea and, based on props in self.configuration,
							// we will calculate m_area to hold and position the text perfectly.
							let arrTooltip = self.configuration.text.split("<br>");
							if (arrTooltip.length) {

								let dMaxWidth = 0;
								contextRender.font = self.configuration.font || settings.general.font;
								for (var i in arrTooltip) {

									let metrics = contextRender.measureText(arrTooltip[i]);
									dMaxWidth = Math.max(dMaxWidth, metrics.width);
								}

								// dMaxWidth is width (in px) of widest line.
								// The lines are in arrTooltip. There are arrTooltip.length of them.
								let ttWidth = dMaxWidth + 20;
								let lineHeight = settings.tooltip.lineHeight;
								let ttHeight = arrTooltip.length * lineHeight + 20;

								let tooltipArrowLoc = "";		// One of "bl", "br", "tl", "tr". Look at Area.js to understand.

								let ttX = 0;
								let ttY = 0;

								// We know the tooltip's width and height. They're set in ttWidth and ttHeight.
								// To see where the tooltip's little arrow goes and where the tooltip is positioned
								// we will need to try out 4 positions (and arrow locations) and see if the tooltip stays within self.configuration.layerExtent.

								// Tooltip (us) has these properties to use to figure out its configuration:
								//		self.configuration.width	width of the control getting the tooltip
								//		self.configuration.height	height of the control getting the tooltip
								//		self.configuration.x		x position of the control getting the tooltip
								//		self.configuration.y		y position of the control getting the tooltip
								//		self.configuration.layerExtent size of LayerTooltip
								// Use them to smartly position the tooltip and the little arrow. (width and height of the tooltip are already set.)
								let targetControlWidth = self.configuration.width;
								let targetControlHeight = self.configuration.height;
								let targetControlX = self.configuration.x;
								let targetControlY = self.configuration.y;
								let layerExtent = self.configuration.layerExtent;

								// Case "bl": tooltip is above its target control and the left sides line up.
								ttX = targetControlX;
								ttY = targetControlY - 10 - ttHeight;
								if ((ttY > 0) && (ttX + ttWidth < layerExtent.width)) {
									tooltipArrowLoc = "bl";
								} else {

									// Case "br": tooltip is above target control and right sides line up.
									ttX = targetControlX + targetControlWidth - ttWidth;
									ttY = targetControlY - 10 - ttHeight;
									if ((ttY > 0) && (ttX > 0)) {
										tooltipArrowLoc = "br";
									} else {

										// Case "tl": tooltip is below target control and left sides line up.
										ttX = targetControlX;
										ttY = targetControlY + targetControlHeight + 10;
										if ((ttX + ttWidth < layerExtent.width) && (ttY + ttHeight < layerExtent.height)) {
											tooltipArrowLoc = "tl";
										} else {
											tooltipArrowLoc = "tr";
										}
									}
								}

								m_area = new Area(new Point(ttX, ttY), new Size(ttWidth, ttHeight));
								m_area.setTooltipArrowLoc(tooltipArrowLoc);

								self.requiresCalculateLayout = false;
							}

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render object.
					// self.configuration contains properties text, x, y, width and height.
					// text may be multiline, broken by <br>.
					// The Area properties are for the item for which this tooltip is to displayed.
					// It is up to us to design the tooltip.
                    self.render = function (contextRender) {

                        try {

							if (!self.configuration.text) {

								return null;
							}

							if (self.requiresCalculateLayout) {

								let exceptionRet = self.innerCalculateLayout(new Area(), contextRender);
								if (exceptionRet) {

									return exceptionRet;
								}
							}

                            // If font specified, set, else default.
                            contextRender.font = self.configuration.font || settings.general.font;

							// Generate the path.
							var exceptionRet = m_area.generateRoundedTooltipPath(contextRender);
							if (exceptionRet) {

								throw exceptionRet;
							}

							contextRender.fillStyle = settings.tooltip.fillStyle;
							contextRender.fill();
							contextRender.strokeStyle = settings.tooltip.fillStyle;
							contextRender.stroke();

                            // Render.
                            contextRender.fillStyle = settings.tooltip.textStyle;
							contextRender.lineWidth = settings.tooltip.lineWidth;

							// Split the text into lines and initialize.
							let arrTooltip = self.configuration.text.split("<br>");
							let y = m_area.location.y + 10;
							let dy = settings.tooltip.lineHeight;
							if (arrTooltip.length) {

								for (var i in arrTooltip) {

									contextRender.fillText(arrTooltip[i],
										m_area.location.x + 10,
										y);

									y += dy;
								}
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

                } catch (e) {

                    alert(e.message);
                }
        	};

            // Inherit from Control.  Wire
            // up prototype chain to Control.
//            functionRet.inheritsFrom(Control);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
