///////////////////////////////
// Project.  A new, opened or cloned project.
//
// Return constructor function.
//

// 
define(["Core/errorHelper", "Navbar/ComicStrip"],
	function (errorHelper, ComicStrip) {

		try {

			// Define the project constructor function.
			var functionConstructor = function Project() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					// Name of the project.
					self.name = "project1";

					// Description of project.
					self.description = "this is a test of the emergency broadcast system....";

					// Image resource id.
					self.imageResourceId = 1;

					//////////////////////////////
					// Public methods.

					// Attach GUI wrappers.
					self.load = function (objectData) {

						try {

							return comicStrip.load(objectData.comicStrip);
						} catch (e) {

							return e;
						}
					};

					self.saveToDatabase = function () {

						try {


							return null;
						
						} catch (e) {

							return e;
						}
					}

					//////////////////////////////
					// Private fields.

					// The strip of comic frames.
					var m_csComicStrip = null;
				} catch (e) {

					errorHelper.show(e);
				}
			};

			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
