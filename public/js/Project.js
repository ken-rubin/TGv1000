///////////////////////////////
// Project.  A new, opened or cloned project.
//
// Return constructor function.
//

define(["errorHelper"],
	function (errorHelper) {

		try {

			// Define the project constructor function.
			var functionConstructor = function Project() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					// Name of the project.
					self.name = "project1";

					// Description of project.
					self.description = "this is a test of the emergency broadcast system....";

					// Image resource id.
					self.imageResourceId = 1;

					//////////////////////////////
					// Public methods.

					// Attach GUI wrappers.
					self.create = function () {

						try {

							m_csComicStrip = new ComicStrip();
							var exceptionRet = m_csComicStrip.create();
							if (exceptionRet) {

								return exceptionRet;
							}
							m_tsToolStrip = new ToolStrip();
							var exceptionRet = m_tsToolStrip.create();
							if (exceptionRet) {

								return exceptionRet;
							}
							m_tsTypeStrip = new TypeStrip();
							return m_tsTypeStrip.create();
						} catch (e) {

							return e;
						}
					};

					// initialize a new project.
					self.initialize = function () {

						try {

							// Call general create method.
							var exceptionRet = self.create();
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					//////////////////////////////
					// Private fields.

					// The strip of comic frames.
					var m_csComicStrip = null;
					// The strip of tools.
					var m_tsToolStrip = null;
					// The strip of types.
					var m_tsTypeStrip = null;
				} catch (e) {

					errorHelper.show(e);
				}
			});

			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
