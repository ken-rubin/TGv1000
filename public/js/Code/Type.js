///////////////////////////////
// Type.  A sort of thing.
//
// Return constructor function.
//

// Define Type module.
define(["Core/errorHelper", "Core/resourceHelper", "Core/contextMenu", "Navbar/Comic", "Navbar/Comics"],
	function (errorHelper, resourceHelper, contextMenu, comic, comics) {

		try {

			// Define the type constructor function.
			var functionConstructor = function Type() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					// The data this instance wrapps.
					// Schema:
					// add -- indicates this is the addtype type.
					// app -- indicates this is the app type.
					// properties -- collection of properties of type.
					// methods -- collection of methods of type.
					// events -- collection of events of type.
					// dependencies -- collection of dependencies of type.
					// id -- the DB id of type.
					// name -- the name of type.
					// imageId -- the image id.
					self.data = null;

					/////////////////////////////
					// Public methods.

					// Create this instance.
// used					
					self.load = function (typesItem) {

						try {

							// Save data.
							self.data = typesItem;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Activate/select type instance.
// not used					
					self.activate = function () {

						try {

							// Cause types to fill the type well with this type.
							return types.select(self);
							
						} catch (e) {

							return e;
						}
					};

					// Activate/select type instance.
// used					
					self.setActive = function (iIndex, arrayActive) {

						try {

							m_arrayActive = arrayActive;
							m_iActiveIndex = iIndex;

							return null;
						} catch (e) {

							return e;
						}
					};

					// Destroy this instance.
//not used					
					self.destroy = function () {

						try {

							// Remove type from DOM.
							m_jType.remove();

							return null;
						} catch (e) {

							return e;
						}
					};

					// Helper method returns the specified method.
// used					
					self.getMethod = function (strMethod) {

						// Loop over and add the methods.
						for (var i = 0; i < self.data.methods.length; i++) {

							// Get the method and test it for name.
							var methodIth = self.data.methods[i];
							if (methodIth.name === strMethod) {

								// Return the specified method.
								return methodIth;
							}
						}

						return null;
					};

					// Loop over all methods, indicate if the specified
					// string is found in any of their workspaces.
					// Returns the method referenced or null.
// used					
					self.isReferencedInWorkspace = function (strTest) {

						// Loop over the collection of methods.
						for (var i = 0; i < self.data.methods.length; i++) {

							var methodIth = self.data.methods[i];

							// Get the workspace.
							var strWorkspace = methodIth.workspace;

							// Check.
							if (strWorkspace.indexOf(strTest) !== -1) {

								// Save this type in the method to make it 
								// easier to report on who the method is.
								methodIth.type = self;
								return methodIth;
							}
						}

						return null;
					};

					// Loop over all methods, updates their workspace with the replacement.
					// Returns the method referenced or null.
// used					
					self.replaceInWorkspaces = function (strOld, strNew) {

						// Loop over the collection of methods.
						for (var i = 0; i < self.data.methods.length; i++) {

							var methodIth = self.data.methods[i];

							// Construct the global RegExp and apply to workspace.
							// In keeping with convention, concatenating surrounding quotation marks has not been done yet, but is put off till the replace.
							var re = new RegExp('"' + strOld + '+',"g");
							if (methodIth.workspace) {

								methodIth.workspace = methodIth.workspace.replace(re,
									'"' + strNew + '"');
							}
						}

						return null;
					};

					// Update the blockly data in the active member.
					self.update = function (strWorkspace) {

						try {

							// Drop out if no active member.
							if (m_iActiveIndex == -1 ||
								!m_arrayActive) {

								return null;
							}

							// Get the item.
							var itemActive = m_arrayActive[m_iActiveIndex];

							// Replace the workspace of the active method.
							itemActive.workspace = strWorkspace;

							return null;
						} catch (e) {

							return e;
						}
					};

					self.updateYourImage = function(imageId) {

						m_functionOnGotResourceId(imageId);
					}

					///////////////////////////////////////
					// Private methods

//used
					var m_functionOnGotResourceId = function (iResourceId) {

						try {

							if (typeof iResourceId !== 'undefined' && iResourceId !== null && iResourceId > 0) {

								// Save off the new resource in state.
								self.data.imageId = iResourceId;

								// Call off to the designer to update the picture in the designer surface.
								var exceptionRet = designer.updateImage(self);
								if (exceptionRet) {

									throw exceptionRet;
								}

								// Call off to Types to change the image in the TypeWell and the toolstrip.
								exceptionRet = types.updateActiveTypeImage();
								if (exceptionRet) {

									throw exceptionRet;
								}

							} else {

								throw new Error("Bad ResourceId received from ImageSoundDialog chain.");
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					///////////////////////////////////////
					// Private fields.

					// The root GUI container object.
					var m_jType = null;
					// The active index for this type.
					var m_iActiveIndex = -1;
					// Active collection of members.
					var m_arrayActive = null;
					// Original name about to be renamed.
					var m_strOriginalName = "";
				} catch (e) {

					errorHelper.show(e);
				};
			};

			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
