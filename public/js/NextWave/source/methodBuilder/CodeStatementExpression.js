///////////////////////////////////////
// CodeStatementExpression module.
//
// An expression statement.
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
            var functionRet = function CodeStatementExpression(cePayload) {

                try {

                    var self = this;                        // Uber closure.

                    //////////////////////
                    // Public properties.

                    self.payload = new CodeExpressionStub(cePayload);

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "expression",
                        "[payload] ;");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a expression statement.
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
