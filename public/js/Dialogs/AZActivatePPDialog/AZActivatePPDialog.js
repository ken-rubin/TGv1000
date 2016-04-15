////////////////////////////////////
// AZActivatePPDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/errorHelper", "Core/resourceHelper", "Core/ScrollRegionMulti"], 
	function (errorHelper, resourceHelper, ScrollRegionMulti) {

		try {

			// Define the NewProjectDialog constructor function.
			var functionAZActivatePPDialog = function () {

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

									templateFile: "Dialogs/AZActivatePPDialog/AZActivatePPDialog"
								}, 
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionRenderJadeSnippetResponse).error(errorHelper.show);

							return null;

						} catch (e) { return e; }
					};

					self.callFunctionOK = function(iProjectId) {

						try {

							m_functionOK(iProjectId);
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

								title: "Activate or Deactivate Purchasable Project",
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

							// Attach 3 scroll regions to the DOM.
							for (var stripNum = 0; stripNum <= 2; stripNum++) {

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
										self.callFunctionOK(m_searchResultRawArray[stripNum][i]);
							    	});
								if (exceptionRet) { throw exceptionRet; }
							}

							// There's no search button at this time.
							// We'll use the old search function to populate the dialog's 3 scroll regions.
							m_functionSearchBtnClicked();

						} catch (e) { errorHelper.show(e.message); }
					};

					// Invoked (presumably) after user has entered tags and clicks Search.
					var m_functionSearchBtnClicked = function () {

					    try {

					        var posting = $.post("/BOL/UtilityBO/RetrievePurchasableProjectData", 
					        	{}, 
					        	'json');
					        posting.done(function(data){

					            if (data.success) {

					                m_searchResultProcessedArray = new Array(3);
					                m_searchResultRawArray = data.arrayRows;	// [][]
					                for (var stripNum = 0; stripNum < 3; stripNum++) {

					                	m_searchResultProcessedArray[stripNum] = new Array();
						                for (var i = 0; i < m_searchResultRawArray[stripNum].length; i++) {

						                    var rowIth = m_searchResultRawArray[stripNum][i];
						                    m_searchResultProcessedArray[stripNum].push({

						                    	index: i,	// 2nd dimension index of m_searchResultRawArray
						                    	id: rowIth.baseProjectId,
						                    	name: rowIth.name,
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

					    		switch(stripNum) {
								    case 0:
								    	m_wellMessage("0", "We found no Classes.", null);
								    	break;
								    case 1:
								    	m_wellMessage("1", "We found no Online Classes.", null);
								    	break;
								    case 2:
								    	m_wellMessage("2", "We found no Products.", null);
								    	break;
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
							        var combo = (stripNum + 1) * 10 + i;
							        // For the tooltip get name from rowIth.name; get more fields from m_searchResultRawArray[stripNum][rowIth.index].*
							        var tooltip = rowIth.name + "<br>" + (m_searchResultRawArray[stripNum][rowIth.index].active ? "ACTIVE" : "NOT ACTIVE");
							        switch(stripNum) {
							        	case 0:
							        		// Classes.
							        		var strFirstClass;
							        		var mntFirstClass = moment(JSON.parse(m_searchResultRawArray[stripNum][rowIth.index].schedule)[0].date, 'YYYY-MM-DD');
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
							        		var numEnrollees = m_searchResultRawArray[stripNum][rowIth.index].numEnrollees || 0;
							        		if (m_searchResultRawArray[stripNum][rowIth.index].active) {
								        		if (numEnrollees >= maxClassSize) {
								        			tooltip += "<br>This class is full.";
								        		} else {
								        			tooltip += "<br>There are " + (maxClassSize - numEnrollees).toString() + " spots left in this class.";
								        		}
								        	}
							        		break;
							        	case 1:
							        		// Online classes.
							        		var strFirstClass;
							        		var mntFirstClass = moment(JSON.parse(m_searchResultRawArray[stripNum][rowIth.index].schedule)[0].date, 'YYYY-MM-DD');
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
							        		break;
							        	case 2:
							        		// Products.
							        		tooltip = "<b>" + tooltip + "</b>"
							        				+ "<br>Level: " + m_searchResultRawArray[stripNum][rowIth.index].level 
							        				+ "<br>Difficulty: " + m_searchResultRawArray[stripNum][rowIth.index].difficulty
							        				+ "<br>Description: " + m_searchResultRawArray[stripNum][rowIth.index].productDescription
							        				+ "<br>Price: " + m_searchResultRawArray[stripNum][rowIth.index].price.dollarFormat();
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
				var m_searchResultProcessedArray;
				var m_searchResultRawArray;
				var m_scISImageStrip = new Array(3);
				var m_functionOK;
			};

			// Return the constructor function as the module object.
			return functionAZActivatePPDialog;

		} catch (e) { errorHelper.show(e.message); }
	});
