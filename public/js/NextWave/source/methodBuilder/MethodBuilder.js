///////////////////////////////////////
// MethodBuilder module.
//
// Gui component responsible for showing 
// a method and all its parts (e.g. type
// name, parameters, statement-block).
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/methodBuilder/CodeStatementFor",
    "NextWave/source/methodBuilder/CodeStatementVar",
    "NextWave/source/methodBuilder/CodeExpressionInvocation",
    "NextWave/source/methodBuilder/CodeExpressionPrefix",
    "NextWave/source/statement/StatementFor",
    "NextWave/source/statement/StatementForIn",
    "NextWave/source/statement/StatementWhile",
    "NextWave/source/statement/StatementIf",
    "NextWave/source/statement/StatementReturn",
    "NextWave/source/statement/StatementTry",
    "NextWave/source/statement/StatementThrow",
    "NextWave/source/statement/StatementVar",
    "NextWave/source/statement/StatementExpression",
    "NextWave/source/statement/StatementBreak",
    "NextWave/source/statement/StatementContinue",
    "NextWave/source/statement/StatementDebugger",
    "NextWave/source/statement/StatementComment",
    "NextWave/source/statement/StatementFreeform",
    "NextWave/source/utility/ListHost",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/DialogHost",
    "NextWave/source/project/Type",
    "NextWave/source/project/Method"],
    function (prototypes, settings, CodeStatementFor, CodeStatementVar, CodeExpressionInvocation, CodeExpressionPrefix, StatementFor, StatementForIn, StatementWhile, StatementIf, StatementReturn, StatementTry, StatementThrow, StatementVar, StatementExpression, StatementBreak, StatementContinue, StatementDebugger, StatementComment, StatementFreeform, ListHost, Point, Size, Area, DialogHost, Type, Method) {

        try {

            // Constructor function.
            var functionRet = function MethodBuilder() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from DialogHost.
                    self.inherits(DialogHost);

                    ///////////////////////
                    // Public fields.

                    // .
                    self.typeLabel = null;
                    // .
                    self.methodEdit = null;
                    // .
                    self.commentEdit = null;
                    // .
                    self.methodParameters = null;
                    // .
                    self.methodStatements = null;
                    // .
                    self.currentMethod = null;

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "MethodBuilder: Instance already created!" };
                            }

                            // Create the dialog.
                            var exceptionRet = self.dialog.create({

                                typeLabel: {

                                    type: "Label",
                                    text: "",
                                    x: settings.general.margin,
                                    y: settings.general.margin,
                                    width: settings.dialog.firstColumnWidth - 20,
                                    height: settings.dialog.lineHeight
                                },
                                separatorLabel: {

                                    type: "Label",
                                    text: "::",
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth - 20,
                                    y: settings.general.margin,
                                    width: 20,
                                    height: settings.dialog.lineHeight
                                },
                                nameEdit: {

                                    type: "Edit",
                                    multiline: false,
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight,
                                    enterFocus: function (localSelf) {

                                        try {

                                            // Store the current value for comparison after.
                                            localSelf.saveMethodName = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    },
                                    exitFocus: function (localSelf) {

                                        try {

                                            // If the name has changed, update the name.
                                            if (localSelf.saveMethodName !== localSelf.getText()) {

                                                // Generate an unique name.
                                                var strUnique = window.manager.getUniqueName(localSelf.getText(),
                                                    self.currentMethod.owner.methods,
                                                    "data",
                                                    "name");

                                                // Update GUI.
                                                var exceptionRet = localSelf.setText(strUnique);
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }

                                                // Update the other GUI.
                                                self.currentMethod.listItem.name = strUnique;

                                                // Update data too.
                                                self.currentMethod.data.name = strUnique;
                                            }
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                },
                                argumentsParameterList: {

                                    type: "ParameterListHost",
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth * 2,
                                    y: -settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth * 2,
                                    height: settings.dialog.lineHeight + 
                                        4 * settings.general.margin
                                },
                                commentLabel: {

                                    type: "Label",
                                    text: "Comment",
                                    x: settings.general.margin,
                                    y: settings.dialog.lineHeight + 
                                        3 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                commentEdit: {

                                    type: "Edit",
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: settings.dialog.lineHeight + 
                                        3 * settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 4 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    height: 3 * settings.dialog.lineHeight,
                                    exitFocus: function (localSelf) {

                                        try {

                                            // Update Event's description.
                                            self.currentMethod.data.comment = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                },
                                statementsStatementList: {

                                    type: "StatementListHost",
                                    x: settings.general.margin,
                                    y: 4 * settings.dialog.lineHeight + 
                                        3 * settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 2 * settings.general.margin,
                                    heightType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    height: 5 * settings.dialog.lineHeight + 
                                        4 * settings.general.margin
                                },
                                statementsLabel: {

                                    type: "Label",
                                    text: "Statements",
                                    x: settings.general.margin,
                                    yType: "reserve",
                                    y: settings.dialog.lineHeight + 
                                        1 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                statementsList: {

                                    type: "ListHost",
                                    constructorParameterString: "false",
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    yType: "reserve",
                                    y: settings.dialog.lineHeight + 
                                        2 * settings.general.margin,
                                    width: 3 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    widthType: "reserve",
                                    height: 1.25 * settings.dialog.lineHeight,
                                    items:[]
                                }
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Save the parameters.
                            self.typeLabel = self.dialog.controlObject["typeLabel"];
                            self.methodEdit = self.dialog.controlObject["nameEdit"];
                            self.commentEdit = self.dialog.controlObject["commentEdit"];
                            self.methodParameters = self.dialog.controlObject["argumentsParameterList"];
                            self.methodStatements = self.dialog.controlObject["statementsStatementList"];

                            // Because it is!
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Decompose instance.
                    self.destroy = function () {

                        try {

                            // Can only destroy a created instance.
                            if (!m_bCreated) {

                                throw { message: "Instance not created!" };
                            }

                            window.MethodBuilder = null;

                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Get all the drag targets from all the statements.
                    self.accumulateDragTargets = function (arrayAccumulator) {

                        try {

                            // Do nothing if not visible.
                            if (!self.visible) {

                                return null;
                            }

                            // Pass on down the line.
                            return self.methodStatements.statementList.accumulateDragTargets(arrayAccumulator);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Get list of all visible argument lists.
                    self.accumulateExpressionArgumentListStubs = function (arrayAccumulator, parameterDragStub) {

                        try {

                            // Do nothing if not visible.
                            if (!self.visible) {

                                return null;
                            }

                            // Pass on down the line.
                            return self.methodParameters.parameterList.accumulateParameterDragStubInsertionPoints(arrayAccumulator,
                                parameterDragStub,
                                self.dialog.position);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Look for all places where a Parameter drag stub could be inserted.
                    self.accumulateParameterDragStubInsertionPoints = function (arrayAccumulator, parameterDragStub) {

                        try {

                            // Do nothing if not visible.
                            if (!self.visible) {

                                return null;
                            }

                            // Pass on down the line.
                            return self.methodParameters.parameterList.accumulateParameterDragStubInsertionPoints(arrayAccumulator,
                                parameterDragStub,
                                self.dialog.position);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Look for all places where an expression placement could be inserted.
                    self.accumulateExpressionPlacements = function (arrayAccumulator) {

                        try {

                            // Do nothing if not visible.
                            if (!self.visible) {

                                return null;
                            }

                            // Pass on down the line.
                            return self.methodStatements.statementList.accumulateExpressionPlacements(arrayAccumulator);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Look for all places where a statement drag stub could be inserted.
                    self.accumulateDragStubInsertionPoints = function (arrayAccumulator, statementDragStub) {

                        try {

                            // Do nothing if not visible.
                            if (!self.visible) {

                                return null;
                            }

                            // Pass on down the line.
                            return self.methodStatements.statementList.accumulateDragStubInsertionPoints(arrayAccumulator,
                                statementDragStub,
                                self.dialog.position);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove statements from around all elements in 
                    // self.methodStatements list and all sub-blocks.
                    self.purgeStatementDragStubs = function () {

                        try {

                            // Do nothing if not visible.
                            if (!self.visible) {

                                return null;
                            }

                            // Pass on down the line.
                            return self.methodStatements.statementList.purgeStatementDragStubs();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove ParametersStubs from around all 
                    // elements in self.methodParameterss list.
                    self.purgeParameterDragStubs = function () {

                        try {

                            // Do nothing if not visible.
                            if (!self.visible) {

                                return null;
                            }

                            // Pass on down the line.
                            return self.methodParameters.parameterList.purgeParameterDragStubs();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Cause the statement list to render itself.
                    self.forceRenderStatements = function (contextRender) {

                        try {

                            return self.methodStatements.statementList.render(contextRender);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method loads type into method builder.
                    self.loadMethod = function (method) {

                        try {

                            // Hold on to current method.
                            self.currentMethod = method;

                            // Ensure the type has the requisit attributes.
                            if (!self.currentMethod.data) {

                                self.currentMethod.data = {};
                            }
                            if (!self.currentMethod.data.name) {

                                self.currentMethod.data.name = "[name]";
                            }
                            if (!self.currentMethod.data.comment) {

                                self.currentMethod.data.comment = "[comment]";
                            }
                            if (!self.currentMethod.owner.data) {

                                self.currentMethod.owner.data = {};
                            }
                            if (!self.currentMethod.owner.data.name) {

                                self.currentMethod.owner.data.name = "[name]";
                            }

                            // Set parameters.
                            self.dialog.controlObject["argumentsParameterList"].parameterList = self.currentMethod.parameters;

                            // Set statements.
                            self.dialog.controlObject["statementsStatementList"].statementList = self.currentMethod.statements;

                            // Set the type.
                            self.typeLabel.text = self.currentMethod.owner.data.name;

                            // TODO: add protection for argumentsParameterList and statementsStatementList.

                            // Set the method name.
                            var bProtected = false;
                            // Protect against editing method name in these cases:
                            //      App type (type.data.typeTypeId === 1 && objectContext.method.data.name === "initialize")
                            //      objectContext.method.data.name === "construct"
                            //      (system type or app base type) && !manager.userCanWorkWithSystemTypesAndAppBaseTypes
                            if ( 
                                    (self.currentMethod.owner.data.typeTypeId === 1 && self.currentMethod.data.name === "initialize") || 
                                    (self.currentMethod.data.name === "construct") ||
                                    (self.currentMethod.owner.data.typeTypeId > 1 && !manager.userCanWorkWithSystemTypesAndAppBaseTypes)
                                ) {

                                bProtected = true;
                            }
                            var exceptionRet = self.methodEdit.setProtected(bProtected);
                            if (exceptionRet) {
                                return exceptionRet;
                            }

                            exceptionRet = self.methodEdit.setText(self.currentMethod.data.name);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            exceptionRet = self.commentEdit.setText(self.currentMethod.data.comment);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Dynamically load up statements into the statement list.
                            var lhStatements = self.dialog.controlObject["statementsList"];
                            var listStatements = lhStatements.list;

                            // Ensure there are statements.
                            if (!window.projectDialog.currentComic.statements ||
                                !window.projectDialog.currentComic.statements.length) {

                                window.projectDialog.currentComic.statements = [

                                    new StatementBreak(),
                                    new StatementComment(),
                                    new StatementContinue(),
                                    new StatementDebugger(),
                                    new StatementExpression(),
                                    new StatementFor(),
                                    new StatementForIn(),
                                    new StatementFreeform(),
                                    new StatementIf(),
                                    new StatementReturn(),
                                    new StatementThrow(),
                                    new StatementTry(),
                                    new StatementVar(),
                                    new StatementWhile()];
                            }

                            // Get the statments from the current comic.
                            return listStatements.create(window.projectDialog.currentComic.statements);
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////
                    // Private methods.

                    // Set up the names panel.
                    var m_functionLoadMethodNames = function(method) {

                        try {

                            var arrayPNames = [];
                            var exceptionRet = m_functionAddNamesFromParameters(method.parameters, arrayPNames);
                            if (exceptionRet) {
                                return exceptionRet;
                            }
                            
                            var arraySNames = [];
                            // method.statements is a StatementList. Let's start there.
                            exceptionRet = method.statements.accumulateNames(arraySNames);
                            if (exceptionRet) {
                                return exceptionRet;
                            }
                            
                            return window.manager.panelLayer.setNames(arrayPNames.concat(arraySNames));

                        } catch (e) {

                            return e;
                        }
                    }

                    var m_functionAddNamesFromParameters = function (methodParameters, arrayPNames) {

                        try {

                            for (var i = 0; i < methodParameters.items.length; i++) {

                                var paramIth = methodParameters.items[i];
                                arrayPNames.push(paramIth.name.text);
                            }

                            return null;

                        } catch (e) {

                            return e;
                        }
                    }

                    ///////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from Control.  Wire 
            // up prototype chain to Control.
            functionRet.inheritsFrom(DialogHost);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
