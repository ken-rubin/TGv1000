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
define(["NextWave/source/project/Project"], 
	function (Project) {
	
		try {

            // Constructor function.
			var functionConstructor = function Comic(projectOwner) {

				try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Immediate owning instance.
                    self.owner = projectOwner;
                    // Name of this type object.
                    self.name = "comic";

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