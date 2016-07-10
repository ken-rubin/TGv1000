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

                    // self.initialization is a CodeExpressionStub holding a CodeExpression-derived class.
                    // For example, for the for statement it is most likely a CodeExpressionInfix,
                    // since it holds something of the form var i = 0;
                    // Call down until we have 'i'.
                    self.innerAccumulateNames = function (arrayNames) {

                        try {

                            return self.initialization.accumulateNames(arrayNames);

                        } catch (e) {

                            return e;
                        }
                    };

                    // Reach down into the Edits for self.condition and self.increment CodeNames
                    // and setProtected(true);
                    // self.condition is a CEStub whose payload is a CEInfix whose lHS is a CEStub whose payload is a CEName whose payload is a CodeName whose payload is an Edit.
                    // self.increment is a CEStub whose payload is a CEPostfix whose lHS is a CEStub whose payload is a CEName whose payload is a CodeName whose payload is an Edit.
                    self.condition.payload.lHS.payload.payload.payload.setProtected(true);
                    self.increment.payload.lHS.payload.payload.payload.setProtected(true);

                    // Statements that are loaded from the DB don't have their CodeName initialized with
                    // inVarAssignment set to true. This will remedy that.
                    self.initialization.payload.lHS.payload.payload.setInVarAssignment();

                    // If self.initialization CodeName Edit.getText() is changed,
                    // call this method to copy it two times to the right.
                    self.copyInitNameToConditionAndIncrement = function () {

                        var strName = self.initialization.payload.lHS.payload.payload.payload.getText();
                        self.condition.payload.lHS.payload.payload.payload.setText(strName);
                        self.increment.payload.lHS.payload.payload.payload.setText(strName);
                    }

                    // If any names to chamge, do so.
                    self.innerChangeName = function (strOriginalName, strNewName) {

                        try {

                            self.changeNameIfMatches(self.initialization.payload.lHS.payload.payload.payload, strOriginalName, strNewName);
                            self.changeNameIfMatches(self.condition.payload.lHS.payload.payload.payload, strOriginalName, strNewName);
                            self.changeNameIfMatches(self.increment.payload.lHS.payload.payload.payload, strOriginalName, strNewName);

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
