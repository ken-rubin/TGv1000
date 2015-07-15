///////////////////////////////////////
// Coder module
//
// Return object instance.
//

"use strict";

// Define module.
define(["SourceScanner/converter", "SourceScanner/processor"],
    function (converter, processor) {

        // Define constructor function.
        var functionRet = function Coder() {

            var self = this;

            ///////////////////////////
            // Public methods

            // Method adds a "set property value" Blockly block to Blockly.
            self.add_SetPropertyValue = function (strType, strProperty, strValue, strInstance) {

                try {
/*
<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="Thingy_setX" id="42" inline="true" x="90" y="90">
        <value name="SELF">
            <block type="App_getThingyInstance" id="46">
            </block>
        </value>
        <value name="VALUE">
            <block type="math_number" id="56">
                <field name="NUM">
                0
                </field>
            </block>
        </value>
    </block>
</xml>
*/
                    return m_functionAdd({

                        nodeName: "block",
                        type: strType + "_set" + strProperty,
                        id: m_functionGetNextId(),
                        inline: "true",
                        x: "100",
                        y: "100",
                        children: [

                            {

                                nodeName: "value",
                                name: "SELF",
                                children: [

                                    {

                                        nodeName: "block",
                                        type: "app_get" + strInstance,
                                        id: m_functionGetNextId()
                                    }
                                ]
                            }, {

                                nodeName: "value",
                                name: "VALUE",
                                children: [

                                    {

                                        nodeName: "block",
                                        type: "math_number",
                                        id: m_functionGetNextId(),
                                        children: [

                                            {

                                                nodeName: "field",
                                                name: "NUM",
                                                contents: strValue
                                            }
                                        ]
                                    }
                                ]
                            }

                        ]
                    });
                } catch (e) {

                    return e;
                }
            };

            // Method adds an "allocate type" Blockly block to Blockly.
            self.add_AllocateType = function (strType, strId) {

                try {
/*
<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="App_setThingy" id="6" inline="true" x="150" y="90">
        <value name="VALUE">
            <block type="new_Thingy" id="20">
            </block>
        </value>
    </block>
</xml>
*/
                    return m_functionAdd({

                        nodeName: "block",
                        type: "app_set" + strId,
                        id: m_functionGetNextId(),
                        inline: "true",
                        x: "150",
                        y: "100",
                        children: [

                            {

                                nodeName: "value",
                                name: "VALUE",
                                children: [

                                    {

                                        nodeName: "block",
                                        type: "new_" + strType,
                                        id: m_functionGetNextId()
                                    }
                                ]
                            }
                        ]
                    });
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////
            // Private methods.

            // Return the next id as a string.
            var m_functionGetNextId = function () {

                return (m_iId++).toString();
            };

            // Add block to Blockly workspace.
            var m_functionAdd = function (blockNew) {

                try {

                    // .
                    var objectWorkspace = processor.getWorkspaceJSONObject();
                    if (!objectWorkspace) {

                        throw { messgage: "Failed to get the workspace object." };
                    }

                    // Get the block with which to work.
                    var blockWork = processor.getWorkBlock(objectWorkspace);

                    // If there is a work block, add new block it it, otherwise
                    if (blockWork) {

                        // Add the new block to the work block.
                        blockWork.next = blockNew;
                    } else {

                        // Add directly to the XML object--this is the first block.
                        objectWorkspace.children = [];
                        objectWorkspace.children.push(blockNew);
                    }

                    // Convert back to XML.
                    var strXml = converter.toXML(objectWorkspace);
                    if (!strXml) {

                        throw new Error("Failed to convert workspace XML to JSON.");
                    }

                    // First get the app type.
                    var typeApp = types.getType("app");
                    if (!typeApp) {

                        throw { message: "Failed to find app type." };
                    }

                    // Next get the initialize method.
                    var methodInitialize = typeApp.getMethod("initialize");
                    if (!methodInitialize) {

                        throw { message: "Failed to find initialize method of app type." };
                    }

                    // Get the workspace.
                    methodInitialize.workspace = strXml;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////
            // Private fields.

            // Starting id.
            var m_iId = 100;
        };

        // Return instance.
        return new functionRet();
    });
