///////////////////////////////////////
// Expression statement module.
//
// A expression statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/statement/Statement",
    "NextWave/source/methodBuilder/CodeStatementExpression",
    "NextWave/source/methodBuilder/CodeExpressionInvocation",
    "NextWave/source/methodBuilder/CodeExpressionRefinement",
    "NextWave/source/methodBuilder/CodeExpressionName",
    "NextWave/source/methodBuilder/ParameterList",
    "NextWave/source/methodBuilder/Parameter"],
    function (prototypes, Statement, CodeStatementExpression, CodeExpressionInvocation, CodeExpressionRefinement, CodeExpressionName, ParameterList, Parameter) {

        try {

            // Constructor function.
            var functionRet = function StatementExpression() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Statement.
                    self.inherits(Statement,
                        "expression");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeStatementExpression(
                                new CodeExpressionInvocation(
                                    new CodeExpressionRefinement(
                                        new CodeExpressionName("instance"),
                                        new CodeExpressionName("method")
                                        ),
                                        new ParameterList(
                                                [
                                                    new Parameter("i", "Number"),
                                                    new Parameter("code", "String")
                                                ]
                                            )
                                    )
                            );
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
