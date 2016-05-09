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

							m_dialog = dialogItself;

							var posting = $.post("/BOL/UtilityBO/GetPPBuyers", 
								{
									projectId: m_iProjectId
								},
								'json');
							posting.done(function(data){
								
								try {

									if (data.success) {

										m_bClass = data.hasOwnProperty("classesdata");
										m_bOnlineClass = data.hasOwnProperty("onlineclassesdata");
										m_bProduct = data.hasOwnProperty("productsdata");
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

						if (!m_bClass) {
							// Completely remove the #Waitlisted tab by removing $(".remove").
							$(".remove").remove();
						}
						jqTabs = $("#tabs");
						jqTabs.on('tabscreate', fnTabscreate);
						jqTabs.tabs();
						// jqTabs.on('tabsbeforeactivate', fnTabsbeforeactivate);
						jqTabs.on('tabsactivate', fnTabsactivate);

						// $(".tt-selector .btn-default").powerTip({
						// 	smartPlacement: true
						// });

						m_setProjectData();
						m_setBuyersTable();
						if (m_bClass) {
							m_setWaitlistedTable();
							m_setInvitedTable();
						}
					}

					var m_setProjectData = function () {

					}

					var m_setBuyersTable = function () {

						var strHTML = '<thead><tr><th>id</th><th>userName</th>';
						if (!m_bProduct) {
							strHTML += '<th></th><th></th>';
						}
						strHTML += '<th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th></tr></thead>';
						strHTML += '<tfoot><tr><th></th><th>userName</th>';
						if (!m_bProduct) {
							strHTML += '<th></th><th></th>';
						}
						strHTML += '<th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th></tr></tfoot>';
						strHTML += '<tbody>';

						m_holdData.buyers.forEach(
							function(u) {

								strHTML += '<tr>';

								// id
								strHTML += '<td>' + u.id + '</td>';
								// userName
								strHTML += '<td>' + u.userName + '</td>';
								// buttons for classes and onlineclasses
								if (!m_bProduct) {
									strHTML += '<td class="dt-body-center t4btnb"><button type="button" name="RemRefund-' + u.id + '">Remove w/Refund</button></td>'
									strHTML += '<td class="dt-body-center t4btnb"><button type="button" name="RemNoRefund-' + u.id + '">Remove w/no Refund</button></td>'
								}
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

						$("#BuyersTable").empty();
						$("#BuyersTable").append(strHTML);
						$(".t4btnb").click(processBtnClick);

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

						var strHTML = '<thead><tr><th>id</th><th>userName</th><th></th><th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th></tr></thead>';
						strHTML += '<tfoot><tr><th></th><th>userName</th><th></th><th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th></tr></tfoot>';
						strHTML += '<tbody>';

						m_holdData.waitlisted.forEach(
							function(u) {

								strHTML += '<tr>';

								// id
								strHTML += '<td>' + u.id + '</td>';
								// userName
								strHTML += '<td>' + u.userName + '</td>';
								// Send email giving opportun ity to enroll.
								strHTML += '<td class="dt-body-center t4btnw"><button type="button" name="Invite-' + u.id + '">Invite to Enroll</button></td>'
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
						$(".t4btnw").click(processBtnClick);

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

					var m_setInvitedTable = function () {

						var strHTML = '<thead><tr><th>id</th><th>userName</th><th>Expires</th><th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th></tr></thead>';
						strHTML += '<tbody>';

						m_holdData.invited.forEach(
							function(u) {

								strHTML += '<tr>';

								// id
								strHTML += '<td>' + u.id + '</td>';
								// userName
								strHTML += '<td>' + u.userName + '</td>';
								// invitation expires dt.
								strHTML += '<td>2016-0708 23:45</td>'
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

						$("#InvitedTable").empty();
						$("#InvitedTable").append(strHTML);

						m_invitedTable = $("#InvitedTable").DataTable(
							{
								scrollY: 200,
								scrollX: true,
								scrollCollapse: true,
								dom: 'lrtip'	// Remove top right search input. 'f' is excluded.
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

					function processBtnClick (event) {

						// Initial stage of handling button click in #BuyersTable or #WaitlistedTable.
						var parts = event.currentTarget.childNodes[0].name.split('-');

						var iUserId = parseInt(parts[1], 10);
						switch (parts[0]) {
							case 'RemRefund':
								fnRemoveBuyer(iUserid, true);
								break;
							case 'RemNoRefund':
								fnRemoveBuyer(iUserid, false);
								break;
							case 'Invite':
								fnInvite(iUserid)
								break;
						}
					}

					function fnRemoveBuyer (iUserId, bRefund) {

						// Call to server to delete user's project where comicProjectId = m_iProjectId.
						// Pass along bool as to whether to process refund or not.
						// When we placed the charge, we saved a charge id in the project so that the potential refund could be processed.

						var iUserIndex = null;
						for (var i = 0; i < m_holdData.buyers.length; i++) {

							var userIth = m_holdData.buyers[i];
							if (userIth.id === iUserId) {

								iUserIndex = i;
								break;
							}

							if (!iUserIndex) {

								errorHelper.show("Strange error: we could not find the user in the table. This is rather impossible.");
								return;
							}
						}

						BootstrapDialog.confirm("Are you sure you want to remove " + m_holdData.buyers[iUserIndex].userName + " from this class?"
							function (result) {

								if (!result) {

									BootstrapDialog.show("OK. Have it your way.");
									return;
								}
							}
						);

						var posting = $.post("/BOL/UtilityBO/UndoPurchase", 
							{
								projectId: m_holdData.project.id,
								userid: iUserid,
								refund: bRefund
							},
							'json'
						);
						posting.done(
							function(data){
								
								try {

									if (data.success) {

										// If there was a refund requested, a row has been added to the refunds table.

										// Delete the user from m_holdData.buyers and reset #BuyersTable.
										m_holdData.buyers.splice(iUserIndex, 1);
										m_holdData.project.numEnrollees--;
										m_setBuyersTable();

										errorHelper.show('The project has been deleted.' + (bRefund ? ' And the refund has been sent through Stripe.' : ''));

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

					function fnInvite (iUserId) {

						// Ignoring maxClassSize and numEnrolled, the purpose of this function is to send an email to the selected user which
						// gives that user n (24?) hours to purchase the class. The email will contain an Accept Invitation link and a Decline Invitation link.
						// When a user is invited, the class is marked so that other users cannot buy it unless 2 things occur: the email recipient Declines
						// and there are no more users waitlisted for the class. 

						// In case of a Declined Invititation and no additional users on the waitlist, the class is made active.
						// In case of a Declined Invitation and one or more additional users on the waitlist, the next user is automatically sent the 24-hour invitation.
						// The expiration of the 24-hour time period works exactly the same as a Declined Invitation.

						// In the case of an Accepted Invitation, when the user clicks the Accept link in the email, he is taken to the login page; after login he is
						// taken directly to NewProjectDialog in mode 2 with the credit card entry form visible.
						var posting = $.post("/BOL/UtilityBO/SendClassInvite", 
							{
								projectId: m_holdData.project.id,
								userid: iUserid
							},
							'json'
						);
						posting.done(
							function(data){
								
								try {

									if (data.success) {

										// What we really want to do is to move a user from m_holdData.waitlisted to m_holdData.invited and then rebuild both datatables.
										// We can try to do that manually or we can refresh the data from the database.




										// Do it



										errorHelper.show('The user has been sent an email about the class opening has been deleted. He/she has 24 hours to respond.');

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
				var m_invitedTable;
				var m_bClass;
				var m_bOnlineClass;
				var m_bProduct;
			};

			// Return the constructor function as the module object.
			return functionAZPPBuyersDialog;

		} catch (e) {

			errorHelper.show(e);
		}
		
	}
);
