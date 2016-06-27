///////////////////////////////////////
// CodeName module.
//
// Name literals.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/methodBuilder/CodeLiteral"],
    function (prototypes, CodeLiteral) {

        try {

            // Constructor function.
            var functionRet = function CodeName(strPayload) {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from CodeLiteral.
                    self.inherits(CodeLiteral,
                        strPayload);

                    ////////////////////////
                    // Public methods.

                    // Save the original name.
                    self.payload.enterFocus = function(localSelf) {

                        try {

                            localSelf.originalName = localSelf.getText();
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Update name.
                    self.payload.exitFocus = function(localSelf) {

                        try {

                            if (localSelf.originalName !== localSelf.getText()) {

                                // Generate unique renamer.
                                var strBetterName = window.manager.getUniqueName(localSelf.getText());

                                // Store back in Edit.
                                var exceptionRet = localSelf.setText(strBetterName);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // Update.
                                exceptionRet = window.manager.changeNameOfNameType(localSelf.originalName,
                                    strBetterName);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
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
            functionRet.inheritsFrom(CodeLiteral);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
