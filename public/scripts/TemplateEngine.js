///////////////////////////////////////
// TemplateEngine helper object knows how to customize and load templated content into the DOM.
//
// Return constructor function.

"use strict";

define([],
    function () {

        // Constructor function.
        var functionRet = function TemplateEngine(jContainer,
            strName) {

            var self = this;            // Uber-closure.

            ////////////////////////////
            // Public fields.
       
            // Base URL for composing ajax request url.
            self.baseURL = "templates/";
            // CSS-fragment extension.
            self.extensionCSS = ".css";
            // Opening tag for embedding style element.
            self.tagOpenStyle = "<style>";
            // Closing tag for embedding style element.
            self.tagCloseStyle = "</style>";
            // HTML-fragment extension.
            self.extensionHTML = ".html";

            ////////////////////////////
            // Public methods.

            // Entry point method, begins process of getting CSS file,
            // appending CSS and then getting HTML file and templating.
            // HTML file templating is based on bracketing replacments.
            // Example: "<HTML>[title]</HTML>", { title: "Lorem ipsum" }.
            //
            // objectSource -- Single object, or array of objects.  In either case, data objects must be composed of simple types.
            // functionSuccess -- parameterless method invoked when templating is complete.
            // functionError -- method takes single strError parameter, invoked when templating fails.
            //
            // Returns Exception indicating error or null.
            self.process = function (objectSource,
                functionSuccess,
                functionError) {
       
                try {

                    // Function success does not need to be specified.
                    // Function error does.  For worst case, just alert.
                    if (!$.isFunction(functionError)) {
       
                        functionError = alert;
                    }
                    if (objectSource === undefined) {
       
                        objectSource = {};  // Minimum non-error-inducing form.
                    }

                    // Get the template CSS file.
                    $.ajax({
                    
                        url : self.baseURL + strName + self.extensionCSS,   // Compose request URL for CSS document.
                        dataType: "text",
                        success: function (strCSS) {
                        
                            try {
                           
                                // Append the CSS string as an embedded style element.
                                jContainer.append(self.tagOpenStyle + strCSS + self.tagCloseStyle);

                                // Pass on to the next step.
                                var exceptionRet = m_functionCSSSuccess(objectSource,
                                    functionSuccess,
                                    functionError);
                                if (exceptionRet !== null) {
                           
                                    functionError(exceptionRet.message);
                                }
                            } catch (e) {
                           
                                functionError(e.message);
                            }
                        },
                        error: function (jqxhr,
                            strTextStatus,
                            strError) {

                            functionError(strError);
                        }
                    });

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods.

            // Request HTML document-fragment.
            var m_functionCSSSuccess = function (objectSource,
                functionSuccess,
                functionError) {
       
                try {

                    // Get the template HTML file.
                    $.ajax({
                    
                        url : self.baseURL + strName + self.extensionHTML,   // Compose request URL for CSS document.
                        dataType: "text",
                        success: function (strHTML) {
                        
                            try {
                           
                                // Process source against HTML.
                                var exceptionRet = m_functionHTMLSuccess(strHTML,
                                    objectSource);
                                if (exceptionRet !== null) {
                           
                                    functionError(exceptionRet.message);
                                } else {
                           
                                    // Invoke success callback.
                                    if ($.isFunction(functionSuccess)) {

                                        functionSuccess();
                                    }
                                }
                            } catch (e) {
                           
                                functionError(e.message);
                            }
                        },
                        error: function (jqxhr,
                            strTextStatus,
                            strError) {

                            functionError(strError);
                        }
                    });

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Template HTML document-fragment or fragments (depending on type of source).
            var m_functionHTMLSuccess = function (strHTML,
                objectSource) {
       
                try {

                    // Loop if array, else, just template the single object.
                    if (Array.isArray(objectSource)) {
       
                        // Alias.
                        var arraySource = objectSource;

                        // Add a block-div for each row selected.
                        for (var i = 0; i < arraySource.length; i++) {
       
                            // Get the ith item.
                            var objectData = arraySource[i];

                            // Template it.
                            var exceptionRet = m_functionTemplateObject(strHTML,
                                objectData);
                            if (exceptionRet !== null) {
       
                                return exceptionRet;
                            }
                        }
                    } else {
       
                        // Template it.
                        var exceptionRet = m_functionTemplateObject(strHTML,
                            objectSource);
                        if (exceptionRet !== null) {
   
                            return exceptionRet;
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Template single data object.
            var m_functionTemplateObject = function (strHTML,
                objectData) {
       
                try {

                    // Get all the keys from the data object.
                    var arrayKeys = Object.keys(objectData);
       
                    // Make a copy of the html string.
                    var strHTMLTemplate = strHTML;

                    // Attempt to template each key.
                    for (var i = 0; i < arrayKeys.length; i++) {
       
                        // Get the ith key.
                        var strKeyIth = arrayKeys[i];
       
                        // Replace the key (perhaps).
                        strHTMLTemplate = strHTMLTemplate.split("[" + strKeyIth + "]").join(objectData[strKeyIth]);
                    }

                    // Append the templated
                    jContainer.append(strHTMLTemplate);

                    return null;
                } catch (e) {

                    return e;
                }
            };
        };

        // Return constructor.
        return functionRet;
    });
