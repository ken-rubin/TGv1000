///////////////////////////////////////
// TechGroms application main module.
//
// Requires utility module and wires high-
// level functions to DOM at document load.

"use strict";

// Execute at start.
$(document).ready(function () {

    // Require utility object.
    require(["./utility"],
        function (utility) {

            try {

                // Touch event handler magically fixes the phone touch/drag problem.
                var functionTouchHandler = function (event) {
                    var touch = event.changedTouches[0];

                    var simulatedEvent = document.createEvent("MouseEvent");
                        simulatedEvent.initMouseEvent({
                        touchstart: "mousedown",
                        touchmove: "mousemove",
                        touchend: "mouseup"
                    }[event.type], true, true, window, 1,
                        touch.screenX, touch.screenY,
                        touch.clientX, touch.clientY, false,
                        false, false, false, 0, null);

                    touch.target.dispatchEvent(simulatedEvent);
                    event.preventDefault();
                }

                // Wire up touch events.
/*                document.addEventListener("touchstart", functionTouchHandler, false);
                document.addEventListener("touchmove", functionTouchHandler, false);
                document.addEventListener("touchend", functionTouchHandler, false);
                document.addEventListener("touchcancel", functionTouchHandler, false);
*/
                // Set the date in the header.
                var exceptionRet = utility.setHeaderDate();
                if (exceptionRet !== null) {
            
                    throw exceptionRet;
                }
                
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
                    
                    utility.authenticate(function (strError) {
                        
                        alert(strError);
                    });
                });
                $("#signinBtn").keypress(function(event){

                    if (event.which == 13) {

                        utility.authenticate(function (strError) {
                            
                            alert(strError);
                        });
                    }
                });
                $("#inputPassword").keypress(function(event){

                    if (event.which == 13) {

                        utility.authenticate(function (strError) {
                            
                            alert(strError);
                        });
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

                // Wire up the enroll today button.
                $("#enrollTodayButton").click(function () {

                    try {
                    
                        // Open and load classes into the sub content div.
                        var exceptionRet = utility.loadClasses({which: 'active'});
                        if (exceptionRet !== null) {
                        
                            throw exceptionRet;
                        }
                    } catch (e) {
                    
                        alert(e.message);
                    }
                });
				
                // Wire up the skills & Drills anchor.
                $("#SkillsDrillsAnchor").click(function () {

                    try {
                    
                        // Open and load the robotics fragment into the sub content div.
                        var exceptionRet = utility.loadSkillsDrills();
                        if (exceptionRet !== null) {
                        
                            throw exceptionRet;
                        }
                    } catch (e) {
                    
                        alert(e.message);
                    }
                });
				
                // Wire up the labs anchor.
                $("#CoursesAnchor").click(function () {

                    try {
                    
                        // Open and load the labs fragment into the sub content div.
                        var exceptionRet = utility.loadCourses();
                        if (exceptionRet !== null) {
                        
                            throw exceptionRet;
                        }
                    } catch (e) {
                    
                        alert(e.message);
                    }
                });

                // Wire up the calendar anchor.
                $("#CalendarAnchor").click(function () {

                    try {
                    
                        // Open and load the robotics fragment into the sub content div.
                        var exceptionRet = utility.loadCalendar();
                        if (exceptionRet !== null) {
                        
                            throw exceptionRet;
                        }
                    } catch (e) {
                    
                        alert(e.message);
                    }
                });
				
                // Wire up the programming anchor.
                $("#ProgrammingAnchor").click(function () {

                    try {
                    
                        // Open and load the programming fragment into the sub content div.
                        var exceptionRet = utility.loadProgramming();
                        if (exceptionRet !== null) {
                        
                            throw exceptionRet;
                        }
                    } catch (e) {
                    
                        alert(e.message);
                    }
                });

                // Wire up the robotics anchor.
                $("#RoboticsAnchor").click(function () {

                    try {
                    
                        // Open and load the robotics fragment into the sub content div.
                        var exceptionRet = utility.loadRobots();
                        if (exceptionRet !== null) {
                        
                            throw exceptionRet;
                        }
                    } catch (e) {
                    
                        alert(e.message);
                    }
                });

                // Wire up the mentor anchor.
                $("#MentorsAnchor").click(function () {

                    try {
                    
                        // Open and load the mentor fragment into the sub content div.
                        var exceptionRet = utility.loadMentors();
                        if (exceptionRet !== null) {
                        
                            throw exceptionRet;
                        }
                    } catch (e) {
                    
                        alert(e.message);
                    }
                });

                // Wire up the administration anchor.
                $("#AdministrationAnchor").click(function () {

                    try {
                    
                        // Open and load the administration fragment into the sub content div.
                        var exceptionRet = utility.loadAdministration();
                        if (exceptionRet !== null) {
                        
                            throw exceptionRet;
                        }
                    } catch (e) {
                    
                        alert(e.message);
                    }
                });

				
                // Wire up the mission anchor.
                $("#MissionAnchor").click(function () {

                    try {
                    
                        // Open and load the mission fragment into the sub content div.
                        var exceptionRet = utility.loadMission();
                        if (exceptionRet !== null) {
                        
                            throw exceptionRet;
                        }
                    } catch (e) {
                    
                        alert(e.message);
                    }
                });

                // Wire up the about anchor.
                $("#AboutAnchor").click(function () {

                    try {
                    
                        // Open and load the about fragment into the sub content div.
                        var exceptionRet = utility.loadAbout();
                        if (exceptionRet !== null) {
                        
                            throw exceptionRet;
                        }
                    } catch (e) {
                    
                        alert(e.message);
                    }
                });
				

                // Wire up the locations anchor.
                $("#LocationsAnchor").click(function () {

                    try {
                    
                        // Open and load the about fragment into the sub content div.
                        var exceptionRet = utility.loadLocations();
                        if (exceptionRet !== null) {
                        
                            throw exceptionRet;
                        }
                    } catch (e) {
                    
                        alert(e.message);
                    }
                });

				} catch (e) {

                alert(e.message);
            }
        });
});
