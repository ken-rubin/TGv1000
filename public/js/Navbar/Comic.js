////////////////////////////////////////
// A single comic frame.
//
// Returns constructor function.
//

// Define module.
define(["Core/errorHelper"],
	function (errorHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function Comic(strId, strSrc) {

				try {

					var self = this;			// Uber closure.

					/////////////////////////////
					// Public properties.

					// Id of matching element.
					self.id = strId || "comic0";
					// Image URL.
					self.src = strSrc || "../media/images/0.png";

					/////////////////////////////
					// Public methods.

					// Return the DOM element representing a prototypical comic item.
					self.generateDOM = function () {

						return $("<img class='comicstripitem' id='" + 
							self.id + 
							"' src='" +
						 	self.src + 
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
