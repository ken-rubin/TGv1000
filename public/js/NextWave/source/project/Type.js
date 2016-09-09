/////////////////////
// Type module.
//
// Object manages loading and saving Type data to and  
// from the Library and also, integration with the TypeTree.
// 
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/project/Library"], 
	function (Library) {
	
		try {

            // Constructor function.
			var functionConstructor = function Type(libraryOwner) {

				try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Immeidate owner Library.
                    self.owner = libraryOwner;
                    // Name of this type object.
                    self.name = "type";

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