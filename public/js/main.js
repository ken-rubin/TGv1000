////////////////////////////////////
// Main
//

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// canvas.
		var canvas = document.getElementById("surfacecanvas");
		var context = canvas.getContext("2d");
		context.fillStyle = "rgba(0,0,0,1)";
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);

		context.fillStyle = "#333";
		for (var iX = 0; iX < context.canvas.width; iX+=(1024/16)) {

			context.fillRect(iX, 0, 1, context.canvas.height);
		}
		for (var iY = 0; iY < context.canvas.height; iY+=(768/16)) {

			context.fillRect(0, iY, context.canvas.width, 1);
		}
		context.fillStyle = "#ccc";
		for (var i = 0; i < 9; i++) {

			var iDivisor = Math.pow(2, i);
			var iXStep = context.canvas.width / iDivisor;
			var iYStep = context.canvas.height / iDivisor;

			for (var iX = 0; iX < context.canvas.width; iX+=iXStep) {

				context.fillRect(iX, 0, 1, iYStep);
				context.fillRect(context.canvas.width - iX, context.canvas.height, 1, -iYStep);
			}
			for (var iY = 0; iY < context.canvas.height; iY+=iYStep) {

				context.fillRect(0, iY, iXStep, 1);
				context.fillRect(context.canvas.width, context.canvas.height - iY, -iXStep, 1);
			}
		}
		context.fillRect(context.canvas.width, context.canvas.height, -1, -context.canvas.height);
		context.fillRect(context.canvas.width, context.canvas.height, -context.canvas.width, -1);

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
