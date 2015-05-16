//////////////////////////////////////////
// ImageSoundDialog search button handler. 
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

						// // Wire buttons.
						// $(".projectItem").off("click");
						// $(".projectItem").on("click", m_functionResourceClick);
						$("#InnerSearchButton").click(m_functionInnerResourceBtnClicked);

					} catch (e) {

						errorHelper.show(e.message);
					}
				};

				//////////////////////////////////////
				// Private methods.

				// Invoked (presumably) after user has entered tags and clicks Search.
				var m_functionInnerResourceBtnClicked = function () {

					// Temporary code. Actual code will go to server to find a tag match ("image" or "sound" will have been added to tagset).
					m_wellMessage("Will display 'no match' error or strip of matching images or sounds.", null);
				}

				var m_wellMessage = function(msg, timeoutAction) {

					try {

						$("#ImageSoundSearchWell").empty();
						$("#ImageSoundSearchWell").append("<p class='text-danger'>" + msg + "</p>");

						if (timeoutAction !== null) {

							setTimeout(timeoutAction.callback, timeoutAction.waittime);
						}

					} catch (e) {

						errorHelper.show(msg);
					}
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

			alert(e.message);
		}
	});
