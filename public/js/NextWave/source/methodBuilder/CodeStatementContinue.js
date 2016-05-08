///////////////////////////////////////
// CodeStatementContinue module.
//
// A continue statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/methodBuilder/CodeStatement",
    "NextWave/source/methodBuilder/CodeExpressionStub"],
    function (prototypes, CodeStatement, CodeExpressionStub) {

        try {

            // Constructor function.
            var functionRet = function CodeStatementContinue() {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "continue",
                        "continue ;");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a continue statement.
                    self.clone = function () {

                        return new self.constructor();
                    };
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from CodeStatement.
            functionRet.inheritsFrom(CodeStatement);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
