////////////////////////////////////
// OpenProjectDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/errorHelper", "Core/resourceHelper", "Core/ScrollRegion"], 
	function (errorHelper, resourceHelper, ScrollRegion) {

		try {

			// Define the NewProjectDialog constructor function.
			var functionOpenProjectDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function(functionOK) {

						try {

							// Save callback in private field.
							m_functionOK = functionOK;
							m_bPrivilegedUser = g_profile["can_create_classes"] || g_profile["can_create_products"];

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/OpenProjectDialog/openProjectDialog"
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

					self.callFunctionOK = function(iProjectId) {

						try {

							m_functionOK(iProjectId);
							m_dialog.close();

						} catch (e) {

							errorHelper.show(e);
						}
					}

					//////////////////////////////////
					// Private functions.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function(htmlData) {

						try {

							// Show the dialog--load the content from 
							// the TypesDialog jade HTML-snippet.
							m_dialog = BootstrapDialog.show({

								title: "Search for/Open Project",
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
						    		var projectId = m_searchResultRawArray[j].id;
						    		self.callFunctionOK(projectId);
						    	});
							if (exceptionRet) { throw exceptionRet; }

							if (m_bPrivilegedUser) {

								jQuery(function($){
									$("#ZipP").mask("99999");
								});
								$(".nonprivileged").css("display", "none");
								$(".privileged").css("display", "block");

							} else {

								jQuery(function($){
									$("#Zip").mask("99999");
								});
								$(".privileged").css("display", "none");
								$(".nonprivileged").css("display", "block");
							}

							// Click the search button on the way in to fetch user's own projects.
							// m_functionSearchBtnClicked();

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Invoked (presumably) after user has entered tags and clicks Search.
					var m_functionSearchBtnClicked = function () {

					    try {

						    m_tags = $("#ISSearchInput").val().toLowerCase().trim();
						    if (m_bPrivilegedUser) {

				        		m_onlyCoreProjects = $("#rad0P").prop("checked") ? 1 : 0;
				        		m_onlyOwnedByUser = $("#rad1P").prop("checked") ? 1 : 0;
				        		m_onlyOthersProjects = $("#rad2P").prop("checked") ? 1 : 0;
				        		m_onlyProducts = $("#rad3P").prop("checked") ? 1 : 0;
				        		m_onlyClasses = $("#rad4P").prop("checked") ? 1 : 0;
							    m_strZip = $("#ZipP").val().trim();

						    } else {

						    	m_onlyCoreProjects = 0;
				        		m_onlyOwnedByUser = $("#rad1").prop("checked") ? 1 : 0;
				        		m_onlyOthersProjects = $("#rad2").prop("checked") ? 1 : 0;
				        		m_onlyProducts = $("#rad3").prop("checked") ? 1 : 0;
				        		m_onlyClasses = $("#rad4").prop("checked") ? 1 : 0;
							    m_strZip = $("#Zip").val().trim();
							    
							    if (m_onlyClasses && m_strZip.length < 5) {
							    	m_wellMessage("When searching for upcoming classes, you must enter your zipcode.", null);
							    	return;
							    }
							}

					        var posting = $.post("/BOL/UtilityBO/SearchProjects", 
					        	{
					        		tags: m_tags, 
					        		// userId: g_profile["userId"], not needed; sent in JWT
					        		// userName: g_profile["userName"], not needed; sent in JWT
					        		onlyCoreProjects: m_onlyCoreProjects,
					        		onlyOwnedByUser: m_onlyOwnedByUser,
					        		onlyOthersProjects: m_onlyOthersProjects,
					        		onlyProducts: m_onlyProducts,
					        		onlyClasses: m_onlyClasses,
					        		nearZip: m_strZip,
					        		privilegedUser: m_bPrivilegedUser ? 1 : 0
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
					                    	id: rowIth.id,
					                    	name: rowIth.name,
					                    	description: rowIth.description,
					                    	url: resourceHelper.toURL('resources', 
					                    		rowIth.imageId, 
					                    		'image', 
					                    		'')
					                    	}
					                    );
					                }

					                var exceptionRet = m_rebuildCarousel();
					                if (exceptionRet) { throw exceptionRet; }
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

						    	if (m_bPrivilegedUser) {

							    	if (m_tags.length) {

							    		if (m_onlyOwnedByUser)
									    	m_wellMessage("None of your projects match all of the tags: " + m_tags + ".", null);
									    else if (m_onlyOthersProjects)
									    	m_wellMessage("None of others' projects match all of the tags: " + m_tags + ".", null);
									    else if (m_onlyProducts)
									    	m_wellMessage("No Products match all of the tags: " + m_tags + ".", null);
									    else	// classes
									    	m_wellMessage("No Classes match all of the tags: " + m_tags + ".", null);

								    } else {

							    		if (m_onlyOwnedByUser)
									    	m_wellMessage("We could not find any projects that you created and saved.", null);
									    else if (m_onlyOthersProjects)
									    	m_wellMessage("We could not find any projects that others created and saved.", null);
									    else if (m_onlyProducts)
									    	m_wellMessage("We found no Products.", null);
									    else	// classes
									    	m_wellMessage("We found no Classes.", null);
								    }
								} else {	// normal user

							    	if (m_tags.length) {

							    		if (m_onlyOwnedByUser)
									    	m_wellMessage("None of your projects match all of the tags: " + m_tags + ".", null);
									    else if (m_onlyOthersProjects)
									    	m_wellMessage("None of others' projects match all of the tags: " + m_tags + ".", null);
									    else if (m_onlyProducts)
									    	m_wellMessage("No active Products match all of the tags: " + m_tags + ".", null);
									    else	// classes
									    	m_wellMessage("No Classes starting in the next 3 months and within 35 miles of your zipcode match all of the tags: " + m_tags + ".", null);

								    } else {

							    		if (m_onlyOwnedByUser)
									    	m_wellMessage("We could not find any projects that you created and saved.", null);
									    else if (m_onlyOthersProjects)
									    	m_wellMessage("We could not find any public projects that others created and saved.", null);
									    else if (m_onlyProducts)
									    	m_wellMessage("We found no active Products.", null);
									    else	// classes
									    	m_wellMessage("We found no active Classes starting in the next 3 months and within 35 miles of your zipcode.", null);
								    }
								}
								return;
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
							        	rowIth.description,
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
						} catch (e) { errorHelper.show(msg); }
					}
				} catch (e) {

					errorHelper.show(e.message);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_functionOK = null;
				var m_searchResultProcessedArray = [];
				var m_searchResultRawArray;
				var m_scISImageStrip;
				var m_tags;
				var m_onlyCoreProjects;
        		var m_onlyOwnedByUser;
        		var m_onlyOthersProjects;
        		var m_onlyProducts;
        		var m_onlyClasses;
			    var m_strZip;
			    var m_bPrivilegedUser;
			};

			// Return the constructor function as the module object.
			return functionOpenProjectDialog;
		} catch (e) {

			errorHelper.show(e.message);
		}
	});
