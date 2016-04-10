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
define(["utility/prototypes",
    "utility/settings",
    "utility/Point",
    "utility/Size",
    "utility/Area",
    "methodBuilder/TypeName",
    "methodBuilder/ParameterList",
    "methodBuilder/CodeStatementList"],
    function (prototypes, settings, Point, Size, Area, ParameterList, CodeStatementList) {

        try {

            // Constructor function.
            var functionRet = function MethodBuilder() {

                try {

                    var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // .
                    self.mthodTypeName = null;
                    // .
                    self.methodParameters = null;
                    // .
                    self.methodStatements = null;

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    self.create = function (tnMethod, plMethod, cslMethod) {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
                            }
                            if (!tnMethod) {

                                throw { message: "Must specify a type-name object!" };
                            }
                            if (!plMethod) {

                                throw { message: "Must specify a parameter list!" };
                            }
                            if (!cslMethod) {

                                throw { message: "Must specify a code statement list!" };
                            }

                            // Save the parameters.
                            self.methodTypeName = tnMethod;
                            self.methodParameters = plMethod;
                            self.methodStatements = cslMethod;

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

                    // Add in statements around all elements in the 
                    // self.methodStatements list and all sub-blocks.
                    self.addStatementDragStubs = function (arrayAccumulator) {

                        try {

                            // Pass on down the line.
                            return self.methodStatements.addStatementDragStubs(arrayAccumulator);
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

                    // Invoked when the mouse is moved over the tree.
                    self.mouseMove = function (objectReference) {

                        try {

                            // Determine which object is under the cursor.
                            return m_functionTestPoint(objectReference);
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
                            var dWidth = self.methodTypeName.getWidth(contextRender);

                            // Make the area according to its type-name width.
                            var areaTypeName =  new Area(new Point(m_areaMaximal.location.x + settings.general.margin, 
                                    m_areaMaximal.location.y + settings.general.margin),
                                new Size(dWidth,
                                    settings.methodBuilder.lineHeight));
                            var exceptionRet = self.methodTypeName.calculateLayout(areaTypeName, contextRender);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            var areaParameters =  new Area(new Point(areaTypeName.location.x + areaTypeName.extent.width + settings.general.margin, 
                                    m_areaMaximal.location.y + settings.general.margin),
                                new Size(areaMaximal.extent.width - (areaTypeName.extent.width + 3 * settings.general.margin),
                                    settings.methodBuilder.lineHeight));
                            exceptionRet = self.methodParameters.calculateLayout(areaParameters, contextRender);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            var areaStatements =  new Area(new Point(m_areaMaximal.location.x + settings.general.margin,
                                    m_areaMaximal.location.y + 2 * settings.general.margin + settings.methodBuilder.lineHeight),
                                new Size(m_areaMaximal.extent.width - 2 * settings.general.margin,
                                    m_areaMaximal.extent.height - (3 * settings.general.margin + settings.methodBuilder.lineHeight)));
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

                            exceptionRet = self.methodTypeName.render(contextRender);
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
                            }  else if (self.methodTypeName.pointIn(objectReference.contextRender,
                                objectReference.pointCursor)) {

                                m_objectCursor = self.methodTypeName;
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
                    var m_areaTypeName = null;
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
