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

					self.callFunctionOK = function(iProjectId, bOnlyOwnedByUser, bOnlyOthersProjects, strMode) {

						try {

							m_functionOK(iProjectId, bOnlyOwnedByUser, bOnlyOthersProjects, strMode);
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

							if (!manager.userAllowedToCreateEditPurchProjs) {
								$(".HideIfNonPriv").css("display", "none");
							}

							// Wire buttons.
							$("#ISInnerSearchButton").click(m_functionSearchBtnClicked);
							$("#ISSearchInput").focus();

							// Attach 5 or 6 scroll regions to the DOM.
							var minIndex = manager.userAllowedToCreateEditPurchProjs ? 0 : 1;
							for (var stripNum = minIndex; stripNum <= 5; stripNum++) {

								m_scISImageStrip[stripNum] = new ScrollRegionMulti();
								var exceptionRet = m_scISImageStrip[stripNum].create(
									"#IStoolstrip" + stripNum.toString(),
									50,
									50,
									function(){

										// id was created like this:
										// var combo = (stripNum + 1) * 10000 + i;
							   			// "carousel" + combo.toString(),
							   			// We want to parse the id to get back stripNum and i.
							    		var jq = this;
							    		var num = parseInt(jq[0].id.substring(8), 10);
							    		var stripNum = Math.floor(num / 10000) - 1;
							    		var i = num % 10;
							    		var projectId = m_searchResultRawArray[stripNum][i].projectId;

							    		// From here we go to one of 2 places:
							    		// (1) If privileged user or stripNum < 3, to the callback in navbar to open the project from the DB and load it into manager.
							    		// (2) Else, to BuyDialog, passing along m_searchResultRawArray[stripnum][i].
							    		// We do (1) if a privileged user; if a non-privileged user and stripnum===1 or 2; 
							    		if (manager.userAllowedToCreateEditPurchProjs || stripNum < 3) {
							    			
								    		self.callFunctionOK(projectId, 
								    							(stripNum === 1), 
								    							(stripNum === 2),
								    							stripNum === 0 ? 'editCore' : stripNum === 1 ? 'editOwn' : stripNum === 2 ? 'copyOthers' : manager.userAllowedToCreateEditPurchProjs ? 'editPP' : 'buyPP'
								    		);
								    	} else {

											if (stripNum === 4 && !manager.userAllowedToCreateEditPurchProjs && m_searchResultRawArray[4][i].alreadyEnrolled) {

												errorHelper.show("You've already enrolled in this class.");

											} else if (stripNum === 4 && !manager.userAllowedToCreateEditPurchProjs && m_searchResultRawArray[4][i].numEnrollees >= m_searchResultRawArray[4][i].maxClassSize) {

												exceptionRet = client.putUserOnWaitlist(projectId);
												if (exceptionRet) { throw exceptionRet; }
											
											} else if (stripNum === 3 && !manager.userAllowedToCreateEditPurchProjs && m_searchResultRawArray[3][i].alreadyBought) {

												errorHelper.show("You've already purchased this product.");

											} else if (stripNum === 5 && !manager.userAllowedToCreateEditPurchProjs && m_searchResultRawArray[5][i].alreadyEnrolled) {

												errorHelper.show("You've already enrolled in this online class.");

											} else {

												self.closeYourself();
												var exceptionRet = client.showBuyDialog(m_searchResultRawArray[stripNum][i]);
												if (exceptionRet) { throw exceptionRet; }
											}
								    	}
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

						    m_searchPhrase = $("#ISSearchInput").val().toLowerCase().trim();
					        var posting = $.post("/BOL/UtilityBO/SearchProjects", 
					        	{
					        		searchPhrase: m_searchPhrase, 
					        		// userId: g_profile["userId"], not needed; sent in JWT
					        		// userName: g_profile["userName"], not needed; sent in JWT
					        		userAllowedToCreateEditPurchProjs: (manager.userAllowedToCreateEditPurchProjs ? 1 : 0)
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
						                    m_searchResultProcessedArray[stripNum].push(
						                    	{
							                    	index: i,	// 2nd dimension index of m_searchResultRawArray
							                    	id: rowIth.projectId,
							                    	name: rowIth.projectName,
							                    	url: resourceHelper.toURL('resources', 
							                    		rowIth.projectImageId, 
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

						    	if (manager.userAllowedToCreateEditPurchProjs) {
									
						    		// Core projects will always be present so no wellmessage is required for [0].
							    	if (m_searchPhrase.length) {

							    		switch(stripNum) {
							    			case 1:
									    		m_wellMessage("1", "None of your projects match any words in the Search phrase: " + m_searchPhrase + ".", null);
									    		break;
									    	case 2:
									    		m_wellMessage("2", "None of others' projects match any words in the Search phrase: " + m_searchPhrase + ".", null);
									    		break;
									    	case 3:
									    		m_wellMessage("3", "No Products match any words in the Search phrase: " + m_searchPhrase + ".", null);
									    		break;
									    	case 4:
									    		m_wellMessage("4", "No Classes match any words in the Search phrase: " + m_searchPhrase + ".", null);
									    		break;
									    	case 5:
									    		m_wellMessage("5", "No Online Classes match any words in the Search phrase: " + m_searchPhrase + ".", null);
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

							    	if (m_searchPhrase.length) {

							    		switch(stripNum) {
							    			case 1:
										    	m_wellMessage("1", "None of your projects match any words in the Search phrase: " + m_searchPhrase + ".", null);
										    	break;
										    case 2:
										    	m_wellMessage("2", "None of others' projects match any words in the Search phrase: " + m_searchPhrase + ".", null);
										    	break;
										    case 3:
										    	m_wellMessage("3", "No active Products match any words in the Search phrase: " + m_searchPhrase + ".", null);
										    	break;
										    case 4:
										    	m_wellMessage("4", "No Classes starting in the next 3 months and within 35 miles of your zipcode match any words in the Search phrase: " + m_searchPhrase + ".", null);
										    	break;
										    case 5:
										    	m_wellMessage("5", "No Online Classes starting in the next 3 months match any words in the Search phrase: " + m_searchPhrase + ".", null);
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

								if (!Number.prototype.dollarFormat) {
									Number.prototype.dollarFormat = function() {
										if (!isNaN(this)) {
											var n = this < 0 ? true : false,
												a = (n ? this * -1 : this).toFixed(2).toString().split("."),
												b = a[0].split("").reverse().join("").replace(/.{3,3}/g, "$&,").replace(/\,$/, "").split("").reverse().join("");
											return((n ? "(" : "") + "$" + b + "." + a[1] + (n ? ")" : ""));
										}
									};
								}

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
							        var combo = (stripNum + 1) * 10000 + i;
							        // For the tooltip get name from rowIth.name; get more fields from m_searchResultRawArray[stripNum][rowIth.index].*
							        var tooltip = rowIth.name;
							        switch(stripNum) {
							        	case 0:
							        		// Core project. Just the name is fine.
							        		break;
							        	case 1:
							        		// My projects. Just the name is fine.
							        		break;
							        	case 2:
							        		// Others' projects.
							        		break;
							        	case 3:
							        		// Products.
							        		tooltip = "<b>" + tooltip + "</b>"
							        				+ "<br>Level: " + m_searchResultRawArray[stripNum][rowIth.index].level 
							        				+ "<br>Difficulty: " + m_searchResultRawArray[stripNum][rowIth.index].difficulty
							        				+ "<br>Description: " + m_searchResultRawArray[stripNum][rowIth.index].productDescription
							        				+ "<br>Price: " + m_searchResultRawArray[stripNum][rowIth.index].price.dollarFormat();
							        		if (!manager.userAllowedToCreateEditPurchProjs && m_searchResultRawArray[stripNum][rowIth.index].alreadyBought) {
							        			tooltip += "<br><b>You've already purchased this product.</b>";
							        		}
							        		break;
							        	case 4:
							        		// Classes.
							        		var strFirstClass;
							        		var mntFirstClass = moment(JSON.parse(m_searchResultRawArray[stripNum][rowIth.index].schedule)[0].date, 'YYYY-MM-DD');
							        		// mntFirstClass has to be good for a non-priv user, but it may be invalid if the class is still being set up. So handle that.
							        		if (mntFirstClass.isValid()) {
							        			strFirstClass = mntFirstClass.format('dddd, MMMM Do YYYY');
							        		} else {
							        			strFirstClass = 'n/a';
							        		}
							        		tooltip = "<b>" + tooltip + "</b>"
							        				+ "<br>Level: " + m_searchResultRawArray[stripNum][rowIth.index].level 
							        				+ "<br>Difficulty: " + m_searchResultRawArray[stripNum][rowIth.index].difficulty
							        				+ "<br>Description: " + m_searchResultRawArray[stripNum][rowIth.index].classDescription
							        				+ "<br>Notes: " + m_searchResultRawArray[stripNum][rowIth.index].classNotes
							        				+ "<br>First class: " + strFirstClass
							        				+ "<br>Price: " + m_searchResultRawArray[stripNum][rowIth.index].price.dollarFormat();
							        		var maxClassSize = m_searchResultRawArray[stripNum][rowIth.index].maxClassSize;
							        		var numEnrollees = m_searchResultRawArray[stripNum][rowIth.index].numEnrollees;
							        		if (!manager.userAllowedToCreateEditPurchProjs) {
								        		if ( m_searchResultRawArray[stripNum][rowIth.index].alreadyEnrolled) {
								        			tooltip += "<br><b>You've already enrolled in this class.</b>";
								        		} else if (numEnrollees >= maxClassSize) {
									        		tooltip += "<br><b>This class is full. Click to be put on its waitlist.</b>";
									        	} else if (numEnrollees > maxClassSize - 5) {
									        		tooltip += "<br><b>There are only " + (maxClassSize - numEnrollees).toString() + " spots left in this class. Really.</b>";
									        	}
									        }
							        		break;
							        	case 5:
							        		// Online classes.
							        		var strFirstClass;
							        		var mntFirstClass = moment(JSON.parse(m_searchResultRawArray[stripNum][rowIth.index].schedule)[0].date, 'YYYY-MM-DD');
							        		// mntFirstClass has to be good for a non-priv user, but it may be invalid if the class is still being set up. So handle that.
							        		if (mntFirstClass.isValid()) {
							        			strFirstClass = mntFirstClass.format('dddd, MMMM Do YYYY');
							        		} else {
							        			strFirstClass = 'n/a';
							        		}
							        		tooltip = "<b>" + tooltip + "</b>"
							        				+ "<br>Level: " + m_searchResultRawArray[stripNum][rowIth.index].level 
							        				+ "<br>Difficulty: " + m_searchResultRawArray[stripNum][rowIth.index].difficulty
							        				+ "<br>Description: " + m_searchResultRawArray[stripNum][rowIth.index].classDescription
							        				+ "<br>Notes: " + m_searchResultRawArray[stripNum][rowIth.index].classNotes
							        				+ "<br>First class: " + strFirstClass
							        				+ "<br>Price: " + m_searchResultRawArray[stripNum][rowIth.index].price.dollarFormat();
							        		if (!manager.userAllowedToCreateEditPurchProjs && m_searchResultRawArray[stripNum][rowIth.index].alreadyEnrolled) {
							        			tooltip += "<br><b>You've already enrolled in this online class.</b>";
							        		}
							        		break;
							        }
							        exceptionRet = m_scISImageStrip[stripNum].addImage(
							        	combo,
							        	"carousel" + combo.toString(),
							        	tooltip,
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
				var m_searchPhrase;
			};

			// Return the constructor function as the module object.
			return functionOpenProjectDialog;

		} catch (e) { errorHelper.show(e.message); }
	});
