/////////////////////////////////////////
// ComicStrip
//
// Returns constructor functions.
//

// Define AMD module.
define(["errorHelper"],
	function (errorHelper) {

		try {

			// Define ComicStrip constructor function. 
			var functionConstructor = function ComicStrip() {

				try {

					var self = this;			// Uber closure.

					// Create the comic strip.
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
