/////////////////////////////////////////
// ComicStrip
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Navbar/Comic", "Core/ScrollRegion"],
	function (errorHelper, Comic, ScrollRegion) {

		try {

			// Define ComicStrip constructor function. 
			var functionConstructor = function ComicStrip() {

				try {

					var self = this;			// Uber closure.

					///////////////////////////////////
					// Public properties.

					// Selector of scrollable element row.
					self.rowSelector = "#comicstriprow";
					// Selector of scrollable element.
					self.selector = "#comicstrip";
					// Width of item.
					self.itemWidth = 64;

					///////////////////////////////////
					// Public methods.

					// Create the comic strip.
					// Attach to specified element.
					self.create = function () {

						try {

							// Get a j-reference to the scroll container element.
							m_jStrip = $(self.selector);

							// Attach scrollableregion.
							m_srComicStrip = new ScrollRegion();
							return m_srComicStrip.attach(self.rowSelector);
							
						} catch (e) {

							return e;
						}
					};

					// Load up comics.
					self.load = function (objectData) {

						try {

							// Clear out first.
							m_jStrip.empty();

							// And the collection....
							m_arrayComics = [];

							// Add N test items.
							for (var i = 0; i < objectData.comics.length; i++) {

								// Get the ith comic.
								var comicIth = objectData.comics[i];

								// Allocate.
								var comicNew = new Comic();

								// Create.
								var exceptionRet = comicNew.load(comicIth);
								if (exceptionRet) {

									throw exceptionRet;
								}

								// Add.
								var exceptionRet = self.addItem(comicNew);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Automatically allocate the first comic.
							if (m_arrayComics.length > 0) {

								var exceptionRet = m_arrayComics[0].activate();
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

					// Method sets the specified comic as the active comic.
					self.select = function (comic) {

						try {

							m_comicActive = comic;
							return null;
						} catch (e) {

							return e;
						}
					};

					///////////////////////////////////
					// Private fields.

					// The container for the strip items.
					var m_jStrip = null;
					// Scrollable region reference.
					var m_srComicStrip = null;
					// Collection of comic items.
					var m_arrayComics = [];
					// The active comic.
					var m_comicActive = null;
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
