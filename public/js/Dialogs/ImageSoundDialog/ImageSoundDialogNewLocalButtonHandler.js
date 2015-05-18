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
					    var strUserIdResources = client.getTGCookie("userId");

					    var optionsImages = {

					        beforeSubmit: m_validateImageUploadRequest,
					        dataType: 'json',
					        data: {userId:strUserIdResources, resourceTypeId:1},
					        clearForm: true,
					        error: m_handleUploadError
					    };

					    $('#imageUploadForm').ajaxForm(optionsImages);
					    $("#imageFile").change(m_functionFileHasBeenChosen);

					} catch (e) {

						errorHelper.show(e.message);
					}
				};

				//////////////////////////////////////
				// Private methods.

				var m_functionFileHasBeenChosen = function() {

			    	$("#imageSubmit").click();
				}

				var m_validateImageUploadRequest = function (formData, jqForm, options) {

				    var friendlyNameLength = $("#imageName").val().length;
				    var fileName = $("#imageFile").val();
				    var fileNameLength = fileName.length;
				    var ext = fileName.replace(/^.*\./, '').toLowerCase();
				    if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg' && ext !== 'gif'){
				        errorHelper.show('We support only .png and .jpg (or .jpeg) image files.');
				        return false;
				    }
				    var tagsLength = $("#imageTags").val().length;
				    if (friendlyNameLength === 0 || fileNameLength === 0 || tagsLength === 0) {

				        errorHelper.show('You must enter a friendly name, at least one tag and choose an image file to upload.');
				        return false;
				    }
				    return true;
				}

				var m_handleUploadError = function(err) {
				    
				    errorHelper.show('Upload error on server: ' + JSON.stringify({error:err}));
				}

				//////////////////////////////////////
				// Private fields.

				// The owning dialog.
				var m_dialogContext = null;
				// The ImageSoundDialog object which owns the "owning dialog".
				var m_pdParent = null;
			};

			return functionHandler;
		} catch (e) {

			errorHelper.show(e);
		}
	});
