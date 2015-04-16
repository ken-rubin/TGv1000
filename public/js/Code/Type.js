///////////////////////////////
// Type.  A sort of thing.
//
// Return constructor function.
//

// 
define(["Core/errorHelper"],
	function (errorHelper) {

		try {

			// Define the type constructor function.
			var functionConstructor = function Type(strId, strSrc) {

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

					// Id of the type.
					self.id = strId || "type1";
					// Image resource id.
					self.src = strSrc || "../media/images/plus.png";

					/////////////////////////////
					// Public methods.

					// Return the DOM element representing a prototypical comic item.
					self.generateDOM = function () {

						return $("<img class='typestripitem' id='" + 
							self.id + 
							"' src='" +
							self.src +
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
