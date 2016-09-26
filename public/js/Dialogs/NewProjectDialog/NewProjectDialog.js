////////////////////////////////////
// NewProjectDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the NewProjectDialog constructor function.
			var functionNewProjectDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function(arrayAvailProjTypes) {

						try {

							m_arrayAvailProjTypes = arrayAvailProjTypes;
							m_projectType = null;	// If m_projectType === null then the dialog will display a project type chooser (newProjectDialog1).
													// Otherwise, it will display the real New Project Dialog (newProjectDialog2).

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/NewProjectDialog/newProjectDialog1"
								}, 
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionRenderJadeSnippetResponse1).error(errorHelper.show);

							return null;
							
						} catch (e) {

							return e;
						}
					};

					self.closeYourself = function() {

						m_dialog.close();
					}

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse1 = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the TypesDialog jade HTML-snippet.

							// Normal users choose a Core project type by clicking on the picture.
							// Privileged users have to click on a Core image (which will highlight it),
							// choose a project type (Normal, Class or Product--as permitted) and then click
							// the primary button or press Enter.

							var buttons = [];
							if (manager.userAllowedToCreateEditPurchProjs) {

							    buttons = [
					            	{
					            		id: 'ContinueBtn',
					            		label: "Continue",
					            		cssClass: "btn-primary",
					            		hotkey: 13,
					            		action: function(){

					            			m_functionContinue();
					            		}
					            	},
					            	{
						                label: "Close",
						                icon: "glyphicon glyphicon-remove-circle",
						                cssClass: "btn-warning",
						                action: function(dialogItself){

						                    dialogItself.close();
						                }
					            	}
					            ];
					        }

							BootstrapDialog.show({

								title: "Choose Project Type",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            draggable: false,
					            onshown: m_functionOnShownDialog1,
					            buttons: buttons
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog1 = function (dialogItself) {

						try {

							if (m_arrayAvailProjTypes.includes(1)) {
								$("#GameImage").attr("src", resourceHelper.toURL("images", null, null, "gameProject.png"));
								$("#GameImage").click(function(){m_functionProjectTypeSelected("Game");});
							} else {
								$("#GameImage").css("display","none");
							}

							if (m_arrayAvailProjTypes.includes(2)) {
								$("#ConsoleImage").attr("src", resourceHelper.toURL("images", null, null, "consoleProject.png"));
								$("#ConsoleImage").click(function(){m_functionProjectTypeSelected("Console");});
							} else {
								$("#ConsoleImage").css("display","none");
							}

							if (m_arrayAvailProjTypes.includes(3)) {
								$("#WebSiteImage").attr("src", resourceHelper.toURL("images", null, null, "websiteProject.png"));
								$("#WebSiteImage").click(function(){m_functionProjectTypeSelected("Web Site");});
							} else {
								$("#WebSiteImage").css("display","none");
							}

							if (m_arrayAvailProjTypes.includes(4)) {
								$("#HoloLensImage").attr("src", resourceHelper.toURL("images", null, null, "hololensProject.png"));
								$("#HoloLensImage").click(function(){m_functionProjectTypeSelected("HoloLens");});
							} else {
								$("#HoloLensImage").css("display","none");
							}

							if (m_arrayAvailProjTypes.includes(5)) {
								$("#MappingImage").attr("src", resourceHelper.toURL("images", null, null, "mappingProject.png"));
								$("#MappingImage").click(function(){m_functionProjectTypeSelected("Mapping");});
							} else {
								$("#MappingImage").css("display","none");
							}

							if (manager.userAllowedToCreateEditPurchProjs) {
								$("#PrivilegedUsersDiv").css("display", "block");
								$("#ContinueBtn").prop('disabled', true);
							}

							if (g_profile["can_create_classes"]) {
								$("#CreateClassesDiv").css("display", "block");
							}

							if (g_profile["can_create_products"]) {
								$("#CreateProductsDiv").css("display", "block");
							}

							if (g_profile["can_create_onlineClasses"]) {
								$("#CreateOnlineClassesDiv").css("display", "block");
							}

							$(".tt-selector").powerTip({
								smartPlacement: true
							});

							// Save the dailog object reference.
							m_dialog = dialogItself;
							
						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionRenderJadeSnippetResponse2 = function (htmlData) {

						try {

							// Close the Project type selection dialog.
							m_dialog.close();

							// Show the dialog--load the content from 
							// the TypesDialog jade HTML-snippet.
							//
							// There will be buttons for creating different project configurations:
							// (1) 
							BootstrapDialog.show({

								title: "New " + m_projectType + " Project",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		id: 'CreateProjBtn',
					            		label: "Create Project",
					            		cssClass: "btn-primary",
					            		hotkey: 13,
					            		action: function(){

					            			m_functionCreateProject();
					            		}
					            	},
					            	{
						                label: "Close",
						                icon: "glyphicon glyphicon-remove-circle",
						                cssClass: "btn-warning",
						                action: function(dialogItself){

						                    dialogItself.close();
						                }
					            	}
					            ],
					            draggable: false,
					            onshown: m_functionOnShownDialog2
					        });

						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog2 = function (dialogItself) {

						try {

							$(".tt-selector .btn-default").powerTip({
								smartPlacement: true
							});

							// Save the dailog object reference.
							m_dialog = dialogItself;

							// Set project image.
							var imgSrc;
							switch (m_projectType) {
								case "Game":
									imgSrc = "media/images/gameProject.png";
									break;
								case "Console":
									imgSrc = "media/images/consoleProject.png";
									break;
								case "Web Site":
									imgSrc = "media/images/websiteProject.png";
									break;
								case "HoloLens":
									imgSrc = "media/images/hololensProject.png";
									break;
								case "Mapping":
									imgSrc = "media/images/mappingProject.png";
									break;
								default:
									imgSrc = resourceHelper.toURL("resources", 0, "image");
							}
							$("#ProjectImage").attr("src", imgSrc);

							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);
							$("#ProjectName").focus();

							// If this new project is a Class or Product, fetch the specific jade/html template to insert into the dialog.
							var templateToGet = null;
							if (m_bClassProject) {

								templateToGet = 'Dialogs/NewProjectDialog/classDetails.jade';

							} else if (m_bProductProject) {

								templateToGet = 'Dialogs/NewProjectDialog/productDetails.jade';
							
							} else if (m_bOnlineClassProject) {

								templateToGet = 'Dialogs/NewProjectDialog/onlineClassDetails.jade';
							}

							if (templateToGet) {

								// Get the dialog DOM.
								$.ajax({

									cache: false,
									data: { 

										templateFile: templateToGet
									}, 
									dataType: "HTML",
									method: "POST",
									url: "/renderJadeSnippet"
								}).done(m_functionRenderJadeSnippetResponse2b).error(errorHelper.show);
							
							} else {

								// A normal project.
								$("#ProjectName").focus();
								$("#ProjectName").keyup(m_functionEnableDisableCreateProjBtn);
								m_functionEnableDisableCreateProjBtn();
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionRenderJadeSnippetResponse2b = function(htmlData) {

						$("#DescriptionDiv").html(htmlData);
						$("#ProjectName").focus();
						$("#ProjectName").keyup(m_functionEnableDisableCreateProjBtn);

						if (m_bClassProject) {
							jQuery(function($){
								$("#Phone").mask("(999) 999-9999? x99999");
								$("#Zip").mask("99999");
								$("#Price").mask("$999.99");
								$("#MaxClassSize").mask("99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999-99-99         99:99 - 99:99")
								}
							});
						} else if (m_bProductProject) {
							jQuery(function($){
								$("#Price").mask("$999.99");
							});
						} else {	// m_bOnlineClassProject
							jQuery(function($){
								$("#Price").mask("$999.99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999-99-99         99:99 - 99:99")
								}
							});
						}

						m_functionEnableDisableCreateProjBtn();
					}

					var m_functionEnableDisableCreateProjBtn = function() {

						if ($("#ProjectName").val().trim().length > 0) {
							$("#CreateProjBtn").prop('disabled', false);
						} else {
							$("#CreateProjBtn").prop('disabled', true);
						}
					}

					var m_functionContinue = function() {

						// Core project type is already in m_projectType.

						// Record type of project:
						if ($("#rad1").prop("checked"))
							m_bNormalProject = true;
						else {
							m_bNormalProject = false;

							if ($("#rad2").prop("checked"))
								m_bClassProject = true;
							else if ($("#rad3").prop("checked"))
								m_bProductProject = true;
							else
								m_bOnlineClassProject = true;
						} 

						// Get the dialog DOM.
						$.ajax({

							cache: false,
							data: { 

								templateFile: "Dialogs/NewProjectDialog/newProjectDialog2"
							}, 
							dataType: "HTML",
							method: "POST",
							url: "/renderJadeSnippet"
						}).done(m_functionRenderJadeSnippetResponse2).error(errorHelper.show);
					}

					var m_functionProjectTypeSelected = function(strProjectType) {

						try {

							if (manager.userAllowedToCreateEditPurchProjs) {

								var jq;
								if (m_projectType) {

									// Remove the border around the previously selected image.
									switch(m_projectType) {
										case "Game":
											jq = $("#GameImage");
											break;
										case "Console":
											jq = $("#ConsoleImage");
											break;
										case "Web Site":
											jq = $("#WebSiteImage");
											break;
										case "HoloLens":
											jq = $("#HoloLensImage");
											break;
										case "Mapping":
											jq = $("#MappingImage");
											break;
									}
									jq.css("border", "");
								}

								m_projectType = strProjectType;

								$("#ContinueBtn").prop('disabled', false);

								// Draw a big red border around the selected Core Project Image.
								switch(m_projectType) {
									case "Game":
										jq = $("#GameImage");
										break;
									case "Console":
										jq = $("#ConsoleImage");
										break;
									case "Web Site":
										jq = $("#WebSiteImage");
										break;
									case "HoloLens":
										jq = $("#HoloLensImage");
										break;
									case "Mapping":
										jq = $("#MappingImage");
										break;
								}
								jq.css("border", "5px solid red");

							} else { // not a privileged user.

								m_projectType = strProjectType;
								m_bNormalProject = true;

								// Get the dialog DOM.
								$.ajax({

									cache: false,
									data: { 

										templateFile: "Dialogs/NewProjectDialog/newProjectDialog2"
									}, 
									dataType: "HTML",
									method: "POST",
									url: "/renderJadeSnippet"
								}).done(m_functionRenderJadeSnippetResponse2).error(errorHelper.show);
							}
						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionCreateProject = function () {

						try {

							client.unloadProject(null, true);		// In case one exists. This will ask about saving. And no callback.

							// Create project based on the new project dialog's fields--or lack thereof.
							// Call client to inject it throughout.

							var strProjectName = $("#ProjectName").val().trim();
							var strProjectDescription = $("#ProjectDescription").val().trim();
							var strProjectTags = $("#ProjectTags").val().trim();

							var exceptionRet = client.openProjectFromDB(
								// 1st parameter is 1-5 based on m_projectType: "Game"-1 "Console"-2 "Web Site"-3 "HoloLens"-4 "Mapping"-5
								["Game", "Console", "Web Site", "HoloLens", "Mapping"].indexOf(m_projectType) + 1, 
								function(){	// callback is used to set fields after async fetch of empty-ish core project from db.

									client.project.id = 0;	// just to be sure it doesn't overwrite a core project
									client.project.isCoreProject = false;

									// We could also do these things that used to be done in the BO, but we aren't--at least for now.
					                        //     comicIth.id = 0; 
	                                        //     method.id = 0; AND property.id = 0; AND event.id = 0;

									client.project.name = strProjectName;
									client.project.tags = strProjectTags;
									client.project.description = strProjectDescription;
									client.project.imageId = m_imageId;
									if (m_imageId) {
										client.project.altImagePath = '';
									}
									client.project.ownedByUserId = parseInt(g_profile["userId"], 10);

									// Now we'll add the fields to the project that will both tell the rest of the UI how to handle it and will affect how it gets saved to the database.
									client.project.specialProjectData = {
										userAllowedToCreateEditPurchProjs: manager.userAllowedToCreateEditPurchProjs,
										userCanWorkWithSystemLibsAndTypes: manager.userCanWorkWithSystemLibsAndTypes,
										ownedByUser: false,
										othersProjects: false,
										normalProject: m_bNormalProject,
										coreProject: false,
										classProject: m_bClassProject,
										productProject: m_bProductProject,
										onlineClassProject: m_bOnlineClassProject,
										comicsEdited: false,
										systemTypesEdited: false,
										openMode: 'new'
									};

									if (m_bClassProject) {

										client.project.isClass = true;

										// Retrieve class data from template fields. It's all optional until we're about to make the class active, actually.
										var strInstructorFirst = $("#InstructorFirst").val().trim();
										var strInstructorLast = $("#InstructorLast").val().trim();
										var strPhone = $("#Phone").val().trim();
										var strFacility = $("#Facility").val().trim();
										var strAddress = $("#Address").val().trim();
										var strRoom = $("#Room").val().trim();
										var strCity = $("#City").val().trim();
										var strState = $("#USState option:selected").text();
										var strZip = $("#Zip").val().trim();
										var arrWhen = [];
										for (var i = 1; i <=8; i++) {
											var str = $("#When" + i).val().trim();
											if (str.length) { 
												arrWhen.push(m_funcWhenProcess(str)); 
											} else {
												arrWhen.push({ date: '', duration: 0});
											}
										}
										var strLevel = $("#Level option:selected").text();
										var strDifficulty = $("#Difficulty option:selected").text();
										var dPrice = 0.00;
										var strPrice = $("#Price").val().trim();
										if (strPrice.length) {
											dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
										}
										var strNotes = $("#Notes").val().trim();
										var iMaxClassSize = parseInt($("#MaxClassSize").val().trim(), 10);
										var iLoanComputersAvailable = $("#cb1").prop("checked") ? 1 : 0;

										client.project.specialProjectData.classData = {
											id: 0,
											active: false,
											classDescription: strProjectDescription,
											instructorFirstName: strInstructorFirst,
											instructorLastName: strInstructorLast,
											instructorPhone: strPhone,
											facility: strFacility,
											address: strAddress,
											room: strRoom,
											city: strCity,
											state: strState,
											zip: strZip,
											schedule: arrWhen,
											level: strLevel,
											difficulty: strDifficulty,
											price: dPrice,
											classNotes: strNotes,
											maxClassSize: iMaxClassSize,
											loanComputersAvailable: iLoanComputersAvailable,
											imageId: m_imageId
										};

									} else if (m_bProductProject) {

										client.project.isProduct = true;

										// Retrieve product data from template fields. It's all optional until we're about to make the product active, actually.
										var strLevel = $("#Level option:selected").text();
										var strDifficulty = $("#Difficulty option:selected").text();
										var dPrice = 0.00;
										var strPrice = $("#Price").val().trim();
										if (strPrice.length) {
											dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
										}

										client.project.specialProjectData.productData = {
											id: 0,
											active: false,
											productDescription: strProjectDescription,
											level: strLevel,
											difficulty: strDifficulty,
											price: dPrice,
											imageId: m_imageId
										};
									} else if (m_bOnlineClassProject) {

										client.project.isOnlineClass = true;

										// Retrieve online class data from template fields. It's all optional until we're about to make the class active, actually.
										var strInstructorFirst = $("#InstructorFirst").val().trim();
										var strInstructorLast = $("#InstructorLast").val().trim();
										var strEmail = $("#Email").val().trim();
										var arrWhen = [];
										for (var i = 1; i <=8; i++) {
											var str = $("#When" + i).val().trim();
											if (str.length) { 
												arrWhen.push(m_funcWhenProcess(str)); 
											} else {
												arrWhen.push({ date: '', duration: 0});
											}
										}
										var strLevel = $("#Level option:selected").text();
										var strDifficulty = $("#Difficulty option:selected").text();
										var dPrice = 0.00;
										var strPrice = $("#Price").val().trim();
										if (strPrice.length) {
											dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
										}
										var strNotes = $("#Notes").val().trim();

										client.project.specialProjectData.onlineClassData = {
											id: 0,
											active: false,
											classDescription: strProjectDescription,
											instructorFirstName: strInstructorFirst,
											instructorLastName: strInstructorLast,
											instructorEmail: strEmail,
											schedule: arrWhen,
											level: strLevel,
											difficulty: strDifficulty,
											price: dPrice,
											classNotes: strNotes,
											imageId: m_imageId
										};
									}

						    		exceptionRet = manager.loadProject(client.project);
						    		if (exceptionRet) { throw exceptionRet; }

									client.setBrowserTabAndBtns();
								}
							);
							if (exceptionRet) { throw exceptionRet; }

							m_dialog.close();

						} catch (e) {

							errorHelper.show(e);
						}
					}

					// Privileged user enters string of form 2016/02/01.........20:00.-.20:55 
					// Below assumes user is in EST: UTC-5:00.
					// Returns { date: '2016-02-02T01:00:00+00:00', duration: 3360000}.
					// 		date is start time in UTC.
					// 		duration is in ms, inclusive (i.e., this example is 56 minutes long).
					// If any parts (date, duration) are missing or invalid, returns { date: '', duration: 0}.
					// Due to masking, we can have only numbers, but we can have numbers out of range, etc. (Like 34:00 - 51:00.)
					var m_funcWhenProcess = function(strWhen) {

						var strDate = strWhen.substring(0, 10);		// Let substring return junky results if strWhen is of insufficient length.
						var strFrom = strWhen.substring(19, 24);
						var strThru = strWhen.substring(27, 32);

						var mntHypo1 = moment('2016-01-01T' + strFrom);	// to check validity of strFrom
						var mntHypo2 = moment('2016-01-01T' + strThru);	// to check validity of strThru
						var mntDate = moment(strDate, "YYYY-MM-DD");	// to check validty of strDate
						var bValidMntDate = mntDate.isValid();
						var bValidMntHypo1 = mntHypo1.isValid();
						var bValidMntHypo2 = mntHypo2.isValid();

						if (bValidMntDate && bValidMntHypo1 && bValidMntHypo2 /*&& mntHypo2.isAfter(mntHypo1)*/) {
							var mntDateFromUTC = moment(strDate + 'T' + strFrom).utc();	// Actual class start datetime with utc flag set.
							return { date: mntDateFromUTC.format(), duration: (mntHypo2.diff(mntHypo1) + 60000)};	// Add 60000 to account for inclusive thru time.
						}

						return { date: '', duration: 0};
					}

					// 3 functions to handle the Image changing link clicks.
					var m_functionSearchClick = function () {

						try {

							var exceptionRet = client.showImageSearchDialog(true, m_functionSetImageSrc);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch(e) {

							errorHelper.show(e);
						}
					}
					
					var m_functionURLClick = function () {

						try {

							var exceptionRet = client.showImageURLDialog(true, m_functionSetImageSrc);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch(e) {

							errorHelper.show(e);
						}
					}
					
					var m_functionDiskClick = function () {

						try {

							var exceptionRet = client.showImageDiskDialog(true, m_functionSetImageSrc);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch(e) {

							errorHelper.show(e);
						}
					}

					// Display the chosen image.
					var m_functionSetImageSrc = function (imageId) {

						m_imageId = imageId;
						$("#ProjectImage").attr("src", resourceHelper.toURL("resources", m_imageId, "image"));
					}
				} catch (e) { errorHelper.show(e); }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_imageId = 0;
				var m_projectType = null;
				var m_bNormalProject = true;
				var m_bClassProject = false;
				var m_bProductProject = false;
				var m_bOnlineClassProject = false;
				var m_arrayAvailProjTypes;
			};

			// Return the constructor function as the module object.
			return functionNewProjectDialog;

		} catch (e) { errorHelper.show(e); }
	});
