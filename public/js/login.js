////////////////////////////////////
// Login
//
// Return null--no module object.
//

// Define some app-globals.
var clientL = null;

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Require the error handler for all functions.
		require(["Core/errorHelper", "Core/ClientL"], 
			function (errorHelper, ClientL) {

				try {

					// Allocate and initialize the client.
					clientL = new ClientL();
					var exceptionRet = clientL.create(/*iUserId -- eventually from server specified cookie*/);
					if (exceptionRet) {

						throw exceptionRet;
					}

	                // Wire up the enroll button
	                $("#enrollBtn").click(function () {
	                    
	                    m_functionEnrollButtonClick(errorHelper);

	                });

	                // Wire up the model button
	                $("#modelBtn").click(function () {
	                    
	                    m_functionModelButtonClick(errorHelper);

	                });

	                // Get the signed in user id from a cookie.
	                var strUserName = getTGCookie("userName");
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

function getTGCookie (name) {

    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) {

        return parts.pop().split(";").shift();
    }
};

var m_functionEnrollButtonClick = function(errorHelper) {
	
	try {

		// Ask client to show the enroll dialog.
		var exceptionRet = clientL.showEnrollDialog(m_functionOnGotNewEnrollee);
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

var m_functionModelButtonClick = function(errorHelper) {
	
	try {

		var exceptionRet = clientL.showModelDialog();
		if (exceptionRet) {

			throw exceptionRet;
		}
	} catch (e) {

    	errorHelper.show(e.message);
	}
}

var m_functionSignInButtonClick = function(errorHelper) {

	try {

		var userName = $("#inputName").val();
		var posting = $.post("/BOL/ValidateBO/UserAuthenticate", 
			{
				userName:userName, 
				password:$("#inputPassword").val()
			}, 
			'json');
        posting.done(function(data){

            if (data.success) {

                document.cookie = "userId=" + data.userId.toString();
                document.cookie = "userName=" + userName;

            	location.href = '/index';

            } else {

                // !data.success
                errorHelper.show(data.message);
            }
        });
    } catch(e) {

    	errorHelper.show(e.message);
    }
}

