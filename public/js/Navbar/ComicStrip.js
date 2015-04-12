/////////////////////////////////////////
// ComicStrip
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Navbar/Comic"],
	function (errorHelper, Comic) {

		try {

			// Define ComicStrip constructor function. 
			var functionConstructor = function ComicStrip(dItemWidth) {

				try {

					var self = this;			// Uber closure.

					///////////////////////////////////
					// Public properties.

					// Width of item.
					self.itemWidth = dItemWidth || 64;

					///////////////////////////////////
					// Public methods.

					// Create the comic strip.
					// Attach to specified element.
					self.create = function (strSelector) {

						try {

							// Get a j-reference to the scroll container element.
							m_jStrip = $(strSelector);

							// Add 100 test items.
							for (var i = 0; i < 10; i++) {

								var exceptionRet = self.addItem(new Comic("comic" + i));
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Add frame to comic strip.
					self.addItem = function (comic) {

						try {

							// Define object prototype.
							var jItem = comic.generateDOM();

							// Set its position.
							jItem.css({

								left: (m_arrayComics.length * self.itemWidth) + "px"
							});

							// Add to the DOM.
							m_jStrip.append(jItem);

							// Also add to the collection of comics.
							m_arrayComics.push(comic);

							return null;
						} catch (e) {

							return e;
						}
					};

					///////////////////////////////////
					// Private fields.

					// The container for the strip items.
					var m_jStrip = null;
					// Collection of comic items.
					var m_arrayComics = [];
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
