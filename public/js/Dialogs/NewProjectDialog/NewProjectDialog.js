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
					self.create = function() {

						try {

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/NewProjectDialog/newProjectDialog"
								}, 
								dataType: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionRenderJadeSnippetResponse).error(errorHelper.show);

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
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the TypesDialog jade HTML-snippet.
							//
							// There will be buttons for creating different project configurations:
							// (1) 
							BootstrapDialog.show({

								title: "New Project",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Create Project",
					            		cssClass: "btn-primary",
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
					            onshown: m_functionOnShownDialog
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							m_strUserId = client.getTGCookie("userId");
							$(".tt-selector .btn-default").tooltip();

							// Save the dailog object reference.
							m_dialog = dialogItself;
							m_functionSetImageSrc(0);
							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);
							$("#ProjectName").focus();

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionCreateProject = function () {

						try {

							// Create project based on the new project dialog's fields--or lack thereof.
							// Call client to inject it throughout.

							var strProjectName = $("#ProjectName").val().trim();
							var strProjectDescription = $("#ProjectDescription").val().trim();
							var strProjectTags = $("#ProjectTags").val().trim();

							var exceptionRet = client.openProjectFromDB(1);
							if (exceptionRet) { throw exceptionRet; }

							var clProject = client.getProject();

							clProject.data.name = strProjectName;
							clProject.data.tags = strProjectTags;
							clProject.data.description = strProjectDescription;
							clProject.data.imageResourceId = m_imageResourceId;

							m_dialog.close();

						} catch (e) {

							errorHelper.show(e);
						}
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
					var m_functionSetImageSrc = function (imageResourceId) {

						m_imageResourceId = imageResourceId;
						$("#ProjectImage").attr("src", resourceHelper.toURL("resources", m_imageResourceId, "image"));
					}
				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_strUserId = '';
				var m_comicName = '';
				var m_comicTags = '';
				var m_imageResourceId = 0;

			// 	var m_projects = 
			// 	[
			// 		// m_projects[0] is
			// 		{
			// 			name: m_strProjectName,
			// 			id: 0,
			// 			description: m_strProjectDescription,
			// 			tags: m_strProjectTags,
			// 			imageResourceId: m_imageResourceId,
			// 			price: 0,
			// 			createdByUserId: m_strUserId,
			// 			isDirty: true,
			// 			comics: 
			// 			{
			// 				items: [
			// 					{
			// 						imageResourceId: 0,
			// 						id: 0,
			// 						name: 'comic1',
			// 						tags: 'tagComic',
			// 						ordinal: 0,
			// 						comicPanels: {
			// 							items: [
			// 								{name: "XYZ", url: "http://www.google.com", description: "descr1", ordinal: 0, thumbnail: "tn1.png"},
			// 								{name: "ABC", url: "http://www.bing.com", description: "descr2", ordinal: 1, thumbnail: "tn2.jpg"}
			// 							]
			// 						},
			// 						types: {
			// 							items: [
			// 								{
			// 									isApp: true,
			// 									id: 0,
			// 									ordinal: 0,
			// 									tags: 'tagType',
			// 									dependencies: [],
			// 									name: "app",
			// 									imageResourceId: 0,
			// 									methods: [
			// 										{id: 0, name: "initialize", workspace: "", imageResourceId: 0, ordinal: 0, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method1", workspace: "", imageResourceId: 0, ordinal: 1, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2a", workspace: "", imageResourceId: 0, ordinal: 2, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2b", workspace: "", imageResourceId: 0, ordinal: 3, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2c", workspace: "", imageResourceId: 0, ordinal: 4, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2d", workspace: "", imageResourceId: 0, ordinal: 5, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2e", workspace: "", imageResourceId: 0, ordinal: 6, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2f", workspace: "", imageResourceId: 0, ordinal: 7, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method3g", workspace: "", imageResourceId: 0, ordinal: 8, tags: "", createdByUserId: m_strUserId, price: 0}
			// 									],
			// 									properties: [
			// 										{id: 0, name: "property1", propertyTypeId: 1, initialValue: "3.14", ordinal: 0},
			// 										{id: 0, name: "property2", propertyTypeId: 2, initialValue: "1-10", ordinal: 1},
			// 										{id: 0, name: "property3", propertyTypeId: 3, initialValue: "Jerry", ordinal: 2},
			// 										{id: 0, name: "property4", propertyTypeId: 4, initialValue: "true", ordinal: 3},
			// 										{id: 0, name: "property5", propertyTypeId: 4, initialValue: "false", ordinal: 4},
			// 										{id: 0, name: "property6", propertyTypeId: 5, initialValue: "jerry john ken", ordinal: 5},
			// 										{id: 0, name: "property7", propertyTypeId: 6, initialValue: "", ordinal: 6},
			// 										{id: 0, name: "property8", propertyTypeId: 2, initialValue: "1000-1999", ordinal: 7},
			// 										{id: 0, name: "property9", propertyTypeId: 3, initialValue: "Hello to you", ordinal: 8}
			// 									],
			// 									events: [
			// 										{id: 0, name: "event1", ordinal: 0},
			// 										{id: 0, name: "event12", ordinal: 1},
			// 										{id: 0, name: "event123", ordinal: 2},
			// 										{id: 0, name: "event1234", ordinal: 3}
			// 									]
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 1,
			// 									tags: 'tagType1',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type1",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 2,
			// 									tags: 'tagType2',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type2",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 3,
			// 									tags: 'tagType3',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type3",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 4,
			// 									tags: 'tagType4',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type4",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 5,
			// 									tags: 'tagType5',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type5",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 6,
			// 									tags: 'tagType6',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type6",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 7,
			// 									tags: 'tagType7',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type7",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 8,
			// 									tags: 'tagType8',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type8",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 9,
			// 									tags: 'tagType9',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type9",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 10,
			// 									tags: 'tagType10',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type10",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 11,
			// 									tags: 'tagType11',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type11",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 12,
			// 									tags: 'tagType12',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type12",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 13,
			// 									tags: 'tagType13',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type13",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 14,
			// 									tags: 'tagType14',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type14",
			// 									imageResourceId: 0
			// 								}
			// 							]
			// 						}
			// 					},
			// 					{
			// 						imageResourceId: 1,
			// 						id: 1,
			// 						name: 'comic2',
			// 						tags: 'tagComic',
			// 						ordinal: 1,
			// 						comicPanels: {
			// 							items: [
			// 								{name: "XYZ", url: "http://www.techgroms.com", description: "descr1", ordinal: 0, thumbnail: "tn3.png"}
			// 							]
			// 						},
			// 						types: { 
			// 							items: [
			// 								{
			// 									isApp: true,
			// 									id: 0,
			// 									ordinal: 0,
			// 									tags: 'tagType',
			// 									dependencies: [],
			// 									name: "app",
			// 									imageResourceId: 0,
			// 									methods: [
			// 										{id: 0, name: "initialize", workspace: "", imageResourceId: 0, ordinal: 0, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method1", workspace: "", imageResourceId: 0, ordinal: 1, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2a", workspace: "", imageResourceId: 0, ordinal: 2, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2b", workspace: "", imageResourceId: 0, ordinal: 3, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2c", workspace: "", imageResourceId: 0, ordinal: 4, tags: "", createdByUserId: m_strUserId, price: 0}
			// 									],
			// 									properties: [
			// 										{id: 0, name: "property1", propertyTypeId: 1, initialValue: "123", ordinal: 0},
			// 										{id: 0, name: "property2", propertyTypeId: 2, initialValue: "7-11", ordinal: 1},
			// 										{id: 0, name: "property3", propertyTypeId: 5, initialValue: "1 2 3 4 5 6 7 8 9", ordinal: 2}
			// 									],
			// 									events: [
			// 										{id: 0, name: "event1", ordinal: 0}
			// 									]
			// 								}
			// 							]
			// 						}
			// 					}
			// 				]
			// 			}
			// 		},
			// 		// m_projects[1] is
			// 		{
			// 			name: m_strProjectName,
			// 			id: 0,
			// 			description: m_strProjectDescription,
			// 			tags: m_strProjectTags,
			// 			imageResourceId: m_imageResourceId,
			// 			price: 0,
			// 			createdByUserId: m_strUserId,
			// 			isDirty: true,
			// 			comics: 
			// 			{
			// 				items: [
			// 					{
			// 						imageResourceId: 1,
			// 						id: 0,
			// 						name: 'comic0',
			// 						tags: 'tagComic',
			// 						ordinal: 0,
			// 						comicPanels: {
			// 							items: [
			// 								{name: "XYZ", url: "http://www.techgroms.com", description: "descr1", ordinal: 0, thumbnail: "tn3.png"}
			// 							]
			// 						},
			// 						types: { 
			// 							items: [
			// 								{
			// 									isApp: true,
			// 									id: 0,
			// 									ordinal: 0,
			// 									tags: 'tagType',
			// 									dependencies: [],
			// 									name: "app",
			// 									imageResourceId: 0,
			// 									methods: [],
			// 									properties: [],
			// 									events: []
			// 								}
			// 							]
			// 						}
			// 					},
			// 					{
			// 						imageResourceId: 0,
			// 						id: 1,
			// 						name: 'comic1',
			// 						tags: 'tagComic',
			// 						ordinal: 1,
			// 						comicPanels: {
			// 							items: [
			// 								{name: "XYZ", url: "http://www.google.com", description: "descr1", ordinal: 0, thumbnail: "tn1.png"},
			// 								{name: "ABC", url: "http://www.bing.com", description: "descr2", ordinal: 1, thumbnail: "tn2.jpg"}
			// 							]
			// 						},
			// 						types: {
			// 							items: [
			// 								{
			// 									isApp: true,
			// 									id: 0,
			// 									ordinal: 0,
			// 									tags: 'tagType',
			// 									dependencies: [],
			// 									name: "app",
			// 									imageResourceId: 0,
			// 									methods: [
			// 										{id: 0, name: "initialize", workspace: "", imageResourceId: 0, ordinal: 0, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method1", workspace: "", imageResourceId: 0, ordinal: 1, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2a", workspace: "", imageResourceId: 0, ordinal: 2, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2b", workspace: "", imageResourceId: 0, ordinal: 3, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2c", workspace: "", imageResourceId: 0, ordinal: 4, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2d", workspace: "", imageResourceId: 0, ordinal: 5, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2e", workspace: "", imageResourceId: 0, ordinal: 6, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method2f", workspace: "", imageResourceId: 0, ordinal: 7, tags: "", createdByUserId: m_strUserId, price: 0},
			// 										{id: 0, name: "method3g", workspace: "", imageResourceId: 0, ordinal: 8, tags: "", createdByUserId: m_strUserId, price: 0}
			// 									],
			// 									properties: [
			// 										{id: 0, name: "property1", propertyTypeId: 1, initialValue: "3.14", ordinal: 0},
			// 										{id: 0, name: "property2", propertyTypeId: 2, initialValue: "1-10", ordinal: 1},
			// 										{id: 0, name: "property3", propertyTypeId: 3, initialValue: "Jerry", ordinal: 2},
			// 										{id: 0, name: "property4", propertyTypeId: 4, initialValue: "true", ordinal: 3},
			// 										{id: 0, name: "property5", propertyTypeId: 4, initialValue: "false", ordinal: 4},
			// 										{id: 0, name: "property6", propertyTypeId: 5, initialValue: "jerry john ken", ordinal: 5},
			// 										{id: 0, name: "property7", propertyTypeId: 6, initialValue: "", ordinal: 6},
			// 										{id: 0, name: "property8", propertyTypeId: 2, initialValue: "1000-1999", ordinal: 7},
			// 										{id: 0, name: "property9", propertyTypeId: 3, initialValue: "Hello to you", ordinal: 8}
			// 									],
			// 									events: [
			// 										{id: 0, name: "event1", ordinal: 0},
			// 										{id: 0, name: "event12", ordinal: 1},
			// 										{id: 0, name: "event123", ordinal: 2},
			// 										{id: 0, name: "event1234", ordinal: 3}
			// 									]
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 1,
			// 									tags: 'tagType1',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type1",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 2,
			// 									tags: 'tagType2',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type2",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 3,
			// 									tags: 'tagType3',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type3",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 4,
			// 									tags: 'tagType4',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type4",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 5,
			// 									tags: 'tagType5',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type5",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 6,
			// 									tags: 'tagType6',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type6",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 7,
			// 									tags: 'tagType7',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type7",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 8,
			// 									tags: 'tagType8',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type8",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 9,
			// 									tags: 'tagType9',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type9",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 10,
			// 									tags: 'tagType10',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type10",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 11,
			// 									tags: 'tagType11',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type11",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 12,
			// 									tags: 'tagType12',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type12",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 13,
			// 									tags: 'tagType13',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type13",
			// 									imageResourceId: 0
			// 								},
			// 								{
			// 									isApp: false,
			// 									id: 0,
			// 									ordinal: 14,
			// 									tags: 'tagType14',
			// 									properties: [],
			// 									methods: [],
			// 									events: [],
			// 									dependencies: [],
			// 									name: "Type14",
			// 									imageResourceId: 0
			// 								}
			// 							]
			// 						}
			// 					}
			// 				]
			// 			}
			// 		},
			// 		// m_projects[2] is
			// 		{
			// 			name: m_strProjectName,
			// 			id: 0,
			// 			description: m_strProjectDescription,
			// 			tags: m_strProjectTags,
			// 			imageResourceId: m_imageResourceId,
			// 			price: 0,
			// 			createdByUserId: m_strUserId,
			// 			isDirty: true,
			// 			comics: 
			// 			{
			// 				items: [
			// 					{
			// 						imageResourceId: 1,
			// 						id: 0,
			// 						name: 'comic0',
			// 						tags: 'tagComic',
			// 						ordinal: 0,
			// 						comicPanels: {
			// 							items: [
			// 								{name: "XYZ", url: "http://www.techgroms.com", description: "descr1", ordinal: 0, thumbnail: "tn3.png"}
			// 							]
			// 						},
			// 						types: { 
			// 							items: [
			// 								{
			// 									isApp: true,
			// 									id: 0,
			// 									ordinal: 0,
			// 									tags: 'tagType',
			// 									dependencies: [],
			// 									name: "app",
			// 									imageResourceId: 0,
			// 									methods: [],
			// 									properties: [],
			// 									events: []
			// 								}
			// 							]
			// 						}
			// 					}
			// 				]
			// 			}
			// 		}
			// 	];
			};

			// Return the constructor function as the module object.
			return functionNewProjectDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
