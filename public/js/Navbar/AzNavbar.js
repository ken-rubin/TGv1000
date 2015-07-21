/////////////////////////////////////////
// AzNavbar wraps code associated with the navbar.
//
// Return constructor function.
//

// Define module.
define(["Core/errorHelper"], 
	function (errorHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function AzNavbar() {

				try {

					var self = this;			// Uber closure.

					////////////////////////////////
					// Pulbic methods.

					// Create instance to DOM.
					self.create = function (azClient) {

						try {

							// Wire projects buttons.
							$("#NewProductClassButton").click(function () {

								try {

									var exceptionRet = azClient.showNewProductClassDialog();
									if (exceptionRet) { throw exceptionRet; }

								} catch (e) {

									errorHelper.show(e);
								}
							});

							return null;

						} catch (e) {

							return e;
						}
					};

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
