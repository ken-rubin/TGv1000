///////////////////////////////////////
// CodeStatementForIn module.
//
// A for in statement.
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
            var functionRet = function CodeStatementForIn(ceVariable, ceObject, blockStatements) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.variable = new CodeExpressionStub(ceVariable);
                    self.objectName = new CodeExpressionStub(ceObject);
                    self.block = blockStatements || new Block("statements");

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "forIn",
                        "for ( [variable] in [objectName] )");
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
