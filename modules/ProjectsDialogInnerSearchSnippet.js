//////////////////////////////////////
// Get list of user's projects.
//

// Export module.
module.exports = function Templates() {
	
	// Specify processor method.
	this.process = function (objectBody) {

		// objectBody contains the search string.  It is used to lookup the list of projects to load up.

		// Augment the parameter.
		objectBody.projects = [{

			id: "MyProject",
			name: "My Project",
			description: "This is a test of the emergency broadcast system...",
			imageUrl: "/media/images/Fred.png",
			user: "Ken"
		}, {

			id: "MyOtherProject",
			name: "My Other Project",
			description: "If this had been an actual emergency, you would be dead.",
			imageUrl: "/media/images/Homer.png",
			user: "Ken"
		}, {

			id: "YetAnotherProject",
			name: "Yet Another Project",
			description: "This is a project that can only be found from the search function.",
			imageUrl: "/media/images/Marvin.png",
			user: "Ken"
		}, {

			id: "AFinalProject",
			name: "A Final Project",
			description: "This is a project that was added just so the search function returned more projects than the other types.",
			imageUrl: "/media/images/Chester.png",
			user: "Ken"
		}];
	};
};
