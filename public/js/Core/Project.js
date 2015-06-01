///////////////////////////////
// Project.  A new, opened or cloned project.
//
// Return constructor function.
//

// 
define(["Core/errorHelper", "Navbar/ComicStrip"],
	function (errorHelper, ComicStrip) {

		try {

			// Define the project constructor function.
			var functionConstructor = function Project() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

	                self.projectId = 0;
	                self.projectName = "name";
	                self.projectDescription = "description";
	                self.projectTags = "tag1 tag2 tag3";
	                self.projectImageResourceId = 123;
	                self.projectPrice = 0.0;
	                self.projectIsTemplate = 0;


					//////////////////////////////
					// Public methods.

					// Attach GUI wrappers.
					self.load = function (objectData) {

						try {

			                self.projectId = objectData.projectId;
			                self.projectName = objectData.projectName;
			                self.projectDescription = objectData.projectDescription;
			                self.projectTags = objectData.projectTags;
			                self.projectImageResourceId = objectData.projectImageResourceId;
			                self.projectPrice = objectData.projectPrice;
			                self.projectIsTemplate = objectData.projectIsTemplate;
							return comicStrip.load(objectData.comicStrip);

						} catch (e) {

							return e;
						}
					};

					// The following will not be called with any gaps or errors in the Project's structure.
					// All images are already resources with their id's in the items in the Project. Etc.
					self.saveToDatabase = function () {

						try {

							$.ajax({

								type: "POST",
								url: "/BOL/ResourceBO/SaveProject",
								contentType: "application/json",
								data: JSON.stringify({
									userId: client.getTGCookie('userId'),
									userName: lient.getTGCookie('userName'),
									projectJson: self
								}),
								dataType: 'json,'
								success: function (objectData, strTextStatus, jqxhr) {

								},
								error: function (jqxhr, strTextStatus, strError) {

								},
								complete: function (jqxhr, strTextStatus) {

									// called after success or error callback completes. Not necessary to do anything here.
								}
							});

							return null;
						
						} catch (e) {

							return e;
						}
					}

					//////////////////////////////
					// Private fields.

					// The strip of comic frames.
					var m_csComicStrip = null;

				} catch (e) {

					errorHelper.show(e);
				}
			};

			return functionConstructor;
			
		} catch (e) {

			errorHelper.show(e);
		}
	});
