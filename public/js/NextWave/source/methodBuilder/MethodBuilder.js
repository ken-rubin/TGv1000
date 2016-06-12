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
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/DialogHost"],
    function (prototypes, settings, Point, Size, Area, DialogHost) {

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
                    self.methodParameters = null;
                    // .
                    self.methodStatements = null;

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
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
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight,
                                    enterFocus: function (localSelf) {

                                        try {

                                            // Store the current value for comparison after.
                                            localSelf.saveMethodName = localSelf.getText();

                                            // Also store the value of the type label.
                                            localSelf.saveTypeName = localSelf.dialog.controlObject["typeLabel"].text;
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    },
                                    exitFocus: function (localSelf) {

                                        try {

                                            // If the name has changed, update the name.
                                            if (localSelf.saveMethodName !== localSelf.getText()) {

                                                // Lookup the type from its name.
                                                var typeFromName = window.manager.getTypeFromName(localSelf.saveTypeName);
                                                if (!typeFromName) {

                                                    return null;
                                                }

                                                // Ensure the value is unique.
                                                var exceptionRet = localSelf.setText(window.manager.getUniqueName(localSelf.text,
                                                    typeFromName.methods.parts,
                                                    "name"));
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }

                                                // Update.
                                                window.manager.editMethodName(typeFromName,
                                                    localSelf.saveMethodName,
                                                    localSelf.getText());
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
                                    y: 0,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth * 2,
                                    height: settings.dialog.lineHeight + 
                                    2 * settings.general.margin
                                },
                                statementsStatementList: {

                                    type: "StatementListHost",
                                    x: settings.general.margin,
                                    y: settings.dialog.lineHeight + 
                                        2 * settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 2 * settings.general.margin,
                                    heightType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    height: settings.dialog.lineHeight + 
                                        3 * settings.general.margin
                                }
                            });

                            // Save the parameters.
                            self.typeLabel = self.dialog.controlObject["typeLabel"];
                            self.methodEdit = self.dialog.controlObject["nameEdit"];
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

                    // Method loads type into method builder.
                    self.loadTypeMethod = function (objectContext) {

                        try {

                            // Set parameters.
                            self.dialog.controlObject["argumentsParameterList"].parameterList = objectContext.method.parameters;
                            //self.methodParameters = objectContext.method.parameters;

                            // Set statements.
                            self.dialog.controlObject["statementsStatementList"].statementList = objectContext.method.statements;
                            //self.methodStatements = objectContext.method.statements;

                            // Set the type.
                            self.typeLabel.text = objectContext.type.name.payload;

                            // Set the method.
                            return self.methodEdit.setText(objectContext.method.name);
                        } catch (e) {

                            return e;
                        }
                    };

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
