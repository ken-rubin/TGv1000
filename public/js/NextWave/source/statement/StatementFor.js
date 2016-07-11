///////////////////////////////////////
// For statement module.
//
// A for statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/statement/Statement",
    "NextWave/source/methodBuilder/CodeVar",
    "NextWave/source/methodBuilder/CodeName",
    "NextWave/source/methodBuilder/CodeStatementFor",
    "NextWave/source/methodBuilder/CodeExpressionName",
    "NextWave/source/methodBuilder/CodeExpressionLiteral",
    "NextWave/source/methodBuilder/CodeExpressionInfix",
    "NextWave/source/methodBuilder/CodeExpressionPostfix"],
    function (prototypes, Statement, CodeVar, CodeName, CodeStatementFor, CodeExpressionName, CodeExpressionLiteral, CodeExpressionInfix, CodeExpressionPostfix) {

        try {

            // Constructor function.
            var functionRet = function StatementFor() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Statement.
                    self.inherits(Statement,
                        "for");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        var strName = "i";
                        strName = window.manager.getUniqueName(strName);
                        var csfRet = new CodeStatementFor(
                            new CodeExpressionInfix(
                                new CodeExpressionName(
                                    new CodeVar(strName)
                                ),
                                "=",
                                new CodeExpressionLiteral("0")
                            ),
                            new CodeExpressionInfix(
                                new CodeExpressionName(
                                    new CodeName(strName)
                                ),
                                "<",
                                new CodeExpressionLiteral("10")
                            ),
                            new CodeExpressionPostfix(
                                new CodeExpressionName(
                                    new CodeName(strName)
                                ),
                                "++"
                            )
                        );

                        csfRet.addNameInDragConsumate = true;
                        csfRet.consumateName = strName;

                        return csfRet;
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
