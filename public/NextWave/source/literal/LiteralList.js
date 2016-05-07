﻿///////////////////////////////////////
// LiteralList module.
//
// Gui component responsible for showing 
//      a list of literal objects.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "manager/List",
    "literal/LiteralArray",
    "literal/LiteralBoolean",
    "literal/LiteralInfinity",
    "literal/LiteralNaN",
    "literal/LiteralNull",
    "literal/LiteralNumber",
    "literal/LiteralObject",
    "literal/LiteralRegexp",
    "literal/LiteralString"],
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
