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
							BootstrapDialog.show({

								title: "New Project",
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

							// Create minimal project based on the new project dialog's fields--or lack thereof.
							// Call client to inject it throughout.
							var project = 
							{
								name: $("#ProjectName").val() || '',
								id: 0,
								description: $("#ProjectDescription").val() || '',
								tags: $("#ProjectTags").val() || '',
								imageResourceId: m_imageResourceId,
								price: 0,
								createdByUserId: client.getTGCookie('userId'),
								isDirty: $("#ProjectName").val().trim().length > 0 || $("#ProjectDescription").val().trim().length > 0 || $("#ProjectTags").val().trim().length > 0 || m_imageResourceId > 0,
								comics: {
									items: [{
										imageResourceId: 0,
										id: 0,
										name: 'default',
										tags: 'tagComic',
										ordinal: 0,
										types: {
											items: [
												{
													isApp: true,
													id: 0,
													ordinal: 0,
													tags: 'tagType',
													properties: [],
													methods: [{ name: "initialize", workspace: "", method: "" }],
													events: [],
													dependencies: [],
													name: "app",
													imageResourceId: 0
												},
												{
													isApp: false,
													id: 0,
													ordinal: 1,
													tags: 'tagType1',
													properties: [],
													methods: [],
													events: [],
													dependencies: [],
													name: "Type1",
													imageResourceId: 0
												}
											]
										}
									}]
								}
							};

							var exceptionRet = client.functionNewProject(project);
							if (exceptionRet) {

								throw exceptionRet;
							}

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
					var m_functionSetImageSrc = function (imageResourceId) {

						m_imageResourceId = imageResourceId;
						$("#ProjectImage").attr("src", resourceHelper.toURL("resources", m_imageResourceId, "image"));
					}
				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_comicName = '';
				var m_comicTags = '';
				var m_imageResourceId = 0;
			};

			// Return the constructor function as the module object.
			return functionNewProjectDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
