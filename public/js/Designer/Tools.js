/////////////////////////////////////////
// Tools
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Designer/Tool", "Core/ScrollRegionV", "Core/resourceHelper"],
	function (errorHelper, Tool, ScrollRegionV, resourceHelper) {

		try {

			// Define Tools constructor function. 
			var functionConstructor = function Tools() {

				try {

					var self = this;			// Uber closure.

					///////////////////////////////////
					// Public methods.

					// Create the tool strip.
					// Attach to specified element.
					self.create = function () {

						try {

							// Attach scrollableregion.
							m_srToolStripV = new ScrollRegionV();
							var exceptionRet = m_srToolStripV.create(
								"#toolstrip",		// inner row selector
								55,					// item width
								55,					// item height
								function() {}		// functionClick
							);
							if (exceptionRet) { throw exceptionRet; }
						} catch (e) {

							return e;
						}
					};

					// Remove old items for project switch or whatever.
					self.empty = function () {

						m_srToolStripV.empty();
					}

					// Add tool to strip.
					self.addItem = function (clType,
						bInLoadLoop													// See types.load for comment about bInLoadLoop.
						) 
					{

						try {

							var clTool = new Tool();
							var exceptionRet = clTool.load(clType);
							if (exceptionRet) { return exceptionRet; }

							// Add to the DOM.
							var jItem = null;
							var exceptionRet = m_srToolStripV.addImage(
								"tool-" + client.removeSpaces(clType.data.name),	// id
								clType.data.name,									// name for tooltip
								"",													// no description--at this time
								resourceHelper.toURL(								// image url
									'resources', 
									clType.data.imageResourceId, 
									'image'
								),
								'toolstripitem',									// item class
								function (jItemAdded) {	jItem = jItemAdded },		// post creation callback so we can use jItem (see below)
								bInLoadLoop || false								// If it wasn't passed in (new Type added), then false. If in a Types.load loop, then true.
							);
							if (exceptionRet) {	throw exceptionRet; }

							// Also add to the collection of comics.
							m_arrayTools.push(clTool);

							// Wire up the dragability of the tool.
		                    jItem.draggable({

		                        helper: "clone",
		                        appendTo: $(document.body),
		                        zIndex: 100000
		                    });

		                    // Add mousedown handler to tool to fill the TypeWell
		                    jItem.mousedown(function() {

		                    	var strId = $(this).context.id;
		                    	types.handleMouseDOwnOnToolStrip(strId);

		                    });

							return null;

						} catch (e) {

							return e;
						}
					};

					// Remove item from DOM and state.
					self.removeItem = function (type) {

						try {

							// Find the matching tool.
							for (var i = 0; i < m_arrayTools.length; i++) {

								// Splice on match.
								if (m_arrayTools[i].data.type === type) {

									// Get the tool.
									var clToolIth = m_arrayTools[i];

									// Remove form GUI.
									var exceptionRet = clToolIth.destroy();
									if (exceptionRet) {	throw exceptionRet; }

									// Remove from collection.
									m_arrayTools.splice(i, 1);
									break;
								}
							}
							return null;

						} catch (e) {

							return e;
						}
					};

					// Type image has changed, update in designer.
					self.updateImage = function (clType) {

						try {

							var strSelector = "#tool-" + clType.data.name;
							var strUrl = resourceHelper.toURL("resources", clType.data.imageResourceId, 'image', '');
							var exceptionRet = m_srToolStripV.updateImage(
								strSelector, 
								clType.data.name, 
								"",
								strUrl
							);
							if (exceptionRet) {	return exceptionRet; }

							return null;
						
						} catch (e) {

							return e;
						}
					};

					// Coming from types.select. Make sure a new Type is visible.
					self.functionMakeSureToolIsVisible = function(clType) {

						try {

							return m_srToolStripV.functionMakeSureToolIsVisible(clType);

						} catch(e) {

							return e;
						}
					}

					///////////////////////////////////
					// Private fields.

					// Scroll object.
					var m_srToolStripV = null;
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
