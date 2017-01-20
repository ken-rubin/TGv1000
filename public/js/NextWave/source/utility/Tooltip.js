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
								let width = dMaxWidth + 20;
								let lineHeight = settings.tooltip.lineHeight;
								let height = arrTooltip.length * lineHeight + 20;
								let x = self.configuration.x;
								let y = self.configuration.y - 10 - height;

								m_area = new Area(new Point(x,y), new Size(width,height));
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
