///////////////////////////////////////
// TypeTree module.
//
// Gui component responsible for showing 
//      a list of method parameters.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/manager/List"],
    function (prototypes, List) {

        try {

            // Constructor function.
            var functionRet = function TypeTree() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from List.
                    self.inherits(List,
                        true);

                    ////////////////////////
                    // Public methods.

                    // Method adds a new Type.
                    self.addType = function (typeNew) {

                        try {

                            self.items.push(typeNew);
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove type.
                    self.removeType = function (typeRemove) {

                        try {

                            // Find type....
                            for (var i = 0; i < self.items.length; i++) {

                                // If found, remove it.
                                if (self.items[i].name === typeRemove.name) {

                                    self.items.splice(i, 1);
                                    break;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from List.
            functionRet.inheritsFrom(List);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
