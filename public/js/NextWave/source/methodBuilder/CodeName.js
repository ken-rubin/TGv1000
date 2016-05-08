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

                    // Do nothing in base class.
                    self.afterChange = function() {

                        try {

                            // Ensure the value is unique.
                            self.payload = window.manager.getUniqueName(self.payload);

                            // Update.
                            if (m_strOriginalValue !== self.payload) {

                                return window.manager.editName(m_strOriginalValue,
                                    self.payload);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Do nothing in base class.
                    self.beforeChange = function() {

                        try {

                            m_strOriginalValue = self.payload;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    /////////////////////////
                    // Private methods.

                    var m_strOriginalValue = null;
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
