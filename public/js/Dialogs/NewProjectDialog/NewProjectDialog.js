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

							m_projectType = null;	// If m_projectType === null then the dialog will display a project type chooser (newProjectDialog1).
													// Otherwise, it will display the real New Project Dialog (newProjectDialog2).

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/NewProjectDialog/newProjectDialog1"
								}, 
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionRenderJadeSnippetResponse1).error(errorHelper.show);

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
					var m_functionRenderJadeSnippetResponse1 = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the TypesDialog jade HTML-snippet.

							// Normal users choose a Core project type by clicking on the picture.
							// Privileged users have to click on a Core image (which will highlight it),
							// choose a project type (Normal, Class or Product--as permitted) and then click
							// the primary button or press Enter.

							var buttons = [];
							if (g_profile["can_create_classes"] || g_profile["can_create_classes"]) {

							    buttons = [
					            	{
					            		label: "Continue",
					            		cssClass: "btn-primary",
					            		hotkey: 13,
					            		action: function(){

					            			m_functionContinue();
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
					            ];
					        }

							BootstrapDialog.show({

								title: "Choose Project Type",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            draggable: false,
					            onshown: m_functionOnShownDialog1,
					            buttons: buttons
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog1 = function (dialogItself) {

						try {

							$(".tt-selector").powerTip({
								smartPlacement: true
							});
							$("#GameImage").attr("src", resourceHelper.toURL("images", null, null, "gameProject.png"));
							$("#ConsoleImage").attr("src", resourceHelper.toURL("images", null, null, "consoleProject.png"));
							$("#WebSiteImage").attr("src", resourceHelper.toURL("images", null, null, "websiteProject.png"));
							$("#HoloLensImage").attr("src", resourceHelper.toURL("images", null, null, "hololensProject.png"));
							$("#MappingImage").attr("src", resourceHelper.toURL("images", null, null, "mappingProject.png"));

							$("#GameImage").click(function(){m_functionProjectTypeSelected("Game");});
							$("#ConsoleImage").click(function(){m_functionProjectTypeSelected("Console");});
							$("#WebSiteImage").click(function(){m_functionProjectTypeSelected("Web Site");});
							$("#HoloLensImage").click(function(){m_functionProjectTypeSelected("HoloLens");});
							$("#MappingImage").click(function(){m_functionProjectTypeSelected("Mapping");});

							if (g_profile["can_create_classes"]) {
								$("#PrivilegedUsersDiv").css("display", "block");
								$("#CreateClassesDiv").css("display", "block");
							}

							if (g_profile["can_create_classes"]) {
								$("#PrivilegedUsersDiv").css("display", "block");
								$("#CreateProductsDiv").css("display", "block");
							}

							$(".tt-selector").powerTip({
								smartPlacement: true
							});

							// Save the dailog object reference.
							m_dialog = dialogItself;
							
						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionRenderJadeSnippetResponse2 = function (htmlData) {

						try {

							// Close the Project type selection dialog.
							m_dialog.close();

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
					            		hotkey: 13,
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
					            onshown: m_functionOnShownDialog2
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog2 = function (dialogItself) {

						try {

							$(".tt-selector .btn-default").powerTip({
								smartPlacement: true
							});

							// Save the dailog object reference.
							m_dialog = dialogItself;

							if (g_profile["can_edit_system_types"]) {
								$("#SystemTypeCheckBox").css("display", "block");
							}

							// Set project image.
							var imgSrc;
							switch (m_projectType) {
								case "Game":
									imgSrc = "media/images/gameProject.png";
									break;
								case "Console":
									imgSrc = "media/images/consoleProject.png";
									break;
								case "Web Site":
									imgSrc = "media/images/websiteProject.png";
									break;
								case "HoloLens":
									imgSrc = "media/images/hololensProject.png";
									break;
								case "Mapping":
									imgSrc = "media/images/mappingProject.png";
									break;
								default:
									imgSrc = resourceHelper.toURL("resources", 0, "image");
							}
							$("#ProjectImage").attr("src", imgSrc);

							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);
							$("#ProjectName").focus();
							
						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionContinue = function() {}

					var m_functionProjectTypeSelected = function(strProjectType) {

						try {

							m_projectType = strProjectType;

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/NewProjectDialog/newProjectDialog2"
								}, 
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionRenderJadeSnippetResponse2).error(errorHelper.show);

						} catch (e) {

							errorHelper.show(e);
						}
					}

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
									clProject.data.ownedByUserId = parseInt(g_profile["userId"], 10);
									clProject.data.canEditSystemTypes = $("#cb1").prop("checked");

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
