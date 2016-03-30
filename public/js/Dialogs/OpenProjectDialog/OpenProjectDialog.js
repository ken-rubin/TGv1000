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
							m_bPrivilegedUser = g_profile["can_create_classes"] || g_profile["can_create_products"] || g_profile["can_create_onlineClasses"];

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

						} catch (e) { return e; }
					};

					self.closeYourself = function() {

						m_dialog.close();
					}

					self.callFunctionOK = function(iProjectId, bPrivilegedUser, bOnlyOwnedByUser, bOnlyOthersProjects) {

						try {

							m_functionOK(iProjectId, bPrivilegedUser, bOnlyOwnedByUser, bOnlyOthersProjects);
							m_dialog.close();

						} catch (e) { errorHelper.show(e); }
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
						} catch (e) { errorHelper.show(e); }
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function () {

						try {

							// Wire buttons.
							$("#ISInnerSearchButton").click(m_functionSearchBtnClicked);
							$("#ISSearchInput").focus();

							// Attach 5 or 6 scroll regions to the DOM.
							var minIndex = m_bPrivilegedUser ? 0 : 1;
							for (var i = minIndex; i <= 5; i++) {

								m_scISImageStrip[i] = new ScrollRegion();
								var exceptionRet = m_scISImageStrip[i].create(
									"#IStoolstrip" + i.toString(),
									100,
									100,
									function(){

							    		var jq = this;
							    		var j = parseInt(jq.context.id.substring(8), 10);
							    		var projectId = m_searchResultRawArray[i][j].id;
							    		self.callFunctionOK(projectId, m_bPrivilegedUser, (i === 1), (i === 2));	// wrong maybe.
							    	});
								if (exceptionRet) { throw exceptionRet; }
							}

							// Click the search button on the way in to fetch everything with no tags. User may repeat with some tags.
							// Or we'll remove this auto-click if it takes too long.
							m_functionSearchBtnClicked();

						} catch (e) { errorHelper.show(e.message); }
					};

					// Invoked (presumably) after user has entered tags and clicks Search.
					var m_functionSearchBtnClicked = function () {

					    try {

						    m_tags = $("#ISSearchInput").val().toLowerCase().trim();
					        var posting = $.post("/BOL/UtilityBO/SearchProjects", 
					        	{
					        		tags: m_tags, 
					        		// userId: g_profile["userId"], not needed; sent in JWT
					        		// userName: g_profile["userName"], not needed; sent in JWT
					        		privilegedUser: m_bPrivilegedUser ? 1 : 0
					        	}, 
					        	'json');
					        posting.done(function(data){

					            if (data.success) {

					                m_searchResultProcessedArray = new Array(6);
					                m_searchResultRawArray = data.arrayRows;	// [][]
					                for (var j = 0; j < 6; j++) {

					                	m_searchResultProcessedArray[j] = new Array();
						                for (var i = 0; i < m_searchResultRawArray[j].length; i++) {

						                    var rowIth = m_searchResultRawArray[j][i];
						                    m_searchResultProcessedArray[j].push({

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

					                	var exceptionRet = m_rebuildCarousel(j);
					                	if (exceptionRet) { throw exceptionRet; }
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
					var m_rebuildCarousel = function (stripNum) {

						try {

						    if (m_searchResultProcessedArray[stripNum].length === 0) {

						    	if (m_bPrivilegedUser) {

							    	if (m_tags.length) {

							    		if (m_onlyOwnedByUser)
									    	m_wellMessage("1", "None of your projects match all of the tags: " + m_tags + ".", null);
									    else if (m_onlyOthersProjects)
									    	m_wellMessage("2", "None of others' projects match all of the tags: " + m_tags + ".", null);
									    else if (m_onlyProducts)
									    	m_wellMessage("3", "No Products match all of the tags: " + m_tags + ".", null);
									    else if (m_onlyClasses)
									    	m_wellMessage("4", "No Classes match all of the tags: " + m_tags + ".", null);
									    else	// online classes
									    	m_wellMessage("5", "No Online Classes match all of the tags: " + m_tags + ".", null);

								    } else {

							    		if (m_onlyOwnedByUser)
									    	m_wellMessage("1", "We could not find any projects that you created and saved.", null);
									    else if (m_onlyOthersProjects)
									    	m_wellMessage("2", "We could not find any projects that others created and saved.", null);
									    else if (m_onlyProducts)
									    	m_wellMessage("3", "We found no Products.", null);
									    else if (m_onlyClasses)
									    	m_wellMessage("4", "We found no Classes.", null);
									    else   // online classes
									    	m_wellMessage("5", "We found no Online Classes.", null);
								    }
								} else {	// normal user

							    	if (m_tags.length) {

							    		if (m_onlyOwnedByUser)
									    	m_wellMessage("1", "None of your projects match all of the tags: " + m_tags + ".", null);
									    else if (m_onlyOthersProjects)
									    	m_wellMessage("2", "None of others' projects match all of the tags: " + m_tags + ".", null);
									    else if (m_onlyProducts)
									    	m_wellMessage("3", "No active Products match all of the tags: " + m_tags + ".", null);
									    else if (m_onlyClasses)
									    	m_wellMessage("4", "No Classes starting in the next 3 months and within 35 miles of your zipcode match all of the tags: " + m_tags + ".", null);
									    else    // online classes
									    	m_wellMessage("5", "No Online Classes starting in the next 3 months match all of the tags: " + m_tags + ".", null);

								    } else {

							    		if (m_onlyOwnedByUser)
									    	m_wellMessage("1", "We could not find any projects that you created and saved.", null);
									    else if (m_onlyOthersProjects)
									    	m_wellMessage("1", "We could not find any public projects that others created and saved.", null);
									    else if (m_onlyProducts)
									    	m_wellMessage("3", "We found no active Products.", null);
									    else if (m_onlyClasses)
									    	m_wellMessage("4", "We found no active Classes starting in the next 3 months and within 35 miles of your zipcode.", null);
									    else     // online classes
									    	m_wellMessage("5", "We found no active Online Classes starting in the next 3 months.", null);
								    }
								}
								return;
						    } else {

					    		var strJ = stripNum.toString();
							    $("#ISWellMsg" + strJ).css("display", "none");
							    $("#IStoolstriprow" + strJ).css("display", "block");

								// Attach the region to the DOM.
								var exceptionRet = m_scISImageStrip[stripNum].empty();
								if (exceptionRet) { throw exceptionRet; }

								// Add returned images to the scrollregion.
								for (var i = 0; i < m_searchResultProcessedArray[stripNum].length; i++) {

							        var rowIth = m_searchResultProcessedArray[stripNum][i];

							        // Add each processed image to the region.
							        exceptionRet = m_scISImageStrip[stripNum].addImage(
							        	i,
							        	"carousel" + i.toString(),
							        	rowIth.name,
							        	rowIth.description,
							        	rowIth.url,
							        	'ScrollRegionImage',
							        	null,
							        	true);
							        if (exceptionRet) { throw exceptionRet; }
							    }
							}
						} catch (e) { return e; }
					}

					var m_wellMessage = function(strWhichWell, msg, timeoutAction) {

						try {

							$("#ISWellMsg" + strWhichWell).empty();
							$("#ISWellMsg" + strWhichWell).append("<p class='text-danger' style='text-align:center;'>" + msg + "</p>");
						    $("#ISWellMsg" + strWhichWell).css("display", "block");
						    $("#IStoolstriprow" + strWhichWell).css("display", "none");

							if (timeoutAction !== null) {

								setTimeout(timeoutAction.callback, timeoutAction.waittime);
							}
						} catch (e) { errorHelper.show(msg); }
					}
				} catch (e) { errorHelper.show(e.message); }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_functionOK = null;
				var m_searchResultProcessedArray;
				var m_searchResultRawArray;
				var m_scISImageStrip = new Array(6);
				var m_tags;
				var m_onlyCoreProjects;
        		var m_onlyOwnedByUser;
        		var m_onlyOthersProjects;
        		var m_onlyProducts;
        		var m_onlyClasses;
				var m_onlyOnlineClasses;
			    var m_strZip;
			    var m_bPrivilegedUser;
			};

			// Return the constructor function as the module object.
			return functionOpenProjectDialog;
		} catch (e) {

			errorHelper.show(e.message);
		}
	});
