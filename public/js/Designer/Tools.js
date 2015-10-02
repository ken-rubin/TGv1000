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
								100,					// item width
								60,					// item height
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
						m_arrayTools = [];
					}

					// Add tool to strip.
					self.addItem = function (clType,
						iBase,
						bInLoadLoop													// See types.load for comment about bInLoadLoop.
						) 
					{
						try {

							// For adding a single new Type (not in a load loop), we'll need to set iBase.
							if (!bInLoadLoop && typeof iBase === 'undefined') {

								iBase = m_arrayTools.length;
							}

							var tool = new Tool();
							var exceptionRet = tool.load(clType);
							if (exceptionRet) { return exceptionRet; }

							// Add to the DOM.
							var jItem = null;
							var exceptionRet = m_srToolStripV.addImage(
								iBase,
								"tool-" + client.removeSpaces(clType.data.name),	// id
								clType.data.name,									// name for tooltip
								"",													// no description--at this time
								resourceHelper.toURL(								// image url
									'resources', 
									clType.data.imageId, 
									'image'
								),
								'toolstripitem',									// item class
								function (jItemAdded) {	jItem = jItemAdded },		// post creation callback so we can use jItem (see below)
								bInLoadLoop || false,								// If it wasn't passed in (new Type added), then false. If in a Types.load loop, then true.
								"data-type='" + (clType.data.isApp ? "App" : clType.data.name) + "'"				// This becomes the type of the ToolInstance. Done this way in case App type had been renamed.
							);
							if (exceptionRet) {	throw exceptionRet; }

							// Also add to the collection of comics.
							m_arrayTools.push(tool);

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
					self.removeItem = function (clType) {

						try {

							// Find the matching tool.
							for (var i = 0; i < m_arrayTools.length; i++) {

								// Splice on match.
								if (m_arrayTools[i].type.name === clType.data.name) {

									// Get the tool.
									var toolIth = m_arrayTools[i];

									// Remove form GUI.
									var exceptionRet = m_srToolStripV.removeImage(clType.data.name, i);
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
							var strUrl = resourceHelper.toURL("resources", clType.data.imageId, 'image', '');
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

					// A Type has been renamed. Change the corresponding tool's tooltip in m_srToolStripV.
					self.changeTooltipAndId = function(strOriginalName, strNewName) {

						try {

							// First fix the tool representation in m_srToolStripV.
							// No need to destroy and re-establish tooltip. We'll do it manually. It works better.
							var jItem = $("#tool-" + client.removeSpaces(strOriginalName));
							jItem.attr({"data-original-title": strNewName});
							jItem.attr("id", "tool-" + client.removeSpaces(strNewName));
							jItem.attr("data-type", strNewName);

							// Note: the name of the tool in m_arrayTools has been changed since the Type's name was changed already.

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
