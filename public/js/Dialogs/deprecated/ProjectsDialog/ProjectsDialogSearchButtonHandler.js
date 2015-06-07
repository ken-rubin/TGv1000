//////////////////////////////////////////
// ProjectsDialog search button handler. 
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

						// Wire up the search button.
						$("#InnerSearchButton").off("click");
						$("#InnerSearchButton").on("click", m_functionInnerSearchButtonClick);
					} catch (e) {

						errorHelper.show(e.message);
					}
				};

				//////////////////////////////////////
				// Private methods.

				// Invoked when the request to get the open button snippet returns.
				var m_functionInnerSearchSnippetResponse = function (htmlData) {

					try {

						var exceptionRet = snippetHelper.process({ dialog:m_dialogContext, parent:m_pdParent },
							htmlData,
							"#SearchWell",
							"#ProjectsDialogInnerSearchSnippet");
						if (exceptionRet) {

							throw exceptionRet;
						}
					} catch (e) {

						errorHelper.show(e.message);
					}
				};

				// Invoked when a project item is clicked.
				var m_functionInnerSearchButtonClick = function () {

					try {

						// Get the string from the search input.
						var strSearchString = $("#SearchInput").val();

						// Get the search results.
						$.ajax({

							cache: false,
							data: {

								templateFile: "Dialogs/ProjectsDialog/projectsDialogInnerSearchSnippet",
								businessObject: {

									module: "GUI/Dialogs/ProjectsDialog/ProjectsDialogInnerSearchSnippet",
									method: "process"
								}
							},
							dataType: "HTML",
							method: "POST",
							url: "/renderJadeSnippet"
						}).done(m_functionInnerSearchSnippetResponse).error(errorHelper.show);
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

			errorHelper.show(e.message);
		}
	});
