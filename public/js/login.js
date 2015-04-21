////////////////////////////////////
// Login
//
// Return null--no module object.
//

// Define some app-globals.

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Require the error handler for all functions.
		require(["Core/errorHelper"], 
			function (errorHelper) {

				try {

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
	                    
	                    m_functionSignInButtonClick();

	                });
	                $("#signinBtn").keypress(function(event){

	                    if (event.which == 13) {

		                    m_functionSignInButtonClick();
	                    }
	                });
	                $("#inputPassword").keypress(function(event){

	                    if (event.which == 13) {

		                    m_functionSignInButtonClick();
	                    }
	                });
	                
	// $("#inputName").val('jerry'); $("#inputPassword").val('y'); $("#signinBtn").click();

	                // Wire up the forgot link.
	                $("#forgotLink").click(function () {
	                    
	                    var userName = $("#inputName").val();
	                    if (userName.length === 0) {
	                        
	                        alert("Close this message. Then enter your name and click the 'forgot' link again.");
	                    } else {

	                        $.ajax({
	                            
	                            type: "POST",
	                            url: "/BOL/UtilityBO/ForgotPW",
	                            data: { 
	                                    userName: userName
	                            },
	                            success: function (objectData,
	                                strTextStatus,
	                                jqxhr) {

	                                    try {
	                                        
	                                        if (!objectData.success) {
	                                            
	                                            alert("We had a problem recording your reset request. Please....");
	                                        } else {

	                                            alert("After your password is reset, you will be notified.");
	                                        }
	                                    } catch (e) {

	                                        alert("We had a problem recording your reset request. Please....");
	                                    }},
	                            error: function (jqxhr,
	                                strTextStatus,
	                                strError) {

	                                    alert("We had a problem recording your reset request. Please....");
	                                }
	                        });
	                    }
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

var m_functionSignInButtonClick = function() {

	try {

		var posting = $.post("/BOL/ValidateBO/UserAuthenticate", 
			{
				userName:$("#inputName").val(), 
				password:$("#inputPassword").val()
			}, 
			'json');
        posting.done(function(data){

            if (data.success) {

            	var userId = data.userId;

            	window.href = '/index';

            } else {

                // !data.success
                errorHelper.show(data.message);
            }
        });
    } catch(e) {

    	errorHelper.show(e.message);
    }
}

