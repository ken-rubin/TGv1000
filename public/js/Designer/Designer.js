/////////////////////////////////////////
// Designer allows the user to control the simulation via gui tool-widgets.
//
// Return constructor function.
//

// Define AMD module.
define(["Core/errorHelper", "Core/resourceHelper", "Designer/ToolInstance", "SourceScanner/processor", "SourceScanner/coder"], 
	function (errorHelper, resourceHelper, ToolInstance, processor, coder) {

		try {

			// Define constructor function.
			var functionConstructor = function Designer() {

				try {

					var self = this;			// Uber closure.

					////////////////////////////////
					// Pulbic properties.

					// Selector.
					self.selector = "#designer";
					self.selectorCanvas = "#surfacecanvas";
					self.canvasContext = null;

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
		                    m_jCanvas.bind("mouseenter",
		                    	m_functionHandleResize);
		                    m_jCanvas.bind("dblclick",
		                    	m_functionHandleDClick)
		     //                m_jCanvas.contextMenu({

							// 	menuSelector: "#DesignerContextMenu",
							// 	menuSelected: m_functionTypeContextMenu,
							// 	test: m_functionTestContextMenu
							// });

							// Handle resize to fit the designer to the visible height of the designer.
							// And now that comics are optional, let's handle the width here, too.
							$(window).resize(m_functionHandleResize);

							// Call once to initialize the sizing.
							m_functionHandleResize();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Update the designer surface.
					self.refresh = function () {

						try {

							// Just call to helper method.
							return m_functionRender();
						} catch (e) {

							return e;
						}
					}

					// Empty the designer when current project is closed.
					self.unload = function () {

						try {

							m_arrayItems = [];
							return self.refresh();

						} catch (e) {

							return e;
						}
					}

					// Update the designer tool instances with the changes.
					self.updateInstances = function (objectSettings) {

						try {

							var arrayKeys = Object.keys(objectSettings);
							for (var i = 0; i < arrayKeys.length; i++) {

								var strKeyIth = arrayKeys[i];
								for (var j = 0; j < m_arrayItems.length; j++) {

									var itemJth = m_arrayItems[j];
									if (itemJth.id === strKeyIth) {

										itemJth.left = parseFloat(objectSettings[strKeyIth].X);
										itemJth.top = parseFloat(objectSettings[strKeyIth].Y);
										itemJth.width = parseFloat(objectSettings[strKeyIth].Width);
										itemJth.height = parseFloat(objectSettings[strKeyIth].Height);
										break;
									}
								}
							}

							// Just call to helper method.
							return m_functionRender();
							
						} catch (e) {

							return e;
						}
					}

					// Type image has changed, update in designer.
					self.updateImage  = function (clType) {

						try {

							// Compose id to lookup.
							var strTypeId = client.removeSpaces(clType.data.name);

							// Loop over all tool instances, ask each if it wraps the type which 
							// was just updated and passed into this method.  If so, update image.
							for (var i = 0; i < m_arrayItems.length; i++) {

								// Extract the ith item.
								var tiIth = m_arrayItems[i];

								var parts = tiIth.id.split('-');

								if (parts.length === 2) {

									// If the id's match...
									if (parts[1] === strTypeId) {

										// ...update the resource id.
										var exceptionRet = tiIth.updateImage(clType.data.imageId);
										if (exceptionRet) {

											throw exceptionRet;
										}
									}
								} else {

									throw new Error("In designer#updateImage got bad toolInstance id: " + tiIth.id);
								}
							}

							// Also pass on to the tool strip.
							var exceptionRet = tools.updateImage(clType);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Cause a refresh.
							return m_functionRender();

						} catch (e) {

							return e;
						}
					};

					// Type was renamed. Update in any matching tool instances.
					self.updateForTypeRename = function(strOldName, strNewName) {

						try {

							for (var i = 0; i < m_arrayItems.length; i++) {

								var tiIth = m_arrayItems[i];
								if (tiIth.type === strOldName) {

									tiIth.type = strNewName;
									// This is a case where we keep looking and don't break out.
								}
							}

							return null;

						} catch (e) {

							return e;
						}
					}

					// Used to set initial state of designer frame on project load.
					self.initializeWithWorkspace = function() {

						try {

		                    var objectWorkspace = processor.getAppInitializeJSONObject();
		                    if (!objectWorkspace) {

		                        throw { message: "Failed to get the workspace object." };
		                    }

		                    // Get the block with which to work.
		                    var objectPrimaryBlockChain = processor.getPrimaryBlockChain(objectWorkspace);

		                    // each object in objectArray looks like:
		                    // {id:unique_toolInstanceId, type: realTypeName, X: ...}
		                    var objectArray = coder.playThisInitializeWorkspace(objectPrimaryBlockChain);

		                    // Clear out collection of tool instances.
		                    m_arrayItems = [];

		                    // Now create tool instance(s) and draw them.
		                    for (var i = 0; i < objectArray.length; i++) {

		                    	var obIth = objectArray[i];

		                    	var X = parseFloat(obIth.X);
		                    	var Y = parseFloat(obIth.Y);
		                    	var Width = parseFloat(obIth.Width);
		                    	var Height = parseFloat(obIth.Height);
		                    	var strSrc = resourceHelper.toURL("resources", 
		                    		types.getType(obIth.type).data.imageId, 
		                    		"image", 
		                    		null);

			                    var tiNew = new ToolInstance(obIth.id,
			                    	obIth.type,
			                    	strSrc,
			                    	X,
			                    	Y,
			                    	Width,
			                    	Height);
			                    m_arrayItems.push(tiNew);

			                    // Render canvas.
								var exceptionRet = m_functionRender();
								if (exceptionRet) { throw exceptionRet; }
		                    }

							return null;

						} catch (e) {

							return e;
						}
					}

					self.getToolInstanceArray = function() {

						return m_arrayItems;
					}

					self.changeToolInstanceId = function(strOldId, strNewId) {

						try {

							// Change tool instance id in these locations:
							//		Designer m_arrayItems: id
							//		App Type's property: name
							//		workspace
							//		coder.update_AllocateType
							//		coder.update_SetPropertyValue

							for (var i = 0; i < m_arrayItems.length; i++) {

								var tiIth = m_arrayItems[i];
								if (tiIth.id === strOldId) {

									tiIth.id = strNewId;
									break;
								}
							}

							var property = null;
							for (var i = 0; i < g_clTypeApp.data.properties.length; i++) {

								var pIth = g_clTypeApp.data.properties[i];
								if (pIth.name === strOldId) {

									pIth.name = strNewId;
									property = pIth;
									break;
								}
							}

							if (property) {

								var exceptionRet = coder.update_ToolInstanceId(strOldId, strNewId, g_clTypeApp, property);
								if (exceptionRet) {

									// TODO: Undo previous two changes.




									


									return exceptionRet;
								}
							}
							return null;

						} catch (e) {

							return e;
						}
					}

					self.deleteToolInstance = function (toolInstance) {

						return m_functionUndrop(toolInstance);
					}

					///////////////////////////////
					// Private functions.

					// Method resizes and repositions the canvas.
					var m_functionHandleResize = function () {

						try {

							var canvas = m_jCanvas[0];
							m_jWrapper.height($(".toGetLeftCol").height());

							m_dWidth = m_jWrapper.width();
							m_dHeight = m_jWrapper.height();
							m_jCanvas.attr("width",
								m_dWidth);
							m_jCanvas.attr("height",
								m_dHeight);

							// Get context.
							self.canvasContext = canvas.getContext("2d");

							// Render canvas.
							var exceptionRet = m_functionRender();
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

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

								// Modify the app's initialize's workspace.
								var exceptionRet = coder.update_SetPropertyValue(m_itemMove.type, 
									"X", 
									m_itemMove.left, 
									m_itemMove.id);
								if (exceptionRet) {

									throw exceptionRet;
								}
								exceptionRet = coder.update_SetPropertyValue(m_itemMove.type, 
									"Y", 
									m_itemMove.top, 
									m_itemMove.id);
								if (exceptionRet) {

									throw exceptionRet;
								}

								// If the app initialize method is active, 
								// then must cause it to refresh itself.
								var bAppInitializeActive = types.isAppInitializeActive();
								if (bAppInitializeActive) {

									// Force update.
									exceptionRet = types.reloadActiveMethod();
									if (exceptionRet) {

										throw exceptionRet;
									}
								}

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

								// Modify the app's initialize's workspace.
								var exceptionRet = coder.update_SetPropertyValue(m_itemSize.type, 
									"Width", 
									m_itemSize.width, 
									m_itemSize.id);
								if (exceptionRet) {

									throw exceptionRet;
								}
								exceptionRet = coder.update_SetPropertyValue(m_itemSize.type, 
									"Height", 
									m_itemSize.height, 
									m_itemSize.id);
								if (exceptionRet) {

									throw exceptionRet;
								}

								// If the app initialize method is active, 
								// then must cause it to refresh itself.
								var bAppInitializeActive = types.isAppInitializeActive();
								if (bAppInitializeActive) {

									// Force update.
									exceptionRet = types.reloadActiveMethod();
									if (exceptionRet) {

										throw exceptionRet;
									}
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

					// Handled on mouse doubleclick over the canvas. What other events fire?
					var m_functionHandleDClick = function(e) {

						try {

							// Get where the event occurred.
							var objectPosition = m_functionPositionFromEvent(e);

							// See if the mouse is over an item.
							var item = m_functionItemFromPosition(objectPosition);
							if (!item) {

								return;
							}

							var functionManipulateCallback = function(propertyTypeId, changedProperty, selector, helperValue) {

								var newvalue = null;
								// Validate newvalue based on propertyTypeId.
								// 1: 		mb numeric
								// 2: 		mb numeric and in range in helperValue
								// 3: 		mb length > 0 (maybe)
								// 4: 		true or false must be chosen
								// 5: 		cannot be 'Select pick...'
								// 6: 		cannot be 'Select type...'

								// Only propertyTypeId 2 has a non-null helperValue. It looks like '34-56'. In case 2
								// we will parse helpValue and accept input only in that range.

								switch (propertyTypeId) {

									case 1:
										newvalue = $("#" + selector).val();
										if (newvalue.length === 0 || !$.isNumeric(newvalue)) { return; }
										break;
									case 2:
										newvalue = $("#" + selector).val();
										var parts = helperValue.split('-');
										var v1 = parseFloat(parts[0]);
										var v2 = parseFloat(parts[1]);
										var nv = parseFloat(newvalue);
										if (nv < v1 || nv > v2) { return; }
										break;
									case 3:
										newvalue = $("#" + selector).val();
										if (newvalue.length === 0) { return; }
										break;
									case 4:
										newvalue = $(selector).val();
										if (newvalue !== 'false' && newvalue !== 'true') { return; }
										break;
									case 5:
										newvalue = $("#" + selector).text();
										if (newvalue === 'Select pick...') { return; }
										break;
									case 6:
										newvalue = $("#" + selector).text();
										if (newvalue === 'Select type...') { return; }
										break;
								}

								// Apply newvalue to changedProperty in item.type.
								var ex = coder.update_SetPropertyValue(
									item.type,
									changedProperty,
									newvalue,
									item.id
								);
								if (ex) { throw ex; }

								var bAppInitializeActive = types.isAppInitializeActive();

								// If the App initialize method is active (displayed in the code pane), then the blockly code change listener
								// will be invoked by the above call to coder.  In that case we do not need to run the following block of code.
								// Otherwise, we need to run the block to cause the desired effect up in the designer pane.
								if (!bAppInitializeActive) {

									// Check if changedProperty is one of X, Y, Width, Height and, if so,
									// update it in item before calling m_functionRender.
									if (changedProperty === 'X')
										item.left = parseFloat(newvalue);
									else if (changedProperty === 'Y')
										item.top = parseFloat(newvalue);
									else if (changedProperty === 'Width')
										item.width = parseFloat(newvalue);
									else if (changedProperty === 'Height')
										item.height = parseFloat(newvalue);
								}

								ex = m_functionRender();
								if (ex) { throw ex; }

								// Finally, since the workspace has been updated, if it's open in the code window,
								// cause it to redraw with the new value. But only if it's showing now. This means
								// that the user (or the system) had selected App and clicked on the initialize
								// method and it's STILL showing.
								if (bAppInitializeActive) {

									// Force update.
									ex = types.reloadActiveMethod();
									if (ex) { throw ex; }
								}
							};

							var exceptionRet = client.showPropertyGrid(item, functionManipulateCallback);
							if (exceptionRet) { throw exceptionRet; }

						} catch (err) {

							errorHelper.show(err);
						}
					}

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
							self.canvasContext.save();

							// Set the transform--note this is the reason for the save.
							self.canvasContext.transform(1, 0, 0, 1, m_dWidth / 2, m_dHeight / 2);

							// Draw out the background and grid lines.
							self.canvasContext.fillStyle = "rgb(0,0,0)";
							self.canvasContext.fillRect(-m_dWidth / 2, -m_dHeight / 2, m_dWidth, m_dHeight);

							self.canvasContext.fillStyle = "#333";
							var iX = 0;
							var iY = 0;
							while (iX < m_dWidth / 2) {

								self.canvasContext.fillRect(iX, -m_dHeight / 2, 1, m_dHeight);
								self.canvasContext.fillRect(-iX, -m_dHeight / 2, 1, m_dHeight);

								iX += 50;
							}
							while (iY < m_dHeight / 2) {

								self.canvasContext.fillRect(-m_dWidth / 2, iY, m_dWidth, 1);
								self.canvasContext.fillRect(-m_dWidth / 2, -iY, m_dWidth, 1);

								iY += 50;
							}
/*							self.canvasContext.strokeStyle = "#ccc";
							self.canvasContext.strokeRect(-m_dWidth / 2, 0, m_dWidth, 1);
							self.canvasContext.strokeRect(0, -m_dHeight / 2, 1, m_dHeight);
							self.canvasContext.strokeRect(-m_dWidth / 2, -m_dHeight / 2, m_dWidth, m_dHeight);
*/
							// Draw all items.
							for (var i = 0; i < m_arrayItems.length; i++) {

								var itemIth = m_arrayItems[i];
								var exceptionRet = itemIth.render(self.canvasContext);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							return null;
						} catch (e) {

							return e;
						} finally {

							// Reset state/transform.
							self.canvasContext.restore();
						}
					};

					// Helper method loops over all instances 
					// and generates a new name for the type.
					var m_functionGetUniqueInstanceName = function (strType) {

						var strName = strType;

						var strSuffix = "";

						var bContinueLooking = true;
						while (bContinueLooking) {

							var bFound = false;
							for (var i = 0; i < m_arrayItems.length; i++) {

								var tiIth = m_arrayItems[i];
								if (tiIth.id === strName) {

									var iSuffix = parseInt(strSuffix, 10);
									if (isNaN(iSuffix)) {

										iSuffix = 1;
									}
									iSuffix++;
									strSuffix = iSuffix.toString();
									bFound = true;

									break;
								}
							}

							if (bFound) {

								strName = strType + strSuffix;
							} else {

								bContinueLooking = false;
							}
						}

						return strName;
					};

					// Event invoked when a drop operation occurs in the parent element.
		            var m_functionDrop = function (event, ui) {

		                try {

		                    // Extract data.
		                    var iLeft = ui.offset.left - m_jCanvas.offset().left - m_dWidth / 2 + 1;
		                    var iTop = ui.offset.top - m_jCanvas.offset().top - m_dHeight / 2 + 1;
		                    var iWidth =  parseInt($(ui.helper[0]).width(), 10);
		                    var iHeight = parseInt($(ui.helper[0]).height(), 10);

		                    // Extract the object that contains the attributes.
		                    var jHelper = $(ui.helper.context);

		                    var strId = jHelper.attr("id");
		                    var strSrc = jHelper.attr("src");
		                    var strType = jHelper.attr("data-type");	// Artificially set to 'App' for type with isApp === true, even if the name had been changed.
		                    											// Or set to 'Base' for a system base type.

		                    // Don't let the user drop App type on the designer.
		                    if (strType === "App") {

		                    	throw { message: "You may not drop the App type onto the Designer." };
		                    }

		                    // Don't let the user drop a system base type on the designer.
		                    if (strType === "Base") {

		                    	throw { message: "You may not drop a system base type onto the Designer." };
		                    }

		                    // Get an unique instance name for the type.
		                    var strInstanceName = m_functionGetUniqueInstanceName(strType);

		                    // Allocate a new type.
		                    var tiNew = new ToolInstance(strInstanceName,
		                    	strType,
		                    	strSrc,
		                    	iLeft,
		                    	iTop,
		                    	iWidth,
		                    	iHeight);
		                    m_arrayItems.push(tiNew);

							// Render canvas.
							var exceptionRet = m_functionRender();
		                    if (exceptionRet) { throw exceptionRet; }

							exceptionRet = client.addPropertyToType({
									id: 0,
									propertyTypeId: 6,	// 'Type'
                                    originalPropertyId: 0,
                                    name: strInstanceName,
                                    initialValue: '',
                                    ordinal: 0,
                                    isHidden: true
								},
								g_clTypeApp);
		                    if (exceptionRet) { throw exceptionRet; }

							// Add item to app initialize.
		                    exceptionRet = coder.add_AllocateType(strType, 
		                    	strInstanceName);
		                    if (exceptionRet) { throw exceptionRet; }

		                    // Set location.
		                    exceptionRet = coder.add_SetPropertyValue(strType, 
		                    	"X",
		                    	iLeft,
		                    	strInstanceName);
		                    if (exceptionRet) { throw exceptionRet; }
		                    exceptionRet = coder.add_SetPropertyValue(strType, 
		                    	"Y",
		                    	iTop,
		                    	strInstanceName);
		                    if (exceptionRet) { throw exceptionRet; }
		                    exceptionRet = coder.add_SetPropertyValue(strType, 
		                    	"Width",
		                    	iWidth,
		                    	strInstanceName);
		                    if (exceptionRet) { throw exceptionRet; }
		                    exceptionRet = coder.add_SetPropertyValue(strType, 
		                    	"Height",
		                    	iHeight,
		                    	strInstanceName);
		                    if (exceptionRet) { throw exceptionRet; }

		                } catch (e) {

		                    // Do nothing.
		                    errorHelper.show(e);
		                }
		            };

		            // Private method called by self.deleteToolInstance to remove a previously-dropped tool.
		            // Basically, have to undo much of what was done in m_functionDrop and then re-render the Designer canvas.
		            var m_functionUndrop = function (toolInstance) {

		            	try {

		            		var strInstanceId = toolInstance.id;
							var strAppTypeName = g_clTypeApp.data.name;
							var strTypeName = toolInstance.type;

		            		for (var i = 0; i < m_arrayItems.length; i++) {

		            			var itemIth = m_arrayItems[i];
		            			if (itemIth.id === strInstanceId) {

									for (var j = 0; j < g_clTypeApp.data.properties.length; j++) {

										var propJth = g_clTypeApp.data.properties[j];
										if (propJth.name === strInstanceId) {

											// Remove property from left side of code pane (the category).
											var exceptionRet = code.removeProperty(g_clTypeApp,
												propJth);
											if (exceptionRet) { throw exceptionRet; }

						                    // Remove ALL possible set properties.
						                    // X, Y, Width, Height for sure, but others may have been added manually by the user, too.
						                    // This will work by matching any next node where:
						                    //   next.type.children[0].children[0].type === strAppTypeName + "_get" + strInstanceId
						                    exceptionRet = coder.remove_SetPropertyValues(strInstanceId,
						                    	strAppTypeName);
						                    if (exceptionRet) { throw exceptionRet; }

											// Remove item from app initialize.
											// This will work by matching and "next" node where:
											//	next.type === strAppTypeName + "_set" + strInstanceId
						                    exceptionRet = coder.remove_AllocateType(strAppTypeName, 
						                    	strInstanceId);
						                    if (exceptionRet) { throw exceptionRet; }

											// Delete property from type here instead of using the method in Types.js.
											// That one deletes from the currently active Type, and, who knows, App may not be active.
											g_clTypeApp.data.properties.splice(j, 1);
											break;
										}
									}

									// Remove the TI from our array.
									m_arrayItems.splice(i, 1);

									// Render canvas.
									var exceptionRet = m_functionRender();
				                    if (exceptionRet) { return exceptionRet; }

				            		return null;
		            			}
		            		}

		            		return new Error('We were unable to find the tool instance in the array of TIs. This is a program error.')

		            	} catch (e) {

		            		return e;
		            	}
		            }

		            //////////////////////////////////////
		            // Private fields.

		            // Reference to the wrapper div.
		            var m_jWrapper = null;
		            // Reference to the background canvas.
		            var m_jCanvas = null;
		            // Collection of tool instances.
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
