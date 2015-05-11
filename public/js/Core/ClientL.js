///////////////////////////////
// ClientL module runs client state and manages gui/server interaction during Login view.
//
// Return constructor function.
//

// Define module and require dependencies.
define(["Core/errorHelper", 
		"Dialogs/EnrollDialog/EnrollDialog", 
		"Dialogs/ModelDialog/ModelDialog"],
	function (errorHelper, 
				EnrollDialog,
				ModelDialog) {

		try {

			// Define the client constructor function.
			var functionConstructor = function ClientL() {

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

					// The ModalDialog exists to copy from.
					self.showModelDialog = function () {

						try {

							m_modelDialog = new ModelDialog();
							var exceptionRet = m_modelDialog.create();
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					self.closeModelDialog = function () {

						try {

							var exceptionRet = m_modelDialog.close();
							if (exceptionRet) {

								throw exceptionRet;
							}

							m_modelDialog = null;
							return null;
						} catch (e) {

							return e;
						}
					}

					// Open popup--map callbacks to private functions.
					self.showEnrollDialog = function (functionNewEnrollee) {

						try {

							var td = new EnrollDialog();
							var exceptionRet = td.create(functionNewEnrollee);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					///////////////////////////////
					// Private functions.

					// Invoked when the projects dialog exist newly.

					/////////////////////////////////
					// Private fields.

					var m_modelDialog = null;
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
