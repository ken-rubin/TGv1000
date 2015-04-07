///////////////////////////////
// Type.  A sort of thing.
//
// Return constructor function.
//

define(["errorHelper"],
	function (errorHelper) {

		try {

			// Define the type constructor function.
			var functionConstructor = function Type() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					// Collection of properties (type members).
					self.properties = [];

					// Collection of methods (type members).
					self.methods = [];

					// Collection of events (type members).
					self.events = [];

					// Name of the project.
					self.name = "type1";

					// Description of project.
					self.description = "this is a type of the emergency broadcast system....";

					// Image resource id.
					self.imageResourceId = 1;
				} catch (e) {

					errorHelper.show(e);
				}
			});

			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
