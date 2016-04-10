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
                    self.innerCreate = function (arrayItems) {

                        try {

                            // Add the Expressions.
                            arrayItems = [
                                new StatementExpression(),
                                new StatementFor(),
                                new StatementForIn(),
                                new StatementWhile(),
                                new StatementIf(),
                                new StatementVar(),
                                new StatementReturn(),
                                new StatementTry(),
                                new StatementThrow(),
                                new StatementBreak(),
                                new StatementContinue(),
                                ];

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
