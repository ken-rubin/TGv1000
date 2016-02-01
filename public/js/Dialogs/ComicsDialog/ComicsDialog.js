////////////////////////////////////
// ComicsDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/errorHelper", "Core/resourceHelper", "Core/ScrollRegion"], 
	function (errorHelper, resourceHelper, ScrollRegion) {

		try {

			// Define the ComicsDialog constructor function.
			var functionComicsDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function() {

						try {

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/ComicsDialog/comicsDialog"
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

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the ComicsDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "Comics",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
						                label: "Close",
						                icon: "glyphicon glyphicon-remove-circle",
						                cssClass: "btn-warning",
						                action: function(dialogItself){

						                    dialogItself.close();
						                }
					            	}
					            ],
					            draggable: true,
					            onshown: m_functionOnShownDialog
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;

							m_clProject = client.getProject();	// guaranteed !== null
							m_scComicsStrip = new ScrollRegion();
							var exceptionRet = m_scComicsStrip.create(
								"#IStoolstrip",
								100,
								100,
								function(){

						    		// var jq = this;
						    		// var j = parseInt(jq.context.id.substring(8), 10);
						    		// var projectId = m_searchResultRawArray[j].id;
						    		// self.callFunctionOK(projectId);
						    	});
							if (exceptionRet) { throw exceptionRet; }

							exceptionRet = m_rebuildCarousel();
							if (exceptionRet) { throw exceptionRet; }

						} catch (e) {

							errorHelper.show(e.message);
						}
					};

					// Set up the scrollstrip from the array of comics in m_clProject.
					var m_rebuildCarousel = function () {

						try {

			                m_searchResultProcessedArray = new Array();
			                for (var i = 0; i < m_clProject.data.comics.length; i++) {

			                    var comicIth = m_clProject.data.comics[i];
			                    m_searchResultProcessedArray.push({

			                    	index: i,
			                    	id: comicIth.id,
			                    	name: comicIth.name,
			                    	description: comicIth.description,
			                    	url: resourceHelper.toURL('resources', 
			                    		comicIth.imageId, 
			                    		'image', 
			                    		'')
			                    	}
			                    );
			                }

						    if (m_searchResultProcessedArray.length === 0) {

						    	$("#NoComics").css("display", "block");
						    	$("#YesComics").css("display", "none");
						    	m_wellMessage(".", null);

						    } else {

						    	$("#NoComics").css("display", "none");
						    	$("#NumComicsMsg").text(m_searchResultProcessedArray.length + " comics. Click or one (or add another) to begin.");
						    	$("#YesComics").css("display", "block");
							    $("#ISWellMsg").css("display", "none");
							    $("#IStoolstriprow").css("display", "block");

								// Attach the region to the DOM.
								var exceptionRet = m_scComicsStrip.empty();
								if (exceptionRet) { throw exceptionRet; }

								// Add returned images to the scrollregion.
								for (var i = 0; i < m_searchResultProcessedArray.length; i++) {

							        var rowIth = m_searchResultProcessedArray[i];

							        // Add each processed image to the region.
							        exceptionRet = m_scComicsStrip.addImage(
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

					// Put a message in the well, optionally closing the dialog after n ms.
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
				} catch (e) { errorHelper.show(e.message); }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_clProject;
				var m_scComicsStrip;
				var m_searchResultProcessedArray = [];
			};

			// Return the constructor function as the module object.
			return functionComicsDialog;

		} catch (e) { errorHelper.show(e.message); }
	}
);
