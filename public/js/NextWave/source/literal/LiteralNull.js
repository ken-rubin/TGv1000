///////////////////////////////////////
// Null literal module.
//
// A null literal.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "literal/Literal",
    "methodBuilder/CodeExpressionLiteral",
    "methodBuilder/CodeLiteral"],
    function (prototypes, Literal, CodeExpressionLiteral, CodeLiteral) {

        try {

            // Constructor function.
            var functionRet = function LiteralNull() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Literal.
                    self.inherits(Literal,
                        "null");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionLiteral(new CodeLiteral("null"));
                    };
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from Literal.
            functionRet.inheritsFrom(Literal);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
