///////////////////////////////
// AzClient module runs client state and manages gui/server interaction during Login view.
//
// Return constructor function.
//

// Define module and require dependencies.
define(["Core/errorHelper",
		"Dialogs/NewAzProductClassDialog/NewAzProductClassDialog"],
	function (errorHelper,
				NewAzProductClassDialog) {

		try {

			// Define the client constructor function.
			var functionConstructor = function AzClient() {

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
							// Set globals for everyone to use.
							g_strUserId = self.getTGCookie('userId');
							g_strUserName = self.getTGCookie('userName');

							return null;
						} catch (e) {

							return e;
						}
					};

					self.showNewProductClassDialog = function() {

						try {

							m_openDialog = new NewAzProductClassDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.closeCurrentDialog = function () {

						if (m_openDialog) {

							m_openDialog.closeYourself();
							m_openDialog = null;
						
						} else if (m_openDialog2) {

							m_openDialog2.closeYourself();
							m_openDialog2 = null;
						}
					}

					self.getTGCookie = function (name) {

					    var value = "; " + document.cookie;
					    var parts = value.split("; " + name + "=");
					    if (parts.length == 2) {

					        return parts.pop().split(";").shift();
					    }
					};

					///////////////////////////////
					// Private functions.

					/////////////////////////////////
					// Private fields.
					var m_openDialog = null;
					// This second one is used for the dialogs that open over another open dialog.
					var m_openDialog2 = null;

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
