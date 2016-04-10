///////////////////////////////////////
// CodeExpressionTernary module.
//
// A ternary expression.
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
            var functionRet = function CodeExpressionTernary(ceCondition, ceThen, ceElse) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.condition = new CodeExpressionStub(ceCondition);
                    self.thenExpression = new CodeExpressionStub(ceThen);
                    self.elseExpression = new CodeExpressionStub(ceElse);

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "( [condition] ? [thenExpression] : [elseExpression] )");
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
