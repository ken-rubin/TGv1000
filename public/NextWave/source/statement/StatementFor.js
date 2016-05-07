///////////////////////////////////////
// For statement module.
//
// A for statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "statement/Statement",
    "methodBuilder/CodeStatementFor",
    "methodBuilder/CodeExpressionName",
    "methodBuilder/CodeExpressionLiteral",
    "methodBuilder/CodeExpressionInfix",
    "methodBuilder/CodeExpressionPostfix"],
    function (prototypes, Statement, CodeStatementFor, CodeExpressionName, CodeExpressionLiteral, CodeExpressionInfix, CodeExpressionPostfix) {

        try {

            // Constructor function.
            var functionRet = function StatementFor() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Statement.
                    self.inherits(Statement,
                        "for");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeStatementFor(
                                new CodeExpressionInfix(
                                        new CodeExpressionName("i"),
                                        "=",
                                        new CodeExpressionLiteral("0")
                                    ),
                                new CodeExpressionInfix(
                                        new CodeExpressionName("i"),
                                        "<",
                                        new CodeExpressionLiteral("10")
                                    ),
                                new CodeExpressionPostfix(
                                        new CodeExpressionName("i"),
                                        "++"
                                    )
                            );
                    };
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from Statement.
            functionRet.inheritsFrom(Statement);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
