///////////////////////////////////////
// CodeExpressionLiteral module.
//
// A literal expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/methodBuilder/CodeExpression",
    "NextWave/source/methodBuilder/CodeLiteral"],
    function (prototypes, CodeExpression, CodeLiteral) {

        try {

            // Constructor function.
            var functionRet = function CodeExpressionLiteral(clPayload) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.

                    // If payload is a string, then convert
                    // it to a CodeLiteral containing it.
                    if (clPayload &&
                        typeof clPayload === "string") {

                        clPayload = new CodeLiteral(clPayload);
                    }

                    self.payload = clPayload || new CodeLiteral();

                    if (self.payload) {

                        self.payload.collection = this;
                    }

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "[payload]");

                    // Add to children collection.
                    if (self.children &&
                        self.payload) {

                        self.children.push(self.payload);
                    }

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a literal expression.
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
