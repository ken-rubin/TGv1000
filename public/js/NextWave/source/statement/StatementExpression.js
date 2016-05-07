///////////////////////////////////////
// Expression statement module.
//
// A expression statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "statement/Statement",
    "methodBuilder/CodeStatementExpression",
    "methodBuilder/CodeExpressionInvocation",
    "methodBuilder/CodeExpressionRefinement",
    "methodBuilder/CodeExpressionName"],
    function (prototypes, Statement, CodeStatementExpression, CodeExpressionInvocation, CodeExpressionRefinement, CodeExpressionName) {

        try {

            // Constructor function.
            var functionRet = function StatementExpression() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Statement.
                    self.inherits(Statement,
                        "expression");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeStatementExpression(
                                new CodeExpressionInvocation(
                                    new CodeExpressionRefinement(
                                        new CodeExpressionName("instance"),
                                        new CodeExpressionName("method")
                                        )
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
