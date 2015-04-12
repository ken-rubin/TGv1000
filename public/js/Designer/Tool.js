////////////////////////////////////////
// A single tool item.
//
// Returns constructor function.
//

// Define module.
define(["Core/errorHelper"],
	function (errorHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function Tool(strId, strSrc) {

				try {

					var self = this;			// Uber closure.

					/////////////////////////////
					// Public properties.

					// Id of matching element.
					self.id = strId || "tool0";
					// Image URL.
					self.src = strSrc || "../media/images/BlowUp.png";

					/////////////////////////////
					// Public methods.

					// Return the DOM element representing a prototypical tool item.
					self.generateDOM = function () {

						return $("<img class='toolstripitem' id='" + 
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
