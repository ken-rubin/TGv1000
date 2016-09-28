///////////////////////////////////////
// While statement module.
//
// A while statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/statement/Statement",
    "NextWave/source/methodBuilder/CodeStatementWhile",
    "NextWave/source/methodBuilder/CodeExpressionInfix",
    "NextWave/source/methodBuilder/CodeExpressionName",
    "NextWave/source/methodBuilder/CodeExpressionLiteral"],
    function (prototypes, Statement, CodeStatementWhile, CodeExpressionInfix, CodeExpressionName, CodeExpressionLiteral) {

        try {

            // Constructor function.
            var functionRet = function StatementWhile() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Statement.
                    self.inherits(Statement,
                        "while");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        // return new CodeStatementWhile(
                        //         new CodeExpressionInfix(
                                        // new CodeExpressionName("i"),
                                        // "<",
                                        // new CodeExpressionLiteral("10")
                            //         )
                            // );
                        return new CodeStatementWhile(new CodeExpressionLiteral("..."));
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
