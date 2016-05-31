///////////////////////////////////////
// StatementListHost module.
//
// Hosts a statement list.
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
    "NextWave/source/utility/Control",
    "NextWave/source/methodBuilder/ParameterList",
    "NextWave/source/methodBuilder/Parameter"],
    function (prototypes, settings, Point, Size, Area, Control, ParameterList, Parameter) {

        try {

            // Constructor function.
        	var functionRet = function ParameterListHost() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from Control.  Call parent Control
                    // constructor.  Pass parameters, if specified.
                    self.inherits(Control);

                    ///////////////////////
                    // Public fields.

                    // Indicate if this object is highlighted.
                    self.highlight = false;
                    // The hosted object.
                    self.parameterList = new ParameterList(false);

                    ///////////////////////
                    // Public methods.

                    // Render object.
                    self.render = function (contextRender) {

                        return self.parameterList.render(contextRender);
                    };

                    // Pass to payload.
                    self.mouseMove = function (objectReference) {

                        return self.parameterList.mouseMove(objectReference);
                    };

                    // Pass to payload.
                    self.mouseUp = function (objectReference) {

                        return self.parameterList.mouseUp(objectReference);
                    };

                    // Pass to payload.
                    self.mouseDown = function (objectReference) {

                        return self.parameterList.mouseDown(objectReference);
                    };

                    // Pass to payload.
                    self.mouseOut = function (objectReference) {

                        return self.parameterList.mouseOut(objectReference);
                    };

                    // Pass to payload.
                    self.mouseWheel = function (objectReference) {

                        return self.parameterList.mouseWheel(objectReference);
                    };

                    // Pass to payload.
                    self.click = function (objectReference) {

                        return self.parameterList.click(objectReference);
                    };

                    // Clear list.
                    self.innerClear = function () {

                        try {

                            // Clear out list.
                            return self.parameterList.self.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Give derived modules a crack at the create pipeline.
                    self.innerCreate = function () {

                        return self.parameterList.create();
                    };

                    // Give derived modules a crack at the layout pipeline.
                    self.innerCalculateLayout = function (areaMaximal, contextRender) {

                        return self.parameterList.calculateLayout(areaMaximal, contextRender);
                    };
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Inherit from Control.  Wire 
            // up prototype chain to Control.
            functionRet.inheritsFrom(Control);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
