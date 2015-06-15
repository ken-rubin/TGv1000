/////////////////////////////////////////
// Comics
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Navbar/Comic", "Core/ScrollRegion2", "Core/resourceHelper"],
	function (errorHelper, Comic, ScrollRegion, resourceHelper) {

		try {

			// Define Comics constructor function. 
			var functionConstructor = function Comics() {

				try {

					var self = this;			// Uber closure.

					///////////////////////////////////
					// Public properties.

					///////////////////////////////////
					// Public methods.

					// Create the comic strip.
					// Attach to specified element.
					self.create = function () {

						try {

							// Attach scrollableregion.
							m_srComicStrip = new ScrollRegion();
							var exceptionRet = m_srComicStrip.create(
								"#comicstrip",		// inner row selector
								80,					// item width
								function() {}		// functionClick
							);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							return e;
						}
					};

					// Load up comics.
					self.load = function (objectData) {

						try {

							// Clear out first.
							m_srComicStrip.empty();

							// And the collection....
							m_arrayComics = [];

							for (var i = 0; i < objectData.items.length; i++) {

								// Get the ith comic.
								var comicIth = objectData.items[i];

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

					// User (or system, after save) is unloading the project.
					self.unload = function () {

						try {

							// Do the opposite of what self.load did. In the opposite order, too.
							for (var i = 0; i < m_arrayComics.length; i++) {

								var comicIth = m_arrayComics[i];
								var exceptionRet = comicIth.unload();
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Now blow away our stuff.
							m_srComicStrip.empty();
							m_arrayComics = [];

							return null;

						} catch(e) {

							return e;
						}
					}

					// Add frame to comic strip.
					self.addItem = function (comic) {

						try {

							// Add to the DOM.
							var exceptionRet = m_srComicStrip.addImage(
								"carousel" + m_arrayComics.length.toString(),		// id
								'',		// name
								'',		// description
								resourceHelper.toURL('resources', comic.data.imageResourceId, 'image', ''),		// url
								'comicstripitem'	// image class
							);

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

					self.addTypeToActiveComic = function(type) {

						try {

							return m_comicActive.addType(type);

						} catch (e) {

							return e;
						}
					}

					///////////////////////////////////
					// Private fields.

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
