///////////////////////////////////////
// CodeStatementReturn module.
//
// A return statement.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "methodBuilder/CodeStatement",
    "methodBuilder/CodeExpressionStub"],
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
