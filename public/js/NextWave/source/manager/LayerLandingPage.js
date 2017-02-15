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
						settings.general.fillBackgroundSolid,			// Required for Layers inheriting LayerDialogHost.
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
							m_PictureListHostCounter = 0;
							m_PictureListHostLabelCounter = 0;
							let objectConfiguration = {
								tgLogo: {
									type: "Picture",
									constructorParameterString: "'media/images/TGtrans.png'",
									modes: [dialogModes.universalmode],
									x: settings.layerLandingPage.navTopMargin,
									y: settings.layerLandingPage.navTopMargin - 12,
									width: 187,
									height: 50
								},
								searchEdit: {
									type: "Edit",
                                    multiline: false,
									modes: [dialogModes.universalmode],
									x: settings.general.margin +
										2 * settings.dialog.firstColumnWidth,
									y: settings.layerLandingPage.navTopMargin,
									widthType: "reserve",
									width: 4 * settings.dialog.firstColumnWidth + 30,
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
									text: glyphs.search,
									constructorParameterString: "'15px Arial','TestP','TestUnPlkjlj lkjlkjlk jlkj lkjlj lkj lkjl kjl kjlkj lkjl kjlkj jjjj kjhkjhkjhkjh hjkhkjhkjhkkjhkjh'",
									modes: [dialogModes.universalmode],
									xType: "reserve",
									x: 2 * settings.dialog.firstColumnWidth,
									y: settings.layerLandingPage.navTopMargin,
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
								usernameLabel: {
									type: "Label",
									text: g_profile["userName"],
									modes: [dialogModes.universalmode],
									font: settings.general.boldFont,
									fillStyle: "#FFFFFF",
									xType: "reserve",
									x: 10 * settings.general.margin + 215,
									y: settings.layerLandingPage.navTopMargin,
									width: 200,
									height: settings.dialog.lineHeight
								},
								settingsButton: {
									type: "Button",
									text: glyphs.settings,
									constructorParameterString: "'15px Arial','','Will open menu for user to choose Profile, Logout, more?'",
									modes: [dialogModes.universalmode],
									xType: "reserve",
									x: 9 * settings.general.margin,
									y: settings.layerLandingPage.navTopMargin,
									width: 30,
									height: 30,
									click: function() {
										try {

										} catch(e) {
											errorHelper.show(e);
										}
									}
								},
								horLine: {
									type: "Picture",
									constructorParameterString: "'media/images/horLine.png'",
									modes: [dialogModes.universalmode],
									x: 0,
									y: settings.layerLandingPage.navOffset,
									widthType: "reserve",
									width: 0,
									height: 4
								},
								navProgram: {
									type: "Label",
									text: "Program",
									modes: [dialogModes.universalmode],
									font: settings.general.boldFont,
									fillStyle: "#A5A839",
									x: settings.dialog.firstColumnWidth,
									y: settings.layerLandingPage.navOffset + 20,
									width: 100,
									height: settings.dialog.lineHeight,
									clickHandler: function() {
										m_PictureListHostCounter = m_PictureListHostLabelCounter = 0;
										self.dialog.setMode(dialogModes.programMode, true);
									}
								},
								navPlayGames: {
									type: "Label",
									text: "Play Games",
									modes: [dialogModes.universalmode],
									font: settings.general.boldFont,
									fillStyle: "#009999",
									x: settings.dialog.firstColumnWidth + 125,
									y: settings.layerLandingPage.navOffset + 20,
									width: 100,
									height: settings.dialog.lineHeight,
									clickHandler: function() {
										m_PictureListHostCounter = m_PictureListHostLabelCounter = 0;
										self.dialog.setMode(dialogModes.gameMode, true);
									}
								},
								navClasses: {
									type: "Label",
									text: "Classes",
									modes: [dialogModes.universalmode],
									font: settings.general.boldFont,
									fillStyle: "#FF0000",
									x: settings.dialog.firstColumnWidth + 265,
									y: settings.layerLandingPage.navOffset + 20,
									width: 100,
									height: settings.dialog.lineHeight,
									clickHandler: function() {
										m_PictureListHostCounter = m_PictureListHostLabelCounter = 0;
										self.dialog.setMode(dialogModes.classMode, true);
									}
								},
								navKits: {
									type: "Label",
									text: "Kits",
									modes: [dialogModes.universalmode],
									font: settings.general.boldFont,
									fillStyle: "#FFAB00",
									x: settings.dialog.firstColumnWidth + 375,
									y: settings.layerLandingPage.navOffset + 20,
									width: 50,
									height: settings.dialog.lineHeight,
									clickHandler: function() {
										m_PictureListHostCounter = m_PictureListHostLabelCounter = 0;
										self.dialog.setMode(dialogModes.kitMode, true);
									}
								},
								navGromLand: {
									type: "Label",
									text: "GromLand",
									modes: [dialogModes.universalmode],
									font: settings.general.boldFont,
									fillStyle: "#00AE68",
									x: settings.dialog.firstColumnWidth + 450,
									y: settings.layerLandingPage.navOffset + 20,
									width: 100,
									height: settings.dialog.lineHeight
								},
								coreLabel: {
									type: "Label",
									text: "Core Projects",
									modes: [dialogModes.unfilteredMode,dialogModes.classMode],
									font: settings.general.smallBoldFont,
									fillStyle: "#F7FE00",
									x: settings.dialog.firstColumnWidth / 2,
									yType: "callback",
									y: function(area) {
										if (self.dialog.controlObject["coreLabel"].modes.includes(self.dialog.getMode())) { m_PictureListHostLabelCounter++; }
										return settings.layerLandingPage.navOffset + 70 +
											(((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7)) * (m_PictureListHostLabelCounter - 1);
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								coreProjects: {
									type: "PictureListHost",
									modes: [dialogModes.unfilteredMode,dialogModes.classMode],
									x: 4 * settings.general.margin,
									yType: "callback",
									y: function(area) {
										if (self.dialog.controlObject["coreProjects"].modes.includes(self.dialog.getMode())) { m_PictureListHostCounter++; }
										return settings.layerLandingPage.navOffset + 50 + settings.dialog.lineHeight +
											(((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7)) * (m_PictureListHostCounter - 1);
									},
									widthType: "reserve",
									width: 8 * settings.general.margin,
									heightType: "callback",
									height: function(area) {
										return (((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7) - settings.dialog.lineHeight);
									}
								},
								yourLabel: {
									type: "Label",
									text: "Your projects",
									modes: [dialogModes.unfilteredMode,dialogModes.programMode,dialogModes.classMode,dialogModes.kitMode],
									font: settings.general.smallBoldFont,
									fillStyle: "#F7FE00",
									x: settings.dialog.firstColumnWidth / 2,
									yType: "callback",
									y: function(area) {
										if (self.dialog.controlObject["yourLabel"].modes.includes(self.dialog.getMode())) { m_PictureListHostLabelCounter++; }
										return settings.layerLandingPage.navOffset + 70 +
											(((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7)) * (m_PictureListHostLabelCounter - 1);
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								yourProjects: {
									type: "PictureListHost",
									modes: [dialogModes.unfilteredMode,dialogModes.programMode,dialogModes.classMode,dialogModes.kitMode],
									x: 4 * settings.general.margin,
									yType: "callback",
									y: function(area) {
										if (self.dialog.controlObject["yourProjects"].modes.includes(self.dialog.getMode())) { m_PictureListHostCounter++; }
										return settings.layerLandingPage.navOffset + 50 + settings.dialog.lineHeight +
											(((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7)) * (m_PictureListHostCounter - 1);
									},
									widthType: "reserve",
									width: 8 * settings.general.margin,
									heightType: "callback",
									height: function(area) {
										return (((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7) - settings.dialog.lineHeight);
									}
								},
								sharedLabel: {
									type: "Label",
									text: "Shared projects",
									modes: [dialogModes.unfilteredMode],
									font: settings.general.smallBoldFont,
									fillStyle: "#F7FE00",
									x: settings.dialog.firstColumnWidth / 2,
									yType: "callback",
									y: function(area) {
										if (self.dialog.controlObject["sharedLabel"].modes.includes(self.dialog.getMode())) { m_PictureListHostLabelCounter++; }
										return settings.layerLandingPage.navOffset + 70 +
											(((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7)) * (m_PictureListHostLabelCounter - 1);
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								sharedProjects: {
									type: "PictureListHost",
									modes: [dialogModes.unfilteredMode],
									x: 4 * settings.general.margin,
									yType: "callback",
									y: function(area) {
										if (self.dialog.controlObject["sharedProjects"].modes.includes(self.dialog.getMode())) { m_PictureListHostCounter++; }
										return settings.layerLandingPage.navOffset + 50 + settings.dialog.lineHeight +
											(((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7)) * (m_PictureListHostCounter - 1);
									},
									widthType: "reserve",
									width: 8 * settings.general.margin,
									heightType: "callback",
									height: function(area) {
										return (((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7) - settings.dialog.lineHeight);
									}
								},
								kitLabel: {
									type: "Label",
									text: "Kits",
									modes: [dialogModes.unfilteredMode,dialogModes.kitMode],
									font: settings.general.smallBoldFont,
									fillStyle: "#F7FE00",
									x: settings.dialog.firstColumnWidth / 2,
									yType: "callback",
									y: function(area) {
										if (self.dialog.controlObject["kitLabel"].modes.includes(self.dialog.getMode())) { m_PictureListHostLabelCounter++; }
										return settings.layerLandingPage.navOffset + 70 +
											(((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7)) * (m_PictureListHostLabelCounter - 1);
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								productProjects: {
									type: "PictureListHost",
									modes: [dialogModes.unfilteredMode,dialogModes.kitMode],
									x: 4 * settings.general.margin,
									yType: "callback",
									y: function(area) {
										if (self.dialog.controlObject["productProjects"].modes.includes(self.dialog.getMode())) { m_PictureListHostCounter++; }
										return settings.layerLandingPage.navOffset + 50 + settings.dialog.lineHeight +
											(((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7)) * (m_PictureListHostCounter - 1);
									},
									widthType: "reserve",
									width: 8 * settings.general.margin,
									heightType: "callback",
									height: function(area) {
										return (((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7) - settings.dialog.lineHeight);
									}
								},
								classroomLabel: {
									type: "Label",
									text: "Classroom Classes",
									modes: [dialogModes.unfilteredMode,dialogModes.classMode],
									font: settings.general.smallBoldFont,
									fillStyle: "#F7FE00",
									x: settings.dialog.firstColumnWidth / 2,
									yType: "callback",
									y: function(area) {
										if (self.dialog.controlObject["classroomLabel"].modes.includes(self.dialog.getMode())) { m_PictureListHostLabelCounter++; }
										return settings.layerLandingPage.navOffset + 70 +
											(((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7)) * (m_PictureListHostLabelCounter - 1);
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								classroomProjects: {
									type: "PictureListHost",
									modes: [dialogModes.unfilteredMode,dialogModes.classMode],
									x: 4 * settings.general.margin,
									yType: "callback",
									y: function(area) {
										if (self.dialog.controlObject["classroomProjects"].modes.includes(self.dialog.getMode())) { m_PictureListHostCounter++; }
										return settings.layerLandingPage.navOffset + 50 + settings.dialog.lineHeight +
											(((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7)) * (m_PictureListHostCounter - 1);
									},
									widthType: "reserve",
									width: 8 * settings.general.margin,
									heightType: "callback",
									height: function(area) {
										return (((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7) - settings.dialog.lineHeight);
									}
								},
								onlineClassesLabel: {
									type: "Label",
									text: "Online Classes",
									modes: [dialogModes.unfilteredMode,dialogModes.classMode],
									font: settings.general.smallBoldFont,
									fillStyle: "#F7FE00",
									x: settings.dialog.firstColumnWidth / 2,
									yType: "callback",
									y: function(area) {
										if (self.dialog.controlObject["onlineClassesLabel"].modes.includes(self.dialog.getMode())) { m_PictureListHostLabelCounter++; }
										return settings.layerLandingPage.navOffset + 70 +
											(((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7)) * (m_PictureListHostLabelCounter - 1);
									},
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								onlineProjects: {
									type: "PictureListHost",
									modes: [dialogModes.unfilteredMode,dialogModes.classMode],
									x: 4 * settings.general.margin,
									yType: "callback",
									y: function(area) {
										if (self.dialog.controlObject["onlineProjects"].modes.includes(self.dialog.getMode())) { m_PictureListHostCounter++; }
										return settings.layerLandingPage.navOffset + 50 + settings.dialog.lineHeight +
											(((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7)) * (m_PictureListHostCounter - 1);
									},
									widthType: "reserve",
									width: 8 * settings.general.margin,
									heightType: "callback",
									height: function(area) {
										return (((area.extent.height - (settings.layerLandingPage.navOffset + 20 + settings.dialog.lineHeight)) / 7) - settings.dialog.lineHeight);
									}
								},
								priv0: {
									type: "Label",
									text: "Core strip--priv. user makes choice of editing a core project or starting a new normal or purchasable project based on the selected core project.",
									modes: [dialogModes.privilegeduserclickstrip0],
									x: settings.general.margin,
									y: settings.layerLandingPage.navOffset + settings.general.margin,
									width: 10 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								priv1: {
									type: "Label",
									text: "Your own strip--editing. May save with new name. May also make public.",
									modes: [dialogModes.privilegeduserclickstrip1],
									x: settings.general.margin,
									y: settings.layerLandingPage.navOffset + settings.general.margin,
									width: 10 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								priv2: {
									type: "Label",
									text: "Shared strip--cloning. Another possibility is that it's being reviewed for approval to be made public.",
									modes: [dialogModes.privilegeduserclickstrip2],
									x: settings.general.margin,
									y: settings.layerLandingPage.navOffset + settings.general.margin,
									width: 10 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								priv3: {
									type: "Label",
									text: "Product strip--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.",
									modes: [dialogModes.privilegeduserclickstrip3],
									x: settings.general.margin,
									y: settings.layerLandingPage.navOffset + settings.general.margin,
									width: 10 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								priv4: {
									type: "Label",
									text: "Classroom strip--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.",
									modes: [dialogModes.privilegeduserclickstrip4],
									x: settings.general.margin,
									y: settings.layerLandingPage.navOffset + settings.general.margin,
									width: 10 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								priv5: {
									type: "Label",
									text: "Online strip--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.",
									modes: [dialogModes.privilegeduserclickstrip5],
									x: settings.general.margin,
									y: settings.layerLandingPage.navOffset + settings.general.margin,
									width: 10 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								norm0: {
									type: "Label",
									text: "Core strip--will create new normal project based on it. Cannot edit and save replacing itself.",
									modes: [dialogModes.normaluserclickstrip0],
									x: settings.general.margin,
									y: settings.layerLandingPage.navOffset + settings.general.margin,
									width: 10 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								norm1: {
									type: "Label",
									text: "Your own strip--editing. May save with a new name as a new project.",
									modes: [dialogModes.normaluserclickstrip1],
									x: settings.general.margin,
									y: settings.layerLandingPage.navOffset + settings.general.margin,
									width: 10 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								norm2: {
									type: "Label",
									text: "Shared public project strip--cloning.",
									modes: [dialogModes.normaluserclickstrip2],
									x: settings.general.margin,
									y: settings.layerLandingPage.navOffset + settings.general.margin,
									width: 10 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								norm3: {
									type: "Label",
									text: "Product that is active strip--will make buying decision.",
									modes: [dialogModes.normaluserclickstrip3],
									x: settings.general.margin,
									y: settings.layerLandingPage.navOffset + settings.general.margin,
									width: 10 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								norm4: {
									type: "Label",
									text: "Classroom (active, soon and nearby) strip--will make buying or waitlist decision.",
									modes: [dialogModes.normaluserclickstrip4],
									x: settings.general.margin,
									y: settings.layerLandingPage.navOffset + settings.general.margin,
									width: 10 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								norm5: {
									type: "Label",
									text: "Online (active and soon) strip--will make buying decision. There is no max number of enrollees.",
									modes: [dialogModes.normaluserclickstrip5],
									x: settings.general.margin,
									y: settings.layerLandingPage.navOffset + settings.general.margin,
									width: 10 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								}
							};
							m_bPrivileged = (g_profile["can_create_classes"] || 					// Need to do it this way since manager.userAllowedToCreateEditPurchProjs not set yet.
												g_profile["can_create_products"] ||
												g_profile["can_create_onlineClasses"]);
                            let exceptionRet = self.dialog.create(objectConfiguration,
							                                 	dialogModes.unfilteredMode,
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

					self.resetLandingPageDialogMode = function() {

						//self.dialog.setMode(self.dialog.getMode());
					}

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
										let listProjectsHeight = lhProjects.list.areaMaximal.extent.height;
										let listProjects = lhProjects.list;
										let i = 0;

										listProjects.destroy(); // Don't check result because if destroy fails, that's because it hadn't been created, so it's ok.

										// Loop through returned projects for ListHost[stripNum] (lhProjects).
										let arrayOutput = stripNth.map((itemIth) => {

											//let itemIth = stripNth[i];
											let rliNew = new PictureListItem(itemIth.projectName,
																			itemIth.projectId,
																			i++,
																			resourceHelper.toURL('resources', itemIth.projectImageId, 'image', itemIth.projectAltImagePath),
																			0,
																			listProjectsHeight * settings.layerLandingPage.dVerticalPct,
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
										+ "<br>Difficulty: settings.layerLandingPage.navOffset + " + itemIth.difficulty
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
										+ "<br>Difficulty: settings.layerLandingPage.navOffset + " + itemIth.difficulty
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
										+ "<br>Difficulty: settings.layerLandingPage.navOffset + " + itemIth.difficulty
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

							let newMode = 0;

							if (m_bPrivileged) {

								switch(strip) {
									case 0:		// Core strip--priv. user makes choice of editing a core project or starting a new normal or purchasable project based on the selected core project.
										newMode = dialogModes.privilegeduserclickstrip0;
										break;
									case 1:		// Your own strip--editing. May save with new name. May also make public.
										newMode = dialogModes.privilegeduserclickstrip1;
										break;
									case 2:		// Shared strip--cloning. Another possibility is that it's being reviewed for approval to be made public.
										newMode = dialogModes.privilegeduserclickstrip2;
										break;
									case 3:		// Product strip--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.
										newMode = dialogModes.privilegeduserclickstrip3;
										break;
									case 4:		// Classroom strip--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.
										newMode = dialogModes.privilegeduserclickstrip4;
										break;
									case 5:		// Online strip--cannot purchase, so must be opened for editing. Another possibility is that it's being reviewed for approval to be made active.
										newMode = dialogModes.privilegeduserclickstrip5;
										break;
								}
							} else {

								switch(strip) {
									case 0:		// Core strip--will create new normal project based on it. Cannot edit and save replacing itself.
										newMode = dialogModes.normaluserclickstrip0;
										break;
									case 1:		// Your own strip--editing. May save with a new name as a new project.
										newMode = dialogModes.normaluserclickstrip1;
										break;
									case 2:		// Shared public project strip--cloning.
										newMode = dialogModes.normaluserclickstrip2;
										break;
									case 3:		// Product that is active strip--will make buying decision.
										newMode = dialogModes.normaluserclickstrip3;
										break;
									case 4:		// Classroom (active, soon and nearby) strip--will make buying or waitlist decision.
										newMode = dialogModes.normaluserclickstrip4;
										break;
									case 5:		// Online (active and soon) strip--will make buying decision. There is no max number of enrollees.
										newMode = dialogModes.normaluserclickstrip5;
										break;
								}
							}

							// self.dialog.setMode(newMode);
							manager.setNavbarLayerModes(newMode, m_projectId, rawItem, strip, index);

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
					// Search string.
					var m_strSearch = "";
					// Privileged user or not.
					var m_bPrivileged = false;
					// Helps position the variable number of PictureListHost labels.
					var m_PictureListHostLabelCounter;
					// Helps position the variable number of PictureListHosts.
					var m_PictureListHostCounter;

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
