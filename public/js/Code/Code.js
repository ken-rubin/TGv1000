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
					self.create = function () {

						try {

							// Wire up resize to resize the code window when the browser is.
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

							// Grab a reference to the blockly frame.
		                    m_ifBlockly = document.getElementById("BlocklyIFrame");

		                    // Wire up the change listener.
							m_ifBlockly.contentWindow.setChangeListener(m_functionBlocklyChange);

							return null;
						} catch (e) {

							return e;
						}
					};

					// Load code into frame.
					self.load = function (strCodeDOM) {

						try {

							// Load the specified code DOM string into the blockly frame.
							m_ifBlockly.contentWindow.setWorkspaceString(strCodeDOM);

							return null;
						} catch (e) {

							return e;
						}
					};

					// Save code from frame.
					self.save = function () {

						// Save the specified code DOM string into the blockly frame.
						return m_ifBlockly.contentWindow.getWorkspaceString();
					};

					///////////////////////////////////////
					// Private methods.

					// Method invoked when the blockly frame content changes.
					var m_functionBlocklyChange = function () {

						try {

                            // Get the new workspace and code.
                            var strWorkspace = m_ifBlockly.contentWindow.getWorkspaceString();
                            var strMethod = m_ifBlockly.contentWindow.getMethodString();

                            // Set the new data in the type strip.
                            var exceptionRet = typeStrip.update(strWorkspace,
                            	strMethod);
                            if (exceptionRet) {

                            	throw exceptionRet;
                            }
						} catch (e) {

							errorHelper.show(e);
						}
					};

					///////////////////////////////////////
					// Private fields.

					// Reference to the blockly frame.
					var m_ifBlockly = null;
					// Indicates there is something to save.
					var m_bDirty = false;
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
