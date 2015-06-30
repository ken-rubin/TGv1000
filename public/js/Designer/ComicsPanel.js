/////////////////////////////////////////
// ComicsPanel
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Navbar/Comic", "Core/ScrollRegion", "Core/resourceHelper", "Core/ScrollRegionV"],
	function (errorHelper, Comic, ScrollRegion, resourceHelper, ScrollRegionV) {

		try {

			// Define Comics constructor function. 
			var functionConstructor = function ComicsPanel() {

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
							m_srComicsPanelStrip = new ScrollRegionV();
							var exceptionRet = m_srComicsPanelStrip.create(
								"#comicpanelstrip",	// inner row selector
								110,				// width
								80,					// height
								function() {		// functionClick
						    		var jq = this;
						    		var parts = jq.context.id.split('-');
						    		var j = parseInt(parts[1], 10);
						    		self.activate(m_arrayPanels[j].url, j);
								}
							);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;
							
						} catch (e) {

							return e;
						}
					};

					// Load up comics.
					self.load = function (comicPanels) {

						try {

							// Clear out first.
							m_srComicsPanelStrip.empty();

							// And the collection....
							m_arrayPanels = [];

							// Loop over panel items and insert into DOM.
							for (var i = 0; i < comicPanels.items.length; i++) {

								// Get the ith panel.
								var panelIth = comicPanels.items[i];	// no class wrapper

								// Add the panel.
								var exceptionRet = self.addItem(panelIth, i);
								if (exceptionRet) { throw exceptionRet; }
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Add frame to comic strip.
					self.addItem = function (panel, iBase) {

						try {

							// Add to the DOM.
							var exceptionRet = m_srComicsPanelStrip.addImage(
								iBase,
								"panel-" + m_arrayPanels.length.toString(),		// id
								panel.name,		// name
								panel.description,		// description
								resourceHelper.toURL('panels', null, null, panel.thumbnail),		// url
								'comicspanelstripitem',	// image class
								null,
								true
							);
							if (exceptionRet) { throw exceptionRet; }

							// Also add to the collection of panels.
							m_arrayPanels.push(panel);

							return null;

						} catch (e) {

							return e;
						}
					};

					// Method sets the specified panel as the active panel and opens it in a new browser window.
					self.activate = function (url, index) {

						try {

							// Panel is strutured purposefully to size with small amount of black above and below the thumbnail.
							// If any panel had already been selected, remove the red div from behind it and add a red div behind this activated one.
							m_srComicsPanelStrip.repositionRedDivBehind(index);

							// Open panel URL in new window (or same window if already open).
							var strParams = 'outerWidth=WWW,outerHeight=HHH,screenLeft=LLL,screenTop=TTT,resizable=yes,scrollbars=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no';
							strParams = strParams.replace('WWW', (window.outerWidth - 100).toString()).replace('HHH', (window.outerHeight - 100).toString())
								.replace('LLL',(window.screenLeft-50).toString()).replace('TTT',(window.screenTop-50).toString());

							window.open(url, 'Comic Panel', strParams);

							return null;
							
						} catch (e) {

							return e;
						}
					};

					// User (or system, after save) is unloading the project.
					self.unload = function () {

						try {

							// Now blow away our stuff.
							m_srComicsPanelStrip.empty();
							m_arrayPanels = [];

							return null;

						} catch(e) {

							return e;
						}
					}

					///////////////////////////////////
					// Private fields.

					// Scrollable region reference.
					var m_srComicsPanelStrip = null;
					// Collection of panel items.
					var m_arrayPanels = [];
					
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
