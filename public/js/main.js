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
var comicsPanel = null;
var bDisplayComics = false;

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Require the error handler for all functions.
		require(["Core/errorHelper", "Core/Client", "Code/Code", "Code/Types", "Designer/Designer", "Designer/Tools", "Navbar/Navbar", "Navbar/Comics", "Designer/ComicsPanel"], 
			function (errorHelper, Client, Code, Types, Designer, Tools, Navbar, Comics, ComicsPanel) {

			try {

				// Allocate and initialize the client.
				client = new Client();
				var exceptionRet = client.create();
				if (exceptionRet) { throw exceptionRet; }

				// Allocate and attach the designer.
				designer = new Designer();
				exceptionRet = designer.create();
				if (exceptionRet) { throw exceptionRet; }

				// Allocate and attach the code module.
				code = new Code();
				exceptionRet = code.create();
				if (exceptionRet) { throw exceptionRet; }

				// Allocate and attach the navbar module.
				navbar = new Navbar();
				exceptionRet = navbar.create(client);
				if (exceptionRet) { throw exceptionRet; }

				// Allocate the strips too.
				comics = new Comics();
				exceptionRet = comics.create();
				if (exceptionRet) { throw exceptionRet; }

				// Allocate the strips too.
				tools = new Tools();
				exceptionRet = tools.create();
				if (exceptionRet) { throw exceptionRet; }

				// Allocate the strips too.
				types = new Types();
				exceptionRet = types.create();
				if (exceptionRet) { throw exceptionRet; }

				// And one more global singleton.
				comicsPanel = new ComicsPanel();
				exceptionRet = comicsPanel.create();
				if (exceptionRet) { throw exceptionRet; }

				// Disable all the TypeWell icons, since there is current no project loaded.
				$(".disabledifnoproj").prop("disabled", true);

				// Cause the code and designer panels to size themselves. Initially, there will be no comic or panels strips because of bDisplayComics setting.
				$(window).resize();

			} catch (e) {

				errorHelper.show(e);
			}
		});
	} catch (e) {

		alert(e.message);
	}
});
