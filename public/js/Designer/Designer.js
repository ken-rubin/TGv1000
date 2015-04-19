/////////////////////////////////////////
// Designer allows the user to control the simulation via gui tool-widgets.
//
// Return constructor function.
//

// 
define(["Core/errorHelper"], 
	function (errorHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function Designer() {

				try {

					var self = this;			// Uber closure.

					////////////////////////////////
					// Pulbic properties.

					// Selector.
					self.selector = "#surfacecanvas";

					////////////////////////////////
					// Pulbic methods.

					// Attach instance to DOM.
					self.create = function () {

						try {

							$(window).resize(function () {

								try {

									var iViewportHeight = $(window).height();

									var iToolStripHeight = $("#toolstriprow").height();
									var iNavbarHeight = $(".navbar").height();
									var iBordersAndSpacingPadding = 48;

									var jCanvas = $(self.selector);
									var canvas = jCanvas[0];
									jCanvas.height(iViewportHeight - 
										iToolStripHeight -
										iNavbarHeight -
										iBordersAndSpacingPadding);

									var dWidth = jCanvas.width();
									var dHeight = jCanvas.height();
									jCanvas.attr("width",
										dWidth);
									jCanvas.attr("height",
										dHeight);

									// Get context.
									var context = canvas.getContext("2d");

									context.transform(1, 0, 0, -1, dWidth / 2, dHeight / 2);

									// Draw out the background and grid lines.
									context.fillStyle = "rgba(0,0,0,1)";
									context.fillRect(0, 0, context.canvas.width, context.canvas.height);

									context.fillStyle = "#333";
									var iX = 0;
									var iY = 0;
									while (iX < dWidth / 2) {

										context.fillRect(iX, -dHeight / 2, 1, dHeight);
										context.fillRect(-iX, -dHeight / 2, 1, dHeight);

										iX += 50;
									}
									while (iY < dHeight / 2) {

										context.fillRect(-dWidth / 2, iY, dWidth, 1);
										context.fillRect(-dWidth / 2, -iY, dWidth, 1);

										iY += 50;
									}
									context.strokeStyle = "#ccc";
									context.strokeRect(-dWidth / 2, 0, dWidth, 1);
									context.strokeRect(0, -dHeight / 2, 1, dHeight);
									context.strokeRect(-dWidth / 2, -dHeight / 2, dWidth, dHeight);

								} catch (e) {

									errorHelper.show(e);
								}
							});

							return null;
						} catch (e) {

							return e;
						}
					};
				} catch (e) {

					errorHelper.show(e);
				}
			};

			// Return constructor function.
			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
