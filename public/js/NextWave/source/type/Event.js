///////////////////////////////////////
// Event module.
//
// A single event object.  Inherits from SectionPart.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/attributeHelper",
    "NextWave/source/type/SectionPart"],
    function (prototypes, attributeHelper, SectionPart) {

        try {

            // Constructor function.
            var functionRet = function Event(typeOwner, strName) {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from SectionPart.
                    self.inherits(SectionPart,
                        strName,
                        "event");

                    // Keep track of the owning Type.
                    self.owner = typeOwner;

                    ////////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionName(self.name);
                    };

                    // Create this instance.
                    self.create = function (objectEvent) {

                        try {

                            // Save the attributes along with this object.
                            var exceptionRet = attributeHelper.fromJSON(objectEvent,
                                self,
                                ["name"]);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Save.
                    self.save = function () {

                        var objectRet = { name: self.name };

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
