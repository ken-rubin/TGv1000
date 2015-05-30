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

							var exceptionRet = $("#CreateProjectBtn").click(m_functionCreateProject);
							if (exceptionRet) {

								throw exceptionRet;
							}

							exceptionRet = $("#ProjectImage").click(m_functionChangeProjectImage);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e.message);
						}
					};
				} catch (e) {

					errorHelper.show(e.message);
				}

				var m_functionCreateProject = function () {

					try {

						m_projectName = $("#ProjectName").val();
						m_projectTags = $("#ProjectTags").val();
						m_projectDescription = $("#ProjectDescription")

						// Create minimal project based on the new project dialog's fields.
						var project = 
							{
								projectName: m_projectName,
								projectDescription: m_projectDescription,
								projectTags: m_projectTags,
								projectImageResourceId: m_imageResourceId,
								projectPrice: 0,
								projectIsTemplate: 0,
								comicStrip: {
									comics: [{
										imageResourceId: 1,
										name: m_comicName,
										tags: m_comicTags,
										ordinal: 0,
										typeStrip: {
											types: [{
												app:true,
											}]
										}
									}]
								}
							};






						

						var posting = $.post("/BOL/ResourceBO/SaveProject", 
								{
									userId: client.getTGCookie('userId'),
									userName: client.getTGCookie('userName'),
									projectJson: JSON.stringify(project)
								}, 
								'json');
						posting.done = function (data) {

							if (data.success) {

								client.functionNewProject(data.project);

							} else {

								// !data.success
								throw new Error(new Error(data.message));
							}
						}

					} catch (e) {

						errorHelper.show(e);
					}
				}

				var m_functionChangeProjectImage = function () {

					try {



						return null;

					} catch (e) {

						return e;
					}
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_imageResourceId = null;
				var m_projectName = null;
				var m_projectTags = null;
				var m_projectDescription = null;
			};

			// Return the constructor function as the module object.
			return functionNewProjectDialog;
		} catch (e) {

			errorHelper.show(e.message);
		}
	});
