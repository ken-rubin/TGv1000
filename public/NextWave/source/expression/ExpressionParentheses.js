///////////////////////////////////////
// Parenthesis expression module.
//
// A parenthesis expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "expression/Expression",
    "methodBuilder/CodeExpressionGroup",
    "methodBuilder/CodeExpressionInfix",
    "methodBuilder/CodeExpressionName"],
    function (prototypes, Expression, CodeExpressionGroup, CodeExpressionInfix, CodeExpressionName) {

        try {

            // Constructor function.
            var functionRet = function ExpressionParenthesis() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "parentheses");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionGroup(
                                new CodeExpressionInfix(
                                        new CodeExpressionName("i"),
                                        "+",
                                        new CodeExpressionName("1")
                                    )
                            );
                    };
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from Expression.
            functionRet.inheritsFrom(Expression);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
