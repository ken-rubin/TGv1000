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
					self.load = function (project) {

						try {

							self.data = project;
							client.setProjectDirtyBool(true);

							return comics.load(self.data.comics);	// the global object

						} catch (e) {

							return e;
						}
					};

					self.addType = function(clType) {

						try {

							return comics.addTypeToActiveComic(clType);

						} catch (e) {

							return e;
						}
					}

					// Make like there's no project, because there soon won't be.
					// It's meant to be the opposite of self.load.
					self.unload = function () {

						try {

							var exceptionRet = comics.unload();	// the global object
							if (exceptionRet) {

								throw exceptionRet;
							}

							self.data = null;

							return null;

						} catch(e) {

							return e;
						}
					}

					// The following will not be called with any gaps or errors in the Project's structure.
					// All images are already resources with their id's in the items in the Project. Etc.
					self.saveToDatabase = function () {

						try {

							var strUserId = client.getTGCookie('userId');
							var strUserName = client.getTGCookie('userName');

							var data = {
									userId: strUserId,
									userName: strUserName,
									projectJson: self.data
							};

							$.ajax({

								type: 'POST',
								url: '/BOL/ProjectBO/SaveProject',
								contentType: 'application/json',
								data: JSON.stringify(data),
								dataType: 'json',
								success: function (objectData, strTextStatus, jqxhr) {

									if (objectData.success) {

										// objectData holds a completely filled in (likely modified) project: objectData.project.
										// We need to replace this with that. Let's try:
										
										client.unloadProject();
										
										// cause whichever dialog was open to close.
										client.closeCurrentDialog();

										// Set up the modified project.
										client.functionNewProject(objectData.project);

									} else {

										// !objectData.success -- error message in objectData.message
										errorHelper.show(objectData.message);
									}
								},
								error: function (jqxhr, strTextStatus, strError) {

									// Non-computational error in strError
									errorHelper.show(strError);
								}
							});

							client.setProjectDirtyBool(false);	// Reset menu items.

							return null;
						
						} catch (e) {

							return e;
						}
					};

					self.setImageResourceId = function (imageResourceId) {

						self.data.imageResourceId = imageResourceId;
						self.setDirtyBool(true);
					}

					self.setDirtyBool = function (bVal) {

						self.data.isDirty = bVal;
					}

					self.getStatus = function () {

						return {

							inDBAlready: (self.data.id > 0),
							userOwnsProject: (self.data.createdByUserId === client.getTGCookie('userId')),
							allRequiredFieldsFilled: (	self.data.name.trim().length > 0 
											&& self.data.imageResourceId > 0
										),
							isDirty: self.data.isDirty,
							projectNameIsFilled: (self.data.name.trim().length > 0)
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
