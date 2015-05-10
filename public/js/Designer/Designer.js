/////////////////////////////////////////
// Designer allows the user to control the simulation via gui tool-widgets.
//
// Return constructor function.
//

// Define AMD module.
define(["Core/errorHelper", "Core/resourceHelper", "Designer/ToolInstance"], 
	function (errorHelper, resourceHelper, ToolInstance) {

		try {

			// Define constructor function.
			var functionConstructor = function Designer() {

				try {

					var self = this;			// Uber closure.

					////////////////////////////////
					// Pulbic properties.

					// Selector.
					self.selector = "#designerwrapper";
					self.selectorCanvas = "#surfacecanvas";

					////////////////////////////////
					// Pulbic methods.

					// Attach instance to DOM.
					self.create = function () {

						try {

							// Make the designer droppable.  Tools are dragged.
		                    $(self.selector).droppable({

		                        drop: m_functionDrop
		                    });

		                    // Save off a reference to the jQuery-wrapped designer surface.
							m_jWrapper = $(self.selector);
							m_jCanvas = $(self.selectorCanvas);

		                    // Hook up mouse events.
		                    m_jCanvas.bind("mousemove",
		                    	m_functionMouseMove);
		                    m_jCanvas.bind("mousedown",
		                    	m_functionMouseDown);
		                    m_jCanvas.bind("mouseup",
		                    	m_functionMouseUp);
		                    m_jCanvas.bind("mouseout",
		                    	m_functionMouseOut);
		                    m_jCanvas.contextMenu({

								menuSelector: "#DesignerContextMenu",
								menuSelected: m_functionTypeContextMenu,
								test: m_functionTestContextMenu
							});

							// Handle resize to fit the designer to the visible height of the designer.
							$(window).resize(function () {

								try {

									var iViewportHeight = $(window).height();

									var iToolStripHeight = $("#toolstriprow").height();
									var iNavbarHeight = $(".navbar").height();
									var iBordersAndSpacingPadding = 48;

									var canvas = m_jCanvas[0];
									m_jWrapper.height(iViewportHeight - 
										iToolStripHeight -
										iNavbarHeight -
										iBordersAndSpacingPadding);

									m_dWidth = m_jWrapper.width();
									m_dHeight = m_jWrapper.height();
									m_jWrapper.attr("width",
										m_dWidth);
									m_jWrapper.attr("height",
										m_dHeight);
									m_jCanvas.attr("width",
										m_dWidth);
									m_jCanvas.attr("height",
										m_dHeight);

									// Get context.
									m_context = canvas.getContext("2d");

									// Render canvas.
									var exceptionRet = m_functionRender();
									if (exceptionRet) {

										throw exceptionRet;
									}
								} catch (e) {

									errorHelper.show(e);
								}
							});

							return null;
						} catch (e) {

							return e;
						}
					};

					///////////////////////////////
					// Private functions.

					// Cause the specified item to be in front of all other items.
					var m_functionBringItemToFront = function (item) {

						try {

							// Loop over all items, 
							for (var i = 0; i < m_arrayItems.length; i++) {

								// Find the matching item.
								var itemIth = m_arrayItems[i];
								if (itemIth === item) {

									// Remove it from the collection.
									m_arrayItems.splice(i, 1);

									// Add it back.
									m_arrayItems.push(itemIth);
									break;
								}
							}

							// Cause a refresh.
							return m_functionRender();
						} catch (e) {

							return e;
						}
					};

					// Return the local-coordinate position from an event.
					var m_functionPositionFromEvent = function (e) {

						var dX = e.offsetX - m_dWidth / 2;
						var dY = e.offsetY - m_dHeight / 2;
						return { x: dX, y: dY };
					};

					// Return item at local-coordinate position.
					var m_functionItemFromPosition = function (objectPosition) {

						for (var i = m_arrayItems.length - 1; i >= 0; i--) {

							var itemIth = m_arrayItems[i];
							if (objectPosition.x >= itemIth.left &&
								objectPosition.x < itemIth.left + itemIth.width &&
								objectPosition.y >= itemIth.top &&
								objectPosition.y < itemIth.top + itemIth.height) {

								return itemIth;
							}
						}
						return null;
					};

					// Return item under the cursor.
					var m_functionItemFromEvent = function (e) {

						return m_functionItemFromPosition(m_functionPositionFromEvent(e));
					};

					// Return the cursor given the specified item and objectPosition.
					var m_functionSetCursorFromItemAndPosition = function (item, objectPosition, bMove, bSize) {

						try {

							// Calculate the cursor.  Either "not over an item" 
							// or move or resize if in the lower-right corner.
							if (bMove) {

								m_strCursor = "move";
							} else if (bSize) {

								m_strCursor = "se-resize";
							} else if (!item) {

								m_strCursor = "cell";
							} else {

								// Figure out if in the lower-right corner.
								var dX = objectPosition.x - item.left;
								var dY = objectPosition.y - item.top;
								if (dX > 0.75 * item.width &&
									dY > 0.75 * item.height) {

									m_strCursor = "se-resize";
								} else {

									m_strCursor = "move";
								}
							}

							// Set.
							m_jCanvas.css({

								cursor: m_strCursor
							});

							return null;
						} catch (e) {

							return e;
						}
					};

					// Invoked when the mouse is moved over the canvas.
					var m_functionMouseMove = function (e) {

						try {

							// Convert coordinates to local.
							var objectPosition = m_functionPositionFromEvent(e);

							// Get item.
							var itemEvent = m_functionItemFromPosition(objectPosition);

							// Move, if moving. 
							if (m_itemMove) {

								// Compare to the starting coordinate.
								var dDX = objectPosition.x - m_objectMoveStartCursorPosition.x;
								var dDY = objectPosition.y - m_objectMoveStartCursorPosition.y;

								// Add to original item position.
								m_itemMove.left = m_objectMoveStartItemPosition.x + dDX;
								m_itemMove.top = m_objectMoveStartItemPosition.y + dDY;

								// Cause an update.
								var exceptionRet = m_functionRender();
								if (exceptionRet) {

									throw exceptionRet;
								}
							} else if (m_itemSize) {

								// Compare to the starting coordinate.
								var dDX = objectPosition.x - m_objectSizeStartCursorPosition.x;
								var dDY = objectPosition.y - m_objectSizeStartCursorPosition.y;

								// Add to original item position.
								m_itemSize.width = m_objectSizeStartItemSize.width + dDX;
								m_itemSize.height = m_objectSizeStartItemSize.height + dDY;
								if (m_itemSize.width < 32) {
	
									m_itemSize.width = 32;
								}
								if (m_itemSize.height < 32) {
	
									m_itemSize.height = 32;
								}

								// Cause an update.
								var exceptionRet = m_functionRender();
								if (exceptionRet) {

									throw exceptionRet;
								}
							} else {

								// Set the cursor.
								var exceptionRet = m_functionSetCursorFromItemAndPosition(itemEvent,
									objectPosition,
									false,
									false);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when the mouse is depressed over the canvas.
					var m_functionMouseDown = function (e) {

						try {

							// Get where the event occurred.
							var objectPosition = m_functionPositionFromEvent(e);

							// See if the mouse is over an item.
							var item = m_functionItemFromPosition(objectPosition);
							if (!item) {

								return;
							}

							// Bring the item to the front so it is drawn on top of others.
							var exceptionRet = m_functionBringItemToFront(item);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Size, if sizing, else move.
							if (m_strCursor === "se-resize") {

								// Remember the item to be sized.
								m_itemSize = item;

								// Remember the starting location.
								m_objectSizeStartCursorPosition = objectPosition;

								// Remember the starting location of the item.
								m_objectSizeStartItemSize = { width:item.width, height:item.height  };

								// Set the cursor.
								exceptionRet = m_functionSetCursorFromItemAndPosition(item,
									objectPosition,
									false,
									true);
								if (exceptionRet) {

									throw exceptionRet;
								}
							} else {

								// Remember the item to be moved.
								m_itemMove = item;

								// Remember the starting location.
								m_objectMoveStartCursorPosition = objectPosition;

								// Remember the starting location of the item.
								m_objectMoveStartItemPosition = { x:item.left, y:item.top  };

								// Set the cursor.
								exceptionRet = m_functionSetCursorFromItemAndPosition(item,
									objectPosition,
									true,
									false);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when the mouse is released over the canvas.
					var m_functionMouseUp = function (e) {

						try {

							// Reset all state.
							m_itemMove = null;
							m_itemSize = null;

							// Set the cursor.
							var exceptionRet = m_functionSetCursorFromItemAndPosition(null,
								null,
								false,
								false);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when the mouse leaves the canvas.
					var m_functionMouseOut = function (e) {

						try {

							// Simulate up.
							m_functionMouseUp(e);
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Invoked when a menu item is selected for the type instances.
					var m_functionTypeContextMenu = function (invokedOn, selectedMenu) {

						try {

							// Handle different menu items differently.
							if (selectedMenu.text() === "a") {

								alert("a");
							} else if (selectedMenu.text() === "b") {

								alert("b");
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Called by the context menu object to determine if it should be shown.
					var m_functionTestContextMenu = function (e) {

						try {

							return !(m_functionItemFromEvent(e) === null);
						} catch (e) {

							return false;
						}
					};

					// Render the canvas.
					var m_functionRender = function () {

						try {

							// Save the entire state of the canvas.
							m_context.save();

							// Set the transform--note this is the reason for the save.
							m_context.transform(1, 0, 0, 1, m_dWidth / 2, m_dHeight / 2);

							// Draw out the background and grid lines.
							m_context.fillStyle = "black";
							m_context.fillRect(-m_dWidth / 2, -m_dHeight / 2, m_dWidth, m_dHeight);

							m_context.fillStyle = "#333";
							var iX = 0;
							var iY = 0;
							while (iX < m_dWidth / 2) {

								m_context.fillRect(iX, -m_dHeight / 2, 1, m_dHeight);
								m_context.fillRect(-iX, -m_dHeight / 2, 1, m_dHeight);

								iX += 50;
							}
							while (iY < m_dHeight / 2) {

								m_context.fillRect(-m_dWidth / 2, iY, m_dWidth, 1);
								m_context.fillRect(-m_dWidth / 2, -iY, m_dWidth, 1);

								iY += 50;
							}
							m_context.strokeStyle = "#ccc";
							m_context.strokeRect(-m_dWidth / 2, 0, m_dWidth, 1);
							m_context.strokeRect(0, -m_dHeight / 2, 1, m_dHeight);
							m_context.strokeRect(-m_dWidth / 2, -m_dHeight / 2, m_dWidth, m_dHeight);

							// Draw all items.
							for (var i = 0; i < m_arrayItems.length; i++) {

								var itemIth = m_arrayItems[i];
								var exceptionRet = itemIth.render(m_context);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							return null;
						} catch (e) {

							return e;
						} finally {

							// Reset state/transform.
							m_context.restore();
						}
					};

					// Event invoked when a drop operation occurs in the parent element.
		            var m_functionDrop = function (event, ui) {

		                try {

		                    // Extract data.
		                    var iLeft = ui.offset.left - m_jCanvas.offset().left - m_dWidth / 2 + 1;
		                    var iTop = ui.offset.top - m_jCanvas.offset().top - m_dHeight / 2 + 1;
		                    var iWidth =  parseInt($(ui.helper[0]).width());
		                    var iHeight = parseInt($(ui.helper[0]).height());

		                    // Extract the object that contains the attributes.
		                    var jHelper = $(ui.helper.context);

		                    var strId = jHelper.attr("id");
		                    var strResourceId = jHelper.attr("data-resourceid");
		                    var strType = jHelper.attr("data-type");

		                    // Allocate a new type.
		                    var tiNew = new ToolInstance(strId,
		                    	strType,
		                    	strResourceId,
		                    	iLeft,
		                    	iTop,
		                    	iWidth,
		                    	iHeight);
		                    m_arrayItems.push(tiNew);

							// Render canvas.
							var exceptionRet = m_functionRender();
							if (exceptionRet) {

								throw exceptionRet;
							}
		                } catch (e) {

		                    // Do nothing.
		                    errorHelper.show(e);
		                }
		            };

		            //////////////////////////////////////
		            // Private fields.

		            // Reference to the wrapper div.
		            var m_jWrapper = null;
		            // Reference to the background canvas.
		            var m_jCanvas = null;
		            // The rendering context.
		            var m_context = null;
		            // Collection of tools.
		            var m_arrayItems = [];
		            // Dimension of canvas.
		            var m_dWidth = 0;
		            var m_dHeight = 0;
		            // The item being moved.
					var m_itemMove = null;
					// Remember the starting location.
					var m_objectMoveStartCursorPosition = null;
					// Remember the starting location of the item.
					var m_objectMoveStartItemPosition = null;
					// The cursor for the canvas.
					var m_strCursor = "cell";
					// Remember the item to be sized.
					var m_itemSize = null;
					// Remember the starting location.
					var m_objectSizeStartCursorPosition = null;
					// Remember the starting location of the item.
					var m_objectSizeStartItemSize = null;
				} catch (e) {

					errorHelper.show(e);
				}
			};

			// Return constructor function.
			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
