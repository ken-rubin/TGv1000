///////////////////////////////////////
// CodeStatementReturn module.
//
// A return statement.
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
            var functionRet = function CodeStatementReturn(cePayload) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.

                    // Render the main line.
                    self.payload = new CodeExpressionStub(cePayload);

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "return",
                        "return [payload] ;");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a return statement.
                    self.clone = function () {

                        // Clone the parameter too.
                        return new self.constructor(self.payload.clone());
                    };

                    // Inner save.  Return constructor parameters.
                    self.innerSave = function () {

                        return [

                            self.payload.save()
                        ];
                    };

                    // If any names to chamge, do so.
                    self.innerChangeName = function (strOriginalName, strNewName) {

                        try {

                            // self = this;

                            

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
