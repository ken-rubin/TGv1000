///////////////////////////////
// Type member.  A member of a type: property, method or event.
//
// Return constructor function.
//

define(["Core/errorHelper"],
	function (errorHelper) {

		try {

			// Define the type member constructor function.
			var functionConstructor = function TypeMember() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					// Name of the project.
					self.name = "type1";

					// Block of blockly code DOM.
					self.codeDOM = "";

					// Type of this type member, one 
					// of: property, method or event.
					self.type = "property";
				} catch (e) {

					errorHelper.show(e);
				}
			};

			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
