///////////////////////////////////////
// While statement module.
//
// A while statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "statement/Statement",
    "methodBuilder/CodeStatementWhile",
    "methodBuilder/CodeExpressionInfix",
    "methodBuilder/CodeExpressionName",
    "methodBuilder/CodeExpressionLiteral"],
    function (prototypes, Statement, CodeStatementWhile, CodeExpressionInfix, CodeExpressionName, CodeExpressionLiteral) {

        try {

            // Constructor function.
            var functionRet = function StatementWhile() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Statement.
                    self.inherits(Statement,
                        "while");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeStatementWhile(
                                new CodeExpressionInfix(
                                        new CodeExpressionName("i"),
                                        "<",
                                        new CodeExpressionLiteral("10")
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
