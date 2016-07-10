﻿///////////////////////////////////////
// Events module.
//
// A TypeSection which manages all the events for a Type.
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
    "NextWave/source/type/TypeSection"],
    function (prototypes, settings, Point, Size, Area, TypeSection) {

        try {

            // Constructor function.
        	var functionRet = function Events(typeOwner, arrayEvents) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from TypeSection.
                    self.inherits(TypeSection,
                        typeOwner,
                        "Events",
                        "events",
                        arrayEvents);

                    ///////////////////////////
                    // Public methods.

                    // Virtual method, defaults to method, override if not desired.
                    self.createMethod = function () {

                        return "createEvent";
                    };

                    // Generates JavaScript string for the properties.
                    self.generateJavaScript = function () {

                        var strEvents = " ";

                        // If there are properties, then build their JavaScript.
                        if (self.parts) {

                            for (var i = 0; i < self.parts.length; i++) {

                                // Extract and save the property.
                                var eventIth = self.parts[i];
                                var strEvent = eventIth.generateJavaScript();

                                // Add it to the result object.
                                strEvents += strEvent;
                            }
                        }

                        strEvents += " ";

                        return strEvents;
                    };

                    // Save.
                    self.save = function () {

                        var arrayRet = [];

                        // If there are events, then save them.
                        if (self.parts) {

                            for (var i = 0; i < self.parts.length; i++) {

                                // Extract and save the events.
                                var eventIth = self.parts[i];
                                var objectEvent = eventIth.save();

                                // Add it to the result object.
                                arrayRet.push(objectEvent);
                            }
                        }

                        return arrayRet;
                    };
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Inherit from TypeSection.
            functionRet.inheritsFrom(TypeSection);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
