////////////////////////////////////
// Login
//
// Return null--no module object.
//

// Define some app-globals.
var clientLogin = null;

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Require the error handler for all functions.
		require(["Core/errorHelper", "Core/ClientLogin"], 
			function (errorHelper, ClientLogin) {

				try {

					// Allocate and initialize the client.
					clientLogin = new ClientLogin();
					var exceptionRet = clientLogin.create(/*iUserId -- eventually from server specified cookie*/);
					if (exceptionRet) { throw exceptionRet; }

					exceptionRet = m_functionLoadThreeLists();
					if (exceptionRet) { throw exceptionRet; }

	                // Wire up the enroll button
	                $("#enrollBtn").click(function () {
	                    
	                    m_functionEnrollButtonClick(errorHelper);

	                });

	                // Get the signed in user id from a cookie.
	                var strUserName = clientLogin.getTGCookie("userName");
	                if (strUserName && strUserName.length > 0) {

	                    $("#inputName").val(strUserName);
	                    $("#inputPassword").focus();

	                } else {

	                    $("#inputName").focus();
	                }

	                // Wire up the signIn button
	                $("#signinBtn").click(function () {
	                    
	                    m_functionSignInButtonClick(errorHelper);

	                });
	                $("#signinBtn").keypress(function(event){

	                    if (event.which == 13) {

		                    m_functionSignInButtonClick(errorHelper);
	                    }
	                });
	                $("#inputPassword").keypress(function(event){

	                    if (event.which == 13) {

		                    m_functionSignInButtonClick(errorHelper);
	                    }
	                });
	                
					// $("#inputName").val('ken'); $("#inputPassword").val('a'); $("#signinBtn").click();

	                // Wire up the forgot link.
	                $("#forgotLink").click(function () {
	                    
	                    // var userName = $("#inputName").val();
	                    // if (userName.length === 0) {
	                        
	                    //     alert("Close this message. Then enter your name and click the 'forgot' link again.");
	                    // } else {

	                    //     $.ajax({
	                            
	                    //         type: "POST",
	                    //         url: "/BOL/UtilityBO/ForgotPW",
	                    //         data: { 
	                    //                 userName: userName
	                    //         },
	                    //         success: function (objectData,
	                    //             strTextStatus,
	                    //             jqxhr) {

	                    //                 try {
	                                        
	                    //                     if (!objectData.success) {
	                                            
	                    //                         alert("We had a problem recording your reset request. Please....");
	                    //                     } else {

	                    //                         alert("After your password is reset, you will be notified.");
	                    //                     }
	                    //                 } catch (e) {

	                    //                     alert("We had a problem recording your reset request. Please....");
	                    //                 }},
	                    //         error: function (jqxhr,
	                    //             strTextStatus,
	                    //             strError) {

	                    //                 alert("We had a problem recording your reset request. Please....");
	                    //             }
	                    //     });
	                    // }
	                });

					// Cause the code and designer panels to size themselves.
					$(window).resize();

				} catch (e) {

					errorHelper.show(e);
				}
			}
		);
	} catch (e) {

		alert(e.message);
	}
});

var m_functionLoadThreeLists = function() {

	try {

		var posting = $.post("/BOL/ProjectBO/RetrieveProjectsForLists", 
			{},
			'json');
		posting.done(function(data){

			if (data.success) {

				$("#FreeList").empty();
				$("#ProductList").empty();
				$("#ClassList").empty();

				data.frees.items.forEach(function(free){
					
				});

				data.products.items.forEach(function(product){
					
				});

				data.classes.items.forEach(function(klass){
					
				});

				return null;

			} else {

				// !data.success
				return new Error(data.message);
			}
		});
	} catch (e) {

		return e;
	}
}

var m_functionEnrollButtonClick = function(errorHelper) {
	
	try {

		// Ask client to show the enroll dialog.
		var exceptionRet = clientLogin.showEnrollDialog(m_functionOnGotNewEnrollee);
		if (exceptionRet) {

			throw exceptionRet;
		}
	} catch (e) {

    	errorHelper.show(e.message);
	}
}

var m_functionOnGotNewEnrollee = function(userName, password) {

	try {

	} catch (e) {

		errorHelper.show(e.message);
	}
}

var m_functionSignInButtonClick = function(errorHelper) {

	try {

		var userName = $("#inputName").val().toLowerCase().trim();
		var password = $("#inputPassword").val().trim();

		if (userName.length === 0 || password.length === 0) {

			errorHelper.show("You must enter both a user Id and a password.");

		} else {

			var posting = $.post("/BOL/ValidateBO/UserAuthenticate", 
				{
					userName:userName, 
					password:password
				}, 
				'json');
	        posting.done(function(data){

	            if (data.success) {

					// These cookies don't expire, but they mau be overridden if a different user logs in.
					var strDate = "; expires=Tue, 19 Jan 2038 03:14:07 GMT";

	                document.cookie = "userId=" + data.userId.toString() + strDate;
	                document.cookie = "userName=" + userName + strDate;

	            	location.href = '/index';

	            } else {

	                // !data.success
	                errorHelper.show(data.message);
	            }
	        });
		}
    } catch(e) {

    	errorHelper.show(e.message);
    }
}

