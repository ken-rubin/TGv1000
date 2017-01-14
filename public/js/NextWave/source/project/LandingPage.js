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
    "NextWave/source/utility/lpModes",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/DialogHost",
    "NextWave/source/utility/List",
    "NextWave/source/utility/ListItem",
    "NextWave/source/utility/PictureListItem",
	"Core/resourceHelper"
    ],
    function (prototypes, settings, lpModes, Point, Size, Area, DialogHost, List, ListItem, PictureListItem, resourceHelper) {

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
								searchLabel: {
									type: "Label",
									text: "Search string (opt.)",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									x: settings.general.margin,
									y: settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								searchEdit: {
									type: "Edit",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
                                    multiline: true,
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: settings.dialog.lineHeight,
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									height: settings.dialog.lineHeight * 2,
									exitFocus: function (localSelf) {
										try {
											// Save off description.
											m_strSearch = localSelf.getText();

										} catch (e) {
											alert(e.message);
										}
									}
								},
								searchButton: {
									type: "Button",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									text: "Search",
									constructorParameterString: "'15px Arial'",
									xType: "callback",
									x: function(area) {
										return settings.general.margin +
										settings.dialog.firstColumnWidth +
										(area.extent.width - settings.dialog.firstColumnWidth) / 3 +
										15
									},
									y: 1.5 * settings.dialog.lineHeight,
									width: 140,
									height: 40,
									click: function() {

									}
								},
								coreLabelP1: {
									type: "Label",
									text: "Core projects. Click to",
									modes: [lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 1;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreLabelP2: {
									type: "Label",
									text: "edit or build a new",
									modes: [lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 1 +
											0.65 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreLabelP3: {
									type: "Label",
									text: "project based on it.",
									modes: [lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 1 +
											1.3 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreLabelN1: {
									type: "Label",
									text: "Click a project type",
									modes: [lpModes.normaluser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 1;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreLabelN2: {
									type: "Label",
									text: "to build a new",
									modes: [lpModes.normaluser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 1 +
											0.65 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreLabelN3: {
									type: "Label",
									text: "project based on it.",
									modes: [lpModes.normaluser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 1 +
											1.3 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreProjects: {
									type: "ListHost",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 1;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									heightType: "callback",
									height: function(area) {
										return (area.extent.height / 12);
									}
								},
								yourLabel1: {
									type: "Label",
									text: "Your projects.",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 2;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								yourLabel2: {
									type: "Label",
									text: "Click to edit.",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 2 +
											0.65 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								yourProjects: {
									type: "ListHost",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 2;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 12;
									}
								},
								sharedLabel1: {
									type: "Label",
									text: "Shared projects.",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 3;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								sharedLabel2: {
									type: "Label",
									text: "Click to copy.",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 3 +
											0.65 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								sharedProjects: {
									type: "ListHost",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 3;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 12;
									}
								},
								productsLabel1: {
									type: "Label",
									text: "Product kits.",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 4;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								productsLabel2: {
									type: "Label",
									text: "Click for info.",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 4 +
											0.65 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								productProjects: {
									type: "ListHost",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 4;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 12;
									}
								},
								classroomLabel1: {
									type: "Label",
									text: "Local classes.",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 5;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								classroomLabel2: {
									type: "Label",
									text: "Click for info.",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 5 +
											0.65 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								classroomProjects: {
									type: "ListHost",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 5;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 12;
									}
								},
								onlineLabel1: {
									type: "Label",
									text: "Online classes.",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 6;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								onlineLabel2: {
									type: "Label",
									text: "Click for info.",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 6 +
											0.65 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								onlineProjects: {
									type: "ListHost",
									modes: [lpModes.normaluser,lpModes.privilegeduser],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight) * 6;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									heightType: "callback",
									height: function(area) {
										return (area.extent.height / 12);
									}
								}
							};
							let bPrivileged = (g_profile["can_create_classes"] || 					// Need to do it this way since manager.userAllowedToCreateEditPurchProjs not set yet.
												g_profile["can_create_products"] ||
												g_profile["can_create_onlineClasses"]);
                            let exceptionRet = self.dialog.create(objectConfiguration,
							                                 (bPrivileged ? lpModes.privilegeduser : lpModes.normaluser),
															 function(area) {
																 try {

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
																				let bVertical = (lhProjects.constructorParameterString === "true"); // If the ListHost is vertical.
																				let i = 0;

																				listProjects.destroy(); // Don't check result because if destroy fails, that's because it hadn't been created, so it's ok.

																				//m_searchResultProcessedArray[n] = new Array();

																				// Loop through returned projects for ListHost[stripNum] (lhProjects).
																				let arrayOutput = stripNth.map((rawProj) => {

																					let itemIth = stripNth[i];
																					let rliNew = new PictureListItem(itemIth.projectName, itemIth.projectId, i++, resourceHelper.toURL('resources', itemIth.projectImageId, 'image', itemIth.projectAltImagePath), (bVertical ? (area.extent.width - settings.dialog.firstColumnWidth) / 2 : 0), (!bVertical ? area.extent.height / 12 : 0));
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

																 } catch(e) {
																	 return e;
																 }
															 }
							);
                            if (exceptionRet) {
                                return exceptionRet;
                            }


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
					// Hold maximalArea.
					var m_area = null;
					// Search string.
					var m_strSearch = "";

                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
