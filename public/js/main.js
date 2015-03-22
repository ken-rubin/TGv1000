////////////////////////////////////
// Main
//

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Wire button click.
		$("#ProjectsButton").click(function () {

			try {

				// Require the ProjectsDialog module.
				require(["ProjectsDialog"], 
					function (ProjectsDialog) {

						try {

							// Allocate and create (and show) the projects dialog.
							var pd = new ProjectsDialog();
							var exceptionRet = pd.create();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							alert(e.message);
						}
					});
			} catch (e) {

				alert(e.message);
			}
		});
	} catch (e) {

		alert(e.message);
	}
});
