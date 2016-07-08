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
            var functionRet = function CodeName(strPayload, bMultiline, bInVarAssignment) {

                try {

                    var self = this;                        // Uber closure.

                    // self.multiline = bMultiline || false;
                    // self.inVarAssignment = bInVarAssignment || false;
                    // Inherit from CodeLiteral.
                    self.inherits(CodeLiteral,
                        strPayload,
                        bMultiline || false,
                        bInVarAssignment || false);

                    ////////////////////////
                    // Public methods.

                    // For statements loaded from the DB, it is sometimes necessary to
                    // set payload's (Edit's) inVarAssignment manually.
                    self.setInVarAssignment = function () {

                        self.inVarAssignment = true;
                        self.payload.inVarAssignment = true;
                    }

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

                            var exceptionRet = null;
                            var strBetterName = localSelf.getText();

                            // We want to generate a unique name only if we're in the assignment of a CodeStatementVar
                            // and, of course, if user changed the name.
                            if ((localSelf.originalName !== strBetterName) && self.payload.inVarAssignment) {

                                strBetterName = window.manager.getUniqueName(localSelf.getText());

                                // Store back in Edit.
                                exceptionRet = localSelf.setText(strBetterName);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }                                

                            // Update.
                            exceptionRet = window.manager.changeName(localSelf.originalName,
                                strBetterName,
                                self.payload.inVarAssignment);   // Propagate thru all statements in current method if a var name was changed.
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // self.payload is an Edit. It (finally) contains the name.
                    self.accumulateNames = function (arrayNames) {

                        try {

                            if (self.payload) {

                                arrayNames.push(self.payload.getText());
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
