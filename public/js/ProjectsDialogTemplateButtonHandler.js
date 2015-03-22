//////////////////////////////////////////
// ProjectsDialog template button handler. 
//
// Return constructor function.
//

// Define an AMD module.
define(function () {

	try {

		// Define the function constructor returned as "this" module.
		var functionProjectsDialogTemplateButtonHandler = function () {

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
					$(".templateItem").off("click");
					$(".templateItem").on("click", m_functionTemplateItemClick);
				} catch (e) {

					alert(e.message);
				}
			};

			//////////////////////////////////////
			// Private methods.

			// Invoked when a template item is clicked.
			var m_functionTemplateItemClick = function () {

				try {

					// Get the template name from this (i.e. what was clicked).
					var strTemplateId = $(this).attr("id");

			        m_dialogContext.close();
			    	BootstrapDialog.alert("Generate " + strTemplateId + " project....");
				} catch (e) {

					m_functionErrorHandler(e.message);
				}
			};

			//////////////////////////////////////
			// Private fields.

			// The owning dialog.
			var m_dialogContext = null;
		};

		return functionProjectsDialogTemplateButtonHandler;
	} catch (e) {

		alert(e.message);
	}
});
