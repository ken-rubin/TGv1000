///////////////////////////////////////
// Properties module.
//
// Collection of all a Type's properties.
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
            var functionRet = function Properties(typeOwner, arrayProperties) {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from TypeSection.
                    self.inherits(TypeSection,
                        typeOwner, 
                        "Properties",
                        "properties",
                        arrayProperties);

                    ///////////////////////////
                    // Public methods.

                    // Virtual method, defaults to method, override if not desired.
                    self.createMethod = function () {

                        return "createProperty";
                    };

                    // Generates JavaScript string for the properties.
                    self.generateJavaScript = function () {

                        var strProperties = "\n";

                        // If there are properties, then build their JavaScript.
                        if (self.parts) {

                            for (var i = 0; i < self.parts.length; i++) {

                                // Extract and save the property.
                                var propertyIth = self.parts[i];
                                var strProperty = propertyIth.generateJavaScript();

                                // Add it to the result object.
                                strProperties += strProperty + "\n";
                            }
                        }

                        strProperties += "\n";

                        return strProperties;
                    };

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
