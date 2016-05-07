///////////////////////////////////////
// Name base module.
//
// Base class for all names.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "manager/ListItem",
    "methodBuilder/CodeExpressionName",
    "methodBuilder/CodeName"],
    function (prototypes, ListItem, CodeExpressionName, CodeName) {

        try {

            // Constructor function.
            var functionRet = function Name(strName) {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from ListItem.
                    self.inherits(ListItem,
                        strName,
                        "name");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionName(new CodeName(strName));
                    };
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
