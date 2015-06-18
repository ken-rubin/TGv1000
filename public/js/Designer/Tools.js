/////////////////////////////////////////
// Tools
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Designer/Tool", "Core/ScrollRegion2", "Core/resourceHelper"],
	function (errorHelper, Tool, ScrollRegion, resourceHelper) {

		try {

			// Define Tools constructor function. 
			var functionConstructor = function Tools() {

				try {

					var self = this;			// Uber closure.

					///////////////////////////////////
					// Public properties.

					// Selector to row element to wrap.
					self.rowSelector = "#toolstriprow";
					// Selector to DOM element to wrap.
					self.selector = "#toolstrip";
					// Width of item.
					self.itemWidth = 55;

					///////////////////////////////////
					// Public methods.

					// Create the tool strip.
					// Attach to specified element.
					self.create = function () {

						try {

							// Attach scrollableregion.
							m_srToolStrip = new ScrollRegion();
							var exceptionRet = m_srToolStrip.create(
								self.selector,		// inner row selector
								55,					// item width
								function() {}		// functionClick
							);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							return e;
						}
					};

					// Remove old items for project switch or whatever.
					self.empty = function () {

						m_srToolStrip.empty();
					}

					// Add tool to strip.
					self.addItem = function (type) {

						try {

							var clTool = new Tool();
							var exceptionRet = clTool.load(type);
							if (exceptionRet) {

								return exceptionRet;
							}

							// Add to the DOM.
							var jItem = null;
							var exceptionRet = m_srToolStrip.addImage(
								client.removeSpaces(type.data.name),		// id
								type.data.name,		// name
								"",					// description
								resourceHelper.toURL('resources', type.data.imageResourceId, 'image'), // url
								'toolstripitem',
								function (jItemAdded) {

									jItem = jItemAdded;
								}
							);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Also add to the collection of comics.
							m_arrayTools.push(clTool);

							// Wire up the dragability of the tool.
		                    jItem.draggable({

		                        helper: "clone",
		                        appendTo: $(document.body),
		                        zIndex: 100000
		                    });

							return null;

						} catch (e) {

							return e;
						}
					};

					// Remove item from DOM and state.
					self.removeItem = function (type) {

						try {

							// Find the matching tool.
							for (var i = 0; i < m_arrayTools.length; i++) {

								// Splice on match.
								if (m_arrayTools[i].data.type === type) {

									// Get the tool.
									var clToolIth = m_arrayTools[i];

									// Remove form GUI.
									var exceptionRet = clToolIth.destroy();
									if (exceptionRet) {

										throw exceptionRet;
									}

									// Remove from collection.
									m_arrayTools.splice(i, 1);
									break;
								}
							}
							return null;

						} catch (e) {

							return e;
						}
					};

					// Type image has changed, update in designer.
					self.updateImage = function (type) {

						try {

							// Loop over all tools, ask each if it wraps the type which was 
							// just updated and passed into this method.  If so, update image.
							for (var i = 0; i < m_arrayTools.length; i++) {

								// Extract the ith tool.
								var toolIth = m_arrayTools[i];

								// If the id's match...
								if (toolIth.type === type) {

									// ...ask the tool to update its display.
									var exceptionRet = toolIth.updateImage();
									if (exceptionRet) {

										throw exceptionRet;
									}
								}
							}

							// Also pass on to the tool strip.
							// var exceptionRet = tools.updateImage(type);
							// if (exceptionRet) {

							// 	throw exceptionRet;
							// }

							// Cause a refresh.
							return null; //m_functionRender();
						} catch (e) {

							return e;
						}
					};

					///////////////////////////////////
					// Private fields.

					// Scroll object.
					var m_srToolStrip = null;
					// Collection of tool items.
					var m_arrayTools = [];
				} catch (e) {

					errorHelper.show(e);
				}
			};

			// Return the constructor function.
			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
