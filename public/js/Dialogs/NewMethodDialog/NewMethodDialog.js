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
				            var uniqueArray = [];	// Will be used below so declaration has been pulled up here.
							var parametersRaw = $("#MethodParams").val().trim();
							if (parametersRaw.length) {

								// Separate, de-dupe, recombine
								var pArray = parametersRaw.match(/([\w\-]+)/g);
								if (pArray.length) {

						        	// Remove possible dups from pArray.
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

							uniqueArray.unshift('self');
							if (m_strNewOrEdit === "New") {

								// Generate a workspace that declares 'self' and all parameters entered by the user.
								// For example, if user entered 'x, y, z', set method.workspace (note: additional parameters don't get nested deeper):
								/*
									<xml xmlns="http://www.w3.org/1999/xhtml">
									  <block type="procedures_defreturn" x="88" y="163">	<== defreturn for expression-type method; defnoreturn for statement-type method
									    <mutation>
									      <arg name="self"></arg>							<== 1 for each parameter plus 'self'
									      <arg name="x"></arg>
									      <arg name="y"></arg>
									      <arg name="z"></arg>
									    </mutation>
									    <field name="NAME">methodName</field>				<== plug in method.name
									  </block>
									</xml>								
								*/
								method.workspace = m_functionGenNewWorkspace(uniqueArray, method);
								exceptionRet = client.addMethodToActiveType(method);

							} else {	

								// Edit--user might have changed method name, type or parameters or nothing.
								// Similar to above, but we need potentially to save any "coding" the user did and just swap out the vars (including 'self') of the original method with potentially-changed new ones.
								// For example, the above with a bit a coding (note the coding is in the single <statement>...</statement> block; everything around it is the same as above before the user added functionality;):
								/*
									<xml xmlns="http://www.w3.org/1999/xhtml">
									  <block type="procedures_defnoreturn" x="263" y="138">
									    <mutation>
									      <arg name="x"></arg>
									    </mutation>
									    <field name="NAME">XCCC</field>
									    <statement name="STACK">
									      <block type="text_print">
									        <value name="TEXT">
									          <shadow type="text">
									            <field name="TEXT">abc</field>
									          </shadow>
									          <block type="text_join">
									            <mutation items="1"></mutation>
									            <value name="ADD0">
									              <block type="variables_get">
									                <field name="VAR">x</field>
									              </block>
									            </value>
									          </block>
									        </value>
									      </block>
									    </statement>
									  </block>
									</xml>
								*/
								method.workspace = m_functionGenReplacementWorkspace(uniqueArray, method);
								exceptionRet = client.updateMethodInActiveType(method, m_methodForEdit, m_iIndexIfEdit, m_clActiveType);
							}
							if (exceptionRet) { throw exceptionRet; }

							m_dialog.close();

						} catch (e) {

							errorHelper.show(e);
						}
					}

					var m_functionGenNewWorkspace = function(parametersArray, method) {

						try {
							
							var strBuild = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_def' + (method.methodTypeId === 1 ? 'no' : '') + 'return"><mutation>';

							parametersArray.forEach(function(param){

								strBuild += '<arg name="' + param + '"></arg>';
							});

							strBuild += '</mutation><field name="NAME">' + method.name + '</field></block></xml>';
							return strBuild;

						} catch (e) {

							errorHelper.show(e);
							return '';
						}
					}

					var m_functionGenReplacementWorkspace = function(parametersArray, method) {

						try {
							
							var origWorkspace = m_methodForEdit.workspace;
							var newWorkspace = m_functionGenNewWorkspace(parametersArray, method);

							// Now we just have to pluck the middle out of origWorkspace and plunk it into the middle of newWorkspace.
							// Note: the user could have all sorts of junk in origWorkspace. We'll ignore it and just take <statement>...</statement>.
							var startSortOf = origWorkspace.indexOf('</field><statement');
							var endSortOf = origWorkspace.indexOf('</block></xml>');

							// Ignore if wrong.
							if (startSortOf > -1 && endSortOf > -1) {

								var guts = origWorkspace.substring(startSortOf + 8, endSortOf);

								var otherEndSortOf = newWorkspace.indexOf('</field>');
								var newWorkspace = newWorkspace.substring(0, otherEndSortOf + 8) + guts + '</block></xml>';
							}

							return newWorkspace;

						} catch (e) {

							errorHelper.show(e);
							return '';
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
