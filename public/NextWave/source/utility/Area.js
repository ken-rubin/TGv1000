﻿///////////////////////////////////////
// Area module.
//
// Represents a 2-dimensional area of a plane.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "utility/settings",
    "utility/Point",
    "utility/Size"],
    function (prototypes, settings, Point, Size) {

        try {

            // Constructor function.
        	var functionRet = function Area(pointLocation, sizeExtent) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Location of this self.
                    self.location = pointLocation || new Point();
                    // Extent of this self.
                    self.extent = sizeExtent || new Size();

                    ///////////////////////
                    // Public methods.

                    // Make a copy.
                    self.clone = function () {

                        return new Area(self.location.clone(),
                            self.extent.clone());
                    };                 

                    // Generate path for the pinched rounded rect.
                    self.generateRectPath = function (contextRender) {
                        
                        try {

                            // Simple square rect....
                            contextRender.beginPath();
                            contextRender.moveTo(self.location.x,
                                    self.location.y);
                            contextRender.lineTo(self.location.x + self.extent.width,
                                    self.location.y);
                            contextRender.lineTo(self.location.x + self.extent.width,
                                    self.location.y + self.extent.height);
                            contextRender.lineTo(self.location.x,
                                    self.location.y + self.extent.height);
                            contextRender.closePath();
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Generate path for the pinched rounded rect.
                    self.generateRoundedRectPath = function (contextRender) {
                        
                        try {

                            // Calculate a good, relative corner radius.
                            var dCornerRadius = settings.area.cornerRadius;

                            // Generate the rounded path.
                            contextRender.beginPath();
                            contextRender.moveTo(self.location.x,
                                    self.location.y + dCornerRadius);
                            contextRender.lineTo(self.location.x,
                                    (self.location.y + self.extent.height) - dCornerRadius);
                            contextRender.quadraticCurveTo(self.location.x,
                                    (self.location.y + self.extent.height),
                                    (self.location.x + dCornerRadius),
                                    (self.location.y + self.extent.height));

                            contextRender.lineTo((self.location.x + self.extent.width) - dCornerRadius,
                                    (self.location.y + self.extent.height));

                            contextRender.quadraticCurveTo((self.location.x + self.extent.width),
                                    (self.location.y + self.extent.height),
                                    (self.location.x + self.extent.width),
                                    (self.location.y + self.extent.height) - dCornerRadius);

                            contextRender.lineTo((self.location.x + self.extent.width),
                                    (self.location.y + dCornerRadius));

                            contextRender.quadraticCurveTo((self.location.x + self.extent.width),
                                    self.location.y,
                                    (self.location.x + self.extent.width) - dCornerRadius,
                                    self.location.y);

                            contextRender.lineTo((self.location.x + dCornerRadius),
                                    (self.location.y));

                            contextRender.quadraticCurveTo(self.location.x,
                                    self.location.y,
                                    self.location.x,
                                    self.location.y + dCornerRadius);

                            contextRender.closePath();

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    // Test if the point is in the self.
                    self.pointInArea = function (contextRender, point, bSimple) {

                        // First, try the coordinates.
                        if (point.x < self.location.x ||
                            point.x > self.location.x + self.extent.width ||
                            point.y < self.location.y ||
                            point.y > self.location.y + self.extent.height) {

                            return false;
                        }

                        // Don't compute the area, if simple compare--faster.
                        if (bSimple || true) {

                            return true;
                        }

                        // Generate path.
                        var exceptionRet = self.generateRoundedRectPath(contextRender); 
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        // Return hit-test against generated path.
                        return contextRender.isPointInPath(point.x,
                            point.y);
                    }
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
