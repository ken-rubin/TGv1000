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

                var objectWorkspace = processor.getWorkspaceJSONObject();
                if (!objectWorkspace) {

                    throw { messgage: "Failed to get the workspace object." };
                }

                // Get the block with which to work.
                var blockWork = processor.getPrimaryBlockChain(objectWorkspace);

                // Compose, "MyType_setX", for which to search.
                var strBlockType = strType + "_set" + strProperty;

                // Compose the get for the instance from the app for which to search.
                var strInstanceType = "App_get" + strInstance;

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
                        type: "App_set" + strId,
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
                                        type: "App_get" + strInstance,
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
                    var objectWorkspace = processor.getWorkspaceJSONObject();
                    if (!objectWorkspace) {

                        throw { messgage: "Failed to get the workspace object." };
                    }

                    // Get the block with which to work.
                    var blockWork = processor.getPrimaryBlockChain(objectWorkspace);

                    // Compose, "MyType_setX", for which to search.
                    var strBlockType = strType + "_set" + strProperty;

                    // Compose the get for the instance from the app for which to search.
                    var strInstanceType = "App_get" + strInstance;

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

                    // Set the workspace.
                    methodInitialize.workspace = strXml;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method removes a "set property value" Blockly block from Blockly.
            self.remove_SetPropertyValue = function (strTypeName, strProperty, strInstanceId, strAppTypeName) {

                try {

                    // Get workspace object.
                    var objectWorkspace = m_functionRemove_part1();

                    // Get the block with which to work.
                    var blockWork = processor.getPrimaryBlockChain(objectWorkspace);

                    if (blockWork) {

                        var strMatchType1 = strTypeName + "_set" + strProperty;
                        var strMatchType2 = strAppTypeName + "_get" + strInstanceId;

                        // Do the recursive looking/processing to handle this type of remove.
                        do {

                            if (next.type === strMatchType1 && next.children[0].children[0].type === strMatchType2) {

                                // if (next.next) {


                                // }
                            } else {

                                blockWork = blockWork.next;
                            }

                        } while (blockWork)

                    }

                    // Put it back in App Type's initialize method.
                    m_functionRemove_part3(objectWorkspace);

                } catch (e) {

                    return e;
                }
            }

            // Method removes an "allocate type" Blockly block from Blockly.
            // Since the user could have done something hinky, it repeats until done, even after a success.
            self.remove_AllocateType = function (strTypeName, strInstanceId) {

                try {

                    // Get workspace object.
                    var objectWorkspace = m_functionRemove_part1(); // objectWorkspace has been wrapped in artificial "next" -- like {"next": objectWorkspace}

                    // Get the block with which to work.
                    var blockWork = processor.getPrimaryBlockChain(objectWorkspace);

                    if (blockWork) {

                        var strMatchType = strTypeName + "_set" + strInstanceId;

                        // Do the recursive looking/processing to handle this type of remove.
                        do {

                            if (next.type === strMatchType) {

                                // if (next.next) {


                                // }
                            } else {

                                blockWork = blockWork.next;
                            }

                        } while (blockWork)

                    }

                    // Put it back in App Type's initialize method.
                    m_functionRemove_part3(objectWorkspace);

                } catch (e) {

                    return e;
                }
            }


// var str = JSON.stringify(blockWork, null, 4);
// var l = str.length;
// var s = 0;
// while (s < l) {
//     var str1 = str.substring(s, Math.min(s+3000,l));
//     s += 3000;
// }



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
                        var arrayMatches = objectCursor.type.match(/App_set(.+)/);
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
                                strValue = m_functionDoProperty(objectCursor, propIth); // strValue comes back like "Type2~-373.987" -- we can now ignore the first part.

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

            self.blocklyChangeListener = function (objectPrimaryBlockChain) {

                // Clear designer.
                var objectResult = {};
                var strValue = null;
                var parts = [];

                // Scan.
                var objectCursor = objectPrimaryBlockChain;
                if (objectCursor) {

                    do {

                        //  Look for "new_" and "set_".
                        //  Set in designer.
                        var arrayMatches = objectCursor.type.match(/App_set(.+)/);
                        
                        if (arrayMatches && arrayMatches.length > 1) {

                            objectResult[arrayMatches[1]] = {};

                        } else {

                            var props = ["X", "Y", "Width", "Height"];
                            for (var i = 0; i < props.length; i++) {

                                var propIth = props[i];
                                strValue = m_functionDoProperty(objectCursor, propIth);

                                if (strValue) {

                                    parts = strValue.split('~');
                                    objectResult[parts[0]][propIth] = parts[1];
                                    break;
                                }                                
                            }
                        }

                        objectCursor = objectCursor.next

                    } while (objectCursor)
                }

                return objectResult;
            }

            ///////////////////////////
            // Private methods.

            // Helper functions for the two removes above. 

            // Part1 get the workspace JSON object.
            // Part2 is done in the calling method.
            // Part3 converts the result to XML and stuffs it back in the App Type's initialize method workspace.
            var m_functionRemove_part1 = function () {

                var objectWorkspace = processor.getWorkspaceJSONObject();
                if (!objectWorkspace) {

                    throw { messgage: "Failed to get the workspace object." };
                }

                // A fudge for consistency in recursion.
                return 
                    {
                        next : objectWorkspace
                    };
            }

            var m_functionRemove_part3 = function (objectWorkspace) {

                try {

                    // Convert back to XML.
                    var strXml = "";

                    if (objectWorkspace) {

                        strXml = converter.toXML(objectWorkspace.next);
                        if (!strXml) {

                            throw new Error("Failed to convert workspace XML to JSON.");
                        }
                    }

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
                    methodInitialize.workspace = strXml;

                    return null;

                } catch (e) {

                    return e;
                }
            }

            //
            var m_functionDoProperty = function (objectCursor, strProp) {

                var re = new RegExp("_set" + strProp);
                if (objectCursor.type.match(re)) {

                    // Get the thing to set.
                    var objectToSet = objectCursor.children[0].children[0];
                    var strTypeToSet = objectToSet.type;
                    var arrayTypes = strTypeToSet.match(/App_get(.+)/);
                    var strTheType = arrayTypes[1];

                    var objectValue = objectCursor.children[1].children[0].children[0];
                    return strTheType + '~' + objectValue.contents;            
                }

                return null;
            }

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
