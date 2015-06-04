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
								isTemplate: 0,
								createdByUserId: client.getTGCookie('userId'),
								isDirty: $("#ProjectName").val().trim().length > 0 || $("#ProjectDescription").val().trim().length > 0 || $("#ProjectTags").val().trim().length > 0, // || imageId > 0
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
				var m_imageResourceId = 0;
				var m_comicName = '';
				var m_comicTags = '';
			};

			// Return the constructor function as the module object.
			return functionNewProjectDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
