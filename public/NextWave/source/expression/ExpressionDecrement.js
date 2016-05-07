///////////////////////////////////////
// Decrement expression module.
//
// A decrement expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "expression/Expression",
    "methodBuilder/CodeExpressionPostfix",
    "methodBuilder/CodeExpressionName"],
    function (prototypes, Expression, CodeExpressionPostfix, CodeExpressionName) {
        try {

            // Constructor function.
            var functionRet = function ExpressionDecrement() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "decrement");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionPostfix(
                                new CodeExpressionName("i"), 
                                "--"
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
