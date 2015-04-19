////////////////////////////////////////
// A single tool item.
//
// Returns constructor function.
//

// Define module.
define(["Core/errorHelper", "Core/resourceHelper"],
	function (errorHelper, resourceHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function Tool() {

				try {

					var self = this;			// Uber closure.

					/////////////////////////////
					// Public properties.

					// Data.
					// Schema:
					// id -- DB id of tool.
					// name -- name of tool.
					// resourceId -- resource id for tool.
					self.data = null;

					/////////////////////////////
					// Public methods.

					// Load up tool.
					self.load = function (objectData) {

						try {

							// Save tool state.
							self.data = objectData;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Return the DOM element representing a prototypical tool item.
					self.generateDOM = function () {

						return $("<img class='toolstripitem' id='" + 
							self.data.name + 
							"' src='" +
						 	resourceHelper.toURL(self.data.resourceId) + 
						 	"'></img>");
					};
				} catch (e) {

					errorHelper.show(e);
				}
			}

			// Return constructor function.
			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
