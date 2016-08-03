///////////////////////////////////////
// For In statement module.
//
// A for in statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/statement/Statement",
    "NextWave/source/methodBuilder/CodeStatementForIn",
    "NextWave/source/methodBuilder/CodeExpressionName"],
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

                        // return new CodeStatementForIn(new CodeExpressionName("strKey"),
                        //     new CodeExpressionName("objectInstance"));
                        return new CodeStatementForIn();
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
