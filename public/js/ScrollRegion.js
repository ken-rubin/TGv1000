///////////////////////////////
// ScrollRegion.  A scrollable collection of child elements.
//
// Return constructor function.
//

define(["errorHelper"],
	function (errorHelper) {

		try {

			// Define the scroll region constructor function.
			var functionConstructor = function ScrollRegion() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public mehtods.

					// Method attached this scroll region's instance to the DOM.
					self.attach = function (strId, strButtonSelectorClass) {

						try {

							// Wire strip controllers.
							var leftCookie = null;
							$("#" + strId + " .leftcontroller").on("mouseenter", function () {

								var strTargetSelector = $(this).attr("data-targetselector");
								leftCookie = setInterval(function () {

									var jStrip = $(strTargetSelector);
									jStrip.scrollLeft(jStrip.scrollLeft() - 1);
								}, 1);
							});
							$("#" + strId + " .leftcontroller").on("mouseleave", function () {

								clearInterval(leftCookie);
							});
							var rightCookie = null;
							$("#" + strId + " .rightcontroller").on("mouseenter", function () {

								var strTargetSelector = $(this).attr("data-targetselector");
								rightCookie = setInterval(function () {

									var jStrip = $(strTargetSelector);
									jStrip.scrollLeft(jStrip.scrollLeft() + 1);
								}, 1);
							});
							$("#" + strId + " .rightcontroller").on("mouseleave", function () {

								clearInterval(rightCookie);
							});

							// Wire project item buttons.
							$("." + strButtonSelectorClass).click(function () {

								$("." + strButtonSelectorClass).removeClass("projectsitembuttonhighlight");
								$(this).addClass("projectsitembuttonhighlight");
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

			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});