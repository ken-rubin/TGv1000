////////////////////////////////////
// DeleteConfirmDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper", "Code/Types"], 
	function (snippetHelper, errorHelper, resourceHelper, Types) {

		try {

			// Define the DeleteConfirmDialog constructor function.
			var functionDeleteConfirmDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function(objectType, index) {

						try {

							m_strObjectType = objectType;
							m_iIndex = index;

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/DeleteConfirmDialog/DeleteConfirmDialog"
								}, 
								dataProperty: "HTML",
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
							// the PropertysDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "Confirm Deletion",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Delete",
					            		id: 'DeleteBtn',
					            		cssClass: "btn-primary",
					            		action: function(){

					            			m_functionDelete();
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

					// Wire up Property handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;

							var strBuild = m_strObjectType + ' named ';
							if (m_strObjectType === 'type') {

								strBuild += types.getActiveClType().data.name + '.';

							} else if (m_strObjectType === 'method') {

								strBuild += types.getActiveClType().data.methods[m_iIndex].name + '.';

							} else if (m_strObjectType === 'property') {

								strBuild += types.getActiveClType().data.properties[m_iIndex].name + '.';

							} else if (m_strObjectType === 'event') {

								strBuild += types.getActiveClType().data.events[m_iIndex].name + '.';

							} else {

								throw new Error('Invalid objectType passed to Delete COnfirmation Dialog.');
							}

							$("#DeleteThis").text(strBuild);

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionDelete = function () {

						try {

							var exceptionRet = null;

							if (m_strObjectType === 'type') {

								exceptionRet = client.deleteType();				//types.getActiveClType());

							} else if (m_strObjectType === 'method') {

								exceptionRet = client.deleteMethod(m_iIndex);	//types.getActiveClType().data.methods[m_iIndex]);

							} else if (m_strObjectType === 'property') {

								exceptionRet = client.deleteProperty(m_iIndex);	//types.getActiveClType().data.properties[m_iIndex]);

							} else if (m_strObjectType === 'event') {

								exceptionRet = client.deleteEvent(m_iIndex);	//types.getActiveClType().data.events[m_iIndex]);
							}

							if (exceptionRet) {

								throw exceptionRet;
							}

							self.closeYourself();

						} catch (e) {

							errorHelper.show(e);
						}
					}

				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				// Object type we're potentially deleting ('type','method','property','event')
				var m_strObjectType = "";
				// For 'method', 'property', 'event': Index in  array respective array in Types#m_clTypeActive.
				// For 'type': Index in array Types#m_arrayClTypes.
				var m_iIndex = -1;
			};

			// Return the constructor function as the module object.
			return functionDeleteConfirmDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
