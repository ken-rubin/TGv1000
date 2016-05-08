/////////////////////////
// Al layer.
//
// Help system avatar.
//
// Return constructor function.

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/manager/Layer",
    "NextWave/source/Al/Al"],
    function (prototypes, settings, Point, Size, Area, Layer, Al) {

        try {

            // Constructor function.
        	var functionRet = function LayerAl() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from base class.
                    self.inherits(Layer);

                    ////////////////////////
                    // Public methods.

                    // Initialze instance.
                    self.create = function () {

                        try {

                            m_a = new Al();

                            var exceptionRet = m_a.create();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the layer.
                    self.render = function (contextRender, iMS) {
                        
                        try {

                            // Turn Al by dTheta.
                            var dTheta = (iMS / 10000) % 2 * Math.PI;

                            // Move Al's starting point in a circle 50 pixels  
                            // in radius from a center point near the far bottom.
                            var dPhi = (iMS / 7000) % 2 * Math.PI;

                            var dHalfWidth = self.extent.width / 2;
                            var dHalfHeight = self.extent.height / 2;
                            var dThirdWidth = self.extent.width / 3;
                            var dThirdHeight = self.extent.height / 3;

                            return m_a.render(contextRender,
                                iMS,
                                new Point(dHalfWidth + dThirdWidth * Math.cos(dPhi),
                                    dHalfHeight + dThirdHeight * Math.sin(2 * dPhi)),
                                dTheta);
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // Define Al.
                    var m_a = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Do function injection.
            functionRet.inheritsFrom(Layer);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
