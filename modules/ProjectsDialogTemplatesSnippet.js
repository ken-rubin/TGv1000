//////////////////////////////////////
// Get list of templates.
//

// Export module.
module.exports = function Templates() {
	
	// Specify processor method.
	this.process = function (objectBody) {

		// Augment the parameter.
		objectBody.templates = [{

			id: "SomeTemplate",
			name: "Some Template",
			description: "Build a game to blow up all your friends.",
			imageUrl: "/media/images/BlowUp.png",
			user: "John"
		}, {

			id: "SomeOtherTemplate",
			name: "Some Other Template",
			description: "Rube-Goldburg project--catch the mouse.",
			imageUrl: "/media/images/Rube.png",
			user: "John"
		}, {

			id: "YetAnotherTemplate",
			name: "Yet Another Template",
			description: "It is: 'write your own compiler' day, here at TechGroms today.",
			imageUrl: "/media/images/Impossible.png",
			user: "John"
		}];
	};
};
