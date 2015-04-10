/////////////////////////////////////////
// ToolStrip
//
// Returns constructor functions.
//

// Define AMD module.
define(["errorHelper"],
	function (errorHelper) {

		try {

			// Define ToolStrip constructor function. 
			var functionConstructor = function ToolStrip() {

				try {

					var self = this;			// Uber closure.

					// Create the tool strip.
					// Attach to specified element.
					self.create = function (strSelector) {

						try {

							return null;
						} catch (e) {

							return e;
						}
					};
				} catch (e) {

					errorHelper.show(e);
				}
			};

			// Return the constructor function.
			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
