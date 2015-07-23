/////////////////////////////////////////
// Comics
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Navbar/Comic", "Core/ScrollRegionV", "Core/resourceHelper"],
	function (errorHelper, Comic, ScrollRegionV, resourceHelper) {

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
							m_srComicStrip = new ScrollRegionV();
							var exceptionRet = m_srComicStrip.create(
								"#comicstrip",		// inner row selector
								110,					// item width
								110,					// height
								function() {		// functionClick
						    		var jq = this;
						    		var parts = jq.context.id.split('-');
						    		var j = parseInt(parts[1], 10);

						    		// If m_arrayClComics[j] IS the active comic, open its url in a new window. Otherwise, just activate it.
						    		// Cannot use clComic.data.id, since they could all be 0. But we CAN use originalComicId.
						    		if (m_arrayClComics[j].data.originalComicId === m_clComicActive.data.originalComicId) {

										// Open panel URL in new window (or same window if already open).
										var strParams = 'outerWidth=WWW,outerHeight=HHH,screenLeft=LLL,screenTop=TTT,resizable=yes,scrollbars=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no';
										strParams = strParams.replace('WWW', (window.outerWidth - 100).toString()).replace('HHH', (window.outerHeight - 100).toString())
											.replace('LLL',(window.screenLeft-50).toString()).replace('TTT',(window.screenTop-50).toString());

										window.open(m_clComicActive.data.url, 'Comic Panel', strParams);

						    		} else {

							    		m_arrayClComics[j].activate();
						    		}
								}
							);
							if (exceptionRet) { throw exceptionRet; }
						} catch (e) {

							return e;
						}
					};

					// Load up comics.
					self.load = function (projectComics) {

						try {

							// Clear out first.
							m_srComicStrip.empty();

							// And the collection....
							m_arrayClComics = [];

							// Loop over comic items and insert into DOM.
							for (var i = 0; i < projectComics.items.length; i++) {

								// Get the ith comic.
								var comicIth = projectComics.items[i];

								// Allocate.
								var clComic = new Comic();
								var exceptionRet = clComic.load(comicIth);
								if (exceptionRet) {

									throw exceptionRet;
								}

								// Add the comic.
								var exceptionRet = self.addItem(clComic, i);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Automatically allocate the first comic.
							if (m_arrayClComics.length > 0) {

								var exceptionRet = m_arrayClComics[0].activate();
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
					self.addItem = function (clComic, iBase) {

						try {

							// Add to the DOM.
							var exceptionRet = m_srComicStrip.addImage(
								iBase,
								"comicstp-" + m_arrayClComics.length.toString(),		// id
								clComic.data.name,		// name
								'',		// description
								resourceHelper.toURL('panels', null, null, clComic.data.thumbnail),		// url
								'comicstripitem',	// image class
								null,
								true
							);
							if (exceptionRet) { throw exceptionRet; }

							// Also add to the collection of comics.
							m_arrayClComics.push(clComic);

							return null;

						} catch (e) {

							return e;
						}
					};

					// Method sets the specified comic as the active comic.
					self.select = function (clComic) {

						try {

							m_clComicActive = clComic;

							// Panel is strutured purposefully to size with small amount of black above and below the thumbnail.
							// If any panel had already been selected, remove the red div from behind it and add a red div behind this activated one.
							var index = -1;
							for (var i = 0; i < m_arrayClComics.length; i++) {

								if (m_arrayClComics[i].data.originalComicId === m_clComicActive.data.originalComicId) {

									index = i;
									break;
								}
							}

							if (index > -1)
								m_srComicStrip.repositionRedDivBehind(index);

							return null;
							
						} catch (e) {

							return e;
						}
					};

					// User (or system, after save) is unloading the project.
					self.unload = function () {

						try {

							// Do the opposite of what self.load did. In the opposite order, too.
							for (var i = 0; i < m_arrayClComics.length; i++) {

								var comicIth = m_arrayClComics[i];
								var exceptionRet = comicIth.unload();
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							// Now blow away our stuff.
							m_srComicStrip.empty();
							m_arrayClComics = [];

							return null;

						} catch(e) {

							return e;
						}
					}

					self.addTypeToActiveComic = function(clType) {

						try {

							return m_clComicActive.addType(clType);

						} catch (e) {

							return e;
						}
					}

					self.isTypeNameAvailableInActiveComic = function(strName, myIndex) {

						// If myIndex === -1, it means we're adding, and we have to check the whole array.
						// Else, we have to skip array[myIndex]
						for (var i = 0; i < m_clComicActive.data.types.items; i++) {

							if (i !== myIndex) {

								var clTypeIth = m_clComicActive.data.types.items[i];
								if (clTypeIth.data.name === strName) {

									return false;
								}
							}
						}

						return true;
					}

					///////////////////////////////////
					// Private fields.

					// Scrollable region reference.
					var m_srComicStrip = null;
					// Collection of comic items.
					var m_arrayClComics = [];
					// The active comic.
					var m_clComicActive = null;
					
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
