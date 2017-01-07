///////////////////////////////////////
// NewProjectDialog module.
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
    "NextWave/source/utility/PictureListItem",
    "NextWave/source/utility/RadioListItem",
    "Core/errorHelper",
    "Core/resourceHelper"
    ],
    function (prototypes, settings, Point, Size, Area, DialogHost, List, PictureListItem, RadioListItem, errorHelper, resourceHelper) {

        try {

            // Constructor function.
            var functionRet = function NewProjectDialog() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from DialogHost.
                    self.inherits(DialogHost);

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    // arrayAvailProjTypes is used to get the images from which the user chooses the project type to create.
                    // It is an int array containing 1-6 (perhaps a subset for normal users; all 6 for priv. users), corresponding to
                    // 1 game project
                    // 2 console project
                    // 3 website project
                    // 4 hololens project
                    // 5 mapping project
                    // 6 empty project
                    self.create = function (arrayAvailProjTypes) {

                        try {

                            if (!arrayAvailProjTypes) {
                                return null;
                            }

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "NewProjectDialog: Instance already created!" };
                            }

                            //      A normal user starts in mode 'Sel Proj Type-normal user' and goes to mode 'Normal proj' on image click.
                            //      A privileged user starts in mode 'Sel Proj Type-priv user' and goes to mode 'Normal proj', 'Classroom class proj1', 'Online class proj1' or 'Product proj',
                            //      depending on the button clicked (eventually may be radio buttons and a continue button).
/*
Controls arranged by Mode

'Sel Proj Type-normal user'
    instructions1       Label
    projectTypes        ListHost	self.dialog.setMode('Normal proj')
    cancelButton        Button

'Sel Proj Type-priv user'
    instructions1       Label
    projectTypes        ListHost
    instructions2       Label
	ncopChoice			ListHost
    nextButton          Button		self.dialog.setMode('Normal proj' or 'Classroom class proj1' or 'Online class proj1' or 'Product proj', depending on m_projectModeId)
    cancelButton        Button

'Normal proj'
    instructions3       Label
    instructions4       Label
    nameLabel           Label
    nameEdit            Edit
    descriptionLabel    Label
    descriptionEdit     Edit-multiline
    projectImageLabel   Label
    projectImage        Picture
    imageSearchButton   GlyphHost
    urlSearchButton     GlyphHost
    fileSearchButton    GlyphHost
    backButton          Button		if (normal user) setMode('Sel Proj Type-normal user') else setMode('Sel Proj Type-priv user')
    createProjectButton Button
    cancelButton        Button

'Classroom class proj1'
    instructions5       Label
    instructions6       Label
    nameLabel           Label
    nameEdit            Edit
    descriptionLabel    Label
    descriptionEdit     Edit-multiline
    projectImageLabel   Label
    projectImage        Picture
    imageSearchButton   Button
    urlSearchButton     Button
    fileSearchButton    Button
    backButton          Button		setMode('Sel Proj Type-priv user')
    nextButton          Button
    cancelButton        Button

'Classroom class proj2'
    instructions7       Label	first set of fields for classroomClass (instructor, phone, level, difficulty, price, max class size, loaner computers available, notes)
    nameLabel			Label
    nameEdit            Edit
    backButton          Button
    nextButton          Button
    cancelButton        Button

'Classroom class proj3'
    instructions8       Label	second set of fields for classroomClass (six location fields, class schedule)
    nameLabel			Label
    nameEdit            Edit
    backButton          Button
    createProjectButton Button
    cancelButton        Button

'Online class proj1'
    instructions9       Label
    instructions10      Label
    nameLabel           Label
    nameEdit            Edit
    descriptionLabel    Label
    descriptionEdit     Edit-multiline
    projectImageLabel   Label
    projectImage        Picture
    imageSearchButton   Button
    urlSearchButton     Button
    fileSearchButton    Button
    backButton          Button		setMode('Sel Proj Type-priv user')
    nextButton          Button		setMode('Online class proj2')
    cancelButton        Button

'Online class proj2'
    instructions11      Label	set of fields for Online class (instructor, email, level, difficulty, price, notes)
    nameLabel           Label
    nameEdit            Edit
    backButton          Button		setMode('Online class proj1')
    createProjectButton Button
    cancelButton        Button

'Product proj'
    instructions13
    instructions14
    nameLabel
    nameEdit
    descriptionLabel
    descriptionEdit
    projectImageLabel
    projectImage
    imageSearchButton
    urlSearchButton
    fileSearchButton
	levelLabel			Label
	level   			ListHost	['Elementary school','Middle School','High school and beyond']
	difficultyLabel		Label
	difficulty			ListHost	['Beginner','Has used the TechGroms system','Has completed a TechGroms class','Almost self-sufficient','An expert!']
	priceLabel			Label
	price				Text
    backButton          Button		setMode('Sel Proj Type-priv user')
    createProjectButton Button
    cancelButton        Button
*/

                            let objectConfiguration =
                            {
								instructions1: {
									type: "Label",
									modes: ['Sel Proj Type-normal user','Sel Proj Type-priv user'],
									text: "Choose the type of Project you wish to create by clicking on its picture.",
									x: settings.general.margin,
									y: 5 * settings.general.margin,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								projectTypes: {
									type: "ListHost",
									modes: ['Sel Proj Type-normal user','Sel Proj Type-priv user'],
									constructorParameterString: "false",
									x: settings.general.margin,
									y: settings.general.margin +
										2 * settings.dialog.lineHeight,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: 100
								},
								instructions2: {
									type: "Label",
									modes: ['Sel Proj Type-priv user'],
									text: "As a privileged user, besides being able to create Normal projects, you are allowed to create a Class, an Online Class or a Product. Choose here:",
									x: settings.general.margin,
									y: settings.general.margin +
										2 * settings.dialog.lineHeight + 120,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								ncopChoice: {
									type: "ListHost",
									modes: ['Sel Proj Type-priv user'],
									constructorParameterString: "true",
									x: settings.general.margin +
										2 * settings.dialog.firstColumnWidth,
									y: settings.general.margin +
										3 * settings.dialog.lineHeight + 130,
									width: settings.dialog.firstColumnWidth,
									height: 5 * settings.dialog.lineHeight
								},
								instructions3: {
									type: "Label",
									modes: ['Normal proj'],
									text: "Enter details for your new Project.",
									x: settings.general.margin,
									y: 5 * settings.general.margin,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								instructions4: {
									type: "Label",
									modes: ['Normal proj'],
									text: "Only Name is required. However, consider entering a description for searching and changing the default image for identification.",
									x: settings.general.margin,
									y: 5 * settings.general.margin +
										settings.dialog.lineHeight,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								instructions5: {
									type: "Label",
									modes: ['Classroom class proj1'],
									text: "Enter some details for your new Classroom Project. Only Name is absolutely required at this time.",
									x: settings.general.margin,
									y: 5 * settings.general.margin,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								instructions6: {
									type: "Label",
									modes: ['Classroom class proj1'],
									text: "You'll be able to come back and complete the class info--and will have to before it can be made active.",
									x: settings.general.margin,
									y: 5 * settings.general.margin +
										settings.dialog.lineHeight,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								instructions7: {
									type: "Label",
									modes: ['Classroom class proj2'],
									text: "You may enter instructor info here along with some class info. Or wait till later.",
									x: settings.general.margin,
									y: 5 * settings.general.margin +
										settings.dialog.lineHeight,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								instructions8: {
									type: "Label",
									modes: ['Classroom class proj3'],
									text: "Complete setup with classroom details along with a schedule of up to 8 class meeting dates and times. Or not.",
									x: settings.general.margin,
									y: 5 * settings.general.margin +
										settings.dialog.lineHeight,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								instructions9: {
									type: "Label",
									modes: ['Online class proj1'],
									text: "Enter details for your new Online Class Project.",
									x: settings.general.margin,
									y: 5 * settings.general.margin,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								instructions10: {
									type: "Label",
									modes: ['Online class proj1'],
									text: "You'll be able to come back and complete the class info--and will have to before it can be made active.",
									x: settings.general.margin,
									y: 5 * settings.general.margin +
										settings.dialog.lineHeight,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								instructions11: {
									type: "Label",
									modes: ['Online class proj2'],
									text: "Complete setup with instructor info along with a schedule of up to 8 class meeting dates and times. Or not.",
									x: settings.general.margin,
									y: 5 * settings.general.margin +
										settings.dialog.lineHeight,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								instructions13: {
									type: "Label",
									modes: ['Product proj'],
									text: "Enter details for your new Product Project.",
									x: settings.general.margin,
									y: 5 * settings.general.margin,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								instructions14: {
									type: "Label",
									modes: ['Product proj'],
									text: "All fields but Name are optional until the Product is made active and put on sale.",
									x: settings.general.margin,
									y: 5 * settings.general.margin +
										settings.dialog.lineHeight,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								nameLabel: {
									type: "Label",
									modes: ['Normal proj','Classroom class proj1','Classroom class proj2','Classroom class proj3','Online class proj1','Online class proj2','Product proj'],
									text: "Name",
									x: settings.general.margin,
									y: 5 * settings.general.margin +
										3 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								nameEdit: {
									type: "Edit",
									modes: ['Normal proj','Classroom class proj1','Classroom class proj2','Classroom class proj3','Online class proj1','Online class proj2','Product proj'],
                                    multiline: false,
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 5 * settings.general.margin +
										3 * settings.dialog.lineHeight,
									widthType: "reserve",           // Reserve means: subtract the width from
																	//  the total width on calculateLayout.
									width: 3 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight,
									exitFocus: function (localSelf) {
										try {
											// Save off criteria.
											m_strProjectName = localSelf.getText().trim();

											let cb = self.dialog.controlObject["createProjectButton"];
											cb.setProtected(!m_functionIsEverythingValid());

										} catch (e) {
											alert(e.message);
										}
									}
								},
								descriptionLabel: {
									type: "Label",
									modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj'],
									text: "Description",
									x: settings.general.margin,
									y: 6 * settings.general.margin +
										4 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								descriptionEdit: {
									type: "Edit",
									modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj'],
                                    multiline: true,
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 6 * settings.general.margin +
										4 * settings.dialog.lineHeight,
									widthType: "reserve",           // Reserve means: subtract the width from
																	//  the total width on calculateLayout.
									width: 3 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight * 5,
									exitFocus: function (localSelf) {
										try {
											// Save off description.
											m_strProjectDescription = localSelf.getText();

										} catch (e) {
											alert(e.message);
										}
									}
								},
								projectImageLabel: {
									type: "Label",
									modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj'],
									text: "Project image",
									x: settings.general.margin,
									y: 5 * settings.general.margin +
										11 * settings.dialog.lineHeight,
									widthType: "reserve",
									width: 2 * settings.general.margin,
									height: settings.dialog.lineHeight
								},
								projectImage: {
									type: "Picture",
									modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj'],
									constructorParameterString: null,
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 5 * settings.general.margin +
										11 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight * 5
								},
								imageSearchButton: {
									type: "GlyphHost",
									modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj'],
									constructorParameterString: "'search'",
									x: 2 * settings.general.margin + settings.dialog.firstColumnWidth + settings.dialog.firstColumnWidth + 20,
									y: 5 * settings.general.margin +
										11 * settings.dialog.lineHeight +
										(settings.dialog.lineHeight * 5 - 40) / 2,
									width: 40,
									height: 40,
									clickHandler: function() {

										try {

											var exceptionRet = client.showImageSearchDialog(true, m_functionSetImageSrc);
											if (exceptionRet) {

												throw exceptionRet;
											}
										} catch(e) {

											errorHelper.show(e);
										}
									}
								},
								urlSearchButton: {
									type: "GlyphHost",
									modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj'],
									constructorParameterString: "'cloudDownload'",
									x: 2 * settings.general.margin + settings.dialog.firstColumnWidth + settings.dialog.firstColumnWidth + 70,
									y: 5 * settings.general.margin +
										11 * settings.dialog.lineHeight +
										(settings.dialog.lineHeight * 5 - 40) / 2,
									width: 40,
									height: 40,
									clickHandler: function() {

										try {

											var exceptionRet = client.showImageURLDialog(true, m_functionSetImageSrc);
											if (exceptionRet) {

												throw exceptionRet;
											}
										} catch(e) {

											errorHelper.show(e);
										}
									}
								},
								fileSearchButton: {
									type: "GlyphHost",
									modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj'],
									constructorParameterString: "'openFile'",
									x: 2 * settings.general.margin + settings.dialog.firstColumnWidth + settings.dialog.firstColumnWidth + 120,
									y: 5 * settings.general.margin +
										11 * settings.dialog.lineHeight +
										(settings.dialog.lineHeight * 5 - 40) / 2,
									width: 40,
									height: 40,
									clickHandler: function() {

										try {

											var exceptionRet = client.showImageDiskDialog(true, m_functionSetImageSrc);
											if (exceptionRet) {

												throw exceptionRet;
											}
										} catch(e) {

											errorHelper.show(e);
										}
									}
								},
								levelLabel: {
									type: "Label",
									modes: ['Classroom class proj1','Online class proj1','Product proj'],
									text: "Level",
									xType: "reserve",
									x: 3 * settings.dialog.firstColumnWidth,
									y: 5 * settings.general.margin +
										12 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								level: {
									type: "ListHost",	//	['Elementary school','Middle School','High school and beyond']
									modes: ['Classroom class proj1','Online class proj1','Product proj'],
									constructorParameterString: "true, true",	// bVertical, vUseTinyScrollStub
									xType: "reserve",
									x: 2 * settings.dialog.firstColumnWidth,
									y: 5 * settings.general.margin +
										12 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: 2 * settings.dialog.lineHeight
								},
								difficultyLabel: {
									type: "Label",
									modes: ['Classroom class proj1','Online class proj1','Product proj'],
									text: "Difficulty",
									xType: "reserve",
									x: 3 * settings.dialog.firstColumnWidth,
									y: 5 * settings.general.margin +
										15 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								difficulty: {
									type: "ListHost",	//	['Beginner','Has used the TechGroms system','Has completed a TechGroms class','Almost self-sufficient','An expert!']
									modes: ['Classroom class proj1','Online class proj1','Product proj'],
									constructorParameterString: "true, true",	// bVertical, vUseTinyScrollStub
									xType: "reserve",
									x: 2 * settings.dialog.firstColumnWidth,
									y: 5 * settings.general.margin +
										15 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: 3 * settings.dialog.lineHeight
								},
								priceLabel: {
									type: "Label",
									modes: ['Classroom class proj1','Online class proj1','Product proj'],
									text: "Price                        $",
									x: settings.general.margin,
									y: 4 * settings.general.margin +
										18 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								price: {
									type: "Edit",
									modes: ['Classroom class proj1','Online class proj1','Product proj'],
                                    multiline: false,
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 4 * settings.general.margin +
										18 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight,
									exitFocus: function (localSelf) {
										try {
											// Validate and then save price if valid.
											let strPrice = localSelf.getText().trim();
											if (strPrice.length === 0) {
												m_dPrice = 0.0;
												return;
											}

											// let rStrPrice = strPrice.replace(/[^0-9\.]+/g,"");
											if (isNaN(strPrice)) {
												alert("Your Price entry " + strPrice + " is not a valid number.");
												return;
											}

											m_dPrice = Number.parseFloat(strPrice);
											if (isNaN(m_dPrice)) {
												m_dPrice = 0.0;
												alert("Your Price entry " + strPrice + " is not a valid number.");
											}
										} catch (e) {
											alert(e.message);
										}
									}
								},
								instructorLabel: {
									type: "Label",
									text: "Instructor (first, last)",
									modes: ['Classroom class proj2','Online class proj2'],
									x: settings.general.margin,
									y: 6 * settings.general.margin +
										4 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight

								},
								instructorFirst: {
									type: "Edit",
									multiline: false,
									modes: ['Classroom class proj2','Online class proj2'],
									exitFocus: function (localSelf) {
										try {
											m_instructor.first = localSelf.getText().trim();

										} catch (e) {
											alert(e.message);
										}
									},
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 6 * settings.general.margin +
										4 * settings.dialog.lineHeight,
									width: 2 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								instructorLast: {
									type: "Edit",
									multiline: false,
									modes: ['Classroom class proj2','Online class proj2'],
									exitFocus: function (localSelf) {
										try {
											m_instructor.last = localSelf.getText().trim();

										} catch (e) {
											alert(e.message);
										}
									},
									x: 3 * settings.general.margin +
										3 * settings.dialog.firstColumnWidth,
									y: 6 * settings.general.margin +
										4 * settings.dialog.lineHeight,
									width: 2 * settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								classNotesLabel: {
									type: "Label",
									text: "Class notes",
									modes: ['Classroom class proj2','Online class proj2'],
									x: settings.general.margin,
									yType: "reserve",
									y: 90 + 6 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								classNotes: {
									type: "Edit",
									multiline: true,
									modes: ['Classroom class proj2','Online class proj2'],
									exitFocus: function (localSelf) {
										try {
											m_strNotes = localSelf.getText().trim();

										} catch (e) {
											alert(e.message);
										}
									},
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "reserve",
									y: 90 + 6 * settings.dialog.lineHeight,
									widthType: "reserve",
									width: settings.dialog.firstColumnWidth,
									height: 5 * settings.dialog.lineHeight
								},
								instructorPhoneLabel: {
									type: "Label",
									text: "Instructor phone",
									modes: ['Classroom class proj2'],
									x: settings.general.margin,
									y: 7 * settings.general.margin +
										5 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								phone: {
									type: "Edit",
									multiline: false,
									modes: ['Classroom class proj2'],
									exitFocus: function (localSelf) {
										try {
											// Validate.
											m_instructor.phone = localSelf.getText().trim();

										} catch (e) {
											alert(e.message);
										}
									},
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 7 * settings.general.margin +
										5 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								instructorEmailLabel: {
									type: "Label",
									text: "Instructor email",
									modes: ['Online class proj2'],
									x: settings.general.margin,
									y: 7 * settings.general.margin +
										5 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								email: {
									type: "Edit",
									multiline: false,
									modes: ['Online class proj2'],
									exitFocus: function (localSelf) {
										try {
											// Validate.
											m_instructor.email = localSelf.getText().trim();

										} catch (e) {
											alert(e.message);
										}
									},
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 7 * settings.general.margin +
										5 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth * 2,
									height: settings.dialog.lineHeight
								},
								maxClassSizeLabel: {
									type: "Label",
									text: "Max class size",
									modes: ['Classroom class proj2'],
									x: settings.general.margin,
									y: 8 * settings.general.margin +
										6 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								maxClassSize: {
									type: "Edit",
									multiline: false,
									modes: ['Classroom class proj2'],
									exitFocus: function (localSelf) {
										try {
											// Validate and then save maxClassSize if valid.
											let strMax = localSelf.getText().trim();
											if (strMax.length === 0) {
												m_iMaxClassSize = 0;
												return;
											}

											if (isNaN(strMax)) {
												alert("Your Max. Class Size entry " + strMax + " is not a valid number.");
												return;
											}

											m_iMaxClassSize = Number.parseFloat(strMax);
											if (isNaN(m_iMaxClassSize)) {
												m_iMaxClassSize = 0;
												alert("Your Max. Class Size entry " + strMax + " is not a valid number.");
											}
										} catch (e) {
											alert(e.message);
										}
									},
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 8 * settings.general.margin +
										6 * settings.dialog.lineHeight,
									width: 100,
									height: settings.dialog.lineHeight
								},
								loanersLabel: {
									type: "Label",
									modes: ['Classroom class proj2'],
									text: "Some loan computers avail",
									x: settings.general.margin,
									y: 9 * settings.general.margin +
										7 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								loaners: {
									type: "ListHost",	//	['Yes','No']
									modes: ['Classroom class proj2'],
									constructorParameterString: "true, true",	// bVertical, vUseTinyScrollStub
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 9 * settings.general.margin +
										7 * settings.dialog.lineHeight,
									width: 100,
									height: 100
								},
								whenLabel: {
									type: "Label",
									text: "Schedule--up to 8 classes on separate lines.",
									modes: ['Classroom class proj3','Online class proj2'],
									xType: "reserve",
									x: 2 * settings.dialog.firstColumnWidth + 100,
									y: settings.dialog.firstColumnWidth,
									width: settings.dialog.firstColumnWidth * 2,
									height: settings.dialog.lineHeight
								},
								when: {
									type: "Edit",
									multiline: true,
									modes: ['Classroom class proj3','Online class proj2'],
									text: "MM/DD/YYYY hh:mm-hh:mm\r\nMM/DD/YYYY hh:mm-hh:mm\r\nMM/DD/YYYY hh:mm-hh:mm\r\nMM/DD/YYYY hh:mm-hh:mm\r\nMM/DD/YYYY hh:mm-hh:mm\r\nMM/DD/YYYY hh:mm-hh:mm\r\nMM/DD/YYYY hh:mm-hh:mm\r\nMM/DD/YYYY hh:mm-hh:mm",
									exitFocus: function (localSelf) {
										try {
											let exceptionRet = m_functionProcessWhen(localSelf.getText());
											if (exceptionRet) {
												throw exceptionRet;
											}
										} catch (e) {
											alert(e.message);
										}
									},
									xType: "reserve",
									x: 2 * settings.dialog.firstColumnWidth + 100,
									y: settings.dialog.firstColumnWidth +
										settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth * 2 + 30,
									height: 8 * settings.dialog.lineHeight
								},
								facilityNameLabel: {
									type: "Label",
									text: "Facility name",
									modes: ['Classroom class proj3'],
									x: settings.general.margin,
									y: 6 * settings.general.margin +
										4 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								facilityName: {
									type: "Edit",
									multiline: false,
									modes: ['Classroom class proj3'],
									exitFocus: function (localSelf) {
										try {
											// Validate?
											m_facilty.name = localSelf.getText().trim();

										} catch (e) {
											alert(e.message);
										}
									},
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 6 * settings.general.margin +
										4 * settings.dialog.lineHeight,
									width: 300,
									height: settings.dialog.lineHeight
								},
								facilityAddrLabel: {
									type: "Label",
									text: "Facility address",
									modes: ['Classroom class proj3'],
									x: settings.general.margin,
									y: 7 * settings.general.margin +
										5 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								facilityAddr: {
									type: "Edit",
									multiline: false,
									modes: ['Classroom class proj3'],
									exitFocus: function (localSelf) {
										try {
											// Validate?
											m_facilty.address = localSelf.getText().trim();

										} catch (e) {
											alert(e.message);
										}
									},
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 7 * settings.general.margin +
										5 * settings.dialog.lineHeight,
									width: 300,
									height: settings.dialog.lineHeight
								},
								facilityRoomLabel: {
									type: "Label",
									text: "Facility room #",
									modes: ['Classroom class proj3'],
									x: settings.general.margin,
									y: 8 * settings.general.margin +
										6 * settings.dialog.lineHeight,
									width: settings.dialog.firstColumnWidth,
									height: settings.dialog.lineHeight
								},
								facilityRoom: {
									type: "Edit",
									multiline: false,
									modes: ['Classroom class proj3'],
									exitFocus: function (localSelf) {
										try {
											// Validate?
											m_facilty.room = localSelf.getText().trim();

										} catch (e) {
											alert(e.message);
										}
									},
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 8 * settings.general.margin +
										6 * settings.dialog.lineHeight,
									width: 100,
									height: settings.dialog.lineHeight
								},
								facilityCityLabel: {
									type: "Label",
									text: "Facility city-state-zip",
									modes: ['Classroom class proj3'],
									x: settings.general.margin,
									y: 9 * settings.general.margin +
										7 * settings.dialog.lineHeight,
									width: 200,
									height: 200
								},
								facilityCity: {
									type: "Edit",
									multiline: false,
									modes: ['Classroom class proj3'],
									exitFocus: function (localSelf) {
										try {
											// Validate?
											m_facilty.city = localSelf.getText().trim();

										} catch (e) {
											alert(e.message);
										}
									},
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth,
									y: 9 * settings.general.margin +
										7 * settings.dialog.lineHeight,
									width: 220,
									height: settings.dialog.lineHeight
								},
								facilityState: {
									type: "ListHost",
									modes: ['Classroom class proj3'],
									constructorParameterString: "true, true",
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth + 235,
									y: 9 * settings.general.margin +
										7 * settings.dialog.lineHeight,
									width: 50,
									height: 200
								},
								facilityZip: {
									type: "Edit",
									multiline: false,
									modes: ['Classroom class proj3'],
									exitFocus: function (localSelf) {
										try {
											// Validate?
											m_facilty.zip = localSelf.getText().trim();

										} catch (e) {
											alert(e.message);
										}
									},
									x: 2 * settings.general.margin +
										settings.dialog.firstColumnWidth + 300,
									y: 9 * settings.general.margin +
										7 * settings.dialog.lineHeight,
									width: 100,
									height: settings.dialog.lineHeight
								},
								backButton: {
									type: "Button",
									modes: ['Normal proj','Classroom class proj1','Classroom class proj2','Classroom class proj3','Online class proj1','Online class proj2','Product proj'],
									text: "< Back",
									x: settings.general.margin,
									yType: "reserve",
									y: 100,
									width: 140,
									height: 40,
									click: function() {

										if (!manager.userAllowedToCreateEditPurchProjs) {

											manager.resetCenterPanelTitle('New Project');
											self.dialog.setMode('Sel Proj Type-normal user');

										} else {

											let currmode = self.dialog.getMode();
											if (currmode === 'Normal proj' || currmode === 'Classroom class proj1' || currmode === 'Online class proj1' || currmode === 'Product proj') {
												manager.resetCenterPanelTitle('New Project');
												self.dialog.setMode('Sel Proj Type-priv user');
											} else if (currmode === 'Classroom class proj2') {
												manager.resetCenterPanelTitle('Classroom project 1');
												self.dialog.setMode('Classroom class proj1');
											} else if (currmode === 'Classroom class proj3') {
												manager.resetCenterPanelTitle('Classroom project 2');
												self.dialog.setMode('Classroom class proj2');
											} else if (currmode === 'Online class proj2') {
												manager.resetCenterPanelTitle('Online project 1');
												self.dialog.setMode('Online class proj1');
											}
										}
									}
								},
								nextButton: {
									type: "Button",
									modes: ['Sel Proj Type-priv user','Classroom class proj1','Classroom class proj2','Online class proj1'],
									text: "Next >",
									x: settings.general.margin +
										settings.dialog.firstColumnWidth,
									yType: "reserve",
									y: 100,
									width: 140,
									height: 40,
									click: function() {

										let currmode = self.dialog.getMode();
										if (currmode === 'Sel Proj Type-priv user') {

											if (m_projectModeId === 1) {
												manager.resetCenterPanelTitle('Normal project');
												self.dialog.setMode('Normal proj');
											} else if (m_projectModeId === 2) {
												manager.resetCenterPanelTitle('Classroom project 1');
												self.dialog.setMode('Classroom class proj1');
											} else if (m_projectModeId === 3) {
												manager.resetCenterPanelTitle('Online project 1');
												self.dialog.setMode('Online class proj1');
											} else if (m_projectModeId === 4) {
												manager.resetCenterPanelTitle('Product project 1');
												self.dialog.setMode('Product proj');
											}
										} else if (currmode === 'Classroom class proj1') {
											manager.resetCenterPanelTitle('Classroom project 2');
											self.dialog.setMode('Classroom class proj2');
										} else if (currmode === 'Classroom class proj2') {
											manager.resetCenterPanelTitle('Classroom project 3');
											self.dialog.setMode('Classroom class proj3');
										} else if (currmode === 'Online class proj1') {
											manager.resetCenterPanelTitle('Online project 2');
											self.dialog.setMode('Online class proj2');
										}
									}
								},
								cancelButton: {
									type: "Button",
									modes: ['Sel Proj Type-normal user','Sel Proj Type-priv user','Normal proj','Classroom class proj1','Classroom class proj2','Classroom class proj3','Online class proj1','Online class proj2','Product proj'],
									text: "Cancel",
									x: settings.general.margin +
										2 * settings.dialog.firstColumnWidth,
									yType: "reserve",
									y: 100,
									width: 110,
									height: 40,
									click: function() {
										try {
											if (window.methodBuilder) {

												// TODO: getting currentMethod = null even when I think there should be one. Ask Ken.
												let exceptionRet = manager.selectMethod(window.methodBuilder.currentMethod);
												if (exceptionRet) {
													throw exceptionRet;
												}
											}
										} catch (e) {
											errorHelper.show(e);
										}
									}
								},
								createProjectButton: {
									type: "Button",
									modes: ['Normal proj','Classroom class proj3','Online class proj2','Product proj'],
									text: "Create Project",
									xType: "reserve",
									x: 2 * settings.dialog.firstColumnWidth + 20,
									yType: "reserve",
									y: 100,
									width: 210,
									height: 40,
									click: function() {

										try {

											// client.unloadProject(null, true);		// I believe we're already unloaded.

											// Create project based on the new project dialog's fields--or lack thereof.
											// Call client to inject it throughout.

											var exceptionRet = client.openProjectFromDB(
												m_projectTypeId,
												'new',
												function(){	// callback is used to set fields after async fetch of empty-ish core project from db.

													client.project.isCoreProject = false;

													client.project.name = m_strProjectName;
													client.project.description = m_strProjectDescription;
													client.project.imageId = m_imageId;
													if (m_imageId) {
														client.project.altImagePath = '';
													}

													// Now we'll add the fields to the project that will both tell the rest of the UI how to handle it and will affect how it gets saved to the database.
													// Since there's already a client.project.specialProjectData (although it may be empty), we'll merge new stuff into the existing.
													var spd = {
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

													client.project.specialProjectData = Object.assign(client.project.specialProjectData, spd);

													if (m_bClassProject) {

														client.project.isClass = true;

														client.project.specialProjectData.classData = {
															id: 200,
															active: false,
															classDescription: m_strProjectDescription,
															instructorFirstName: m_instructor.first,
															instructorLastName: m_instructor.last,
															instructorPhone: m_instructor.phone,
															facility: m_facilty.name,
															address: m_facilty.address,
															room: m_facilty.room,
															city: m_facilty.city,
															state: m_facilty.state,
															zip: m_facilty.zip,
															schedule: m_arrWhen,
															level: m_strLevel,
															difficulty: m_strDifficulty,
															price: m_dPrice,
															classNotes: m_strNotes,
															maxclassroomClassize: m_iMaxClassSize,
															loanComputersAvailable: m_bLoaners,
															imageId: m_imageId
														};

													} else if (m_bProductProject) {

														client.project.isProduct = true;

														// Remember all data but name is optional until we're about to make the product active.
														client.project.specialProjectData.productData = {
															id: 200,
															active: false,
															productDescription: m_strProjectDescription,
															level: m_strLevel,
															difficulty: m_strDifficulty,
															price: m_dPrice,
															imageId: m_imageId
														};
													} else if (m_bOnlineClassProject) {

														client.project.isOnlineClass = true;

														client.project.specialProjectData.onlineClassData = {
															id: 200,
															active: false,
															classDescription: m_strProjectDescription,
															instructorFirstName: m_instructor.first,
															instructorLastName: m_instructor.last,
															instructorEmail: m_instructor.email,
															schedule: m_arrWhen,
															level: m_strLevel,
															difficulty: m_strDifficulty,
															price: m_dPrice,
															classNotes: m_strNotes,
															imageId: m_imageId
														};
													}

													var exceptionRet = manager.loadProject(client.project);
													if (exceptionRet) { throw exceptionRet; }

													client.setBrowserTabAndBtns();
												}
											);
											if (exceptionRet) { throw exceptionRet; }

										} catch (e) {
											errorHelper.show(e);
										}
									}
								}
                            };

                            // Finally...create the Dialog with its controls, based on Normal or Privileged user status.
                            let exceptionRet = self.dialog.create(
                                objectConfiguration,
                                !manager.userAllowedToCreateEditPurchProjs ? 'Sel Proj Type-normal user' : 'Sel Proj Type-priv user'
                            );

                            if (exceptionRet) {
                                return exceptionRet;
                            }

							// At first, for privileged user, nextButton is disabled.
							if (self.dialog.getMode() === 'Sel Proj Type-priv user') {

								let btn = self.dialog.controlObject["nextButton"];
								btn.setProtected(true);
							}

							// And createProjectButton is disabled to start in all cases until Name is entered.
							let cb = self.dialog.controlObject["createProjectButton"];
							cb.setProtected(true);

                            ////////////////////////
                            // Fill self.dialog.controlObject["projectTypes"] with array of images based upon arrayAvailProjTypes.
                            let lhProjectTypes = self.dialog.controlObject["projectTypes"];
                            let listProjectTypes = lhProjectTypes.list;
                            let index = 0;

                            listProjectTypes.destroy(); // Don't check result because if destroy fails, that's because it hadn't been created, so it's ok.
                            let arrayOutput = arrayAvailProjTypes.map((projTypeId) => {

                                let pliNew = new PictureListItem(m_arrayProjectTypeNames[projTypeId - 1], projTypeId, index++);
                                pliNew.clickHandler = (id) => {

                                    // self is NewProjectDialog instance.
                                    m_projectTypeId = id;

                                    let i3 = self.dialog.controlObject["instructions3"];
                                    let ptName = m_arrayProjectTypeNames[projTypeId - 1];
                                    i3.text = "Enter details for your new " + ptName.charAt(0).toUpperCase() + ptName.slice(1) + (ptName === 'empty' ? " Project." : "-based Project.");

                                    let iPI = self.dialog.controlObject["projectImage"];
                                    iPI.setUrl(resourceHelper.toURL("images", null, null, m_arrayProjectTypeNames[m_projectTypeId - 1] + "Project.png"));
                                    iPI.recreate();

                                    if (self.dialog.getMode() === "Sel Proj Type-normal user") {

                                        // Normal user just switches mode to create new project.
										manager.resetCenterPanelTitle('Normal project');
                                        self.dialog.setMode('Normal proj');

                                    } else if (self.dialog.getMode() === "Sel Proj Type-priv user") {

                                        // Privileged user has selected a project type. Outline its PictureListItem in listHost (un-outline all others first).
                                        lhProjectTypes.removeAllOutlines();
                                        pliNew.setOutline(true);

										if (m_projectModeId) {

											let btn = self.dialog.controlObject["nextButton"];
											btn.setProtected(false);
										}
                                    }
                                };
                                return pliNew;
                            });
                            listProjectTypes.create(arrayOutput);

							///////////////////////////////
							// Only for the privileged user.
                            if (manager.userAllowedToCreateEditPurchProjs) {

								/////////////////////////
                                // Fill self.dialog.controlObject["ncopChoice"] with array of RadioListItems.
                                let lh_ncopChoice = self.dialog.controlObject["ncopChoice"];
                                let listProjectModes = lh_ncopChoice.list;
                                let id = 1;	// <-- Note that this starts at 1 on purpose.

                                listProjectModes.destroy();
                                let arrayOutput = m_arrayProjectModeNames.map((projMode) => {

                                    let rliNew = new RadioListItem(projMode, id++);
                                    rliNew.clickHandler = (id) => {

										m_projectModeId = id;

										m_bNormalProject = false;
										m_bClassProject = false;
										m_bOnlineClassProject = false;
										m_bProductProject = false;
										switch (m_projectModeId) {
											case 1:
												m_bNormalProject = true;
												break;
											case 2:
												m_bClassProject = true;
												break;
											case 3:
												m_bOnlineClassProject = true;
												break;
											case 4:
												m_bProductProject = true;
												break;
										}

                                        // Privileged user has selected a project mode. Outline its RadioListItem in listHost (un-outline all others first).
                                        lh_ncopChoice.removeAllOutlines();
                                        rliNew.setOutline(true);

										if (m_projectTypeId) {

											let btn = self.dialog.controlObject["nextButton"];
											btn.setProtected(false);
										}
                                    };
                                    return rliNew;
                                });
                                listProjectModes.create(arrayOutput);

								/////////////////////////
                                // Fill self.dialog.controlObject["level"] with array of RadioListItems.
                                let lh_level = self.dialog.controlObject["level"];
                                let listLevels = lh_level.list;
                                id = 0;

                                listLevels.destroy();
                                arrayOutput = m_arrayLevels.map((level) => {

                                    let rliNew = new RadioListItem(level, id++);
                                    rliNew.clickHandler = (id) => {

										m_strLevel = m_arrayLevels[id];

                                        // User has selected a level. Outline its RadioListItem in listHost (un-outline all others first).
                                        lh_level.removeAllOutlines();
                                        rliNew.setOutline(true);
                                    };
                                    return rliNew;
                                });
                                listLevels.create(arrayOutput);

								/////////////////////////
                                // Fill self.dialog.controlObject["difficulty"] with array of RadioListItems.
                                let lh_difficulty = self.dialog.controlObject["difficulty"];
                                let listDifficulties = lh_difficulty.list;
                                id = 0;

                                listDifficulties.destroy();
                                arrayOutput = m_arrayDifficulties.map((difficulty) => {

                                    let rliNew = new RadioListItem(difficulty, id++);
                                    rliNew.clickHandler = (id) => {

										m_strDifficulty = m_arrayDifficulties[id];

                                        // User has selected a difficulty. Outline its RadioListItem in listHost (un-outline all others first).
                                        lh_difficulty.removeAllOutlines();
                                        rliNew.setOutline(true);
                                    };
                                    return rliNew;
                                });
                                listDifficulties.create(arrayOutput);

								/////////////////////////
                                // Fill self.dialog.controlObject["loaners"] with array of RadioListItems.
                                let lh_loaners = self.dialog.controlObject["loaners"];
                                let listLoaners = lh_loaners.list;
                                id = 0;

                                listLoaners.destroy();
                                arrayOutput = m_arrayLoanersAvailable.map((loaner) => {

                                    let rliNew = new RadioListItem(loaner, id++);
                                    rliNew.clickHandler = (id) => {

										m_bLoaners = !id;

                                        // User has selected loaners. Outline its RadioListItem in listHost (un-outline all others first).
                                        lh_loaners.removeAllOutlines();
                                        rliNew.setOutline(true);
                                    };
                                    return rliNew;
                                });
                                listLoaners.create(arrayOutput);

								/////////////////////////
                                // Fill self.dialog.controlObject["facilityState"] with array of RadioListItems.
                                let lh_facilityStates = self.dialog.controlObject["facilityState"];
                                let listFacilityStates = lh_facilityStates.list;
                                id = 0;

                                listFacilityStates.destroy();
                                arrayOutput = m_arrayStates.map((state) => {

                                    let rliNew = new RadioListItem(state, id++);
                                    rliNew.clickHandler = (id) => {

										m_facilty.state = m_arrayStates[id];

                                        // User has selected states. Outline its RadioListItem in listHost (un-outline all others first).
                                        lh_facilityStates.removeAllOutlines();
                                        rliNew.setOutline(true);
                                    };
                                    return rliNew;
                                });
                                listFacilityStates.create(arrayOutput);
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

                            window.newProjectDialog = null;
                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////
                    // Private methods.

					// Display the chosen image.
					var m_functionSetImageSrc = function (imageId) {

						m_imageId = imageId;
                        let iPI = self.dialog.controlObject["projectImage"];
                        iPI.setUrl(resourceHelper.toURL("resources", m_imageId, "image"));
                        iPI.recreate();
					}

                    var m_functionIsEverythingValid = function() {

                        let bValid = false;
                        if (m_strProjectName.length) {

                            bValid = true;
                        }

                        // Once they are added, all of the fields for purchasable projects will need to be validated, too--I think only for correctness here.
						// Presence of all required fields will be checked in ActivatePPDialog.js.

                        return bValid;
                    }

					// strWhen started as this string: "MM/DD/YYYY hh:mm-hh:mm\r\nMM\DD\YYYY hh:mm-hh:mm..." with up to 8 class sessions specified.
					// The user was supposed to overwrite the masks and enter dates and their start and end times in their local timezone.
					// But we're never really sure if the user complied or not.
					// We will build up an array: [{date: '2016-02-02T01:00:00+00:00', duration: 3360000},...] where date holds the date and start time (UTC)
					// and duration in ms. We will save the array to m_arrWhen. We can do this because we have access to moment.js.
					// Any invalid or unentered dates will be returned as: {date: '', duration: 0}.
					var m_functionProcessWhen = function(strWhen) {

						try {

							let arrWhen = [];
							let arrParts = strWhen.split('\r\n');
							for (let i = 0; i < arrParts.length; i++) {

								let partIth = arrParts[i];

								// Let substring return junky results if strWhen is of insufficient length.
								let strDate = partIth.substr(0, 10);
								let strFrom = partIth.substr(11, 5);
								let strThru = partIth.substr(17, 5);

								let mntHypo1 = moment('2016-01-01T' + strFrom);	// to check validity of strFrom
								let mntHypo2 = moment('2016-01-01T' + strThru);	// to check validity of strThru
								let mntDate = moment(strDate, "MM/DD/YYYY");	// to check validty of strDate
								let bValidMntDate = mntDate.isValid();
								let bValidMntHypo1 = mntHypo1.isValid();
								let bValidMntHypo2 = mntHypo2.isValid();

								if (bValidMntDate && bValidMntHypo1 && bValidMntHypo2) {

									let mntDateFromUTC = moment(mntDate.format('YYYY-MM-DD') + 'T' + strFrom).utc();			// Actual class start datetime with utc flag set.
									arrWhen.push({ date: mntDateFromUTC.format(), duration: (mntHypo2.diff(mntHypo1) + 60000)});	// Add 60000 to account for inclusive thru time.

								} else {

									arrWhen.push({date: '', duration: 0});
								}


							}

							m_arrWhen = arrWhen;
							return null;

						} catch(e) {
							return e;
						}
					}

                    ///////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;

					// Array of project type names.
                    var m_arrayProjectTypeNames = ["game","console","website","hololens","mapping","empty"];
                    var m_projectTypeId = 0;

					// Array of project mode names.
					var m_arrayProjectModeNames = ["Normal project","Classroom project","Online class project","Product project"];
                    var m_projectModeId = 0;
					var m_bNormalProject = false;
					var m_bClassProject = false;
					var m_bOnlineClassProject = false;
					var m_bProductProject = false;

					// Array of Levels.
					var m_arrayLevels = ['Elementary school','Middle School','High school and beyond'];
					var m_strLevel = "";

					// Difficulties.
					var m_arrayDifficulties = ['Beginner','Has used the TechGroms system','Has completed a TechGroms class','Almost self-sufficient','An expert!'];
					var m_strDifficulty = "";

					// Loaners available.
					var m_arrayLoanersAvailable = ['Yes','No'];
					var m_bLoaners = false;

					// States.
					var m_arrayStates = ['AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE','FL','GA','GU','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MH','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','PR','PW','RI','SC','SD','TN','TX','UT','VA','VI','VT','WA','WI','WV','WY'];

					// From name Edit.
                    var m_strProjectName = null;
					// From multi-line description Edit.
                    var m_strProjectDescription = null;
					// resourceId for project image.
                    var m_imageId = 0;
					var m_dPrice = 0.00;
					var m_iMaxClassSize = 0;
					var m_instructor = {
						first: "",
						last: "",
						phone: "",
						email: ""
					};
					var m_facilty = {
						name: "",
						address: "",
						room: "",
						city: "",
						state: "",
						zip: ""
					}
					var m_strNotes = "";
					var m_arrWhen = [];

                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
