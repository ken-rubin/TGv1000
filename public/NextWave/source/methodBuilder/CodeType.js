///////////////////////////////////////
// CodeType module.
//
// Type literal.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "methodBuilder/CodeLiteral"],
    function (prototypes, CodeLiteral) {

        try {

            // Constructor function.
            var functionRet = function CodeType(strPayload) {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from CodeLiteral.
                    self.inherits(CodeLiteral,
                        strPayload);
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from CodeExpression.
            functionRet.inheritsFrom(CodeLiteral);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
