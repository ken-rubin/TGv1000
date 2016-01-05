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

            // Does property exist in app.initialize workspace for toolinstance with id = strInstance?
            self.doesPropertyExist = function (strType, strProperty, strInstance) {

                var objectWorkspace = processor.getAppInitializeJSONObject();
                if (!objectWorkspace) {

                    throw { message: "Failed to get the workspace object." };
                }

                // Get the block with which to work.
                var blockWork = processor.getPrimaryBlockChain(objectWorkspace);

                // Compose, "MyType_setX", for which to search.
                var strBlockType = strType + "_set" + strProperty;

                // Compose the get for the instance from the app for which to search.
                var strInstanceType = g_clTypeApp.data.name + "_get" + strInstance;

                // If there is a work block, add new block it it, otherwise
                while (blockWork) {

                    // Look for a block whose type matches the composed.
                    if (blockWork.type === strBlockType &&
                        blockWork.children[0].children[0].type === strInstanceType) {

                        // Found it.
                        return true;
                    }

                    // Move to next statement in chain.
                    blockWork = blockWork.next;
                }

                return false;
            }

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
                        type: g_clTypeApp.data.name + "_set" + strId,
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
                                        type: g_clTypeApp.data.name + "_get" + strInstance,
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

            self.update_SetPropertyValue = function (strType, strProperty, strValue, strInstance) {

                try {

                    if (!self.doesPropertyExist(strType, strProperty, strInstance)) {

                        // Need to add the property AND set its value.
                        return self.add_SetPropertyValue(strType, strProperty, strValue, strInstance);
                    }

                    // .
                    var objectWorkspace = processor.getAppInitializeJSONObject();
                    if (!objectWorkspace) {

                        throw { message: "Failed to get the workspace object." };
                    }

                    // Get the block with which to work.
                    var blockWork = processor.getPrimaryBlockChain(objectWorkspace);

                    // Compose, "MyType_setX", for which to search.
                    var strBlockType = strType + "_set" + strProperty;

                    // Compose the get for the instance from the app for which to search.
                    var strInstanceType = g_clTypeApp.data.name + "_get" + strInstance;

                    // If there is a work block, add new block it it, otherwise
                    while (blockWork) {

                        // Look for a block whose type matches the composed.
                        if (blockWork.type === strBlockType &&
                            blockWork.children[0].children[0].type === strInstanceType) {

                            // Found it.
                            blockWork.children[1].children[0].children[0].contents = strValue;

                            // Keep searching, for some reason, this property could occur more than once.
                        }

                        // Move to next statement in chain.
                        blockWork = blockWork.next;
                    }

                    ///////////////////
                    // Save:

                    // Convert back to XML.
                    var strXml = converter.toXML(objectWorkspace);
                    if (!strXml) {

                        throw new Error("Failed to convert workspace XML to JSON.");
                    }

                    // Next get the initialize method.
                    var methodInitialize = g_clTypeApp.getMethod("initialize");
                    if (!methodInitialize) {

                        throw { message: "Failed to find initialize method of App type." };
                    }

                    // Set the workspace.
                    methodInitialize.workspace = strXml;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Part of renaming a dropped tool instance.
            self.update_ToolInstanceId = function (strOldId, strNewId, clAppType, property) {

                try {

                    // var xmlWorkspace = processor.getAppInitializeXMLDoc();
                    // if (!xmlWorkspace) {

                    //     throw { message: "Failed to get the workspace xml." };
                    // }

                    // var strAppTypeName = clAppType.data.name;
                    // var reOldSet = new RegExp('"' + strAppTypeName + "_set" + strOldId + '"', 'g');
                    // var strNewSet = strAppTypeName + "_set" + strNewId;
                    // var reOldGet = new RegExp('"' + strAppTypeName + "_get" + strOldId + '"', 'g');
                    // var strNewGet = strAppTypeName + "_get" + strNewId;

                    // xmlWorkspace = xmlWorkspace.replace(reOldSet, '"' + strNewSet + '"');
                    // xmlWorkspace = xmlWorkspace.replace(reOldGet, '"' + strNewGet + '"');

                    // // Update in initialize method of App type.
                    // // Get the initialize method.
                    // var methodInitialize = clAppType.getMethod("initialize");
                    // if (!methodInitialize) {

                    //     throw { message: "Failed to find initialize method of App type." };
                    // }

                    // // Set the workspace.
                    // methodInitialize.workspace = xmlWorkspace;

                    return code.renameProperty(clAppType, property, strOldId);

                } catch (e) {

                    return e;
                }
            }

            self.playThisInitializeWorkspace = function(objectPrimaryBlockChain) {

                // Clear designer.
                var objectArray = [];
                var strValue = null;
                var parts = [];
                var objectResult = null;

                // Scan.
                var objectCursor = objectPrimaryBlockChain;
/*
<xml xmlns="http://www.w3.org/1999/xhtml" >
    <block type="App_setP1T1"                    id="100"                    inline="true"                    x="150"                    y="100" >
        <value name="VALUE" >
            <block type="new_P1T1"                    id="101" />
        </value>
        <next>
            <block type="P1T1_setX"                   id="102"                   inline="true"                   x="100"                   y="100" >
                <value name="SELF" >
                    <block type="App_getP1T1"                   id="103" />
                </value>
                <value name="VALUE" >
                    <block type="math_number"                   id="104" >
                        <field name="NUM" >-603.65625</field>
                    </block>
                </value>
                .
                .
                .
*/                
                if (objectCursor) {

                    do {

                        // Use type="App_setXXX" to set id = XXX.
                        // Use type="new_YYY" to set type = YYY.
                        // Then set X, Y, Width, Height from children of type="YYY_set*"
                        var re = new RegExp(g_clTypeApp.data.name + "_set(.+)");
                        var arrayMatches = objectCursor.type.match(re);
                        if (arrayMatches && arrayMatches.length > 1) {

                            if (objectResult) {

                                objectArray.push(objectResult);
                            }

                            var strType = objectCursor.children[0].children[0].type.substring(4);

                            objectResult = {
                                id: arrayMatches[1],
                                type: strType,
                                X: 0,
                                Y: 0,
                                Width: 0,
                                Height: 0
                            };
                        } else {

                            var props = ["X", "Y", "Width", "Height"];
                            for (var i = 0; i < props.length; i++) {

                                var propIth = props[i];
                                strValue = self.functionDoProperty(objectCursor, propIth); // strValue comes back like "Type2~-373.987" -- we can now ignore the first part.

                                if (strValue) {

                                    parts = strValue.split('~');
                                    objectResult[propIth] = parts[1];
                                    break;
                                }                                
                            }
                        }

                        objectCursor = objectCursor.next

                    } while (objectCursor)
                }

                // Get the last tool instance
                if (objectResult) {

                    objectArray.push(objectResult);
                }
                return objectArray;
            }

            //
            self.functionDoProperty = function (objectCursor, strProp) {

                var re = new RegExp("_set" + strProp);
                if (objectCursor.type.match(re)) {

                    // Get the thing to set.
                    var objectToSet = objectCursor.children[0].children[0];
                    var strTypeToSet = objectToSet.type;
                    var re = new RegExp(g_clTypeApp.data.name + "_get(.+)");
                    var arrayTypes = strTypeToSet.match(re);
                    var strTheType = arrayTypes[1];

                    var objectValue = objectCursor.children[1].children[0].children[0];
                    return strTheType + '~' + objectValue.contents;            
                }

                return null;
            }

            // Method removes all possible "set property value" Blockly blocks from Blockly for a tool instance.
            self.remove_SetPropertyValues = function (strInstanceId, strAppTypeName) {

                try {

                    // Get workspace object.
                    var objectWorkspace = m_functionRemove_part1();

                    // Strip off extraneous stuff.
                    var blockWork = processor.getPrimaryBlockChain(objectWorkspace);

                    if (blockWork) {

                        var strMatch = strAppTypeName + "_get" + strInstanceId;

                        var nextArray = m_functionBreakApartBlockWork(blockWork);

                        // Remove matches from nextArray
                        for (var i = nextArray.length - 1; i >= 0; i--) {

                            var nextIth = nextArray[i];
                            if (nextIth.children[0].children[0].type &&
                                nextIth.children[0].children[0].type === strMatch) {

                                nextArray.splice(i, 1);
                            }
                        }

                        // Put it back in App Type's initialize method.
                        m_functionRemove_part3(nextArray, objectWorkspace);

                        return null;
                    }
                } catch (e) {

                    return e;
                }
            }

            // Method removes an "allocate type" Blockly block from Blockly.
            self.remove_AllocateType = function (strAppTypeName, strInstanceId) {

                try {

                    // Get workspace object.
                    var objectWorkspace = m_functionRemove_part1();

                    // Strip off extraneous stuff.
                    var blockWork = processor.getPrimaryBlockChain(objectWorkspace);

                    if (blockWork) {

                        var strMatch = strAppTypeName + "_set" + strInstanceId;

                        var nextArray = m_functionBreakApartBlockWork(blockWork);

                        // Remove matches from nextArray
                        for (var i = nextArray.length - 1; i >= 0; i--) {

                            var nextIth = nextArray[i];
                            if (nextIth.type === strMatch) {

                                nextArray.splice(i, 1);
                            }
                        }

                        // Put it back in App Type's initialize method.
                        m_functionRemove_part3(nextArray, objectWorkspace);

                        return null;
                    }
                } catch (e) {

                    return e;
                }
            }

            ///////////////////////////
            // Private methods.

            // Helper functions for the two removes above. 

            var m_functionBreakApartBlockWork = function(blockWork) {

                var retArray = [];

                do {

                    if (blockWork) {

                        retArray.push({
                            nodeName: blockWork.nodeName,
                            type: blockWork.type,
                            id: blockWork.id,
                            inline: blockWork.inline,
                            x: blockWork.x,
                            y: blockWork.y,
                            children: blockWork.children
                        });

                        if (blockWork.next) {

                            blockWork = blockWork.next;

                        } else {

                            break;
                        }
                    }

                } while (true)

                return retArray;
            }

            // Part1 get the workspace JSON object.
            // Part2 is done in the calling method.
            // Part3 converts the result to XML and stuffs it back in the App Type's initialize method workspace.
            var m_functionRemove_part1 = function () {

                var objectWorkspace = processor.getAppInitializeJSONObject();
                if (!objectWorkspace) {

                    throw { message: "Failed to get the workspace object." };
                }

                return objectWorkspace;
            }

            // TODO Needs updating now that we have C-block format.
            var m_functionRemove_part3 = function (nextArray, objectWorkspace) {

                try {

                    var blockWork = null;   // Will be used to reconstruct JS with remaining nexts.

                    // Put the JS object back together.
                    if (nextArray.length) {

                        for (var i = 0; i < nextArray.length; i++) {

                            var nextIth = nextArray[i];

                            if (i > 0) {

                                nextArray[i - 1].next = nextArray[i];

                            } else {

                                // Add directly to the XML object--this is the first block.
                                blockWork = nextArray[0];
                            }
                        }
                    }

                    // Convert back to XML.
                    var strXml = "";

                    if (blockWork) {

                        // blockWork is just the "real" nodes. We need to wrap in what will result in <xml xmlns="...">
                        var wrappedBlockWork = m_functionBuildNewJSONWorkspace(blockWork);

                        strXml = converter.toXML(wrappedBlockWork);
                        if (!strXml) {

                            throw new Error("Failed to convert workspace XML to JSON.");
                        }
                    }

                    // Next get the initialize method.
                    var methodInitialize = g_clTypeApp.getMethod("initialize");
                    if (!methodInitialize) {

                        throw { message: "Failed to find initialize method of App type." };
                    }

                    // Get the workspace.
                    methodInitialize.workspace = strXml;

                    // Set into Blockly.
                    // $("#BlocklyIFrame")[0].contentWindow.setWorkspaceString(strXml);
                    objectWorkspace = strXml;

                    return null;

                } catch (e) {

                    return e;
                }
            }

            // Return the next id as a string.
            var m_functionGetNextId = function () {

                return (m_iId++).toString();
            };

            // Add block to Blockly workspace.
            var m_functionAdd = function (blockNew) {

                try {

                    // .
                    var objectWorkspace = processor.getAppInitializeJSONObject();
                    if (!objectWorkspace) {

                        throw { message: "Failed to get the workspace object." };
                    }

                    // Get the block with which to work--the last block in the primaryBlockChain inside App initialize's c-block.
                    var blockWork = processor.getWorkBlock(objectWorkspace);

                    // If there is a work block, add new block it it, otherwise
                    if (blockWork) {

                        // Add the new block to the work block.
                        blockWork.next = blockNew;

                    } else {

                        // There was no blockWork. This can be due to these reasons:
                        // (1) There is no function c-block. It must have been deleted by the user.
                        // (2) There is a function c-block, but it's empty because nothing's been dropped on the designer or the user messed with it.
                        // In either case, we're just going to build the initialize method from scratch with blockNew.
                        objectWorkspace = m_functionBuildNewJSONWorkspace(blockNew);
                    }

                    // Replace objectWorkspace in workspaceJSONObject.

                    // Convert back to XML.
                    var strXml = converter.toXML(objectWorkspace);
                    if (!strXml) {

                        throw new Error("Failed to convert workspace XML to JSON.");
                    }

                    // Next get the initialize method.
                    var methodInitialize = g_clTypeApp.getMethod("initialize");
                    if (!methodInitialize) {

                        throw { message: "Failed to find initialize method of App type." };
                    }

                    // Set the workspace.
                    methodInitialize.workspace = strXml;

                    return null;

                } catch (e) {

                    return e;
                }
            };

            var m_functionBuildNewJSONWorkspace = function (blockNew) {

                return {
                        nodeName: "xml",
                        xmlns: "http://www.w3.org/1999/xhtml",
                        children:
                        [
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
                                        contents: "initialize",
                                        name: "NAME",
                                        nodeName: "field"
                                    },
                                    {
                                        nodeName: "statement",
                                        name: "STACK",
                                        children:
                                        [
                                            blockNew
                                        ]
                                    }
                                ],
                            }
                        ]
                    };
            }

            ////////////////////////
            // Private fields.

            // Starting id.
            var m_iId = 100;
        };

        // Return instance.
        return new functionRet();
    });
