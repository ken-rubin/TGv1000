﻿///////////////////////////////////////
// LogicalOr expression module.
//
// A logical or expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "expression/Expression",
    "methodBuilder/CodeExpressionInfix",
    "methodBuilder/CodeExpressionName"],
    function (prototypes, Expression, CodeExpressionInfix, CodeExpressionName) {

        try {

            // Constructor function.
            var functionRet = function ExpressionLogicalOr() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "logical or");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionInfix(
                                new CodeExpressionName("i"), 
                                "||",
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
