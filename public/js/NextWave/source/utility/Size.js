///////////////////////////////////////
// Size module.
//
// An extent.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes"],
    function (prototypes) {

        try {

            // Constructor function.
        	var functionRet = function Size(dWidth, dHeight) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Width.
                    self.width = dWidth || 0;
                    // Height.
                    self.height = dHeight || 0;

                    ///////////////////////
                    // Public methods.

                    // Make a copy.
                    self.clone = function () {

                        return new Size(self.width, self.height);
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
