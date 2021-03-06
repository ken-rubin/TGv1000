///////////////////////////////////////
// CodeStatementVar module.
//
// A var statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/methodBuilder/CodeStatement",
    "NextWave/source/methodBuilder/CodeExpressionStub"],
    function (prototypes, CodeStatement, CodeExpressionStub) {

        try {

            // Constructor function.
            var functionRet = function CodeStatementVar(ceAssignment) {

                try {

                    var self = this;                        // Uber closure.

                    //////////////////////
                    // Public properties.

                    self.assignment = new CodeExpressionStub(ceAssignment);

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "var",
                        "var [assignment] ;");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a var statement.
                    self.clone = function () {

                        // Clone the parameters too.
                        return new self.constructor(self.assignment.clone());
                    };

                    // Inner save.  Return constructor parameters.
                    self.innerSave = function () {

                        return [

                            self.assignment.save()
                        ];
                    };

                    // self.assignment is of the form var i = 0;
                    // Call down until we have 'i'.
                    // self.assignment is a CodeExpressionStub. It has a payload that is one of the CodeExpressionXxx's.
                    self.innerAccumulateNames = function (arrayNames) {

                        try {

                            return self.assignment.accumulateNames(arrayNames);

                        } catch (e) {

                            return e;
                        }
                    };
                    
                    // If any names to change, do so.
                    // For exmple, if stmt is var i = j + 10;, the i wouldn't be changed
                    // but the j might.
                    // self.innerChangeName = function (strOriginalName, strNewName) {

                    //     try {

                    //         self.xyz = 1;
                            

                    //         return null;

                    //     } catch (e) {

                    //         return e;
                    //     }
                    // };
                    
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
