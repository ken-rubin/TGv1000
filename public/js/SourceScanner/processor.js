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

            // Method returns the blockly workspace as a JSON object.
            self.getWorkspaceJSONObject = function () {

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
            self.getWorkspaceXMLDoc = function () {

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

                // Get the last block.
                return self.getLastBlock(objectPrimaryBlockChain);
            };

            // Extract the last block from the primary block chain.
            self.getLastBlock = function (objectPrimaryBlockChain) {

                // Just return if null.
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
            self.getPrimaryBlockChain = function (objectJSON) {

                // TODO: Might have to search for the function wrapper. For now we're assuming it's all there is (if present).

                if (!objectJSON.children ||
                    !objectJSON.children.length) {

                    return null;
                }

                if (objectJSON.children[0].children.length < 3) {

                    return null;
                }

                // Return the statements inside the stack.
                return objectJSON.children[0].children[2].children[0];
            };
        };

        // Return instance.
        return new functionRet();
    });
