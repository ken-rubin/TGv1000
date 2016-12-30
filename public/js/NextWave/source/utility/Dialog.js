///////////////////////////////////////
// Dialog module.
//
// Loads, saves, and displays a dialog of controls.
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
    "NextWave/source/utility/Label",
    "NextWave/source/utility/Edit",
    "NextWave/source/utility/Button",
    "NextWave/source/utility/GlyphHost",
    "NextWave/source/utility/ListHost",
    "NextWave/source/utility/Accordion",
    "NextWave/source/utility/ParameterListHost",
    "NextWave/source/utility/StatementListHost",
    "NextWave/source/utility/Picture"],
    function (prototypes, settings, Point, Size, Area, Label, Edit, Button, GlyphHost, ListHost, Accordion, ParameterListHost, StatementListHost, Picture) {

        try {

            // Constructor function.
        	var functionRet = function Dialog() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Data source.
                    self.dataSource = null;
                    // Array of controls.
                    self.controls = [];
                    // Object of controls, by name.
                    self.controlObject = {};
                    // Size and location of dialog.
                    self.position = new Area();
                    // THe highlighted control, if non-null.
                    self.highlightControl = null;

                    ///////////////////////
                    // Public methods.

                    // Loop over all controls and clear.
                    self.clearItems = function () {

                        try {

                            // Clear all controls.
                            for (var i = 0; i < self.controls.length; i++) {

                                // Get the ith control.
                                var controlIth = self.controls[i];

                                // Call down to control.
                                var exceptionRet = controlIth.clear();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Create this dialog
                    self.create = function (objectConfiguration, mode) {

                        try {

                            if (m_bCreated) {

                                throw { message: "One may only create once." };
                            }

                            // Mode is optionally used with the objects in objectConfiguration.
                            // If !m_node, then all the objects behave normally, being created, always drawing, etc.
                            // If m_mode and objectControlIth.hasOwnProperty("modes"),
                            // then objectControlIth will be created and rendered only if m_mode is in objectControlIth.modes (an array of ints).

                            m_mode = mode || null;

                            // Process configuration.
                            var arrayKeys = Object.keys(objectConfiguration);

                            // Each key is a control and its configuration.
                            for (var i = 0; i < arrayKeys.length; i++) {

                                // Get the ith control key.
                                var strKeyIth = arrayKeys[i];

                                // Only process natural properties.
                                if (!objectConfiguration.hasOwnProperty(strKeyIth)) {

                                    continue;
                                }

                                // Get the control and ensure it is valid.
                                var objectControlIth = objectConfiguration[strKeyIth];
                                if (!objectControlIth) {

                                    continue;
                                }

                                // Read control type.
                                var strType = objectControlIth.type;

                                // Allocate and add.
                                var strEval = "new " + strType + "(";
                                if (objectControlIth.constructorParameterString) {

                                    strEval += objectControlIth.constructorParameterString;
                                }
                                strEval += ");";

                                var controlIth = eval(strEval);

                                // Set self in control.
                                controlIth.dialog = self;

                                // If modes was set in obectConfiguration property, add it here.
                                if (objectControlIth.hasOwnProperty("modes")) {

                                    controlIth.modes = objectControlIth.modes;
                                }

                                // Add control to collection of controls.
                                self.controls.push(controlIth);

                                // Also store in the control object.
                                self.controlObject[strKeyIth] = controlIth;

                                // Put its configuration inside it.
                                var exceptionRet = controlIth.create(objectControlIth);
                                if (exceptionRet) {

                                    return new Error(objectControlIth.type + objectControlIth.text); // exceptionRet;
                                }
                            }

                            return null;
                        } catch (x) {

                            return x;
                        }
                    };

                    // Pick focus element.
                    self.mouseMove = function (objectReference) {

                        try {

                            // Can't do much if no position.
                            if (!self.position) {

                                return null;
                            }

                            // Reset highlight.
                            var exceptionRet = self.mouseOut(objectReference);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Loop over all controls.
                            for (var i = 0; i < self.controls.length; i++) {

                                // Get the ith control.
                                var controlIth = self.controls[i];

                                // If control contains point, then highlight.
                                var bRet = controlIth.pointIn(objectReference.renderContent, 
                                    objectReference.pointCursor);
                                if (bRet && !controlIth.hasOwnProperty("isPictureListItem")) {

                                    self.highlightControl = controlIth;
                                    self.highlightControl.highlight = true;

                                    if ($.isFunction(self.highlightControl.mouseMove)) {

                                        // Call and pass mousemove.
                                        return self.highlightControl.mouseMove(objectReference);
                                    }
                                    break;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is pressed down over the type.
                    self.mouseDown = function (objectReference) {

                        try {

                            // Only care about mouse down if over some regon.
                            if (self.highlightControl) {

                                // Store the cursor item as the focus object.
                                var exceptionRet = window.manager.setFocus(self.highlightControl);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }

                                // Call if function.
                                if ($.isFunction(self.highlightControl.mouseDown)) {

                                    var exceptionRet = self.highlightControl.mouseDown(objectReference);
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

                    // Invoked when the mouse is let up over the type.
                    self.mouseUp = function (objectReference) {

                        try {

                            // Only care about mouse down if over some regon.
                            if (self.highlightControl &&
                                $.isFunction(self.highlightControl.mouseUp)) {

                                return self.highlightControl.mouseUp(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse wheel is spun over the type.
                    self.mouseWheel = function (objectReference) {

                        try {

                            // Only care about mouse down if over some regon.
                            if (self.highlightControl &&
                                $.isFunction(self.highlightControl.mouseWheel)) {

                                return self.highlightControl.mouseWheel(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is clicked over the type.
                    self.click = function (objectReference) {

                        try {

                            // Only care about mouse down if over some region.
                            if (self.highlightControl &&
                                $.isFunction(self.highlightControl.click)) {

                                    // But ignore if self.highlightControl has the property "modes" and m_mode doesn't match one of self.highlightControl.modes's array elements.
                                    if (m_mode && self.highlightControl.hasOwnProperty("modes") && !self.highlightControl.modes.includes(m_mode)) {

                                        return null;
                                    }

                                    return self.highlightControl.click(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved out of the type.
                    self.mouseOut = function (objectReference) {

                        try {

                            // Reset highlight.
                            if (self.highlightControl) {

                                // Don't check return...just a mouse out.
                                if ($.isFunction(self.highlightControl.mouseOut)) {

                                    self.highlightControl.mouseOut(objectReference);
                                }
                                if (self.highlightControl.hasOwnProperty("highlight") && typeof self.highlightControl !== "PictureListItem") {

                                    self.highlightControl.highlight = false;
                                }
                                self.highlightControl = null;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Position object.
                    self.calculateLayout = function (areaMaximal, contextRender) {

                        try {

                            self.position = areaMaximal;

                            // Calculate position of all controls.
                            for (var i = 0; i < self.controls.length; i++) {

                                // Get the ith control.
                                var controlIth = self.controls[i];

                                // Its configuration determines its location, 
                                // given the dialog's current position.
                                var dX = self.position.location.x;
                                if (controlIth.configuration.xType === "configuration" ||
                                    !controlIth.configuration.xType) {

                                    dX += controlIth.configuration.x;
                                } else if (controlIth.configuration.xType === "callback") {

                                    dX += controlIth.configuration.x(areaMaximal);
                                } else if (controlIth.configuration.xType === "reserve") {

                                    dX += areaMaximal.extent.width - controlIth.configuration.x;
                                }

                                var dY = self.position.location.y;
                                if (controlIth.configuration.yType === "configuration" ||
                                    !controlIth.configuration.yType) {

                                    dY += controlIth.configuration.y;
                                } else if (controlIth.configuration.yType === "callback") {

                                    dY += controlIth.configuration.y(areaMaximal);
                                } else if (controlIth.configuration.yType === "reserve") {

                                    dY += areaMaximal.extent.height - controlIth.configuration.y;
                                }

                                var dWidth = 0;
                                if (controlIth.configuration.widthType === "configuration" ||
                                    !controlIth.configuration.widthType) {

                                    dWidth = controlIth.configuration.width;
                                } else if (controlIth.configuration.widthType === "callback") {

                                    dWidth = controlIth.configuration.width(areaMaximal);
                                } else if (controlIth.configuration.widthType === "reserve") {

                                    dWidth = areaMaximal.extent.width - controlIth.configuration.width;
                                }

                                var dHeight = 0;
                                if (controlIth.configuration.heightType === "configuration" ||
                                    !controlIth.configuration.heightType) {

                                    dHeight = controlIth.configuration.height;
                                } else if (controlIth.configuration.heightType === "callback") {

                                    dHeight = controlIth.configuration.height(areaMaximal);
                                } else if (controlIth.configuration.heightType === "reserve") {

                                    dHeight = areaMaximal.extent.height - controlIth.configuration.height;
                                }

                                // Set the layout for the controls.
                                var exceptionRet = controlIth.calculateLayout(new Area(new Point(dX, 
                                        dY),
                                    new Size(dWidth,
                                        dHeight)),
                                    contextRender);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render object.
                    self.render = function (contextRender) {

                        try {

                            // Render each control.
                            for (var i = 0; i < self.controls.length; i++) {

                                // Get the ith control.
                                var controlIth = self.controls[i];

                                // Render controlIth iff it doesn't have the property "modes" or it does and m_mode matches one controlIth.modes's array elements.
                                // Otherwise, just skip it for this render loop.
                                if (!m_mode || (m_mode && controlIth.hasOwnProperty("modes") && controlIth.modes.includes(m_mode))) {

                                    // Set the layout for the controls.
                                    var exceptionRet = controlIth.render(contextRender);
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

                    // Change m_mode due to user action in derived class.
                    self.setMode = function(mode) {

                        m_mode = mode;

                        // With m_mode changed, we want to reset and re-render all objects.
                        // That may happen automatically in the render loop.
                    }

                    // Return m_mode to someone.
                    self.getMode = function () {

                        return m_mode;
                    }

                    //////////////////////
                    // Private fields.

                    // Indicates so.
                    var m_bCreated = false;
                    var m_mode = null;

                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
