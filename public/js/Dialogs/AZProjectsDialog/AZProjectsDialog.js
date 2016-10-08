////////////////////////////////////
// AZProjectsDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the AZProjectsDialog constructor function.
			var functionAZProjectsDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function() {

						try {

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/AZProjectsDialog/AZProjectsDialog"
								}, 
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionRenderJadeSnippetResponse).error(errorHelper.show);

							return null;
						} catch (e) {

							return e;
						}
					};

					self.closeYourself = function() {

						m_dialog.close();
					}

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							BootstrapDialog.show({

								title: "Work with Users' Projects, Types, Methods, Images, Videos and Sounds",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Create Product",
					            		id: 'createBtn',
					            		cssClass: "btn-primary",
					            		action: function(){

					            		}
					            	},
					            	{
						                label: "Close",
						                icon: "glyphicon glyphicon-remove-circle",
						                cssClass: "btn-warning",
						                action: function(dialogItself){

						                    dialogItself.close();
						                }
					            	}
					            ],
					            draggable: false,
					            onshown: m_functionOnShownDialog
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							$(".tt-selector .btn-default").powerTip({
								smartPlacement: true
							});
							
							// Save the dialog object reference.
							m_dialog = dialogItself;

							// Wire up drag/drop events.
							$("#DropDiv").on("dragenter", function(event){m_functionDragenter(event);});
							$("#DropDiv").on("dragover", function(event){m_functionDragover(event);});
							$("#DropDiv").on("drop", function(event){m_functionDodrop(event);});

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionDragenter = function(event) {

						$("#DropDiv").text('');
						event.stopPropagation();
					}

					var m_functionDragover = function(event) {

						event.stopPropagation();
						event.preventDefault();
					}

					var m_functionDodrop = function(event) {

						event.stopPropagation();
						event.preventDefault();
					
						var dt = event.originalEvent.dataTransfer;
						var files = dt.files;

						var count = files.length;
						if (count !== 1) {

							errorHelper.show("You dropped " + count + ' files. We want only one.');

						} else {

							var file = files[0];
							var parts = file.name.split('.');
							if (parts.length !== 2 || parts[1] !== 'json') {

								errorHelper.show("You are allowed to drop only a json type file, created in this app.");

							} else {

								var reader = new FileReader();
								reader.onload = function(e) {

									var JSONtext = reader.result;
									var objectData = JSON.parse(JSONtext);

									// user dragged and dropped a JSON file that can be a project or a library.
									if (objectData.hasOwnProperty('originalProjectId')) {

										client.unloadProject(null, false);
										
										// cause whichever dialog was open to close. Like this one.
										client.closeCurrentDialog();

										// Set up the modified project.
										// specialProjectData.openMode might be "new". Change to "loaded". It's no longer new.
										// This will get saving to work correctly down the road.
										objectData.specialProjectData.openMode = "loaded";
										client.project = objectData;
										client.loadProjectIntoManager();
										client.setBrowserTabAndBtns();

									} else if (objectData.hasOwnProperty('originalLibraryId')) {

										// Load the library into manager.
										// Look for and replace one with similar name?
										// ???

									} else {

										errorHelper.show('Could not discern project or library.')
									}
								}

								reader.readAsText(file);
							}
						}
					}
				} catch (e) {

					errorHelper.show(e.message);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
			};

			// Return the constructor function as the module object.
			return functionAZProjectsDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
