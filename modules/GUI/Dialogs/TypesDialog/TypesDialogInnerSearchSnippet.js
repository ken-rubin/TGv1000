//////////////////////////////////////
// Get list of types.
//

// Export module.
module.exports = function Types() {
	
	// Specify processor method.
	this.process = function (objectBody) {

		// objectBody contains the search string.  It is used to lookup the list of projects to load up.

		// Augment the parameter.
		objectBody.types = [{

			id: "MyType",
			name: "My Type",
			description: "This is a test of the emergency broadcast system...",
			imageUrl: "/media/images/Fred.png",
			user: "Ken"
		}, {

			id: "MyOtherType",
			name: "My Other Type",
			description: "If this had been an actual emergency, you would be dead.",
			imageUrl: "/media/images/Homer.png",
			user: "Ken"
		}, {

			id: "YetAnotherType",
			name: "Yet Another Type",
			description: "This is a type that can only be found from the search function.",
			imageUrl: "/media/images/Marvin.png",
			user: "Ken"
		}, {

			id: "AFinalType",
			name: "A Final Type",
			description: "This is a type that was added just so the search function returned more types than the other types.",
			imageUrl: "/media/images/Chester.png",
			user: "Ken"
		}];
	};
};
