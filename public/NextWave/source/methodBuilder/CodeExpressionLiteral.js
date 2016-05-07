///////////////////////////////////////
// CodeExpressionLiteral module.
//
// A literal expression.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "methodBuilder/CodeExpression",
    "methodBuilder/CodeLiteral"],
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

                    // Invoked when the keyboard is clicked whilest this item has focus.
                    self.keyPressed = function (objectReference) {

                        try {

                            // Pass to payload if set.
                            if (self.payload &&
                                $.isFunction(self.payload.keyPressed)) {

                                return self.payload.keyPressed(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the keyboard is depressed whilest this item has focus.
                    self.keyDown = function (objectReference) {

                        try {

                            // Pass to payload if set.
                            if (self.payload &&
                                $.isFunction(self.payload.keyDown)) {

                                return self.payload.keyDown(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the keyboard is let up whilest this item has focus.
                    self.keyUp = function (objectReference) {

                        try {

                            // Pass to payload if set.
                            if (self.payload &&
                                $.isFunction(self.payload.keyUp)) {

                                return self.payload.keyUp(objectReference);
                            }
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
