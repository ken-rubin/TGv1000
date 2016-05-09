///////////////////////////////////////
// Property module.
//
// A single property object.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/type/SectionPart",
    "NextWave/source/methodBuilder/CodeExpressionRefinement",
    "NextWave/source/methodBuilder/CodeExpressionName"],
    function (prototypes, SectionPart, CodeExpressionRefinement, CodeExpressionName) {

        try {

            // Constructor function.
            var functionRet = function Property(strName) {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from SectionPart.
                    self.inherits(SectionPart,
                        strName,
                        "property");

                    ////////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionRefinement(
                                new CodeExpressionName("instance"),
                                new CodeExpressionName(self.name)
                            );
                    };

                    // Generates JavaScript string for this property.
                    self.generateJavaScript = function () {

                        var strProperty = " ";

                        strProperty += "self." + self.name + " = null;";

                        strProperty += " ";

                        return strProperty;
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
