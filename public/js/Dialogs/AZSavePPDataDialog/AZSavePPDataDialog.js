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
							m_iActive = m_jsPPData.active;
							m_iId = m_jsPPData.id;
							m_iBaseProjectId = m_jsPPData.baseProjectId;

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
					            		label: "Pre-Validate Fields",
					            		cssClass: "btn-primary"
					            	},
					            	{
					            		id: "SaveProjectBtn",
					            		label: "Save w/o Changing Active Status",
					            		cssClass: "btn-primary"
					            	},
					            	{
					            		id: "SaveChangeProjectBtn",
					            		label: "xxx",
					            		cssClass: "btn-primary"
					            	},
					            	{
						                label: "Close w/o Changing Anything",
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
							m_iImageId = m_jsPPData.imageId;
							m_functionSetImageSrc(m_iImageId);

							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);

							$("#ValidateBtn").click(m_functionValidate);
							$("#SaveProjectBtn").click(m_functionSaveProject);
							$("#SaveChangeProjectBtn").click(m_functionSaveToggleProject);

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

						$("#BuyHeader").empty();
						var strNewBuyHeader = '';
						if (m_templateToGet.includes("class")) {

							if (m_iActive === 1) {

								$("#SaveChangeProjectBtn").text("Deactivate and Save");
								strNewBuyHeader = '<h4 style="margin-top:-5px;">Here are the details for the <b>ACTIVE</b> Class you selected.</h4>';
								strNewBuyHeader += '<h5>You may <i>deactivate</i> the class or just change its details and save it. ';
								strNewBuyHeader += "Pre-validating to check your changes is a good idea, but we'll still validate before saving--even if you deactivate the class. ";
								if (m_jsPPData.numBuyers === 1) {
									strNewBuyHeader += "<b>FYI</b>: there is 1 person enrolled in the class.</h5>";
								} else {
									strNewBuyHeader += "<b>FYI</b>: there are " + m_jsPPData.numBuyers + " people enrolled in the class.</h5>";
								}

							} else {

								$("#SaveChangeProjectBtn").text("Activate and Save");
								strNewBuyHeader = '<h4 style="margin-top:-5px;">Here are the details for the <b>INACTIVE</b> Class you selected.</h4>';
								strNewBuyHeader += '<h5>You may <i>activate</i> the class or just change its details and save it. ';
								strNewBuyHeader += "Pre-validating to check your changes is a good idea, but we'll always validate before saving--even if you don't.</h5>";
							}

							$("#BuyHeader").append(strNewBuyHeader);

							jQuery(function($){
								$("#Phone").mask("(999) 999-9999? x99999");
								$("#Zip").mask("99999");
								$("#Price").mask("$999.99");
								$("#MaxClassSize").mask("99");
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
								$('#USState > option').each(
									function() {
 										if ($(this).text() === m_jsPPData.state)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							$("#Zip").val(m_jsPPData.zip);
							// when array
							m_jsPPData.schedule = JSON.parse(m_jsPPData.schedule);
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = m_jsPPData.schedule[i-1];	// {date: 'UTC datetime including from', duration: in ms}
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
							$("#MaxClassSize").val(m_jsPPData.maxClassSize);
							$("#cb1").prop("checked", m_jsPPData.loanComputersAvailable);
						
						} else if (m_templateToGet.includes("product")) {

							if (m_iActive === 1) {

								$("#SaveChangeProjectBtn").text("Deactivate and Save");
								strNewBuyHeader = '<h4 style="margin-top:-5px;">Here are the details for the <b>ACTIVE</b> Product you selected.</h4>';
								strNewBuyHeader += '<h5>You may <i>deactivate</i> the product or just change its details and save it. ';
								strNewBuyHeader += "Pre-validating to check your changes is a good idea, but we'll still validate before saving--even if you deactivate. ";
								if (m_jsPPData.numBuyers === 1) {
									strNewBuyHeader += "<b>FYI</b>: there is 1 person who has already bought this product.</h5>";
								} else {
									strNewBuyHeader += "<b>FYI</b>: there are " + m_jsPPData.numBuyers + " people who have already bought this product.</h5>";
								}

							} else {

								$("#SaveChangeProjectBtn").text("Activate and Save");
								strNewBuyHeader = '<h4 style="margin-top:-5px;">Here are the details for the <b>INACTIVE</b> Product you selected.</h4>';
								strNewBuyHeader += '<h5>You may <i>activate</i> the product or just change its details and save it. ';
								strNewBuyHeader += "Pre-validating to check your changes is a good idea, but we'll always validate before saving--even if you don't.</h5>";
							}

							$("#BuyHeader").append(strNewBuyHeader);

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

							if (m_iActive === 1) {

								$("#SaveChangeProjectBtn").text("Deactivate and Save");
								strNewBuyHeader = '<h4 style="margin-top:-5px;">Here are the details for the <b>ACTIVE</b> Online Class you selected.</h4>';
								strNewBuyHeader += '<h5>You may <i>deactivate</i> the class or just change its details and save it. ';
								strNewBuyHeader += "Pre-validating to check your changes is a good idea, but we'll still validate before saving--even if you deactivate.";
								if (m_jsPPData.numBuyers === 1) {
									strNewBuyHeader += "<b>FYI</b>: there is 1 person enrolled in the class.</h5>";
								} else {
									strNewBuyHeader += "<b>FYI</b>: there are " + m_jsPPData.numBuyers + " people enrolled in the class.</h5>";
								}

							} else {

								$("#SaveChangeProjectBtn").text("Activate and Save");
								strNewBuyHeader = '<h4 style="margin-top:-5px;">Here are the details for the <b>INACTIVE</b> Online Class you selected.</h4>';
								strNewBuyHeader += '<h5>You may <i>activate</i> the class or just change its details and save it. ';
								strNewBuyHeader += "Pre-validating to check your changes is a good idea, but we'll always validate before saving--even if you don't.</h5>";
							}

							$("#BuyHeader").append(strNewBuyHeader);

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
							m_jsPPData.schedule = JSON.parse(m_jsPPData.schedule);
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = m_jsPPData.schedule[i-1];	// {date: 'UTC datetime including from', duration: in ms}
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

					var m_functionValidate = function (event, bSaving) {

				        //   general:
				        //      imageId mb > 0
				        //
				        //   class:
				        // 		Will need class schedule validation:
				        //      All fields except room and dates beyond final class are required.
				        //
				        //   online class:
				        //		Same schedule validation as for class.
				        //      All fields except room and dates beyond final class are required.
				        //
				        //   product:
				        //      All fields are required.
				        //

				        m_functionGetAllFieldsFromBrowser();

				        bSaving = bSaving || false;

						try {

							var bValid = true;
							m_strProductType = m_templateToGet.includes("class") ? "class" : m_templateToGet.includes("product") ? "product" : "onlineClass";
							var htmlError = "";

							if (!m_iImageId) { htmlError += "<br><span>You must choose a real image, not our stock picture.</span>"; bValid = false; }
							if (!m_strProjectName) { htmlError += "<br><span>Project Name is required.</span>"; bValid = false; }
							if (!m_strProjectDescription) { htmlError += "<br><span>Project Description is required.</span>"; bValid = false; }
							if (!m_strProjectTags) { htmlError += "<br><span>At least one Search tag is required.</span>"; bValid = false; }

							switch(m_strProductType) {
								case "class":
									var strSchedule = m_valSchedule();	// Returns empty string if schedule is good; else html as below.
									bValid = bValid && !strSchedule;
									htmlError += strSchedule;
									if (!m_strInstructorFirst || !m_strInstructorLast || !m_strPhone) { htmlError += "<br><span>Instructor's Name and Phone are required.</span>"; bValid = false; }
									if (!m_strFacility || !m_strAddress || !m_strCity || !m_strZip) { htmlError += "<br><span>All 'Where' fields are required (except room number).</span>"; bValid = false; }
									if (!m_iMaxClassSize) { htmlError += "<br><span>Max class size is required.</span>"; bValid = false; }
									if (m_dPrice === 0.0) { htmlError += "<br><span>A Price that is greater than $0.00 is required.</span>"; bValid = false; }
									if (!m_strNotes) { htmlError += "<br><span>Classs Notes are required.</span>"; bValid = false; }
									break;

								case "onlineClass":
									var strSchedule = m_valSchedule();	// Returns empty string if schedule is good; else html as below.
									bValid = bValid && !strSchedule;
									htmlError += strSchedule;
									if (!m_strInstructorFirst || !m_strInstructorLast || !m_strEmail) { htmlError += "<br><span>Instructor's Name and Email address are required.</span>"; bValid = false; }
									if (m_dPrice === 0.0) { htmlError += "<br><span>A Price that is greater than $0.00 is required.</span>"; bValid = false; }
									if (!m_strNotes) { htmlError += "<br><span>Classs Notes are required.</span>"; bValid = false; }
									break;

								case "product":
									if (m_dPrice === 0.0) { htmlError += "<br><span>A Price that is greater than $0.00 is required.</span>"; bValid = false; }
									break;
							}

							if (!bValid) {

								errorHelper.show(htmlError);
							}

							if (bSaving) {

								return bValid;

							} else if (bValid) {

								errorHelper.show("Everything checks out fine!", 250000);	// Changes header from Error to Note.
							}
						} catch (e) { errorHelper.show(e); }
					}

					var m_valSchedule = function() {

						// done First date must be valid.
				        // done Any date that's entered must be a valid datetime. I've created an array of strings m_arrWhenQuality in
				        //		m_functionGetAllFieldsFromBrowser where 8 entries correspond to the 8 when fields and hold: 'good', 'bad' or 'empty'.
				        //		m_arrWhenQuality reflects the quality of what's on the screen, not what's in m_jsPPData.schedule. So I
				        //		can base error messages off it.
				        // done Any date must have valid duration (from < thru).
				        // done No gaps allowed in the array.
				        // ____ Dates must be in ascending order.
				        // ____ If two classes happen on the same day, they must not overlap and first must precede second.

						var htmlError = "";
						var compArray = new Array();

						// Prepare schedule for checks.
						for (var i = 0; i < 8; i++) {

							var whenIth = m_jsPPData.schedule[i];	// whenIth.date is a string (either '' or '2016-04-18T00:00:00+00:00'); duration is number ms the class lasts (0 if date is '')
							var momFrom = null;
							var momThru = null;
							if (m_arrWhenQuality[i] === 'good') {

								var momFrom = moment(whenIth.date);
								// dur is probably unnecessary. It's probably fine to add a negative number of ms to a moment.
								var dur = whenIth.duration - 60000;
								var momThru;
								if (dur > 0) {

									momThru = momFrom.clone().add(dur, 'ms');

								} else {

									momThru = momFrom.clone().subtract(0 - dur, 'ms');
								}
							}
							compArray.push(
								{
									from: momFrom,
									thru: momThru
								}
							);
						}
	
						if (m_arrWhenQuality[0] === 'empty') {
							htmlError += "<br><span>The date and times of at least the first class must be entered.</span>";
						}

						var bAnyEmptiesFoundYet = false;
						for (var i = 0; i < 8; i++) {

							var compIth = compArray[i];
							if (m_arrWhenQuality[i] === 'empty') {

								bAnyEmptiesFoundYet = true;

							} else {

								if (bAnyEmptiesFoundYet && !htmlError.includes("gaps")) {

									htmlError += "<br><span>You may not have gaps in the Schedule.</span>";
								}
								
								if (m_arrWhenQuality[i] === 'bad') {

									htmlError += "<br><span>The date for class " + (i + 1) +" isn't formatted properly.</span>";

								} else if(compIth.thru.isBefore(compIth.from)) {

									htmlError += "<br><span>Class " + (i + 1) +" ends before it starts.</span>";
								}
							}
						}

						return htmlError;
					}

					var m_functionGetAllFieldsFromBrowser = function () {

						m_strProjectDescription = $("#ProjectDescription").val().trim();
						m_strProjectName = $("#ProjectName").val().trim();
						m_strProjectTags = $("#ProjectTags").val().trim();
						var e;

						// If there was a class or product or online class snippet in the dialog, capture that info into the project.
						if (m_templateToGet.includes("class")) {

							m_strInstructorFirst = $("#InstructorFirst").val().trim();
							m_strInstructorLast = $("#InstructorLast").val().trim();
							m_strPhone = $("#Phone").val().trim();
							m_strFacility = $("#Facility").val().trim();
							m_strAddress = $("#Address").val().trim();
							m_strRoom = $("#Room").val().trim();
							m_strCity = $("#City").val().trim();

							// jQuery not working here and several places below.
							// m_strState = $("#USState option:selected").text();
							e = document.getElementById("USState");
							m_strState = e.options[e.selectedIndex].text;

							m_strZip = $("#Zip").val().trim();
							m_arrWhen = [];
							m_arrWhenQuality = [];
							for (var i = 1; i <=8; i++) {
								var str = $("#When" + i).val().trim();
								if (str.length) { 
									var when = m_funcWhenProcess(str);
									m_arrWhen.push(when);
									if (when.date) {
										m_arrWhenQuality.push('good');
									} else {
										m_arrWhenQuality.push('bad');
									}
								} else {
									m_arrWhen.push({ date: '', duration: 0});
									m_arrWhenQuality.push('empty');
								}
							}
 							// m_strLevel = $("#Level option:selected").text();
							e = document.getElementById("Level");
							m_strLevel = e.options[e.selectedIndex].text;

							// m_strDifficulty = $("#Difficulty option:selected").text();
							e = document.getElementById("Difficulty");
							m_strDifficulty = e.options[e.selectedIndex].text;

							m_dPrice = 0.00;
							strPrice = $("#Price").val().trim();
							if (strPrice.length) {
								m_dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
							}
							m_strNotes = $("#Notes").val().trim();
							m_iMaxClassSize = parseInt($("#MaxClassSize").val().trim(), 10);
							m_iLoanComputersAvailable = $("#cb1").prop("checked") ? 1 : 0;

							m_jsPPData = {
								id: m_iId,
								baseProjectId: m_iBaseProjectId,
								active: m_iActive,		// may be toggled below
								name: m_strProjectName,
								classDescription: m_strProjectDescription,
								tags: m_strProjectTags,
								instructorFirstName: m_strInstructorFirst,
								instructorLastName: m_strInstructorLast,
								instructorPhone: m_strPhone,
								facility: m_strFacility,
								address: m_strAddress,
								room: m_strRoom,
								city: m_strCity,
								state: m_strState,
								zip: m_strZip,
								schedule: m_arrWhen,
								level: m_strLevel,
								difficulty: m_strDifficulty,
								price: m_dPrice,
								classNotes: m_strNotes,
								imageId: m_iImageId,
								maxClassSize: m_iMaxClassSize,
								loanComputersAvailable: m_iLoanComputersAvailable
							};
						} else if (m_templateToGet.includes("product")) {

 							// m_strLevel = $("#Level option:selected").text();
							e = document.getElementById("Level");
							m_strLevel = e.options[e.selectedIndex].text;

							// m_strDifficulty = $("#Difficulty option:selected").text();
							e = document.getElementById("Difficulty");
							m_strDifficulty = e.options[e.selectedIndex].text;

							m_dPrice = 0.00;
							strPrice = $("#Price").val().trim();
							if (strPrice.length) {
								m_dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
							}

							m_jsPPData = {
								id: m_iId,
								baseProjectId: m_iBaseProjectId,
								active: m_iActive,
								name: m_strProjectName,
								productDescription: m_strProjectDescription,
								tags: m_strProjectTags,
								level: m_strLevel,
								difficulty: m_strDifficulty,
								price: m_dPrice,
								imageId: m_iImageId
							};
						} else {

							m_strInstructorFirst = $("#InstructorFirst").val().trim();
							m_strInstructorLast = $("#InstructorLast").val().trim();
							m_strEmail = $("#Email").val().trim();
							m_arrWhen = [];
							m_arrWhenQuality = [];
							for (var i = 1; i <=8; i++) {
								var str = $("#When" + i).val().trim();
								if (str.length) { 
									var when = m_funcWhenProcess(str);
									m_arrWhen.push(when);
									if (when.date) {
										m_arrWhenQuality.push('good');
									} else {
										m_arrWhenQuality.push('bad');
									}
								} else {
									m_arrWhen.push({ date: '', duration: 0});
									m_arrWhenQuality.push('empty');
								}
							}
 							// m_strLevel = $("#Level option:selected").text();
							e = document.getElementById("Level");
							m_strLevel = e.options[e.selectedIndex].text;

							// m_strDifficulty = $("#Difficulty option:selected").text();
							e = document.getElementById("Difficulty");
							m_strDifficulty = e.options[e.selectedIndex].text;

							m_dPrice = 0.00;
							strPrice = $("#Price").val().trim();
							if (strPrice.length) {
								m_dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
							}
							m_strNotes = $("#Notes").val().trim();

							m_jsPPData = {
								id: m_iId,
								baseProjectId: m_iBaseProjectId,
							 	active: m_iActive,
								name: m_strProjectName,
								classDescription: m_strProjectDescription,
								tags: m_strProjectTags,
								instructorFirstName: m_strInstructorFirst,
								instructorLastName: m_strInstructorLast,
								instructorEmail: m_strEmail,
								schedule: m_arrWhen,
								level: m_strLevel,
								difficulty: m_strDifficulty,
								price: m_dPrice,
								classNotes: m_strNotes,
								imageId: m_iImageId
							};
						}
					}

					// This saves the data with toggled active status.
					var m_functionSaveToggleProject = function () {

						if (!m_functionValidate(null, true)) { return; }	// m_functionValidate displays its own success or failure popup.

						m_jsPPData.active = 1 - m_iActive;

						m_functionSaveProject2();
					}

					// This saves the data without touching active status.
					var m_functionSaveProject = function () {

						if (!m_functionValidate(null, true)) { return; }	// m_functionValidate displays its own success or failure popup.

						m_functionSaveProject2();
					}

					// This saves the data without touching active status.
					var m_functionSaveProject2 = function () {

						try {

							var data = {};
							switch (m_strProductType) {
								case "class":
									data.classData = m_jsPPData;
									break;
								case "onlineClass":
									data.onlineClassData = m_jsPPData;
									break;
								case "product":
									data.productData = m_jsPPData;
									break;
							}
		                    var posting = $.post("/BOL/ProjectBO/SavePPData",
		                    		data,
		                            'json');
		                    posting.done(function(data) {

		                    	if (data.success) {

                                    errorHelper.show("The save was successful.", 250000);
                                    m_dialog.close();
		                    	
		                    	} else {

		                    		errorHelper.show("The save failed with error: " + data.message);
		                    	}
		                    });
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

						m_iImageId = imageId;
						$("#ProjectImage").attr("src", resourceHelper.toURL("resources", imageId, "image"));
					}
				} catch (e) { errorHelper.show(e.message); }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_jsPPData;
				var m_templateToGet;
				var m_strProductType;

				// PP data fields
				var m_iActive;	// Actually, bool, but values are 1 or 0 and not true or false.
				var m_iId;
				var m_iBaseProjectId;
				var m_strProjectDescription;
				var m_strProjectName;
				var m_strProjectTags;
				var m_strInstructorFirst;
				var m_strInstructorLast;
				var m_strPhone;
				var m_strFacility;
				var m_strAddress;
				var m_strRoom;
				var m_strCity;
				var m_strState;
				var m_strZip;
				var m_arrWhen;
				var m_arrWhenQuality;
				var m_strLevel;
				var m_strDifficulty;
				var m_dPrice;
				var m_strNotes;
				var m_strEmail;
				var m_iMaxClassSize;
				var m_iLoanComputersAvailable;
				var m_iImageId;
			};

			// Return the constructor function as the module object.
			return functionAZSavePPDataDialog;

		} catch (e) { errorHelper.show(e.message); }
	});
