///////////////////////////////////////
// Method module.
//
// A single method object.  Inherits from SectionPart.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/type/SectionPart",

    "NextWave/source/methodBuilder/Block",
    "NextWave/source/methodBuilder/CodeExpressionGroup",
    "NextWave/source/methodBuilder/CodeExpressionInfix",
    "NextWave/source/methodBuilder/CodeExpressionInvocation",
    "NextWave/source/methodBuilder/CodeExpressionLiteral",
    "NextWave/source/methodBuilder/CodeExpressionName",
    "NextWave/source/methodBuilder/CodeExpressionPostfix",
    "NextWave/source/methodBuilder/CodeExpressionPrefix",
    "NextWave/source/methodBuilder/CodeExpressionRefinement",
    "NextWave/source/methodBuilder/CodeExpressionTernary",

    "NextWave/source/methodBuilder/CodeLiteral",
    "NextWave/source/methodBuilder/CodeName",

    "NextWave/source/methodBuilder/CodeStatementBreak",
    "NextWave/source/methodBuilder/CodeStatementContinue",
    "NextWave/source/methodBuilder/CodeStatementExpression",
    "NextWave/source/methodBuilder/CodeStatementFor",
    "NextWave/source/methodBuilder/CodeStatementForIn",
    "NextWave/source/methodBuilder/CodeStatementIf",
    "NextWave/source/methodBuilder/CodeStatementReturn",
    "NextWave/source/methodBuilder/CodeStatementThrow",
    "NextWave/source/methodBuilder/CodeStatementTry",
    "NextWave/source/methodBuilder/CodeStatementVar",
    "NextWave/source/methodBuilder/CodeStatementWhile",

    "NextWave/source/methodBuilder/CodeType",

    "NextWave/source/methodBuilder/Parameter",
    "NextWave/source/methodBuilder/ParameterList",

    "NextWave/source/methodBuilder/StatementList"],
    function (prototypes, SectionPart, Block, CodeExpressionGroup, CodeExpressionInfix, CodeExpressionInvocation, CodeExpressionLiteral, CodeExpressionName, CodeExpressionPostfix, CodeExpressionPrefix, CodeExpressionRefinement, CodeExpressionTernary, CodeLiteral, CodeName, CodeStatementBreak, CodeStatementContinue, CodeStatementExpression, CodeStatementFor, CodeStatementForIn, CodeStatementIf, CodeStatementReturn, CodeStatementThrow, CodeStatementTry, CodeStatementVar, CodeStatementWhile, CodeType, Parameter, ParameterList, StatementList) {

        try {

            // Constructor function.
        	var functionRet = function Method(typeOwner, strName, plMethod, slMethod) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from SectionPart.
                    self.inherits(SectionPart,
                        strName,
                        "method");

                    ////////////////////////////
                    // Public fields.

                    // Keep track of the owning Type.
                    self.owner = typeOwner;
                    // List of parameters associated with this method.
                    self.parameters = plMethod || new ParameterList();
                    // List of statement associated with this method.
                    self.statements = slMethod || new StatementList();

                    ////////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return new CodeExpressionInvocation(
                                new CodeExpressionRefinement(
                                        new CodeExpressionName("instance"),
                                        new CodeExpressionName(self.name)
                                    )
                            );
                    };

                    // Invoked when the mouse is clicked over this method.
                    self.click = function (objectReference) {

                        try {

                            // Load new data into method builder.
                            return window.manager.setContext(self.owner,
                                self.name);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Create this instance.
                    self.create = function (objectMethod) {

                        try {

                            // Three bits of data.
                            var arrayParameters = objectMethod.arguments;
                            var arrayStatements = objectMethod.statements;

                            // Set parameters.
                            for (var i = 0; i < arrayParameters.length; i++) {

                                var objectParameterIth = arrayParameters[i];
                                var parameterNew = new Parameter(objectParameterIth.name);
                                var exceptionRet = self.parameters.addItem(parameterNew);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Set statements.
                            for (var i = 0; i < arrayStatements.length; i++) {

                                var objectStatementIth = arrayStatements[i];
                                var strAllocationString = m_functionRecurseGenerateAllocationString(objectStatementIth);
                                var exceptionRet = self.statements.addItem(eval(strAllocationString));
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Virtual method to determine selection.
                    self.getSelected = function () {

                        return window.manager.getSelected(self);
                    };

                    // Generates JavaScript string for this method.
                    self.generateJavaScript = function () {

                        var strMethod = " ";

                        strMethod += "self." + self.name + " = function ( ";

                        // Parameters.
                        strMethod += self.parameters.generateJavaScript();

                        strMethod += " ) { "

                        // Statements.
                        strMethod += self.statements.generateJavaScript();

                        strMethod += " }; ";

                        return strMethod;
                    };

                    // Save.
                    self.save = function () {

                        var objectRet = {};

                        // Name.
                        objectRet.name = self.name;

                        // Parameters.
                        objectRet.arguments = self.parameters.save(true);

                        // Statements.
                        objectRet.statements = self.statements.save();

                        return objectRet;
                    };

                    ////////////////////////////
                    // Private methods.

                    // Recursively allocate string which generates a statement or block.
                    var m_functionRecurseGenerateAllocationString = function (objectStatement) {

                        var strType = objectStatement.type;
                        if (strType === "String") {

                            if (!objectStatement.value) {

                                return '""';
                            }
                            return '"' + objectStatement.value + '"';
                        } else if (strType) {

                            var strRet = "new " + strType + "(";

                            if (objectStatement.parameters) {

                                var arrayChildren = objectStatement.parameters;
                                for (var i = 0; i < arrayChildren.length; i++) {

                                    var objectChild = arrayChildren[i];
                                    var strChild = m_functionRecurseGenerateAllocationString(objectChild);
                                    if (i > 0) {

                                        strRet += ",";
                                    }
                                    strRet += strChild;
                                }
                            }

                            strRet += ")"

                            return strRet;
                        } else {

                            return "undefined";
                        }
                    };
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Inherit from TypeSection.
            functionRet.inheritsFrom(SectionPart);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
