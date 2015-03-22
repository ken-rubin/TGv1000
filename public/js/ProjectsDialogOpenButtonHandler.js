//////////////////////////////////////////
// ProjectsDialog open button handler. 
//
// Return constructor function.
//

// Define an AMD module.
define(function () {

	try {

		// Define the function constructor returned as "this" module.
		var functionProjectsDialogOpenButtonHandler = function () {

			var self = this;

			//////////////////////////////////////
			// Public methods.

			// Initialize this object.
			self.create = function (objectContext) {

				try {

					// Save context state.  This is known to be a dialog because this module
					// is always loaded as the result of a button click in a popup dialog.
					m_dialogContext = objectContext;

					// Activate tooltips.
					$("[data-toggle='tooltip']").tooltip();

					// Wire buttons.
					$(".projectItem").off("click");
					$(".projectItem").on("click", m_functionProjectItemClick);
				} catch (e) {

					alert(e.message);
				}
			};

			//////////////////////////////////////
			// Private methods.

			// Invoked when a project item is clicked.
			var m_functionProjectItemClick = function () {

				try {

					// Get the project id from this (i.e. what was clicked).
					var strProjectId = $(this).attr("id");

			        m_dialogContext.close();
			    	BootstrapDialog.alert("Open " + strProjectId + " project....");
				} catch (e) {

					m_functionErrorHandler(e.message);
				}
			};

			//////////////////////////////////////
			// Private fields.

			// The owning dialog.
			var m_dialogContext = null;
		};

		return functionProjectsDialogOpenButtonHandler;
	} catch (e) {

		alert(e.message);
	}
});
