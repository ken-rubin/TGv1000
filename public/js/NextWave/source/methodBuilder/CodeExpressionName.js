///////////////////////////////////////
// CodeExpressionName module.
//
// A literal expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/methodBuilder/CodeExpression",
    "NextWave/source/methodBuilder/CodeName"],
    function (prototypes, CodeExpression, CodeName) {

        try {

            // Constructor function.
            var functionRet = function CodeExpressionName(cnPayload) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.

                    // If payload is a string, then convert
                    // it to a CodeName containing it.
                    if (cnPayload &&
                        typeof cnPayload === "string") {

                        cnPayload = new CodeName(cnPayload);
                    }

                    self.payload = cnPayload || new CodeName();

                    if (self.payload) {

                        self.payload.collection = this;
                    }

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "[payload]");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a name expression.
                    self.clone = function () {

                        return new self.constructor(self.payload.clone());
                    };

                    // self.payload is a CodeName.
                    self.innerAccumulateNames = function(arrayNames) {

                        try {

                            self = this;

                            if (self.payload) {

                                return self.payload.accumulateNames(arrayNames);
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    }

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
