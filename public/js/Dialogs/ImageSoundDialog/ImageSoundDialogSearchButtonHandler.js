//////////////////////////////////////////
// ImageSoundDialog search button handler. 
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

						// // Wire buttons.
						// $(".projectItem").off("click");
						// $(".projectItem").on("click", m_functionResourceClick);
						$("#ISInnerSearchButton").click(m_functionInnerResourceBtnClicked);

					} catch (e) {

						errorHelper.show(e.message);
					}
				};

				//////////////////////////////////////
				// Private methods.

				// Invoked (presumably) after user has entered tags and clicks Search.
				var m_functionInnerResourceBtnClicked = function () {

				    var tags = $("#resourceSearchTags").val().toLowerCase();
				    var ccArray = tags.match(/[A-Za-z0-9_\-]+/g);

			        var foundImage = false;
			        if (ccArray) {

			            for (var i = 0; i < ccArray.length; i++){

			                if (ccArray[i] === 'image')
			                    foundImage = true;
			            }
			        }
			        if (!foundImage)
			            tags = tags + " image";
				    }

				    ccArray = tags.match(/[A-Za-z0-9_\-]+/g);

				    if (!ccArray) {

				        m_wellMessage('You must enter one or more tags.', null);
				        return;
				    }

				    try {

				        var posting = $.post("/BOL/UtilityBO/Search", {tags:tags, userId:strUserIdResources}, 'json');
				        posting.done(function(data){

				            if (data.success) {

				                m_searchResultProcessedArray = new Array();
				                m_searchResultRawArray = data.arrayRows;
				                for (var i = 0; i < m_searchResultRawArray.length; i++) {

				                    var rowIth = m_searchResultRawArray[i];
				                    var dot = '.';
				                    if (rowIth.resourceTypeId === 1) {

				                        dot = 't.';
				                    }
				                    m_searchResultProcessedArray.push({index: i, url: resourceHelper.toURL('resources', rowIth.id, '', 'image', ''), friendlyName: rowIth.friendlyName, resourceTypeId: rowIth.resourceTypeId});
				                }

				                var exceptionRet = m_rebuildCarousel();
				                if (exceptionRet) {

				                	throw exceptionRet;
				                }
				            } else {

				                // !data.success
				                m_wellMessage("An error has occurred: " + data.message);
				            }
				        });
				    } catch(e) {

				        m_wellMessage("An error has occurred: " + e.message, null);
				    }
				}

				// Turns the well into an image strip
				var m_rebuildCarousel = function () {

					try {

					    $("#ISSearchWell").empty();

					    if (searchResultProcessedArray.length === 0) {

					    	m_wellMessage("There were no matches to ALL of your tags.", null);

					    } else {

						    var strbuild = '';

						    for (var i = 0; i < searchResultProcessedArray.length; i++) {

						        var rowIth = searchResultProcessedArray[i];

					            strbuild = strbuild + '<img id="carousel' + i.toString() + '" class="imageitem" src="' + rowIth.url + '" title="' + rowIth.friendlyName + '" onclick="m_resourceClicked(' + i.toString() + ');" style="left:' + (i * 120 + 5).toString() + 'px;">';
						    }
						    $("#ISSearchWell").append(strbuild);
						}
					} catch (e) {

						return e;
					}
				}

				var m_resourceClicked = function(index) {

				    var rowIth = searchResultRawArray[index];

				    m_pdParent.callFunctionOK(rowIth.id);
				}

				var m_wellMessage = function(msg, timeoutAction) {

					try {

						$("#ISSearchWell").empty();
						$("#ISSearchWell").append("<p class='text-danger'>" + msg + "</p>");

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
			};

			return functionHandler;
		} catch (e) {

			alert(e.message);
		}
	});
