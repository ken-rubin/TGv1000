/////////////////////////
// Designer layer.
//
// Displays drag cursor, drag start and drag targets.
//
// Return constructor function.

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/manager/Layer",
    "NextWave/source/manager/ListItem",
    "NextWave/source/type/Type",
    "NextWave/source/type/Method",
    "NextWave/source/type/Property",
    "NextWave/source/name/Name",
    "NextWave/source/statement/Statement",
    "NextWave/source/methodBuilder/Block",
    "NextWave/source/methodBuilder/CodeStatement",
    "NextWave/source/methodBuilder/CodeExpression",
    "NextWave/source/methodBuilder/CodeExpressionStub",
    "NextWave/source/methodBuilder/CodeStatementVar",
    "NextWave/source/methodBuilder/CodeExpressionInfix",
    "NextWave/source/methodBuilder/CodeExpressionName",
    "NextWave/source/methodBuilder/CodeName"],
    function (prototypes, settings, Point, Size, Area, Layer, ListItem, Type, Method, Property, Name, Statement, Block, CodeStatement, CodeExpression, CodeExpressionStub, CodeStatementVar, CodeExpressionInfix, CodeExpressionName, CodeName) {

        try {

            // Constructor function.
        	var functionRet = function LayerDesigner() {

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
                    // Collection of placements for dragging Statements or CodeStatements.
                    self.placements = [];

                    ////////////////////////
                    // Public methods.

                    // Clear drag object.
                    self.clearDragObject = function () {

                        try {

                            // Clear it out.
                            self.dragObject = null;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Get drag object.
                    self.getDragObject = function () {

                        return self.dragObject;
                    };

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

                                // Handle each drag-type differently.
                                if (self.dragObject instanceof CodeStatement) {

                                    return m_functionStartDragCodeStatement(pointDown,
                                        pointMove);
                                } else if (self.dragObject instanceof CodeExpression) {

                                    return m_functionStartDragCodeExpression(pointDown,
                                        pointMove);
                                } else if (self.dragObject instanceof Statement) {

                                    return m_functionStartDragStatement(pointDown,
                                        pointMove);
                                } else if (self.dragObject instanceof ListItem ||
                                    self.dragObject instanceof Method ||
                                    self.dragObject instanceof Property)  {

                                    return m_functionStartDragNonStatementListItem(pointDown,
                                        pointMove);
                                } else if (self.dragObject instanceof Type)  {

                                    return m_functionStartDragType(pointDown,
                                        pointMove);
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
                                self.dragObject instanceof Statement ||
                                self.dragObject instanceof Type) {

                                var exceptionRet = window.methodBuilder.purgeStatementDragStubs();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            self.dragObject = null;
                            self.down = null;
                            self.move = null;
                            self.dragArea = null;

                            // Remove index and collection from drag target.
                            self.dragTargets.index = undefined;
                            self.dragTargets.dragCollection = undefined;

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

                                // Expressions must be integrated into their collection...
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

                                    // If this is a drag from the TypeList,
                                    // or a new var statement drag, then
                                    // add a name on this consumate call.
                                    if (self.dragTargets.addNameInDragConsumate) {

                                        self.dragTargets.addNameInDragConsumate = false;
                                        var exceptionRet = window.manager.addName(self.dragTargets.consumateName);
                                        if (exceptionRet) {

                                            return e;
                                        }
                                    }

                                    // ...CodeStatements just get turned back to non-dragStub.
                                    self.dragTargets.dragStub = false;
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

                                // If dragging a statement-type, then need to place the stub.
                                if (self.dragTargets &&
                                    (self.dragObject instanceof Statement ||
                                        self.dragObject instanceof CodeStatement ||
                                        self.dragObject instanceof Type)) {

                                    // If drag object is a Statement or a CodeStatement, 
                                    // then find the location of the closest possible
                                    // drag stub location and put the drag stub there.
                                    return m_functionPlaceStub(pointCursor);
                                }
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

                                // If dragTargets is a collection, then loop, else...
                                if (self.dragTargets.length) {

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
                                } else if (self.dragTargets &&
                                    $.isFunction(self.dragTargets.pointIn)) {

                                    // ...just ask the one.
                                    var bIn = self.dragTargets.pointIn(objectReference.contextRender,
                                        objectReference.pointCursor);
                                    if (bIn) {

                                        self.upOver = self.dragTargets;
                                    } else {

                                        // Dragged to remove.

                                        // If its a var with a name...
                                        if (self.dragTargets instanceof CodeStatementVar &&
                                            self.dragTargets.assignment.payload instanceof CodeExpressionInfix &&
                                            self.dragTargets.assignment.payload.lHS.payload instanceof CodeExpressionName &&
                                            self.dragTargets.assignment.payload.lHS.payload.payload instanceof CodeName) {

                                            // ...remove it from names.
                                            var exceptionRet = window.manager.removeName(self.dragTargets.assignment.payload.lHS.payload.payload.payload);
                                            if (exceptionRet) {

                                                return exceptionRet;
                                            }
                                        }
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

                                    if (settings.layerDrag.showInsertionLines) {

                                        contextRender.lineWidth = 10;
                                        // Render placements.
                                        for (var i = 0; i < self.placements.length; i++) {

                                            contextRender.strokeStyle = (self.placements[i].type ? "red" : "green");

                                            contextRender.beginPath();
                                            contextRender.moveTo(0, self.placements[i].y);
                                            contextRender.lineTo(self.extent.width, self.placements[i].y);
                                            contextRender.stroke();
                                        }
                                        contextRender.lineWidth = 1;
                                    }

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

                    /////////////////////////
                    // Private methods.

                    // Helper method handles dragging Statements.
                    var m_functionStartDragStatement = function (pointDown, pointMove) {

                        try {

                            // Clone the ListItem.
                            self.dragObject = new self.dragObject.constructor(self.dragObject.name);
                            self.dragObject.highlight = false;

                            // Allocate and turn into dragstub.
                            var csDragStub = self.dragObject.allocateCodeInstance();
                            csDragStub.dragStub = true;

                            // Store in dragTargets (normally a collection).
                            // ToDo: replace with something just for statements.
                            self.dragTargets = csDragStub;

                            // Set global dragging variable.
                            window.draggingStatement = self.dragObject;

                            /* Move the dragstub to the nearest to the cursor.
                            var exceptionRet = m_functionPlaceStub(pointMove);
                            if (exceptionRet) {

                                return exceptionRet;
                            }*/
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method handles dragging Types.
                    var m_functionStartDragType = function (pointDown, pointMove) {

                        try {

                            // Clone the Type.
                            self.dragObject = new self.dragObject.constructor(self.dragObject.name);
                            self.dragObject.highlight = false;

                            // Close the type.
                            var exceptionRet = self.dragObject.close();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Allocate and turn into dragstub.
                            var csDragStub = self.dragObject.allocateCodeInstance();
                            csDragStub.dragStub = true;

                            // Store in dragTargets (normally a collection).
                            // ToDo: replace with something just for statements.
                            self.dragTargets = csDragStub;

                            // Need its new height to compare with 
                            // the old height to adjust the grab point.
                            var dClosedHeight = self.dragObject.getClosedHeight();
                            self.dragArea.extent.height = dClosedHeight;

                            // If the statement is now above the grab point, move it down.
                            if (self.dragArea.location.y + self.dragArea.extent.height < pointMove.y) {

                                self.dragArea.location.y = pointMove.y - self.dragArea.extent.height + settings.general.margin;
                            }

                            // Set global dragging variable.
                            window.draggingStatement = self.dragObject;

                            // Move the dragstub to the nearest to the cursor.
                            /*exceptionRet = m_functionPlaceStub(pointMove);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            exceptionRet = window.methodBuilder.methodStatements.insertAt(self.dragTargets,
                                0);
                            if (exceptionRet) {

                                return exceptionRet;
                            }*/

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method handles dragging non-Statement 
                    // list items: Names, literals, expressions.
                    var m_functionStartDragNonStatementListItem = function (pointDown, pointMove) {

                        try {

                            // Clone the ListItem.
                            self.dragObject = new self.dragObject.constructor(self.dragObject.name);
                            self.dragObject.highlight = false;

                            // Get the drag targets somehow else.
                            var exceptionRet = window.methodBuilder.accumulateDragTargets(self.dragTargets);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set global dragging variable.
                            window.draggingExpression = self.dragObject;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method handles dragging CodeStatements.
                    var m_functionStartDragCodeStatement = function (pointDown, pointMove) {

                        try {

                            // Save off the dragObject as the dragTargets object.
                            // ToDo: make a different field for statement-types.
                            self.dragTargets = self.dragObject;
                            self.dragTargets.dragStub = true;

                            // Clone statement and set as the drag object, 
                            // the original Statement is now the dragStub.
                            self.dragObject = self.dragObject.clone();

                            // Close any open blocks.
                            var exceptionRet = self.dragObject.closeBlocks();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Need its new height to compare with 
                            // the old height to adjust the grab point.
                            var dClosedHeight = self.dragObject.getClosedHeight();
                            self.dragArea.extent.height = dClosedHeight;

                            // If the statement is now above the grab point, move it down.
                            if (self.dragArea.location.y + self.dragArea.extent.height < pointMove.y) {

                                self.dragArea.location.y = pointMove.y - self.dragArea.extent.height + settings.general.margin;
                            }

                            // Set global dragging variable.
                            window.draggingStatement = self.dragObject;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method handles dragging CodeExpression.
                    var m_functionStartDragCodeExpression = function (pointDown, pointMove) {

                        try {

                            // Get container and remove from it.
                            var collectionOwner = self.dragObject.collection;

                            // Remove it.
                            if (collectionOwner) {

                                var exceptionRet = collectionOwner.removeItem(self.dragObject);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Get the drag targets somehow else.
                            var exceptionRet = window.methodBuilder.accumulateDragTargets(self.dragTargets);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set global dragging variable.
                            window.draggingExpression = self.dragObject;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Find the closest possible insertion point to the cursor.
                    var m_functionPlaceStub = function (pointCursor) {

                        try {

                            // First, gather the collection/location/index/type array.
                            var arrayDragStubInsertionPoints = [];
                            var exceptionRet = window.methodBuilder.accumulateDragStubInsertionPoints(arrayDragStubInsertionPoints,
                                self.dragTargets);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            self.placements = arrayDragStubInsertionPoints;

                            // Process each, keeping nearest.
                            var objectClosest = null;
                            var iClosestDistance = Infinity;
                            for (var i = 0; i < arrayDragStubInsertionPoints.length; i++) {

                                var objectIth = arrayDragStubInsertionPoints[i];

                                var iDistance = Math.abs(objectIth.y - pointCursor.y);
                                if (iDistance < iClosestDistance) {

                                    iClosestDistance = iDistance;
                                    objectClosest = objectIth;
                                }
                            }

                            // If placement has changed, remove the stub and add back in the new place.
                            if (objectClosest) {

                                // If in the same collection, make so only ever moves by 1 index.
                                if (objectClosest.collection === self.dragTargets.dragCollection) {

                                    if (objectClosest.index < self.dragTargets.index) {

                                        objectClosest.index = self.dragTargets.index - 1;
                                    } else if (objectClosest.index > self.dragTargets.index) {

                                        objectClosest.index = self.dragTargets.index + 1;
                                    }
                                }

                                // Ensure no drop on the dragStub.
                                if (!objectClosest.type) {

                                    // Remove placed stub now.
                                    exceptionRet = window.methodBuilder.purgeStatementDragStubs();
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }

                                    // Insert at the specified index to the specified collection.
                                    exceptionRet = objectClosest.collection.insertAt(self.dragTargets,
                                        objectClosest.index);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }

                                    // Save index in drag target.
                                    self.dragTargets.index = objectClosest.index;
                                    self.dragTargets.dragCollection = objectClosest.collection;
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
