/////////////////////////////
// Processor - processes Blockly workspaces.
//
// Return object instance.
//

"use strict";

// Define module.
define(["SourceScanner/converter"],
    function (converter) {

        // Define constructor function.

        var functionRet = function Processor() {

            var self = this;

            ///////////////////////////
            // Public methods

            // Method returns the App::initialize workspace as a JSON object.
            self.getAppInitializeJSONObject = function () {

                ////////////////////
                // Get the initialize method from the app type.

                // Next get the initialize method.
                var methodInitialize = g_clTypeApp.getMethod("initialize");
                if (!methodInitialize) {

                    throw { message: "Failed to find initialize method of App type." };
                }

                // Get the workspace.
                var strWorkspaceXml = methodInitialize.workspace;

                // Convert xml to json.
                var workspaceJSONObject = converter.toJSON(strWorkspaceXml);
                return workspaceJSONObject;
            };

            // Method returns the blockly workspace as an XML doc.
            self.getAppInitializeXMLDoc = function () {

                ////////////////////
                // Get the initialize method from the app type.

                // Next get the initialize method.
                var methodInitialize = g_clTypeApp.getMethod("initialize");
                if (!methodInitialize) {

                    throw { message: "Failed to find initialize method of App type." };
                }

                // Get the workspace.
                return methodInitialize.workspace;
            };

            // Method returns the block with which to work given the workspace JSON object.
            self.getWorkBlock = function (objectJSON) {

                // Get just the primary block chain.
                var objectPrimaryBlockChain = self.getPrimaryBlockChain(objectJSON);
                if (!objectPrimaryBlockChain) {

                    return null;
                }

                // Get the last next.
                var objectCursor = objectPrimaryBlockChain;
                while (objectCursor.next) {

                    objectCursor = objectCursor.next
                }

                // Return it.
                return objectCursor;
            }

            // Extract the primary block chain from the JSON object.
            // This is the stack of statements inside the function wrapper. Or null if none.
            // Note: there may be stuff (any kind of stuff) before or after the c-block function wrapper.
            // In the possible case that more than one c-block function wrappers are present, we have a little dilemma.
            // The user has been mucking around and has created something that's not really correct.
            // We've added an optional second parameter to this method that defaults to "initialize" but can contain
            // the name of the method whose c-block we're interested in.
            /* An objectJSON looks like this:
                        {
                            nodeName: "xml",
                            xmlns: "http://www.w3.org/1999/xhtml",
                            children:
                            [
                                {},                                <=== possibly one or more non-matching objects
                                {
                                    nodeName: "block",
                                    type: "procedures_defnoreturn",
                                    children:
                                    [
                                        {
                                            nodeName: "mutation",
                                            children:
                                            [
                                                {
                                                    name: "self",
                                                    nodeName: "arg"
                                                }
                                            ]
                                        },
                                        {
                                            contents: "initialize",     <=== this must match methodName
                                            name: "NAME",
                                            nodeName: "field"
                                        },
                                        {
                                            nodeName: "statement",
                                            name: "STACK",
                                            children:
                                            [
                                                === this is the primary block chain ===
                                            ]
                                        }
                                    ],
                                },
                                {}                                <=== possibly one or more non-matching objects
                            ]
                        }
                        Note the outer children array. In a well-formed example it has 1 object and that object is indeed
                        of type "procedures_defnoreturn" (could be "procedures_defreturn").
                        A messier objectJSON could have multiple objects inside the outer children array. We have to
                        find the one that matches.
            */
            self.getPrimaryBlockChain = function (objectJSON, methodName) {

                methodName = methodName || "initialize";

                if (!objectJSON.children) { return null; }

                for (var i = 0; i < objectJSON.children.length; i++) {

                    var childIth = objectJSON.children[i];

                    // Check if childIth matches what we need.
                    if (childIth.hasOwnProperty("nodeName") && 
                        childIth.hasOwnProperty("type") &&
                        childIth.hasOwnProperty("children")) {

                        if (childIth.nodeName === "block" &&
                            childIth.type.substr(0, 11) === "procedures_" &&
                            childIth.children.length > 2) {     // mutation, field, statement and (if procedures_defreturn) return.

                            if (childIth.children[1].hasOwnProperty("contents")) {

                                if (childIth.children[1].contents === methodName) {

                                    if (childIth.children[2].hasOwnProperty("nodeName") &&
                                        childIth.children[2].hasOwnProperty("name") &&
                                        childIth.children[2].hasOwnProperty("children")) {

                                        if (childIth.children[2].nodeName === "statement" &&
                                            childIth.children[2].name === "STACK" &&
                                            childIth.children[2].children.length > 0) {

                                            return childIth.children[2].children[0];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                return null;
            };
        };

        // Return instance.
        return new functionRet();
    });
