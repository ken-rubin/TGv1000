/////////////////////////////////////////
// Designer allows the user to control the simulation via gui tool-widgets.
//

define(["errorHelper"], 
	function (errorHelper) {

	try {

		// Define constructor function.
		var functionConstructor = function Designer() {

			try {

				var self = this;			// Uber closure.

				////////////////////////////////
				// Pulbic methods.

				// Attach instance to DOM.
				self.attach = function (strId) {

					try {

						// Ensure there is some value for selector.
						strId = strId || "surfacecanvas";

						// Get canvas and context.
						var canvas = document.getElementById(strId);
						var context = canvas.getContext("2d");

						// Draw out the background and grid lines.
						context.fillStyle = "rgba(0,0,0,1)";
						context.fillRect(0, 0, context.canvas.width, context.canvas.height);

						context.fillStyle = "#333";
						for (var iX = 0; iX < context.canvas.width; iX+=(1024/16)) {

							context.fillRect(iX, 0, 1, context.canvas.height);
						}
						for (var iY = 0; iY < context.canvas.height; iY+=(768/16)) {

							context.fillRect(0, iY, context.canvas.width, 1);
						}
						context.fillStyle = "#ccc";
						for (var i = 0; i < 9; i++) {

							var iDivisor = Math.pow(2, i);
							var iXStep = context.canvas.width / iDivisor;
							var iYStep = context.canvas.height / iDivisor;

							for (var iX = 0; iX < context.canvas.width; iX+=iXStep) {

								context.fillRect(iX, 0, 1, iYStep);
								context.fillRect(context.canvas.width - iX, context.canvas.height, 1, -iYStep);
							}
							for (var iY = 0; iY < context.canvas.height; iY+=iYStep) {

								context.fillRect(0, iY, iXStep, 1);
								context.fillRect(context.canvas.width, context.canvas.height - iY, -iXStep, 1);
							}
						}
						context.fillRect(context.canvas.width, context.canvas.height, -1, -context.canvas.height);
						context.fillRect(context.canvas.width, context.canvas.height, -context.canvas.width, -1);

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