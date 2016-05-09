///////////////////////////////////////
// Methods module.
//
// A collection of all a Type's methods.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/type/TypeSection"],
    function (prototypes, settings, Point, Size, Area, TypeSection) {

        try {

            // Constructor function.
        	var functionRet = function Methods(typeOwner, arrayMethods) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from TypeSection.
                    self.inherits(TypeSection,
                        typeOwner,
                        "Methods",
                        "methods",
                        arrayMethods);

                    ///////////////////////////
                    // Public methods.

                    // Generates JavaScript string for the methods.
                    self.generateJavaScript = function () {

                        var strMethods = " ";

                        // If there are method, then build their JavaScript.
                        if (self.parts) {

                            for (var i = 0; i < self.parts.length; i++) {

                                // Extract and build the method.
                                var methodIth = self.parts[i];
                                var strMethod = methodIth.generateJavaScript();

                                // Add it to the result object.
                                strMethods += strMethod;
                            }
                        }

                        strMethods += " ";
                        return strMethods;
                    };

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
