///////////////////////////////////////
// CodeStatementFor module.
//
// A for statement.
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
            var functionRet = function CodeStatementFor(ceInitialization, ceCondition, ceIncrement, blockStatements) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.
                    self.initialization = new CodeExpressionStub(ceInitialization);
                    self.condition = new CodeExpressionStub(ceCondition);
                    self.increment = new CodeExpressionStub(ceIncrement);
                    self.block = blockStatements || new Block("statements");

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "for",
                        "for (var [initialization] ; [condition] ; [increment] )");
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