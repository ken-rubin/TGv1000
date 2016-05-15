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
    "NextWave/source/methodBuilder/TypeMethodPair",
    "NextWave/source/methodBuilder/ParameterList",
    "NextWave/source/methodBuilder/StatementList"],
    function (prototypes, settings, Point, Size, Area, TypeMethodPair, ParameterList, StatementList) {

        try {

            // Constructor function.
            var functionRet = function MethodBuilder() {

                try {

                    var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // .
                    self.methodTypeMethodPair = null;
                    // .
                    self.methodParameters = null;
                    // .
                    self.methodStatements = null;

                    ///////////////////////
                    // Public methods.

                    // Clear all the statements from the statement list.
                    self.clearItems = function () {

                        try {

                            var exceptionRet = self.methodTypeMethodPair.create("", "");
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            self.methodParameters = new ParameterList();
                            exceptionRet = self.methodParameters.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            self.methodStatements = new StatementList();
                            return self.methodStatements.create();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Attach instance to DOM and initialize state.
                    self.create = function (tmpMethod, plMethod, slMethod) {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
                            }
                            if (!tmpMethod) {

                                throw { message: "Must specify a type-name object!" };
                            }
                            if (!plMethod) {

                                throw { message: "Must specify a parameter list!" };
                            }
                            if (!slMethod) {

                                throw { message: "Must specify a code statement list!" };
                            }

                            // Save the parameters.
                            self.methodTypeMethodPair = tmpMethod;
                            self.methodParameters = plMethod;
                            self.methodStatements = slMethod;

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

                            // Pass on down the line.
                            return self.methodStatements.accumulateDragTargets(arrayAccumulator);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Look for all places where a statement drag stub could be inserted.
                    self.accumulateDragStubInsertionPoints = function (arrayAccumulator, statementDragStub) {

                        try {

                            // Pass on down the line.
                            return self.methodStatements.accumulateDragStubInsertionPoints(arrayAccumulator,
                                statementDragStub,
                                m_areaMaximal);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove statements from around all elements in 
                    // self.methodStatements list and all sub-blocks.
                    self.purgeStatementDragStubs = function () {

                        try {

                            // Pass on down the line.
                            return self.methodStatements.purgeStatementDragStubs();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method loads type into method builder.
                    self.loadTypeMethod = function (objectContext) {

                        try {

                            // Set parameters.
                            self.methodParameters = objectContext.method.parameters;

                            // Set statements.
                            self.methodStatements = objectContext.method.statements;

                            // Set the name.
                            return self.methodTypeMethodPair.create(objectContext.type.name.payload,
                                objectContext.method.name);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved over the tree.
                    self.mouseMove = function (objectReference) {

                        try {

                            // Determine which object is under the cursor.
                            var exceptionRet = m_functionTestPoint(objectReference);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            if (m_objectCursor) {

                                return m_objectCursor.mouseMove(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved away from the canvas.
                    self.mouseOut = function (objectReference) {

                        try {

                            if (m_objectCursor) {

                                if (m_objectCursor.mouseOut) {

                                    m_objectCursor.mouseOut(objectReference);
                                }
                                m_objectCursor.highlight = false;
                                m_objectCursor = null;
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is pressed down over the canvas.
                    self.mouseDown = function (objectReference) {

                        try {

                            if (m_objectCursor &&
                                $.isFunction(m_objectCursor.mouseDown)) {

                                return m_objectCursor.mouseDown(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is let up over the canvas.
                    self.mouseUp = function (objectReference) {

                        try {

                            if (m_objectCursor &&
                                $.isFunction(m_objectCursor.mouseUp)) {

                                return m_objectCursor.mouseUp(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is clicked over the canvas.
                    self.click = function (objectReference) {

                        try {

                            if (m_objectCursor &&
                                $.isFunction(m_objectCursor.click)) {

                                return m_objectCursor.click(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse wheel is scrolled over the canvas.
                    self.mouseWheel = function (objectReference) {

                        try {

                            if (m_objectCursor &&
                                $.isFunction(m_objectCursor.mouseWheel)) {

                                return m_objectCursor.mouseWheel(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Calculate the section rectangles.
                    self.calculateLayout = function (areaMaximal, contextRender) {

                        try {

                            // Calculate the maximal area.
                            m_areaMaximal = areaMaximal;

                            // See how wide the type name wants to be.
                            var dWidth = self.methodTypeMethodPair.getWidth(contextRender);

                            // Make the area according to its type-name width.
                            var areaTypeMethodPair =  new Area(new Point(m_areaMaximal.location.x + settings.general.margin, 
                                    m_areaMaximal.location.y + settings.general.margin),
                                new Size(dWidth,
                                    settings.centerPanel.lineHeight));
                            var exceptionRet = self.methodTypeMethodPair.calculateLayout(areaTypeMethodPair, contextRender);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            var areaParameters =  new Area(new Point(areaTypeMethodPair.location.x + areaTypeMethodPair.extent.width + settings.general.margin, 
                                    m_areaMaximal.location.y + settings.general.margin),
                                new Size(areaMaximal.extent.width - (areaTypeMethodPair.extent.width + 3 * settings.general.margin),
                                    settings.centerPanel.lineHeight));
                            exceptionRet = self.methodParameters.calculateLayout(areaParameters, contextRender);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            var areaStatements =  new Area(new Point(m_areaMaximal.location.x + settings.general.margin,
                                    m_areaMaximal.location.y + 2 * settings.general.margin + settings.centerPanel.lineHeight),
                                new Size(m_areaMaximal.extent.width - 2 * settings.general.margin,
                                    m_areaMaximal.extent.height - (3 * settings.general.margin + settings.centerPanel.lineHeight)));
                            exceptionRet = self.methodStatements.calculateLayout(areaStatements, contextRender);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the objects.
                    self.render = function (contextRender) {
                        
                        try {

                            var exceptionRet = m_areaMaximal.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            contextRender.save();
                            contextRender.clip();

                            exceptionRet = self.methodTypeMethodPair.render(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            exceptionRet = self.methodParameters.render(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            exceptionRet = self.methodStatements.render(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            contextRender.restore();

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    ///////////////////////
                    // Private methods.

                    // Helper method tests cursor point.
                    var m_functionTestPoint = function (objectReference) {

                        try {

                            // Do nothing if no cursor.
                            if (!objectReference.pointCursor) {

                                return null;
                            }

                            // Remember the current object cursor.
                            var objectOriginal = m_objectCursor;

                            // See if the cursor point is in any type.
                            if (m_objectCursor) {

                                m_objectCursor.highlight = false;
                                m_objectCursor = null;
                            }

                            // Test each region/object.
                            if (self.methodParameters.pointIn(objectReference.contextRender,
                                objectReference.pointCursor)) {

                                m_objectCursor = self.methodParameters;
                                m_objectCursor.highlight = true;
                                var exceptionRet = m_objectCursor.mouseMove(objectReference);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            } else if (self.methodStatements.pointIn(objectReference.contextRender,
                                objectReference.pointCursor)) {

                                m_objectCursor = self.methodStatements;
                                m_objectCursor.highlight = true;
                                var exceptionRet = m_objectCursor.mouseMove(objectReference);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }  else if (self.methodTypeMethodPair.pointIn(objectReference.contextRender,
                                objectReference.pointCursor)) {

                                m_objectCursor = self.methodTypeMethodPair;
                                m_objectCursor.highlight = true;
                            } 

                            // Deactivate the selection in the 
                            // current type, if it changed.
                            if (objectOriginal &&
                                m_objectCursor !== objectOriginal) {

                                if (objectOriginal.mouseOut) {

                                    var exceptionRet = objectOriginal.mouseOut(objectReference);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    // The whole area.
                    var m_areaMaximal = null;
                    // .
                    var m_areaTypeMethodPair = null;
                    // .
                    var m_areaStatements = null;
                    // Object under cursor.
                    var m_objectCursor = null;
                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
