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
    "NextWave/source/methodBuilder/StatementList"],
    function (prototypes, settings, Point, Size, Area, Control, StatementList) {

        try {

            // Constructor function.
        	var functionRet = function StatementListHost() {

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
                    self.statementList = new StatementList();

                    ///////////////////////
                    // Public methods.

                    // Render object.
                    self.render = function (contextRender) {

                        try {

                            return self.statementList.render(contextRender);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
                    self.mouseMove = function (objectReference) {

                        return self.statementList.mouseMove(objectReference);
                    };

                    // Pass to payload.
                    self.mouseUp = function (objectReference) {

                        return self.statementList.mouseUp(objectReference);
                    };

                    // Pass to payload.
                    self.mouseDown = function (objectReference) {

                        return self.statementList.mouseDown(objectReference);
                    };

                    // Pass to payload.
                    self.mouseOut = function (objectReference) {

                        return self.statementList.mouseOut(objectReference);
                    };

                    // Pass to payload.
                    self.mouseWheel = function (objectReference) {

                        return self.statementList.mouseWheel(objectReference);
                    };

                    // Pass to payload.
                    self.click = function (objectReference) {

                        return self.statementList.click(objectReference);
                    };

                    // Give derived modules a crack at the create pipeline.
                    self.innerCreate = function () {

                        return self.statementList.create();
                    };

                    // Give derived modules a crack at the layout pipeline.
                    self.innerCalculateLayout = function (areaMaximal, contextRender) {

                        return self.statementList.calculateLayout(areaMaximal, contextRender);
                    };

                    // Clear list.
                    self.innerClear = function () {

                        try {

                            // Clear out list.
                            return self.statementList.self.clearItems();
                        } catch (e) {

                            return e;
                        }
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
