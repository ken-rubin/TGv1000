///////////////////////////////
// Validator module is used to validate names of Types, Tool Instances, Methods, Properties and Events.
// It is used for new items and renames.
//
// Return constructor function.
//

// Define module and require dependencies.
define(["Core/errorHelper"],
	function (errorHelper) {

		try {

			// Define the client constructor function.
			var functionConstructor = function Validator() {

				try {

					var self = this;		// Uber closure.

					//////////////////////////////
					// Public properties.


					//////////////////////////////
					// Public methods.

					// Start off the client.
					self.create = function () {

						try {

							return null;

						} catch (e) {

							return e;
						}
					};

					//////////////////////////////
					// Private methods

					//////////////////////////////
					// Private variables.

				} catch (e) { errorHelper.show(e); }
			};

			// Return constructor function.
			return functionConstructor;

		} catch (e) {

			errorHelper.show(e);
		}
	});
