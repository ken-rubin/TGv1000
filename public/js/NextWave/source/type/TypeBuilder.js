///////////////////////////////////////
// TypeBuilder module.
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
    "NextWave/source/utility/Area"],
    function (prototypes, settings, Point, Size, Area) {

        try {

            // Constructor function.
            var functionRet = function TypeBuilder() {

                try {

                    var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    ///////////////////////
                    // Public methods.

                    // Clear out state.
                    self.clearItems = function () {

                        return null;
                    };

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
                            }

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

                    // Invoked when the mouse is moved over the tree.
                    self.mouseMove = function (objectReference) {

                        try {

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

                            contextRender.fillStyle = "#990";
                            contextRender.fillRect(m_areaMaximal.location.x,
                                m_areaMaximal.location.y,
                                m_areaMaximal.extent.width,
                                m_areaMaximal.extent.height);

                            contextRender.restore();

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    ///////////////////////
                    // Private methods.

                    ///////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    // The whole area.
                    var m_areaMaximal = null;
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
