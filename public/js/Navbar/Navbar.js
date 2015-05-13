/////////////////////////////////////////
// Navbar wraps code associated with the navbar.
//
// Return constructor function.
//

// Define module.
define(["Core/errorHelper"], 
	function (errorHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function Navbar() {

				try {

					var self = this;			// Uber closure.

					////////////////////////////////
					// Pulbic methods.

					// Create instance to DOM.
					self.create = function (client) {

						try {

							// Wire theme buttons:
							$("#UnicornButton").click(function () {

								$("body").css("background-image", "url('../media/images/ru.jpg')");
							});
							$("#TechButton").click(function () {

								$("body").css("background-image", "url('../media/images/t.png')");
							});

							// Wire projects button click.
							$("#ProjectsButton").click(function () {

								try {

									// Show the projects dialog.
									var exceptionRet = client.showProjectsDialog();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							// Wire Adminzone button click.
							$("#AdminzoneButton").click(function () {

								try {

									// Switch to Adminzone.
									var exceptionRet = client.navToAdminzone();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							// Wire debug button click.
							$("#DebugButton").click(function () {

								try {

									// Let client handle this.
									var exceptionRet = client.debug();
									if (exceptionRet) {

										throw exceptionRet;
									}
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
