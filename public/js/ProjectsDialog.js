////////////////////////////////////
// ProjectsDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["snippetHelper"], function (snippetHelper) {

	try {

		// Define the ProjectsDialog constructor function.
		var functionProjectsDialog = function () {

			try {

				var self = this;			// Uber closure.

				//////////////////////////////////
				// Public methods.

				// Create and show Bootstrap dialog.
				self.create = function(iUserId) {

					try {

						// Save user id in private field.
						m_iUserId = iUserId;

						// Show the dialog--load the content from 
						// the projectsDialog jade HTML-snippet.
						BootstrapDialog.show({

							title: "Projects",
							size: BootstrapDialog.SIZE_WIDE,
				            message: $("<div></div>").load("/projectsDialog"),
				            buttons: [{

				                label: "Close",
				                icon: "glyphicon glyphicon-remove-circle",
				                cssClass: "btn-warning",
				                action: function(dialogItself){

				                    dialogItself.close();
				                }
				            }],
				            draggable: true,
				            onshown: m_functionOnShownDialog
				        });
						return null;
					} catch (e) {

						return e;
					}
				};

				//////////////////////////////////
				// Private functions.

				// General error handler.
				var m_functionErrorHandler = function (strError) {

					try {

						// Possibly convert from various objects to string.
						if (strError.responseText) {

							strError = strError.responseText;
						} else if (strError.message) {

							strError = strError.message;
						}

						// Show error.
						alert(strError);
					} catch (e) {

						alert(e.message);
					}
				};

				// Invoked when the new button is clicked.
				var m_functionNewButtonClick = function () {

					try {

	                    m_dialog.close();
	                	BootstrapDialog.alert("Generate new project....");
					} catch (e) {

						m_functionErrorHandler(e.message);
					}
				};

				// Invoked when the request to get the open button snippet returns.
				var m_functionOpenSnippetResponse = function (htmlData) {

					try {

						var exceptionRet = snippetHelper.process(m_dialog,
							htmlData,
							"#TypeWell",
							"#ProjectsDialogOpenSnippet");
						if (exceptionRet) {

							throw exceptionRet;
						}
					} catch (e) {

						m_functionErrorHandler(e.message);
					}
				};

				// Invoked when the open button is clicked.
				var m_functionOpenButtonClick = function () {

					try {

						// Get the user's projects.
						$.ajax({

							cache: false,
							data: { 

								userId: m_iUserId,
								templateFile: "projectsDialogOpenSnippet",
								businessObject: {

									module: "ProjectsDialogOpenSnippet",
									method: "process"
								}
							}, 
							dataType: "HTML",
							method: "POST",
							url: "/renderJadeSnippet"
						}).done(m_functionOpenSnippetResponse).error(m_functionErrorHandler);
					} catch (e) {

						m_functionErrorHandler(e.message);
					}
				};

				// Invoked when the request to get the templates snippet returns.
				var m_functionTemplatesSnippetResponse = function (htmlData) {

					try {

						// Inject result.
						var exceptionRet = snippetHelper.process(m_dialog,
							htmlData,
							"#TypeWell",
							"#ProjectsDialogTemplateSnippet");
						if (exceptionRet) {

							throw exceptionRet;
						}
					} catch (e) {

						m_functionErrorHandler(e.message);
					}
				};

				// Invoked when the templates button is clicked.
				var m_functionTemplatesButtonClick = function () {

					try {

						// Get the user's projects.
						$.ajax({

							cache: false,
							data: {

								templateFile: "projectsDialogTemplatesSnippet",
								businessObject: {

									module: "ProjectsDialogTemplatesSnippet",
									method: "process"
								}
							},
							dataType: "HTML",
							method: "POST",
							url: "/renderJadeSnippet"
						}).done(m_functionTemplatesSnippetResponse).error(m_functionErrorHandler);
					} catch (e) {

						m_functionErrorHandler(e.message);
					}
				};

				// Invoked when the server request 
				// to get the search snippet returns.
				var m_functionSearchSnippetResponse = function (htmlData) {

					try {

						// Inject result.
						var exceptionRet = snippetHelper.process(m_dialog,
							htmlData,
							"#TypeWell",
							"#ProjectsDialogSearchSnippet");
						if (exceptionRet) {

							throw exceptionRet;
						}
					} catch (e) {

						m_functionErrorHandler(e.message);
					}
				};

				// Invoked when the search button is clicked.
				var m_functionSearchButtonClick = function () {

					try {

						// Get the search snippet.
						$.ajax({

							cache: false,
							data: {

								templateFile: "projectsDialogSearchSnippet"
							},
							dataType: "HTML",
							method: "POST",
							url: "/renderJadeSnippet"
						}).done(m_functionSearchSnippetResponse).error(m_functionErrorHandler);
					} catch (e) {

						m_functionErrorHandler(e.message);
					}
				};

				// Wire up event handlers to dialog controls.
				var m_functionOnShownDialog = function (dialogItself) {

					try {

						// Save the dailog object reference.
						m_dialog = dialogItself;

						// Wire click events.
						$("#NewButton").click(m_functionNewButtonClick);
						$("#OpenButton").click(m_functionOpenButtonClick);
						$("#TemplatesButton").click(m_functionTemplatesButtonClick);
						$("#SearchButton").click(m_functionSearchButtonClick);
					} catch (e) {

						m_functionErrorHandler(e.message);
					}
				};
			} catch (e) {

				m_functionErrorHandler(e.message);
			}

			/////////////////////////////////
			// Private fields.

			// Reference to the dialog object instance.
			var m_dialog = null;
			// Signed-in user's UserId.
			var m_iUserId = -1;
		};

		// Return the constructor function as the module object.
		return functionProjectsDialog;
	} catch (e) {

		alert(e.message);
	}
});
