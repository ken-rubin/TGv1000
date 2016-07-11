///////////////////////////////////////
// CodeStatementWhile module.
//
// A while statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/methodBuilder/CodeStatement",
    "NextWave/source/methodBuilder/CodeExpressionStub",
    "NextWave/source/methodBuilder/Block"],
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

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a while statement.
                    self.clone = function () {

                        // Clone the parameters too.
                        return new self.constructor(self.condition.clone(),
                            self.block.clone());
                    };

                    // Inner save.  Return constructor parameters.
                    self.innerSave = function () {

                        return [

                            self.condition.save(),
                            self.block.save()
                        ];
                    };

                    // If any names to chamge, do so.
                    self.innerChangeName = function (strOriginalName, strNewName) {

                        try {

                            self.changeNameIfMatches(self.condition.payload.lHS.payload.payload.payload, strOriginalName, strNewName);
                            // self.block.changeName(strOriginalName, strNewName);

                            return null;

                        } catch (e) {

                            return e;
                        }
                    };

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
