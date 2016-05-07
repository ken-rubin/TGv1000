///////////////////////////////////////
// CodeStatementVar module.
//
// A var statement.
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
