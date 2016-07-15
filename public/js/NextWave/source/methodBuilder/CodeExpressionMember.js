///////////////////////////////////////
// CodeExpressionMember module.
//
// A literal expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/methodBuilder/CodeExpression",
    "NextWave/source/methodBuilder/CodeMember"],
    function (prototypes, CodeExpression, CodeMember) {

        try {

            // Constructor function.
            var functionRet = function CodeExpressionMember(cnPayload) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.

                    // If payload is a string, then convert
                    // it to a CodeMember containing it.
                    if (cnPayload &&
                        typeof cnPayload === "string") {

                        cnPayload = new CodeMember(cnPayload);
                    }

                    self.payload = cnPayload || new CodeMember();

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

                    // self.payload is a CodeMember.
                    self.innerAccumulateNames = function(arrayNames) {

                        try {

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
