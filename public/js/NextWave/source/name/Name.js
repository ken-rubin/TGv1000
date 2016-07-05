///////////////////////////////////////
// Name base module.
//
// Base class for all names.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/manager/ListItem",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/methodBuilder/CodeExpressionName",
    "NextWave/source/methodBuilder/CodeName"],
    function (prototypes, settings, ListItem, Point, Size, Area, CodeExpressionName, CodeName) {

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

                    // Overridable method to get at name.
                    // This is the default.
                    self.getName = function () {

                        return self.name;
                    };

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
