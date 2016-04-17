////////////////////////////////////
// AZSavePPDataDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the NewProjectDialog constructor function.
			var functionAZSavePPDataDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function(jsPPData) {

						try {

							// Save off the data to be edited.
							m_jsPPData = jsPPData;

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/AZSavePPDataDialog/AZSavePPDataDialog"
								}, 
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionRenderJadeSnippetResponse).error(errorHelper.show);

							return null;

						} catch (e) { return e; }
					};

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the TypesDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "Save Project Data",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		id: "ValidateBtn",
					            		label: "Pre-Validate",
					            		cssClass: "btn-primary"
					            	},
					            	{
					            		id: "SaveProjectBtn",
					            		label: "Save",
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

							// Set project image.
							m_functionSetImageSrc(m_jsPPData.imageId);

							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);

							$("#ValidateBtn").click(m_functionValidate);
							$("#SaveProjectBtn").click(m_functionSaveProject);

							if (m_jsPPData.hasOwnProperty("facility")) {

								m_templateToGet = 'Dialogs/NewProjectDialog/classDetails.jade';

							} else if (m_jsPPData.hasOwnProperty("productDescription")) {

								m_templateToGet = 'Dialogs/NewProjectDialog/productDetails.jade';

							} else {

								m_templateToGet = 'Dialogs/NewProjectDialog/onlineClassDetails.jade';
							}

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: m_templateToGet
								}, 
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionRenderJadeSnippetResponse2).error(errorHelper.show);

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
						$("#ProjectName").val(m_jsPPData.name);
						$("#ProjectName")[0].setSelectionRange(0, 0);	// The [0] changes jQuery object to DOM element.

						$("#ProjectDescription").val(m_jsPPData.description);
						$("#ProjectTags").val(m_jsPPData.tags);

						if (m_templateToGet.includes("class")) {

							jQuery(function($){
								$("#Phone").mask("(999) 999-9999? x99999");
								$("#Zip").mask("99999");
								$("#Price").mask("$999.99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999-99-99         99:99 - 99:99")
								}
							});
							$("#ProjectDescription").val(m_jsPPData.classDescription);
							$("#InstructorFirst").val(m_jsPPData.instructorFirstName);
							$("#InstructorLast").val(m_jsPPData.instructorLastName);
							$("#Phone").val(m_jsPPData.instructorPhone);
							$("#Facility").val(m_jsPPData.facility);
							$("#Address").val(m_jsPPData.address);
							$("#Room").val(m_jsPPData.room);
							$("#City").val(m_jsPPData.city);
							// state combo
							if(m_jsPPData.state.length > 0) {
								$('#State > option').each(
									function() {
 										if ($(this).text() === m_jsPPData.state)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							$("#Zip").val(m_jsPPData.zip);
							// when array
							var jsWhen = JSON.parse(m_jsPPData.schedule);
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = jsWhen[i-1];	// {date: 'UTC datetime including from', duration: in ms}
								$("#When" + i).val(m_getWhenString(whenIth));
							}
							// level combo
							if(m_jsPPData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === m_jsPPData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(m_jsPPData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === m_jsPPData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// formatted price
							$("#Price").val(m_jsPPData.price.dollarFormat());
							$("#Notes").val(m_jsPPData.classNotes);
						
						} else if (m_templateToGet.includes("product")) {

							jQuery(function($){
								$("#Price").mask("$999.99");
							});
							$("#ProjectDescription").val(m_jsPPData.productDescription);
							// level combo
							if(m_jsPPData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === m_jsPPData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(m_jsPPData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === m_jsPPData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// formatted price
							$("#Price").val(m_jsPPData.price.dollarFormat());
						
						} else {

							jQuery(function($){
								$("#Price").mask("$999.99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999-99-99         99:99 - 99:99")
								}
							});
							$("#ProjectDescription").val(m_jsPPData.classDescription);
							$("#InstructorFirst").val(m_jsPPData.instructorFirstName);
							$("#InstructorLast").val(m_jsPPData.instructorLastName);
							$("#Email").val(m_jsPPData.instructorEmail);
							// when array
							var jsWhen = JSON.parse(m_jsPPData.schedule);
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = jsWhen[i-1];	// {date: 'UTC datetime including from', duration: in ms}
								$("#When" + i).val(m_getWhenString(whenIth));
							}
							// level combo
							if(m_jsPPData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === m_jsPPData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(m_jsPPData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === m_jsPPData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// formatted price
							$("#Price").val(m_jsPPData.price.dollarFormat());
							$("#Notes").val(m_jsPPData.classNotes);
						}
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

					var m_functionValidate = function () {

				        // The following fields are required:
				        //   general:
				        //
				        //   class:
				        // 		Will need class schedule validation:
				        //    		Any date that's entered must be a valid datetime.
				        //    		Any date must have valid duration.
				        //    		No gaps allowed in the array.
				        //    		Dates must be in ascending order--think about two classes happening on the same day.
				        //
				        //   online class:
				        //		Same schedule validation as for class.
				        //
				        //   product:
				        //
				        // There must be an image with imageId !== 0.

						try {



						} catch (e) { errorHelper.show(e); }
					}

					var m_functionSaveProject = function () {

						try {

							if (!m_functionValidate()) { return; }

							var strProjectDescription = $("#ProjectDescription").val().trim();

							// If there was a class or product or online class snippet in the dialog, capture that info into the project.
							if (m_templateToGet.includes("class")) {

								var strInstructorFirst = $("#InstructorFirst").val().trim();
								var strInstructorLast = $("#InstructorLast").val().trim();
								var strPhone = $("#Phone").val().trim();
								var strFacility = $("#Facility").val().trim();
								var strAddress = $("#Address").val().trim();
								var strRoom = $("#Room").val().trim();
								var strCity = $("#City").val().trim();
								var strState = $("#State option:selected").text();
								var strZip = $("#Zip").val().trim();
								var arrWhen = [];
								for (var i = 1; i <=8; i++) {
									var str = $("#When" + i).val().trim();
									if (str.length) { 
										arrWhen.push(m_funcWhenProcess(str)); 
									} else {
										arrWhen.push({ date: '', from: '', thru: ''});
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

								// m_jsPPData = {
								// 	active: false,
								// 	classDescription: strProjectDescription,
								// 	instructorFirstName: strInstructorFirst,
								// 	instructorLastName: strInstructorLast,
								// 	instructorPhone: strPhone,
								// 	facility: strFacility,
								// 	address: strAddress,
								// 	room: strRoom,
								// 	city: strCity,
								// 	state: strState,
								// 	zip: strZip,
								// 	schedule: arrWhen,
								// 	level: strLevel,
								// 	difficulty: strDifficulty,
								// 	price: dPrice,
								// 	classNotes: strNotes
								// };
							} else if (m_templateToGet.includes("product")) {

								var strLevel = $("#Level option:selected").text();
								var strDifficulty = $("#Difficulty option:selected").text();
								var dPrice = 0.00;
								var strPrice = $("#Price").val().trim();
								if (strPrice.length) {
									dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
								}

								// m_jsPPData = {
								// 	active: false,
								// 	productDescription: strProjectDescription,
								// 	level: strLevel,
								// 	difficulty: strDifficulty,
								// 	price: dPrice
								// };
							} else {

								var strInstructorFirst = $("#InstructorFirst").val().trim();
								var strInstructorLast = $("#InstructorLast").val().trim();
								var strEmail = $("#Email").val().trim();
								var arrWhen = [];
								for (var i = 1; i <=8; i++) {
									var str = $("#When" + i).val().trim();
									if (str.length) { 
										arrWhen.push(m_funcWhenProcess(str)); 
									} else {
										arrWhen.push({ date: '', from: '', thru: ''});
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

								// m_jsPPData = {
								// 	active: false,
								// 	classDescription: strProjectDescription,
								// 	instructorFirstName: strInstructorFirst,
								// 	instructorLastName: strInstructorLast,
								// 	instructorEmail: strEmail,
								// 	schedule: arrWhen,
								// 	level: strLevel,
								// 	difficulty: strDifficulty,
								// 	price: dPrice,
								// 	classNotes: strNotes
								// };
							}

							// exceptionRet = client.saveProject();
							// if (exceptionRet) { throw exceptionRet; }

						} catch(e) { errorHelper.show(e); }
					}

					// Privileged user enters string of form 2016/02/01.........20:00.-.20:55 
					// Below assumes user is in EST: UTC-5:00.
					// Returns { date: '2016-02-02T01:00:00+00:00', duration: 3360000}.
					// 		date is start time in UTC.
					// 		duration is in ms, inclusive (i.e., this example is 56 minutes long).
					// If any parts (date, from, thru) are missing or invalid, returns { date: '', duration: 0}.
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

						if (bValidMntDate && bValidMntHypo1 && bValidMntHypo2 && mntHypo2.isAfter(mntHypo1)) {
							var mntDateFromUTC = moment(strDate + 'T' + strFrom).utc();	// Actual class start datetime with utc flag set.
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

						m_jsPPData.imageId = imageId;
						$("#ProjectImage").attr("src", resourceHelper.toURL("resources", imageId, "image"));
					}
				} catch (e) { errorHelper.show(e.message); }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_jsPPData;
				var m_templateToGet;
			};

			// Return the constructor function as the module object.
			return functionAZSavePPDataDialog;

		} catch (e) { errorHelper.show(e.message); }
	});
