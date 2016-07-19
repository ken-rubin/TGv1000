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
    "NextWave/source/type/SectionPart",
    "NextWave/source/methodBuilder/CodeExpressionName"],
    function (prototypes, attributeHelper, SectionPart, CodeExpressionName) {

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
                    // Object holds data members which are 
                    // not differentiated by this client.
                    self.stowage = {};

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

                    // Virtual name of the method to remove this section.  Override if not satisfied with method.
                    self.removeMethod = function () {

                        return "removeEvent";
                    }

                    // Invoked when the mouse is clicked over this Event.
                    self.click = function (objectReference) {

                        try {

                            // Load new data into method builder.
                            return window.manager.selectEvent(self.owner,
                                self);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Generates JavaScript string for this property.
                    self.generateJavaScript = function () {

                        var strEvent = "\n";

                        // if (!window.tg.eventCollection.hasOwnProperty(self.name)) {
                        //
                        //      window.tg.eventCollection[self.name] = [];
                        // }

                        // Add the empty collection of subscribers.
                        strEvent += "    if (!window.tg.eventCollection.hasOwnProperty('" + self.name + "')) {\n\n" +
                            "        window.tg.eventCollection['" + self.name + "'] = []; }\n";

                        strEvent += "\n";

                        return strEvent;
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
