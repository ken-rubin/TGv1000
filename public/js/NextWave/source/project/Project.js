/////////////////////
// Project module.
//
// Object manages loading and saving project data to and  
// from the Manager and also, integration with the TypeTree.
// 
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/project/Comic",
    "NextWave/source/utility/ListItem"], 
	function (Comic, ListItem) {
	
		try {

            // Constructor function.
			var functionConstructor = function Project() {

				try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Backing data for this instance.
                    self.data = null;
                    // Comics owned by this project.
                    self.comics = [];

                    ///////////////////////////
                    // Public methods.

                    // Create instance.
                    self.create = function (objectProject) {

                        try {

                            // First, save off the data.
                            self.data = objectProject;

                            // Then loop over comics and create children.
                            self.comics = [];
                            for (var i = 0; i < objectProject.comics.length; i++) {

                                // Get the ith Comic.
                                var objectComicIth = objectProject.comics[i];

                                // Allocate and create a new comic and add to collection.
                                var comicIth = new Comic(self);
                                var exceptionRet = comicIth.create(objectComicIth);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                                self.comics.push(comicIth);
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear out the selection in all the associated Comics.
                    self.unselectAllComics = function () {

                        try {

                            // Then loop over Comics and unselect them.
                            for (var i = 0; i < self.comics.length; i++) {

                                // Get the ith Comic.
                                var comicIth = self.comics[i];

                                // Unselect it.
                                var exceptionRet = comicIth.unselect();
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

                            // Loop over Comics and save them.
                            for (var i = 0; i < self.comics.length; i++) {

                                // Get the ith Comic.
                                var comicIth = self.comics[i];

                                // Generate it.
                                var exceptionRet = comicIth.save();
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