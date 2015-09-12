////////////////////////////////////////
// A single comic frame.
//
// Returns constructor function.
//

// Define module.
define(["Core/errorHelper", "Core/resourceHelper"],
	function (errorHelper, resourceHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function Comic() {

				try {

					var self = this;			// Uber closure.

					/////////////////////////////
					// Public properties.

					// Data object.
					// Schema:
					// id -- DB id of comic.
					// name -- Name of comic.
					// resourceId -- Image URL.
					// tools -- the data for the toolstrip.
					// types -- the data for the typestrip.
					self.data = null;

					/////////////////////////////
					// Public methods.

					// Activate/select comic instance.
					self.activate = function () {

						try {

							// Set as active comic in comic strip.
							var exceptionRet = comics.select(self);
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Clear prior data out of Blockly and code.
							exceptionRet = code.reset();
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Create or re-create the strips with this comic's data.
							return types.load(self.data.types);
							
						} catch (e) {

							return e;
						}
					};

					// Create comic instance.
					self.load = function (comic) {

						try {

							// Save state.
							self.data = comic;
							return null;

						} catch (e) {

							return e;
						}
					};

					self.unload = function () {

						try {

							var exceptionRet = types.unload();	// The global object
							if (exceptionRet) {

								throw exceptionRet;
							}

						} catch(e) {

							return e;
						}
					}

					self.addType = function(clType) {

						try {

							// First add clType.data to self.types.items.
							self.data.types.items.push(clType.data);

							// Then add to the global types.
							var exceptionRet = types.addItem(clType);
							if (exceptionRet) { throw exceptionRet; }

					        // Also add to the designer/tool strip.
							exceptionRet = tools.addItem(clType);
							if (exceptionRet) { throw exceptionRet; }

							// Then select the created tool to fill the TypeWell
							exceptionRet = types.select(clType);
							if (exceptionRet) { throw exceptionRet; }

							return null;

						} catch(e) {

							return e;
						}
					}

					// Return the DOM element representing a prototypical comic item.
					// self.generateDOM = function () {

					// 	return $("<img class='comicstripitem' id='" + 
					// 		self.data.name + 
					// 		"' src='" +
					// 	 	resourceHelper.toURL('resources', self.data.imageId, 'image', '') + 
					// 	 	"'></img>");
					// };
				} catch (e) {

					errorHelper.show(e);
				}
			}

			// Return constructor function.
			return functionConstructor;

		} catch (e) {

			errorHelper.show(e);
		}
	});
