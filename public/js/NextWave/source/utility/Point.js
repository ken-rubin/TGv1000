///////////////////////////////////////
// Point module.
//
// Dimensionless pair of coordinates, 
// composing a Cartesian transformation.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes"],
    function (prototypes) {

        try {

            // Constructor function.
        	var functionRet = function Point(dX, dY) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // X-coordinate.
                    self.x = dX || 0;
                    // Y-coordinate.
                    self.y = dY || 0;

                    ///////////////////////
                    // Public methods.

                    // Make a copy.
                    self.clone = function () {

                        return new Point(self.x, self.y);
                    };                 

                    // Calculate distance between points.
                    self.distance = function (pointTaget) {

                        var dXDelta = self.x - pointTaget.x;
                        var dYDelta = self.y - pointTaget.y;
                        return Math.sqrt((dXDelta * dXDelta) + (dYDelta * dYDelta));
                    };                 
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
