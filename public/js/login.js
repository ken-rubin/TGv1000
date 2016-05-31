////////////////////////////////////
// Login
//
// Return null--no module object.
//
var g_profile = {};

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Require the error handler for all functions.
		require(["Core/errorHelper", "Core/ClientLogin"], 
			function (errorHelper, ClientLogin) {

				try {

					// Look for JWT redirect.
					var strFromURL = m_functionCheckForURLEncoding("error");
					if (strFromURL !== "") {
						errorHelper.show(strFromURL + '. Please login again.');
					}

					// Allocate and initialize the client.
					m_clientLogin = new ClientLogin();
					var exceptionRet = m_clientLogin.create();
					if (exceptionRet) { throw exceptionRet; }

					// exceptionRet = m_functionLoadThreeLists(errorHelper);
					// if (exceptionRet) { throw exceptionRet; }

	                // Wire up the enroll button
	                $("#enrollBtn").click(function () {
	                    
	                    m_functionEnrollButtonClk(errorHelper);

	                });

	                // Get the last signed in userName from profile in localStorage.
             		m_functionSetGProfileFromLS();
	                var strUserName = null;
	                if (g_profile && g_profile.hasOwnProperty("userName")) {
	                	strUserName = g_profile["userName"];
	                }
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
	                
	                // Wire up the forgot link.
	                $("#forgotLink").click(function () {
	                    
	                    m_functionForgotLinkClick(errorHelper);
	                });

					// Cause the code and designer panels to size themselves.
					$(window).resize();

					///////////////////////////////////////////////////////////
					//
					// Following are all of our handlers for URL-encoded launches due to users clicking on email-included links.
					//
					//////////////////////////////////////////////////////////

					// Look for password reset token.
					strFromURL = m_functionCheckForURLEncoding("reset");
					if (strFromURL) {
						
						m_functionShowPasswordResetDialog(strFromURL, errorHelper);
						return;
					}

					// Accept invitation to enroll in online class.
					strFromURL = m_functionCheckForURLEncoding("accept");
					if (strFromURL) {

						m_functionHandleAcceptEmailClick();
						return;
					}

					// Decline invitation to enroll in online class.
					strFromURL = m_functionCheckForURLEncoding("decline");
					if (strFromURL) {

						m_functionHandleDeclineEmailClick();
						return;
					}

				} catch (e) {

					errorHelper.show(e);
				}
			}
		);
	} catch (e) {

		alert(e.message);
	}
});

var m_functionCheckForURLEncoding = function(name) {

	var mname = name.replace(/[\[]/, "\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]" + mname + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.href);
	if(results == null) {
		return "";
	}

	return decodeURI(results[1]);
}

var m_functionHandleAcceptEmailClick = function() {

}

var m_functionHandleDeclineEmailClick = function() {

}

var m_functionEnrollButtonClk = function(errorHelper) {
	
	try {

		// Ask client to show the enroll dialog.
		var exceptionRet = m_clientLogin.showEnrollDialog();
		if (exceptionRet) { throw exceptionRet; }
		
	} catch (e) {

    	errorHelper.show(e.message);
	}
}

var m_functionForgotLinkClick = function(errorHelper) {
	
	try {

		// Ask client to show the forgot p/w dialog.
		var exceptionRet = m_clientLogin.showForgotPWDialog();
		if (exceptionRet) { throw exceptionRet; }
		
	} catch (e) {

    	errorHelper.show(e.message);
	}
}

var m_functionShowPasswordResetDialog = function(token, errorHelper) {
	
	try {

		// Ask client to show the forgot p/w dialog.
		var exceptionRet = m_clientLogin.showPWResetDialog(token);
		if (exceptionRet) { throw exceptionRet; }
		
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

	            	// The following is included just to remind us in the future how to log from client into server console.
					JL().info("<<< successful login occurred >>>");

	            	// The JWT has been saved to a cookie ("token") so it will be sent with each subsequent request.
	                // Save JWT profile info to localStorage for use on client side (user id and permissions).
	                var ca = document.cookie.split(';');
	                var getCookie = function(name) {
	                	var nameEQ = name + "=";
	                	for (var i = 0; i < ca.length; i++) {
							var cIth = ca[i];
							while (cIth.charAt(0) == ' ') {
								cIth = cIth.substring(1, cIth.length);
							}
							if (cIth.indexOf(nameEQ) === 0) {
								return cIth.substring(nameEQ.length, cIth.length);
							}
						}
						return null;
	                };
	                var token = getCookie("token");
	                if (token) {

	                	var profileJSON = window.atob(token.split('.')[1]);
	                	localStorage.setItem("profile", profileJSON);
		                m_functionSetGProfileFromLS();
	                }

	            	location.href = '/index';

	            } else {

	                // !data.success
					JL().info("<<< unsuccessful login attempt >>>");
	                errorHelper.show(data.message);
	            }
	        });
		}
    } catch(e) { errorHelper.show(e.message); }
}

var m_functionSetGProfileFromLS = function() {

	var profileJSON = localStorage.getItem("profile");
	g_profile = JSON.parse(profileJSON);
}

// Define some app-globals.
var m_clientLogin = null;
