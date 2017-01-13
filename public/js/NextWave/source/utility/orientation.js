///////////////////////////////////////
// Orientation module.
//
// "Enum": North, South, East, or West.
//
// Return instance.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes"],
    function (prototypes) {

        try {

            // Constructor function.
        	var functionRet = function Orientation() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // North.
                    self.north = "north";
                    // South.
                    self.south = "south";
                    // East.
                    self.east = "east";
                    // West.
                    self.west = "west";
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return new functionRet();
        } catch (e) {

            alert(e.message);
        }
    });
