///////////////////////////////////////
// CodeStatementIf module.
//
// An if statement.
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
            var functionRet = function CodeStatementIf(ceCondition, blockTruthy, blockFalsey) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.

                    self.condition = new CodeExpressionStub(ceCondition);
                    self.thenBlock = blockTruthy || new Block("then");
                    self.elseBlock = blockFalsey || new Block("else");

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "if",
                        "if ( [condition] )");
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