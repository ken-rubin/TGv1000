///////////////////////////////////////
// For In statement module.
//
// A for in statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "statement/Statement",
    "methodBuilder/CodeStatementForIn",
    "methodBuilder/CodeExpressionName"],
    function (prototypes, Statement, CodeStatementForIn, CodeExpressionName) {

        try {

            // Constructor function.
            var functionRet = function StatementForIn() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from Statement.
                    self.inherits(Statement,
                        "for in");

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeStatementForIn(new CodeExpressionName("strKey"),
                            new CodeExpressionName("objectInstance"));
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
