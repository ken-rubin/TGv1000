////////////////////////////////////
// SaveProjectAsDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

		try {

			// Define the NewProjectDialog constructor function.
			var functionSaveProjectAsDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					// Pass user id,
					self.create = function() {

						try {

							// Show the dialog--load the content from 
							// the TypesDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "Save Project As",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $("<div></div>").load("/saveProjectAsDialog"),
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

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;
							var project = client.getProject().data;

							$("#ProjectName").val(project.name);
							$("#ProjectDescription").val(project.description);
							$("#ProjectTags").val(project.tags);

							$("#SaveProjectBtn").click(m_functionSaveProjectAs);

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					var m_functionSaveProjectAs = function () {

						try {

							exceptionRet = client.saveProjectAs();
							if (exceptionRet) {

								throw exceptionRet;
							}

							m_dialog.close();

						} catch(e) {

							errorHelper.show(e);
						}
					}

				} catch (e) {

					errorHelper.show(e.message);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
			};

			// Return the constructor function as the module object.
			return functionSaveProjectAsDialog;
		} catch (e) {

			errorHelper.show(e.message);
		}
	});
