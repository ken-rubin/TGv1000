///////////////////////////////////////
// TypeMethodPair module.
//
// Gui component for showing a method type name and method name.
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
    "utility/glyphs"],
    function (prototypes, settings, Point, Size, Area, glyphs) {

        try {

            // Constructor function.
        	var functionRet = function TypeMethodPair() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Name of this type object.
                    self.type = null;
                    // Name of this type object.
                    self.method = null;
                    // Indicates the type is highlighted.
                    self.highlight = false;

                    ////////////////////////
                    // Public methods.

                    // Initialize instance.
                    self.create = function (strType, strMethod) {

                    	try {

                    		// Save off type and name.
                    		self.type = strType || "type";
                    		self.method = strMethod || "method";

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
                        var dTextWidth = contextRender.measureText(self.type + "." + self.method).width

                        return dTextWidth + 2 * settings.general.margin;
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

                            // Fill and stroke the path.
                            if (window.draggingStatement || window.draggingExpression) {

                                contextRender.fillStyle = settings.general.fillDrag;
                                contextRender.strokeStyle = settings.general.strokeDrag;
                            } else if (self.highlight) {

                                contextRender.fillStyle = settings.general.fillBackgroundHighlight;
                                contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                            } else {

                                contextRender.fillStyle = settings.typeMethodPair.fillBackground;
                                contextRender.strokeStyle = settings.general.strokeBackground;
                            }
                            contextRender.fill();
                            contextRender.stroke();

                            // Render the type-name.
                            contextRender.font = settings.typeMethodPair.font;
                            contextRender.fillStyle = settings.general.fillText;
                            contextRender.fillText(self.type + "." + self.method,
                                m_area.location.x + settings.general.margin,
                                m_area.location.y + settings.general.margin,
                                m_area.extent.width - 2 * settings.general.margin);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // The area, relative to the canvas, occupied by this instance.
                    var m_area = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
