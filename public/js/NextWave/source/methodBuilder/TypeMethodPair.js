///////////////////////////////////////
// TypeMethodPair module.
//
// Gui component for showing a method type name and method name.
//
// Return constructor function.
//
// This type is no longer used.

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/glyphs",
    "NextWave/source/methodBuilder/CodeType",
    "NextWave/source/methodBuilder/CodeName"],
    function (prototypes, settings, Point, Size, Area, glyphs, CodeType, CodeName) {

        try {

            // Constructor function.
        	var functionRet = function TypeMethodPair() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Name of this type object.
                    self.type = new CodeType();
                    // Name of this type object.
                    self.method = new CodeName();
                    // Indicates the type is highlighted.
                    self.highlight = false;

                    ////////////////////////
                    // Public methods.

                    // Reset names.
                    self.clearItems = function () {

                        try {

                            // Save off type and method.
                            self.type = new CodeType();
                            self.method = new CodeName();

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Initialize instance.
                    self.create = function (strType, strMethod) {

                    	try {

                    		// Save off type and method.
                    		self.type = new CodeType(strType || "");
                            // Since these are not draggable,
                            // set the collection to itself.
                            self.type.collection = self.type;
                            self.type.beforeChange = function () {

                                try {

                                    m_strTypeBefore = self.type.payload;
                                    return null;
                                } catch (e) {

                                    return e;
                                }
                            };
                            self.type.afterChange = function () {

                                try {

                                    // Ensure the value is unique.
                                    self.type.payload = window.manager.getUniqueName(self.type.payload,
                                        window.manager.types,
                                        "name",
                                        "payload");

                                    // Update.
                                    if (m_strTypeBefore !== self.type.payload) {

                                        return window.manager.editTypeName(m_strTypeBefore,
                                            self.type.payload);
                                    }
                                    return null;
                                } catch (e) {

                                    return e;
                                }
                            };
                            self.type.maxWidth = 100;

                    		self.method = new CodeName(strMethod || "");
                            // Since these are not draggable,
                            // set the collection to itself.
                            self.method.collection = self.method;
                            self.method.beforeChange = function () {

                                try {

                                    m_strMethodBefore = self.method.payload;
                                    return null;
                                } catch (e) {

                                    return e;
                                }
                            };
                            self.method.afterChange = function () {

                                try {

                                    // Lookup the type from its name.
                                    var typeFromName = window.manager.getTypeFromName(self.type.payload);
                                    if (!typeFromName) {

                                        return null;
                                    }

                                    // Ensure the value is unique.
                                    self.method.payload = window.manager.getUniqueName(self.method.payload,
                                        typeFromName.methods.parts,
                                        "name");

                                    // Update.
                                    if (m_strMethodBefore !== self.method.payload) {

                                        return window.manager.editMethodName(typeFromName,
                                            m_strMethodBefore,
                                            self.method.payload);
                                    }
                                    return null;
                                } catch (e) {

                                    return e;
                                }
                            };
                            self.method.maxWidth = 200;

                    		return null;
                    	} catch (e) {

                    		return e;
                    	}
                    };

                    // Clear area.
                    self.calculateLayout = function (areaRender, contextRender) {

                        try {

                            m_area = areaRender;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Returns the width of this type.
                    self.getWidth = function (contextRender) {

                        contextRender.font = settings.typeMethodPair.font;
                        var dTextWidth = contextRender.measureText(" . ").width

                        dTextWidth += self.type.getWidth(contextRender);
                        dTextWidth += self.method.getWidth(contextRender);

                        return dTextWidth + 2 * settings.general.margin;
                    };

                    // Invoked when the mouse is pressed down over the type.
                    self.mouseDown = function (objectReference) {

                        try {

                            // If there is a highlight object set.
                            if (m_objectHighlight) {

                                return window.manager.setFocus(m_objectHighlight);
                            }
                            return null;                        
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved over the type.
                    self.mouseMove = function (objectReference) {

                        try {

                            var objectOriginalHighlight = m_objectHighlight;

                            // Test the two objects.
                            var bRet = self.type.pointIn(objectReference.contextRender, 
                                objectReference.pointCursor);
                            if (bRet) {

                                m_objectHighlight = self.type;
                            } else {

                                bRet = self.method.pointIn(objectReference.contextRender, 
                                    objectReference.pointCursor);
                                if (bRet) {

                                    m_objectHighlight = self.method;
                                }
                            }

                            // Test a changed highlight object.
                            if (m_objectHighlight !== objectOriginalHighlight) {

                                if (objectOriginalHighlight) {

                                    objectOriginalHighlight.highlight = false;
                                }
                                m_objectHighlight.highlight = true;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved out of this type.
                    self.mouseOut = function (objectReference) {

                        try {

                            // If there is a highlight object set.
                            if (m_objectHighlight) {

                                m_objectHighlight.highlight = false;
                                m_objectHighlight = null;
                            }
                            return null;                        
                        } catch (e) {

                            return e;
                        }
                    };

                    // Test if the point is in this Type.
                    self.pointIn = function (contextRender, point) {

                        // Return false if never rendered.
                        if (!m_area) {

                            return false;
                        }

                        // Return hit-test against generated path.
                        return m_area.pointInArea(contextRender,
                            point);
                    }

                    // Render out this type.
                    self.render = function (contextRender) {

                        try {

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            contextRender.font = settings.typeMethodPair.font;

                            // Render the type CodeType.
                            exceptionRet = self.type.render(contextRender, 
                                m_area,
                                0);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Get the width of the type and the " . "-string.
                            var dDotWidth = contextRender.measureText(" . ").width
                            var dTypeWidth = self.type.getWidth(contextRender);

                            // Render the dot-separator.
                            contextRender.fillStyle = settings.general.fillText;
                            contextRender.fillText(" . ",
                                m_area.location.x + dTypeWidth,
                                m_area.location.y + settings.general.margin,
                                m_area.extent.width - 2 * settings.general.margin);

                            // Render the type CodeName.
                            exceptionRet = self.method.render(contextRender, 
                                m_area,
                                dDotWidth + dTypeWidth);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // The area, relative to the canvas, occupied by this instance.
                    var m_area = null;
                    // Remember which object has the highlight.
                    var m_objectHighlight = null;
                    // Value of type before type change.
                    var m_strTypeBefore = null;
                    // Value of method before method change.
                    var m_strMethodBefore = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
