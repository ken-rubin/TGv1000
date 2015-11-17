////////////////////////////////////
// SaveProjectAsDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the NewProjectDialog constructor function.
			var functionSaveProjectAsDialog = function (saveOrSaveAs) {

				try {

					var self = this;			// Uber closure.
					m_saveOrSaveAs = saveOrSaveAs;

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function() {

						try {

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/SaveProjectAsDialog/saveProjectAsDialog"
								}, 
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionRenderJadeSnippetResponse).error(errorHelper.show);

							return null;
						} catch (e) {

							return e;
						}
					};

					self.closeYourself = function() {

						m_dialog.close();
					}

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the TypesDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: m_saveOrSaveAs === "save" ? "Save Project" : "Save Project As",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		id: "SaveProjectBtn",
					            		label: "Save Project",
					            		cssClass: "btn-primary"
					            	},
					            	{
						                label: "Close",
						                icon: "glyphicon glyphicon-remove-circle",
						                cssClass: "btn-warning",
						                action: function(dialogItself){

						                    dialogItself.close();
						                }
					            	}
					            ],
					            draggable: true,
					            onshown: m_functionOnShownDialog
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							$(".tt-selector .btn-default").powerTip({
								smartPlacement: true
							});

							// Save the dailog object reference.
							m_dialog = dialogItself;
							m_project = client.getProject();

							// Set project image.
							if (m_project.data.altImagePath.length) {

								$("#ProjectImage").attr("src", m_project.data.altImagePath);
							
							} else {

								m_functionSetImageSrc(m_project.data.imageId);
							}
							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);

							$("PlaceForProjectName").empty();

							$("#SaveProjectBtn").click(m_functionSaveProject);

							if (m_saveOrSaveAs === "save") {

								$("#SaveAsH4").append("<span>Change project description or tags and click the <em>Save Project</em> button to save.</span>");
								$("#PlaceForProjectName").append("<span>" + m_project.data.name + "</span>");

							} else {

								$("#SaveAsH4").append("<span>A TechGroms project has a <em>name</em>, an id <em>image</em> and a number of <em>tags</em> that will help you and others (if it's shared) search for it later.</span>");
								$("#PlaceForProjectName").append("<input type='text' class='form-control' id='ProjectName' placeholder='Enter project name.'>");
								$("#ProjectName").blur(m_functionNameBlur);
								$("#ProjectName").val(m_project.data.name);
							}

							$("#ProjectDescription").val(m_project.data.description);
							$("#ProjectTags").val(m_project.data.tags);

							$("#ProjectDescription").blur(m_functionDescriptionBlur);
							$("#ProjectTags").blur(m_functionTagsBlur);

							m_setStateSaveAsBtn();

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					var m_setStateSaveAsBtn = function () {

						var status = m_project.getStatus();
						if (!status.allRequiredFieldsFilled) {
							$("#SaveProjectBtn").addClass("disabled");
						} else {
							$("#SaveProjectBtn").removeClass("disabled");
						}
					}

					var m_functionNameBlur = function() {

						var txt = $("#ProjectName").val().trim();
						if (txt !== m_project.data.name) {

							m_project.data.name = txt;
							client.setBrowserTabAndBtns();
							m_setStateSaveAsBtn();
						}
					}

					var m_functionDescriptionBlur = function() {

						var txt = $("#ProjectDescription").val().trim();
						if (txt !== m_project.data.description) {

							m_project.data.description = txt;
							client.setBrowserTabAndBtns();
							m_setStateSaveAsBtn();
						}
					}

					var m_functionTagsBlur = function() {

						var txt = $("#ProjectTags").val().trim();
						if (txt !== m_project.data.tags) {

							m_project.data.tags = txt;
							client.setBrowserTabAndBtns();
							m_setStateSaveAsBtn();
						}
					}

					var m_functionSaveProject = function () {

						try {

							exceptionRet = client.saveProject(m_saveOrSaveAs);
							if (exceptionRet) { throw exceptionRet; }

							// m_dialog.close();

						} catch(e) {

							errorHelper.show(e);
						}
					}

					// 3 functions to handle the Image changing link clicks.
					var m_functionSearchClick = function () {

						try {

							var exceptionRet = client.showImageSearchDialog(true, m_functionSetImageSrc);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch(e) {

							errorHelper.show(e);
						}
					}
					
					var m_functionURLClick = function () {

						try {

							var exceptionRet = client.showImageURLDialog(true, m_functionSetImageSrc);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch(e) {

							errorHelper.show(e);
						}
					}
					
					var m_functionDiskClick = function () {
						
						try {

							var exceptionRet = client.showImageDiskDialog(true, m_functionSetImageSrc);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch(e) {

							errorHelper.show(e);
						}
					}

					// Display the chosen image.
					var m_functionSetImageSrc = function (imageId) {

						m_project.imageId = imageId;
						m_project.altImagePath = '';
						$("#ProjectImage").attr("src", resourceHelper.toURL("resources", imageId, "image"));
						m_setStateSaveAsBtn();
					}
				} catch (e) {

					errorHelper.show(e.message);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_project = null;
				var m_saveOrSaveAs;
			};

			// Return the constructor function as the module object.
			return functionSaveProjectAsDialog;

		} catch (e) {

			errorHelper.show(e.message);
		}
	});
