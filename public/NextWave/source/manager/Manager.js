///////////////////////////////////////
// Manager module.
//
// Main interface module with the outside world.
// Responsible for the root Canvas object and
// establishing event handlers for mouse and touch
// events and propogating down through the layers.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "utility/settings",
    "utility/Area",
    "utility/Point",
    "utility/Size",
    "manager/Layer",
    "manager/LayerBackground",
    "manager/LayerPanels",
    "manager/LayerDebug",
    "manager/LayerDrag",
    "expression/Expression",
    "literal/Literal",
    "statement/Statement",
    "name/Name",
    "methodBuilder/CodeExpression",
    "methodBuilder/CodeStatement",
    "methodBuilder/Parameter",
    "type/Type"],
    function (prototypes, settings, Area, Point, Size, Layer, LayerBackground, LayerPanels, LayerDebug, LayerDrag, Expression, Literal, Statement, Name, CodeExpression, CodeStatement, Parameter, Type) {

        try {

            // Constructor function.
        	var functionRet = function Manager() {

                try {

            		var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public fields.

                    // Hold reference to the drag layer.
                    self.dragLayer = null;

                    ////////////////////////
                    // Public methods.

                    // Initialze instance.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
                            }

                            // Store the manager in window, 
                            // so it is universally accessible.
                            window.manager = self;

                            // Allocate and create the background layer.
                            var lb = new LayerBackground();
                            var exceptionRet = lb.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate and create the regions layer.
                            var lp = new LayerPanels();
                            exceptionRet = lp.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate and create the debug layer.
                            var ld = new LayerDebug();
                            exceptionRet = ld.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate and create the drag layer.
                            self.dragLayer = new LayerDrag();
                            exceptionRet = self.dragLayer.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Save off the layers.
                            m_arrayLayers = [lb, lp, ld, self.dragLayer];

                            // Get the parent references.
                            m_jqParent = $(settings.manager.hostSelector);
                            if (m_jqParent.length === 0) {

                                throw { message: "Failed to select parent element: " + settings.manager.hostSelector };
                            }

                            // Create the render canvas.
                            m_canvasRender = document.createElement("canvas");
                            m_canvasRender.id = "LayerManagerSurface";
                            m_canvasRender.tabIndex = "1";
                            m_contextRender = m_canvasRender.getContext("2d");
                            m_jqCanvas = $(m_canvasRender);
                            m_jqCanvas.css({

                                    position: "absolute"
                                });
                            m_jqParent.append(m_canvasRender);

                            // Hook the resize to update the size of the dashboard when the browser is resized.
                            $(window).bind("resize",
                                m_functionWindowResize);

                            // Wire events to canvas.
                            m_jqCanvas.bind("mouseup",
                                m_functionMouseUp);
                            m_jqCanvas.bind("mousedown",
                                m_functionMouseDown);
                            m_jqCanvas.bind("mousemove",
                                m_functionMouseMove);
                            m_jqCanvas.bind("mousewheel", 
                                m_functionMouseWheel);
                            m_jqCanvas.bind("mouseout",
                                m_functionMouseOut);

                            // Start the rendering.
                            m_iAnimationFrameSequence = requestAnimationFrame(m_functionRender);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set the drag object.
                    self.setDragObject = function (objectDrag) {

                        try {

                            // Only certain types can drag.
                            if (objectDrag instanceof Expression ||
                                objectDrag instanceof Literal ||
                                objectDrag instanceof Statement ||
                                objectDrag instanceof Name ||
                                objectDrag instanceof CodeExpression ||
                                objectDrag instanceof CodeStatement) {

                                // Pass to layer.
                                return self.dragLayer.setDragObject(objectDrag);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private methods.

                    // Calculate e.offsetX and e.offsetY 
                    // if they are undefined (as in Firefox).
                    var m_functionPossibleFirefoxAdjustment = function (e) {

                        try {
                            
                            // Check...
                            if (e.offsetX !== undefined &&
                                e.offsetY !== undefined)
                                return null;

                            // ... else, calculate.
                            e.offsetX = e.pageX - m_jqParent.offset().left;
                            e.offsetY = e.pageY - m_jqParent.offset().top;

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    // Invoked when the browser is resized.
                    // Implemented to recalculate the regions
                    // and re-render the display elements.
                    var m_functionWindowResize = function (e) {

                        try {

                            // Setting dirty causes the next render to calculate layout.
                            m_bDirty = true;
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is moved over the canvas.
                    // Implemented to pass on to managed layers, of course.
                    var m_functionMouseMove = function (e) {

                        try {

                            // Possibly normalize input in firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Save the point to which the cursor has moved.
                            // If this is sufficiently far, a drag has staret.
                            var pointMove = new Point(e.offsetX, e.offsetY);

                            // Pass to layers from front to back and stop when handled.
                            // Object reference holds all the data that any layer or
                            // subsequently owned object could ever need to support event.
                            var objectReference = {

                                manager: self,                      // Catch-all....
                                canvas: m_canvasRender,
                                contextRender: m_contextRender,
                                pointCursor: pointMove,
                                handled: false,
                                event: e,
                                cursor: "default"
                            };
                            for (var i = m_arrayLayers.length - 1; i >= 0; i--) {

                                // Pass to the layer.
                                exceptionRet = m_arrayLayers[i].mouseMove(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // Only one thing can intersect the mouse at a time.
                                if (objectReference.handled) {

                                    break;
                                }
                            }

                            // Test for drag start.
                            if (m_pointDown &&
                                !self.dragLayer.down) {

                                // Start dragging if move sufficiently.
                                var dDistance = m_pointDown.distance(pointMove);
                                if (dDistance > settings.manager.dragDistance) {

                                    // Start dragging.
                                    exceptionRet = self.dragLayer.startDrag(m_pointDown,
                                        pointMove);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }

                            // Alwasys set the cursor in mouse move.
                            m_canvasRender.style.cursor = objectReference.cursor;
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is pressed down over the canvas.
                    // Implemented to pass on to managed layers, as with move.
                    var m_functionMouseDown = function (e) {

                        try {

                            // Possibly normalize input in firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Handle dragging.
                            m_pointDown = new Point(e.offsetX, e.offsetY);

                            // Pass to layers from front to back and stop when handled.
                            var objectReference = {

                                manager: self,                      // Catch-all....
                                canvas: m_canvasRender,
                                contextRender: m_contextRender,
                                pointCursor: m_pointDown,
                                handled: false,
                                event: e
                            };
                            for (var i = m_arrayLayers.length - 1; i >= 0; i--) {

                                // Pass to the layers.
                                var exceptionRet = m_arrayLayers[i].mouseDown(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // Only one thing can intersect the mouse at a time.
                                if (objectReference.handled) {

                                    break;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is let up over the canvas.
                    // Implemented to pass on to managed layers, as with move.
                    var m_functionMouseUp = function (e) {

                        try {

                            // Possibly normalize input in firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Pass to layers from front to back and stop when handled.
                            var objectReference = {

                                manager: self,                      // Catch-all....
                                canvas: m_canvasRender,
                                contextRender: m_contextRender,
                                pointCursor: new Point(e.offsetX, e.offsetY),
                                handled: false,
                                event: e
                            };
                            for (var i = m_arrayLayers.length - 1; i >= 0; i--) {

                                // Pass to the layers.
                                var exceptionRet = m_arrayLayers[i].mouseUp(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // Only one thing can intersect the mouse at a time.
                                if (objectReference.handled) {

                                    break;
                                }
                            }

                            // If point down, might be dragging.
                            if (m_pointDown) {

                                // If down, then dragging.
                                if (self.dragLayer.down) {

                                    // Possibly consumate the drag.
                                    exceptionRet = self.dragLayer.consumateDrag();
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }

                                // Clear point down.
                                m_pointDown = null;
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse wheel is manipulated.
                    // Implemented to pass on to managed regions.
                    var m_functionMouseWheel = function (e) {

                        try {

                            // Possibly normalize input in firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Pass to layers from front to back and stop when handled.
                            var objectReference = {

                                manager: self,                      // Catch-all....
                                canvas: m_canvasRender,
                                contextRender: m_contextRender,
                                pointCursor: new Point(e.offsetX, e.offsetY),
                                handled: false,
                                event: e
                            };
                            for (var i = m_arrayLayers.length - 1; i >= 0; i--) {

                                // Pass to the layers.
                                var exceptionRet = m_arrayLayers[i].mouseWheel(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // Only one thing can intersect the mouse at a time.
                                if (objectReference.handled) {

                                    break;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is moved away from the canvas.
                    // Implemented to pass on to managed regions, in reverse.
                    var m_functionMouseOut = function (e) {

                        try {

                            // Pass to layers from front to back and stop when handled.
                            var objectReference = {

                                manager: self,                      // Catch-all....
                                canvas: m_canvasRender,
                                contextRender: m_contextRender,
                                pointCursor: new Point(e.offsetX, e.offsetY),
                                handled: false,
                                event: e
                            };

                            // Count backwards, slowly from ten, ....
                            for (var i = m_arrayLayers.length - 1; i >= 0; i--) {

                                // Pass to the layer.
                                var exceptionRet = m_arrayLayers[i].mouseOut(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // Clear point down.
                            if (m_pointDown) {

                                m_pointDown = null;

                                // Also stop dragging.
                                var exceptionRet = self.dragLayer.cancelDrag();
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Calculate the section rectangles.
                    var m_functionCalculateLayout = function () {

                        try {

                            // Get the size from the container, 
                            // if possible, or default (?).
                            m_dWidth = m_jqParent.width();
                            if (m_dWidth === undefined || 
                                m_dWidth === 0) {

                                m_dWidth = settings.manager.defaultWidth;
                            }
                            m_dHeight = m_jqParent.height();
                            if (m_dHeight === undefined || 
                                m_dHeight === 0) {

                                m_dHeight = settings.manager.defaultHeight;
                            }

                            // Update canvas sizes--do this last to minimize the time that the canvas is blank.
                            m_canvasRender.width = m_dWidth;
                            m_canvasRender.height = m_dHeight;

                            // Also adjust the CSS values so the canvas never scales.
                            m_jqCanvas.css({

                                width: m_dWidth.toString() + "px",
                                height: m_dHeight.toString() + "px"
                            });

                            // Possibly not neccessary to refresh this?
                            m_contextRender = m_canvasRender.getContext("2d");
                            m_contextRender.textBaseline = "top";
                            m_contextRender.textAlign = "left";

                            // Define the extent for the layers.
                            var sizeExtent = new Size(m_dWidth, 
                                m_dHeight);

                            // Calculate the maximal area.
                            m_areaMaximal = new Area(new Point(0, 0), 
                                sizeExtent);

                            // Update all layers.
                            for (var i = 0; i < m_arrayLayers.length; i++) {

                                // Pass to layer.
                                var exceptionRet = m_arrayLayers[i].calculateLayout(sizeExtent, m_contextRender);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // These pipes are clean!
                            m_bDirty = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the application.
                    var m_functionRender = function () {
                        
                        try {

                            // Get "now".
                            var iMS = (new Date()).getTime();
 
                            // Calculate the layout whenever dirty.
                            var exceptionRet = null;
                            if (m_bDirty) {

                                exceptionRet = m_functionCalculateLayout();
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }

                            // Render each layer.  From back to front.
                            for (var i = 0; i < m_arrayLayers.length; i++) {

                                // Render out the layer.
                                exceptionRet = m_arrayLayers[i].render(m_contextRender,
                                    iMS);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // Continue the rendering.
                            m_iAnimationFrameSequence = requestAnimationFrame(m_functionRender);
                        } catch (e) {
                            
                            alert(e.message);
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // Cookie for animation callback.
                    var m_iAnimationFrameSequence = 0;
                    // jQuery object wrapping the parent DOM element.
                    var m_jqParent = null;
                    // jQuery object wrapping the child (render) DOM element.
                    var m_jqCanvas = null;
                    // The rendering canvas.
                    var m_canvasRender = null;
                    // The rendering canvas's render context.
                    var m_contextRender = null;
                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    // Define the dirty state.
                    var m_bDirty = true;
                    // Width of object.
                    var m_dWidth = 0;
                    // Height of object.
                    var m_dHeight = 0;
                    // The whole area.
                    var m_areaMaximal = null;
                    // Collection of layers to render in order.
                    var m_arrayLayers = null;
                    // Size of entire manager.
                    var m_areaMaximal = null;
                    // Point of click down.  Used to determine dragging.
                    var m_pointDown = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
