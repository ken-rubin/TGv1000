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

							jqTabs = $("#tabs");
							jqTabs.on('tabscreate', fnTabscreate);
							jqTabs.tabs();
							// jqTabs.on('tabsbeforeactivate', fnTabsbeforeactivate);
							jqTabs.on('tabsactivate', fnTabsactivate);


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

										m_holdData = data;
										m_setDataDisplay();

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

					var m_setDataDisplay = function () {
						// properties of m_holdData: project [obj]; one of classesdata, productsdata, onlineclassesdata [obj]; buyers [array of objs]; waitlisted [array of objs]; success [bool]

						m_setProjectData();
						m_setBuyersTable();
						m_setWaitlistedTable();
					}

					var m_setProjectData = function () {

					}

					var m_setBuyersTable = function () {

						var strHTML = '<thead><tr><th>id</th><th>userName</th><th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th>';
						if (!m_holdData.hasOwnProperty("productsdata")) {
							strHTML += '<th></th><th></th>';
						}
						strHTML += '</tr></thead>';
						strHTML += '<tfoot><tr><th></th><th>userName</th><th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th>';
						if (!m_holdData.hasOwnProperty("productsdata")) {
							strHTML += '<th></th><th></th>';
						}
						strHTML += '</tr></tfoot>';
						strHTML += '<tbody>';

						m_holdData.buyers.forEach(
							function(u) {

								var usergroupId = u.usergroupId;
								strHTML += '<tr>';

								// id
								strHTML += '<td>' + u.id + '</td>';
								// userName
								strHTML += '<td>' + u.userName + '</td>';
								// firstName
								strHTML += '<td>' + u.firstName + '</td>';
								// lastName
								strHTML += '<td>' + u.lastName + '</td>';
								// usergroup
								var strUsergroup;
								strHTML += '<td>' + u.usergroupName + '</td>';
								// zipcode
								strHTML += '<td>' + u.zipcode + '</td>';
								// timezone
								strHTML += '<td>' + u.timezone + '</td>';
								if (!m_holdData.hasOwnProperty("productsdata")) {
									strHTML += '<td><button type="button">Remove from class w/refund</button></td>'
									strHTML += '<td><button type="button">Remove from class no refund</button></td>'
								}
								strHTML += '</tr>';
							}
						);

						strHTML += '</tbody>';

						$("#BuyersTable").empty();
						$("#BuyersTable").append(strHTML);

					    // Set up for searching
					    $('#BuyersTable tfoot th').each( function () {
					        var title = $(this).text();
					        if (title) {
					        	$(this).html( '<input type="text" placeholder="Search '+title+'" />' );
					        }
					    } );

						m_buyersTable = $("#BuyersTable").DataTable(
							{
								scrollY: 200,
								scrollX: true,
								scrollCollapse: true,
								dom: 'lrtip'	// Remove top right search input. 'f' is excluded.
							}
						);

						// Attach search handlers.
						m_buyersTable.columns().every(
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
					}
					
					var m_setWaitlistedTable = function () {

						var strHTML = '<thead><tr><th>id</th><th>userName</th><th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th></tr></thead>';
						strHTML += '<tfoot><tr><th></th><th>userName</th><th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th></tr></tfoot>';
						strHTML += '<tbody>';

						m_holdData.waitlisted.forEach(
							function(u) {

								var usergroupId = u.usergroupId;
								strHTML += '<tr>';

								// id
								strHTML += '<td>' + u.id + '</td>';
								// userName
								strHTML += '<td>' + u.userName + '</td>';
								// firstName
								strHTML += '<td>' + u.firstName + '</td>';
								// lastName
								strHTML += '<td>' + u.lastName + '</td>';
								// usergroup
								var strUsergroup;
								strHTML += '<td>' + u.usergroupName + '</td>';
								// zipcode
								strHTML += '<td>' + u.zipcode + '</td>';
								// timezone
								strHTML += '<td>' + u.timezone + '</td>';
								strHTML += '</tr>';
							}
						);

						strHTML += '</tbody>';

						$("#WaitlistedTable").empty();
						$("#WaitlistedTable").append(strHTML);

					    // Set up for searching
					    $('#WaitlistedTable tfoot th').each( function () {
					        var title = $(this).text();
					        if (title) {
					        	$(this).html( '<input type="text" placeholder="Search '+title+'" />' );
					        }
					    } );

						m_waitlistedTable = $("#WaitlistedTable").DataTable(
							{
								scrollY: 200,
								scrollX: true,
								scrollCollapse: true,
								dom: 'lrtip'	// Remove top right search input. 'f' is excluded.
							}
						);

						// Attach search handlers.
						m_waitlistedTable.columns().every(
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
					}

					function fnTabscreate (event, ui) {

						// This handler is probably unnecessary, but the one below in fnTabsactivate is needed.
						$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
					}

					function fnTabsactivate (event, ui) {

						// A tab has been activated ( display:none has been changed to display: block ).
						// This will set column widths wereas before the hidden tables had no width and the columns could have been screwed up.
						$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
					}

				// catch for outer try
				} catch (e) { errorHelper.show(e.message); }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_iProjectId;
				var m_holdData;
				var m_buyersTable;
				var m_waitlistedTable;
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
