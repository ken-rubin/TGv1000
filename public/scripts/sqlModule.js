///////////////////////////////////////
// sql access module for mithrilsoft.
//
// Returns singleton instance.

"use strict";

define([],
    function () {

        // Sql constructor function.
        var functionRet = function Sql() {

            var self = this;            // Uber-closure.

            ////////////////////////////
            // Public method.

            // Method executes the sepecified sql against the mithrilsoft data interface.
            //
            // Note: functionSuccess takes a single result parameter, 
            //       and functionError thats a single string parameter.
            // Note: A result parameter can be an array of row objects 
            //       (attributes as column names), or an int result count).
            self.execute = function (strSql,        // Sql to execute.  E.g. SELECT * FROM dodo.users
                functionSuccess,                    // Callback for successful requests.
                functionError) {                    // Callback for failed requests.

                try {

                    // Talk to server.
                    $.ajax({

                        type: "POST",
                        url: "/sql",
                        data: { 

                            sql: strSql
                        },
                        success: function (objectData,
                            strTextStatus,
                            jqxhr) {

                            try {

                                // Check for processing error.
                                if (objectData.success === false) {

                                    // On error, throw error.
                                    throw {
                                            
                                        message: JSON.stringify(objectData.reason)
                                    };
                                }

                                // Extract the payload result and pass on to the callback.
                                functionSuccess(objectData.result);
                            } catch (e) {

                                // Call error handler.
                                functionError("Processing error: " + e.message);
                            }
                        },
                        error: function (jqxhr,
                            strTextStatus,
                            strError) {

                            // Call error handler.
                            functionError("Communication error: " + strError);
                        }
                    });
                    return null;
                } catch (x) {

                    return x;
                }
            };
        };

        return new functionRet();
    });
