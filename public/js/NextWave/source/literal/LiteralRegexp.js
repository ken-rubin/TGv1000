///////////////////////////////////////
// Regexp literal module.
//
// A regexp literal.
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
            var functionRet = function LiteralRegexp() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Literal.
                    self.inherits(Literal,
                        "regexp");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionLiteral(new CodeLiteral("//g"));
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
