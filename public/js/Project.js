///////////////////////////////
// Project.  A new, opened or cloned project.
//
// Return constructor function.
//

define(["errorHelper"],
	function (errorHelper) {

		try {

			// Define the project constructor function.
			var functionConstructor = function Project() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					// Collection of project types.
					self.types = [];

					// Collection of commic-frames.
					self.commicFrames = [];

					// Collection of tools.
					self.paletteTools = [];

					// Name of the project.
					self.name = "project1";

					// Description of project.
					self.description = "this is a test of the emergency broadcast system....";

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
