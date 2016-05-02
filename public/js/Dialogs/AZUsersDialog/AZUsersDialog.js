////////////////////////////////////
// AZUsersDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the AZUsersDialog constructor function.
			var functionAZUsersDialog = function () {

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

									templateFile: "Dialogs/AZUsersDialog/AZUsersDialog"
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

								title: "User, etc. Maintenance",
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

							jqTabs = $("#tabs");
							jqTabs.on('tabscreate', fnTabscreate);
							jqTabs.tabs();
							jqTabs.on('tabsbeforeactivate', fnTabsbeforeactivate);

							$(".tt-selector .btn-default").powerTip({
								smartPlacement: true
							});

							$("#AddPermissionBtn").click(m_functionAddPermission);
							$("#AddUsergroupBtn").click(m_functionAddUsergroup);
							
							// Save the dialog object reference.
							m_dialog = dialogItself;

							var posting = $.post("/BOL/UtilityBO/GetAllUserMaintData", 
								{},
								'json');
							posting.done(function(data){

								try {
									if (data.success) {

										m_rows = data.rows;
										m_user = data.rows[0];
										m_usergroups = data.rows[1];
										m_permissions = data.rows[2];
										m_ug_permissions = data.rows[3];

										var exceptionRet = m_functionSetUp3Tabs();
										if (exceptionRet) { throw exceptionRet; }

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

					var m_functionSetUp3Tabs = function () {

						try {

							// Add datatable default overrides here.
							// $.extend( $.fn.dataTable.defaults, {
							    // searching: false
							// } );

							var exceptionRet = m_doPermissions();
							if (exceptionRet) { return exceptionRet; }

							var exceptionRet = m_doUsergroups();
							if (exceptionRet) { return exceptionRet; }

							var exceptionRet = m_doUsers();
							if (exceptionRet) { return exceptionRet; }

							return null;
						
						} catch (e) { return e; }
					}

					var m_doPermissions = function () {

						try {

							m_setResetPermissionsTable();
							m_permissionsTable = $("#PermissionsTable").DataTable(
								{
								//	scrollY: 200,	// scrolling is disabled to work around a header sizing problem. Y isn't needed. X woule be nice.
								//	scrollX: true,
									dom: 'lrtip'	// Remove top right search input. 'f' is excluded.
								}
							);
							$("#PermissionsTable_wrapper .dataTables_scrollHeadInner").css("width", "100%");
						} catch (e) { return e; }
					}

					var m_setResetPermissionsTable = function () {

						var strBuildPermissionsHTML = '<thead><tr><th>id</th><th>description</th></tr></thead>';
						strBuildPermissionsHTML += '<tbody>';

						m_permissions.forEach(
							function(p) {
								var permissionId = p.id;
								strBuildPermissionsHTML += '<tr>';

								// id
								strBuildPermissionsHTML += '<td>' + p.id + '</td>';
								// description
								strBuildPermissionsHTML += '<td>' + p.description + '</td>';
								strBuildPermissionsHTML += '</tr>';
							}
						);

						strBuildPermissionsHTML += '</tbody>';

						$("#PermissionsTable").empty();
						$("#PermissionsTable").append(strBuildPermissionsHTML);
					}

					var m_functionAddPermission = function () {

						var strPerm = $("#Permission").val().trim().toLowerCase();
						if (!strPerm) {
							errorHelper.show("You must enter a permission description.");
							return;
						}

						for (var i = 0; i < m_permissions.length; i++) {
							if (strPerm === m_permissions[i].description) {
								errorHelper.show("'" + strPerm + "' already exists.");
								return;
							}
						}

						var posting = $.post("/BOL/UtilityBO/AddPermission", 
							{
								permission: strPerm
							},
							'json');
						posting.done(function(data) {

								try {

									if (data.success) {

										$("#Permission").val('');

										m_permissions = data.rows;

										// Rebuild permissions table to add new row.
										m_permissionsTable.destroy();
										m_doPermissions();

										// Also rebuild usergroups table to add a checkbox column.
										m_usergroupsTable.destroy();
										m_doUsergroups();

										errorHelper.show('New permission was saved to database.', 2500);

									} else {

										// !data.success
										 throw new Error(data.message);
									}
								} catch (e) {

									errorHelper.show(e);
								}
							}
						);
					}

					var m_doUsergroups = function () {

						try {

							m_setResetUsergroupsTable();
							m_usergroupsTable = $("#UsergroupsTable").DataTable(
								{
									scrollY: 200,
									scrollX: true,
									dom: 'lrtip'	// Remove top right search input. 'f' is excluded.
									// ,
									// autoWidth: false
								}
							);

						} catch (e) { return e; }
					}

					var m_setResetUsergroupsTable = function () {

						var strBuildUsersHTML = '<thead><tr><th>id</th><th>name</th>';
						m_permissions.forEach(
							function(perm) {
								strBuildUsersHTML += '<th>' + perm.description + '</th>';
							}
						);
						strBuildUsersHTML += '</tr></thead><tbody>';

						m_usergroups.forEach(
							function(u) {
								var usergroupId = u.usergroupId;
								strBuildUsersHTML += '<tr>';

								// id
								strBuildUsersHTML += '<td>' + u.id + '</td>';
								// name
								strBuildUsersHTML += '<td>' + u.name + '</td>';

								// permissions checkbox columns
								for (var i = 0; i < m_permissions.length; i++) {
									var pIth = m_permissions[i];
									strBuildUsersHTML += '<td><input type="checkbox" onchange="processCheckboxChange(this);" name="usergroup-' + u.id + '-permission-' + pIth.id + '"';
									// See if it should be checked. We're working with usergroupId=u.id and permissionId=pIth.id
									var checked = false;
									for (var j = 0; j < m_ug_permissions.length; j++) {
										var ugpIth = m_ug_permissions[j];
										if (ugpIth.usergroupId === u.id) {
											if (ugpIth.permissionId === pIth.id) {
												checked = true;
												break;
											}
										}
									}
									if (checked) {
										strBuildUsersHTML += ' checked';
									}
									strBuildUsersHTML += '></td>';
								}
								strBuildUsersHTML += '</tr>';
							}
						);

						strBuildUsersHTML += '</tbody>';

						$("#UsergroupsTable").empty();
						$("#UsergroupsTable").append(strBuildUsersHTML);
					}

					var m_functionAddUsergroup = function () {

						var strUg = $("#Usergroup").val().trim().toLowerCase();
						if (!strUg) {
							errorHelper.show("You must enter a usergroup name.");
							return;
						}

						for (var i = 0; i < m_usergroups.length; i++) {
							if (strUg === m_usergroups[i].name) {
								errorHelper.show("'" + strUg + "' already exists.");
								return;
							}
						}

						var posting = $.post("/BOL/UtilityBO/AddUsergroup", 
							{
								usergroup: strUg
							},
							'json');
						posting.done(function(data) {

								try {

									if (data.success) {

										$("#Usergroup").val('');

										m_usergroups = data.rows;

										// Rebuild usergroups table to add new row with all checkboxes off.
										m_usergroupsTable.destroy();
										m_doUsergroups();

										// Also rebuild users table to add new usergroup to all combos therein.
										m_usersTable.destroy();
										m_doUsers();

										errorHelper.show('New usergroup was saved to database.', 2500);

									} else {

										// !data.success
										 throw new Error(data.message);
									}
								} catch (e) {

									errorHelper.show(e);
								}
							}
						);
					}
					var m_doUsers = function () {

						try {

							m_setResetUsersTable();
							m_usersTable = $("#UsersTable").DataTable(
								{
									scrollY: 200,
									scrollX: true,
									dom: 'lrtip'	// Remove top right search input. 'f' is excluded.
									// ,
									// autoWidth: false
								}
							);

							// Attach search handlers.
							m_usersTable.columns().every(
								function () {

									var that = this;
									var thisFooter = this.footer();
									if (thisFooter.childElementCount) {
								        $( 'input', thisFooter ).on( 'keyup change', function () {
								            if ( that.search() !== this.value ) {
								                that
								                    .search( this.value )
								                    .draw();
								            }
								        } );
								    }
								}
							);
						} catch (e) { return e; }
					}

					var m_setResetUsersTable = function () {

						var strBuildUsersHTML = '<thead><tr><th>id</th><th>userName</th><th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th></tr></thead>';
						strBuildUsersHTML += '<tfoot><tr><th></th><th>userName</th><th>firstName</th><th>lastName</th><th></th><th>zipcode</th><th>timezone</th></tr></tfoot>';
						strBuildUsersHTML += '<tbody>';

						m_user.forEach(
							function(u) {
								var usergroupId = u.usergroupId;
								strBuildUsersHTML += '<tr>';

								// id
								strBuildUsersHTML += '<td>' + u.id + '</td>';
								// userName
								strBuildUsersHTML += '<td>' + u.userName + '</td>';
								// firstName
								strBuildUsersHTML += '<td>' + u.firstName + '</td>';
								// lastName
								strBuildUsersHTML += '<td>' + u.lastName + '</td>';
								// usergroup combo
								strBuildUsersHTML += '<td><select size="1" id="user-' + u.id + '-usergroup" name="user-' + u.id + '-usergroup" onchange="processSelectChange(this);">'
								for (var i = 0; i < m_usergroups.length; i++) {
									var ugIth = m_usergroups[i];
									strBuildUsersHTML += '<option value="' + ugIth.id + '"';
									if (usergroupId === ugIth.id) {
										strBuildUsersHTML += 'selected="selected"';
									}
									strBuildUsersHTML += '>' + ugIth.name + '</option>';
								}
								strBuildUsersHTML += '</select></td>';
								// zipcode
								strBuildUsersHTML += '<td>' + u.zipcode + '</td>';
								// timezone
								strBuildUsersHTML += '<td>' + u.timezone + '</td>';
								strBuildUsersHTML += '</tr>';
							}
						);

						strBuildUsersHTML += '</tbody>';

						$("#UsersTable").empty();
						$("#UsersTable").append(strBuildUsersHTML);

					    // Set up for searching
					    $('#UsersTable tfoot th').each( function () {
					        var title = $(this).text();
					        if (title) {
					        	$(this).html( '<input type="text" placeholder="Search '+title+'" />' );
					        }
					    } );
					}

				// catch for outer try
				} catch (e) { errorHelper.show(e.message); }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_rows;
				var m_usergroups;
				var m_permissions;
				var m_permissionsTable;
				var m_usergroupsTable;
				var m_usersTable;
			};

			// Return the constructor function as the module object.
			return functionAZUsersDialog;

		} catch (e) {

			errorHelper.show(e);
		}
		
	}
);

var m_user;
var m_ug_permissions;
function processSelectChange (select) {

	var selectedUsergroup = select.options[select.selectedIndex];
	var arrParts = select.id.split('-');
	var strUserId = arrParts[1];
	var strUsergroupId = selectedUsergroup.value;

	var posting = $.post("/BOL/UtilityBO/UpdateUserUsergroup", 
		{
			userId: strUserId,
			usergroupId: strUsergroupId
		},
		'json');
	posting.done(function(data) {

			try {

				if (data.success) {

					// Update in saved array of users m_user.
					var userId = parseInt(strUserId, 10);
					for (var i = 0; i < m_user.length; i++) {

						if (m_user[i].id === userId) {

							m_user[i].usergroupId = parseInt(strUsergroupId, 10);
							break;
						}
					}
				} else {

					// !data.success
					throw new Error(data.message);
				}
			} catch (e) {

				alert(e.message);
			}
		}
	);
}

function processCheckboxChange (box) {

	var arrParts = box.name.split('-');
	var strUsergroupId = arrParts[1];
	var strPermissionId = arrParts[3];

	var posting = $.post("/BOL/UtilityBO/UpdateUgPermissions", 
		{
			permissionId: strPermissionId,
			usergroupId: strUsergroupId,
			state: (box.checked ? 'on' : 'off')
		},
		'json');
	posting.done(function(data) {

			try {

				if (data.success) {

					// Update in saved array m_ug_permissions.
					var usergroupId = parseInt(strUsergroupId, 10);
					var permissionId = parseInt(strPermissionId, 10);

					if (box.checked) {

						// Add to array.
						m_ug_permissions.push({
							usergroupId: usergroupId,
							permissionId: permissionId
						});
					} else {

						// Remove from array.
						for (var i = 0; i < m_ug_permissions.length; i++) {

							var ugpIth = m_ug_permissions[i];
							if (usergroupId === ugpIth.usergroupId && permissionId === ugpIth.permissionId) {

								m_ug_permissions.splice(i);
								break;
							}
						}
					}
				} else {

					// !data.success
					throw new Error(data.message);
				}
			} catch (e) {

				alert(e.message);
			}
		}
	);
}
function fnTabscreate (event, ui) {

	// ui.tab and ui.panel are jQuery object.
	alert('In fnTabscreate so "Users" is about to be activated (without firing tabsbeforeactivate)');

}
function fnTabsbeforeactivate (event, ui) {

	// ui.newPanel[0].id is like "Usergroups".
	alert('In fnTabsbeforeactivate for ' + ui.newPanel[0].id);

}
