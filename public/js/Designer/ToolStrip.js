/////////////////////////////////////////
// ToolStrip
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Designer/Tool", "Core/ScrollRegion"],
	function (errorHelper, Tool, ScrollRegion) {

		try {

			// Define ToolStrip constructor function. 
			var functionConstructor = function ToolStrip() {

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

							// Get a j-reference to the scroll container element.
							m_jStrip = $(self.selector);

							// Attach scrollableregion.
							m_srToolStrip = new ScrollRegion();
							return m_srToolStrip.attach(self.rowSelector);
						} catch (e) {

							return e;
						}
					};

					// Add tool to strip.
					self.addItem = function (type) {

						try {

							var toolNew = new Tool();
							var exceptionRet = toolNew.load(type);
							if (exceptionRet) {

								return exceptionRet;
							}

							// Define object prototype.
							var jItem = toolNew.generateDOM();

							// Set its position.
							jItem.css({

								left: (m_arrayTools.length * self.itemWidth) + "px"
							});

							// Add to the DOM.
							m_jStrip.append(jItem);

							// Also add to the collection of comics.
							m_arrayTools.push(toolNew);

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
								if (m_arrayTools[i].type === type) {

									// Get the tool.
									var toolIth = m_arrayTools[i];

									// Remove form GUI.
									var exceptionRet = toolIth.destroy();
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

					///////////////////////////////////
					// Private fields.

					// The container for the strip items.
					var m_jStrip = null;
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
