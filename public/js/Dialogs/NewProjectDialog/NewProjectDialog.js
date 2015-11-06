////////////////////////////////////
// NewProjectDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the NewProjectDialog constructor function.
			var functionNewProjectDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function() {

						try {

							m_projectType = null;	// If m_projectType === null then the dialog will display a cool project type chooser.
													// Otherwise, it will display the real New Project Dialog.

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/NewProjectDialog/newProjectDialog"
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
							//
							// There will be buttons for creating different project configurations:
							// (1) 
							BootstrapDialog.show({

								title: "New " + m_projectType + " Project",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Create Project",
					            		cssClass: "btn-primary",
					            		action: function(){

					            			m_functionCreateProject();
					            		}
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
					            draggable: false,
					            onshown: m_functionOnShownDialog
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							$(".tt-selector .btn-default").tooltip();

							// Save the dailog object reference.
							m_dialog = dialogItself;
							m_functionSetImageSrc(0);
							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);
							$("#ProjectName").focus();

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionCreateProject = function () {

						try {

							client.unloadProject(null, true);		// In case one exists. This will ask about saving. And no callback.

							// Create project based on the new project dialog's fields--or lack thereof.
							// Call client to inject it throughout.

							var strProjectName = $("#ProjectName").val().trim();
							var strProjectDescription = $("#ProjectDescription").val().trim();
							var strProjectTags = $("#ProjectTags").val().trim();

							var exceptionRet = client.openProjectFromDB(
								// 1st parameter is 1-5 based on m_projectType: "Game"-1 "Console"-2 "Web Site"-3 "HoloLens"-4 "Mapping"-5
								["Game", "Console", "Web Site", "HoloLens", "Mapping"].indexOf(m_projectType) + 1, 
								function(clProject){	// callback is used to set fields after async fetch of empty-ish project from db.

									clProject.data.name = strProjectName;
									clProject.data.tags = strProjectTags;
									clProject.data.description = strProjectDescription;
									clProject.data.imageId = m_imageId;
									clProject.data.ownedByUserId = parseInt(g_strUserId, 10);
									client.setBrowserTabAndBtns();
								}
							);
							if (exceptionRet) { throw exceptionRet; }

							m_dialog.close();

						} catch (e) {

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

						m_imageId = imageId;
						$("#ProjectImage").attr("src", resourceHelper.toURL("resources", m_imageId, "image"));
					}
				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_imageId = 0;
				var m_projectType = null;
			};

			// Return the constructor function as the module object.
			return functionNewProjectDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
