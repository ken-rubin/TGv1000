///////////////////////////////////////
// CodeStatementTry module.
//
// A try statement.
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
            var functionRet = function CodeStatementTry(blockTry, blockCatch, blockFinally) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.

                    self.tryBlock = blockTry || new Block("try", "\ntry\n");
                    self.catchBlock = blockCatch || new Block("catch (e)", "\ncatch (e)\n");
                    self.finallyBlock = blockFinally || new Block("finally", "\nfinally\n");

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "try",
                        "try");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a try statement.
                    self.clone = function () {

                        // Clone the parameters too.
                        return new self.constructor(self.tryBlock.clone(),
                            self.catchBlock.clone(),
                            self.finallyBlock.clone());
                    };

                    // Inner save.  Return constructor parameters.
                    self.innerSave = function () {

                        return [

                            self.tryBlock.save(),
                            self.catchBlock.save(),
                            self.finallyBlock.save()
                        ];
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
