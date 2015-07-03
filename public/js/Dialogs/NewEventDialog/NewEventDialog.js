////////////////////////////////////
// NewEventDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the NewEventDialog constructor function.
			var functionNewEventDialog = function () {

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

									templateFile: "Dialogs/NewEventDialog/newEventDialog"
								}, 
								dataEvent: "HTML",
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

							// Show the dialog--load the content from 
							// the EventsDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "New Event",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Create Event",
					            		id: 'CreateEventBtn',
					            		cssClass: "btn-primary",
					            		action: function(){

					            			m_functionCreateEvent();
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
					            draggable: true,
					            onshown: m_functionOnShownDialog
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;
							$("#EventName").focus();

							$("#EventName").blur(m_functionBlurEventName);

							m_setStateCreateBtn();

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionBlurEventName = function() {

							m_setStateCreateBtn();
					}

					var m_setStateCreateBtn = function() {

						var nameStatus = $("#EventName").val().trim().length > 0;

						if (!nameStatus) {
							$("#CreateEventBtn").addClass("disabled");
						} else {
							$("#CreateEventBtn").removeClass("disabled");
						}
					}

					var m_functionCreateEvent = function () {

						try {

							var EventName = $("#EventName").val().trim();
							
							// if (!client.isEventNameAvailableInActiveComic(EventName)) {

							// 	errorHelper.show("That name is already used. Please enter another.");
							// 	return;
							// }

							// // Create minimal Event based on the dialog's fields--or lack thereof.
							// // Call client to inject it throughout.
							// var EventJO = 
							// {
							// 	isApp: false,
							// 	id: 0,
							// 	ordinal: client.getNumberOfEventsInActiveComic(),
							// 	tags: $("#EventTags").val() || "",
							// 	properties: [],
							// 	methods: [],
							// 	events: [],
							// 	dependencies: [],
							// 	name: EventName,
							// 	imageResourceId: m_imageResourceId
							// };

							// var clEvent = new Event();
							// clEvent.load(EventJO);

							// var exceptionRet = client.addEventToProject(clEvent);
							// if (exceptionRet) {

							// 	throw exceptionRet;
							// }

							// m_dialog.close();

						} catch (e) {

							errorHelper.show(e);
						}
					}

					// 3 functions to handle the Image changing link clicks.
					var m_functionSearchClick = function () {

						try {

							var exceptionRet = client.showImageSearchDialog(true, m_functionSetImageSrc);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch(e) {

							errorHelper.show(e);
						}
					}
					
					var m_functionURLClick = function () {

						try {

							var exceptionRet = client.showImageURLDialog(true, m_functionSetImageSrc);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch(e) {

							errorHelper.show(e);
						}
					}
					
					var m_functionDiskClick = function () {

						try {

							var exceptionRet = client.showImageDiskDialog(true, m_functionSetImageSrc);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch(e) {

							errorHelper.show(e);
						}
					}

					// Display the chosen image.
					var m_functionSetImageSrc = function (imageResourceId) {

						m_imageResourceId = imageResourceId;
						$("#EventImage").attr("src", resourceHelper.toURL("resources", m_imageResourceId, "image"));
						m_setStateCreateBtn();
					}
				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_imageResourceId = 0;
			};

			// Return the constructor function as the module object.
			return functionNewEventDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
