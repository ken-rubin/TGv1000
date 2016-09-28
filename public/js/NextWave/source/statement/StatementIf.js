///////////////////////////////////////
// If statement module.
//
// An if statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/statement/Statement",
    "NextWave/source/methodBuilder/CodeStatementIf",
    "NextWave/source/methodBuilder/CodeExpressionInfix",
    "NextWave/source/methodBuilder/CodeExpressionName",
    "NextWave/source/methodBuilder/CodeExpressionLiteral"],
    function (prototypes, Statement, CodeStatementIf, CodeExpressionInfix, CodeExpressionName, CodeExpressionLiteral) {

        try {

            // Constructor function.
            var functionRet = function StatementIf() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Statement.
                    self.inherits(Statement,
                        "if");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        // return new CodeStatementIf(
                        //         new CodeExpressionInfix(
                        //                 new CodeExpressionName("i"),
                        //                 "<",
                        //                 new CodeExpressionLiteral("10")
                        //             )
                        //     );
                        return new CodeStatementIf(new CodeExpressionLiteral("..."));
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
