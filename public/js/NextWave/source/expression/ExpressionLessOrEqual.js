///////////////////////////////////////
// LessOrEqual expression module.
//
// A less or equal expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "expression/Expression",
    "methodBuilder/CodeExpressionInfix",
    "methodBuilder/CodeExpressionName",
    "methodBuilder/CodeExpressionLiteral"],
    function (prototypes, Expression, CodeExpressionInfix, CodeExpressionName, CodeExpressionLiteral) {

        try {

            // Constructor function.
            var functionRet = function ExpressionLessOrEqual() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "less or equal");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionInfix(
                            new CodeExpressionName("i"), 
                            "<=",
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
