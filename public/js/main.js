////////////////////////////////////
// Main
//
// Return null--no module object.
//

// Define some app-globals.
var client = null;
var navbar = null;
var comicStrip = null;
var designer = null;
var toolStrip = null;
var code = null;
var typeStrip = null;

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Require the error handler for all functions.
		require(["Core/errorHelper", "Core/Client", "Code/Code", "Code/TypeStrip", "Designer/Designer", "Designer/ToolStrip", "Navbar/Navbar", "Navbar/ComicStrip"], 
			function (errorHelper, Client, Code, TypeStrip, Designer, ToolStrip, Navbar, ComicStrip) {

			try {

				// Allocate and initialize the client.
				client = new Client();
				var exceptionRet = client.create(1/*iUserId -- eventually from server specified cookie*/);
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
				exceptionRet = navbar.create();
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate the strips too.
				comicStrip = new ComicStrip();
				exceptionRet = comicStrip.create();
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate the strips too.
				toolStrip = new ToolStrip();
				exceptionRet = toolStrip.create();
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate the strips too.
				typeStrip = new TypeStrip();
				exceptionRet = typeStrip.create();
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
