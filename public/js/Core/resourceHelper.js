////////////////////////////////////
// ResourceHelper wraps access to resource URLs from ids.
//
// Returns instance.
//

// Define module.
define(["Core/errorHelper"],
	function (errorHelper) {

		try {

			// Define constructor function.
			var functionConstructor = function ResourceHelper() {

				try {

					var self = this;			// Uber closure.

					///////////////////
					// Public methods.

					// Return URL from the id.
					self.toURL = function (strResourceSource, iResourceId, strResourceType, strResourceFilename) {

						// strResourceSource:
						//		resources: return "resources/" + iResourceId + (strResourceType === "image" ? ".png" : ".mp3")
						//		images: return "media/images/" + strResourceFilename
						//		panels: return "media/panels/" + strResourceFilename
						//		comics: return "media/comics/" + iResourceId + ".png"

						if (strResourceSource === "resources") {
							if (iResourceId > 0)
								return "resources/" + iResourceId + (strResourceType === "image" ? ".png" : ".mp3");
							else if (strResourceFilename.length === 0)
								return "media/images/clicktochange.png";
							else
								return strResourceFilename;
						}
						else if (strResourceSource === "images")
							return "media/images/" + strResourceFilename;
						else if (strResourceSource === "panels")
							return "media/panels/" + strResourceFilename;
						else if (strResourceSource === "comics")
							return "media/comics/" + iResourceId + ".png";
						else
							throw new Error("Invalid call to toURL");
					};

					///////////////////
					// Private fields.

					// Private state--the map.
					// var m_arrayMap = ["../media/images/Rube.png",
					// 	"../media/images/0.png",
					// 	"../media/images/plus.png",
					// 	"../media/images/Chester.png",
					// 	"../media/images/Homer.png",
					// 	"../media/images/BlowUp.png"];
				} catch (e) {

					errorHelper.show(e);
				}
			};

			// Return instance of constructor function as module.
			return new functionConstructor();
		} catch (e) {

			errorHelper.show(e);
		}
	});
