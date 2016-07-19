///////////////////////////////////////
// CodeExpressionInvocation module.
//
// A invocation expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/methodBuilder/CodeExpression",
    "NextWave/source/methodBuilder/CodeExpressionStub",
    "NextWave/source/methodBuilder/ArgumentList"],
    function (prototypes, CodeExpression, CodeExpressionStub, ArgumentList) {

        try {

            // Constructor function.
            var functionRet = function CodeExpressionInvocation(ceReference, alArguments) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.reference = new CodeExpressionStub(ceReference);
                    self.argumentList = alArguments || new ArgumentList();

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "[reference] ( [argumentList] )");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a invocation expression.
                    self.clone = function () {

                        return new self.constructor(self.reference.clone(),
                            self.argumentList.clone());
                    };

                    // Inner save.  Save constructor parameters.
                    self.innerSave = function () {

                        return [ 

                            self.reference.save(),
                            self.argumentList.save()
                        ];
                    };

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
