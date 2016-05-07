///////////////////////////////////////
// New expression module.
//
// A new expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "expression/Expression",
    "methodBuilder/CodeExpressionPrefix",
    "methodBuilder/CodeExpressionInvocation",
    "methodBuilder/CodeExpressionType"],
    function (prototypes, Expression, CodeExpressionPrefix, CodeExpressionInvocation, CodeExpressionType) {

        try {

            // Constructor function.
            var functionRet = function ExpressionNew() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "new");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionPrefix(
                                "new",
                                new CodeExpressionInvocation(
                                        new CodeExpressionType("Type")
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
