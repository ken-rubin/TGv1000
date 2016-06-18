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
    "NextWave/source/utility/Edit"],
    function (prototypes, CodeStatement, Edit) {

        try {

            // Constructor function.
            var functionRet = function CodeStatementComment(strPayload) {

                try {

                    var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public properties.

                    // Render the main line.
                    self.payload = new Edit(strPayload, true);

                    // Inherit from CodeStatement.
                    self.inherits(CodeStatement,
                        "comment",
                        "/* [payload] */");

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a return statement.
                    self.clone = function () {

                        // Clone the parameter too.
                        return new self.constructor(self.payload.getText());
                    };

                    // Inner save.  Return constructor parameters.
                    self.innerSave = function () {

                        return [{

                            type: "String",
                            value: self.payload.getText()
                        }];
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
