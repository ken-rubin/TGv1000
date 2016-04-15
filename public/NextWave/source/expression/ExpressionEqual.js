﻿///////////////////////////////////////
// Equal expression module.
//
// An equal expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "expression/Expression",
    "methodBuilder/CodeExpressionInfix"],
    function (prototypes, Expression, CodeExpressionInfix) {

        try {

            // Constructor function.
            var functionRet = function ExpressionEqual() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "equal");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionInfix(undefined, "===");
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