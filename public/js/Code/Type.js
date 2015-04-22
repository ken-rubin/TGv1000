///////////////////////////////
// Type.  A sort of thing.
//
// Return constructor function.
//

// 
define(["Core/errorHelper", "Core/resourceHelper"],
	function (errorHelper, resourceHelper) {

		try {

			// Define the type constructor function.
			var functionConstructor = function Type() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					// The data this instance wrapps.
					// Schema:
					// add -- indicates this is the addtype type.
					// app -- indicates this is the app type.
					// properties -- collection of properties of type.
					// methods -- collection of methods of type.
					// events -- collection of events of type.
					// dependencies -- collection of dependencies of type.
					// id -- the DB id of type.
					// name -- the name of type.
					// resourceId -- the resource id.
					self.data = null;

					/////////////////////////////
					// Public methods.

					// Create this instance.
					self.load = function (objectData) {

						try {

							// Save data.
							self.data = objectData;

							// process properties methods events and dependencies collections.

							return null;
						} catch (e) {

							return e;
						}
					};

					// Return the DOM element representing a prototypical item.
					self.generateDOM = function () {


						return $("<img class='typestripitem' id='" + 
							self.data.name + 
							"' src='" +
							resourceHelper.toURL(self.data.resourceId) +
							"'></img>");
					};
				} catch (e) {

					errorHelper.show(e);
				}
			};

			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
