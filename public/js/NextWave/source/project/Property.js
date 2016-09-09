/////////////////////
// Property module.
//
// Object manages loading and saving Property data to and  
// from the Type and also, integration with the TypeTree.
// 
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/project/Type"], 
	function (Type) {
	
		try {

            // Constructor function.
			var functionConstructor = function Property(typeOwner) {

				try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Immediately owning Type.
                    self.owner = typeOwner;
                    // Name of this type object.
                    self.name = "property";

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