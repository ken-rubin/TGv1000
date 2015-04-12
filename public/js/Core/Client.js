///////////////////////////////
// Client module runs client state and manages gui/server interaction.
//
// Return constructor function.
//

define(["Core/errorHelper", "Dialogs/ProjectsDialog/ProjectsDialog", "Core/Project"],
	function (errorHelper, ProjectsDialog, Project) {

		try {

			// Define the client constructor function.
			var functionConstructor = function Client() {

				try {

					var self = this;		// Uber closure.

					//////////////////////////////
					// Public properties.

					// Main client state field.
					// Initialize, steadystate, closing.
					self.state = "initialize";

					//////////////////////////////
					// Public methods.

					// Start off the client.
					self.create = function (iUserId) {

						try {

							// Save.
							m_iUserId = iUserId;

							return self.showProjectsDialog();
						} catch (e) {

							return e;
						}
					};

					// Open popup--map callbacks to private functions.
					self.showProjectsDialog = function () {

						try {

							var pd = new ProjectsDialog();
							var exceptionRet = pd.create(m_iUserId,
								m_functionNewProject,
								m_functionOpenProject,
								m_functionCloneProject);
							if (exceptionRet) {

								throw exceptionRet;
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					///////////////////////////////
					// Private functions.

					// Invoked when the project dialog exist newly.
					var m_functionNewProject = function () {

						try {

				    		// Allocate project.
				    		m_project = new Project();
				    		return m_project.initialize();
						} catch (e) {

							return e;
						}
					};

					// Invoked when the project dialog exist openly.
					var m_functionOpenProject = function (strId) {

						try {

				    		BootstrapDialog.alert(":Open " + strId + " project....");

							return null;
						} catch (e) {

							return e;
						}
					};

					// Invoked when the project dialog exist clonely.
					var m_functionCloneProject = function (strId) {

						try {

				    		BootstrapDialog.alert(":Clone " + strId + " project....");

							return null;
						} catch (e) {

							return e;
						}
					};

					/////////////////////////////////
					// Private fields.

					// The current project.
					var m_project = null;
				} catch (e) {

					errorHelper.show(e);
				}
			};

			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
