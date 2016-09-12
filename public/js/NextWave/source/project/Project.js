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
define(["NextWave/source/project/Comic"], 
	function (Comic) {
	
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

                    //////////////////////////
                    // Private fields.

				} catch (e) {

					alert(e.message);
				}				
			};

			return functionConstructor;
		} catch (e) {

			alert(e.message);
		}
	});