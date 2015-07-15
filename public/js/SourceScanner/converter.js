///////////////////////////////////////
// XmlJSONConverter module
//
// Return instance.
//

"use strict";

// Define module.
define([],
    function () {

        // Define constructor function.
        var functionRet = function Converter() {

            var self = this;

            ///////////////////////////
            // Public methods

            // .
            //
            // .
            self.toJSON = function (strXML) {

                // Convert.

                var objectJSON = {};
                if (!strXML) {

                    return { nodeName:"xml", xmlns:"http://www.w3.org/1999/xhtml" };
                }
                var exceptionRet = m_functionRecurse(objectJSON,
                    { payload:strXML });
                if (exceptionRet) {

                    throw exceptionRet;
                }

                // Set the reference payload.
                if (objectJSON.children &&
                    objectJSON.children.length) {

                    return objectJSON.children[0];
                } else {

                    throw { message : "Invalid JSON object generated." };
                }
            };

            // .
            //
            // .
            self.toXML = function (objectJSON) {

                try {

                    // Convert.
                    return m_functionOutput(objectJSON);
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////
            // Private methods

            // Chew off a piece of the xml and compose into the json object.
            var m_functionOutput = function (objectJSON) {

                var strThis = "<" + 
                    objectJSON.nodeName +
                    " ";

                for(var strKey in objectJSON) {
                
                    if (objectJSON.hasOwnProperty(strKey) &&
                        strKey != "next" &&
                        strKey != "nodeName" &&
                        strKey != "children" &&
                        strKey != "contents") {

                        var strValue = objectJSON[strKey];
                        strThis += strKey + "=\"" + strValue + "\" ";
                    }
                }

                strThis += ">";

                if (objectJSON.children) {

                    for (var i = 0; i < objectJSON.children.length; i++) {

                        var strChild = m_functionOutput(objectJSON.children[i]);
                        strThis += strChild;
                    }
                }
                if (objectJSON.contents) {

                    strThis += objectJSON.contents;
                }
                if (objectJSON.next) {

                    strThis += "<next>" + m_functionOutput(objectJSON.next) + "</next>";
                }

                return strThis + "</" + 
                    objectJSON.nodeName +
                    ">";
            };

            // Chew off a piece of the xml and compose into the json object.
            var m_functionRecurse = function (objectJSON, objectXMLContainer) {

                try {

                    // Keep consuming until no more XML.
                    while (true) {

                        // If empty, we're done, return.
                        if (objectXMLContainer.payload.length === 0) {

                            return null;
                        }

                        // Rip off the next bit and either recurse 
                        // down for a new object or return up a level.
                        var iOpenIndex = objectXMLContainer.payload.indexOf("<");
                        if (iOpenIndex === -1) {

                            throw new Error("Invalid XML (no open): " + objectXMLContainer.payload);
                        }
                        var iCloseIndex = objectXMLContainer.payload.indexOf(">");
                        if (iCloseIndex === -1) {

                            throw new Error("Invalid XML (no close): " + objectXMLContainer.payload);
                        }

                        // Get the string inside the angles.
                        var strNextOrt = objectXMLContainer.payload.substring(iOpenIndex + 1,
                            iCloseIndex - iOpenIndex);

                        // Update Xml for next pass
                        objectXMLContainer.payload = objectXMLContainer.payload.substring(iCloseIndex + 1);

                        // If the first character is a forward-slash, then it  
                        // may safely be assumed that this level should return.
                        if (strNextOrt[0] === "/") {

                            return null;
                        } else {

                            // Get node name.
                            var iSpaceIndex = strNextOrt.indexOf(" ");
                            if (iSpaceIndex === -1) {

                                // If -1, then must be a single tag, no attributes.
                                iSpaceIndex = strNextOrt.length;
                            }
                            var strName = strNextOrt.substring(0, iSpaceIndex);
                            strNextOrt = strNextOrt.substring(iSpaceIndex + 1);

                            var objectChild = {

                                nodeName: strName
                            };

                            // Add all attributes to objectChild.
                            while (true) {

                                if (strNextOrt.length === 0) {

                                    break;
                                }

                                var iEqualsIndex = strNextOrt.indexOf("=");
                                if (iEqualsIndex === -1) {

                                    break;
                                }
                                var strAttributeName = strNextOrt.substring(0, iEqualsIndex);
                                var iOpenQuoteIndex = strNextOrt.indexOf("\"");
                                if (iOpenQuoteIndex === -1) {

                                    throw new Error("Invalid XML attribute (open quote): " + strNextOrt);
                                }
                                var iCloseQuoteIndex = strNextOrt.indexOf("\"", iOpenQuoteIndex + 1);
                                var strAttributeValue = strNextOrt.substr(iOpenQuoteIndex + 1,
                                    iCloseQuoteIndex - iOpenQuoteIndex - 1);

                                // Stow in object.
                                objectChild[strAttributeName] = strAttributeValue;

                                // Update the next ort.
                                strNextOrt = strNextOrt.substring(iCloseQuoteIndex + 1);
                            }

                            // Check the updated payload if it does not start
                            // with a "<", and so it must contain contents.
                            if (objectXMLContainer.payload[0] !== "<") {

                                // Read up to the opening angle-bracket.
                                var iOpenBracketIndex = objectXMLContainer.payload.indexOf("<");
                                var strContents = objectXMLContainer.payload.substring(0, iOpenBracketIndex);
                                objectXMLContainer.payload = objectXMLContainer.payload.substring(iOpenBracketIndex);

                                // Stow in object.
                                objectChild.contents = strContents;
                            }

                            // Recurse down for this object.
                            var exceptionRet = m_functionRecurse(objectChild,
                                objectXMLContainer);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // If it is a next, then add it as the next, else, add it as a child.
                            if (objectChild.nodeName === "next" &&
                                objectChild.children &&
                                objectChild.children.length) {

                                objectJSON.next = objectChild.children[0];
                            } else {

                                // Allocate collection if not set.
                                if (!objectJSON.children) {

                                    objectJSON.children = [];                                
                                }
                                objectJSON.children.push(objectChild);
                            }
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };
        };

        // Return instance.
        return new functionRet();
    });
