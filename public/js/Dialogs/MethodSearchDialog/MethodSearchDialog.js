////////////////////////////////////
// MethodSearchDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper", "Core/ScrollRegion"], 
	function (snippetHelper, errorHelper, resourceHelper, ScrollRegion) {

		try {

			// Define the MethodSearchDialog constructor function.
			var functionMethodSearchDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					// functionOK is callback with resourceId as parameter.
					self.create = function(functionOK) {

						try {

							// Save param in private field.
							m_functionOK = functionOK;

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/MethodSearchDialog/MethodSearchDialog"
								}, 
								dataMethod: "HTML",
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

					self.callFunctionOK = function(iMethodId) {

						try {

							m_functionOK(iMethodId);
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

								title: "Method Search",
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

							// Wire buttons.
							$("#ISInnerSearchButton").click(m_functionSearchBtnClicked);
							$("#ISSearchInput").focus();

							// Attach the region to the DOM.
							m_scISImageStrip = new ScrollRegion();
							var exceptionRet = m_scISImageStrip.create(
								"#IStoolstrip",
								100,
								100,
								function(){

						    		var jq = this;
						    		var j = parseInt(jq.context.id.substring(8), 10);
						    		var MethodId = m_searchResultRawArray[j].id;
						    		self.callFunctionOK(MethodId);
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

					    try {

						    var tags = $("#ISSearchInput").val().toLowerCase().trim();
						    var strUserId = client.getTGCookie("userId");
						    var strUserName = client.getTGCookie("userName");
					        var posting = $.post("/BOL/UtilityBO/Search", 
					        	{
					        		tags: tags, 
					        		userId: strUserId,
					        		userName: strUserName,
					        		resourceTypeId: 7,
					        		onlyCreatedByUser: $("#cb1").prop("checked") ? 1 : 0
					        	},
					        	'json');
					        posting.done(function(data){

					            if (data.success) {

					                m_searchResultProcessedArray = new Array();
					                m_searchResultRawArray = data.arrayRows;
					                for (var i = 0; i < m_searchResultRawArray.length; i++) {

					                    var rowIth = m_searchResultRawArray[i];
					                    m_searchResultProcessedArray.push({

					                    	index: i,
					                    	name: rowIth.name,
					                    	url: resourceHelper.toURL('resources', 
					                    		rowIth.imageResourceId, 
					                    		'image', 
					                    		''), 
					                    	resourceMethodId: rowIth.resourceMethodId});
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
							        exceptionRet = m_scISImageStrip.addImage(
							        	i,
							        	"carousel" + i.toString(),
							        	rowIth.name,
							        	"",
							        	rowIth.url,
							        	'ScrollRegionImage',
							        	null,
							        	true);
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
				var m_functionOK = null;
				var m_searchResultProcessedArray = [];
				var m_searchResultRawArray;
				var m_scISImageStrip;
			};

			// Return the constructor function as the module object.
			return functionMethodSearchDialog;

		} catch (e) {

			errorHelper.show(e.message);
		}
	});
