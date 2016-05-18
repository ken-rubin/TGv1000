////////////////////////////////////
// SaveProjectAsDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the NewProjectDialog constructor function.
			var functionSaveProjectAsDialog = function () {

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

									templateFile: "Dialogs/SaveProjectAsDialog/saveProjectAsDialog"
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

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the TypesDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "Save Project",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		id: "SaveProjectBtn",
					            		label: "Save Project",
					            		hotkey: 13,
					            		cssClass: "btn-primary"
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
					            draggable: true,
					            onshown: m_functionOnShownDialog
					        });
						} catch (e) { errorHelper.show(e); }
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							$(".tt-selector .btn-default").powerTip({
								smartPlacement: true
							});

							// Save the dailog object reference.
							m_dialog = dialogItself;
							m_holdProjName = manager.projectData.name;

							// Set project image.
							if (manager.projectData.altImagePath.length) {

								$("#ProjectImage").attr("src", manager.projectData.altImagePath);
							
							} else {

								m_functionSetImageSrc(manager.projectData.imageId);
							}
							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);

							$("#SaveProjectBtn").click(m_functionSaveProject);

							$("#ProjectName").keyup(m_functionNameBlur);
							$("#ProjectName").val(manager.projectData.name);

							$("#ProjectDescription").val(manager.projectData.description);
							$("#ProjectTags").val(manager.projectData.tags);

							$("#ProjectDescription").blur(m_functionDescriptionBlur);
							$("#ProjectTags").blur(m_functionTagsBlur);

							m_setStateSaveAsBtn();

							// If this new project is a Class or Product, fetch the specific jade/html template to insert into the dialog.
							var templateToGet = null;
							if (manager.projectData.isClass) {

								templateToGet = 'Dialogs/NewProjectDialog/classDetails.jade';

							} else if (manager.projectData.isProduct) {

								templateToGet = 'Dialogs/NewProjectDialog/productDetails.jade';

							} else if (manager.projectData.isOnlineClass) {

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
								}).done(m_functionRenderJadeSnippetResponse2).error(errorHelper.show);
							}
						} catch (e) { errorHelper.show(e.message); }
					};

					var m_functionRenderJadeSnippetResponse2 = function(htmlData) {

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

						$("#DescriptionDiv").html(htmlData);
						$("#ProjectName").focus();
						$("#ProjectName").keyup(m_functionNameBlur);
						$("#ProjectName").val(manager.projectData.name);
						$("#ProjectName")[0].setSelectionRange(0, 0);	// The [0] changes jQuery object to DOM element.

						$("#ProjectDescription").val(manager.projectData.description);
						$("#ProjectTags").val(manager.projectData.tags);

						$("#ProjectDescription").blur(m_functionDescriptionBlur);
						$("#ProjectTags").blur(m_functionTagsBlur);

						if (manager.projectData.specialProjectData.classProject) {
							jQuery(function($){
								$("#Phone").mask("(999) 999-9999? x99999");
								$("#Zip").mask("99999");
								$("#Price").mask("$999.99");
								$("#MaxClassSize").mask("99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999-99-99         99:99 - 99:99")
								}
							});
							$("#ProjectDescription").val(manager.projectData.specialProjectData.classData.classDescription);
							$("#InstructorFirst").val(manager.projectData.specialProjectData.classData.instructorFirstName);
							$("#InstructorLast").val(manager.projectData.specialProjectData.classData.instructorLastName);
							$("#Phone").val(manager.projectData.specialProjectData.classData.instructorPhone);
							$("#Facility").val(manager.projectData.specialProjectData.classData.facility);
							$("#Address").val(manager.projectData.specialProjectData.classData.address);
							$("#Room").val(manager.projectData.specialProjectData.classData.room);
							$("#City").val(manager.projectData.specialProjectData.classData.city);
							// state combo
							if(manager.projectData.specialProjectData.classData.state.length > 0) {
								$('#USState > option').each(
									function() {
 										if ($(this).text() === manager.projectData.specialProjectData.classData.state)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							$("#Zip").val(manager.projectData.specialProjectData.classData.zip);
							// when array
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = manager.projectData.specialProjectData.classData.schedule[i-1];	// {date: 'UTC datetime including from', duration: in ms}
								$("#When" + i).val(m_getWhenString(whenIth));
							}
							// level combo
							if(manager.projectData.specialProjectData.classData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === manager.projectData.specialProjectData.classData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(manager.projectData.specialProjectData.classData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === manager.projectData.specialProjectData.classData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// formatted price
							$("#Price").val(manager.projectData.specialProjectData.classData.price.dollarFormat());
							$("#Notes").val(manager.projectData.specialProjectData.classData.classNotes);
							var iMax = manager.projectData.specialProjectData.classData.maxClassSize;
							if (iMax) {

								var strMax100 = (iMax + 100).toString();
								$("#MaxClassSize").val(strMax100.substr(1));
							}
							$("#cb1").prop("checked", manager.projectData.specialProjectData.classData.loanComputersAvailable);
						
						} else if (manager.projectData.specialProjectData.productProject) {
							jQuery(function($){
								$("#Price").mask("$999.99");
							});
							$("#ProjectDescription").val(manager.projectData.specialProjectData.productData.productDescription);
							// level combo
							if(manager.projectData.specialProjectData.productData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === manager.projectData.specialProjectData.productData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(manager.projectData.specialProjectData.productData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === manager.projectData.specialProjectData.productData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// formatted price
							$("#Price").val(manager.projectData.specialProjectData.productData.price.dollarFormat());
						
						} else if (manager.projectData.specialProjectData.onlineClassProject) {
							jQuery(function($){
								$("#Price").mask("$999.99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999-99-99         99:99 - 99:99")
								}
							});
							$("#ProjectDescription").val(manager.projectData.specialProjectData.onlineClassData.classDescription);
							$("#InstructorFirst").val(manager.projectData.specialProjectData.onlineClassData.instructorFirstName);
							$("#InstructorLast").val(manager.projectData.specialProjectData.onlineClassData.instructorLastName);
							$("#Email").val(manager.projectData.specialProjectData.onlineClassData.instructorEmail);
							// when array
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = manager.projectData.specialProjectData.onlineClassData.schedule[i-1];	// {date: 'UTC datetime including from', duration: in ms}
								$("#When" + i).val(m_getWhenString(whenIth));
							}
							// level combo
							if(manager.projectData.specialProjectData.onlineClassData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === manager.projectData.specialProjectData.onlineClassData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(manager.projectData.specialProjectData.onlineClassData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === manager.projectData.specialProjectData.onlineClassData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// formatted price
							$("#Price").val(manager.projectData.specialProjectData.onlineClassData.price.dollarFormat());
							$("#Notes").val(manager.projectData.specialProjectData.onlineClassData.classNotes);
						}

						m_setStateSaveAsBtn();
					}

					var m_getWhenString = function(whenIth) {

						// whenIth is JS object of form { date: 'utc datetime of class start', duraction: in ms}.
						// date could be ''. Duration could be 0. If one of them is, so is the other.
						// If non-empty, return string like '2016/02/01.........20:00.-.20:55' in user's timezone.
						// If empty, return ''.
						if (whenIth.date.length === 0) { return ''; }

						var mntDate = moment(whenIth.date).local();
						var strDate = mntDate.format('YYYY-MM-DD');
						var strFrom = mntDate.format('HH:mm');
						var mntEndDate = mntDate.add(whenIth.duration - 60000, 'ms');
						var strThru = mntEndDate.format('HH:mm');
						return strDate + '         ' + strFrom + ' - ' + strThru;
					}

					var m_setStateSaveAsBtn = function () {

						var status = client.getProjectStatus(m_holdProjName);
						if (!status.allRequiredFieldsFilled) {
							$("#SaveProjectBtn").prop("disabled", true);
						} else {
							$("#SaveProjectBtn").prop("disabled", false);
						}
					}

					var m_functionNameBlur = function() {

						var txt = $("#ProjectName").val().trim();
						if (txt !== manager.projectData.name) {

							m_holdProjName = txt;
							m_setStateSaveAsBtn();
						}
					}

					var m_functionDescriptionBlur = function() {

						var txt = $("#ProjectDescription").val().trim();
						if (txt !== manager.projectData.description) {

							manager.projectData.description = txt;
							client.setBrowserTabAndBtns();
							m_setStateSaveAsBtn();
						}
					}

					var m_functionTagsBlur = function() {

						var txt = $("#ProjectTags").val().trim();
						if (txt !== manager.projectData.tags) {

							manager.projectData.tags = txt;
							client.setBrowserTabAndBtns();
							m_setStateSaveAsBtn();
						}
					}

					var m_functionSaveProject = function () {

						try {

							// Set the project name that we hold in a method scope var in order to prevent saving a 2nd project
							// with same name due to user typing it in and closing the dialog once; then coming back.
							manager.projectData.name = m_holdProjName;
							var strProjectDescription = $("#ProjectDescription").val().trim();

							// If there was a class or product or online class snippet in the dialog, capture that info into the project.
							if (manager.projectData.isClass) {

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

								manager.projectData.specialProjectData.classData = {
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
									imageId: manager.projectData.imageId,
									maxClassSize: iMaxClassSize,
									loanComputersAvailable: iLoanComputersAvailable
								};
							} else if (manager.projectData.isProduct) {

								// Retrieve product data from template fields. It's all optional until we're about to make the product active, actually.
								var strLevel = $("#Level option:selected").text();
								var strDifficulty = $("#Difficulty option:selected").text();
								var dPrice = 0.00;
								var strPrice = $("#Price").val().trim();
								if (strPrice.length) {
									dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
								}

								manager.projectData.specialProjectData.productData = {
									active: false,
									productDescription: strProjectDescription,
									level: strLevel,
									difficulty: strDifficulty,
									price: dPrice,
									imageId: manager.projectData.imageId
								};
							} else if (manager.projectData.isOnlineClass) {

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

								manager.projectData.specialProjectData.onlineClassData = {
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
									imageId: manager.projectData.imageId
								};
							}

							client.setBrowserTabAndBtns();

							exceptionRet = client.saveProjectToDB(false);
							if (exceptionRet) { throw exceptionRet; }

						} catch(e) { errorHelper.show(e); }
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

						if (bValidMntDate && bValidMntHypo1 && bValidMntHypo2/* && mntHypo2.isAfter(mntHypo1)*/) {
							var mntDateFromUTC = moment.utc(moment(strDate + 'T' + strFrom));	// Actual class start datetime with utc flag set.
							return { date: mntDateFromUTC.format(), duration: (mntHypo2.diff(mntHypo1) + 60000)};	// Add 60000 to account for inclusive thru time.
						}

						return { date: '', duration: 0};
					}

					// 3 functions to handle the Image changing link clicks.
					var m_functionSearchClick = function () {

						try {

							var exceptionRet = client.showImageSearchDialog(true, m_functionSetImageSrc);
							if (exceptionRet) { throw exceptionRet; }

						} catch(e) { errorHelper.show(e); }
					}
					
					var m_functionURLClick = function () {

						try {

							var exceptionRet = client.showImageURLDialog(true, m_functionSetImageSrc);
							if (exceptionRet) { throw exceptionRet; }

						} catch(e) { errorHelper.show(e); }
					}
					
					var m_functionDiskClick = function () {
						
						try {

							var exceptionRet = client.showImageDiskDialog(true, m_functionSetImageSrc);
							if (exceptionRet) { throw exceptionRet; }

						} catch(e) { errorHelper.show(e); }
					}

					// Display the chosen image.
					var m_functionSetImageSrc = function (imageId) {

						manager.projectData.imageId = imageId;
						manager.projectData.altImagePath = '';
						$("#ProjectImage").attr("src", resourceHelper.toURL("resources", imageId, "image"));
						m_setStateSaveAsBtn();
					}
				} catch (e) { errorHelper.show(e.message); }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_holdProjName = "";
			};

			// Return the constructor function as the module object.
			return functionSaveProjectAsDialog;

		} catch (e) { errorHelper.show(e.message); }
	});
