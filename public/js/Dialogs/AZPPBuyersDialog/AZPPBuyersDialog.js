////////////////////////////////////
// AZPPBuyersDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the AZPPBuyersDialog constructor function.
			var functionAZPPBuyersDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function(iProjectId) {

						try {

							m_iProjectId = iProjectId;

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/AZPPBuyersDialog/AZPPBuyersDialog"
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

							BootstrapDialog.show({

								title: "Purchasable Project Maintenance",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
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

							// $(".tt-selector .btn-default").powerTip({
							// 	smartPlacement: true
							// });

							// Save the dialog object reference.
							m_dialog = dialogItself;

							var posting = $.post("/BOL/UtilityBO/GetPPBuyers", 
								{
									projectId: m_iProjectId
								},
								'json');
							posting.done(function(data){

								try {
									if (data.success) {

									m_setResetUsersTable();
									m_usersTable = $("#UsersTable").DataTable(
										{
											scrollY: 200,
											scrollX: true,
											dom: 'lrtip'	// Remove top right search input. 'f' is excluded.
										}
									);

									} else {

										// !data.success
										 throw new Error(data.message);
									}
								} catch (e) {

									errorHelper.show(e);
								}
  							});
						} catch (e) { errorHelper.show(e); }
					};

					var m_setResetUsersTable = function () {

						var strBuildUsersHTML = '<thead><tr><th>id</th><th>description</th></tr></thead>';
						strBuildUsersHTML += '<tbody>';

						m_Users.forEach(
							function(p) {
								var permissionId = p.id;
								strBuildUsersHTML += '<tr>';

								// id
								strBuildUsersHTML += '<td>' + p.id + '</td>';
								// description
								strBuildUsersHTML += '<td>' + p.description + '</td>';
								strBuildUsersHTML += '</tr>';
							}
						);

						strBuildUsersHTML += '</tbody>';

						$("#UsersTable").empty();
						$("#UsersTable").append(strBuildUsersHTML);
					}


				// catch for outer try
				} catch (e) { errorHelper.show(e.message); }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_iProjectId;
				var m_usersTable;
			};

			// Return the constructor function as the module object.
			return functionAZPPBuyersDialog;

		} catch (e) {

			errorHelper.show(e);
		}
		
	}
);

// var m_user;
// var m_ug_Users;
// function processSelectChange (select) {

// 	var selectedUsergroup = select.options[select.selectedIndex];
// 	var arrParts = select.id.split('-');
// 	var strUserId = arrParts[1];
// 	var strUsergroupId = selectedUsergroup.value;

// 	var posting = $.post("/BOL/UtilityBO/UpdateUserUsergroup", 
// 		{
// 			userId: strUserId,
// 			usergroupId: strUsergroupId
// 		},
// 		'json');
// 	posting.done(function(data) {

// 			try {

// 				if (data.success) {

// 					// Update in saved array of users m_user.
// 					var userId = parseInt(strUserId, 10);
// 					for (var i = 0; i < m_user.length; i++) {

// 						if (m_user[i].id === userId) {

// 							m_user[i].usergroupId = parseInt(strUsergroupId, 10);
// 							break;
// 						}
// 					}
// 				} else {

// 					// !data.success
// 					throw new Error(data.message);
// 				}
// 			} catch (e) {

// 				alert(e.message);
// 			}
// 		}
// 	);
// }

// function processCheckboxChange (box) {

// 	var arrParts = box.name.split('-');
// 	var strUsergroupId = arrParts[1];
// 	var strPermissionId = arrParts[3];

// 	var posting = $.post("/BOL/UtilityBO/UpdateUgUsers", 
// 		{
// 			permissionId: strPermissionId,
// 			usergroupId: strUsergroupId,
// 			state: (box.checked ? 'on' : 'off')
// 		},
// 		'json');
// 	posting.done(function(data) {

// 			try {

// 				if (data.success) {

// 					// Update in saved array m_ug_Users.
// 					var usergroupId = parseInt(strUsergroupId, 10);
// 					var permissionId = parseInt(strPermissionId, 10);

// 					if (box.checked) {

// 						// Add to array.
// 						m_ug_Users.push({
// 							usergroupId: usergroupId,
// 							permissionId: permissionId
// 						});
// 					} else {

// 						// Remove from array.
// 						for (var i = 0; i < m_ug_Users.length; i++) {

// 							var ugpIth = m_ug_Users[i];
// 							if (usergroupId === ugpIth.usergroupId && permissionId === ugpIth.permissionId) {

// 								m_ug_Users.splice(i);
// 								break;
// 							}
// 						}
// 					}
// 				} else {

// 					// !data.success
// 					throw new Error(data.message);
// 				}
// 			} catch (e) {

// 				alert(e.message);
// 			}
// 		}
// 	);
// }
// function fnTabscreate (event, ui) {

// 	// This handler is probably unnecessary, but the one below in fnTabsactivate is needed.
// 	$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
// }
// function fnTabsactivate (event, ui) {

// 	// A tab has been activated ( display:none has been changed to display: block ).
// 	// This will set column widths wereas before the hidden tables had no width and the columns could have been screwed up.
// 	$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
// }
