//////////////////////////////////////////
// ImageSoundDialog new LOCAL FILE button handler. 
//
// Return constructor function.
//

// Define an AMD module.
define(["Core/snippetHelper", "Core/errorHelper"], 
	function (snippetHelper, errorHelper) {

		try {

			// Define the function constructor returned as "this" module.
			var functionHandler = function () {

				var self = this;

				//////////////////////////////////////
				// Public methods.

				// Initialize this object.
				self.create = function (objectContext) {

					try {

						// Save context state.  This is known to be a dialog because this module
						// is always loaded as the result of a button click in a popup dialog.
						m_dialogContext = objectContext.dialog;
						m_pdParent = objectContext.parent;

						// // Activate tooltips.
						// $("[data-toggle='tooltip']").tooltip();

						if (window.File && window.FileReader && window.FileList && window.Blob) {

						} else {

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

				//////////////////////////////////////
				// Private methods.

				var m_functionFileHasBeenChosen = function() {

					try {

					    m_fileName = $("#imageFile").val();
					    var fileNameLength = m_fileName.length;

					    if (fileNameLength === 0) {

							m_wellMessage("You didn't select a resource.", null);
							return;
					    }

					    var ext = m_fileName.replace(/^.*\./, '').toLowerCase();
					    if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg' && ext !== 'gif'){
					        m_wellMessage('We support only png, jpg (or jpeg) and gif image files.', null);
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

        							m_pdParent.callFunctionOK(res.id);

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

				//////////////////////////////////////
				// Private fields.

				// The owning dialog.
				var m_dialogContext = null;
				// The ImageSoundDialog object which owns the "owning dialog".
				var m_pdParent = null;
				var m_cvs = null;
				var m_ctx = null;
				var m_file = null;
				var m_fileName = null;
			};

			return functionHandler;
		} catch (e) {

			errorHelper.show(e);
		}
	});
