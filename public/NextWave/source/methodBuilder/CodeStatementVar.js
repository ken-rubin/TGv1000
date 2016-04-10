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
