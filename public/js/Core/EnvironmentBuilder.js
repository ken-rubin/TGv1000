///////////////////////////////////////
// Module builds up JavaScript RTE from a TG project. 
//
// Return constructor function.
//

"use strict";

// Define module.
define([],
    function () {

        // If window.instances not defined, define it as an array.
        // This is necessary so the instances can register themselves.
        if (!window.instances) {

            window.instances = [];
        }

        // Define constructor function.
        var functionRet = function EnvironmentBuilder() {

            var self = this;

            ///////////////////////////
            // Public methods.

            // Process the specified project's index-specified comic.
            self.activate = function (objectProject, iComicIndex) {

                try {

                    // Get the iComicIndex'th comic;
                    var objectComic = objectProject.comics[iComicIndex];

                    // Pre-process type events.
                    for (var i = 0; i < objectComic.types.length; i++) {

                        // Get the ith type.
                        var objectType = objectComic.types[i];

                        // Process each event.
                        for (var i = 0; i < objectType.events.length; i++) {

                            // Get the ith event.
                            var objectEvent = objectType.events[i];

                            // Allocate the collection for this event.
                            window.eventCollection[objectEvent.name] = [];
                        }
                    }

                    // Process each type.
                    for (var i = 0; i < objectComic.types.length; i++) {

                        // Get the ith type.
                        var objectType = objectComic.types[i];

                        // Add each type individually.
                        var exceptionRet = m_functionProcessType(objectType);
                        if (exceptionRet) {

                            throw exceptionRet;
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Remove the specified project's index-specified comic's types.
            self.deactivate = function (objectProject, iComicIndex) {

                try {

                    // Get the iComicIndex'th comic;
                    var objectComic = objectProject.comics[iComicIndex];

                    // Process each type.
                    for (var i = 0; i < objectComic.types.length; i++) {

                        // Get the ith type.
                        var objectType = objectComic.types[i];

                        var strRemoveType = "delete window." + objectType.name + ";";
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

            // Process the specified project.
            var m_functionProcessType = function (objectType) {

                try {

                    // Build the constructor function for the type.
                    var strConstructorFunction = " window." + objectType.name + 
                        " = function (app) { " + 
                        " /* Closure. */ var self = this; " + 
                        " /* Register with system. */ window.instances.push(self); " + 
                        " /* Reference to the application object. */ self.app = app; ";

                    // If there is a base class, then add the inherits command.
                    if (objectType.baseTypeName) {

                        strConstructorFunction += " /* Inherit from base class. */ self.inherits(" + objectType.baseTypeName + "); ";
                    }

                    // Add properties.
                    for (var i = 0; i < objectType.properties.length; i++) {

                        // Get the ith property.
                        var objectProperty = objectType.properties[i];

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
                    for (var i = 0; i < objectType.methods.length; i++) {

                        // Get the ith method.
                        var objectMethod = objectType.methods[i];

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
                        
                        strConstructorFunction += ") { " + objectMethod.code + " }; ";
                    }

                    // If there is a base class, do the function injection.
                    if (bFoundConstruct) {
        
                        strConstructorFunction += " /* Invoke construct. */ self.construct(); ";
                    }

                    strConstructorFunction += " }; ";

                    // If there is a base class, do the function injection.
                    if (objectType.baseTypeName) {
        
                        strConstructorFunction += " /* Do function injection. */ window." + objectType.name + ".inheritsFrom(" + objectType.baseTypeName + "); ";
                    }

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
