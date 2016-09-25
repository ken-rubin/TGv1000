/////////////////////
// Comic module.
//
// Object manages loading and saving Comic data to and  
// from the Project and also, integration with the TypeTree.
// 
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/project/Library"], 
	function (Library) {
	
		try {

            // Constructor function.
			var functionConstructor = function Comic(projectOwner) {

				try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Immediate owning instance.
                    self.owner = projectOwner;
                    // Backing data for this instance.
                    self.data = null;
                    // Libraries owned by this Comic.
                    self.libraries = [];

                    ///////////////////////////
                    // Public methods.

                    // Create instance.
                    self.create = function (objectComic) {

                        try {

                            // First, save off the data.
                            self.data = objectComic;

                            // Then loop over libraries and create children.
                            for (var i = 0; i < objectComic.libraries.length; i++) {

                                // Get the ith Library.
                                var objectLibraryIth = objectComic.libraries[i];

                                // Allocate and create a new Library and add to collection.
                                var libraryIth = new Library(self);
                                var exceptionRet = libraryIth.create(objectLibraryIth);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                                self.libraries.push(libraryIth);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear out the selection in all the associated Libraries.
                    self.unselectAllLibraries = function () {

                        try {

                            // Then loop over libraries and unselect them.
                            for (var i = 0; i < self.libraries.length; i++) {

                                // Get the ith Library.
                                var libraryIth = self.libraries[i];

                                // Unselect it.
                                var exceptionRet = libraryIth.unselect();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Build and return a collection of types.
                    self.generateJavaScript = function (arrayTypes) {

                        try {

                            // Loop over libraries and generate their types.
                            for (var i = 0; i < self.libraries.length; i++) {

                                // Get the ith Library.
                                var libraryIth = self.libraries[i];

                                // Generate it.
                                var exceptionRet = libraryIth.generateJavaScript(arrayTypes);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Loop down to save each method of each type.
                    self.save = function () {

                        try {

                            // Loop over libraries and generate their types.
                            for (var i = 0; i < self.libraries.length; i++) {

                                // Get the ith Library.
                                var libraryIth = self.libraries[i];

                                // Generate it.
                                var exceptionRet = libraryIth.save();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };
				} catch (e) {

					alert(e.message);
				}				
			};

			return functionConstructor;
		} catch (e) {

			alert(e.message);
		}
	});