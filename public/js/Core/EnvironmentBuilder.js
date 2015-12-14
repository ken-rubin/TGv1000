///////////////////////////////////////
// Module builds up JavaScript RTE from a TG project. 
//
// Return constructor function.
//

"use strict";

// Define module.
define(["SourceScanner/converter",
    "SourceScanner/processor"],
    function (converter, processor) {

        // If window.instances not defined, define it as an array.
        // This is necessary so the instances can register themselves.
        if (!window.instances) {

            window.instances = [];
        }

        // Define constructor function.
        var functionRet = function EnvironmentBuilder() {

            var self = this;

            ///////////////////////////
            // Public properties.

            // The active comic.
            self.comic = null;

            ///////////////////////////
            // Public methods.

            // Process the specified project's index-specified comic.
            self.activate = function (objectProject, iComicIndex) {

                try {

                    // Get the iComicIndex'th comic;
                    var objectComic = objectProject.comics.items[iComicIndex];
                    self.comic = objectComic;

                    // Pre-process type events.
                    for (var i = 0; i < objectComic.types.items.length; i++) {

                        // Get the ith type.
                        var objectType = objectComic.types.items[i];

                        // Process each event.
                        for (var j = 0; j < objectType.events.length; j++) {

                            // Get the ith event.
                            var objectEvent = objectType.events[j];

                            // Allocate the collection for this event.
                            window.eventCollection[objectEvent.name] = [];
                        }
                    }

                    // Save off blockly workspace string
                    var blockly = $("#BlocklyIFrame")[0].contentWindow;
                    var strWorkspace = blockly.getWorkspaceString();

                    // Stop code form listening to blockly code changes.
                    code.deaf = true;

                    // Process each type.
                    try {

                        for (var i = 0; i < objectComic.types.items.length; i++) {

                            // Get the ith type.
                            var objectType = objectComic.types.items[i];

                            // Add each type individually.
                            var exceptionRet = m_functionProcessType(objectType);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                        }
                    } finally {

                        // Restore blockly.
                        blockly.setWorkspaceString(strWorkspace);
                        code.dead = false;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Remove the specified project's index-specified comic's types.
            self.deactivate = function () {

                try {

                    // Get the iComicIndex'th comic;
                    var objectComic = self.comic;
                    if (!objectComic) {

                        return null;
                    }

                    // Process each type.
                    for (var i = 0; i < objectComic.types.items.length; i++) {

                        // Get the ith type.
                        var objectType = objectComic.types.items[i];

                        var strRemoveType = "delete window['" + objectType.name + "'];";
                        eval(strRemoveType);
                    }

                    // Clear out instances as well.
                    window.instances = [];

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////
            // Private methods.

            var m_functionAccumulate = function (objectType, objectAccumulator) {

                try {

                    if (!objectType ||
                        !objectAccumulator) {

                        return null;
                    }

                    if (objectType.baseTypeName) {

                        // Find the base type in the comic.
                        var objectBaseType = null;

                        // Test each type.
                        for (var i = 0; i < self.comic.types.items.length; i++) {

                            // Get the ith type.
                            var objectTypeInner = self.comic.types.items[i];

                            if (objectTypeInner.name === objectType.baseTypeName) {

                                objectBaseType = objectTypeInner;
                                break;
                            }
                        }

                        // Base structure if not found.
                        if (objectBaseType == null) {

                            throw { message: "Base type not found: " + objectType.baseTypeName };
                        }

                        // Call down recursively, inject the base type--return on error.
                        var exceptionRet = m_functionAccumulate(objectBaseType,
                            objectAccumulator);
                        if (exceptionRet) {

                            return exceptionRet;
                        }
                    }

                    // Process each property into the object.
                    for (var i = 0; i < objectType.properties.length; i++) {

                        objectAccumulator.properties[objectType.properties[i].name] = objectType.properties[i];
                    }
                    // Process each method into the object.
                    for (var i = 0; i < objectType.methods.length; i++) {

                        objectAccumulator.methods[objectType.methods[i].name] = objectType.methods[i];
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Process the specified project.
            var m_functionProcessType = function (objectType) {

                try {

                    // Build the constructor function for the type.
                    var strConstructorFunction = " window['" + objectType.name +
                        "'] = function (app) { " + 
                        " /* Closure. */ var self = this; " + 
                        " /* Register with system. */ window.instances.push(self); " + 
                        " /* Reference to the application object. */ self.app = app; ";

                    // Recursively build up the collection of properties to add.
                    var objectAccumulator = { properties: {}, methods: {} };
                    var exceptionRet = m_functionAccumulate(objectType,
                        objectAccumulator);
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    // Add properties.
                    var arrayProperties = Object.keys(objectAccumulator.properties);
                    for (var i = 0; i < arrayProperties.length; i++) {

                        // Get the ith property.
                        var objectProperty = objectAccumulator.properties[arrayProperties[i]];

                        strConstructorFunction += " self." + objectProperty.name;
                        if (objectProperty.initialValue) {

                            strConstructorFunction += " = ";
                            if (objectProperty.initialValueQuoted) {

                                strConstructorFunction += "'";
                            }
                            strConstructorFunction += objectProperty.initialValue;
                            if (objectProperty.initialValueQuoted) {

                                strConstructorFunction += "'";
                            }
                        }
                        strConstructorFunction += "; ";
                    }

                    // Add methods.
                    var bFoundConstruct = false;
                    var arrayMethods = Object.keys(objectAccumulator.methods);
                    for (var i = 0; i < arrayMethods.length; i++) {

                        // Get the ith method.
                        var objectMethod = objectAccumulator.methods[arrayMethods[i]];

                        // Look for construct method, invoke when created.
                        if (objectMethod.name == "construct") {

                            bFoundConstruct = true;
                        }

                        strConstructorFunction += " self." + objectMethod.name + " = function (";
                        
                        // Add in parameters.
                        if (objectMethod.parameters) {

                            for (var j = 0; j < objectMethod.parameters.length; j++) {

                                if (j > 0) {

                                    strConstructorFunction += ", ";
                                }
                                strConstructorFunction += objectMethod.parameters[j];
                            }
                        }

                        // Get the primary block chain.
                        var strWorkspace = objectMethod.workspace;
                        var jsonWorkspace = converter.toJSON(strWorkspace);
                        var jsonPrimaryBlockChain = processor.getPrimaryBlockChain(jsonWorkspace,
                            objectMethod.name);

                        // Recompose new workspace.
                        var jsonNewWorkspace = { 

                            nodeName:"xml", 
                            xmlns:"http://www.w3.org/1999/xhtml",
                            children: [jsonPrimaryBlockChain]
                        };

                        var strPrimaryBlockWorkspace = converter.toXML(jsonNewWorkspace);
                        alert(strPrimaryBlockWorkspace);
                        
                        // Get the code from blockly.
                        var blockly = $("#BlocklyIFrame")[0].contentWindow;
                        blockly.setWorkspaceString(strPrimaryBlockWorkspace);
                        var strCode = blockly.getMethodString();
                        alert(strCode);

                        // Set in the method.
                        strConstructorFunction += " ) { " + strCode + " }; ";
                    }

                    // If there is a base class, do the function injection.
                    if (bFoundConstruct) {
        
                        strConstructorFunction += " /* Invoke construct. */ self.construct(); ";
                    }

                    strConstructorFunction += " }; ";

                    // Create actual Javascript type.
                    eval(strConstructorFunction);

                    return null;
                } catch (e) {

                    return e;
                }
            };
        };

        // Return constructor.
        return functionRet;
    });
