///////////////////////////////////////
// CodeExpressionLiteral module.
//
// A literal expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "methodBuilder/CodeExpression",
    "methodBuilder/CodeLiteral"],
    function (prototypes, CodeExpression, CodeLiteral) {

        try {

            // Constructor function.
            var functionRet = function CodeExpressionLiteral(clPayload) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.payload = clPayload || new CodeLiteral();

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
