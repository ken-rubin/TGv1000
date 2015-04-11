////////////////////////////////////
// Main
//
// Return null--no module object.
//

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Require the error handler for all functions.
		require(["errorHelper", "Client", "Code", "Designer", "Navbar", "ScrollRegion"], 
			function (errorHelper, Client, Code, Designer, Navbar, ScrollRegion) {

			try {

				// Allocate and initialize the client.
				var client = new Client();
				var exceptionRet = client.create(1/*iUserId*/);
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate and attach the designer.
				var designer = new Designer();
				exceptionRet = designer.attach("surfacecanvas");
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate and attach the code module.
				var code = new Code();
				exceptionRet = code.attach();
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate and attach the navbar module.
				var navbar = new Navbar();
				exceptionRet = navbar.attach(client);
				if (exceptionRet) {

					throw exceptionRet;
				}

				// Allocate and attach the designers.
				var srTypeStrip = new ScrollRegion();
				var exceptionRet = srTypeStrip.attach("typestriprow");
				if (exceptionRet) {

					throw exceptionRet;
				}
				var srToolStrop = new ScrollRegion();
				exceptionRet = srToolStrop.attach("toolstriprow");
				if (exceptionRet) {

					throw exceptionRet;
				}
				var srComicStrip = new ScrollRegion();
				exceptionRet = srComicStrip.attach("comicstriprow");
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
