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
                    // Default the name.
                    self.creator = g_profile["userName"];
                    // Default the date too.
                    self.created = new Date().toString();
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
                                ["name", "creator", "created"]);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the name.
                            self.name = objectProperty.name;
                            // Also load up creator.
                            self.creator = objectProperty.creator;
                            // Also load up created.
                            self.created = objectProperty.created;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Virtual name of the method to remove this section.  Override if not satisfied with method.
                    self.removeMethod = function () {

                        return "removeProperty";
                    }

                    // Invoked when the mouse is clicked over this method.
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

                        var strProperty = " ";

                        strProperty += "self." + self.name + " = null;";

                        strProperty += " ";

                        return strProperty;
                    };

                    // Save.
                    self.save = function () {

                        var objectRet = { 

                            name: self.name,
                            creator: self.creator,
                            created: self.created
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
