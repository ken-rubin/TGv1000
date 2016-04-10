///////////////////////////////////////
// CodeStatementTry module.
//
// A try statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "methodBuilder/CodeStatement",
    "methodBuilder/CodeExpressionStub",
    "methodBuilder/Block"],
    function (prototypes, CodeStatement, CodeExpressionStub, Block) {

        try {

            // Constructor function.
            var functionRet = function CodeStatementTry(blockTry, blockCatch, blockFinally) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.

                    self.tryBlock = blockTry || new Block("try");
                    self.catchBlock = blockCatch || new Block("catch (e)");
                    self.finallyBlock = blockFinally || new Block("finally");

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "try",
                        "try");
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from CodeStatement.
            functionRet.inheritsFrom(CodeStatement);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
