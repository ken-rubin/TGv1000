////////////////////////////////////
// ResourceHelper wraps access to resource URLs from ids.
//
// Returns instance.
//

// Define module.
define(["Core/errorHelper"],
	function (errorHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function ResourceHelper() {

				try {

					var self = this;			// Uber closure.

					///////////////////
					// Public methods.

					// Return URL from the id.
					self.toURL = function (iResourceId) {

						return m_arrayMap[iResourceId];
					};

					///////////////////
					// Private fields.

					// Private state--the map.
					var m_arrayMap = ["../media/images/Rube.png",
						"../media/images/0.png",
						"../media/images/plus.png",
						"../media/images/Chester.png",
						"../media/images/Homer.png",
						"../media/images/BlowUp.png"];
				} catch (e) {

					errorHelper.show(e);
				}		
			};

			// Return instance of constructor function as module.
			return new functionConstructor();
		} catch (e) {

			errorHelper.show(e);
		}
	});
