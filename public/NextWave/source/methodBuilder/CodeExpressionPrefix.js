///////////////////////////////////////
// CodeExpressionPrefix module.
//
// A prefix expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "methodBuilder/CodeExpression",
    "methodBuilder/CodeExpressionStub"],
    function (prototypes, CodeExpression, CodeExpressionStub) {

        try {

            // Constructor function.
            var functionRet = function CodeExpressionPrefix(strOperator, ceRHS) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.operator = strOperator || "++";
                    self.rHS = new CodeExpressionStub(ceRHS);

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        self.operator + " [rHS]");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a prefix expression.
                    self.clone = function () {

                        return new self.constructor(strOperator,
                            self.rHS.clone());
                    };

                    // Inner save.  Save constructor parameters.
                    self.innerSave = function () {

                        return [ 

                            {

                                type: "String",
                                value: self.operator
                            },
                            self.rHS.save()
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
