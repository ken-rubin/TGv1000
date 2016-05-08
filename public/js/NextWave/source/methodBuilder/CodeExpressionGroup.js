///////////////////////////////////////
// CodeExpressionGroup module.
//
// A group expression.
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
            var functionRet = function CodeExpressionGroup(cePayload) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.payload = new CodeExpressionStub(cePayload);

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "( [payload] )");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a group expression.
                    self.clone = function () {

                        return new self.constructor(self.payload.clone());
                    };

                    // Inner save.  Save constructor parameters.
                    self.innerSave = function () {

                        return [ 

                            self.payload.save()
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
