///////////////////////////////////////
// LogicalNot expression module.
//
// A logical not expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "expression/Expression",
    "methodBuilder/CodeExpressionPrefix",
    "methodBuilder/CodeExpressionLiteral"],
    function (prototypes, Expression, CodeExpressionPrefix, CodeExpressionLiteral) {

        try {

            // Constructor function.
            var functionRet = function ExpressionLogicalNot() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "logical not");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionPrefix(
                                "!",
                                new CodeExpressionLiteral("i")
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
