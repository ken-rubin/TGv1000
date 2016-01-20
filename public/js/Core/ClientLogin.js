///////////////////////////////
// ClientLogin module runs client state and manages gui/server interaction during Login view.
//
// Return constructor function.
//

// Define module and require dependencies.
define(["Core/errorHelper", 
		"Dialogs/EnrollDialog/EnrollDialog",
		"Dialogs/ForgotPWDialog/ForgotPWDialog",
		"Dialogs/PWResetDialog/PWResetDialog"],
	function (errorHelper, 
				EnrollDialog,
				ForgotPWDialog,
				PWResetDialog) {

		try {

			// Define the client constructor function.
			var functionConstructor = function ClientLogin() {

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

					// Open popup--map callbacks to private functions.
					self.showEnrollDialog = function () {

						try {

							var td = new EnrollDialog();
							var exceptionRet = td.create();
							if (exceptionRet) { throw exceptionRet; }
							return null;

						} catch (e) {

							return e;
						}
					};

					self.showForgotPWDialog = function () {

						try {

							var td = new ForgotPWDialog();
			                var strUserName = null;
			                if (g_profile && g_profile.hasOwnProperty("userName")) {
			                	strUserName = g_profile["userName"];
			                }
							var exceptionRet = td.create(strUserName);
							if (exceptionRet) { throw exceptionRet; }
							return null;

						} catch (e) {

							return e;
						}
					};

					self.showPWResetDialog = function (token) {

						try {

							var td = new PWResetDialog();
							var exceptionRet = td.create(token);
							if (exceptionRet) { throw exceptionRet; }
							return null;

						} catch (e) {

							return e;
						}
					}

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
