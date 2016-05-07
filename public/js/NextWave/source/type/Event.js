///////////////////////////////////////
// Event module.
//
// A single event object.  Inherits from SectionPart.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "type/SectionPart"],
    function (prototypes, SectionPart) {

        try {

            // Constructor function.
            var functionRet = function Event(strName) {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from SectionPart.
                    self.inherits(SectionPart,
                        strName,
                        "event");

                    ////////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionName(self.name);
                    };

                    // Save.
                    self.save = function () {

                        return { name: self.name };
                    };
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from TypeSection.
            functionRet.inheritsFrom(SectionPart);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
