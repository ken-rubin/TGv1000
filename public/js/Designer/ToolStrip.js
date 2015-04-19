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

					// Load up data.
					self.load = function (objectData) {

						try {

							// First destroy.
							m_jStrip.empty();

							// And the collection.
							m_arrayTools = [];

							// Add 100 test items.
							for (var i = 0; i < objectData.items.length; i++) {

								// Extract data.
								var itemIth = objectData.items[i];

								// Allocate and load the tool.
								var toolIth = new Tool();
								var exceptionRet = toolIth.load(itemIth);
								if (exceptionRet) {

									throw exceptionRet;
								}

								// Add to collection.
								exceptionRet = self.addItem(toolIth);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Add tool to strip.
					self.addItem = function (tool) {

						try {

							// Define object prototype.
							var jItem = tool.generateDOM();

							// Set its position.
							jItem.css({

								left: (m_arrayTools.length * self.itemWidth) + "px"
							});

							// Add to the DOM.
							m_jStrip.append(jItem);

							// Also add to the collection of comics.
							m_arrayTools.push(tool);

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
