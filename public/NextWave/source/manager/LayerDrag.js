/////////////////////////
// Drag layer.
//
// Displays drag cursor, drag start and drag targets.
//
// Return constructor function.

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "utility/settings",
    "utility/Point",
    "utility/Size",
    "utility/Area",
    "manager/Layer",
    "manager/ListItem",
    "type/Type",
    "statement/Statement",
    "methodBuilder/CodeStatement",
    "methodBuilder/CodeExpression",
    "methodBuilder/CodeExpressionStub"],
    function (prototypes, settings, Point, Size, Area, Layer, ListItem, Type, Statement, CodeStatement, CodeExpression, CodeExpressionStub) {

        try {

            // Constructor function.
        	var functionRet = function LayerDrag() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from base class.
                    self.inherits(Layer);

                    ////////////////////////
                    // Public fields.

                    // Object to drag.
                    self.dragObject = null;
                    // Indicates dragging is active if non-null.
                    self.down = null;
                    // Indicates how much the dragging has moved.
                    self.move = null;
                    // Saves the original location of the dragging object.
                    self.dragArea = null;
                    // Collection of drag targets.
                    self.dragTargets = [];
                    // The drag target the mouse was let up over.
                    self.upOver = null;

                    ////////////////////////
                    // Public methods.

                    // Set drag object, and get drag area.
                    self.setDragObject = function (objectDrag) {

                        try {

                            // Set the drag object in the drag layer, and ...
                            self.dragObject = objectDrag;
                            // ...stow its area.
                            self.dragArea = objectDrag.getDragArea();

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set point, clone object or reset 
                    // selection in object, possibly 
                    // remove from container, and then 
                    // get all matching drag targets.
                    self.startDrag = function (pointDown, pointMove) {

                        try {

                            // Can only set a down (starting drag) if there is a dragObject.
                            if (self.dragObject) {

                                // Start dragging.
                                self.down = pointDown;

                                // Set initial move.
                                self.move = new Size(pointMove.x - self.down.x,
                                    pointMove.y - self.down.y);

                                // If ListItem, clone, else remove and set highlight to false.
                                if (self.dragObject instanceof ListItem ||
                                    self.dragObject instanceof Type) {

                                    // Clone the ListItem.
                                    self.dragObject = new self.dragObject.constructor(self.dragObject.name);
                                    self.dragObject.highlight = false;
                                } else {

                                    // Get container and remove from it.
                                    var collectionOwner = self.dragObject.collection;

                                    // Remove it.
                                    if (collectionOwner) {

                                        var exceptionRet = collectionOwner.removeItem(self.dragObject);
                                        if (exceptionRet) {

                                            return exceptionRet;
                                        }
                                    }

                                    // If CodeStatement, close its blocks.
                                    if (self.dragObject instanceof CodeStatement) {

                                        var exceptionRet = self.dragObject.closeBlocks();
                                        if (exceptionRet) {

                                            return exceptionRet;
                                        }
                                    }
                                }

                                // Add in drag stubs if dragging a Statement or CodeStatement.
                                if (self.dragObject instanceof CodeStatement ||
                                    self.dragObject instanceof Statement) {

                                    var exceptionRet = window.methodBuilder.addStatementDragStubs(self.dragTargets);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }

                                    // Set global dragging variable.
                                    window.draggingStatement = self.dragObject;
                                } else if (self.dragObject instanceof ListItem ||
                                    self.dragObject instanceof CodeExpression) {

                                    // Get the drag targets somehow else.
                                    var exceptionRet = window.methodBuilder.accumulateDragTargets(self.dragTargets);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }

                                    // Set global dragging variable.
                                    window.draggingExpression = self.dragObject;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Reset all state.
                    self.cancelDrag = function () {

                        try {

                            // Purge drag stubs if dragging a Statement or CodeStatement.
                            if (self.dragObject instanceof CodeStatement ||
                                self.dragObject instanceof Statement) {

                                var exceptionRet = window.methodBuilder.purgeStatementDragStubs();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            self.dragObject = null;
                            self.down = null;
                            self.move = null;
                            self.dragArea = null;
                            self.dragTargets = [];
                            self.upOver = null;

                            // Clear global drag variables.
                            window.window.draggingStatement = null;
                            window.window.draggingExpression = null;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Add to target and call cancel.
                    self.consumateDrag = function () {

                        try {

                            // If mouse let up over a drag target.
                            if (self.upOver) {

                                if (self.upOver instanceof CodeExpressionStub) {

                                    // If the dragged thing is already a CodeExpression
                                    // then just add it, else, allocate it and add it.
                                    if (self.dragObject instanceof CodeExpression) {

                                        var exceptionRet = self.upOver.addItem(self.dragObject);
                                        if (exceptionRet) {

                                            return e;
                                        }
                                    } else {

                                        // Allocate a new CodeExpression.
                                        var ceNew = self.dragObject.allocateCodeInstance();

                                        // And add that.
                                        var exceptionRet = self.upOver.addItem(ceNew);
                                        if (exceptionRet) {

                                            return e;
                                        }
                                    }
                                } else {

                                    // If the dragged thing is already a CodeExpression
                                    // then just add it, else, allocate it and add it.
                                    if (self.dragObject instanceof CodeStatement) {

                                        var exceptionRet = self.upOver.collection.addItem(self.dragObject,
                                            self.upOver);
                                        if (exceptionRet) {

                                            return e;
                                        }
                                    } else {

                                        // Allocate a new CodeExpression.
                                        var csNew = self.dragObject.allocateCodeInstance();

                                        // And add that.
                                        var exceptionRet = self.upOver.collection.addItem(csNew,
                                            self.upOver);
                                        if (exceptionRet) {

                                            return e;
                                        }
                                    }
                                }
                            }

                            return self.cancelDrag();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Take mouse move--set handled in reference object if handled.
                    self.mouseMove = function (objectReference) {

                        try {

                            // If dragging...
                            if (self.down) {

                                var pointCursor = new Point(objectReference.event.offsetX,
                                    objectReference.event.offsetY);

                                self.move = new Size(pointCursor.x - self.down.x,
                                    pointCursor.y - self.down.y);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Take mouse up--possibly set success target.
                    self.mouseUp = function (objectReference) {

                        try {

                            // If dragging...
                            if (self.down) {

                                // Loop over all drag targets, ask each if cursor in.
                                for (var i = 0; i < self.dragTargets.length; i++) {

                                    var itemIth = self.dragTargets[i];

                                    var bIn = itemIth.pointIn(objectReference.contextRender,
                                        objectReference.pointCursor);
                                    if (bIn) {

                                        self.upOver = itemIth;
                                        break;
                                    }
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the layer.
                    self.render = function (contextRender, iMS) {
                        
                        try {

                            // If dragging...
                            if (self.down) {

                                // Calculate position to render.
                                var pointRender = new Point(self.dragArea.location.x + self.move.width,
                                    self.dragArea.location.y + self.move.height);
                                var areaRender = new Area(pointRender,
                                    self.dragArea.extent.clone());

                                // Render the drag object.
                                try {

                                    // Set to partially transparency.
                                    contextRender.globalAlpha = 0.65;

                                    return self.dragObject.render(contextRender,
                                        areaRender,
                                        0);
                                } finally {

                                    // Reset transparency.
                                    contextRender.globalAlpha = 1.0;
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

            // Do function injection.
            functionRet.inheritsFrom(Layer);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
