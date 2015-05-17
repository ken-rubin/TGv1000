//////////////////////////////////////////
// ImageSoundDialog new LOCAL FILE button handler. 
//
// Return constructor function.
//

// Define an AMD module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

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

						// // Activate tooltips.
						// $("[data-toggle='tooltip']").tooltip();

						// Wire things up.
					    $("#RetrieveURLButton").click(m_URLHasBeenEntered);

					} catch (e) {

						errorHelper.show(e.message);
					}
				};

				//////////////////////////////////////
				// Private methods.

				var m_URLHasBeenEntered = function() {

					$("#InternetResourceImage").attr("src", $("#URLInput").val().trim());
				}

				//////////////////////////////////////
				// Private fields.

				// The owning dialog.
				var m_dialogContext = null;
				// The ImageSoundDialog object which owns the "owning dialog".
				var m_pdParent = null;
			};

			return functionHandler;
		} catch (e) {

			errorHelper.show(e);
		}
	});
