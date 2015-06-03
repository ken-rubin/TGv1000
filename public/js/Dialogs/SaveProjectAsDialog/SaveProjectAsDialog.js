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
							$("#ProjectImage").click(m_functionChangeProjectImage);
							$("#ProjectName").blur(m_functionNameBlur);
							$("#ProjectDescription").blur(m_functionDescriptionBlur);
							$("#ProjectTags").blur(m_functionTagsBlur);

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					var m_functionNameBlur = function() {

						var txt = $("#ProjectName").val().trim();
						if (txt !== m_projectName) {

							m_projectName = txt;
							client.setProjectDirtyBool(true);
						}
					}

					var m_functionDescriptionBlur = function() {

						var txt = $("#ProjectDescription").val().trim();
						if (txt !== m_projectDescription) {

							m_projectDescription = txt;
							client.setProjectDirtyBool(true);
						}
					}

					var m_functionTagsBlur = function() {

						var txt = $("#ProjectTags").val().trim();
						if (txt !== m_projectTags) {

							m_projectTags = txt;
							client.setProjectDirtyBool(true);
						}
					}

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

					var m_functionChangeProjectImage = function () {

						try {

							// Will eventually do something.

							return null;

						} catch (e) {

							return e;
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
