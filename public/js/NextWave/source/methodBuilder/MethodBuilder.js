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

                                                // Lookup the type from its name. This may return a type, a system type or an App base type.
                                                var typeFromName = window.manager.getTypeFromName(localSelf.saveTypeName);
                                                if (!typeFromName) {

                                                    return localSelf.setText(localSelf.saveMethodName);
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
                                    y: -settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth * 2,
                                    height: settings.dialog.lineHeight + 
                                    4 * settings.general.margin
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

                    // Method loads type into method builder.
                    self.loadTypeMethod = function (objectContext) {

                        try {

                            // Call method that will clear the names panel and load all names for this method into it.
                            var exceptionRet = m_functionLoadMethodNames(objectContext.method);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set parameters.
                            self.dialog.controlObject["argumentsParameterList"].parameterList = objectContext.method.parameters;
                            //self.methodParameters = objectContext.method.parameters;

                            // Set statements.
                            self.dialog.controlObject["statementsStatementList"].statementList = objectContext.method.statements;
                            //self.methodStatements = objectContext.method.statements;

                            // Set the type.
                            self.typeLabel.text = objectContext.type.name;

                            // TODO: add protection for argumentsParameterList and statementsStatementList.

                            // Set the method name.
                            var bProtected = false;
                            // Protect against editing method name in these cases:
                            //      App type (type.stowage.typeTypeId === 1 && objectContext.method.name === "initialize")
                            //      objectContext.method.name === "construct"
                            //      (system type or app base type) && !manager.userCanWorkWithSystemTypesAndAppBaseTypes
                            if ( 
                                    (objectContext.type.stowage.typeTypeId === 1 && objectContext.method.name === "initialize") || 
                                    (objectContext.method.name === "construct") ||
                                    (objectContext.type.stowage.typeTypeId > 1 && !manager.userCanWorkWithSystemTypesAndAppBaseTypes)
                                ) {

                                bProtected = true;
                            }
                            self.methodEdit.setProtected(bProtected);
                            return self.methodEdit.setText(objectContext.method.name);
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////
                    // Private methods.

                    // Set up the names panel.
                    var m_functionLoadMethodNames = function(method) {

                        try {

                            var arrayNames = [];

                            // if (method.parameters) {
                                for (var i = 0; i < method.parameters.items.length; i++) {

                                    var paramIth = method.parameters.items[i];
                                    arrayNames.push(
                                    {
                                        name: paramIth.name.text,
                                        typeName: paramIth.typeName
                                    });
                                }
                            // }

                            var arrayBoth = arrayNames.concat(m_functionAddNamesFromStatements(method));
                            
                            var uniqueArray = [];
                            if (arrayBoth.length) {

                                // Uniquify (although duplicates wouldn't be allowed--or shouldn't).
                                uniqueArray.push(arrayBoth[0]);
                                for (var i = 1; i < arrayBoth.length; i++) {
                                    var compIth = arrayBoth[i];
                                    var found = false;
                                    for (var j = 0; j < uniqueArray.length; j++) {
                                        if (uniqueArray[j] === compIth){
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found) {
                                        uniqueArray.push(compIth);
                                    }
                                }

                                // And sort.
                                uniqueArray.sort(function(a,b){

                                    if (a.name > b.name)
                                        return 1;
                                    if (a.name < b.name)
                                        return -1;
                                    return 0;
                                });
                            }

                            return window.manager.panelLayer.setNameTypes(uniqueArray);

                        } catch (e) {

                            return e;
                        }
                    }

                    //
                    var m_functionAddNamesFromStatements = function (method) {

                        // Generate statements object from, e.g., method.save().
                        // Stringify.
                        // Use regexp to extract, e.g., "i" from all occurrences like: [{"type":"CodeName","parameters":[{"type":"String","value":"i"}]}]
                        // Add them all to arrayNames. Duplicates will be removed above.

                        var statements = method.statements.save();
                        var JSONStatements = JSON.stringify(statements);

                        // var re = //g;
                        // var found = JSONStatements.match(re);
                        // if (found) {
                        //     return found;
                        // }
                        // return [];

                        // Since I can't get the regExp to work:

                        var found = [];
                        while (JSONStatements.length) {

                            var i = JSONStatements.indexOf('[{"type":"CodeName","parameters":[{"type":"String","value":"');
                            if (i === -1) {

                                JSONStatements = '';
                            
                            } else {

                                JSONStatements = JSONStatements.substr(i + 60);
                                i = JSONStatements.indexOf('"');
                                if (i > -1) {

                                    found.push(
                                    {
                                        name: JSONStatements.substr(0, i),
                                        typeName: null
                                    });
                                    JSONStatements = JSONStatements.substr(i + 1);
                                }
                            }
                        }

                        return found;
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
