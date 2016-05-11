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
            var functionRet = function Property(typeOwner, strName) {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from SectionPart.
                    self.inherits(SectionPart,
                        strName,
                        "property");

                    // Keep track of the owning Type.
                    self.owner = typeOwner;

                    ////////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionRefinement(
                                new CodeExpressionName("instance"),
                                new CodeExpressionName(self.name)
                            );
                    };

                    // Virtual name of the method to remove this section.  Overtride if not satisfied with method.
                    self.removeMethod = function () {

                        return "removeProperty";
                    }

                    // Invoked when the mouse is pressed down over this method.
                    self.mouseDown = function (objectReference) {

                        try {

                            return window.manager.switchCenterPanelMode("Property");
                        } catch (e) {

                            return e;
                        }
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
