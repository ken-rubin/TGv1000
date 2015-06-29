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
								80,				// item width
								function() {		// functionClick
						    		var jq = this;
						    		var parts = jq.context.id.split('-');
						    		var j = parseInt(parts[1], 10);
						    		self.activate(m_arrayPanels[j].url);
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
								var exceptionRet = self.addItem(panelIth);
								if (exceptionRet) { throw exceptionRet; }
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Add frame to comic strip.
					self.addItem = function (panel) {

						try {

							// Add to the DOM.
							var exceptionRet = m_srComicsPanelStrip.addImage(
								"panel-" + m_arrayPanels.length.toString(),		// id
								panel.name,		// name
								panel.description,		// description
								resourceHelper.toURL('panels', null, null, panel.thumbnail),		// url
								'toolstripitem'	// image class
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
					self.activate = function (url) {

						try {

							window.open(url, 'Comic Panel', 'width=600,height=400,resizable=yes,scrollbars=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no');

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
