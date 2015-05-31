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
							client.removeSpaces(self.type.data.typeName) + 
							"' src='" +
						 	resourceHelper.toURL('resources', self.type.data.typeImageResourceId, 'image') + 
						 	"' data-resourceid='" +
						 	self.type.data.typeImageResourceId+ 
						 	"' data-type='" + 
						 	self.type.data.typeName + "' style='width:55px;'></img>");

						return m_jTool;
					};

					// Type image has changed, update tool.
					self.updateImage = function () {

						try {

							// Compose the id.
							var strId = client.removeSpaces(self.type.data.typeName);

							//  Select the DOM element for the tool.
							var jToolDOM = $("#" + strId);
							if (jToolDOM.length != 1) {

								throw new Error("Selected invalid number of tools on image update: " + strId);
							}

							// Update the resourceId and src attributes on the DOM.
							jToolDOM.attr("data-resourceid",
								self.type.data.typeImageResourceId);
							jToolDOM.attr("src",
								resourceHelper.toURL('resources', self.type.data.typeImageResourceId, 'image'));

						} catch (e) {

							return e;
						}
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
