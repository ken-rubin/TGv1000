///////////////////////////////////////
// StatementList module.
//
// Gui component responsible for showing 
//      a list of statement objects.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "manager/List",
    "statement/StatementFor",
    "statement/StatementForIn",
    "statement/StatementWhile",
    "statement/StatementIf",
    "statement/StatementReturn",
    "statement/StatementTry",
    "statement/StatementThrow",
    "statement/StatementVar",
    "statement/StatementExpression",
    "statement/StatementBreak",
    "statement/StatementContinue"],
    function (prototypes, List, StatementFor, StatementForIn, StatementWhile, StatementIf, StatementReturn, StatementTry, StatementThrow, StatementVar, StatementExpression, StatementBreak, StatementContinue) {

        try {

            // Constructor function.
            var functionRet = function StatementList() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from List.
                    self.inherits(List,
                        true);

                    ///////////////////////
                    // Public methods.

                    // Add statements to collection.
                    self.load = function (objectStatements) {

                        try {

                            // Add the Expressions.
                            var arrayItems = [/*
                                new StatementBreak(),
                                new StatementContinue(),
                                new StatementExpression(),
                                new StatementFor(),
                                new StatementForIn(),
                                new StatementIf(),
                                new StatementReturn(),
                                new StatementThrow(),
                                new StatementTry(),
                                new StatementVar(),
                                new StatementWhile()
                                */];

                            // Build each included statement.
                            for (var i = 0; i < objectStatements.length; i++) {

                                var statementIth = objectStatements[i];

                                // Allocate and add.
                                arrayItems.push(eval("new " + statementIth + "();"));
                            }

                            // Add the Statements.
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

                    // Save the list of statements.
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
