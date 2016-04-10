///////////////////////////////////////
// TypeTree module.
//
// Gui component responsible for showing 
//      a list of method parameters.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "manager/List"],
    function (prototypes, List) {

        try {

            // Constructor function.
            var functionRet = function TypeTree() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from List.
                    self.inherits(List,
                        true);
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from List.
            functionRet.inheritsFrom(List);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
