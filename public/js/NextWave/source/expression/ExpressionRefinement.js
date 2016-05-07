///////////////////////////////////////
// Refinement expression module.
//
// A refinement expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "expression/Expression",
    "methodBuilder/CodeExpressionRefinement",
    "methodBuilder/CodeExpressionName"],
    function (prototypes, Expression, CodeExpressionRefinement, CodeExpressionName) {

        try {

            // Constructor function.
            var functionRet = function ExpressionRefinement() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "refinement");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionRefinement(
                                new CodeExpressionName("instance"),
                                new CodeExpressionName("method")
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
