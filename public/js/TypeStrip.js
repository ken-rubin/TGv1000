/////////////////////////////////////////
// TypeStrip
//
// Returns constructor functions.
//

// Define AMD module.
define(["errorHelper", "Type"],
	function (errorHelper, Type) {

		try {

			// Define TypeStrip constructor function. 
			var functionConstructor = function TypeStrip(dItemWidth) {

				try {

					var self = this;			// Uber closure.

					///////////////////////////////////
					// Public properties.

					// Width of item.
					self.itemWidth = dItemWidth || 200;

					///////////////////////////////////
					// Public methods.

					// Create the Type strip.
					// Attach to specified element.
					self.create = function (strSelector) {

						try {

							// Get a j-reference to the scroll container element.
							m_jStrip = $(strSelector);

					        // Add the add type type.
							var exceptionRet = self.addItem(new Type("addtypetype",
								"../media/images/plus.png"));
							if (exceptionRet) {

								throw exceptionRet;
							}

					        // Add the app type.
							var exceptionRet = self.addItem(new Type("apptype",
								"../media/images/Chester.png"));
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Add 100 test items.
							for (var i = 0; i < 3; i++) {

								exceptionRet = self.addItem(new Type("type" + i,
								"../media/images/Homer.png"));
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
