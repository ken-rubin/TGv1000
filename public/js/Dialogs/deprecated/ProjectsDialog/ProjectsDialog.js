////////////////////////////////////
// ProjectsDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

		try {

			// Define the ProjectsDialog constructor function.
			var functionProjectsDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					// Pass user id,
					// New callback -- void.
					// Open callback -- takes strId.
					// Clone callback -- takes strId.
					self.create = function(iUserId,
						callbackNew,
						callbackOpen,
						callbackClone) {

						try {

							// Save user id in private field.
							m_iUserId = iUserId;
							m_callbackNew = callbackNew;
							m_callbackOpen = callbackOpen;
							m_callbackClone = callbackClone;

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

					// Expose new event.
					self.new = function () {

						try {


							// Dismiss the dialog.
					        m_dialog.close();

					        // Call the callback.
					        if ($.isFunction(m_callbackNew)) {

					        	return m_callbackNew();
					        }

					    	return null;
						} catch (e) {

							return e;
						}
					}

					// Expose open event.
					// Takes the id of the project to open.
					self.open = function (strId) {

						try {

							// Dismiss the dialog.
					        m_dialog.close();

					        // Call the callback.
					        if ($.isFunction(m_callbackOpen)) {

					        	return m_callbackOpen(strId);
					        }
					    	return null;
						} catch (e) {

							return e;
						}
					}

					// Expose clone event.
					// Takes the id of the project to clone.
					self.clone = function (strId) {

						try {

							// Dismiss the dialog.
					        m_dialog.close();

					        // Call the callback.
					        if ($.isFunction(m_callbackClone)) {

					        	return m_callbackClone(strId);
					        }

					        return null;
						} catch (e) {

							return e;
						}
					}

					//////////////////////////////////
					// Private functions.

					// Invoked when the new button is clicked.
					var m_functionNewButtonClick = function () {

						try {

					        // Call this object's new handler.
					        var exceptionRet = self.new();
					        if (exceptionRet) {

					        	throw exceptionRet;
					        }
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when the request to get the open button snippet returns.
					var m_functionOpenSnippetResponse = function (htmlData) {

						try {

							var exceptionRet = snippetHelper.process({ dialog:m_dialog, parent:self },
								htmlData,
								"#TypeWell",
								"#ProjectsDialogOpenSnippet");
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e.message);
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
									templateFile: "Dialogs/ProjectsDialog/projectsDialogOpenSnippet",
									businessObject: {

										module: "GUI/Dialogs/ProjectsDialog/ProjectsDialogOpenSnippet",
										method: "process"
									}
								}, 
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionOpenSnippetResponse).error(errorHelper.show);
						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Invoked when the request to get the templates snippet returns.
					var m_functionTemplatesSnippetResponse = function (htmlData) {

						try {

							// Inject result.
							var exceptionRet = snippetHelper.process({ dialog:m_dialog, parent:self },
								htmlData,
								"#TypeWell",
								"#ProjectsDialogTemplateSnippet");
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Invoked when the templates button is clicked.
					var m_functionTemplatesButtonClick = function () {

						try {

							// Get the user's projects.
							$.ajax({

								cache: false,
								data: {

									templateFile: "Dialogs/ProjectsDialog/projectsDialogTemplatesSnippet",
									businessObject: {

										module: "GUI/Dialogs/ProjectsDialog/ProjectsDialogTemplatesSnippet",
										method: "process"
									}
								},
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionTemplatesSnippetResponse).error(errorHelper.show);
						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Invoked when the server request 
					// to get the search snippet returns.
					var m_functionSearchSnippetResponse = function (htmlData) {

						try {

							// Inject result.
							var exceptionRet = snippetHelper.process({ dialog:m_dialog, parent:self },
								htmlData,
								"#TypeWell",
								"#ProjectsDialogSearchSnippet");
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Invoked when the search button is clicked.
					var m_functionSearchButtonClick = function () {

						try {

							// Get the search snippet.
							$.ajax({

								cache: false,
								data: {

									templateFile: "Dialogs/ProjectsDialog/projectsDialogSearchSnippet"
								},
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionSearchSnippetResponse).error(errorHelper.show);
						} catch (e) {

							errorHelper.show(e.message);
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

							errorHelper.show(e.message);
						}
					};
				} catch (e) {

					errorHelper.show(e.message);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				// Signed-in user's UserId.
				var m_iUserId = -1;
				// Invoked when the dialog is dismissed for a new project.
				var m_callbackNew = null;
				// Invoked when the dialog is dismissed for a open project.
				var m_callbackOpen = null;
				// Invoked when the dialog is dismissed for a clone project.
				var m_callbackClone = null;
			};

			// Return the constructor function as the module object.
			return functionProjectsDialog;
		} catch (e) {

			errorHelper.show(e.message);
		}
	});
