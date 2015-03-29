//////////////////////////////////////
// CreditProcessor wraps access to the swipe js API.
//
// Return constructor function or exception.
//
// Note: Assumes: https://js.stripe.com/v2/ is loaded into the DOM.

"use strict";

define([],
    function () {
    
        try {
       
            // Define constructor function.
            var functionRet = function CreditProcessor() {

                var self = this;            // Uber closure.
       
                // Method places a stripe charge.
                //
                // strParentName -- billable name and parent.
                // strChildName -- student.
                // strEmail -- Parent's email.
                // strPhone -- Parent's cell.
                // strCCNumber -- Credit card number.
                // strCCMonth -- Month of credit card.
                // strCCYear -- Year of credit card.
                // strCCCVC -- Credit card validation.
                // strClassId -- The id of the class to purchase.
                // dAmount -- The amount of the purchase.
                // functionSuccess -- Success callback.  Takes charge id.
                // functionError -- Error handler.  Takes error string.
                self.createCharge = function (strParentName,
                    strChildName,
                    strEMail,
                    strPhone,
                    strCCNumber,
                    strCCMonth,
                    strCCYear,
                    strCCCVC,
                    strClassId,
                    dAmount,
					strClassName,
					strLocation,
					strParentFirst,
                    strParentLast,
                    functionSuccess,
                    functionError) {
       
                    try {

                        // We wouldn't be here with any blank fields, but we COULD be here with an improper e-mail address. So....
                        var emailRegex = new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$");
                        if (!emailRegex.test(strEMail.toUpperCase())) {

                            functionError("That does not appear to be a valid e-mail address.");
                            return null;
                        }

                        // Ask server what is the publish key for stripe.
                        $.ajax({

                            url: "/RequestStripePublicKey",
                            dataType: "jsonp",
                            success: function (response,
                                strTextStatus,
                                jqxhr) {

                                try {

                                    // Check for processing error.
                                    if (response.success === false) {

                                        // On error, throw error.
                                        throw {
                                            
                                            message: response.reason
                                        };
                                    }

                                    // Set the publish key here, now that it is known.
                                    Stripe.setPublishableKey(response.key);

                                    // Create the token to send to the server.
                                    Stripe.card.createToken({
                                    
                                        name: strParentName,
                                        number: strCCNumber,
                                        cvc: strCCCVC,
                                        exp_month: strCCMonth,
                                        exp_year: strCCYear
                                    }, function (status,
                                        response) {
                                    
                                        try {
                                        
                                            // If error.
                                            if (response.error) {
                                            
                                                // Invoke error handler.
                                                throw response.error;
                                            } else {
                                            
                                                // Extract the safe-token.
                                                var strToken = response.id;
                                                
                                                // Compose url to upload new cct.
                                                var strUrl = "/CreditProcessor?parentName=" + encodeURIComponent(strParentName) +
                                                    "&childName=" + encodeURIComponent(strChildName) +
                                                    "&email=" + encodeURIComponent(strEMail) +
                                                    "&phone=" + encodeURIComponent(strPhone) +
                                                    "&classId=" + encodeURIComponent(strClassId) +
                                                    "&amount=" + encodeURIComponent(dAmount) +
                                                    "&classname=" + encodeURIComponent(strClassName) +
                                                    "&location=" + encodeURIComponent(strLocation) +
                                                    "&parentfirst=" + encodeURIComponent(strParentFirst) +
                                                    "&parentlast=" + encodeURIComponent(strParentLast) +
                                                    "&token=" + encodeURIComponent(strToken);

                                                // Talk to server.
                                                $.ajax({

                                                    url: strUrl,
                                                    dataType: "jsonp",
                                                    success: function (response,
                                                        strTextStatus,
                                                        jqxhr) {

                                                        try {

                                                            // Check for processing error.
                                                            if (response.success === false) {

                                                                // If response.reason starts with "suggest:",
                                                                // then alert user as to duplicate child name and suggest what follows.
                                                                if (response.reason === "Name") {

                                                                    throw {

                                                                        message: strChildName + " is already a user name in TechGroms.  Please enter a different user name for your child."
                                                                    };
                                                                }

                                                                // On error, throw error.
                                                                throw {
                                                                        
                                                                    message: response.reason
                                                                };
                                                            }

                                                            // Extract the payload result and pass on to the callback.
                                                            functionSuccess(response.chargeId);
                                                        } catch (e) {

                                                            // Call error handler.
                                                            functionError(e.message);
                                                        }
                                                    },
                                                    error: function (jqxhr,
                                                        strTextStatus,
                                                        strError) {

                                                        // Call error handler.
                                                        functionError("Communication error: " + strError);
                                                    }
                                                });
                                            }
                                        } catch (e) {
                                        
                                            functionError("Request error: " + e.message);
                                        }
                                    });
                                } catch (e) {

                                    // Call error handler.
                                    alert("Processing error: " + e.message);
                                }
                            },
                            error: function (jqxhr,
                                strTextStatus,
                                strError) {

                                // Call error handler.
                                alert("Communication error: " + strError);
                            }
                        });

                        return null;
                    } catch (e) {
       
                        return e;
                    }
                };
            };

            // Return constructor function.
            return functionRet;
        } catch (e) {
       
            return e;
        }
    });