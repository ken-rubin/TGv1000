/////////////////////////////////////////
// TypeStrip
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Code/Type", "Core/ScrollRegion"],
	function (errorHelper, Type, ScrollRegion) {

		try {

			// Define TypeStrip constructor function. 
			var functionConstructor = function TypeStrip() {

				try {

					var self = this;			// Uber closure.

					///////////////////////////////////
					// Public properties.

					// Selector to DOM element to wrap.
					self.rowSelector = "#typestriprow";
					// Selector to DOM element to wrap.
					self.selector = "#typestrip";
					// Width of item.
					self.itemWidth = 200;

					///////////////////////////////////
					// Public methods.

					// Create the Type strip.
					// Attach to specified element.
					self.create = function () {

						try {

							// Get a j-reference to the scroll container element.
							m_jStrip = $(self.selector);

							// Attach scrollableregion.
							m_srTypeStrip = new ScrollRegion();
							return m_srTypeStrip.attach(self.rowSelector);
						} catch (e) {

							return e;
						}
					};

					// Load the Type strip item collection.
					self.load = function (objectData) {

						try {

							// First destroy.
							m_jStrip.empty();

							// And the collection.
							m_arrayTypes = [];

							// Add:
							var itemAdd = {

								add: true,
								resourceId: 2
							};

							// Allocate the type object which holds/wrapps the data.
							var typeAdd = new Type();
							var exceptionRet = typeAdd.load(itemAdd);
							if (exceptionRet) {

								throw exceptionRet;
							}

					        // Add the app type.
							exceptionRet = self.addItem(typeAdd);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Loop over items and insert into the DOM.
							for (var i = 0; i < objectData.items.length; i++) {

								// Extract the item (type).
								var itemIth = objectData.items[i];

								// Allocate the type object which holds/wrapps the data.
								var typeIth = new Type();
								exceptionRet = typeIth.load(itemIth);
								if (exceptionRet) {

									throw exceptionRet;
								}

						        // Add the type.
								exceptionRet = self.addItem(typeIth);
								if (exceptionRet) {

									throw exceptionRet;
								}

						        // Also add to the designer/tool strip.
								exceptionRet = toolStrip.addItem(typeIth);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Add Type to strip.
					self.addItem = function (type) {

						try {

							// Define object prototype.
							var jItem = type.generateDOM();

							// Set its position.
							jItem.css({

								left: (m_arrayTypes.length * self.itemWidth) + "px"
							});

							// Add to the DOM.
							m_jStrip.append(jItem);

							// Also add to the collection of comics.
							m_arrayTypes.push(type);

							return null;
						} catch (e) {

							return e;
						}
					};

					///////////////////////////////////
					// Private fields.

					// The container for the strip items.
					var m_jStrip = null;
					// Collection of type items.
					var m_arrayTypes = [];
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
