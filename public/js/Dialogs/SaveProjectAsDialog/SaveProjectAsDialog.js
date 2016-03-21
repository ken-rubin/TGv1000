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
					            		cssClass: "btn-primary",
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
							m_clProject = client.getProject();
							m_clProject_data_name = m_clProject.data.name;

							// Set project image.
							if (m_clProject.data.altImagePath.length) {

								$("#ProjectImage").attr("src", m_clProject.data.altImagePath);
							
							} else {

								m_functionSetImageSrc(m_clProject.data.imageId);
							}
							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);

							$("#SaveProjectBtn").click(m_functionSaveProject);

							$("#ProjectName").keyup(m_functionNameBlur);
							$("#ProjectName").val(m_clProject.data.name);

							$("#ProjectDescription").val(m_clProject.data.description);
							$("#ProjectTags").val(m_clProject.data.tags);

							$("#ProjectDescription").blur(m_functionDescriptionBlur);
							$("#ProjectTags").blur(m_functionTagsBlur);

							m_setStateSaveAsBtn();

							// If this new project is a Class or Product, fetch the specific jade/html template to insert into the dialog.
							var templateToGet = null;
							if (m_clProject.data.isClass) {

								templateToGet = 'Dialogs/NewProjectDialog/classDetails.jade';

							} else if (m_clProject.data.isProduct) {

								templateToGet = 'Dialogs/NewProjectDialog/productDetails.jade';

							} else if (m_clProject.data.isOnlineClass) {

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
						$("#ProjectName").val(m_clProject.data.name);
						$("#ProjectName")[0].setSelectionRange(0, 0);	// The [0] changes jQuery object to DOM element.

						$("#ProjectDescription").val(m_clProject.data.description);
						$("#ProjectTags").val(m_clProject.data.tags);

						$("#ProjectDescription").blur(m_functionDescriptionBlur);
						$("#ProjectTags").blur(m_functionTagsBlur);

						if (m_clProject.data.specialProjectData.classProject) {
							jQuery(function($){
								$("#Phone").mask("(999) 999-9999? x99999");
								$("#Zip").mask("99999");
								$("#Price").mask("$999.99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999/99/99         99:99 - 99:99")
								}
							});
							$("#ProjectDescription").val(m_clProject.data.specialProjectData.classData.classDescription);
							$("#InstructorFirst").val(m_clProject.data.specialProjectData.classData.instructorFirstName);
							$("#InstructorLast").val(m_clProject.data.specialProjectData.classData.instructorLastName);
							$("#Phone").val(m_clProject.data.specialProjectData.classData.instructorPhone);
							$("#Facility").val(m_clProject.data.specialProjectData.classData.facility);
							$("#Address").val(m_clProject.data.specialProjectData.classData.address);
							$("#Room").val(m_clProject.data.specialProjectData.classData.room);
							$("#City").val(m_clProject.data.specialProjectData.classData.city);
							// state combo
							if(m_clProject.data.specialProjectData.classData.state.length > 0) {
								$('#State > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.classData.state)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							$("#Zip").val(m_clProject.data.specialProjectData.classData.zip);
							// when array
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = m_clProject.data.specialProjectData.classData.schedule[i-1];
								if (whenIth.date.length > 0 || whenIth.from.length > 0 || whenIth.thru.length > 0) {
									var when = (whenIth.date + '          ').substr(0,10) + '         ' + (whenIth.from + '     ').substr(0,5) + '   ' + (whenIth.thru + '     ').substr(0,5);
									$("#When" + i).val(when);
								}
							}
							// level combo
							if(m_clProject.data.specialProjectData.classData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.classData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(m_clProject.data.specialProjectData.classData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.classData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// formatted price
							$("#Price").val(m_clProject.data.specialProjectData.classData.price.dollarFormat());
							$("#Notes").val(m_clProject.data.specialProjectData.classData.classNotes);
						
						} else if (m_clProject.data.specialProjectData.productProject) {
							jQuery(function($){
								$("#Price").mask("$999.99");
							});
							$("#ProjectDescription").val(m_clProject.data.specialProjectData.productData.productDescription);
							// level combo
							if(m_clProject.data.specialProjectData.productData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.productData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(m_clProject.data.specialProjectData.productData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.productData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// formatted price
							$("#Price").val(m_clProject.data.specialProjectData.productData.price.dollarFormat());
						
						} else if (m_clProject.data.specialProjectData.onlineClassProject) {
							jQuery(function($){
								$("#Price").mask("$999.99");
								for (var i=1; i<=8; i++) {
									$("#When" + i).mask("9999/99/99         99:99 - 99:99")
								}
							});
							$("#ProjectDescription").val(m_clProject.data.specialProjectData.onlineClassData.classDescription);
							$("#InstructorFirst").val(m_clProject.data.specialProjectData.onlineClassData.instructorFirstName);
							$("#InstructorLast").val(m_clProject.data.specialProjectData.onlineClassData.instructorLastName);
							$("#Email").val(m_clProject.data.specialProjectData.onlineClassData.instructorEmail);
							// when array
							for (var i = 1; i <= 8; i++) {
								$("#When" + i).val('');
								var whenIth = m_clProject.data.specialProjectData.onlineClassData.schedule[i-1];
								if (whenIth.date.length > 0 || whenIth.from.length > 0 || whenIth.thru.length > 0) {
									var when = (whenIth.date + '          ').substr(0,10) + '         ' + (whenIth.from + '     ').substr(0,5) + '   ' + (whenIth.thru + '     ').substr(0,5);
									$("#When" + i).val(when);
								}
							}
							// level combo
							if(m_clProject.data.specialProjectData.onlineClassData.level.length > 0) {
								$('#Level > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.onlineClassData.level)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// difficulty combo
							if(m_clProject.data.specialProjectData.onlineClassData.difficulty.length > 0) {
								$('#Difficulty > option').each(
									function() {
 										if ($(this).text() === m_clProject.data.specialProjectData.onlineClassData.difficulty)
 											$(this).parent('select').val($(this).val());
									}
								);
							}
							// formatted price
							$("#Price").val(m_clProject.data.specialProjectData.onlineClassData.price.dollarFormat());
							$("#Notes").val(m_clProject.data.specialProjectData.onlineClassData.classNotes);
						}

						m_setStateSaveAsBtn();
					}

					var m_setStateSaveAsBtn = function () {

						var status = m_clProject.getStatus();
						if (!status.allRequiredFieldsFilled) {
							$("#SaveProjectBtn").addClass("disabled");
						} else {
							$("#SaveProjectBtn").removeClass("disabled");
						}
					}

					var m_functionNameBlur = function() {

						var txt = $("#ProjectName").val().trim();
						if (txt !== m_clProject.data.name) {

							m_clProject_data_name = txt;
							m_setStateSaveAsBtn();
						}
					}

					var m_functionDescriptionBlur = function() {

						var txt = $("#ProjectDescription").val().trim();
						if (txt !== m_clProject.data.description) {

							m_clProject.data.description = txt;
							client.setBrowserTabAndBtns();
							m_setStateSaveAsBtn();
						}
					}

					var m_functionTagsBlur = function() {

						var txt = $("#ProjectTags").val().trim();
						if (txt !== m_clProject.data.tags) {

							m_clProject.data.tags = txt;
							client.setBrowserTabAndBtns();
							m_setStateSaveAsBtn();
						}
					}

					var m_functionSaveProject = function () {

						try {

							// Set the project name that we hold in a method scope var in order to prevent saving a 2nd project
							// with same name due to user typing it in and closing the dialog once; then coming back.
							m_clProject.data.name = m_clProject_data_name;
							var strProjectDescription = $("#ProjectDescription").val().trim();

							// If there was a class or product or online class snippet in the dialog, capture that info into the project.
							if (m_clProject.data.isClass) {

								// Retrieve class data from template fields. It's all optional until we're about to make the class active, actually.
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

								m_clProject.data.specialProjectData.classData = {
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
									classNotes: strNotes
								};
							} else if (m_clProject.data.isProduct) {

								// Retrieve product data from template fields. It's all optional until we're about to make the product active, actually.
								var strLevel = $("#Level option:selected").text();
								var strDifficulty = $("#Difficulty option:selected").text();
								var dPrice = 0.00;
								var strPrice = $("#Price").val().trim();
								if (strPrice.length) {
									dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
								}

								m_clProject.data.specialProjectData.productData = {
									active: false,
									productDescription: strProjectDescription,
									level: strLevel,
									difficulty: strDifficulty,
									price: dPrice
								};
							} else if (m_clProject.data.isOnlineClass) {

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

								m_clProject.data.specialProjectData.onlineClassData = {
									active: false,
									classDescription: strProjectDescription,
									instructorFirstName: strInstructorFirst,
									instructorLastName: strInstructorLast,
									instructorEmail: strEmail,
									schedule: arrWhen,
									level: strLevel,
									difficulty: strDifficulty,
									price: dPrice,
									classNotes: strNotes
								};
							}

							client.setBrowserTabAndBtns();

							exceptionRet = client.saveProject();
							if (exceptionRet) { throw exceptionRet; }

						} catch(e) { errorHelper.show(e); }
					}

					// Takes a when string of form 2016/02/01.........19:00.-.19:55 and
					// returns { date: '2016/02/01', from: '19:00', thru: '19:55'}.
					// Incompletes and incorrects are set to ''.
					var m_funcWhenProcess = function(strWhen) {

						var strDate = '';
						var strFrom = '';
						var strThru = '';
						var l = strWhen.length;
						if (l >= 10)
							strDate = strWhen.substring(0, 10);
						if (l >= 24)
							strFrom = strWhen.substring(19, 24);
						if (l >= 32)
							strThru = strWhen.substring(27, 32);

						return { date: strDate, from: strFrom, thru: strThru};
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

						m_clProject.imageId = imageId;
						m_clProject.altImagePath = '';
						$("#ProjectImage").attr("src", resourceHelper.toURL("resources", imageId, "image"));
						m_setStateSaveAsBtn();
					}
				} catch (e) {

					errorHelper.show(e.message);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_clProject = null;
				var m_clProject_data_name = "";
			};

			// Return the constructor function as the module object.
			return functionSaveProjectAsDialog;

		} catch (e) { errorHelper.show(e.message); }
	});
