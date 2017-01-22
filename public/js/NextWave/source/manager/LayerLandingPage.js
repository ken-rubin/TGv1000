///////////////////////////////////////
// LayerLandingPage module.
//
// Maintains collection of panels (one of which can be active, e.g. has focus).
// Also responsible for scaling to the display dimension (e.g. responsiveness).
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
        "NextWave/source/utility/settings",
        "NextWave/source/utility/dialogModes",
        "NextWave/source/utility/Area",
        "NextWave/source/utility/Point",
        "NextWave/source/utility/Size",
        "NextWave/source/manager/LayerDialogHost",
        "NextWave/source/utility/Dialog",
		"NextWave/source/utility/List",
		"NextWave/source/utility/ListItem",
		"NextWave/source/utility/PictureListItem",
		"NextWave/source/utility/glyphs",
		"Core/resourceHelper",
		"Core/errorHelper"
        ],
    function(prototypes, settings, dialogModes, Area, Point, Size, LayerDialogHost, Dialog, List, ListItem, PictureListItem, glyphs, resourceHelper, errorHelper) {

        try {

            // Constructor function.
            var functionRet = function LayerLandingPage() {

                try {

                    var self = this; // Uber closure.

                    // Inherit from base class.
                    self.inherits(LayerDialogHost,
						"rgba(99,137,228,1)",		// Required for Layers inheriting LayerDialogHost.
						true						// Tells LayerDialogHost to set objectReference.handled in mouse move.
					);

                    // Initialze instance.
                    self.create = function() {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw {

                                    message: "LayerLandingPage: Instance already created!"
                                };
                            }

                            // Create the dialog.
							let objectConfiguration = {
								searchLabel: {
									type: "Label",
									text: "Search string (opt.)",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									y: settings.general.margin,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								searchEdit: {
									type: "Edit",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
                                    multiline: false,
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: settings.general.margin,
									widthType: "reserve",
									width: 3 * settings.dialog.firstColumnWidth + 30,
									height: settings.dialog.lineHeight,
									enterFocus: function (localSelf) {
										try {
											manager.setFocus(localSelf);
											return null;
										} catch (e) {
											errorHelper.show(e);
										}
									},
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
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									text: glyphs.search,
									constructorParameterString: "'15px Arial'",
									xType: "reserve",
									x: 2 * settings.dialog.firstColumnWidth,
									y: settings.general.margin,
									width: 30,
									height: 30,
									click: function() {
										try {
											let exceptionRet = m_functionSearchAndReload();
											if (exceptionRet) {
												throw exceptionRet;
											}
										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								coreLabelP1: {
									type: "Label",
									text: "Core projects. Click to",
									modes: [dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 1;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreLabelP2: {
									type: "Label",
									text: "edit or build a new",
									modes: [dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 1 +
											0.5 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreLabelP3: {
									type: "Label",
									text: "project based on it.",
									modes: [dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 1 +
											1.0 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreLabelN1: {
									type: "Label",
									text: "Click a project type",
									modes: [dialogModes.normaluser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 1;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreLabelN2: {
									type: "Label",
									text: "to build a new",
									modes: [dialogModes.normaluser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 1 +
											0.5 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreLabelN3: {
									type: "Label",
									text: "project based on it.",
									modes: [dialogModes.normaluser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 1 +
											1.0 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreProjects: {
									type: "ListHost",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 1;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									heightType: "callback",
									height: function(area) {
										return (area.extent.height / 15);
									}
								},
								yourLabel1: {
									type: "Label",
									text: "Your projects.",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 2;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								yourLabel2: {
									type: "Label",
									text: "Click to edit.",
									font: settings.general.smallBoldFont,
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 2 +
											0.5 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								yourProjects: {
									type: "ListHost",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 2;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 15;
									}
								},
								sharedLabel1: {
									type: "Label",
									text: "Shared projects.",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 3;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								sharedLabel2: {
									type: "Label",
									text: "Click to copy.",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 3 +
											0.5 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								sharedProjects: {
									type: "ListHost",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 3;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 15;
									}
								},
								productsLabel1: {
									type: "Label",
									text: "Product kits.",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 4;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								productsLabel2: {
									type: "Label",
									text: "Click for info.",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 4 +
											0.5 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								productProjects: {
									type: "ListHost",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 4;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 15;
									}
								},
								classroomLabel1: {
									type: "Label",
									text: "Local classes.",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 5;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								classroomLabel2: {
									type: "Label",
									text: "Click for info.",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 5 +
											0.5 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								classroomProjects: {
									type: "ListHost",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 5;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									heightType: "callback",
									height: function(area) {
										return area.extent.height / 15;
									}
								},
								onlineLabel1: {
									type: "Label",
									text: "Online classes.",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 6;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								onlineLabel2: {
									type: "Label",
									text: "Click for info.",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									font: settings.general.smallBoldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 6 +
											0.5 * settings.dialog.lineHeight;
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								onlineProjects: {
									type: "ListHost",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									constructorParameterString: "false",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 6;
									},
									widthType: "callback",
									width: function(area) {
										return (area.extent.width - settings.dialog.firstColumnWidth) / 3;
									},
									heightType: "callback",
									height: function(area) {
										m_area = area;	// Set it aside. Works in this case.
										return (area.extent.height / 15);
									}
								},
								encouragementLabel: {
									type: "Label",
									text: "Click one of the project images above for more information about that project.",
									modes: [dialogModes.normaluser,dialogModes.privilegeduser],
									font: "oblique " + settings.general.boldFont,
									x: settings.general.margin,
									yType: "callback",
									y: function(area) {
										return (area.extent.height / 15 + settings.dialog.lineHeight / 2) * 6 +
											(area.extent.height / 15) +
											0.5 * settings.dialog.lineHeight;
									},
									widthType: "callback",
									width: function(area) {
										return area.extent.width;
									},
									height: settings.dialog.lineHeight
								}
							};
							m_bPrivileged = (g_profile["can_create_classes"] || 					// Need to do it this way since manager.userAllowedToCreateEditPurchProjs not set yet.
												g_profile["can_create_products"] ||
												g_profile["can_create_onlineClasses"]);
                            let exceptionRet = self.dialog.create(objectConfiguration,
							                                 	(m_bPrivileged ? dialogModes.privilegeduser : dialogModes.normaluser),
																m_functionSearchAndReload
							);
                            if (exceptionRet) {
                                return exceptionRet;
                            }

                            // Indicate current state.
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private methods.

					var m_functionSearchAndReload = function() {

						try {

							//////////////////////////////////////
							// Fill the 6 ListHosts with project images
							var posting = $.post("/BOL/UtilityBO/SearchProjects",
								{
									searchPhrase: m_strSearch,
									userAllowedToCreateEditPurchProjs: (m_bPrivileged ? 1 : 0)
								},
								'json'
							);
							posting.done(function(data){

								if (data.success) {

									m_searchResultRawArray = data.arrayRows;	// [][]

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

									for (let n = 0; n < 6; n++) {

										let stripNth = m_searchResultRawArray[n];
										let lhProjects = self.dialog.controlObject[m_arrayListHostNames[n]];
										let listProjects = lhProjects.list;
										let bVertical = (lhProjects.constructorParameterString === "true");
										let i = 0;

										listProjects.destroy(); // Don't check result because if destroy fails, that's because it hadn't been created, so it's ok.

										// Loop through returned projects for ListHost[stripNum] (lhProjects).
										let arrayOutput = stripNth.map((itemIth) => {

											//let itemIth = stripNth[i];
											let rliNew = new PictureListItem(itemIth.projectName,
																			itemIth.projectId,
																			i++,
																			resourceHelper.toURL('resources', itemIth.projectImageId, 'image', itemIth.projectAltImagePath),
																			(bVertical ? (m_area.extent.width - settings.dialog.firstColumnWidth) / 2 : 0),
																			(!bVertical ? m_area.extent.height / 15 : 0),
																			m_functionGetTooltipText(itemIth, n));
											rliNew.clickHandler = (projectId) => {

												m_projectId = projectId;

												striploop:
												for (let strip = 0; strip < 6; strip++) {

													for (let ind = 0; ind < m_searchResultRawArray[strip].length; ind++) {

														let item = m_searchResultRawArray[strip][ind];
														if (item.projectId === m_projectId) {

															let exceptionRet = m_functionSetSelectedProject(item, strip, ind);
															if (exceptionRet) {
																errorHelper.show(exceptionRet);
															}

															break striploop;
														}
													}
												}
											}
											return rliNew;
										});
										listProjects.create(arrayOutput);
									}
									return null;
								} else {

									// !data.success
									return new Error(data.message);
								}
							});
						} catch(e) {
							return e;
						}
					}

					//
					var m_functionGetTooltipText = function(itemIth, stripNum) {

						let tooltip = itemIth.projectName;

						switch(stripNum) {
							case 0:
							case 1:
							case 2:
								// Name and description.
								tooltip = tooltip
										+ "<br>Description: " + itemIth.projectDescription;
								break;
							case 3:
								// Products.
								tooltip = tooltip
										+ "<br>Level: " + itemIth.level
										+ "<br>Difficulty: " + itemIth.difficulty
										+ "<br>Description: " + itemIth.productDescription
										+ "<br>Price: " + itemIth.price.dollarFormat();
								if (!m_bPrivileged && itemIth.alreadyBought) {
									tooltip += "<br><b>You've already purchased this product.</b>";
								}
								break;
							case 4:
								// Classes.
								var strFirstClass;
								var mntFirstClass = moment(JSON.parse(itemIth.schedule)[0].date, 'YYYY-MM-DD');
								// mntFirstClass has to be good for a non-priv user, but it may be invalid if the class is still being set up. So handle that.
								if (mntFirstClass.isValid()) {
									strFirstClass = mntFirstClass.format('dddd, MMMM Do YYYY');
								} else {
									strFirstClass = '';
								}
								tooltip = tooltip
										+ "<br>Level: " + itemIth.level
										+ "<br>Difficulty: " + itemIth.difficulty
										+ "<br>Description: " + itemIth.classDescription
										+ "<br>Notes: " + itemIth.classNotes
										+ "<br>First class: " + strFirstClass
										+ "<br>Price: " + (itemIth.price ? itemIth.price.dollarFormat() + " for all sessions" : "");
								var maxClassSize = itemIth.maxClassSize;
								var numEnrollees = itemIth.numEnrollees;
								if (!m_bPrivileged) {
									if ( itemIth.alreadyEnrolled) {
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
								var mntFirstClass = moment(JSON.parse(itemIth.schedule)[0].date, 'YYYY-MM-DD');
								// mntFirstClass has to be good for a non-priv user, but it may be invalid if the class is still being set up. So handle that.
								if (mntFirstClass.isValid()) {
									strFirstClass = mntFirstClass.format('dddd, MMMM Do YYYY');
								} else {
									strFirstClass = '';
								}
								tooltip = tooltip
										+ "<br>Level: " + itemIth.level
										+ "<br>Difficulty: " + itemIth.difficulty
										+ "<br>Description: " + itemIth.classDescription
										+ "<br>Notes: " + itemIth.classNotes
										+ "<br>First class: " + strFirstClass
										+ "<br>Price: " + (itemIth.price ? itemIth.price.dollarFormat() + " / session" : "");
								if (!m_bPrivileged && itemIth.alreadyEnrolled) {
									tooltip += "<br><b>You've already enrolled in this online class.</b>";
								}
								break;
						}

						return tooltip;
					}

					//
					var m_functionSetSelectedProject = function(rawItem, strip, index) {

						try {

							if (m_bPrivileged) {

								switch(strip) {
									case 0:		// Core--priv. user makes choice of editing a core project or starting a new normal or purchasable project based on the selected core project.
										errorHelper.show(rawItem.projectName + ": Core--priv. user makes choice of editing a core project or starting a new normal or purchasable project based on the selected core project.");
										break;
									case 1:		// Your own--editing. May save with new name. May also make public.
										errorHelper.show(rawItem.projectName + ": Your own--editing. May save with new name. May also make public.");
										break;
									case 2:		// Shared--cloning. Another possibility is that it's being reviewed for approval to be made public.
										errorHelper.show(rawItem.projectName + ": Shared--cloning. Another possibility is that it's being reviewed for approval to be made public.");
										break;
									case 3:		// Product--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.
										errorHelper.show(rawItem.projectName + ": Product--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.");
										break;
									case 4:		// Classroom--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.
										errorHelper.show(rawItem.projectName + ": Classroom--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.");
										break;
									case 5:		// Online--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.
										errorHelper.show(rawItem.projectName + ": Online--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.");
										break;
								}
							} else {

								switch(strip) {
									case 0:		// Core--will create new normal project based on it. Cannot edit and save replacing itself.
										errorHelper.show(rawItem.projectName + ": Core--will create new normal project based on it. Cannot edit and save replacing itself.");
										break;
									case 1:		// Your own--editing. May save with a new name as a new project.
										errorHelper.show(rawItem.projectName + ": Your own--editing. May save with a new name as a new project.");
										break;
									case 2:		// Shared public project--cloning.
										errorHelper.show(rawItem.projectName + ": Shared public project--cloning.");
										break;
									case 3:		// Product that is active--will make buying decision.
										errorHelper.show(rawItem.projectName + ": Product that is active--will make buying decision.");
										break;
									case 4:		// Classroom (active, soon and nearby)--will make buying or waitlist decision.
										errorHelper.show(rawItem.projectName + ": Classroom (active, soon and nearby)--will make buying or waitlist decision.");
										break;
									case 5:		// Online (active and soon)--will make buying decision. There is no max number of enrollees.
										errorHelper.show(rawItem.projectName + ": Online (active and soon)--will make buying decision. There is no max number of enrollees.");
										break;
								}
							}

							return null;
						} catch(e) {

							return e;
						}
					}

                    //////////////////////////
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
					// Privileged user or not.
					var m_bPrivileged = false;

                } catch (e) {

                    alert(e.message);
                }
            };

            // Do function injection.
            functionRet.inheritsFrom(LayerDialogHost);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
