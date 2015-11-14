////////////////////////////////////
// NewTypeDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper", "Code/Type"], 
	function (snippetHelper, errorHelper, resourceHelper, Type) {

		try {

			// Define the NewTypeDialog constructor function.
			var functionNewTypeDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function(strNewOrEdit, iIndexIfEdit) {

						try {

							m_strNewOrEdit = strNewOrEdit;
							m_iIndexIfEdit = iIndexIfEdit;
							m_clActiveComic = comics.getActiveComic();
							m_typesArray = m_clActiveComic.getYourTypesArray();
							if (m_strNewOrEdit === "Edit") {

								// Put the type being edited aside for reference later.
								m_typeForEdit = m_typesArray[m_iIndexIfEdit];
							}

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/NewTypeDialog/newTypeDialog"
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
							BootstrapDialog.show({

								title: (m_strNewOrEdit === "New") ? "Add new Type" : "Edit Type",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Save Type",
					            		id: 'CreateTypeBtn',
					            		cssClass: "btn-primary",
					            		action: function(){

					            			m_functionSaveType();
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
					            draggable: true,
					            onshown: m_functionOnShownDialog
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							$(".tt-selector .btn-default").powerTip({
								smartPlacement: true
							});

							// Save the dailog object reference.
							m_dialog = dialogItself;
							m_functionSetImageSrc(0);
							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);
							$("#TypeName").focus();

							$("#TypeName").keyup(m_functionBlurTypeName);

							$("#BaseTypeCombo").css("display", "none");
							$("#BaseTypeName").css("display", "none");
							var exceptionRet = null;
							if (m_strNewOrEdit === "New") {

								// User is creating a new user Type.
								// A user Type is not a sysem base Type (ordinal === null) nor the App Type.
								// It may or may not be based on an existing user Type.
								// We will build and display a select list of available base Types, starting with None.

								// Set up #BaseTypeSelect for user to select a base type for this new type.
								// Choices are "None" and the names of all user types in the comic.
								exceptionRet = m_prepareBaseTypeSelectList();
								if (exceptionRet) { throw exceptionRet; }

							} else {

								// Initialize fields that user can edit.
								$("#TypeName").val(m_typeForEdit.name);
								$("#TypeTags").val(m_typeForEdit.tags);
								var strUrl = resourceHelper.toURL('resources', m_typeForEdit.imageId, 'image', '');
								$("#TypeImage").attr("src", strUrl);

								// User may be editing (1) a user Type (not a system base Type or the App Type)
								// or (2) the App Type.
								// In case (1) prepare a base Type select list of all user Type names plus "None"
								// and select either "None" of this Type's base Type name.
								// In case (2) user cannot change the base Type since this is the project type.
								// But user will be shown the system base Type's name. User can edit all other fields.

								var strSelectName = "None";
								if (m_typeForEdit.baseTypeId) {

									for (var i = 0; i < m_typesArray.length; i++) {

										var typeIth = m_typesArray[i];
										if (typeIth.id === m_typeForEdit.baseTypeId) {

											strSelectName = typeIth.name;
											break;
										}
									}
								}

								if (m_typeForEdit.isApp) {

									$("#BaseTypeNameSpan").text(strSelectName);
									$("#BaseTypeName").css("display", "block");

								} else {

									exceptionRet = m_prepareBaseTypeSelectList();
									if (exceptionRet) { throw exceptionRet; }

									// Select the current base type.
									$("#BaseTypeSelect").val(strSelectName);
								}
							}

							m_setStateCreateBtn();

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_prepareBaseTypeSelectList = function() {

						try {

								var strBuild = '<option value="None">None</option>';

								for(var i = 0; i < m_typesArray.length; i++) {

									var typeIth = m_typesArray[i];
									if (!typeIth.isApp && typeIth.ordinal) {

										strBuild += '<option value="' + typeIth.name + '">' + typeIth.name + '</option>';
									}
								}

								$("#BaseTypeSelect").html(strBuild);
								var exceptionRet = m_setSelectHandlers();
								if (exceptionRet) { throw exceptionRet; }

								$("#BaseTypeCombo").css("display", "block");

								return null;

							} catch(e) {

								return e;
							}
					}

					var m_setSelectHandlers = function () {

						try {

							var jqs = $("#BaseTypeSelect");
							jqs.mousedown(function(){if(this.options.length>8){this.size=8;}});
							jqs.change(function(){this.size=0;});
							jqs.blur(function(){this.size=0;});

							return null;

						} catch (e) {

							return e;
						}
					}

					var m_functionBlurTypeName = function() {

						m_setStateCreateBtn();
					}

					var m_setStateCreateBtn = function() {

						if (!($("#TypeName").val().trim().length)) {
							$("#CreateTypeBtn").addClass("disabled");
						} else {
							$("#CreateTypeBtn").removeClass("disabled");
						}
					}

					var m_functionSaveType = function () {

						try {

							var typeName = $("#TypeName").val().trim();

							if (typeName.length === 0) {

								throw new Error("You must enter a name.");
							}

							var typeTags = $("#TypeTags").val() || "";

							var exceptionRet = validator.isTypeNameAvailableInActiveComic(typeName, m_strNewOrEdit === "New" ? -1 : m_iIndexIfEdit);
							if (exceptionRet) { throw exceptionRet; }

							// First, handle the possible setting of a base type.
							var setBaseTypeId;
							if (m_strNewOrEdit === "New" ||
								(m_strNewOrEdit === "Edit" && !m_typeForEdit.isApp)) {

								var selectVal = $("#BaseTypeSelect").val();
								if (selectVal !== "None") {

									for (var i = 0; i < m_typesArray.length; i++) {

										var typeIth = m_typesArray[i];
										if (typeIth.name === selectVal) {

											setBaseTypeId = typeIth.id;
											break;
										}
									}
								} else {

									setBaseTypeId = null;
								}
							} else {

								setBaseTypeId = m_typeForEdit.baseTypeId;
							}

							var clType = new Type();

							if (m_strNewOrEdit === "New") {

								// Create minimal Type based on the dialog's fields--or lack thereof.
								// Call client to inject it throughout.

								// Pick an unused (in this comic) negative id. This will be used
								// in case this Type is used as a base type before the project is saved
								// and to indicate that in the save project code, the id has to be replaced
								// with the database-assigned id and any baseTypeIds that contained the negative
								// number need to be changed.
								var typeId = -1;
								for (var i = 0; i < m_typesArray.length; i++) {

									var typeIth = m_typesArray[i];
									if (typeIth.id < typeId) {

										typeId = typeIth.id - 1;
									}
								}
								var typeJO = 
								{
									id: typeId,
									originalTypeId: 0,
									name: typeName,
									ownedByUserId: g_strUserId,
									public: 0,
									quarantined: 0,
									isApp: false,
									imageId: m_imageId,
									ordinal: client.getNumberOfTypesInActiveComic(),
									description: '',
									parentTypeId: 0,
									parentPrice: 0.00,
									priceBump: 0.00,
									tags: typeTags,
									properties: [
										{id: 0, originalPropertyId: 0, name: "X", propertyTypeId: 1, initialValue: "0", ordinal: 0, isHidden: 1},
										{id: 0, originalPropertyId: 0, name: "Y", propertyTypeId: 1, initialValue: "0", ordinal: 1, isHidden: 1},
										{id: 0, originalPropertyId: 0, name: "Width", propertyTypeId: 1, initialValue: "0", ordinal: 2, isHidden: 1},
										{id: 0, originalPropertyId: 0, name: "Height", propertyTypeId: 1, initialValue: "0", ordinal: 3, isHidden: 1}
									],
									methods: [
										{id: 0, name: 'construct', ordinal: 0, ownedByUserId: g_strUserId, public: 0, workspace: '', imageId: 0, methodTypeId: 4, parameters: ''}
									],
									events: [],
									baseTypeId: setBaseTypeId,
									isToolStrip: 1
								};

								exceptionRet = clType.load(typeJO);
								if (exceptionRet) { throw exceptionRet; }

								exceptionRet = client.addTypeToProject(clType);
								if (exceptionRet) { throw exceptionRet; }

							} else {

								m_typeForEdit.name = typeName;
								m_typeForEdit.tags = typeTags;
								m_typeForEdit.imageId = m_imageId;
								m_typeForEdit.baseTypeId = setBaseTypeId;

								exceptionRet = clType.load(m_typeForEdit);
								if (exceptionRet) { throw exceptionRet; }

								exceptionRet = client.updateTypeInProject(clType, m_clActiveComic, m_typeForEdit, m_iIndexIfEdit);
								if (exceptionRet) { throw exceptionRet; }

								clType.updateYourImage(m_imageId);
							}

							m_dialog.close();

						} catch (e) {

							errorHelper.show(e);
						}
					}

					// 3 functions to handle the Image changing link clicks.
					var m_functionSearchClick = function () {

						try {

							var exceptionRet = client.showImageSearchDialog(true, m_functionSetImageSrc);
							if (exceptionRet) { throw exceptionRet; }

						} catch(e) {

							errorHelper.show(e);
						}
					}
					
					var m_functionURLClick = function () {

						try {

							var exceptionRet = client.showImageURLDialog(true, m_functionSetImageSrc);
							if (exceptionRet) { throw exceptionRet; }

						} catch(e) {

							errorHelper.show(e);
						}
					}
					
					var m_functionDiskClick = function () {

						try {

							var exceptionRet = client.showImageDiskDialog(true, m_functionSetImageSrc);
							if (exceptionRet) { throw exceptionRet; }

						} catch(e) {

							errorHelper.show(e);
						}
					}

					// Display the chosen image.
					var m_functionSetImageSrc = function (imageId) {

						m_imageId = imageId;
						$("#TypeImage").attr("src", resourceHelper.toURL("resources", m_imageId, "image"));
					}
				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_strNewOrEdit = "";
				var m_iIndexIfEdit = -1;
				var m_imageId = 0;
				var m_typeForEdit;
				var m_clActiveComic;
				var m_typesArray;
			};

			// Return the constructor function as the module object.
			return functionNewTypeDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
