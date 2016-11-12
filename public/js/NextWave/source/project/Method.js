/////////////////////
// Method module.
//
// Object manages loading and saving method data to and  
// from the Type and also, integration with the TypeTree.
// 
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    
    "NextWave/source/utility/ListItem",
    "NextWave/source/utility/Edit",

    "NextWave/source/methodBuilder/ParameterList",
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
    "NextWave/source/methodBuilder/CodeVar",

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
    "NextWave/source/methodBuilder/StatementList"],
    function (prototypes, ListItem, Edit, ParameterList, Block, CodeExpressionGroup, CodeExpressionInfix, CodeExpressionInvocation, CodeExpressionLiteral, CodeExpressionName, CodeExpressionPostfix, CodeExpressionPrefix, CodeExpressionRefinement, CodeExpressionTernary, CodeExpressionType, CodeLiteral, CodeName, CodeVar, CodeStatementBreak, CodeStatementContinue, CodeStatementComment, CodeStatementDebugger, CodeStatementExpression, CodeStatementFor, CodeStatementForIn, CodeStatementFreeform, CodeStatementIf, CodeStatementReturn, CodeStatementThrow, CodeStatementTry, CodeStatementVar, CodeStatementWhile, CodeType, StatementList) {
	
		try {

            // Constructor function.
			var functionConstructor = function Method(typeOwner) {

				try {

                    var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Immediate owning instance.
                    self.owner = typeOwner;
                    // Backing data for this instance.
                    self.data = null;
                    // Hold on to ListItem associated with this instance.
                    self.listItem = null;
                    // List of parameters associated with this method.
                    self.parameters = new ParameterList();
                    // List of statement associated with this method.
                    self.statements = new StatementList();

                    ///////////////////////////
                    // Public methods.

                    // Create instance.
                    self.create = function (objectMethod) {

                        try {

                            // Save off the data.
                            self.data = objectMethod;

                            // Generate ListItem for this instance.
                            self.listItem = new ListItem(self.data.name);
                            self.listItem.clickHandler = self.select;
                            self.listItem.deleteHandler = m_functionDeleteHandler;
                            self.listItem.owner = self;

                            // Three bits of data.
                            var objectParameters = self.data.arguments;
                            var arrayStatements = self.data.statements;

                            // Set parameters.
                            if (objectParameters) {

                                var strAllocationString = m_functionRecurseGenerateAllocationString(objectParameters);
                                strAllocationString = strAllocationString.replace(/\r?\n|\r/g, " ");
                                self.parameters = eval(strAllocationString);
                            }

                            // Set statements.
                            if (arrayStatements) {

                                for (var i = 0; i < arrayStatements.length; i++) {

                                    var objectStatementIth = arrayStatements[i];
                                    var strAllocationString = m_functionRecurseGenerateAllocationString(objectStatementIth);
                                    strAllocationString = strAllocationString.replace(/\r?\n|\r/g, " ");
                                    var exceptionRet = self.statements.addItem(eval(strAllocationString));
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

                    // Select this Method.
                    self.select = function (objectReference) {

                        try {

                            // Clear the highlight in all the 
                            // other instances of the owner.
                            var exceptionRet = self.owner.unselectAll();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the ListItem to selected.
                            self.listItem.selected = true;

                            // Set the current Type.
                            var exceptionRet = window.projectDialog.setCurrentMethod(self);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Select into gui.
                            return window.manager.selectMethod(self);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Unselect this Method.
                    self.unselect = function () {

                        // Set the ListItem to selected.
                        self.listItem.selected = false;
                        return null;
                    };

                    // Generates JavaScript string for this method.
                    self.generateJavaScript = function (arrayProperties, arrayEvents) {

                        var strMethod = "\n";

                        // Output name and signiture.
                        strMethod += "    " + self.data.name + " (" +
                            self.parameters.generateJavaScript() +
                            ") {\n\n";

                        // If this is construct, then get the properties and events and output.
                        var bConstructor = false;
                        if (self.data.name === "constructor") {

                            // Remember in constructor.
                            bConstructor = true;

                            // Since in constructor, render the super call 
                            // first--this defines lexically scoped this.
                            strMethod += self.statements.generateJavaScript(true, true) + "\n";

                            // Add Properties.
                            if (arrayProperties &&
                                arrayProperties.length > 0) {

                                // Loop over all Properties
                                for (var i = 0; i < arrayProperties.length; i++) {

                                    // Add it to the result object.
                                    strMethod += arrayProperties[i].generateJavaScript() + "\n";
                                }
                            }
 
                            // Add Events.
                            if (arrayEvents &&
                                arrayEvents.length > 0) {

                                // Loop over all Events
                                for (var i = 0; i < arrayEvents.length; i++) {

                                    // Add it to the result object.
                                    strMethod += arrayEvents[i].generateJavaScript() + "\n";
                                }
                            }
                        }

                        // Output statements.  If constructor 
                        // then don't (re)output super call.
                        strMethod += self.statements.generateJavaScript(bConstructor, false) + "\n\n";

                        // Output closing squiggle.
                        strMethod += "    }\n";

                        return strMethod;
                    };

                    // Save.
                    self.save = function () {

                        try {

                            var objectRet = self.data;

                            // Parameters.
                            objectRet.arguments = self.parameters.save();

                            // Statements.
                            objectRet.statements = self.statements.save();

                            return null;

                        } catch(e) {

                            return e;
                        }
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
                            return '"' + objectStatement.value.replace('"', "'") + '"';
                        } else if (strType === "Boolean") {

                            if (!objectStatement.value) {

                                return false;
                            }
                            return (objectStatement.value === "true");
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

                    // Invoked when the mouse is clicked over this instance's delete icon.
                    var m_functionDeleteHandler = function (objectReference) {

                        try {

                            // Delete this Type.
                            return window.projectDialog.deleteMethod(self);
                        } catch (e) {

                            return e;
                        }
                    };
				} catch (e) {

					alert(e.message);
				}				
			};

			return functionConstructor;
		} catch (e) {

			alert(e.message);
		}
	});