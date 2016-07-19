///////////////////////////////////////
// CodeExpressionRefinement module.
//
// A refinement expression.
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
            var functionRet = function CodeExpressionRefinement(ceBase, ceRefinement) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.base = new CodeExpressionStub(ceBase);
                    self.refinement = new CodeExpressionStub(ceRefinement);

                    self.base.onPayloadSet = function() {

                        return null;
                    }

                    // Inherit from CodeExpression.
                    self.inherits(CodeExpression,
                        "[base] . [refinement]");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a refinement expression.
                    self.clone = function () {

                        return new self.constructor(self.base.clone(),
                            self.refinement.clone());
                    };

                    // Inner save.  Save constructor parameters.
                    self.innerSave = function () {

                        return [ 

                            self.base.save(),
                            self.refinement.save()
                        ];
                    };

                    //
                    self.changeMethodName = function (strTypeName, strOriginalMethodName, strNewMethodName) {

                        try {

                            if (self.base.payload.children[0].payload.text === strTypeName
                                && self.refinement.payload.children[0].payload.text === strOriginalMethodName
                            ) {

                                return self.refinement.payload.children[0].payload.setText(strNewMethodName);
                            }

                            return null;

                        } catch (e) {

                            return e;
                        }
                    }

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
