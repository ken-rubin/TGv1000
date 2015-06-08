////////////////////////////////////
// ImageSearchDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper", "Core/ScrollRegion2"], 
	function (snippetHelper, errorHelper, resourceHelper, ScrollRegion) {

		try {

			// Define the ImageSearchDialog constructor function.
			var functionImageSearchDialog = function () {

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

									templateFile: "Dialogs/ImageSearchDialog/imageSearchDialog"
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

							// Wire buttons.
							$("#ISInnerSearchButton").click(m_functionSearchBtnClicked);

							// Attach the region to the DOM.
							m_scISImageStrip = new ScrollRegion();
							var exceptionRet = m_scISImageStrip.create("#IStoolstrip",
								100,
								function(){

						    		var jq = this;
						    		var j = parseInt(jq.context.id.substring(8), 10);
						    		alert(j);
						    		var resourceId = m_searchResultRawArray[j].id;
						    		self.callFunctionOK(resourceId);
						    	});
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Invoked (presumably) after user has entered tags and clicks Search.
					var m_functionSearchBtnClicked = function () {

					    var tags = $("#ISSearchInput").val().toLowerCase();
					    var ccArray = tags.match(/[A-Za-z0-9_\-]+/g);

				        var foundImage = false;
				        if (ccArray) {

				            for (var i = 0; i < ccArray.length; i++){

				                if (ccArray[i] === 'image')
				                    foundImage = true;
				            }
				        }
				        if (!foundImage) {
				        	
				            tags = tags + " image";
				        }

					    ccArray = tags.match(/[A-Za-z0-9_\-]+/g);

					    if (!ccArray) {

					        m_wellMessage('You must enter one or more tags.', null);
					        return;
					    }

					    try {

						    var strUserIdResources = client.getTGCookie("userId");
					        var posting = $.post("/BOL/UtilityBO/Search", {tags:tags, userId:strUserIdResources}, 'json');
					        posting.done(function(data){

					            if (data.success) {

					                m_searchResultProcessedArray = new Array();
					                m_searchResultRawArray = data.arrayRows;
					                for (var i = 0; i < m_searchResultRawArray.length; i++) {

					                    var rowIth = m_searchResultRawArray[i];
					                    m_searchResultProcessedArray.push({

					                    	index: i, 
					                    	url: resourceHelper.toURL('resources', 
					                    		rowIth.id, 
					                    		'image', 
					                    		''), 
					                    	resourceTypeId: rowIth.resourceTypeId});
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

						    if (m_searchResultProcessedArray.length === 0) {

						    	m_wellMessage("There were no matches to ALL of your tags.", null);

						    } else {

							    $("#ISWellMsg").css("display", "none");
							    $("#IStoolstriprow").css("display", "block");

								// Attach the region to the DOM.
								var exceptionRet = m_scISImageStrip.empty();
								if (exceptionRet) {

									throw exceptionRet;
								}

								// Add returned images to the scrollregion.
								for (var i = 0; i < m_searchResultProcessedArray.length; i++) {

							        var rowIth = m_searchResultProcessedArray[i];

							        // Add each processed image to the region.
							        exceptionRet = m_scISImageStrip.addImage("carousel" + i.toString(),
							        	"N" + i.toString(),
							        	"D" + i.toString(),
							        	rowIth.url);
							        if (exceptionRet) {

							        	throw exceptionRet;
							        }
							    }
							}
						} catch (e) {

							return e;
						}
					}

					var m_wellMessage = function(msg, timeoutAction) {

						try {

							$("#ISWellMsg").empty();
							$("#ISWellMsg").append("<p class='text-danger'>" + msg + "</p>");
						    $("#ISWellMsg").css("display", "block");
						    $("#IStoolstriprow").css("display", "none");

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
				var m_searchResultProcessedArray = [];
				var m_searchResultRawArray;
				var m_scISImageStrip;
			};

			// Return the constructor function as the module object.
			return functionImageSearchDialog;

		} catch (e) {

			errorHelper.show(e.message);
		}
	});
