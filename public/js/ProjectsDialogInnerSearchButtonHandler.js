//////////////////////////////////////////
// ProjectsDialog inner search button handler. 
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
					m_dialogContext = objectContext.dialog;
					m_pdParent = objectContext.parent;

					// Activate tooltips.
					$("[data-toggle='tooltip']").tooltip();

					// Wire buttons.
					$(".projectItem").off("click");
					$(".projectItem").on("click", m_functionProjectItemClick);
				} catch (e) {

					errorHelper.show(e.message);
				}
			};

			//////////////////////////////////////
			// Private methods.

			// Invoked when a project item is clicked.
			var m_functionProjectItemClick = function () {

				try {

					// Get the project id from this (i.e. what was clicked).
					var strProjectId = $(this).attr("id");

			        // Call the ProjectsDialog's open handler.
			        var exceptionRet = m_pdParent.open(strProjectId);
			        if (exceptionRet) {

			        	throw exceptionRet;
			        }
				} catch (e) {

					errorHelper.show(e.message);
				}
			};

			//////////////////////////////////////
			// Private fields.

			// The owning dialog.
			var m_dialogContext = null;
			// The ProjectsDialog object which owns the "owning dialog".
			var m_pdParent = null;
		};

		return functionHandler;
	} catch (e) {

		alert(e.message);
	}
});
