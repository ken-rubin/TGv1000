/////////////////////////////////////////
// ToolStrip
//
// Returns constructor functions.
//

// Define AMD module.
define(["errorHelper", "Tool"],
	function (errorHelper, Tool) {

		try {

			// Define ToolStrip constructor function. 
			var functionConstructor = function ToolStrip(dItemWidth) {

				try {

					var self = this;			// Uber closure.

					///////////////////////////////////
					// Public properties.

					// Width of item.
					self.itemWidth = dItemWidth || 55;

					///////////////////////////////////
					// Public methods.

					// Create the tool strip.
					// Attach to specified element.
					self.create = function (strSelector) {

						try {

							// Get a j-reference to the scroll container element.
							m_jStrip = $(strSelector);

							// Add 100 test items.
							for (var i = 0; i < 1; i++) {

								var exceptionRet = self.addItem(new Tool("tool" + i,
									"../media/images/Chester.png"));
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
