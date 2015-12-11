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

							client.setBrowserTabAndBtns();

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
							if (exceptionRet) { throw exceptionRet; }

							self.data = null;

							exceptionRet = code.reset(true);
							if (exceptionRet) { throw exceptionRet; }

							client.projectIsClean();

							return designer.unload();

						} catch(e) {

							return e;
						}
					}

					// The following will not be called with any gaps or errors in the Project's structure.
					// All images are already resources with their id's in the items in the Project. Etc.
					self.saveToDatabase = function (strSaveType) {

						try {

							// errorHelper.show("We're not doing this yet", 4000);
							// return;

							var data = {
									userId: g_strUserId,
									userName: g_strUserName,
									saveType: strSaveType,
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

										errorHelper.show('Project was saved', 1000);

										// objectData holds a completely filled in (likely modified) project: objectData.project.
										// We need to replace this with that. Let's try:
										
										client.unloadProject(null, false);	// We just saved. No callback and block displaying the "Abandon Project" dialog.
										
										// cause whichever dialog was open to close.
										client.closeCurrentDialog();

										// Set up the modified project.
										client.loadedProject(objectData.project);

										// Set dirty bool to false in client
										client.projectIsClean();

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

							client.setBrowserTabAndBtns();

							return null;
						
						} catch (e) {

							return e;
						}
					};

					self.getStatus = function () {


						var test = parseInt(client.getTGCookie('userId'), 10);
						return {

							inDBAlready: (self.data.id > 0),
							userOwnsProject: (self.data.ownedByUserId === test),
							allRequiredFieldsFilled: (	self.data.name.trim().length > 0 
											&& (self.data.imageId > 0 || self.data.altImagePath.length > 0)
										),
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
