///////////////////////////////////////
// Statement base module.
//
// Base class for all statements.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/ListItem"],
    function (prototypes, ListItem) {

        try {

            // Constructor function.
            var functionRet = function Statement(strName) {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from ListItem.
                    self.inherits(ListItem,
                        strName,
                        "statement");
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from ListItem.
            functionRet.inheritsFrom(ListItem);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
