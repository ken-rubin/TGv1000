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

							m_refreshData();

						} catch (e) { errorHelper.show(e); }
					};

					var m_refreshData = function () {

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
					}

					var m_setDataDisplay = function () {

						// Properties of m_holdData: 
							// project [obj]; 
							// one of classesdata, productsdata, onlineclassesdata [obj]; 
							// buyers [array of objs]; 
							// waitlisted [array of objs]; 
							// recentRefunds [array of objs] 
							// success [bool]

						if (!m_bClass) {
							// Completely remove all tabs other than #Buyers by removing $(".remove").
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

						m_setRecentRefundsTable();
					}

					var m_setProjectData = function () {

						$("#ProjectData").empty();
						var innerHTML = "<h4>Project:&nbsp;&nbsp;" + m_holdData.project.name + "</h4>";

						if (m_bClass) {

							var iNumSessions = 0;
							var schedule = JSON.parse(m_holdData.classesdata.schedule);
							var strStartDate = m_getJustDate(schedule[0]);
							for (var i = 0; i < 8; i++) {
								
								if(schedule[i].date) {
									iNumSessions++;
								}
							}
							innerHTML += "<span>This is a physical class starting " + strStartDate + " with " + iNumSessions + " sessions.</span><br>";
							innerHTML += "<span>Max enrollment: " + m_holdData.classesdata.maxClassSize + "; enrolled: " + m_holdData.buyers.length + "; waitlisted: " + m_holdData.waitlisted.length + "; invited: " + m_holdData.invited.length + "</span><br>";

						} else if (m_bOnlineClass) {

							var iNumSessions = 0;
							var schedule = JSON.parse(m_holdData.onlineclassesdata.schedule);
							var strStartDate = m_getJustDate(schedule[0]);
							for (var i = 0; i < 8; i++) {
								
								if(schedule[i].date) {
									iNumSessions++;
								}
							}
							innerHTML += "<span>This is an online class starting " + strStartDate + " with " + iNumSessions + " sessions.</span><br>";
							innerHTML += "<span>There are " + m_holdData.buyers.length + " users enrolled.</span><br>";

						} else {

							innerHTML += "<span>This is a kit product.</span><br>";
							innerHTML += "<span>There have been " + m_holdData.buyers.length + " sales to date.</span><br>";
						}

						$("#ProjectData").append(innerHTML);
					}

					var m_getJustDate = function(objDateDuration) {

						var mntDate = moment(objDateDuration.date).local();
						return mntDate.format('MMMM Do YYYY');
					}

					var m_setBuyersTable = function () {

						var strHTML = '<thead><tr><th>id</th><th>userName</th>';
						if (!m_bProduct) {
							strHTML += '<th>Remove w/Refund</th><th>Remove w/o Refund</th>';
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
									strHTML += '<td class="dt-body-center t4btnb"><button type="button" name="RemRefund-' + u.id + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button></td>'
									strHTML += '<td class="dt-body-center t4btnb"><button type="button" name="RemNoRefund-' + u.id + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button></td>'
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
								// ,
								// columnDefs: [
								// 	{width: "20%", targets: [2,3]}
								// ]
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

						var strHTML = '<thead><tr><th>id</th><th>userName</th><th>w/l since</th><th>Invite</th><th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th></tr></thead>';
						strHTML += '<tfoot><tr><th></th><th>userName</th><th></th><th></th><th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th></tr></tfoot>';
						strHTML += '<tbody>';

						m_holdData.waitlisted.forEach(
							function(u) {

								strHTML += '<tr>';

								// id
								strHTML += '<td>' + u.id + '</td>';
								// userName
								strHTML += '<td>' + u.userName + '</td>';
								// On waitlist since
								var momDtWaitlisted = moment(u.dtWaitlisted).local();
								strHTML += '<td>' + momDtWaitlisted.format('YYYY-MM-DD H:mm:ss') +'</td>';
								// Send email giving opportun ity to enroll.
								strHTML += '<td class="dt-body-center t4btnw"><button type="button" name="Invite-' + u.id + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button></td>';
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
					        if (title && title !== 'w/l since') {
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

						var strHTML = '<thead><tr><th>id</th><th>userName</th><th>expires</th><th>firstName</th><th>lastName</th><th>usergroup</th><th>zipcode</th><th>timezone</th></tr></thead>';
						strHTML += '<tbody>';

						m_holdData.invited.forEach(
							function(u) {

								strHTML += '<tr>';

								// id
								strHTML += '<td>' + u.id + '</td>';
								// userName
								strHTML += '<td>' + u.userName + '</td>';
								// invitation expires in .... (pretty time)
								var momInvitationExpires = moment(u.dtInvited).add(1, 'd');
								var momNow = new moment();
								strHTML += '<td>' + momNow.to(momInvitationExpires) + '</td>';
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

					var m_setRecentRefundsTable = function () {
						
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
								fnRemoveBuyer(iUserId, true);
								break;
							case 'RemNoRefund':
								fnRemoveBuyer(iUserId, false);
								break;
							case 'Invite':
								fnInvite(iUserId)
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
						}

						if (!iUserIndex) {

							errorHelper.show("Strange error: we could not find the user in the table. This is rather impossible.");
							return;
						}

						var userName = m_holdData.buyers[iUserIndex].userName;
						BootstrapDialog.confirm("Are you sure you want to remove " + userName + " from this class?",
							function (result) {

								if (!result) {

									BootstrapDialog.show({message: "OK. Have it your way."});
									return;
								}
							}
						);

						var posting = $.post("/BOL/UtilityBO/UndoPurchase", 
							{
								projectId: m_holdData.project.id,
								userid: iUserId,
								refund: bRefund
							},
							'json'
						);
						posting.done(
							function(data){
								
								try {

									if (data.success) {

										// If there was a refund requested, a row has been added to the refunds table.
										// TODO: We'll need to refresh that datatable somehow.

										// Delete the user from m_holdData.buyers and reset #BuyersTable.
										m_holdData.buyers.splice(iUserIndex, 1);
										m_holdData.project.numEnrollees--;
										m_setBuyersTable();

										errorHelper.show(userName + "'s project has been deleted." + (bRefund ? " The refund has been issued through Stripe." : " No refund was processed."));

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

						var iUserIndex = null;
						for (var i = 0; i < m_holdData.waitlisted.length; i++) {

							var userIth = m_holdData.waitlisted[i];
							if (userIth.id === iUserId) {

								iUserIndex = i;
								break;
							}
						}

						if (!iUserIndex) {

							errorHelper.show("Strange error: we could not find the user in the table. This is rather impossible.");
							return;
						}

						var userName = m_holdData.buyers[iUserIndex].userName;
						BootstrapDialog.confirm("Are you sure you want to invite " + userName + " to enroll in this class?",
							function (result) {

								if (!result) {

									BootstrapDialog.show({message: "OK. Have it your way."});
									return;
								}
							}
						);

						var posting = $.post("/BOL/UtilityBO/SendClassInvite", 
							{
								projectId: m_holdData.project.id,
								userid: iUserId
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



										errorHelper.show(userName + ' has been sent an email about the opening in this class. He/she has 24 hours to respond.');

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
