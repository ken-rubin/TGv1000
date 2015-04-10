/////////////////////////////////////////
// Navbar wraps code associated with the navbar.
//

define(["errorHelper"], 
	function (errorHelper) {

	try {

		// Define constructor function.
		var functionConstructor = function Navbar() {

			try {

				var self = this;			// Uber closure.

				////////////////////////////////
				// Pulbic methods.

				// Attach instance to DOM.
				self.attach = function (client) {

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