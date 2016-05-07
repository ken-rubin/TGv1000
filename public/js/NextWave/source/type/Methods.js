///////////////////////////////////////
// Methods module.
//
// A collection of all a Type's methods.
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
        	var functionRet = function Methods(arrayMethods) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from TypeSection.
                    self.inherits(TypeSection,
                        "Methods",
                        "methods",
                        arrayMethods);

                    ///////////////////////////
                    // Public methods.

                    // Save.
                    self.save = function () {

                        var arrayRet = [];

                        // If there are methods, then save them.
                        if (self.parts) {

                            for (var i = 0; i < self.parts.length; i++) {

                                // Extract and save the method.
                                var methodIth = self.parts[i];
                                var objectMethod = methodIth.save();

                                // Add it to the result object.
                                arrayRet.push(objectMethod);
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
