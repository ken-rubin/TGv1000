////////////////////////////////////
// ImageURLDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

		try {

			// Define the ImageURLDialog constructor function.
			var functionImageURLDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					// bImage: true means image; false means sound
					// functionOK is callback with resourceId as parameter.
					self.create = function(bImage,
						functionOK) {

						try {

							// Save params in private fields.
							m_bImage = bImage;
							m_functionOK = functionOK;

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/ImageURLDialog/imageURLDialog"
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

					self.callFunctionOK = function(iResourceId) {

						try {

							m_functionOK(iResourceId);
							m_dialog.close();

						} catch (e) {

							errorHelper.show(e);
						}
					}

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the ImageSoundDialog jade HTML-snippet.
							m_dialog = BootstrapDialog.show({

								title: m_bImage ? "Image" : "Sound",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [{

					                label: "Close",
					                icon: "glyphicon glyphicon-remove-circle",
					                cssClass: "btn-warning",
					                action: function(dialogItself){

					                    dialogItself.close();
					                }
					            }],
					            draggable: true,
					            onshown: m_functionOnShownDialog	// wires click handlers for New and Search btns.
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function () {

						try {

							// Wire click events.
						    $("#RetrieveURLButton").click(m_functionRetrieveResource);
						    $("#ISSaveBtn").click(m_functionSaveInternetResource);
						    $("#ISResetBtn").click(m_functionReset);

						    $("#URLInput").focus();

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					var m_functionSaveInternetResource = function () {

						try {

							// User may have empty tags.
							// Grab userId.
							// Post info, including url.
							// On successful return, call callback with resourceId.
							var tags = $("#ISTags").val().trim();
							var strResourceName = $("#ISName").val().trim();	// required
							if (strResourceName.length === 0) {

								m_wellMessage('Name is required.', null);
								return;
							}

							var posting = $.post("/BOL/ResourceBO/SaveURLResource", 
								{
									// userId: g_profile["userId"], not needed; sent in JWT
									// userName: g_profile["userName"], not needed; sent in JWT
									url: m_url,
									tags: tags,
									resourceTypeId: 1,
									resourceName: strResourceName
								}, 
								'json');
	    					posting.done(function(data){

	        					if (data.success) {

	        						self.callFunctionOK(data.id);

	        					} else {

	        						// !data.success
	        						errorHelper.show(data.message);
	        					}
	        				});
							// $.ajax({

							// 	type: 'POST',
							// 	url: '/BOL/ResourceBO/SaveURLResource',
							// 	contentType: 'application/json',
							// 	data: {
							// 		userId: g_profile["userId"], 
							// 		userName: g_profile["userName"],
							// 		url: m_url,
							// 		tags: tags,
							// 		resourceTypeId: 1,
							// 		resourceName: strResourceName
							// 	},
							// 	dataType: 'json',
							// 	success: function (data) {

							// 		if (data.success) {

		     //    						self.callFunctionOK(data.id);

							// 		} else {

							// 			// !data.success -- error message in objectData.message
							// 			errorHelper.show(data.message);
							// 		}
							// 	},
							// 	error: function (jqxhr, strTextStatus, strError) {

							// 		// Non-computational error in strError
							// 		errorHelper.show(strError);
							// 	}
							// });
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionReset = function () {

						try {

							$("#URLInput").val("");
							$("#InternetResourceImage").removeAttr("src");
							$("#ISPhase1").css("display", "block");
							$("#ISPhase2").css("display", "none");

						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionRetrieveResource = function() {

						m_url = $("#URLInput").val().trim();
						if (m_url.length === 0) {

							m_wellMessage("You didn't enter a URL.", null);
							return;
						}
						$("#InternetResourceImage").attr("src", m_url);
						$("#ISPhase1").css("display", "none");
						$("#ISPhase2").css("display", "block");
					}

					// Put a message in the well, optionally closing the dialog after n ms.
					var m_wellMessage = function(msg, timeoutAction) {

						try {

							$("#ImageSoundNewInternetWell").empty();
							$("#ImageSoundNewInternetWell").append("<p class='text-danger'>" + msg + "</p>");

							if (timeoutAction !== null) {

								setTimeout(timeoutAction.callback, timeoutAction.waittime);
							}

						} catch (e) {

							errorHelper.show(msg);
						}
					}

				} catch (e) {

					errorHelper.show(e.message);
				}

				/////////////////////////////////
				// Private fields.

				var m_dialog = null;
				var m_bImage = null;
				var m_functionOK = null;
			};

			// Return the constructor function as the module object.
			return functionImageURLDialog;

		} catch (e) {

			errorHelper.show(e.message);
		}
	});
