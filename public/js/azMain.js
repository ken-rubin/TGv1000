////////////////////////////////////
// Login
//
// Return null--no module object.
//

// Define some app-globals.
var azClient = null;
var azNavbar = null;
var g_strUserId = '';
var g_strUserName = '';

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Require the error handler for all functions.
		require(["Core/errorHelper", 
				"Core/AzClient",
				"Navbar/AzNavbar"], 
			function (errorHelper, 
						AzClient,
						AzNavbar) {

				try {

					// Allocate and initialize the client.
					azClient = new AzClient();
					var exceptionRet = azClient.create();
					if (exceptionRet) { throw exceptionRet; }

					// Allocate and attach the navbar module.
					azNavbar = new AzNavbar();
					exceptionRet = azNavbar.create();
					if (exceptionRet) { throw exceptionRet; }

					// Cause the code and designer panels to size themselves.
					$(window).resize();

				} catch (e) {

					errorHelper.show(e);
				}
			}
		);
	} catch (e) {

		alert(e.message);
	}
});

