///////////////////////////////////////
// Var statement module.
//
// A var statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "statement/Statement",
    "methodBuilder/CodeName",
    "methodBuilder/CodeStatementVar",
    "methodBuilder/CodeExpressionInfix",
    "methodBuilder/CodeExpressionName",
    "methodBuilder/CodeExpressionLiteral"],
    function (prototypes, Statement, CodeName, CodeStatementVar, CodeExpressionInfix, CodeExpressionName, CodeExpressionLiteral) {

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

                        var strName = "i";
                        strName = window.manager.getUniqueName(strName);
                        var csvRet = new CodeStatementVar(
                            new CodeExpressionInfix(
                                new CodeExpressionName(
                                    new CodeName(
                                        strName
                                    )
                                ),
                                "=",
                                new CodeExpressionLiteral("1")
                            )
                        );
                        csvRet.addNameInDragConsumate = true;
                        csvRet.consumateName = strName;
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
