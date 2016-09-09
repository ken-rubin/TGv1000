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
define([], 
	function () {
	
		try {

            // Constructor function.
			var functionConstructor = function Project() {

				try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Name of this type object.
                    self.name = "project";

                    ///////////////////////////
                    // Public methods.

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        return self.name;
                    };

                    // Create instance.
                    self.create = function () {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Destroys instance.
                    self.save = function () {

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