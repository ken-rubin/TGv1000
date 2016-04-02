////////////////////////////////////
// OpenProjectDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/errorHelper", "Core/resourceHelper", "Core/ScrollRegionMulti"], 
	function (errorHelper, resourceHelper, ScrollRegionMulti) {

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
							m_bPrivilegedUser = g_profile["can_create_classes"] || g_profile["can_create_products"] || g_profile["can_create_onlineClasses"] || false;

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

							if (!m_bPrivilegedUser) {
								$(".HideIfNonPriv").css("display", "none");
							}

							// Wire buttons.
							$("#ISInnerSearchButton").click(m_functionSearchBtnClicked);
							$("#ISSearchInput").focus();

							// Attach 5 or 6 scroll regions to the DOM.
							var minIndex = m_bPrivilegedUser ? 0 : 1;
							for (var stripNum = minIndex; stripNum <= 5; stripNum++) {

								m_scISImageStrip[stripNum] = new ScrollRegionMulti();
								var exceptionRet = m_scISImageStrip[stripNum].create(
									"#IStoolstrip" + stripNum.toString(),
									50,
									50,
									function(){

										// id was created like this:
										// var combo = (stripNum + 1) * 10 + i;
							   			// "carousel" + combo.toString(),
							   			// We want to parse the id to get back stripNum and i.
							    		var jq = this;
							    		var num = parseInt(jq.context.id.substring(8), 10);
							    		var stripNum = Math.floor(num / 10) - 1;
							    		var i = num % 10;
							    		var projectId = m_searchResultRawArray[stripNum][i].id;
							    		self.callFunctionOK(projectId, m_bPrivilegedUser, (stripNum === 1), (stripNum === 2));	// wrong maybe.
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
					        		privilegedUser: (m_bPrivilegedUser ? 1 : 0)
					        	}, 
					        	'json');
					        posting.done(function(data){

					            if (data.success) {

					                m_searchResultProcessedArray = new Array(6);
					                m_searchResultRawArray = data.arrayRows;	// [][]
					                for (var stripNum = 0; stripNum < 6; stripNum++) {

					                	m_searchResultProcessedArray[stripNum] = new Array();
						                for (var i = 0; i < m_searchResultRawArray[stripNum].length; i++) {

						                    var rowIth = m_searchResultRawArray[stripNum][i];
						                    m_searchResultProcessedArray[stripNum].push({

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

					                	var exceptionRet = m_rebuildCarousel(stripNum);
					                	if (exceptionRet) { throw exceptionRet; }
					                }
					            } else {

					                // !data.success
					                m_wellMessage("x", "An error has occurred: " + data.message);
					            }
					        });
					    } catch(e) {

					        m_wellMessage("x", "An error has occurred: " + e.message, null);
					    }
					}

					// Turns the well into an image strip
					var m_rebuildCarousel = function (stripNum) {

						try {

						    if (m_searchResultProcessedArray[stripNum].length === 0) {

						    	if (m_bPrivilegedUser) {
						    		// Core projects will always be present so no wellmessage is required for [0].
							    	if (m_tags.length) {

							    		switch(stripNum) {
							    			case 1:
									    		m_wellMessage("1", "None of your projects match all of the tags: " + m_tags + ".", null);
									    		break;
									    	case 2:
									    		m_wellMessage("2", "None of others' projects match all of the tags: " + m_tags + ".", null);
									    		break;
									    	case 3:
									    		m_wellMessage("3", "No Products match all of the tags: " + m_tags + ".", null);
									    		break;
									    	case 4:
									    		m_wellMessage("4", "No Classes match all of the tags: " + m_tags + ".", null);
									    		break;
									    	case 5:
									    		m_wellMessage("5", "No Online Classes match all of the tags: " + m_tags + ".", null);
									    		break;
										}
								    } else {

								    	switch(stripNum) {
									    	case 1:
									    		m_wellMessage("1", "We could not find any projects that you created and saved.", null);
									    		break;
									    	case 2:
									    		m_wellMessage("2", "We could not find any projects that others created and saved.", null);
									    		break;
									    	case 3:
									    		m_wellMessage("3", "We found no Products.", null);
									    		break;
									    	case 4:
									    		m_wellMessage("4", "We found no Classes.", null);
									    		break;
									    	case 5:
									    		m_wellMessage("5", "We found no Online Classes.", null);
									    		break;
									    }
								    }
								} else {	// normal user

							    	if (m_tags.length) {

							    		switch(stripNum) {
							    			case 1:
										    	m_wellMessage("1", "None of your projects match all of the tags: " + m_tags + ".", null);
										    	break;
										    case 2:
										    	m_wellMessage("2", "None of others' projects match all of the tags: " + m_tags + ".", null);
										    	break;
										    case 3:
										    	m_wellMessage("3", "No active Products match all of the tags: " + m_tags + ".", null);
										    	break;
										    case 4:
										    	m_wellMessage("4", "No Classes starting in the next 3 months and within 35 miles of your zipcode match all of the tags: " + m_tags + ".", null);
										    	break;
										    case 5:
										    	m_wellMessage("5", "No Online Classes starting in the next 3 months match all of the tags: " + m_tags + ".", null);
										    	break;
										}
								    } else {

							    		switch(stripNum) {
							    			case 1:
										    	m_wellMessage("1", "We could not find any projects that you created and saved.", null);
										    	break;
										    case 2:
										    	m_wellMessage("2", "We could not find any public projects that others created and saved.", null);
										    	break;
										    case 3:
										    	m_wellMessage("3", "We found no active Products.", null);
										    	break;
										    case 4:
										    	m_wellMessage("4", "We found no active Classes starting in the next 3 months and within 35 miles of your zipcode.", null);
										    	break;
										    case 5:
										    	m_wellMessage("5", "We found no active Online Classes starting in the next 3 months.", null);
										    	break;
										}
								    }
								}
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
							        var combo = (stripNum + 1) * 10 + i;
							        // For the tooltip:
							        var tooltip = rowIth.name;
							        switch(stripNum) {
							        	case 0:
							        		// tooltip += ;
							        		break;
							        	case 1:
							        		break;
							        	case 2:
							        		break;
							        	case 3:
							        		break;
							        	case 4:
							        		break;
							        	case 5:
							        		break;
							        }
							        exceptionRet = m_scISImageStrip[stripNum].addImage(
							        	combo,
							        	"carousel" + combo.toString(),
							        	tooltip,
							        	rowIth.description,
							        	rowIth.url,
							        	'ScrollRegionImage',
							        	null,
							        	true);
							        if (exceptionRet) { throw exceptionRet; }
							    }
							    return null;
							}
						} catch (e) { return e; }
					}

					var m_wellMessage = function(strWhichWell, msg, timeoutAction) {

						try {

							if (strWhichWell === "x") {
								errorHelper.show(msg);
							} else {
								$("#ISWellMsg" + strWhichWell).empty();
								$("#ISWellMsg" + strWhichWell).append("<p class='text-danger' style='text-align:center;'>" + msg + "</p>");
							    $("#ISWellMsg" + strWhichWell).css("display", "block");
							    $("#IStoolstriprow" + strWhichWell).css("display", "none");
							}

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
			    var m_bPrivilegedUser;
			};

			// Return the constructor function as the module object.
			return functionOpenProjectDialog;
		} catch (e) {

			errorHelper.show(e.message);
		}
	});
