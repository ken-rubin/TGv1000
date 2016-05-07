///////////////////////////////////////
// Return statement module.
//
// A return statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "statement/Statement",
    "methodBuilder/CodeStatementReturn",
    "methodBuilder/CodeExpressionLiteral"],
    function (prototypes, Statement, CodeStatementReturn, CodeExpressionLiteral) {

        try {

            // Constructor function.
            var functionRet = function StatementReturn() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Statement.
                    self.inherits(Statement,
                        "return");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeStatementReturn(
                                new CodeExpressionLiteral("null")
                            );
                    };
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from Statement.
            functionRet.inheritsFrom(Statement);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
