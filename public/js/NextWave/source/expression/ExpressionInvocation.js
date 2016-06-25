///////////////////////////////////////
// Invocation expression module.
//
// An invocation expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/expression/Expression",
    "NextWave/source/methodBuilder/CodeExpressionInvocation",
    "NextWave/source/methodBuilder/CodeExpressionRefinement",
    "NextWave/source/methodBuilder/CodeExpressionName",
    "NextWave/source/methodBuilder/ParameterList",
    "NextWave/source/methodBuilder/Parameter"],
    function (prototypes, Expression, CodeExpressionInvocation, CodeExpressionRefinement, CodeExpressionName, ParameterList, Parameter) {

        try {

            // Constructor function.
            var functionRet = function ExpressionInvocation() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Expression.
                    self.inherits(Expression,
                        "invocation");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionInvocation(
                                new CodeExpressionRefinement(
                                        new CodeExpressionName("instance"),
                                        new CodeExpressionName("method")
                                    ),
                                new ParameterList(
                                        [new Parameter("i", "Number")]
                                    )
                            );
                    };
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from Expression.
            functionRet.inheritsFrom(Expression);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
