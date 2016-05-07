///////////////////////////////////////
// Assignment expression module.
//
// An assignment expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "expression/Expression",
    "methodBuilder/CodeExpressionInfix",
    "methodBuilder/CodeExpressionLiteral",
    "methodBuilder/CodeExpressionName"],
    function (prototypes, Expression, CodeExpressionInfix, CodeExpressionLiteral, CodeExpressionName) {

        try {

            // Constructor function.
            var functionRet = function ExpressionAssignment() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "assignment");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionInfix(
                                new CodeExpressionName("i"), 
                                "=",
                                new CodeExpressionLiteral("1")
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
