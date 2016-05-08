///////////////////////////////////////
// LogicalAnd expression module.
//
// A logical and expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/expression/Expression",
    "NextWave/source/methodBuilder/CodeExpressionInfix",
    "NextWave/source/methodBuilder/CodeExpressionName"],
    function (prototypes, Expression, CodeExpressionInfix, CodeExpressionName) {

        try {

            // Constructor function.
            var functionRet = function ExpressionLogicalAnd() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "logical and");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionInfix(
                                new CodeExpressionName("i"), 
                                "&&",
                                new CodeExpressionName("j")
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
