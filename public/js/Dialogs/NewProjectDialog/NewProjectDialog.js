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
				} catch (e) {

					errorHelper.show(e);
				}

				var m_functionCreateProject = function () {

					try {

						m_projectName = $("#ProjectName").val() || '';
						m_projectTags = $("#ProjectTags").val() || '';
						m_projectDescription = $("#ProjectDescription").val() || '';

						// Create minimal project based on the new project dialog's fields--or lack thereof.
			    		// { 

			    		// 	version: 1,
			    		// 	id: 1,
			    		// 	name: "Project 1",
			    		// 	resourceId: 0,
			    		// 	description: "This is a project of the emergency broadcast system....",
			    		// 	comics: {

			    		// 		items: [{

			    		// 			id: 1,
			    		// 			name:"default comic",
			    		// 			resourceId: 1,
				    	// 			types: {

				    	// 				items: [{

				    	// 					app: true,
				    	// 					properties: [],
				    	// 					methods: [{ name: "initialize", workspace: "", method: "" }],
				    	// 					events: [],
				    	// 					dependencies: [],
				    	// 					id: 0,
				    	// 					name: "app",
				    	// 					resourceId: 3
				    	// 				}]
				    	// 			}
				    	// 		}]
			    		// 	}
			    		// }
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
							isDirty: true,
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

						// Will 

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
				var m_comicName = '';
				var m_comicTags = '';
			};

			// Return the constructor function as the module object.
			return functionNewProjectDialog;
		} catch (e) {

			errorHelper.show(e);
		}
	});
