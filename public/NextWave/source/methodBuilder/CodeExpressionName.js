///////////////////////////////////////
// CodeExpressionName module.
//
// A literal expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "methodBuilder/CodeExpression",
    "methodBuilder/CodeName"],
    function (prototypes, CodeExpression, CodeName) {

        try {

            // Constructor function.
            var functionRet = function CodeExpressionName(clPayload) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.payload = clPayload || new CodeName();

                    if (self.payload) {

                        self.payload.collection = this;
                    }

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "[payload]");
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
