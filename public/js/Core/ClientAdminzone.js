///////////////////////////////
// ClientAdminzone module runs client state and manages gui/server interaction during Login view.
//
// Return constructor function.
//

// Define module and require dependencies.
define(["Core/errorHelper", 
		"Dialogs/EnrollDialog/EnrollDialog"],
	function (errorHelper, 
				EnrollDialog) {

		try {

			// Define the client constructor function.
			var functionConstructor = function ClientAdminzone() {

				try {

					var self = this;		// Uber closure.

					//////////////////////////////
					// Public properties.

					// Main client state field.
					// Initialize, steadystate, closing.
					self.state = "initialize";

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

					// Start off the client.
					self.debug = function () {

						try {

							// 
							return null;
						} catch (e) {

							return e;
						}
					};

					self.getTGCookie = function (name) {

					    var value = "; " + document.cookie;
					    var parts = value.split("; " + name + "=");
					    if (parts.length == 2) {

					        return parts.pop().split(";").shift();
					    }
					};

					///////////////////////////////
					// Private functions.

					// Invoked when the projects dialog exist newly.

					/////////////////////////////////
					// Private fields.

				} catch (e) {

					errorHelper.show(e);
				}
			};

			// Return constructor function.
			return functionConstructor;

		} catch (e) {

			errorHelper.show(e);
		}
	});
