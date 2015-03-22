//////////////////////////////////////
// Get list of user's projects.
//

// Export module.
module.exports = function Templates() {
	
	// Specify processor method.
	this.process = function (objectBody) {

		// objectBody contains the userId.  It is used to lookup the list of projects to load up.

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
		}];
	};
};
