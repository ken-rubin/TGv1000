/////////////////////
// Library module.
//
// Object manages loading and saving Library data to and  
// from the Comic and also, integration with the TypeTree.
// 
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/project/Comic"], 
	function (Comic) {
	
		try {

            // Constructor function.
			var functionConstructor = function Library(comicOwner) {

				try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Immediate owning instance.
                    self.owner = comicOwner;
                    // Name of this type object.
                    self.name = "library";

                    ///////////////////////////
                    // Public methods.

                    // Create instance.
                    self.create = function () {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Destroys instance.
                    self.destroy = function () {

                        try {

                            // Close up type.
                            self.open = false;

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