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

							return null;
						} catch (e) {

							return e;
						}
					};
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
