///////////////////////////////////////
// Negate expression module.
//
// A negate expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "expression/Expression",
    "methodBuilder/CodeExpressionPrefix",
    "methodBuilder/CodeExpressionName"],
    function (prototypes, Expression, CodeExpressionPrefix, CodeExpressionName) {

        try {

            // Constructor function.
            var functionRet = function ExpressionNegate() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "negate");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionPrefix(
                                "-",
                                new CodeExpressionName("i")
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
