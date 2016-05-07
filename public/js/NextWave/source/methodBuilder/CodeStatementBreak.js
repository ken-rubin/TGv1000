///////////////////////////////////////
// CodeStatementBreak module.
//
// A break statement.
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
            var functionRet = function CodeStatementBreak() {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "break",
                        "break ;");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a break statement.
                    self.clone = function () {

                        return new self.constructor();
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
