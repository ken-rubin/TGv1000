///////////////////////////////////////
// CodeExpressionVar module.
//
// A infix expression.
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
            var functionRet = function CodeExpressionVar(ceLHS, ceRHS) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.lHS = new CodeExpressionStub(ceLHS);
                    self.operator = "=";
                    self.rHS = new CodeExpressionStub(ceRHS);

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "[lHS] " + self.operator + " [rHS]");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of an infix expression.
                    self.clone = function () {

                        return new self.constructor(self.lHS.clone(),
                            strOperator,
                            self.rHS.clone());
                    };

                    // Inner save.  Save constructor parameters.
                    self.innerSave = function () {

                        return [ 

                            self.lHS.save(),
                            {
                                type: "String",
                                value: self.operator
                            },
                            self.rHS.save()
                        ];
                    };

                    self.innerAccumulateNames = function (arrayNames) {

                        try {

                            self.lHS.accumulateNames(arrayNames);

                            return null;

                        } catch (e) {

                            return e;
                        }
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
