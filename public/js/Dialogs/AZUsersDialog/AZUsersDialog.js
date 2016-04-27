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

							$("#tabs").tabs();

							$(".tt-selector .btn-default").powerTip({
								smartPlacement: true
							});

							$("#AddPermissionBtn").click(m_functionAddPermission);
							
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

							// Disable search for all datatables unless overridden.
							// Add more defaults here.
							$.extend( $.fn.dataTable.defaults, {
							    searching: false
							} );

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

							m_permissionsTable = $("#PermissionsTable").DataTable(
								{
									data: m_permissions,
									columns:
										[
											{data: "id", title: "id"},
											{data: "description", title: "description"}
										],
									scrollY: 200,
								}
							);
						} catch (e) { return e; }
					}

					var m_doUsergroups = function () {

						try {

							m_usergroupsTable = $("#UsergroupsTable").DataTable(
								{
									data: m_usergroups,
									columns:
										[
											{data: "id", title: "id"},
											{data: "name", title: "name"}
										]
								}
							);
						} catch (e) { return e; }
					}

					var m_doUsers = function () {

						try {

							m_usersTable = $("#UsersTable").DataTable(
								{
									data: m_user,
									columns:
									[
										{data: "id", title: "id"},
										{data: "userName", title: "userName"},
										{data: "firstName", title: "firstName"},
										{data: "lastName", title: "lastName"},
										{data: "usergroupId", title: "usergroupId"},
										{data: "zipcode", title: "zipcode"},
										{data: "timezone", title: "timezone"},
										{data: "pwHash", "title": "pwHash"}
									],
									scrollY: 200,
									scrollX: true,
									autoWidth: false
								}
							);
						} catch (e) { return e; }
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
						posting.done(function(data){

							try {
								if (data.success) {

									$("#Permission").val('');

									m_permissions = data.rows;
									m_permissionsTable.clear().rows.add(m_permissions).draw();

									errorHelper.show('New permission was saved to database.', 2500);

								} else {

									// !data.success
									 throw new Error(data.message);
								}
							} catch (e) {

								errorHelper.show(e);
							}
							});
					}

				// catch for outer try
				} catch (e) { errorHelper.show(e.message); }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_rows;
				var m_user;
				var m_usergroups;
				var m_permissions;
				var m_ug_permissions;
				var m_permissionsTable;
				var m_usergroupsTable;
				var m_usersTable;
			};

			// Return the constructor function as the module object.
			return functionAZUsersDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
