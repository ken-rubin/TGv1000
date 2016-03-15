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

							return designer.unload();

						} catch(e) {

							return e;
						}
					}

					// The following will not be called with any gaps or errors in the Project's structure.
					// All images are already resources with their id's in the items in the Project. Etc.
					self.saveToDatabase = function () {

						try {

							var data = {
									// userId: g_profile["userId"], not needed; sent in JWT
									// userName: g_profile["userName"], not needed; sent in JWT
									projectJson: self.data
							};

							// If !data.projectJson.specialProjectData.systemTypesEdited, then success and error mean that the project was or wasn't saved to the database.
							// If not saved, it was rolled back.
							//
							// If data.projectJson.specialProjectData.systemTypesEdited, the save code will collect and try to write a complete SQL script to the project root
							// directory that can be run to propagate any changes or additions to System Types. This script is written to ST.sql.
							// We attempt to write the SQL script only if the saving of the project to the database succeeded and wasn't rolled back.
							// This means that we could encounter two cases: the project was saved to the database and the script file was created successfully;
							// or the project was saved to the database and the script file wasn't created.
							// Object data is returned for both these cases with success=true.
							$.ajax({

								type: 'POST',
								url: '/BOL/ProjectBO/SaveProject',
								contentType: 'application/json',
								data: JSON.stringify(data),
								dataType: 'json',
								success: function (objectData, strTextStatus, jqxhr) {

									if (objectData.success) {

										if (!objectData.project.specialProjectData.systemTypesEdited) {
											errorHelper.show('Project was saved', 1000);
										} else {
											if (objectData.scriptSuccess) {
												errorHelper.show("Your project was saved to the database and the System Type script ST.sql was created.", 5000);
											} else {
												errorHelper.show("Your project was saved to the database, but the System Type script COULD NOT be created. Writing the script failed with message: " + saveError.message + ".");
											}
										}

										// objectData holds a completely filled in (likely modified) project: objectData.project.
										// We need to replace this with that. Let's try:
										
										client.unloadProject(null, false);	// We just saved. No callback and block displaying the "Abandon Project" dialog.
																			// This is the only place that calls client.unloadProject with 2nd param = false.
										
										// cause whichever dialog was open to close.
										client.closeCurrentDialog();

										// Set up the modified project.
										client.load_m_clProject(objectData.project);

										client.setBrowserTabAndBtns();

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

							return null;
						
						} catch (e) {

							return e;
						}
					};

					self.getStatus = function () {


						var test = parseInt(g_profile['userId'], 10);
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
