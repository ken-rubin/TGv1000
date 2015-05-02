////////////////////////////////////////
// A single tool instance.
//
// Returns constructor function.
//

// Define module.
define(["Core/errorHelper", "Core/resourceHelper"],
	function (errorHelper, resourceHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function ToolInstance(strId, strType, strResourceId, iLeft, iTop, iWidth, iHeight) {

				try {

					var self = this;			// Uber closure.

					/////////////////////////////
					// Public properties.

					self.id = strId || "0";
					self.type = strType || "";
					self.resourceId = strResourceId || "";
					self.left = iLeft || 0;
					self.top = iTop || 0;
					self.width = iWidth || 100;
					self.height = iHeight || 100;

                    // Load up the image.
                    self.imageRender = new Image();
                    self.imageRender.src = resourceHelper.toURL(self.resourceId);

					/////////////////////////////
					// Public methods.

					// Output to canvas.
					self.render = function (context) {

						try {

                            context.drawImage(self.imageRender,
                                self.left, 
								self.top,
								self.width,
								self.height);

							return null;
						} catch (e) {

							return e;
						}
					};

					///////////////////////////////////////
					// Private methods.

					///////////////////////////////////////
					// Private fields.
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