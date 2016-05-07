///////////////////////////////////////
// Properties module.
//
// Collection of all a Type's properties.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "utility/settings",
    "utility/Point",
    "utility/Size",
    "utility/Area",
    "type/TypeSection"],
    function (prototypes, settings, Point, Size, Area, TypeSection) {

        try {

            // Constructor function.
            var functionRet = function Properties(arrayProperties) {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from TypeSection.
                    self.inherits(TypeSection,
                        "Properties",
                        "properties",
                        arrayProperties);

                    ///////////////////////////
                    // Public methods.

                    // Save.
                    self.save = function () {

                        var arrayRet = [];

                        // If there are properties, then save them.
                        if (self.parts) {

                            for (var i = 0; i < self.parts.length; i++) {

                                // Extract and save the property.
                                var propertyIth = self.parts[i];
                                var objectProperty = propertyIth.save();

                                // Add it to the result object.
                                arrayRet.push(objectProperty);
                            }
                        }

                        return arrayRet;
                    };
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from TypeSection.
            functionRet.inheritsFrom(TypeSection);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
