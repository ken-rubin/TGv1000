////////////////////////////////////
// Main
//
// Return null--no module object.
//

// Define some app-globals.
var client = null;
var navbar = null;
var comics = null;
var designer = null;
var tools = null;
var code = null;
var types = null;

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Require the error handler for all functions.
		require(["Core/errorHelper", "Core/Client", "Code/Code", "Code/Types", "Designer/Designer", "Designer/Tools", "Navbar/Navbar", "Navbar/Comics"], 
			function (errorHelper, Client, Code, Types, Designer, Tools, Navbar, Comics) {

			try {

				// Allocate and initialize the client.
				client = new Client();
				var exceptionRet = client.create();
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate and attach the designer.
				designer = new Designer();
				exceptionRet = designer.create();
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate and attach the code module.
				code = new Code();
				exceptionRet = code.create();
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate and attach the navbar module.
				navbar = new Navbar();
				exceptionRet = navbar.create(client);
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate the strips too.
				comics = new Comics();
				exceptionRet = comics.create();
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate the strips too.
				tools = new Tools();
				exceptionRet = tools.create();
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate the strips too.
				types = new Types();
				exceptionRet = types.create();
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Cause the code and designer panels to size themselves.
				$(window).resize();
			} catch (e) {

				errorHelper.show(e);
			}
		});
	} catch (e) {

		alert(e.message);
	}
});
