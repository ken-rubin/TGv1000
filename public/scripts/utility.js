///////////////////////////////////////
// Singleton utility helper object for tech groms.
//
// Returns singleton instance.

"use strict";

define(["sqlModule",
    "TemplateEngine"],
    function (sql,
        TemplateEngine) {

        // Constructor function.
        var functionRet = function Utility() {

            var self = this;            // Uber-closure.

            ////////////////////////////
            // Public methods.
            
            self.authenticate = function(functionError) {
                
                var userName = $("#inputName").val();
                $.ajax({
                    
                    type: "POST",
                    url: "/BOL/SignInBO",
                    data: { userName: userName, password: $("#inputPassword").val()},
                    success: function (objectData,
                        strTextStatus,
                        jqxhr) {

                            try {
                                
                                if (!objectData.success) {
                                    
                                    // Call error handler.
                                    functionError(objectData.message);
                                } else {

                                    // Handle the successful signin.
                                    document.cookie = "userId=" + objectData.userId.toString();
                                    document.cookie = "userName=" + userName;
                                    location.href = objectData.nextURL;
                                }
                            } catch (e) {

                                // Call error handler.
                                functionError("Processing error: " + e.message);
                            }},
                    error: function (jqxhr,
                        strTextStatus,
                        strError) {

                            // Call error handler.
                            functionError("Communication error: " + strError);
                        }
                });
            };

            // Helper method sets the current date in the header div.
            self.setHeaderDate = function () {
       
                try {

                    // Get the current date.
                    var dateNow = new Date();
                    var strDate = dateNow.toLocaleDateString();
       
                    // Set in DOM.  JFLO - removed the date.  Don't think we need it which means we probably don't
					// need this function but I will leave it for now
                    $("#HeaderTextDiv").text("Surfing the wave of the future");
                    
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Load classes into the sub-content div.
            self.loadClasses = function (which) {

                try {

                    // Open the menu.
                    var exceptionRet = m_functionOpenMenuDiv();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }

                    // Load the classes into the sub-content div.
                    return m_functionGetClasses(which);
                } catch (e) {

                    return e;
                }
            };

            // Load skills and drills into the sub-content div.
            self.loadSkillsDrills = function () {

                try {

                    // Open the menu.
                    var exceptionRet = m_functionOpenMenuDiv();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }
       
                    var te = new TemplateEngine(m_divSubContent,
                        "skillsdrills");

                    // Load the skills & drills blurb into the sub-content div.
                    return te.process();
                } catch (e) {

                    return e;
                }
            };

            // Load courses into the sub-content div.
            self.loadCourses = function () {

                try {

                    // Open the menu.
                    var exceptionRet = m_functionOpenMenuDiv();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }
       
                    var te = new TemplateEngine(m_divSubContent,
                        "courses");

                    // Load the courses blurb into the sub-content div.
                    return te.process();
                } catch (e) {

                    return e;
                }
            };

            // Load calendar into the sub-content div.
            self.loadCalendar = function () {

                try {

                    // Open the menu.
                    var exceptionRet = m_functionOpenMenuDiv();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }

                    var te = new TemplateEngine(m_divSubContent,
                        "calendar");

                    // Load the calendar blurb into the sub-content div.
                    return te.process();
                } catch (e) {

                    return e;
                }
            };
			
            // Load the programming content into the sub-content div.
            self.loadProgramming = function () {

                try {

                    // Open the menu.
                    var exceptionRet = m_functionOpenMenuDiv();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }
       
                    var te = new TemplateEngine(m_divSubContent,
                        "programming");

                    // Load the programming blurb into the sub-content div.
                    return te.process();
                } catch (e) {

                    return e;
                }
            };

            // Load the robots content into the sub-content div.
            self.loadRobots = function () {

                try {

                    // Open the menu.
                    var exceptionRet = m_functionOpenMenuDiv();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }
       
                    var te = new TemplateEngine(m_divSubContent,
                        "robotics");

                    // Load the robotics blurb into the sub-content div.
                    return te.process();
                } catch (e) {

                    return e;
                }
            };

            // Load mentors into the sub-content div.
            self.loadMentors = function () {

                try {

                    // Open the menu.
                    var exceptionRet = m_functionOpenMenuDiv();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }

                    var te = new TemplateEngine(m_divSubContent,
                        "mentors");

                    // Load the mentors blurb into the sub-content div.
                    return te.process();
                } catch (e) {

                    return e;
                }
            };

            // Load administration into the sub-content div.
            self.loadAdministration = function () {

                try {

                    // Open the menu.
                    var exceptionRet = m_functionOpenMenuDiv();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }

                    var te = new TemplateEngine(m_divSubContent,
                        "administration");

                    // Load the administration blurb into the sub-content div.
                    return te.process();
                } catch (e) {

                    return e;
                }
            };

            // Load mission into the sub-content div.
            self.loadMission = function () {

                try {

                    // Open the menu.
                    var exceptionRet = m_functionOpenMenuDiv();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }

                    var te = new TemplateEngine(m_divSubContent,
                        "mission");

                    // Load the mission blurb into the sub-content div.
                    return te.process();
                } catch (e) {

                    return e;
                }
            };

            // Load about into the sub-content div.
            self.loadAbout = function () {

                try {

                    // Open the menu.
                    var exceptionRet = m_functionOpenMenuDiv();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }

                    var te = new TemplateEngine(m_divSubContent,
                        "about");

                    // Load the about blurb into the sub-content div.
                    return te.process();
                } catch (e) {

                    return e;
                }
            };

            // Load about into the sub-content div.
            self.loadLocations = function () {

                try {

                    // Open the menu.
                    var exceptionRet = m_functionOpenMenuDiv();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }

                    var te = new TemplateEngine(m_divSubContent,
                        "locations");

                    // Load the about blurb into the sub-content div.
                    return te.process();
                } catch (e) {

                    return e;
                }
            };
			
            // Load the enroll content into the sub-content div.
            self.loadEnroll = function (strName,
                strCost,
				strLocation,
                dCents,
                strClassId) {

                try {

                    // Open the menu.
                    var exceptionRet = m_functionOpenMenuDiv();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }
       
                    var te = new TemplateEngine(m_divSubContent,
                        "enroll");

                    // Load the enroll blurb into the sub-content div.
                    return te.process([{
                    
                        name: strName,
                        cost: strCost,
						location: strLocation,
                        cents: dCents,
                        classId: strClassId,
                    }]);
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods.
       
            // Get data from sql.
            // which is {which: 'active'} or {which: 'all'}
            var m_functionGetClasses = function (which) {
       
                try {
       
                    $.ajax({
                        
                        type: "POST",
                        url: "/BOL/UtilityBO/GetClasses",
                        data: which,
                        success: function (objectData,
                            strTextStatus,
                            jqxhr) {

                                try {
                                    
                                    if (!objectData.success) {
                                        
                                        alert(objectData.strError);
                                    } else {

                                        var te = new TemplateEngine(m_divSubContent,
                                            "class");

                                        // Load the classes into the sub-content div.
                                        var exceptionRet = te.process(objectData.arrayRows);
                                        if (exceptionRet !== null) {
                                        
                                            throw exceptionRet;
                                        }
                                    }
                                } catch (e) {

                                    alert(e.message);
                                }},
                        error: function (jqxhr,
                            strTextStatus,
                            strError) {

                                alert("Communication error: " + strError);
                            }
                    });

                    return null;
                } catch (e) {
       
                    return e;
                }
            };

            // Open the menu div.
            var m_functionOpenMenuDiv = function () {

                try {

                    // Try to get div.
                    m_divSubContent = $("#SubContentDiv");
                    if (m_divSubContent &&
                        m_divSubContent.length !== 0) {
       
                        m_divSubContent.remove();
                    }
       
                    m_divSubContent = $("<div id='SubContentDiv'></div>");

                    // Animate open.
                    var jqMenuDiv = $("#MenuDiv");
                    jqMenuDiv.animate({
                    
                        "right": "20px"
                    }, 200, function () {
                    
                        try {
                        
                            // Add the subcontent div to the menu.
                            jqMenuDiv.append(m_divSubContent);
                            
                            // Make visible.
                            m_divSubContent.fadeIn();
                            
                            // Set state to not open again.
                            m_bMenuDivOpen = true;
                        } catch (e) {
                        
                            alert(e.message);
                        }
                    });

                    return null;
                } catch (x) {

                    return x;
                }
            };

            ////////////////////////////
            // Private fields.

            // Remember if the menu div has been expanded.
            var m_bMenuDivOpen = false;
            // The container that gets loaded up when the user clicks menu buttons.
            var m_divSubContent = $("<div id='SubContentDiv'></div>");
        };

        // Return instance, a.k.a singleton.
        return new functionRet();
    });
