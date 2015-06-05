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

					self.closeYourself = function() {

						m_dialog.close();
					}

					//////////////////////////////////
					// Private functions.

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;
							m_project = client.getProject();

							$("#ProjectName").val(m_project.data.name);
							$("#ProjectDescription").val(m_project.data.description);
							$("#ProjectTags").val(m_project.data.tags);

							$("#SaveProjectBtn").click(m_functionSaveProjectAs);
							$("#ProjectImage").click(m_functionChangeProjectImage);
							$("#ProjectName").blur(m_functionNameBlur);
							$("#ProjectDescription").blur(m_functionDescriptionBlur);
							$("#ProjectTags").blur(m_functionTagsBlur);

							m_setStateSaveAsBtn();

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					var m_setStateSaveAsBtn = function () {

						var status = m_project.getStatus();
						if (!status.canBeQuickSaved) {
							$("#SaveProjectBtn").addClass("disabled");
						} else {
							$("#SaveProjectBtn").removeClass("disabled");
						}
					}

					var m_functionNameBlur = function() {

						var txt = $("#ProjectName").val().trim();
						if (txt !== m_project.data.name) {

							m_project.data.name = txt;
							client.setProjectDirtyBool(true);
							m_setStateSaveAsBtn();
						}
					}

					var m_functionDescriptionBlur = function() {

						var txt = $("#ProjectDescription").val().trim();
						if (txt !== m_project.data.description) {

							m_project.data.description = txt;
							client.setProjectDirtyBool(true);
							m_setStateSaveAsBtn();
						}
					}

					var m_functionTagsBlur = function() {

						var txt = $("#ProjectTags").val().trim();
						if (txt !== m_project.data.tags) {

							m_project.data.tags = txt;
							client.setProjectDirtyBool(true);
							m_setStateSaveAsBtn();
						}
					}

					var m_functionSaveProjectAs = function () {

						try {

							exceptionRet = client.saveProjectAs();
							if (exceptionRet) {

								throw exceptionRet;
							}

							// m_dialog.close();

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
				var m_project = null;
			};

			// Return the constructor function as the module object.
			return functionSaveProjectAsDialog;

		} catch (e) {

			errorHelper.show(e.message);
		}
	});
