///////////////////////////////////////
// CodeExpressionInvocation module.
//
// A invocation expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "methodBuilder/CodeExpression",
    "methodBuilder/CodeExpressionStub",
    "methodBuilder/ParameterList"],
    function (prototypes, CodeExpression, CodeExpressionStub, ParameterList) {

        try {

            // Constructor function.
            var functionRet = function CodeExpressionInvocation(ceReference, plArguments) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.reference = new CodeExpressionStub(ceReference);
                    self.argumentList = plArguments || new ParameterList();

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "[reference] ( [argumentList] )");
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from CodeExpression.
            functionRet.inheritsFrom(CodeExpression);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
