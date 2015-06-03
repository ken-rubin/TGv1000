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

									var exceptionRet = client.showOpenProjectDialog();
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

									var exceptionRet = client.closeProject();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							// Wire typess buttons.
							$("#NewTypeButton").click(function () {

								try {

									var exceptionRet = client.showNewTypeDialog();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							$("#TypeSearchButton").click(function () {

								try {

									var exceptionRet = client.showTypeSearchDialog();
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

						if (project === null) {

							// New and search are enabled. others are disabled.
							m_functionEnable("NewProject");
							m_functionEnable("OpenProject");
							m_functionDisable("SaveProject");
							m_functionDisable("SaveProjectAs");
							m_functionDisable("QuickSaveProject");
							m_functionDisable("CloseProject");

						} else {

							// Any open project can be closed (with appropriate warning, if warranted.)
							m_functionEnable("CloseProject");

							var status = project.getStatus();

							// inDBAlready: (self.data.id > 0),
							// userOwnsProject: (self.data.createdByUserId === client.getTGCookie('userId')),
							// canBeQuickSaved: (	self.data.name.trim().length > 0 
							// 				&& self.data.tags.trim().length > 0 
							// 				&& self.data.imageResourceId > 0
							// 			),
							// isDirty: self.data.isDirty
							if (status.isDirty) {

								m_functionEnable("SaveProject");
								m_functionEnable("SaveProjectAs");
							}

							if (status.canBeQuickSaved) {

								m_functionEnable("QuickSaveProject");
							}






						}
					}

					// Private methods
					var m_functionEnable = function (part) {

						$("#" + part + "LI").removeClass("disabled");
					}

					var m_functionDisable = function (part) {

						$("#" + part + "LI").addClass("disabled");
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
