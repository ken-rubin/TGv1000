///////////////////////////////////////
// LandingPage module.
//
// Gui component responsible for
// creating a normal project or a purchasable project.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/DialogHost",
    "NextWave/source/utility/List",
    "NextWave/source/utility/ListItem",
    "NextWave/source/utility/PictureListItem",
	"Core/resourceHelper"
    ],
    function (prototypes, settings, Point, Size, Area, DialogHost, List, ListItem, PictureListItem, resourceHelper) {

        try {

            // Constructor function.
            var functionRet = function LandingPage() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from DialogHost.
                    self.inherits(DialogHost);

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "LandingPage: Instance already created!" };
                            }

                            // Create the dialog.
							let objectConfiguration = {
								coreLabel: {
									type: "Label",
									text: "Core projects",
									modes: ['Privileged user'],
									x: 7 * settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 12 + settings.dialog.lineHeight) * 1;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreProjects: {
									type: "ListHost",
									modes: ['Privileged user'],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 12 + settings.dialog.lineHeight) * 1;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 2;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 12;
									}
								},
								yourLabel: {
									type: "Label",
									text: "Your projects",
									modes: ['Normal user','Privileged user'],
									x: 7 * settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 12 + settings.dialog.lineHeight) * 2;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								yourProjects: {
									type: "ListHost",
									modes: ['Normal user','Privileged user'],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 12 + settings.dialog.lineHeight) * 2;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 2;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 12;
									}
								},
								sharedLabel: {
									type: "Label",
									text: "Shared projects",
									modes: ['Normal user','Privileged user'],
									x: 7 * settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 12 + settings.dialog.lineHeight) * 3;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								sharedProjects: {
									type: "ListHost",
									modes: ['Normal user','Privileged user'],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 12 + settings.dialog.lineHeight) * 3;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 2;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 12;
									}
								},
								productsLabel: {
									type: "Label",
									text: "Product kits",
									modes: ['Normal user','Privileged user'],
									x: 7 * settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 12 + settings.dialog.lineHeight) * 4;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								productProjects: {
									type: "ListHost",
									modes: ['Normal user','Privileged user'],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 12 + settings.dialog.lineHeight) * 4;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 2;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 12;
									}
								},
								classroomLabel: {
									type: "Label",
									text: "Local classes",
									modes: ['Normal user','Privileged user'],
									x: 7 * settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 12 + settings.dialog.lineHeight) * 5;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								classroomProjects: {
									type: "ListHost",
									modes: ['Normal user','Privileged user'],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 12 + settings.dialog.lineHeight) * 5;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 2;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 12;
									}
								},
								onlineLabel: {
									type: "Label",
									text: "Online classes",
									modes: ['Normal user','Privileged user'],
									x: 7 * settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 12 + settings.dialog.lineHeight) * 6;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								onlineProjects: {
									type: "ListHost",
									modes: ['Normal user','Privileged user'],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 12 + settings.dialog.lineHeight) * 6;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 2;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 12;
									}
								}
							};
							let bPrivileged = (g_profile["can_create_classes"] || 					// Need to do it this way since manager.userAllowedToCreateEditPurchProjs not set yet.
												g_profile["can_create_products"] ||
												g_profile["can_create_onlineClasses"]);
                            let exceptionRet = self.dialog.create(objectConfiguration,
							                                 (bPrivileged ? 'Privileged user' : 'Normal user')
							);
                            if (exceptionRet) {
                                return exceptionRet;
                            }

							//////////////////////////////////////
							// Fill the 5 or 6 ListHosts with project images
					        var posting = $.post("/BOL/UtilityBO/SearchProjects",
					        	{
					        		searchPhrase: '',
					        		userAllowedToCreateEditPurchProjs: (bPrivileged ? 1 : 0)
					        	},
					        	'json'
							);
					        posting.done(function(data){

					            if (data.success) {

					                //m_searchResultProcessedArray = new Array(6);
					                m_searchResultRawArray = data.arrayRows;	// [][]

					                for (let n = 0; n < 6; n++) {

										let stripNth = m_searchResultRawArray[n];
										let lhProjects = self.dialog.controlObject[m_arrayListHostNames[n]];
										let listProjects = lhProjects.list;
										let i = 0;

										listProjects.destroy(); // Don't check result because if destroy fails, that's because it hadn't been created, so it's ok.

					                	//m_searchResultProcessedArray[n] = new Array();

										// Loop through returned projects for ListHost[stripNum] (lhProjects).
										let arrayOutput = stripNth.map((rawProj) => {

											let itemIth = stripNth[i];
											let rliNew = new PictureListItem(itemIth.projectName, itemIth.projectId, i++, resourceHelper.toURL('resources', itemIth.projectImageId, 'image', itemIth.projectAltImagePath));
											rliNew.clickHandler = (id) => {

												m_projectId = id;

												striploop:
												for (let strip = 0; strip < 6; strip++) {

													for (let ind = 0; ind < m_searchResultRawArray[strip].length; ind++) {

														let item = m_searchResultRawArray[strip][ind];
														if (item.projectId === id) {

															alert("You clicked the project named " + item.projectName + ".");
															break striploop;
														}
													}
												}
											}
											return rliNew;
										});
										listProjects.create(arrayOutput);

/*						                for (let i = 0; i < m_searchResultRawArray[stripNum].length; i++) {

						                    let rowIth = m_searchResultRawArray[stripNum][i];
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
*/
					                	//var exceptionRet = m_rebuildCarousel(stripNum);
					                	//if (exceptionRet) { throw exceptionRet; }
					                }
					            } else {

					                // !data.success
									return new Error(data.message);
					            }
					        });


                            // Because it is!
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Decompose instance.
                    self.destroy = function () {

                        try {

                            // Can only destroy a created instance.
                            if (!m_bCreated) {

                                throw { message: "Instance not created!" };
                            }

                            window.landingPage = null;
                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
					// These hold project search info.
					//var m_searchResultProcessedArray;
					var m_searchResultRawArray;
					var m_arrayListHostNames = ["coreProjects","yourProjects","sharedProjects","productProjects","classroomProjects","onlineProjects"];
					// The project id for the user's selected project.
					var m_projectId = 0;

                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
