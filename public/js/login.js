////////////////////////////////////
// Login
//
// Return null--no module object.
//

// Invoke callback when DOM is fully loaded.
$(document).ready(function () {
	
	try {

		// Require the error handler for all functions.
		require(["Core/errorHelper", "Core/ClientLogin"], 
			function (errorHelper, ClientLogin) {

				try {

					// Allocate and initialize the client.
					m_clientLogin = new ClientLogin();
					var exceptionRet = m_clientLogin.create(/*iUserId -- eventually from server specified cookie*/);
					if (exceptionRet) { throw exceptionRet; }

					exceptionRet = m_functionLoadThreeLists(errorHelper);
					if (exceptionRet) { throw exceptionRet; }

	                // Wire up the enroll button
	                $("#enrollBtn").click(function () {
	                    
	                    m_functionEnrollButtonClick(errorHelper);

	                });

	                // Get the signed in user id from a cookie.
	                var strUserName = m_clientLogin.getTGCookie("userName");
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

var m_functionEnrollButtonClick = function(errorHelper) {
	
	try {

		// Ask client to show the enroll dialog.
		var exceptionRet = m_clientLogin.showEnrollDialog();
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

	            	// The following is included just to remind us in the future how to log from client to server.
					JL().info("<<< successful login occurred >>>");

					// These cookies don't expire, but they mau be overridden if a different user logs in.
					var strDate = "; expires=Tue, 19 Jan 2038 03:14:07 GMT";

	                document.cookie = "userId=" + data.userId.toString() + strDate;
	                document.cookie = "userName=" + userName + strDate;

	                // var token = jwtbundle.decode(data.token);
	                // JL().info("Client side version of token: " + JSON.stringify(token));

	            	location.href = '/index';

	            } else {

	                // !data.success
					JL().info("<<< unsuccessful login attempt >>>");

	                errorHelper.show(data.message);
	            }
	        });
		}
    } catch(e) {

    	errorHelper.show(e.message);
    }
}

var m_functionLoadThreeLists = function(errorHelper) {

	try {

		var posting = $.post("/BOL/ValidateBO/RetrieveProjectsForLists", 
			{},
			'json');
		posting.done(function(data){

			if (data.success) {

				m_frees = data.frees.items;
				m_products = data.products.items;
				m_classes = data.classes.items;

				$.ajax({

					cache: false,
					data: { 

						templateFile: "Login/Listboxes/freeBox"
					}, 
					dataType: "HTML",
					method: "POST",
					url: "/renderJadeSnippet"
				}).done(m_functionRenderJadeSnippetResponseFree).error(errorHelper.show);

				$.ajax({

					cache: false,
					data: { 

						templateFile: "Login/Listboxes/productBox"
					}, 
					dataType: "HTML",
					method: "POST",
					url: "/renderJadeSnippet"
				}).done(m_functionRenderJadeSnippetResponseProduct).error(errorHelper.show);

				$.ajax({

					cache: false,
					data: { 

						templateFile: "Login/Listboxes/classBox"
					}, 
					dataType: "HTML",
					method: "POST",
					url: "/renderJadeSnippet"
				}).done(m_functionRenderJadeSnippetResponseClass).error(errorHelper.show);

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

var m_functionRenderJadeSnippetResponseFree = function(htmlData) {

	m_freeHTML = htmlData;
	if (m_productHTML && m_classHTML) {

		m_functionFillTheLists();
	}
}

var m_functionRenderJadeSnippetResponseProduct = function(htmlData) {

	m_productHTML = htmlData;
	if (m_freeHTML && m_classHTML) {

		m_functionFillTheLists();
	}
}

var m_functionRenderJadeSnippetResponseClass = function(htmlData) {

	m_classHTML = htmlData;
	if (m_productHTML && m_freeHTML) {

		m_functionFillTheLists();
	}
}

var m_functionFillTheLists = function() {


	$("#FreeList").empty();
	for(var i = 0; i < m_frees.length; i++) {

		var freeIth = m_frees[i];
		$("#FreeList").append('<div id="Free_' + i + '">' + m_freeHTML + '</div>');

		// Fill the data in Free_i.
		$("#Free_" + i + " #Name").text(freeIth.name);
		$("#Free_" + i + " #Img").attr("src", freeIth.imgsrc);
		$("#Free_" + i + " #Description").text(freeIth.description);
	}

	$("#ProductList").empty();
	for(var i = 0; i < m_products.length; i++) {

		var productIth = m_products[i];
		$("#ProductList").append('<div id="Product_' + i + '">' + m_productHTML + '</div>');

		// Fill the data in Product_i.
		$("#Product_" + i + " #Name").text(productIth.name);
		$("#Product_" + i + " #Img").attr("src", productIth.imgsrc);
		$("#Product_" + i + " #Description").text(productIth.description);
		$("#Product_" + i + " #Level").text("Level: " + productIth.level);
		$("#Product_" + i + " #Difficulty").text("Rating: " + productIth.difficulty);
		$("#Product_" + i + " #Price").text("Price: $" + productIth.price);
	}

	$("#ClassList").empty();
	for(var i = 0; i < m_classes.length; i++) {

		var classIth = m_classes[i];
		$("#ClassList").append('<div id="Class_' + i + '">' + m_classHTML + '</div>');

		// Fill the data in Class_i.
		$("#Class_" + i + " #Name").text(classIth.name);
		$("#Class_" + i + " #Img").attr("src", classIth.imgsrc);
		$("#Class_" + i + " #Description").text(classIth.description);
		$("#Class_" + i + " #Level").text("Level: " + classIth.level);
		$("#Class_" + i + " #Difficulty").text("Rating: " + classIth.difficulty);
		$("#Class_" + i + " #Price").text("Price: $" + classIth.price);
		$("#Class_" + i + " #Instructor").text("Instructor: " + classIth.instructor);
		$("#Class_" + i + " #Phone").text("Questions: " + classIth.phone);
		var locations = classIth.location.split('~');
		while(locations.length < 5) {
			locations.push('');
		}
		for (var j = 0; j < 5; j++) {

			$("#Class_" + i + " #Where" + (j+1)).text(locations[j]);
		}
		while(classIth.schedule.items.length < 8) {
			classIth.schedule.items.push({when:''});
		}
		for (var j = 1; j < 8; j++) {

			$("#Class_" + i + " #When" + (j+1)).text(classIth.schedule.items[j].when);
		}
		$("#Class_" + i + " #Note").text(classIth.notes);
	}
}

// Define some app-globals.
var m_clientLogin = null;
var m_frees = [];
var m_products = [];
var m_classes = [];
var m_freeHTML = null;
var m_productHTML = null;
var m_classHTML = null;
