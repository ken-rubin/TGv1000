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

						m_projectName = $("#ProjectName").val() || 'no name';
						m_projectTags = $("#ProjectTags").val() || 'enter search tags';
						m_projectDescription = $("#ProjectDescription") || 'no description';

						// Create minimal project based on the new project dialog's fields--or lack thereof.
			    		// { 

			    		// 	version: 1,
			    		// 	id: 1,
			    		// 	name: "Project 1",
			    		// 	resourceId: 0,
			    		// 	description: "This is a project of the emergency broadcast system....",
			    		// 	comicStrip: {

			    		// 		items: [{

			    		// 			id: 1,
			    		// 			name:"default comic",
			    		// 			resourceId: 1,
				    	// 			typeStrip: {

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
							projectName: m_projectName,
							projectId: 0,
							projectDescription: m_projectDescription,
							projectTags: m_projectTags,
							projectImageResourceId: m_imageResourceId,
							projectPrice: 0,
							projectIsTemplate: 0,
							comicStrip: {
								comics: [{
									comicImageResourceId: 0,
									comicId: 0,
									comicName: 'default',
									comicTags: 'a b',
									comicOrdinal: 0,
									typeStrip: {
										types: [{
											typeIsApp: true,
											typeId: 0,
											typeProperties: [],
											typeMethods: [{ methodName: "initialize", methodWorkspace: "", methodMethod: "" }],
											typeEvents: [],
											typeDependencies: [],
											typeName: "app",
											typeImageResourceId: 0
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
