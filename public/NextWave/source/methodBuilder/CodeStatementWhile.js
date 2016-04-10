///////////////////////////////////////
// CodeStatementWhile module.
//
// A while statement.
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
            var functionRet = function CodeStatementWhile(ceCondition, blockStatements) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.condition = new CodeExpressionStub(ceCondition);
                    self.block = blockStatements || new Block("statements");

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "while",
                        "while ( [condition] )");
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
