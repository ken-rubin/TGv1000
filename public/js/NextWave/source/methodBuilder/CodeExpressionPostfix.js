///////////////////////////////////////
// CodeExpressionPostfix module.
//
// A postfix expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/methodBuilder/CodeExpression",
    "NextWave/source/methodBuilder/CodeExpressionStub"],
    function (prototypes, CodeExpression, CodeExpressionStub) {

        try {

            // Constructor function.
            var functionRet = function CodeExpressionPostfix(ceLHS, strOperator) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.lHS = new CodeExpressionStub(ceLHS);
                    self.operator = strOperator || "++";

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "[lHS] " + self.operator);

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a postfix expression.
                    self.clone = function () {

                        return new self.constructor(self.lHS.clone(),
                            strOperator);
                    };

                    // Inner save.  Save constructor parameters.
                    self.innerSave = function () {

                        return [ 

                            self.lHS.save(),
                            {
                                type: "String",
                                value: strOperator
                            }
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
