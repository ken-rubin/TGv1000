///////////////////////////////////////
// DialogHost module.
//
// Implements standard methods for dialog .
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
    "NextWave/source/utility/Dialog"],
    function (prototypes, settings, Point, Size, Area, Dialog) {

        try {

            // Constructor function.
        	var functionRet = function DialogHost() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // The dialog holds all controls.
                    self.dialog = new Dialog();

                    // Set this host in the dialog.
                    self.dialog.host = self;

                    ///////////////////////
                    // Public methods.

                    // Clear out state.
                    self.clearItems = function () {

                        return self.dialog.clearItems();
                    };

                    // Invoked when the mouse is moved over the tree.
                    self.mouseMove = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.mouseMove)) {

                                return self.dialog.mouseMove(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved away from the canvas.
                    self.mouseOut = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.mouseOut)) {

                                return self.dialog.mouseOut(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is pressed down over the canvas.
                    self.mouseDown = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.mouseDown)) {

                                return self.dialog.mouseDown(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is let up over the canvas.
                    self.mouseUp = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.mouseUp)) {

                                return self.dialog.mouseUp(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is clicked over the canvas.
                    self.click = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.click)) {

                                return self.dialog.click(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse wheel is scrolled over the canvas.
                    self.mouseWheel = function (objectReference) {

                        try {

                            if (self.dialog &&
                                $.isFunction(self.dialog.mouseWheel)) {

                                return self.dialog.mouseWheel(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Calculate the section rectangles.
                    self.calculateLayout = function (areaMaximal, contextRender) {

                        try {

                            // Render the dialog (payload).
                            var exceptionRet = self.dialog.calculateLayout(areaMaximal, 
                                contextRender);
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

                            // Render the dialog (payload).
                            var exceptionRet = self.dialog.render(contextRender);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
