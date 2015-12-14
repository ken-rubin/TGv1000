////////////////////////////////////////
//
// NOTE: Anyone who uses blockframe.js also has to include blocklydefaultschema.js.
//       But blocklydefaultschema.js can be used by itself if blocklyframe.html isn't involved.
//
///////////////////////////////////////

// The schema defines the user-available methods.
var Schema = null;
// The Xml string that specifies all the Blockly blocks.
var Workspace = "";

// Expose public (global) method.
// This method is callable from the parent frame.
// Run the code--test function.
function run() {

    var strCode = getMethodString();
    try {

        eval(strCode);
    } catch (e) {

        alert(e);
    }
};

// Expose public (global) method.
// This method is callable from the parent frame.
// Return a string representation of the code.
function getMethodString() {

    // Generate JavaScript code and run it.
//    window.LoopTrap = 1000;
//    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var strCode = Blockly.JavaScript.workspaceToCode();
//    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

    return strCode;
};

// Expose public (global) method.
// This method is callable from the parent frame.
// Return a string representation of the structure.
function getWorkspaceString() {

    // Return workspace enviromet,
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    Workspace = Blockly.Xml.domToText(xml);
    return Workspace;
};

// Expose public (global) method.
// This method is callable from the parent frame.
// Return the current schema.
function getSchema() {

    return Schema;
};

// Expose public (global) method.
// This method is callable from the parent frame.
// Builds the menu and loads the workspace.
function Create() {

    try {

        // Clean the Blockly environment.
        if (Blockly.mainWorkspace) {

            Blockly.mainWorkspace.clear();
        }

        // Clear the DOM.
        $(document.body).empty();

        // Convert schema to menu.
        var strMenu = BlocklyMenuRenderer(Schema);

        // Inject menu xml.
        $(document.body).append(strMenu);

        // Process all blocks.
        Blockly.inject(document.body, {

              path: "../blockly/", 
              toolbox: document.getElementById("toolbox")
            });

        // Set the workspace if something to set.
        if (Workspace) {

            setWorkspaceString(Workspace);
        }

        // Have to re-specify this change listener (probably 
        // becaue it is injected into the DOM as an attribute).
        Blockly.mainWorkspace.addChangeListener(function () {

          try {

            // Call, if the listener is set.
            if ($.isFunction(parent.functionBlockChangeListener)) {

                var exceptionRet = parent.functionBlockChangeListener();
                if (exceptionRet) {

                    throw exceptionRet;
                }
            }
          } catch (e) {

            alert("Error: " + e.message);
          }
        });
    } catch (e) {

        alert(e.message);
    }
};

// Expose public (global) method.
// This method is callable from the parent frame.
// Sets the structure.
function setWorkspaceString(strData) {

    // Save off.
    Workspace = strData;

    // Set in environment.
    if (Blockly.mainWorkspace) {

        Blockly.mainWorkspace.clear();

        if (strData) {

          var xml = Blockly.Xml.textToDom(strData);
          Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, 
            xml);
        }
    }
};

/* Get callback invoked when blockly structure changes.
function getChangeListener() {

    return functionChangeListener;
};

// Set callback invoked when blockly structure changes.
function setChangeListener(functionCallback) {

    functionChangeListener = functionCallback;
};*/

// Hook up Blockly.
function DefineDefaultBlocks() {

    try {

        ////////////////////////
        ////////////////////////
        ////////////////////////
        // Define custom blocks.  Default Blockly blocks are defined in blocks_compressed.js.
        // Subsequent blocks are custom built as types are loaded, modified and deleted, etc....

        ///////////////////////////////////////////////////////////////
        // Event:

        // WhoAmI.
        Blockly.Blocks["event_whoAmI"] = {

            init: function() {

                this.appendDummyInput()
                    .appendField("whoAmI");
                this.setColour(10);
                this.setOutput(true);
                this.setInputsInline(true);
               this.setTooltip("Return id of event source.");
            }
        };
        Blockly.JavaScript["event_whoAmI"] = function(block) {
            
            var strCode = "(self.whoAmI === null ? null : self.whoAmI.id ) ";
            return [strCode, Blockly.JavaScript.ORDER_MEMBER];
        };

        // CollideTarget.
        Blockly.Blocks["event_collideTarget"] = {

            init: function() {

                this.appendDummyInput()
                    .appendField("collideTarget");
                this.setColour(10);
                this.setOutput(true);
                this.setInputsInline(true);
               this.setTooltip("Return id of the target of the collision.");
            }
        };
        Blockly.JavaScript["event_collideTarget"] = function(block) {
            
            var strCode = "(self.collideTarget === null ? null : self.collideTarget.id ) ";
            return [strCode, Blockly.JavaScript.ORDER_MEMBER];
        };

        ///////////////////////////////////////////////////////////////
        // Draw:

        // SetFillStyle.
        Blockly.Blocks["draw_SetFillStyle"] = {

            init: function() {

                this.appendDummyInput()
                    .appendField("Set Fill Style");
                this.appendValueInput("Using")
                  .appendField("Using");
                this.appendValueInput("Value")
                  .appendField("Value");
                this.setColour(10);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setInputsInline(true);
               this.setTooltip("Set the specified context's FillStyle.");
            }
        };
        Blockly.JavaScript["draw_SetFillStyle"] = function(block) {
            
            var strUsing = Blockly.JavaScript.valueToCode(block, 'Using', Blockly.JavaScript.ORDER_ADDITION) || '';
            var strValue = Blockly.JavaScript.valueToCode(block, 'Value', Blockly.JavaScript.ORDER_ADDITION) || '';

            var strCode = " " + strUsing + " .fillStyle = " + strValue + " ";
            return strCode;
        };

        // FillRect.
        Blockly.Blocks["draw_FillRect"] = {

            init: function() {

                this.appendDummyInput()
                  .appendField("Fill Rect");
                this.appendValueInput("Using")
                  .appendField("Using");
                this.appendValueInput("X")
                  .appendField("X");
                this.appendValueInput("Y")
                  .appendField("Y");
                this.appendValueInput("Width")
                  .appendField("Width");
                this.appendValueInput("Height")
                  .appendField("Height");
                this.setColour(160);
                this.setInputsInline(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setTooltip("Fill the specified rectangle.");
            }
        };
        Blockly.JavaScript["draw_FillRect"] = function(block) {
            
            var strUsing = Blockly.JavaScript.valueToCode(block, 'Using', Blockly.JavaScript.ORDER_ADDITION) || '';
            var strX = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ADDITION) || '';
            var strY = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ADDITION) || '';
            var strWidth = Blockly.JavaScript.valueToCode(block, 'Width', Blockly.JavaScript.ORDER_ADDITION) || '';
            var strHeight = Blockly.JavaScript.valueToCode(block, 'Height', Blockly.JavaScript.ORDER_ADDITION) || '';

            var strCode = " " + strUsing + ".fillRect(" + strX + "," + strY + "," + strWidth + "," + strHeight + "); ";
            return strCode;
        };

        ///////////////////////////////////////////////////////////
        // System:

        // ClearRect.
        Blockly.Blocks["system_ClearRect"] = {

            init: function() {

                this.appendDummyInput()
                  .appendField("clearRect");
                this.appendValueInput("Using")
                  .appendField("Using");
                this.setColour(160);
                this.setInputsInline(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setTooltip("Clear the specified rect.");
            }
        };
        Blockly.JavaScript["system_ClearRect"] = function(block) {
            
            var strUsing = Blockly.JavaScript.valueToCode(block, 'Using', Blockly.JavaScript.ORDER_ADDITION) || '';

            var strCode = " " + strUsing + ".clearRect(0,0,"+strUsing+".canvas.clientWidth,"+strUsing+".canvas.clientHeight); ";
            return strCode;
        };

        // DesignerCanvasContext.
        Blockly.Blocks["system_DesignerCanvasContext"] = {

            init: function() {

                this.appendDummyInput()
                    .appendField("Designer Canvas Context");
                this.setColour(10);
                this.setOutput(true);
                this.setInputsInline(true);
               this.setTooltip("Return designer canvas context.");
            }
        };
        Blockly.JavaScript["system_DesignerCanvasContext"] = function(block) {
            
            var strCode = " (designer.canvasContext) ";
            return [strCode, Blockly.JavaScript.ORDER_MEMBER];
        };

        // Invoke Method.
        Blockly.Blocks["system_invokeMethod"] = {

            init: function() {

                this.appendDummyInput()
                  .appendField("invokeMethod");
                this.appendValueInput("NAME")
                  .appendField("Name");
                this.setColour(160);
                this.setInputsInline(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setTooltip("Invoke a named blockly method.");
            }
        };
        Blockly.JavaScript["system_invokeMethod"] = function(block) {
            
            var strName = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ADDITION) || '';

            var strCode = " self.execute(" + strName + "); ";
            return strCode;
        };

        // Play sound.
        Blockly.Blocks["system_playSound"] = {

            init: function() {

                this.appendDummyInput()
                  .appendField("playSound");
                this.appendValueInput("URL")
                  .appendField("Url");
                this.setColour(160);
                this.setInputsInline(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setTooltip("Invoke a named blockly method.");
            }
        };
        Blockly.JavaScript["system_playSound"] = function(block) {
            
            var strUrl = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ADDITION) || '';

            var strCode = " self.playSound(" + strUrl + "); ";
            return strCode;
        };

        // Set background url.
        Blockly.Blocks["system_setBackgroundUrl"] = {

            init: function() {

                this.appendDummyInput()
                  .appendField("setBackgroundUrl");
                this.appendValueInput("URL")
                  .appendField("Url");
                this.setColour(160);
                this.setInputsInline(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setTooltip("Set background image url.");
            }
        };
        Blockly.JavaScript["system_setBackgroundUrl"] = function(block) {
            
            var strUrl = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ADDITION) || '';

            var strCode = " self.setBackgroundUrl(" + strUrl + "); ";
            return strCode;
        };

        // Set background drift.
        Blockly.Blocks["system_setBackgroundDrift"] = {

            init: function() {

                this.appendDummyInput()
                  .appendField("setBackgroundDrift");
                this.appendValueInput("DRIFT")
                  .appendField("Drift");
                this.setColour(160);
                this.setInputsInline(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setTooltip("Set background image drift.");
            }
        };
        Blockly.JavaScript["system_setBackgroundDrift"] = function(block) {
            
            var strDrift = Blockly.JavaScript.valueToCode(block, 'Drift', Blockly.JavaScript.ORDER_ADDITION) || '';

            var strCode = " self.setBackgroundDrift(" + strDrift + "); ";
            return strCode;
        };

        ///////////////////////////////////////////////////////////
        // Window:

        // Set Timeout.
        Blockly.Blocks["window_setTimeout"] = {

            init: function() {

                this.appendDummyInput()
                  .appendField("setTimeout");
                this.appendValueInput("DELAY")
                  .appendField("Delay");
                this.appendStatementInput('DO')
                  .appendField('do');
                this.setColour(160);
                this.setInputsInline(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setTooltip("Set a timeout.");
            }
        };
        Blockly.JavaScript["window_setTimeout"] = function(block) {
            
            // Search the text for a substring.
            var strDelay = Blockly.JavaScript.valueToCode(block, 'DELAY', Blockly.JavaScript.ORDER_ADDITION) || '0';

            var strGuts = Blockly.JavaScript.statementToCode(block, 'DO');

            var strCode = "var timerCookie = setTimeout(function() { self.removeTimerCookie(timerCookie); " + strGuts + " }, " + strDelay + "); self.timerCookies.push(timerCookie); ";
            return strCode;
        };

        ///////////////////////////////////////////////////////////
        // Text:

        // ToString.
        Blockly.Blocks["text_toString"] = {

            init: function() {

                this.appendDummyInput()
                  .appendField("toString");
                this.appendValueInput("TARGET")
                  .appendField("");
                this.setColour(140);
                this.setOutput(true);
                this.setInputsInline(true);
                this.setTooltip("Stringifys the target value.");
            }
        };
        Blockly.JavaScript["text_toString"] = function(block) {
            
            // Search the text for a substring.
            var strTarget = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || '0';
            var strCode = " ("+strTarget+").toString() ";
            return [strCode, Blockly.JavaScript.ORDER_MEMBER];
        };
        return null;
    } catch (e) {

        return e;
    }
};

// Raise the ready callback.
$(document).ready(function () { 

    try {

        // First, load up the blocks and JavaScript 
        // methods for the default functionality.
        var exceptionRet = DefineDefaultBlocks();
        if (exceptionRet) {

            throw exceptionRet;
        }

        // Default workspace string is empty.
        Workspace = "";
        // Default schema object contains just the core.
        Schema = getDefaultSchema();

        // Get the code object, if set.
        var code = parent.functionBlocklyFrameLoaded();
        if (code) {

            try {

                if (code.displaySchemaCategories) {

                    // Add into the schema, workspace, blocks and javascript.
                    Schema.Types = code.schema.Types;
                    for (var strKey in code.blocks) {

                        Blockly.Blocks[strKey] = { init: new Function(code.blocks[strKey]) };
                    }
                    for (var strKey in code.javaScript) {

                        Blockly.JavaScript[strKey] = new Function("block", code.javaScript[strKey]);
                    }
                    Workspace = code.workspace;

                    // Create the blockly instance.
                    exceptionRet = Create();
                    if (exceptionRet) {

                        throw exceptionRet;
                    }
                }
            } 
            finally {

                code.displaySchemaCategories = true;
            }
        }
    } catch (e) {

        alert(e.message);
    }
});

