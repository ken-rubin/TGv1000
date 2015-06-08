////////////////////////////////////
// ImageDiskDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

		try {

			// Define the ImageDiskDialog constructor function.
			var functionImageDiskDialog = function () {

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

									templateFile: "Dialogs/ImageDiskDialog/imageDiskDialog"
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
					            onshown: m_functionOnShownDialog
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function () {

						try {

							if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {

								m_wellMessage("This browser doesn't support File methods we need. Either switch browsers or use an Internet image.", null);
								return;
							}

							// Wire things up.
						    $("#imageFile").change(m_functionFileHasBeenChosen);
						    $("#ISSaveBtn").click(m_functionSaveLocalResource);
						    $("#ISResetBtn").click(m_functionReset);

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					var m_functionFileHasBeenChosen = function() {

						try {

						    m_fileName = $("#imageFile").val();
						    var fileNameLength = m_fileName.length;

						    if (fileNameLength === 0) {

								m_wellMessage("You didn't select a resource.", null);
								return;
						    }

						    var ext = m_fileName.replace(/^.*\./, '').toLowerCase();
						    if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg'){
						        m_wellMessage('We support only png and jpg (or jpeg) image files.', null);
						        return false;
						    }

						    m_cvs = document.getElementById('iSCanvas'),
						    m_ctx = m_cvs.getContext('2d');
						    m_file = document.getElementById("imageFile").files[0];
						    var img = new Image(),
						        url = window.URL || window.webkitURL,
						        src = url.createObjectURL(m_file);

						    img.src = src;
						    img.onload = function() {
						        var width = img.width;
						        var height = img.height;
						        var maxW = m_cvs.width;
						        var maxH = m_cvs.height;
						        var ratio = 0;
						        if (width > maxW) {
						            ratio = maxW / width;
						            height = height * ratio;
						            width = width * ratio;
						        }
						        if (height > maxH) {
						            ratio = maxH / height;
						            height = height * ratio;
						            width = width * ratio;
						        }
						        
						        m_ctx.clearRect( 0, 0, maxW, maxH);
						        m_ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
						        url.revokeObjectURL(src);

								$("#ISPhase2").css("display", "block");
						    }
						} catch (e) {

							m_wellMessage("Unable to load selected image file.", null);
						}
					}

					var m_functionSaveLocalResource = function () {

						try {

							// Going to use filename w/o extension as friendly name (server side).
							// User must have non-empty tags.
							// Grab userId.
							// On successful return, call callback with resourceId.
							var tags = $("#ISTags").val().trim();
							if (tags.length === 0) {

								m_wellMessage("You didn't enter any tags. They are needed for searching.", null);
								return;
							}

						    var strUserIdResources = client.getTGCookie("userId");
						    var strUserNameResources = client.getTGCookie("userName");

						    var formData = new FormData();

						    formData.append("userId", strUserIdResources);
						    formData.append("userName", strUserNameResources);
						    formData.append("tags", tags);
						    formData.append("resourceTypeId", "1");

						    // Now the file.
						    formData.append("userFile", m_file);

						    var request = new XMLHttpRequest();
							request.open("POST", "/BOL/ResourceBO/SaveResource");
							request.responseType = 'json';
							request.send(formData);

	    					request.onload = function(oEvent){

	        					if (request.status === 200) {

	        						var res = request.response;
	        						if (res.success) {

	        							self.callFunctionOK(res.id);

	        						} else {

	        							// !res.success
	        							m_wellMessage(res.message, null);
	        						}
	        					} else {

	        						// request.status !== 200
	        						m_wellMessage("Could not upload file to server.", null);
	        					}
	        				};
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionReset = function () {

						try {

							$("#imageFile").val("");
					        var maxW = m_cvs.width;
						    var maxH = m_cvs.height;
					        m_ctx.clearRect( 0, 0, maxW, maxH);
							$("#ISNewLocalWell").empty();

							$("#ISPhase2").css("display", "none");

						} catch (e) {

							errorHelper.show(e);
						}
					}

					// Put a message in the well, optionally closing the dialog after n ms.
					var m_wellMessage = function(msg, timeoutAction) {

						try {

							$("#ISNewLocalWell").empty();
							$("#ISNewLocalWell").append("<p class='text-danger'>" + msg + "</p>");

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
			return functionImageDiskDialog;

		} catch (e) {

			errorHelper.show(e.message);
		}
	});
