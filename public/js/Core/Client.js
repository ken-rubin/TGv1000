///////////////////////////////
// Client module runs client state and manages gui/server interaction.
//
// Return constructor function.
//

// Define module and require dependencies.
define(["Core/errorHelper", 
		"Dialogs/NewProjectDialog/NewProjectDialog", 
		"Dialogs/OpenProjectDialog/OpenProjectDialog", 
		"Dialogs/SaveProjectAsDialog/SaveProjectAsDialog", 
		"Dialogs/NewTypeDialog/NewTypeDialog", 
		"Dialogs/TypeSearchDialog/TypeSearchDialog", 
		"Dialogs/ImageDiskDialog/ImageDiskDialog", 
		"Dialogs/ImageURLDialog/ImageURLDialog", 
		"Dialogs/ImageSearchDialog/ImageSearchDialog", 
		"Core/Project",
		"Code/Type"],
	function (errorHelper, 
				NewProjectDialog, 
				OpenProjectDialog,
				SaveProjectAsDialog,
				NewTypeDialog, 
				TypeSearchDialog, 
				ImageDiskDialog, 
				ImageURLDialog, 
				ImageSearchDialog, 
				Project,
				Type) {

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
					self.create = function () {

						try {

							// Save.
							m_iUserId = self.getTGCookie('userId');

							return null;
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

					self.showNewProjectDialog = function () {

						try {

							m_openDialog = new NewProjectDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showOpenProjectDialog = function (functionOK) {

						try {

							// functionOK is an anonymous function in Navbar.js.
							// It will be called with iProjectId if a project is selected.
							// It will call client to fetch and open the project.

							m_openDialog = new OpenProjectDialog();
							var exceptionRet = m_openDialog.create(functionOK);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.openProjectFromDB = function (iProjectId) {

						try {

							var posting = $.post("/BOL/ResourceBO/RetrieveProject", 
								{
									projectId: iProjectId,
									userName: self.getTGCookie("userName")	// for tag elimination
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									m_project = new Project();
									var exceptionRet = m_project.load(data.project);
									if (exceptionRet) {

										return exceptionRet;
									}

									return null;

								} else {

									// !data.success
									return new Error(data.message);
								}
							});

							return null;

						} catch (e) {

							return e;
						}
					}

					self.quickSaveProject = function () {

						try {

							var exceptionRet = m_project.saveToDatabase();
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showSaveProjectDialog = function () {

						try {

							m_openDialog = new SaveProjectAsDialog('save');
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showSaveProjectAsDialog = function () {

						try {

							m_openDialog = new SaveProjectAsDialog('saveAs');
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showNewTypeDialog = function () {

						try {

							m_openDialog = new NewTypeDialog();
							var exceptionRet = m_openDialog.create();
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.showTypeSearchDialog = function (functionOK) {

						try {

							m_openDialog = new TypeSearchDialog();
							var exceptionRet = m_openDialog.create(functionOK);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					self.addTypeToProjectFromDB = function (iTypeId) {

						try {

							var posting = $.post("/BOL/ResourceBO/RetrieveType", 
								{
									typeId: iTypeId,
									userName: self.getTGCookie("userName")	// for tag elimination
								},
								'json');
							posting.done(function(data){

								if (data.success) {

									var type = new Type();
									type.load(data.type);
									return m_project.addType(type);

								} else {

									// !data.success
									return new Error(data.message);
								}
							});

							return null;

						} catch (e) {

							return e;
						}
					}

					self.addTypeToProject = function(type) {

						try {

							return m_project.addType(type);

						} catch (e) {

							return e;
						}
					}

					self.unloadProject = function () {

						// Warn if project is dirty.





						try {

							var exceptionRet = m_project.unload();
							if (exceptionRet) {

								throw exceptionRet;
							}

							m_project = null;

							return null;

						} catch (e) {

							errorHelper.show(e);
						}
					}

					// Open popup--map callbacks to private functions.
					// Upon successfull resolution, call functionOK(resourceId).
					self.showImageDiskDialog = function (bImage, functionOK) {

						try {

							// If image mode, show for images, otherwise, sounds....
							m_openDialog2 = new ImageDiskDialog();
							var exceptionRet = m_openDialog2.create(bImage,
								functionOK);
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
					self.showImageSearchDialog = function (bImage, functionOK) {

						try {

							// If image mode, show for images, otherwise, sounds....
							m_openDialog2 = new ImageSearchDialog();
							var exceptionRet = m_openDialog2.create(bImage,
								functionOK);
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
					self.showImageURLDialog = function (bImage, functionOK) {

						try {

							// If image mode, show for images, otherwise, sounds....
							m_openDialog2 = new ImageURLDialog();
							var exceptionRet = m_openDialog2.create(bImage,
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

					// Helper method removes spaces from input.
					self.removeSpaces = function (strPossiblyWithSpaces) {

						return strPossiblyWithSpaces.replace(/ /g, '');
					};

					// Project methods.
					self.setProjectDirtyBool = function (bVal) {

						if (m_project) {

							m_project.setDirtyBool(bVal);
						}

						// Something happened. Refresh the navbar.
						navbar.enableDisableProjectsMenuItems();
					}

					self.functionNewProject = function (project) {

						try {

				    		// Allocate project.
				    		m_project = new Project();
				    		return m_project.load(project);

						} catch (e) {

							return e;
						}
					};

					self.getProject = function () {

						return m_project;
					};

					self.saveProjectAs = function () {

						try {

							return m_project.saveToDatabase();

						} catch (e) {

							return e;
						}
					}

					self.closeCurrentDialog = function () {

						if (m_openDialog) {

							m_openDialog.closeYourself();
							m_openDialog = null;
						
						} else if (m_openDialog2) {

							m_openDialog2.closeYourself();
							m_openDialog2 = null;
						}
					}

					// Private methods

					// Private variables.
					var m_project = null;
					var m_openDialog = null;

					// This second one is used for the Image Search, Disk and URL dialogs, since they can open over another open dialog.
					var m_openDialog2 = null;

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
