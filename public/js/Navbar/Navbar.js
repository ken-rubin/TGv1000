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
					self.create = function () {

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

									client.unloadProject(function() {		// callback is executed if client decided to abandon or if there was no project to begin with.

										var exceptionRet = client.showNewProjectDialog();
										if (exceptionRet) { throw exceptionRet; }
									}, 
									true);	// true means to show the Abandon dlg if applicable.
								} catch (e) {

									errorHelper.show(e);
								}
							});

							$("#OpenProjectButton").click(function () {

								try {

									client.unloadProject(function() {		// callback is executed if client decided to abandon or if there was no project to begin with.

										var exceptionRet = client.showOpenProjectDialog(function (iProjectId) {

											if (iProjectId > 0) {

												exceptionRet = client.openProjectFromDB(iProjectId);
												if (exceptionRet) { throw exceptionRet; }

											} else {

												throw new Error("Invalid project id returned.");
											}
										});
										if (exceptionRet) { throw exceptionRet; }
									},
									true);	// true means to show the Abandon dlg if applicable.
								} catch (e) {

									errorHelper.show(e);
								}
							});

							$("#SaveProjectButton").click(function () {

								try {

									var exceptionRet = client.showSaveProjectDialog();
									if (exceptionRet) { throw exceptionRet; }

								} catch (e) {

									errorHelper.show(e);
								}
							});

							$("#CloseProjectButton").click(function () {

								client.unloadProject(function(){ self.enableDisableProjectsMenuItems(); }, true);
							});

							if (g_profile.can_visit_adminzone) {

								// Show Adminzone button.
								$("#AdminzoneLI").css("display", "block");

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
							}

							// Wire Play button click.
							$("#PlayBtn").click(function () {

								try {

									// Let client handle this.
									var exceptionRet = client.play();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							// Wire Play button click.
							$("#StopBtn").click(function () {

								try {

									// Let client handle this.
									var exceptionRet = client.stop();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							client.setBrowserTabAndBtns();

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
						m_functionDisable("CloseProject");

						if (project !== null) {

							// Any open project can be closed (with appropriate warning, if warranted.)
							m_functionEnable("CloseProject");
							m_functionEnable("SaveProject");
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
