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
    "NextWave/source/utility/attributeHelper",
    "NextWave/source/type/SectionPart",
    "NextWave/source/methodBuilder/CodeExpressionRefinement",
    "NextWave/source/methodBuilder/CodeExpressionName"],
    function (prototypes, attributeHelper, SectionPart, CodeExpressionRefinement, CodeExpressionName) {

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
                    // Object holds data members which are 
                    // not differentiated by this client.
                    self.stowage = {};

                    ////////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionRefinement(
                                new CodeExpressionName("instance"),
                                new CodeExpressionName(self.name)
                            );
                    };

                    // Create this instance.
                    self.create = function (objectProperty) {

                        try {

                            // Save the attributes along with this object.
                            var exceptionRet = attributeHelper.fromJSON(objectProperty,
                                self,
                                ["name"]);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the name.
                            self.name = objectProperty.name;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Virtual name of the method to remove this section.  Override if not satisfied with method.
                    self.removeMethod = function () {

                        return "removeProperty";
                    }

                    // Invoked when the mouse is clicked over this Property.
                    self.click = function (objectReference) {

                        try {

                            // Load new data into method builder.
                            return window.manager.selectProperty(self.owner,
                                self);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Generates JavaScript string for this property.
                    self.generateJavaScript = function () {

                        var strProperty = "\n";

                        strProperty += "    self." + self.name + " = null;";

                        strProperty += "\n";

                        return strProperty;
                    };

                    // Save.
                    self.save = function () {

                        var objectRet = { 

                            name: self.name
                        };

                        // Save the attributes along with this object.
                        var exceptionRet = attributeHelper.toJSON(self,
                            objectRet);
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        return objectRet;
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
