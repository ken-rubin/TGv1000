///////////////////////////////////////
// CodeExpressionPostfix module.
//
// A postfix expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "methodBuilder/CodeExpression",
    "methodBuilder/CodeExpressionStub"],
    function (prototypes, CodeExpression, CodeExpressionStub) {

        try {

            // Constructor function.
            var functionRet = function CodeExpressionPostfix(ceLHS, strOperator) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.lHS = new CodeExpressionStub(ceLHS);
                    self.operator = strOperator || "++";

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "[lHS] " + self.operator);
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from CodeExpression.
            functionRet.inheritsFrom(CodeExpression);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
