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
					            		id: "SaveLocallyBtn",
					            		icon: 'glyphicon glyphicon-download-alt',
					            		label: "Save Project Locally",
					            		cssClass: "hidden"
					            	},
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
							m_holdProjName = client.project.name;

							// Set project image.
							if (client.project.altImagePath.length) {

								$("#ProjectImage").attr("src", client.project.altImagePath);
							
							} else {

								m_functionSetImageSrc(client.project.imageId);
							}
							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);

							$("#SaveProjectBtn").click(m_functionSaveProject);

							if (g_profile.can_edit_base_and_system_libraries_and_types_therein) {

								$("#SaveLocallyBtn").click(m_functionSaveLocally);
								$("#SaveLocallyBtn").removeClass('hidden');
							}

							$("#ProjectName").keyup(m_functionNameBlur);
							$("#ProjectName").val(client.project.name);

							$("#ProjectDescription").val(client.project.description);
							$("#ProjectTags").val(client.project.tags);

							$("#ProjectDescription").blur(m_functionDescriptionBlur);
							$("#ProjectTags").blur(m_functionTagsBlur);

							m_setStateSaveAsBtn();

							// If this new project is a Class or Product, fetch the specific jade/html template to insert into the dialog.
							var templateToGet = null;
							if (client.project.isClass) {

								templateToGet = 'Dialogs/NewProjectDialog/classDetails.jade';

							} else if (client.project.isProduct) {

								templateToGet = 'Dialogs/NewProjectDialog/productDetails.jade';

							} else if (client.project.isOnlineClass) {

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
						$("#ProjectName").val(client.project.name);
						$("#ProjectName")[0].setSelectionRange(0, 0);	// The [0] changes jQuery object to DOM element.

						$("#ProjectDescription").val(client.project.description);
						$("#ProjectTags").val(client.project.tags);

						$("#ProjectDescription").blur(m_functionDescriptionBlur);
						$("#ProjectTags").blur(m_functionTagsBlur);

						if (client.project.specialProjectData.classProject) {
							jQuery(function($){
								$("#Phone").mask("(999) 999-9999? x99999");
								$("#Zip").mask("99999");
								$("#Price").mask("$999.99");
								$("#MaxClassSize").mask("99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999-99-99         99:99 - 99:99")
								}
							});
							$("#ProjectDescription").val(client.project.specialProjectData.classData.classDescription);
							$("#InstructorFirst").val(client.project.specialProjectData.classData.instructorFirstName);
							$("#InstructorLast").val(client.project.specialProjectData.classData.instructorLastName);
							$("#Phone").val(client.project.specialProjectData.classData.instructorPhone);
							$("#Facility").val(client.project.specialProjectData.classData.facility);
							$("#Address").val(client.project.specialProjectData.classData.address);
							$("#Room").val(client.project.specialProjectData.classData.room);
							$("#City").val(client.project.specialProjectData.classData.city);
							// state combo
							if(client.project.specialProjectData.classData.state.length > 0) {
								$('#USState > option').each(
									function() {
 										if ($(this).text() === client.project.specialProjectData.classData.state)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							$("#Zip").val(client.project.specialProjectData.classData.zip);
							// when array
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = client.project.specialProjectData.classData.schedule[i-1];	// {date: 'UTC datetime including from', duration: in ms}
								$("#When" + i).val(m_getWhenString(whenIth));
							}
							// level combo
							if(client.project.specialProjectData.classData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === client.project.specialProjectData.classData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(client.project.specialProjectData.classData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === client.project.specialProjectData.classData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// formatted price
							$("#Price").val(client.project.specialProjectData.classData.price.dollarFormat());
							$("#Notes").val(client.project.specialProjectData.classData.classNotes);
							var iMax = client.project.specialProjectData.classData.maxClassSize;
							if (iMax) {

								var strMax100 = (iMax + 100).toString();
								$("#MaxClassSize").val(strMax100.substr(1));
							}
							$("#cb1").prop("checked", client.project.specialProjectData.classData.loanComputersAvailable);
						
						} else if (client.project.specialProjectData.productProject) {
							jQuery(function($){
								$("#Price").mask("$999.99");
							});
							$("#ProjectDescription").val(client.project.specialProjectData.productData.productDescription);
							// level combo
							if(client.project.specialProjectData.productData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === client.project.specialProjectData.productData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(client.project.specialProjectData.productData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === client.project.specialProjectData.productData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// formatted price
							$("#Price").val(client.project.specialProjectData.productData.price.dollarFormat());
						
						} else if (client.project.specialProjectData.onlineClassProject) {
							jQuery(function($){
								$("#Price").mask("$999.99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999-99-99         99:99 - 99:99")
								}
							});
							$("#ProjectDescription").val(client.project.specialProjectData.onlineClassData.classDescription);
							$("#InstructorFirst").val(client.project.specialProjectData.onlineClassData.instructorFirstName);
							$("#InstructorLast").val(client.project.specialProjectData.onlineClassData.instructorLastName);
							$("#Email").val(client.project.specialProjectData.onlineClassData.instructorEmail);
							// when array
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = client.project.specialProjectData.onlineClassData.schedule[i-1];	// {date: 'UTC datetime including from', duration: in ms}
								$("#When" + i).val(m_getWhenString(whenIth));
							}
							// level combo
							if(client.project.specialProjectData.onlineClassData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === client.project.specialProjectData.onlineClassData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(client.project.specialProjectData.onlineClassData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === client.project.specialProjectData.onlineClassData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// formatted price
							$("#Price").val(client.project.specialProjectData.onlineClassData.price.dollarFormat());
							$("#Notes").val(client.project.specialProjectData.onlineClassData.classNotes);
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
						if (txt !== client.project.name) {

							m_holdProjName = txt;
							m_setStateSaveAsBtn();
						}
					}

					var m_functionDescriptionBlur = function() {

						var txt = $("#ProjectDescription").val().trim();
						if (txt !== client.project.description) {

							client.project.description = txt;
							client.setBrowserTabAndBtns();
							m_setStateSaveAsBtn();
						}
					}

					var m_functionTagsBlur = function() {

						var txt = $("#ProjectTags").val().trim();
						if (txt !== client.project.tags) {

							client.project.tags = txt;
							client.setBrowserTabAndBtns();
							m_setStateSaveAsBtn();
						}
					}

					var m_functionSaveLocally = function () {

						try {

							var exceptionRet = manager.save();
							if (exceptionRet) {
								errorHelper.show(exceptionRet);
								return;
							}

							var jsonProjectArray = JSON.stringify(client.project, undefined, 4).split('\r\n');
							var file = new File(jsonProjectArray, m_holdProjName + ".json", {type: "text/plain;charset=utf-8"});
							saveAs(file);

						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionSaveProject = function () {

						try {

							// Set the project name that we hold in a method scope var in order to prevent saving a 2nd project
							// with same name due to user typing it in and closing the dialog once; then coming back.
							client.project.name = m_holdProjName;
							var strProjectDescription = $("#ProjectDescription").val().trim();

							// If there was a class or product or online class snippet in the dialog, capture that info into the project.
							if (client.project.isClass) {

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
									imageId: client.project.imageId,
									maxClassSize: iMaxClassSize,
									loanComputersAvailable: iLoanComputersAvailable
								};
							} else if (client.project.isProduct) {

								// Retrieve product data from template fields. It's all optional until we're about to make the product active, actually.
								var strLevel = $("#Level option:selected").text();
								var strDifficulty = $("#Difficulty option:selected").text();
								var dPrice = 0.00;
								var strPrice = $("#Price").val().trim();
								if (strPrice.length) {
									dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
								}

								client.project.specialProjectData.productData = {
									active: false,
									productDescription: strProjectDescription,
									level: strLevel,
									difficulty: strDifficulty,
									price: dPrice,
									imageId: client.project.imageId
								};
							} else if (client.project.isOnlineClass) {

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
									imageId: client.project.imageId
								};
							}

							client.setBrowserTabAndBtns();

							// Save to DB and load into manager.
							exceptionRet = client.saveProjectToDB();
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

						client.project.imageId = imageId;
						client.project.altImagePath = '';
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
