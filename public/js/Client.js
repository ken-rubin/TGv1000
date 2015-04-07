///////////////////////////////
// Client module runs client state and manages gui/server interaction.
//
// Return constructor function.
//

define(["errorHelper"],
	function (errorHelper) {

		try {

			// Define the client constructor function.
			var functionConstructor = function Client() {

				try {

					var self = this;		// Uber closure.

					//////////////////////////////
					// Public properties.

					// Main client state field.
					// Initialize, steadystate, closing.
					self.state = "initialize";
				} catch (e) {

					errorHelper.show(e);
				}
			});

			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
