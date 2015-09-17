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

                // First get the app type.
                var typeApp = types.getType("App");
                if (!typeApp) {

                    throw { message: "Failed to find App type." };
                }

                // Next get the initialize method.
                var methodInitialize = typeApp.getMethod("initialize");
                if (!methodInitialize) {

                    throw { message: "Failed to find initialize method of App type." };
                }

                // Get the workspace.
                var strWorkspaceXml = methodInitialize.workspace;

                // Convert xml to json.
                var workspaceJSONObject = converter.toJSON(strWorkspaceXml);
                return workspaceJSONObject;
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
            self.getPrimaryBlockChain = function (objectJSON) {

                // Do something to scan the object for the primary block chain:

                // Are there no chains at all?  (Return an empty, non-null statement-chain.)

                // Is there just one chain?

                // No?, then get the list of chains that only contain 
                // commands for adding objects and setting property values.

                if (!objectJSON.children ||
                    !objectJSON.children.length) {

                    return null;
                }

                // Take the first one.
                return objectJSON.children[0];
            };
        };

        // Return instance.
        return new functionRet();
    });
