///////////////////////////////////////
// CodeStatementThrow module.
//
// A throw statement.
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
            var functionRet = function CodeStatementThrow(ceThrow) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.

                    self.throw = new CodeExpressionStub(ceThrow);

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "throw",
                        "throw [throw] ;");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a throw statement.
                    self.clone = function () {

                        // Clone the parameter too.
                        return new self.constructor(self.throw.clone());
                    };

                    // Inner save.  Return constructor parameters.
                    self.innerSave = function () {

                        return [

                            self.throw.save()
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
