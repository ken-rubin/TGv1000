///////////////////////////////////////
// LayerNavbar module.
//
// Maintains collection of panels (one of which can be active, e.g. has focus).
// Also responsible for scaling to the display dimension (e.g. responsiveness).
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
        "NextWave/source/utility/settings",
        "NextWave/source/utility/dialogModes",
        "NextWave/source/utility/Area",
        "NextWave/source/utility/Point",
        "NextWave/source/utility/Size",
        "NextWave/source/manager/LayerDialogHost",
        "NextWave/source/utility/Dialog",
		"NextWave/source/utility/List",
		"NextWave/source/utility/ListItem",
		"NextWave/source/utility/PictureListItem",
		"NextWave/source/utility/glyphs",
		"Core/resourceHelper",
		"Core/errorHelper"
        ],
    function(prototypes, settings, dialogModes, Area, Point, Size, LayerDialogHost, Dialog, List, ListItem, PictureListItem, glyphs, resourceHelper, errorHelper) {

        try {

            // Constructor function.
            var functionRet = function LayerNavbar() {

                try {

                    var self = this; // Uber closure.

                    // Inherit from base class.
                    self.inherits(LayerDialogHost,
						"rgba(255,255,255,.01)",		// Required for Layers inheriting LayerDialogHost.
						false							// Tells LayerDialogHost to NOT set objectReference.handled in mouse move.
					);

                    // Initialze instance.
                    self.create = function() {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw {

                                    message: "LayerNavbar: Instance already created!"
                                };
                            }

							let objectConfiguration = {
								smartTooltip: {
									type: "Tooltip",
									text: "",
									font: settings.general.smallBoldFont,
									x: 0,
									y: 0,
									width: 0,
									height: 0
								},
							};
							let exceptionRet = self.dialog.create(objectConfiguration);
                            if (exceptionRet) {
                                return exceptionRet;
                            }

                            // Indicate current state.
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

					// Called by manager after call from PictureListItem, we need to draw a tooltip.
					self.drawSmartTooltip = function(strTooltip, area) {

						try {

							//let strArea = "x: " + area.location.x + "; y: " + area.location.y + "; w: " + area.extent.width + "; h: " + area.extent.height;
							//alert("Tooltip: " + strTooltip + " for item at " + strArea);
							let sTt = self.dialog.controlObject["smartTooltip"];
							if (sTt) {

								sTt.configuration.text = strTooltip;
								sTt.configuration.x = area.location.x + 15;
								sTt.configuration.y = area.location.y - 25;
								sTt.configuration.width = 200;
								sTt.configuration.height = settings.dialog.lineHeight;
							}

							return null;
						} catch(e) {
							return e;
						}
					}


                    //////////////////////////
                    // Private methods.

                    //////////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;

                } catch (e) {

                    alert(e.message);
                }
            };

            // Do function injection.
            functionRet.inheritsFrom(LayerDialogHost);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
