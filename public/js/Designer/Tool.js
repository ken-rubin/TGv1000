////////////////////////////////////////
// A single tool item.
//
// Returns constructor function.
//

// Define module.
define(["Core/errorHelper", "Core/resourceHelper"],
	function (errorHelper, resourceHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function Tool() {

				try {

					var self = this;			// Uber closure.

					/////////////////////////////
					// Public properties.

					// Type upon which this tool is based.
					self.type = null;

					/////////////////////////////
					// Public methods.

					// Load up tool.
					self.destroy = function () {

						try {

							// Remove from GUI/DOM.
							m_jTool.remove();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Load up tool.
					self.load = function (type) {

						try {

							// Save tool state.
							self.type = type;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Return the DOM element representing a prototypical tool item.
					self.generateDOM = function () {

						m_jTool = $("<img class='toolstripitem' id='" + 
							m_functionRemoveSpaces(self.type.data.name) + 
							"' src='" +
						 	resourceHelper.toURL(self.type.data.resourceId) + 
						 	"' data-resourceid='" +
						 	self.type.data.resourceId+ 
						 	"' data-type='" + 
						 	self.type.data.name + "' style='width:55px;'></img>");

						return m_jTool;
					};

					///////////////////////////////////////
					// Private methods.

					// Helper method removes spaces from input.
					var m_functionRemoveSpaces = function (strPossiblyWithSpaces) {

						return strPossiblyWithSpaces.replace(/ /g, '');
					};

					///////////////////////////////////////
					// Private fields.

					var m_jTool = null;
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
