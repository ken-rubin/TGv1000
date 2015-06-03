////////////////////////////////////
// NewProjectDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

		try {

			// Define the NewProjectDialog constructor function.
			var functionNewProjectDialog = function () {

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

								title: "New Project",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $("<div></div>").load("/newProjectDialog"),
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
							m_imageResourceId = 0;

							$("#CreateProjectBtn").click(m_functionCreateProject);
							$("#ProjectImage").click(m_functionChangeProjectImage);
							$("#ProjectName").blur(m_functionNameBlur);
							$("#ProjectDescription").blur(m_functionDescriptionBlur);
							$("#ProjectTags").blur(m_functionTagsBlur);

						} catch (e) {

							errorHelper.show(e);
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

					var m_functionCreateProject = function () {

						try {

							m_projectName = $("#ProjectName").val() || '';
							m_projectTags = $("#ProjectTags").val() || '';
							m_projectDescription = $("#ProjectDescription").val() || '';

							// Create minimal project based on the new project dialog's fields--or lack thereof.
							// Call client to inject it throughout.
							var project = 
							{
								name: m_projectName,
								id: 0,
								description: m_projectDescription,
								tags: m_projectTags,
								imageResourceId: m_imageResourceId,
								price: 0,
								isTemplate: 0,
								createdByUserId: client.getTGCookie('userId'),
								isDirty: false,
								comics: {
									items: [{
										imageResourceId: 0,
										id: 0,
										name: 'default',
										tags: '',
										ordinal: 0,
										types: {
											items: [{
												isApp: true,
												id: 0,
												ordinal: 0,
												tags: '',
												properties: [],
												methods: [{ name: "initialize", workspace: "", method: "" }],
												events: [],
												dependencies: [],
												name: "app",
												imageResourceId: 0
											}]
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

					var m_functionChangeProjectImage = function () {

						try {

							// Will eventually do something.

							return null;

						} catch (e) {

							return e;
						}
					}
				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_imageResourceId = null;
				var m_projectName = '';
				var m_projectTags = '';
				var m_projectDescription = '';
				var m_comicName = '';
				var m_comicTags = '';
			};

			// Return the constructor function as the module object.
			return functionNewProjectDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
