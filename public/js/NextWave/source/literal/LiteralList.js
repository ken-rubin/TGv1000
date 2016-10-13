///////////////////////////////////////
// LiteralList module.
//
// Gui component responsible for showing 
//      a list of literal objects.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/List",
    "NextWave/source/literal/LiteralArray",
    "NextWave/source/literal/LiteralBoolean",
    "NextWave/source/literal/LiteralInfinity",
    "NextWave/source/literal/LiteralNaN",
    "NextWave/source/literal/LiteralNull",
    "NextWave/source/literal/LiteralNumber",
    "NextWave/source/literal/LiteralObject",
    "NextWave/source/literal/LiteralRegexp",
    "NextWave/source/literal/LiteralString"],
    function (prototypes, List, LiteralArray, LiteralBoolean, LiteralInfinity, LiteralNaN, LiteralNull, LiteralNumber, LiteralObject, LiteralRegexp, LiteralString) {

        try {

            // Constructor function.
            var functionRet = function ExpressionList() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from List.
                    self.inherits(List,
                        true);

                    ///////////////////////
                    // Public methods.

                    // Add literals to collection.
                    self.load = function (objectLiterals) {

                        try {

                            // Add the Literals.
                            var arrayItems = [/*
                                new LiteralArray(),
                                new LiteralBoolean(),
                                new LiteralInfinity(),
                                new LiteralNaN(),
                                new LiteralNull(),
                                new LiteralNumber(),
                                new LiteralObject(),
                                new LiteralRegexp(),
                                new LiteralString()
                                */];

                            // Build each included Literals.
                            for (var i = 0; i < objectLiterals.length; i++) {

                                var strLiteralIth = objectLiterals[i];

                                // Allocate and add.
                                arrayItems.push(eval("new " + strLiteralIth + "();"));
                            }

                            // Add the items.
                            for (var i = 0; i < arrayItems.length; i++) {

                                var exceptionRet = self.addItem(arrayItems[i]);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Save the list of literals.
                    self.save = function () {

                        var arrayItems = [];

                        // Loop over items, save the name of the constructor.
                        for (var i = 0; i < self.items.length; i++) {

                            arrayItems.push(self.items[i].constructor.name);
                        }

                        return arrayItems;
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
