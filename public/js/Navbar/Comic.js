////////////////////////////////////////
// A single comic frame.
//
// Returns constructor function.
//

// Define module.
define(["Core/errorHelper", "Core/resourceHelper"],
	function (errorHelper, resourceHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function Comic() {

				try {

					var self = this;			// Uber closure.

					/////////////////////////////
					// Public properties.

					// Data object.
					// Schema:
					// id -- DB id of comic.
					// name -- Name of comic.
					// resourceId -- Image URL.
					// toolStrip -- the data for the toolstrip.
					// typeStrip -- the data for the typestrip.
					self.data = null;

					/////////////////////////////
					// Public methods.

					// Create comic instance.
					self.activate = function () {

						try {

							// Create or re-create the strips with this comic's data.
							return typeStrip.load(self.data.typeStrip);
						} catch (e) {

							return e;
						}
					};

					// Create comic instance.
					self.load = function (objectData) {

						try {

							// Save state.
							self.data = objectData;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Return the DOM element representing a prototypical comic item.
					self.generateDOM = function () {

						return $("<img class='comicstripitem' id='" + 
							self.data.id + 
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
