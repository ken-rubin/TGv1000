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

						// Wire things up.
					    $("#imageFile").change(m_functionFileHasBeenChosen);
					    $("#ISSaveBtn").click(m_functionSaveInternetResource);
					    $("#ISResetBtn").click(m_functionReset);

					} catch (e) {

						errorHelper.show(e.message);
					}
				};

				//////////////////////////////////////
				// Private methods.

				var m_functionFileHasBeenChosen = function() {

					try {

					    m_cvs = document.getElementById('iSCanvas'),
					    m_ctx = m_cvs.getContext('2d');
					    var img = new Image(),
					        f = document.getElementById("imageFile").files[0],
					        url = window.URL || window.webkitURL,
					        src = url.createObjectURL(f);

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

				var m_functionSaveInternetResource = function () {

					try {

						// Going to use filename w/o extension as friendly name (server side).
						// User must have non-empty tags.
						// Grab userId.
						// Post info, including url.
						// On successful return, call callback with resourceId.
					    var fileName = $("#imageFile").val();
					    var fileNameLength = fileName.length;
					    var ext = fileName.replace(/^.*\./, '').toLowerCase();
					    if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg' && ext !== 'gif'){
					        m_wellMessage('We support only png, jpg (or jpeg) and gif image files.', null);
					        return false;
					    }
						var tags = $("#ISTags").val().trim();
						if (tags.length === 0) {

							m_wellMessage("You didn't enter any tags. They are needed for searching.", null);
							return;
						}

					    var strUserIdResources = client.getTGCookie("userId");
						var posting = $.post("/BOL/ResourceBO/SaveResource", 
							{
								userId: strUserIdResources, 
								tags: tags,
								resourceTypeId: 1
							}, 
							'json');
    					posting.done(function(data){

        					if (data.success) {

        						m_pdParent.callFunctionOK(data.id);

        					} else {

        						// !data.success
        						errorHelper.show(data.message);
        					}
        				});
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

						$("#ISPhase2").css("display", "none");

					} catch (e) {

						errorHelper.show(e);
					}
				}

				var m_validateImageUploadRequest = function (formData, jqForm, options) {

				    // var friendlyNameLength = $("#imageName").val().length;
				    var fileName = $("#imageFile").val();
				    var fileNameLength = fileName.length;
				    var ext = fileName.replace(/^.*\./, '').toLowerCase();
				    if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg' && ext !== 'gif'){
				        m_wellMessage('We support only png, jpg (or jpeg) and gif image files.', null);
				        return false;
				    }
				    // var tagsLength = $("#imageTags").val().length;
				    // if (
				    // 	friendlyNameLength === 0 
				    // 	|| 
				    // 	fileNameLength === 0 
				    // 	|| 
				    // 	tagsLength === 0
				    // 	) {

				    //     errorHelper.show('You must enter a friendly name, at least one tag and choose an image file to upload.');
				    //     return false;
				    // }
				    return true;
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
			};

			return functionHandler;
		} catch (e) {

			errorHelper.show(e);
		}
	});
