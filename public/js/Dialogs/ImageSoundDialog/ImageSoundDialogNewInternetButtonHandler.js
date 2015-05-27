//////////////////////////////////////////
// ImageSoundDialog new INTERNET FILE button handler. 
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
					    $("#RetrieveURLButton").click(m_functionRetrieveResource);
					    $("#ISSaveBtn").click(m_functionSaveInternetResource);
					    $("#ISResetBtn").click(m_functionReset);

					} catch (e) {

						errorHelper.show(e.message);
					}
				};

				//////////////////////////////////////
				// Private methods.

				var m_functionSaveInternetResource = function () {

					try {

						// Going to use filename w/o extension as friendly name (server side).
						// User must have non-empty tags.
						// Grab userId.
						// Post info, including url.
						// On successful return, call callback with resourceId.
						var tags = $("#ISTags").val().trim();
						if (tags.length === 0) {

							m_wellMessage("You didn't enter any tags. They are needed for searching.", null);
							return;
						}

					    var strUserIdResources = client.getTGCookie("userId");
					    var strUserNameResources = client.getTGCookie("userName");
						var posting = $.post("/BOL/ResourceBO/SaveURLResource", 
							{
								userId: strUserIdResources, 
								userName: strUserNameResources,
								url: m_url,
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

				//////////////////////////////////////
				// Private fields.

				// The owning dialog.
				var m_dialogContext = null;
				// The ImageSoundDialog object which owns the "owning dialog".
				var m_pdParent = null;
				var m_url = "";
			};

			return functionHandler;
		} catch (e) {

			errorHelper.show(e);
		}
	});
