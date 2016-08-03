///////////////////////////////////////
// Var statement module.
//
// A var statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/statement/Statement",
    "NextWave/source/methodBuilder/CodeVar",
    "NextWave/source/methodBuilder/CodeStatementVar",
    "NextWave/source/methodBuilder/CodeExpressionInfix",
    "NextWave/source/methodBuilder/CodeExpressionVar",
    "NextWave/source/methodBuilder/CodeExpressionName",
    "NextWave/source/methodBuilder/CodeExpressionLiteral"],
    function (prototypes, Statement, CodeVar, CodeStatementVar, CodeExpressionInfix, CodeExpressionVar, CodeExpressionName, CodeExpressionLiteral) {

        try {

            // Constructor function.
            var functionRet = function StatementVar() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Statement.
                    self.inherits(Statement,
                        "var");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        // var strName = "i";
                        // strName = window.manager.getUniqueName(strName);
                        // var csvRet = new CodeStatementVar(
                        //     new CodeExpressionInfix(
                        //         new CodeExpressionName(
                        //             new CodeVar(strName)
                        //         ),
                        //         "=",
                        //         new CodeExpressionLiteral("1")
                        //     )
                        // );

                        // Three varieties to run by Ken:
                        // var csvRet = new CodeStatementVar();
                        // or
                        // var csvRet = new CodeStatementVar(
                        //     new CodeExpressionInfix(
                        //         new CodeExpressionName(),
                        //         "=",
                        //         new CodeExpressionLiteral()
                        //     )
                        // );
                        // or
                        var csvRet = new CodeStatementVar(
                            new CodeExpressionVar(null, null)
                        );

                        csvRet.addNameInDragConsumate = true;
                        // csvRet.consumateName = strName;
                        return csvRet;
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
