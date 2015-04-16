/////////////////////////////////////////
// Code allows the user to control the simulation via Blockly.
//
// Return constructor function.

// 
define(["Core/errorHelper"], 
	function (errorHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function Code() {

				try {

					var self = this;			// Uber closure.

					////////////////////////////////
					// Pulbic methods.

					// Attach instance to DOM.
					self.attach = function () {

						try {

							$(window).resize(function () {

								try {

									var iViewportHeight = $(window).height();

									var iProjectItemHeight = $("#typestriprow").height();
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
