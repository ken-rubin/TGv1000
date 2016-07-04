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
    "NextWave/source/utility/attributeHelper",
    "NextWave/source/utility/Edit",
    "NextWave/source/type/SectionPart",

    "NextWave/source/methodBuilder/ArgumentList",
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
    "NextWave/source/methodBuilder/CodeExpressionType",

    "NextWave/source/methodBuilder/CodeLiteral",
    "NextWave/source/methodBuilder/CodeName",

    "NextWave/source/methodBuilder/CodeStatementBreak",
    "NextWave/source/methodBuilder/CodeStatementContinue",
    "NextWave/source/methodBuilder/CodeStatementComment",
    "NextWave/source/methodBuilder/CodeStatementDebugger",
    "NextWave/source/methodBuilder/CodeStatementExpression",
    "NextWave/source/methodBuilder/CodeStatementFor",
    "NextWave/source/methodBuilder/CodeStatementForIn",
    "NextWave/source/methodBuilder/CodeStatementFreeform",
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
    function (prototypes, attributeHelper, Edit, SectionPart, ArgumentList, Block, CodeExpressionGroup, CodeExpressionInfix, CodeExpressionInvocation, CodeExpressionLiteral, CodeExpressionName, CodeExpressionPostfix, CodeExpressionPrefix, CodeExpressionRefinement, CodeExpressionTernary, CodeExpressionType, CodeLiteral, CodeName, CodeStatementBreak, CodeStatementContinue, CodeStatementComment, CodeStatementDebugger, CodeStatementExpression, CodeStatementFor, CodeStatementForIn, CodeStatementFreeform, CodeStatementIf, CodeStatementReturn, CodeStatementThrow, CodeStatementTry, CodeStatementVar, CodeStatementWhile, CodeType, Parameter, ParameterList, StatementList) {

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
                    // Object holds data members which are 
                    // not differentiated by this client.
                    self.stowage = {};

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
                                self);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Create this instance.
                    self.create = function (objectMethod) {

                        try {

                            // Save the attributes along with this object.
                            var exceptionRet = attributeHelper.fromJSON(objectMethod,
                                self,
                                ["name", "arguments", "statements"]);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the name.
                            self.name = objectMethod.name;

                            // Three bits of data.
                            var objectParameters = objectMethod.arguments;
                            var arrayStatements = objectMethod.statements;

                            // Set parameters.
                            if (objectParameters) {

                                self.parameters = m_functionRecurseAllocate(objectParameters);
                            }

                            // Set statements.
                            if (arrayStatements) {

                                for (var i = 0; i < arrayStatements.length; i++) {

                                    var objectStatementIth = arrayStatements[i];
                                    var objectNew = m_functionRecurseAllocate(objectStatementIth);
                                    var exceptionRet = self.statements.addItem(objectNew);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
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

                        // Save the attributes along with this object.
                        var exceptionRet = attributeHelper.toJSON(self,
                            objectRet);
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        // Name.
                        objectRet.name = self.name;

                        // Parameters.
                        objectRet.arguments = self.parameters.save();

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

                    // Recursively allocate methods.
                    var m_functionRecurseAllocate = function (objectStatement) {

                        var strType = objectStatement.type;
                        if (strType) {

                            // Allocate constructor parameters.
                            var arrayConstructorParameters = [];
                            if (objectStatement.parameters) {

                                arrayConstructorParameters = [];
                                var arrayChildren = objectStatement.parameters;
                                for (var i = 0; i < arrayChildren.length; i++) {

                                    var objectChild = arrayChildren[i];
                                    var objectParameter = m_functionRecurseAllocate(objectChild);
                                    arrayConstructorParameters.push(objectParameter);
                                }
                            }

                            // Just allocate each possible type of thing:
                            var objectRet = null;
                            if (strType === "String") {

                                return objectStatement.value;
                            } else if (strType === "Array") {

                                return new Array(...arrayConstructorParameters);
                            } else if (strType === "ArgumentList") {

                                return new ArgumentList(...arrayConstructorParameters);
                            } else if (strType === "Block") {

                                return new Block(...arrayConstructorParameters);
                            } else if (strType === "CodeExpressionGroup") {

                                return new CodeExpressionGroup(...arrayConstructorParameters);
                            } else if (strType === "CodeExpressionInfix") {

                                return new CodeExpressionInfix(...arrayConstructorParameters);
                            } else if (strType === "CodeExpressionInvocation") {

                                return new CodeExpressionInvocation(...arrayConstructorParameters);
                            } else if (strType === "CodeExpressionLiteral") {

                                return new CodeExpressionLiteral(...arrayConstructorParameters);
                            } else if (strType === "CodeExpressionName") {

                                return new CodeExpressionName(...arrayConstructorParameters);
                            } else if (strType === "CodeExpressionPostfix") {

                                return new CodeExpressionPostfix(...arrayConstructorParameters);
                            } else if (strType === "CodeExpressionPrefix") {

                                return new CodeExpressionPrefix(...arrayConstructorParameters);
                            } else if (strType === "CodeExpressionRefinement") {

                                return new CodeExpressionRefinement(...arrayConstructorParameters);
                            } else if (strType === "CodeExpressionTernary") {

                                return new CodeExpressionTernary(...arrayConstructorParameters);
                            } else if (strType === "CodeExpressionType") {

                                return new CodeExpressionType(...arrayConstructorParameters);
                            } else if (strType === "CodeLiteral") {

                                return new CodeLiteral(...arrayConstructorParameters);
                            } else if (strType === "CodeName") {

                                return new CodeName(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementBreak") {

                                return new CodeStatementBreak(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementContinue") {

                                return new CodeStatementContinue(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementComment") {

                                return new CodeStatementComment(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementDebugger") {

                                return new CodeStatementDebugger(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementExpression") {

                                return new CodeStatementExpression(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementFor") {

                                return new CodeStatementFor(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementForIn") {

                                return new CodeStatementForIn(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementFreeform") {

                                return new CodeStatementFreeform(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementIf") {

                                return new CodeStatementIf(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementReturn") {

                                return new CodeStatementReturn(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementThrow") {

                                return new CodeStatementThrow(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementTry") {

                                return new CodeStatementTry(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementVar") {

                                return new CodeStatementVar(...arrayConstructorParameters);
                            } else if (strType === "CodeStatementWhile") {

                                return new CodeStatementWhile(...arrayConstructorParameters);
                            } else if (strType === "CodeType") {

                                return new CodeType(...arrayConstructorParameters);
                            } else if (strType === "Parameter") {

                                return new Parameter(...arrayConstructorParameters);
                            } else if (strType === "ParameterList") {

                                return new ParameterList(...arrayConstructorParameters);
                            } else if (strType === "Edit") {

                                return new Edit(...arrayConstructorParameters);
                            } else {

                                throw { 

                                    message: "Unrecognized type: " + strType
                                };
                            }

                            return objectRet;
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
