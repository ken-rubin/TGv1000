///////////////////////////////
// Project.  A new, opened or cloned project.
//
// Return constructor function.
//

// 
define(["Core/errorHelper", "Navbar/Comics"],
	function (errorHelper, Comics) {

		try {

			// Define the project constructor function.
			var functionConstructor = function Project() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					self.data = null;

					//////////////////////////////
					// Public methods.

					// Attach GUI wrappers.
					self.load = function (objectData) {

						try {

							self.data = objectData;
							client.setProjectDirtyBool(true);

							return comics.load(objectData.comics);

						} catch (e) {

							return e;
						}
					};

					// The following will not be called with any gaps or errors in the Project's structure.
					// All images are already resources with their id's in the items in the Project. Etc.
					self.saveToDatabase = function () {

						try {

							var strUserId = client.getTGCookie('userId');

							var sdata = JSON.stringify({
									userId: strUserId,
									userName: client.getTGCookie('userName'),
									projectJson: self.data
								});
							alert('Sending ' + sdata);

							$.ajax({

								type: "POST",
								url: "/BOL/ResourceBO/SaveProject",
								contentType: "application/json",
								data: sdata,
								dataType: 'json',
								success: function (objectData, strTextStatus, jqxhr) {

									if (objectData.success) {

										// objectData holds a completely filled in project: objectData.project.
										// We need to replace this with that. Let's try:
										
										client.closeProject();
										
										// cause whichever dialog was open to close.
										client.closeCurrentDialog();

										client.functionNewProject(objectData.project);

									} else {

										// !objectData.success -- error message in objectData.message
										throw new Error(objectData.message);
									}
								},
								error: function (jqxhr, strTextStatus, strError) {

									// Non-computational error in strError
									throw new Error(strError);
								}
							});

							client.setProjectDirtyBool(false);	// Reset menu items.

							return null;
						
						} catch (e) {

							return e;
						}
					};

					self.setDirtyBool = function (bVal) {

						self.data.isDirty = bVal;
					}

					self.getStatus = function () {

						return {

							inDBAlready: (self.data.id > 0),
							userOwnsProject: (self.data.createdByUserId === client.getTGCookie('userId')),
							canBeQuickSaved: (	self.data.name.trim().length > 0 
											&& self.data.tags.trim().length > 0 
											// && self.data.imageResourceId > 0
										),
							isDirty: self.data.isDirty
						};
					};

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
