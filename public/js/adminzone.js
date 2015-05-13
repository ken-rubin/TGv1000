////////////////////////////////////
// Login
//
// Return null--no module object.
//

// Define some app-globals.
var clientAdminzone = null;

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Require the error handler for all functions.
		require(["Core/errorHelper", "Core/ClientAdminzone"], 
			function (errorHelper, ClientAdminzone) {

				try {

					// Allocate and initialize the client.
					clientAdminzone = new ClientAdminzone();
					var exceptionRet = clientAdminzone.create();
					if (exceptionRet) {

						throw exceptionRet;
					}

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

