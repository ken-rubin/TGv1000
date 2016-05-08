///////////////////////////////////////
// CodeStatementIf module.
//
// An if statement.
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

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a if statement.
                    self.clone = function () {

                        // Clone the parameters too.
                        return new self.constructor(self.condition.clone(), 
                            self.thenBlock.clone(), 
                            self.elseBlock.clone());
                    };

                    // Inner save.  Return constructor parameters.
                    self.innerSave = function () {

                        return [

                            self.condition.save(),
                            self.thenBlock.save(),
                            self.elseBlock.save()
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
