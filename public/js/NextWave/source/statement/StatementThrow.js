///////////////////////////////////////
// Throw statement module.
//
// A throw statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/statement/Statement",
    "NextWave/source/methodBuilder/CodeStatementThrow",
    "NextWave/source/methodBuilder/CodeExpressionLiteral"],
    function (prototypes, Statement, CodeStatementThrow, CodeExpressionLiteral) {

        try {

            // Constructor function.
            var functionRet = function StatementThrow() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Statement.
                    self.inherits(Statement,
                        "throw");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        // return new CodeStatementThrow(
                        //         new CodeExpressionLiteral("{}")
                        //     );
                        return new CodeStatementThrow(new CodeExpressionLiteral("..."));
                    };
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from Statement.
            functionRet.inheritsFrom(Statement);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
