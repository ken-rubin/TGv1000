////////////////////////////////////
// Main
//
// Return null--no module object.
//

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Require the error handler for all functions.
		require(["errorHelper"], function (errorHelper) {

			try {

				// Resize code based on window height.
				$(window).resize(function () {

					try {

						var iViewportHeight = $(window).height();

						var iProjectItemHeight = $("#projectitemsstriprow").height();
						var iNavbarHeight = $(".navbar").height();
						var iBordersAndSpacingPadding = 48;

						$("#BlocklyIFrame").height(iViewportHeight - 
							iProjectItemHeight -
							iNavbarHeight -
							iBordersAndSpacingPadding);
					} catch (e) {

						errorHelper.show(e);
					}
				});

				// Resize code based on window height.
				$(window).resize(function () {

					try {

						var iViewportHeight = $(window).height();

						var iToolStripHeight = $("#toolstriprow").height();
						var iNavbarHeight = $(".navbar").height();
						var iBordersAndSpacingPadding = 48;

						$("#surfacecanvas").height(iViewportHeight - 
							iToolStripHeight -
							iNavbarHeight -
							iBordersAndSpacingPadding);
					} catch (e) {

						errorHelper.show(e);
					}
				});

				$(window).resize();

				// Require a designer and attach to DOM.
				require(["Designer"], function (Designer) {

					try {

						// Allocate and attach the designer.
						var designer = new Designer();
						var exceptionRet = designer.attach("surfacecanvas");
						if (exceptionRet) {

							throw exceptionRet;
						}
					} catch (e) {

						errorHelper.show(e);
					}
				});

				// Require scroll region and attach to DOM in three places.
				require(["ScrollRegion"], function (ScrollRegion) {

					try {

						// Allocate and attach the designers.
						var srProjectItems = new ScrollRegion();
						var exceptionRet = srProjectItems.attach("projectitemsstriprow",
							"projectsitembutton");
						if (exceptionRet) {

							throw exceptionRet;
						}

						var srPaletteItems = new ScrollRegion();
						exceptionRet = srProjectItems.attach("toolstriprow",
							"paletteitem");
						if (exceptionRet) {

							throw exceptionRet;
						}

						var srPaletteItems = new ScrollRegion();
						exceptionRet = srProjectItems.attach("commicstriprow",
							"commicframe");
						if (exceptionRet) {

							throw exceptionRet;
						}
					} catch (e) {

						errorHelper.show(e);
					}
				});

				// Wire theme buttons:
				$("#UnicornButton").click(function () {

					$("body").css("background-image", "url('../media/images/ru.jpg')");
				});
				$("#TechButton").click(function () {

					$("body").css("background-image", "url('../media/images/t.png')");
				});

				// Wire projects button click.
				$("#ProjectsButton").click(function () {

					try {

						// Require the ProjectsDialog module.
						require(["ProjectsDialog"], 
							function (ProjectsDialog) {

								try {

									// Allocate and create (and show) the projects dialog.
									var pd = new ProjectsDialog();
									var exceptionRet = pd.create();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});
					} catch (e) {

						errorHelper.show(e);
					}
				});
			} catch (e) {

				errorHelper.show(e);
			}
		});
	} catch (e) {

		alert(e.message);
	}
});
