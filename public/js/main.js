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
				var srProjectItems = new ScrollRegion();
				var exceptionRet = srProjectItems.attach("projectitemsstriprow",
					"projectsitembutton");
				if (exceptionRet) {

					throw exceptionRet;
				}
				var srPaletteItems = new ScrollRegion();
				exceptionRet = srProjectItems.attach("toolstriprow",
					"paletteitem");
				if (exceptionRet) {

					throw exceptionRet;
				}
				var srPaletteItems = new ScrollRegion();
				exceptionRet = srProjectItems.attach("commicstriprow",
					"commicframe");
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
