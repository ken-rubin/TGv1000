///////////////////////////////////////
// CodeExpressionInfix module.
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
            var functionRet = function CodeExpressionInfix(ceLHS, strOperator, ceRHS) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.lHS = new CodeExpressionStub(ceLHS);
                    self.operator = strOperator || "+";
                    self.rHS = new CodeExpressionStub(ceRHS);

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "[lHS] " + self.operator + " [rHS]");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a infix expression.
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

                    self.accumulateNameTypes = function (arrayNameTypes) {

                        try {

                            // Loop over each child stub.
                            // for (var i = 0; i < self.children.length; i++) {

                            //     var itemIth = self.children[i];

                            //     // If stub, ...
                            //     if (itemIth.constructor.name === "CodeExpressionStub") {

                            //         // ...and there is a payload (which is not a literal or name...
                            //         if (itemIth.payload &&
                            //             !(itemIth.payload instanceof CodeLiteral) &&
                            //             !(itemIth.payload instanceof CodeName)) {

                            //             // ...recurse.
                            //             var exceptionRet = itemIth.payload.accumulateNameTypes(arrayNameTypes);
                            //             if (exceptionRet) {

                            //                 return exceptionRet;
                            //             }
                            //         } else {

                            //             // else, got one!
                            //             arrayNameTypes.push(itemIth);
                            //         }
                            //     }
                            // }

                            // Dummy:
                            arrayNameTypes.push({
                                name: "Hello",
                                typeName: null
                            });
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
