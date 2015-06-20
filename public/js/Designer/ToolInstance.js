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
			var functionConstructor = function ToolInstance(strId, strType, strSrc, iLeft, iTop, iWidth, iHeight) {

				try {

					var self = this;			// Uber closure.

					/////////////////////////////
					// Public properties.

					self.id = strId || "0";
					self.type = strType || "";
					self.src = strSrc || "";
					self.left = iLeft || 0;
					self.top = iTop || 0;
					self.width = iWidth || 100;
					self.height = iHeight || 100;

                    // Allocate the image.
                    self.imageRender = new Image();

                    // Set callback to refresh display when image is loaded.
                    $(self.imageRender).bind("load", function () { designer.refresh(); });

                    // Load up the image.
                    self.imageRender.src = strSrc;

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

					// Type image has changed, update tool.
					self.updateImage = function (iImageResourceId) {

						try {

							// Save state.
							self.src = resourceHelper.toURL('resources', iImageResourceId, 'image');

		                    // Load up the image.
		                    self.imageRender.src = self.src;
						} catch (e) {

							return e;
						}
					};
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
