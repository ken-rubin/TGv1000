///////////////////////////////
// Client module runs client state and manages gui/server interaction.
//
// Return constructor function.
//

// Define module and require dependencies.
define(["Core/errorHelper", 
		"Dialogs/ProjectsDialog/ProjectsDialog", 
		"Dialogs/TypesDialog/TypesDialog", 
		"Dialogs/ImageSoundDialog/ImageSoundDialog", 
		"Core/Project"],
	function (errorHelper, 
				ProjectsDialog, 
				TypesDialog, 
				ImageSoundDialog, 
				Project) {

		try {

			// Define the client constructor function.
			var functionConstructor = function Client() {

				try {

					var self = this;		// Uber closure.

					//////////////////////////////
					// Public properties.

					// Main client state field.
					// Initialize, steadystate, closing.
					self.state = "initialize";

					//////////////////////////////
					// Public methods.

					// Start off the client.
					self.create = function (iUserId) {

						try {

							// Save.
							m_iUserId = iUserId;

							return self.showProjectsDialog();
						} catch (e) {

							return e;
						}
					};

					// Start off the client.
					self.debug = function () {

						try {

							// 
							alert($("#BlocklyIFrame")[0].contentWindow.getMethodString());

							return null;
						} catch (e) {

							return e;
						}
					};

					// Open popup--map callbacks to private functions.
					self.showProjectsDialog = function () {

						try {

							var pd = new ProjectsDialog();
							var exceptionRet = pd.create(m_iUserId,
								m_functionNewProject,
								m_functionOpenProject,
								m_functionCloneProject);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Open popup--map callbacks to private functions.
					self.showTypesDialog = function (functionNewType, functionCloneType) {

						try {

							var td = new TypesDialog();
							var exceptionRet = td.create(functionNewType,
								functionCloneType);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Open popup--map callbacks to private functions.
					// Upon successfull resolution, call functionOK(resourceId).
					self.showImageSoundDialog = function (bImage, functionOK) {

						try {

							// If image mode, show for images, otherwise, sounds....
							var isd = new ImageSoundDialog();
							var exceptionRet = isd.create(bImage,
								functionOK);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					self.navToAdminzone = function() {

						try {

							location.href = "/adminzone"

						} catch (e) {

							return e;
						}
					}

					self.getTGCookie = function (name) {

					    var value = "; " + document.cookie;
					    var parts = value.split("; " + name + "=");
					    if (parts.length == 2) {

					        return parts.pop().split(";").shift();
					    }
					};

					self.getProject = function () {

						return m_project;
					};

					///////////////////////////////
					// Private functions.

					// Invoked when the projects dialog exist newly.
					var m_functionNewProject = function () {

						try {

				    		// Allocate project.
				    		m_project = new Project();
				    		return m_project.load({ 

				    			version: 1,
				    			id: 1,
				    			name: "Project 1",
				    			resourceId: 0,
				    			description: "This is a project of the emergency broadcast system....",
				    			comicStrip: {

				    				items: [{

				    					id: 1,
				    					name:"default comic",
				    					resourceId: 1,
					    				typeStrip: {

					    					items: [{

					    						app: true,
					    						properties: [],
					    						methods: [{ name: "initialize", workspace: "", method: "" }],
					    						events: [],
					    						dependencies: [],
					    						id: 0,
					    						name: "app",
					    						resourceId: 3
					    					}]
					    				}
					    			}]
				    			}
				    		});
						} catch (e) {

							return e;
						}
					};

					// Invoked when the projects dialog exist openly.
					var m_functionOpenProject = function (strId) {

						try {

				    		BootstrapDialog.alert(":Open " + strId + " project....");

							return null;
						} catch (e) {

							return e;
						}
					};

					// Invoked when the projects dialog exist clonely.
					var m_functionCloneProject = function (strId) {

						try {

				    		BootstrapDialog.alert(":Clone " + strId + " project....");

							return null;
						} catch (e) {

							return e;
						}
					};

					/////////////////////////////////
					// Private fields.

					// The current project.
					var m_project = null;

				} catch (e) {

					errorHelper.show(e);
				}
			};

			// Return constructor function.
			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
