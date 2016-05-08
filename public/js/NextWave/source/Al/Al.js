///////////////////////////////////////
// Al module.
//
// GUI character based help system.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area"],
    function (prototypes, Point, Size, Area) {

        try {

            // Constructor function.
        	var functionRet = function Al() {

                try {

            		var self = this;                        // Uber closure.

                    /////////////////////////
                    // Public fields.

                    // Define the object to render.
                    self.object = {

                        angle: 90 * Math.PI / 180,
                        length: 50,
                        mutator: function (objectThis, iMS) {

                            objectThis.length = 60 + 50.0 * Math.sin(iMS / 570);
                            return null;
                        },
                        lineWidth: 10,
                        strokeStyle: "blue",
                        lineCap: "round",
                        children: [

                            {

                                angle: 15 * Math.PI / 180,
                                length: 50,
                                mutator: function (objectThis, iMS) {

                                    objectThis.angle += 0.01;
                                    objectThis.length = 60 + 50 * Math.cos(iMS / 500);
                                    objectThis.lineWidth = 30 + 20 * Math.cos(iMS / 500);
                                    return null;
                                },
                                type: "circle",
                                lineWidth: 15,
                                strokeStyle: "yellow",
                                children: [

                                    {

                                        angle: 15 * Math.PI / 180,
                                        length: 50,
                                        strokeStyle: "rgba(100, 100, 0, 0.52)",
                                        children: [

                                            {

                                                angle: 15 * Math.PI / 180,
                                                mutator: function (objectThis, iMS) {

                                                    objectThis.angle -= 0.05;
                                                    objectThis.strokeStyle = "rgba(100, 0, 0, " + 
                                                        (0.5 + 0.5 * Math.sin(iMS / 100)).toFixed(3) + 
                                                        ")";
                                                    return null;
                                                },
                                                length: 50
                                            }, {

                                                angle: -15 * Math.PI / 180,
                                                length: 150,
                                                fillStyle: "#050",
                                                type: "text",
                                                font: "32px Arial",
                                                text: "\"Hi, I'm Al.\"",
                                                children: [

                                                    {

                                                        angle: -15 * Math.PI / 180,
                                                        length: 50,
                                                        mutator: function (objectThis, iMS) {

                                                            objectThis.angle += -0.01;
                                                            return null;
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }, {

                                angle: -15 * Math.PI / 180,
                                length: 50,
                                children: [

                                    {

                                        angle: -15 * Math.PI / 180,
                                        mutator: function (objectThis, iMS) {

                                            objectThis.angle += -0.01;
                                            return null;
                                        },
                                        length: 50,
                                        lineWidth: 4,
                                        strokeStyle: "peru",
                                        children: [

                                            {

                                                angle: -15 * Math.PI / 180,
                                                length: 50
                                            }
                                        ]
                                    }
                                ]
                            }, {

                                angle: -45 * Math.PI / 180,
                                mutator: function (objectThis, iMS) {

                                    objectThis.angle += 0.03;
                                    return null;
                                },
                                length: 50,
                                lineWidth:25,
                                strokeStyle: "rgba(24, 66, 100, 0.5)"
                            }
                        ]
                    };

                    /////////////////////////
                    // Public methods.

                    // Create the Al instance.
                    self.create = function () {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    }

                    // Render Al.
                    self.render = function (contextRender, iMS, pointRender, dRadians) {

                        try {

                            // Save state.
                            contextRender.save();

                            // All text is centered.
                            contextRender.textBaseline = "middle";

                            // Translate the object to the center.
                            contextRender.translate(pointRender.x,
                                pointRender.y);
                            contextRender.rotate(-dRadians);

                            // Render the object.
                            return m_functionRenderHierarchy(contextRender,
                                iMS,
                                self.object);
                        } catch (e) {

                            return e;
                        } finally {

                            // Restore.
                            contextRender.restore();
                        }
                    };

                    ////////////////////////
                    // Private methods.

                    // Recursively render out object.
                    var m_functionRenderHierarchy = function (contextRender, iMS, objectItem) {

                        try {

                            // Extract data members.
                            var dRadians = objectItem.angle;
                            var dLength = objectItem.length;
                            var arrayChildren = objectItem.children;
                            var dLineWidth = objectItem.lineWidth;
                            var strStrokeStyle = objectItem.strokeStyle;
                            var strFillStyle = objectItem.fillStyle;
                            var strLineCap = objectItem.lineCap;
                            var strFont = objectItem.font;
                            var functionMutator = objectItem.mutator;
                            var strType = objectItem.type;

                            // Apply styling, if specified.
                            if (dLineWidth) {

                                contextRender.lineWidth = dLineWidth;
                            }
                            if (strStrokeStyle) {

                                contextRender.strokeStyle = strStrokeStyle;
                            }
                            if (strFillStyle) {

                                contextRender.fillStyle = strFillStyle;
                            }
                            if (strLineCap) {

                                contextRender.lineCap = strLineCap;
                            }
                            if (strFont) {

                                contextRender.font = strFont;
                            }

                            // Render this segment.
                            contextRender.rotate(-dRadians);

                            if (strType === "text") {

                                contextRender.fillText(objectItem.text,
                                    0, 0, 
                                    dLength);

                                // Update length, if not specified, otherwise it is pinned.
                                if (!dLength) {

                                    dLength = contextRender.measureText(objectItem.text).width;
                                }
                            } else if (strType === "circle") {

                                // Draw a circle.
                                contextRender.beginPath();
                                contextRender.arc(dLength / 2,
                                    0,
                                    dLength / 2,
                                    0,
                                    2 * Math.PI,
                                    false);
                                contextRender.stroke();
                            } else {

                                // Line is default.
                                contextRender.beginPath();
                                contextRender.moveTo(0,0);
                                contextRender.lineTo(dLength, 0);
                                contextRender.stroke();
                            }

                            contextRender.translate(dLength, 0);

                            // If children recurse.
                            var exceptionRet = null;
                            if (arrayChildren) {

                                // Process chldren.
                                for (var i = 0; i < arrayChildren.length; i++) {

                                    try {

                                        contextRender.save();

                                        // Process each child.
                                        exceptionRet = m_functionRenderHierarchy(contextRender,
                                            iMS,
                                            arrayChildren[i]);
                                        if (exceptionRet) {

                                            return exceptionRet;
                                        }
                                    } finally {

                                        contextRender.restore();
                                    }
                                }
                            }

                            // Process the mutator.
                            if (functionMutator) {

                                // Update this object.
                                exceptionRet = functionMutator(objectItem,
                                    iMS);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
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
