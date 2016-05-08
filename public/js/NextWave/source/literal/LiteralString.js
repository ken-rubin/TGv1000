///////////////////////////////////////
// Sting literal module.
//
// A string literal.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/literal/Literal",
    "NextWave/source/methodBuilder/CodeExpressionLiteral",
    "NextWave/source/methodBuilder/CodeLiteral"],
    function (prototypes, Literal, CodeExpressionLiteral, CodeLiteral) {

        try {

            // Constructor function.
            var functionRet = function LiteralString() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Literal.
                    self.inherits(Literal,
                        "string");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionLiteral(new CodeLiteral("\"\""));
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
