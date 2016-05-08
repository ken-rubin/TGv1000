///////////////////////////////////////
// Increment expression module.
//
// An increment expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/expression/Expression",
    "NextWave/source/methodBuilder/CodeExpressionPostfix",
    "NextWave/source/methodBuilder/CodeExpressionName"],
    function (prototypes, Expression, CodeExpressionPostfix, CodeExpressionName) {

        try {

            // Constructor function.
            var functionRet = function ExpressionIncrement() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "increment");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionPostfix(
                                new CodeExpressionName("i"), 
                                "++"
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
