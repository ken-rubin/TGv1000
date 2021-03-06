﻿///////////////////////////////////////
// Control module.
//
// Holds base information for all dialog controls.
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
        	var functionRet = function Control() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Extent of this self.
                    self.position = new Area();
                    // Configuration attributes for this control.
                    self.configuration = null;
                    // The owner dialog.
                    self.dialog = null;
                    // If protected, no editing, combo or checkbox changes, button clicking, etc. allowed.
					// But visibility is usually true, managed by self.visible.
                    self.protected = false;
					self.visible = true;
                    // Condition specific owner object--really the
                    // container of this control outside of a dialog.
                    self.owner = null;

                    ///////////////////////
                    // Public methods.

                    // Set protected mode.
                    self.setProtected = function(bProtected) {

                        self.protected = bProtected;
						return null;
                    }

                    // Set visibility.
                    self.setVisible = function(bVisible) {

                        self.visible = bVisible;
						return null;
                    }

					// Set both.
					self.setPandV = function(bProtected, bVisible) {

						self.protected = bProtected;
						self.visible = bVisible;
					}

                    // Clear data.
                    self.clear = function () {

                        try {

                            // Call down to derived.
                            return self.innerClear();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Create this instance.  Specify configuration.
                    self.create = function (objectConfiguration) {

                        try {

                            // Save off the position.
                            self.configuration = objectConfiguration;

                            // Call down to derived.
                            return self.innerCreate();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Test if the point is in this instance.
                    self.pointIn = function (contextRender, point) {

                        // Return false if never rendered.
                        if (!self.position) {

                            return false;
                        }

                        // Return hit-test against path.
                        return self.position.pointInArea(contextRender,
                            point);
                    };

                    // Position object.
                    self.calculateLayout = function (areaMaximal, contextRender) {

                        try {

                            self.position = areaMaximal;

                            return self.innerCalculateLayout(areaMaximal,
                                contextRender);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Give derived modules a crack at the layout pipeline.
                    self.innerCalculateLayout = function (areaMaximal, contextRender) {

                        return null;
                    };

                    // Used when a Control-derived object has to do so.
                    self.recreate = function () {

                        return self.innerCreate();
                    }

                    // Give derived modules a crack at the create pipeline.
                    self.innerCreate = function () {

                        return null;
                    };

                    // Inner clear data.
                    self.innerClear = function () {

                        return null;
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
