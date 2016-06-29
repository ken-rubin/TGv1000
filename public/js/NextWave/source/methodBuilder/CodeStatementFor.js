///////////////////////////////////////
// CodeStatementFor module.
//
// A for statement.
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

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a for statement.
                    self.clone = function () {

                        // Clone the parameters too.
                        return new self.constructor(self.initialization.clone(), 
                            self.condition.clone(), 
                            self.increment.clone(), 
                            self.block.clone());
                    };

                    // Inner save.  Return constructor parameters.
                    self.innerSave = function () {

                        return [

                            self.initialization.save(),
                            self.condition.save(),
                            self.increment.save(),
                            self.block.save()
                        ];
                    };

                    // self.initialization is of the form var i = 0;
                    // Call down until we have 'i'.
                    self.accumulateNameTypes = function (arrayNameTypes) {

                        try {

                            return self.initialization.accumulateNameTypes(arrayNameTypes);

                        } catch (e) {

                            return e;
                        }
                    }

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
