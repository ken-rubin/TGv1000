/////////////////////////////////////////
// Navbar wraps code associated with the navbar.
//
// Return constructor function.
//

// Define module.
define(["Core/errorHelper"], 
	function (errorHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function Navbar() {

				try {

					var self = this;			// Uber closure.

					////////////////////////////////
					// Pulbic methods.

					// Create instance to DOM.
					self.create = function (client) {

						try {

							// Wire theme buttons:
							$("#UnicornButton").click(function () {

								$("body").css("background-image", "url('../media/images/ru.jpg')");
							});
							$("#TechButton").click(function () {

								$("body").css("background-image", "url('../media/images/t.png')");
							});

							// Wire projects buttons.
							$("#NewProjectButton").click(function () {

								try {

									var exceptionRet = client.showNewProjectDialog();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							$("#OpenProjectButton").click(function () {

								try {

									var exceptionRet = client.showOpenProjectDialog(function (iProjectId) {

										if (iProjectId > 0) {

											exceptionRet = client.openProjectFromDB(iProjectId);

											if (exceptionRet) {

												throw exceptionRet;
											}
										} else {

											throw new Error("Invalid project id returned.")
										}
									});
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							$("#SaveProjectButton").click(function () {

								try {

									var exceptionRet = client.showSaveProjectDialog();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							$("#QuickSaveProjectButton").click(function () {

								try {

									var exceptionRet = client.quickSaveProject();
									if (exceptionRet) {

										throw exceptionRet;
									}

									errorHelper.show("Project was saved.");

								} catch (e) {

									errorHelper.show(e);
								}
							});

							$("#SaveProjectAsButton").click(function () {

								try {

									var exceptionRet = client.showSaveProjectAsDialog();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							$("#CloseProjectButton").click(function () {

								try {

									var exceptionRet = client.unloadProject();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							// Wire Adminzone button click.
							$("#AdminzoneButton").click(function () {

								try {

									// Switch to Adminzone.
									var exceptionRet = client.navToAdminzone();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							// Wire debug button click.
							$("#DebugButton").click(function () {

								try {

									// Let client handle this.
									var exceptionRet = client.debug();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							client.setProjectDirtyBool(false);

							return null;

						} catch (e) {

							return e;
						}
					};

					// A bunch of functions that enable/disable navbar menu items.
					self.enableDisableProjectsMenuItems = function () {

						var project = client.getProject();

						// New and search are enabled. others are disabled.
						m_functionEnable("NewProject");
						m_functionEnable("OpenProject");
						m_functionDisable("SaveProject");
						m_functionDisable("SaveProjectAs");
						m_functionDisable("QuickSaveProject");
						m_functionDisable("CloseProject");
						m_functionDisable("NewType");
						m_functionDisable("TypeSearch");

						if (project !== null) {

							// Any open project can be closed (with appropriate warning, if warranted.)
							m_functionEnable("CloseProject");

							// Any open project can have types added
							m_functionEnable("NewType");
							m_functionEnable("TypeSearch");

							// See definition of status in Project.js method self.getStatus(). Of course.
							var status = project.getStatus();

							// User's own project or an opened-by-searching project can be saved as--even if not all fields are filled in yet,
							// because Save As allows entering all fields and setting a project image.
							m_functionEnable("SaveProjectAs");

							if (status.isDirty && status.userOwnsProject && status.projectNameIsFilled) {

								// projectNameIsFilled is required, since project name cannot be changed in Save, just Save As.
								m_functionEnable("SaveProject");
								
								if (status.allRequiredFieldsFilled) {

									// Since all fields are filled, one-click "quick" Save is enabled.
									m_functionEnable("QuickSaveProject");
								}
							}
						}
					}

					// Private methods
					var m_functionEnable = function (part) {

						$("#" + part + "LI").removeClass("disabled");
						$("#" + part + "LI").addClass("enabled");
					}

					var m_functionDisable = function (part) {

						$("#" + part + "LI").addClass("disabled");
						$("#" + part + "LI").removeClass("enabled");
					}

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
