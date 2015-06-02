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
					// tools -- the data for the toolstrip.
					// types -- the data for the typestrip.
					self.data = null;

					/////////////////////////////
					// Public methods.

					// Create comic instance.
					self.activate = function () {

						try {

							// Set as active comic in comic strip.
							var exceptionRet = comics.select(self);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Create or re-create the strips with this comic's data.
							return types.load(self.data.types);
							
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
							self.data.name + 
							"' src='" +
						 	resourceHelper.toURL('resources', self.data.imageResourceId, 'image', '') + 
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
