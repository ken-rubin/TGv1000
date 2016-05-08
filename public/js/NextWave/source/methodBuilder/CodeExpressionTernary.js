///////////////////////////////////////
// CodeExpressionTernary module.
//
// A ternary expression.
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
            var functionRet = function CodeExpressionTernary(ceCondition, ceThen, ceElse) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.condition = new CodeExpressionStub(ceCondition);
                    self.thenExpression = new CodeExpressionStub(ceThen);
                    self.elseExpression = new CodeExpressionStub(ceElse);

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "( [condition] ? [thenExpression] : [elseExpression] )");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a ternary expression.
                    self.clone = function () {

                        return new self.constructor(self.condition.clone(),
                            self.thenExpression.clone(),
                            self.elseExpression.clone());
                    };

                    // Inner save.  Save constructor parameters.
                    self.innerSave = function () {

                        return [ 

                            self.condition.save(),
                            self.thenExpression.save(),
                            self.elseExpression.save()
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
