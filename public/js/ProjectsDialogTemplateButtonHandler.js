//////////////////////////////////////////
// ProjectsDialog template button handler. 
//
// Return constructor function.
//

// Define an AMD module.
define(["errorHelper"], function (errorHelper) {

	try {

		// Define the function constructor returned as "this" module.
		var functionHandler = function () {

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
					$(".projectItem").on("click", m_functionTemplateItemClick);
				} catch (e) {

					errorHelper.show(e.message);
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

					errorHelper.show(e.message);
				}
			};

			//////////////////////////////////////
			// Private fields.

			// The owning dialog.
			var m_dialogContext = null;
		};

		return functionHandler;
	} catch (e) {

		errorHelper.show(e.message);
	}
});
