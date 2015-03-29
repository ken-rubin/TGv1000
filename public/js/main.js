////////////////////////////////////
// Main
//

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		$(".paletteitem").click(function () {

			$(".paletteitem").removeClass("projectsitembuttonhighlight");
			$(this).addClass("projectsitembuttonhighlight");
		});

		// Wire project item buttons.
		$(".projectsitembutton").click(function () {

			$(".projectsitembutton").removeClass("projectsitembuttonhighlight");
			$(this).addClass("projectsitembuttonhighlight");
		});

		// Wire project item buttons.
		$(".projectsitembutton").click(function () {

			$(".projectsitembutton").removeClass("projectsitembuttonhighlight");
			$(this).addClass("projectsitembuttonhighlight");
		});

		// Wire strip controllers.
		var leftCookie = null;
		$(".leftcontroller").on("mouseenter", function () {

			var strTargetSelector = $(this).attr("data-targetselector");
			leftCookie = setInterval(function () {

				var jStrip = $(strTargetSelector);
				jStrip.scrollLeft(jStrip.scrollLeft() - 1);
			}, 1);
		});
		$(".leftcontroller").on("mouseleave", function () {

			clearInterval(leftCookie);
		});
		var rightCookie = null;
		$(".rightcontroller").on("mouseenter", function () {

			var strTargetSelector = $(this).attr("data-targetselector");
			rightCookie = setInterval(function () {

				var jStrip = $(strTargetSelector);
				jStrip.scrollLeft(jStrip.scrollLeft() + 1);
			}, 1);
		});
		$(".rightcontroller").on("mouseleave", function () {

			clearInterval(rightCookie);
		});

		// Wire theme buttons:
		$("#UnicornButton").click(function () {

			$("body").css("background-image", "url('../media/images/ru.jpg')");
		});
		$("#TechButton").click(function () {

			$("body").css("background-image", "url('../media/images/t.png')");
		});

		// Wire button click.
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

							alert(e.message);
						}
					});
			} catch (e) {

				alert(e.message);
			}
		});
	} catch (e) {

		alert(e.message);
	}
});
