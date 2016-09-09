/////////////////////
// Event module.
//
// Object manages loading and saving Event data to and  
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
			var functionConstructor = function Event(typeOwner) {

				try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Immediate owning type.
                    self.owner = typeOwner;
                    // Name of this type object.
                    self.name = "event";

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