///////////////////////////////////////
// Delete expression module.
//
// A delete expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "expression/Expression",
    "methodBuilder/CodeExpressionPrefix",
    "methodBuilder/CodeExpressionRefinement",
    "methodBuilder/CodeExpressionName"],
    function (prototypes, Expression, CodeExpressionPrefix, CodeExpressionRefinement, CodeExpressionName) {

        try {

            // Constructor function.
            var functionRet = function ExpressionDelete() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "delete");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionPrefix("delete",
                                new CodeExpressionRefinement(
                                        new CodeExpressionName("instance"),
                                        new CodeExpressionName("property")
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
