////////////////////////////////////
// NewMethodDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the NewMethodDialog constructor function.
			var functionNewMethodDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function(strNewOrEdit, iIndexIfEdit) {

						try {

							m_strNewOrEdit = strNewOrEdit;
							m_iIndexIfEdit = iIndexIfEdit;
							m_clActiveType = types.getActiveClType(false);
							if (m_strNewOrEdit === "Edit") {

								// Put the method being edited aside for reference later.
								m_methodForEdit = m_clActiveType.data.methods[iIndexIfEdit];
							}

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/NewMethodDialog/newMethodDialog"
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

								title: (m_strNewOrEdit === "New") ? "Add new Method" : "Edit Method",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Save Method",
					            		id: 'CreateMethodBtn',
					            		cssClass: "btn-primary",
					            		action: function(){

					            			m_functionSaveMethod();
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
							$("#StatementImg").attr("src", resourceHelper.toURL("images", null, null, 'statement.png'));
							$("#ExpressionImg").attr("src", resourceHelper.toURL("images", null, null, 'expression.png'));
							$("#ImageSearchLink").click(m_functionSearchClick);
							$("#NewImageURLLink").click(m_functionURLClick);
							$("#NewImageDiskLink").click(m_functionDiskClick);
							$("#MethodName").focus();

							$("#MethodName").keyup(m_functionBlurMethodName);

							if (m_strNewOrEdit === "New") {

								m_functionSetImageSrc(0);
								$('input[name=MethodType][value="0"]').prop('checked', true);

							} else {

								$("#MethodName").val(m_methodForEdit.name);
								$("#MethodTags").val(m_methodForEdit.tags);
								m_functionSetImageSrc(m_methodForEdit.imageId);
								$("#MethodParams").val(m_methodForEdit.parameters);
								if (m_methodForEdit.methodTypeId === 1) {

									$('input[name=MethodType][value="0"]').prop('checked', true);

								} else {

									$('input[name=MethodType][value="1"]').prop('checked', true);
								}
							}

							m_setStateCreateBtn();

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionBlurMethodName = function() {

							m_setStateCreateBtn();
					}

					var m_setStateCreateBtn = function() {

						if (!($("#MethodName").val().trim().length)) {
							$("#CreateMethodBtn").addClass("disabled");
						} else {
							$("#CreateMethodBtn").removeClass("disabled");
						}
					}

					var m_functionSaveMethod = function () {

						try {

							var methodName = $("#MethodName").val().trim();

							if (methodName.length === 0) {

								throw new Error("You must enter a name.");
							}

							var exceptionRet = validator.isMethodNameAvailableInActiveType(methodName, m_strNewOrEdit === "New" ? -1 : m_iIndexIfEdit);
							if (exceptionRet) { throw exceptionRet; }

							var methodTypeId = $("input:checked").val() === "0" ? 1 : 2;

							var parameters = "";
							var parametersRaw = $("#MethodParams").val().trim();
							if (parametersRaw.length) {

								// Separate, de-dupe, recombine
								var pArray = parametersRaw.match(/([\w\-]+)/g);
								if (pArray.length) {

						        	// Remove possible dups from pArray.
						            var uniqueArray = [];
								    for (var i = 0; i < pArray.length; i++)
								    {
								        if (($.inArray(pArray[i], uniqueArray)) == -1)
								        {
								            uniqueArray.push(pArray[i]);
								        }
								    }
						            parameters = uniqueArray.join(', ');
								}
							}

							// Create Method based on the new Method dialog's fields--or lack thereof.
							// Call client to inject it.
							var method = 
							{
								id: 0,
								name: methodName,
								ownedByUserId: g_strUserId,
								public: 0,
								quarantined: 0,
								workspace: "",
								parentMethodId: 0,
								parentPrice: 0.00,
								priceBump: 0.00,
								tags: $("#MethodTags").val().trim(),
								imageId: m_imageId,
								ordinal: 0,
								price: 0.0,
								description: $("#MethodDescription").val() || '',
								methodTypeId: methodTypeId,
								parameters: parameters
							};

							if (m_strNewOrEdit === "New") {

								exceptionRet = client.addMethodToActiveType(method);

							} else {

								exceptionRet = client.updateMethodInActiveType(method, m_methodForEdit, m_iIndexIfEdit, m_clActiveType);
							}
							if (exceptionRet) { throw exceptionRet; }

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
					var m_functionSetImageSrc = function (imageId) {

						m_imageId = imageId;
						$("#MethodImage").attr("src", resourceHelper.toURL("resources", m_imageId, "image"));
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
				var m_comicName = '';
				var m_comicTags = '';
				var m_imageId = 0;
				var m_clActiveType = null;
				var m_methodForEdit = null;
			};

			// Return the constructor function as the module object.
			return functionNewMethodDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
