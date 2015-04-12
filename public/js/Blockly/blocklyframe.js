////////////////////////////////////////
//
// NOTE: Anyone who uses blockframe.js also has to include blocklydefaultschema.js.
//       But blocklydefaultschema.js can be used by itself if blocklyframe.html isn't involved.
//
///////////////////////////////////////


var strDefaultMenu = BlocklyMenuRenderer(getDefaultSchema());

// Callback invoked when workspace is changed.
var functionChangeListener = null;

// Expose public (global) method.
// This method is callable from the parent frame.
// Run the code.
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
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var strCode = Blockly.JavaScript.workspaceToCode();
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

    return strCode;
};

// Expose public (global) method.
// This method is callable from the parent frame.
// Return a string representation of the structure.
function getWorkspaceString() {

    // Return workspace enviromet,
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    return Blockly.Xml.domToText(xml);
};

// Expose public (global) method.
// This method is callable from the parent frame.
// Builds the menu.
function setSchema(strSchema) {

    // First clear out the old.
    $(document.body).empty();

    if (strSchema &&
        strSchema !== "null") {

        // Turn schema string into schema object.
        var objectSchema = JSON.parse(strSchema);

        // Convert schema to menu.
        var strMenu = BlocklyMenuRenderer(objectSchema);

        // Inject menu xml.
        $(document.body).append(strMenu);
    } else {

        // Inject menu xml.
        $(document.body).append(strDefaultMenu);
    }

    // Set the new environment.
    Blockly.mainWorkspace.clear();

    // Process all blocks.
    Blockly.inject(document.body, {

          path: '../blockly/', 
          toolbox: document.getElementById('toolbox')
        });

    // Have to re-specify this change listener (probably 
    // becaue it is injected into the DOM as an attribute).
    Blockly.addChangeListener(function () {

      try {

        if (functionChangeListener) {

          functionChangeListener();
        }
      } catch (e) {

        alert("Error: " + e.message);
      }
    });
};

// Expose public (global) method.
// This method is callable from the parent frame.
// Sets the structure.
function setWorkspaceString(strData) {

    // Set the new environment.
    Blockly.mainWorkspace.clear();

    if (strData) {

      var xml = Blockly.Xml.textToDom(strData);
      Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, 
        xml);
    }
};

// Public method.
function setChangeListener(functionCallback) {

    functionChangeListener = functionCallback;
};

// Hook up Blockly.
function init() {

    $(document.body).append(strDefaultMenu);

    // Process all blocks.
    Blockly.inject(document.body, {

          path: '../blockly/', 
          toolbox: document.getElementById('toolbox')
        });
    Blockly.addChangeListener(function () {

      try {

        if (functionChangeListener) {

          functionChangeListener();
        }
      } catch (e) {

        alert("Error: " + e.message);
      }
    });

    // Define custom blocks.

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
    // Ship:

    // Ship Fire.
    Blockly.Blocks["ship_fire"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("fire");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(60);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
           this.setTooltip("Fire the specified ship's main cannon.");
        }
    };
    Blockly.JavaScript["ship_fire"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            "self.getItem(" + strTargetId + ").fire(); ";
        return strCode;
    };

    // Begin Rotate.
    Blockly.Blocks["ship_beginRotate"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("beginRotate");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(60);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
            this.setTooltip("Begin rotating the ship.");
        }
    };
    Blockly.JavaScript["ship_beginRotate"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            "self.getItem(" + strTargetId + ").beginRotate(); ";
        return strCode;
    };

    // End Rotate.
    Blockly.Blocks["ship_endRotate"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("endRotate");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(60);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
           this.setTooltip("End rotating the ship.");
        }
    };
    Blockly.JavaScript["ship_endRotate"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            "self.getItem(" + strTargetId + ").endRotate(); ";
        return strCode;
    };

    // Begin Thrust.
    Blockly.Blocks["ship_beginThrust"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("beginThrust");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(60);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
           this.setTooltip("Begin thrusting the ship.");
        }
    };
    Blockly.JavaScript["ship_beginThrust"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            "self.getItem(" + strTargetId + ").beginThrust(); ";
        return strCode;
    };

    // End Thrust.
    Blockly.Blocks["ship_endThrust"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("endThrust");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(60);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
           this.setTooltip("End thrusting the ship.");
        }
    };
    Blockly.JavaScript["ship_endThrust"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            "self.getItem(" + strTargetId + ").endThrust(); ";
        return strCode;
    };

    // Begin Counter Rotate.
    Blockly.Blocks["ship_beginCounterRotate"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("beginCounterRotate");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(60);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
           this.setTooltip("Begin Counter rotating the ship.");
        }
    };
    Blockly.JavaScript["ship_beginCounterRotate"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            "self.getItem(" + strTargetId + ").beginCounterRotate(); ";
        return strCode;
    };

    // End Counter Rotate.
    Blockly.Blocks["ship_endCounterRotate"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("endCounterRotate");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(60);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
           this.setTooltip("End Counter rotating the ship.");
        }
    };
    Blockly.JavaScript["ship_endCounterRotate"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            "self.getItem(" + strTargetId + ").endCounterRotate(); ";
        return strCode;
    };

    //////////////////////////////////////////////////////
    // Trackable Item:

    // Add object.
    Blockly.Blocks["trackableItem_add"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("add");
            this.appendValueInput("ID")
              .appendField("id");
            this.appendValueInput("URL")
              .appendField("url");
            this.appendValueInput("LEFT")
              .appendField("left");
            this.appendValueInput("TOP")
              .appendField("top");
            this.appendValueInput("WIDTH")
              .appendField("width");
            this.appendValueInput("HEIGHT")
              .appendField("height");
            this.appendValueInput("INIT")
              .appendField("init");
            this.setColour(30);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
           this.setTooltip("Allocate a new object.");
        }
    };
    Blockly.JavaScript["trackableItem_add"] = function(block) {
        
        // Search the text for a substring.
        var strId = Blockly.JavaScript.valueToCode(block, 'ID', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strUrl = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strLeft = Blockly.JavaScript.valueToCode(block, 'LEFT', Blockly.JavaScript.ORDER_ADDITION) || 0;
        var strTop = Blockly.JavaScript.valueToCode(block, 'TOP', Blockly.JavaScript.ORDER_ADDITION) || 0;
        var strWidth = Blockly.JavaScript.valueToCode(block, 'WIDTH', Blockly.JavaScript.ORDER_ADDITION) || 100;
        var strHeight = Blockly.JavaScript.valueToCode(block, 'HEIGHT', Blockly.JavaScript.ORDER_ADDITION) || 100;
        var strInit = Blockly.JavaScript.valueToCode(block, 'INIT', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            "self.allocateItem('TrackableItemBase', " + 
                strId + 
                ", " +
                strUrl + 
                ", self.options.width / 2 + (" + 
                strLeft + 
                "), self.options.height / 2 - (" +
                strTop +
                "), " + 
                strWidth + 
                ", " +
                strHeight +
                ", " +
                strInit +
                "); ";
        return strCode;
    };

    // Remove object.
    Blockly.Blocks["trackableItem_remove"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("remove");
            this.appendValueInput("ID")
              .appendField("id");
            this.setColour(30);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
           this.setTooltip("Remove existing object.");
        }
    };
    Blockly.JavaScript["trackableItem_remove"] = function(block) {
        
        // Search the text for a substring.
        var strId = Blockly.JavaScript.valueToCode(block, 'ID', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = "self.slateItemForRemoval(self.getItem(" + strId + ")); ";
        return strCode;
    };

    // Set image.
    Blockly.Blocks["trackableItem_setImage"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("setImage");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("URL")
              .appendField("url");
            this.setColour(30);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
           this.setTooltip("Set image url.");
        }
    };
    Blockly.JavaScript["trackableItem_setImage"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strUrl = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            "self.getItem(" + strTargetId + ").setUrl(" + strUrl + "); ";
        return strCode;
    };

    // Set onUpdate.
    Blockly.Blocks["trackableItem_setonUpdate"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("setonUpdate");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("CALLBACK")
              .appendField("callback");
            this.setColour(30);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
           this.setTooltip("Set onUpdate callback.");
        }
    };
    Blockly.JavaScript["trackableItem_setonUpdate"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strCallback = Blockly.JavaScript.valueToCode(block, 'CALLBACK', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            "self.getItem(" + strTargetId + ").onUpdate = " + strCallback + "; ";
        return strCode;
    };

    // Set onCollide.
    Blockly.Blocks["trackableItem_setonCollide"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("setonCollide");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("CALLBACK")
              .appendField("callback");
            this.setColour(30);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
           this.setTooltip("Set onCollide callback.");
        }
    };
    Blockly.JavaScript["trackableItem_setonCollide"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strCallback = Blockly.JavaScript.valueToCode(block, 'CALLBACK', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            "self.getItem(" + strTargetId + ").onCollide = " + strCallback + "; ";
        return strCode;
    };

    // Set onOutOfBounds.
    Blockly.Blocks["trackableItem_setonOutOfBounds"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("setonOutOfBounds");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("CALLBACK")
              .appendField("callback");
            this.setColour(30);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
           this.setTooltip("Set onOutOfBounds callback.");
        }
    };
    Blockly.JavaScript["trackableItem_setonOutOfBounds"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strCallback = Blockly.JavaScript.valueToCode(block, 'CALLBACK', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            "self.getItem(" + strTargetId + ").onOutOfBounds = " + strCallback + "; ";
        return strCode;
    };

    // Get image.
    Blockly.Blocks["trackableItem_getImage"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("getImage");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(30);
            this.setOutput(true);
            this.setInputsInline(true);
            this.setTooltip("Return image url of specified item.");
          }
    };
    Blockly.JavaScript["trackableItem_getImage"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            " self.getItem(" + strTargetId + ").getUrl() ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Exists.
    Blockly.Blocks["trackableItem_exists"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("exists");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(30);
            this.setOutput(true);
            this.setInputsInline(true);
           this.setTooltip("Determine if the specified target exists.");
        }
    };
    Blockly.JavaScript["trackableItem_exists"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            " self.getItem(" + strTargetId + ") !== null ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Get Velocity X.
    Blockly.Blocks["trackableItem_getVelocityX"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("getVelocityX");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(30);
            this.setOutput(true);
            this.setInputsInline(true);
            this.setTooltip("Extract x-component of velocity from specified object.");
          }
    };
    Blockly.JavaScript["trackableItem_getVelocityX"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            " self.getItem(" + strTargetId + ").getVelocityX() ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Get Velocity Y.
    Blockly.Blocks["trackableItem_getVelocityY"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("getVelocityY");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(30);
            this.setOutput(true);
            this.setInputsInline(true);
           this.setTooltip("Extract y-component of velocity from specified object.");
        }
    };
    Blockly.JavaScript["trackableItem_getVelocityY"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            " self.getItem(" + strTargetId + ").getVelocityY() ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Set Velocity.
    Blockly.Blocks["trackableItem_setVelocity"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("setVelocity");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("DX")
              .appendField("dX");
            this.appendValueInput("DY")
              .appendField("dY");
            this.setColour(30);
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip("Set the velocity of the specified target.");
        }
    };
    Blockly.JavaScript["trackableItem_setVelocity"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strDX = Blockly.JavaScript.valueToCode(block, 'DX', Blockly.JavaScript.ORDER_ADDITION) || '0';
        var strDY = Blockly.JavaScript.valueToCode(block, 'DY', Blockly.JavaScript.ORDER_ADDITION) || '0';

        var strCode = " self.getItem(" + strTargetId + ").setVelocity("+strDX+",-1*("+strDY+")); ";
        return strCode;
    };

    // Get presentation.
    Blockly.Blocks["trackableItem_getPresentation"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("getPresentation");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(30);
            this.setOutput(true);
            this.setInputsInline(true);
           this.setTooltip("Extract presentation from specified object.");
        }
    };
    Blockly.JavaScript["trackableItem_getPresentation"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            " self.getItem(" + strTargetId + ").presentation ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };
    
    // Set Presentation.
    Blockly.Blocks["trackableItem_setPresentation"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("setPresentation");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("VALUE")
              .appendField("Value");
            this.setColour(30);
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip("Set the presentation of the specified target.");
        }
    };
    Blockly.JavaScript["trackableItem_setPresentation"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strValue = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ADDITION) || 'normal';

        var strCode = " self.getItem(" + strTargetId + ").presentation = " + strValue + ";";
        return strCode;
    };

    // Set OOB.
    Blockly.Blocks["trackableItem_setOOB"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("setOOB");
            this.appendValueInput("TARGET")
              .appendField("target");
            var dropdown = new Blockly.FieldDropdown([['none', 'none'], ['wrap', 'wrap'], ['bounce', 'bounce']]);
            this.appendDummyInput()
              .appendField("value")
              .appendField(dropdown, "VALUE");
            this.setColour(30);
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip("Set the OOB of the specified target.");
        }
    };
    Blockly.JavaScript["trackableItem_setOOB"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strValue = block.getFieldValue("VALUE"); //Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ADDITION) || 'normal';

        var strCode = " self.getItem(" + strTargetId + ").oob = '" + strValue + "';";
        return strCode;
    };

    // Get left.
    Blockly.Blocks["trackableItem_getLeft"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("getLeft");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(30);
            this.setOutput(true);
            this.setInputsInline(true);
           this.setTooltip("Extract left from specified object.");
        }
    };
    Blockly.JavaScript["trackableItem_getLeft"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            " self.getItem(" + strTargetId + ").getLeft() ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Set Left.
    Blockly.Blocks["trackableItem_setLeft"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("setLeft");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("LEFT")
              .appendField("Left");
            this.setColour(30);
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip("Set the left of the specified target.");
        }
    };
    Blockly.JavaScript["trackableItem_setLeft"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strLeft = Blockly.JavaScript.valueToCode(block, 'LEFT', Blockly.JavaScript.ORDER_ADDITION) || '0';

        var strCode = " self.getItem(" + strTargetId + ").setLeft("+strLeft+");";
        return strCode;
    };

    // Get Top.
    Blockly.Blocks["trackableItem_getTop"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("getTop");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(30);
            this.setOutput(true);
            this.setInputsInline(true);
           this.setTooltip("Extract Top from specified object.");
        }
    };
    Blockly.JavaScript["trackableItem_getTop"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            " self.getItem(" + strTargetId + ").getTop() ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Set Top.
    Blockly.Blocks["trackableItem_setTop"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("setTop");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("TOP")
              .appendField("Top");
            this.setColour(30);
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip("Set the Top of the specified target.");
        }
    };
    Blockly.JavaScript["trackableItem_setTop"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strTop = Blockly.JavaScript.valueToCode(block, 'TOP', Blockly.JavaScript.ORDER_ADDITION) || '0';

        var strCode = " self.getItem(" + strTargetId + ").setTop("+strTop+");";
        return strCode;
    };

    // Get Mass.
    Blockly.Blocks["trackableItem_getMass"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("getMass");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(30);
            this.setOutput(true);
            this.setInputsInline(true);
           this.setTooltip("Extract mass from specified object.");
        }
    };
    Blockly.JavaScript["trackableItem_getMass"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            " self.getItem(" + strTargetId + ").getMass() ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Set Mass.
    Blockly.Blocks["trackableItem_setMass"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("setMass");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("MASS")
              .appendField("Mass");
            this.setColour(30);
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip("Set the mass of the specified target.");
        }
    };
    Blockly.JavaScript["trackableItem_setMass"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strMass = Blockly.JavaScript.valueToCode(block, 'MASS', Blockly.JavaScript.ORDER_ADDITION) || '0';

        var strCode = " self.getItem(" + strTargetId + ").setMassValue("+strMass+");";
        return strCode;
    };

    // Get Mass.
    Blockly.Blocks["trackableItem_getRadius"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("getRadius");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(30);
            this.setOutput(true);
            this.setInputsInline(true);
           this.setTooltip("Extract radius from specified object.");
        }
    };
    Blockly.JavaScript["trackableItem_getRadius"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            " self.getItem(" + strTargetId + ").getRadius() ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Set Mass.
    Blockly.Blocks["trackableItem_setRadius"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("setRadius");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("RADIUS")
              .appendField("Radius");
            this.setColour(30);
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip("Set the radius of the specified target.");
        }
    };
    Blockly.JavaScript["trackableItem_setRadius"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strRadius = Blockly.JavaScript.valueToCode(block, 'RADIUS', Blockly.JavaScript.ORDER_ADDITION) || '0';

        var strCode = " self.getItem(" + strTargetId + ").setRadiusValue("+strRadius+");";
        return strCode;
    };
    
    // Get Theta.
    Blockly.Blocks["trackableItem_getTheta"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("getTheta");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(30);
            this.setOutput(true);
            this.setInputsInline(true);
           this.setTooltip("Extract theta from specified object.");
        }
    };
    Blockly.JavaScript["trackableItem_getTheta"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            " self.getItem(" + strTargetId + ").getTheta() ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Set Theta.
    Blockly.Blocks["trackableItem_setTheta"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("setTheta");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("THETA")
              .appendField("Theta");
            this.setColour(30);
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip("Set the theta of the specified target.");
        }
    };
    Blockly.JavaScript["trackableItem_setTheta"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strTheta = Blockly.JavaScript.valueToCode(block, 'THETA', Blockly.JavaScript.ORDER_ADDITION) || '0';

        var strCode = " self.getItem(" + strTargetId + ").setThetaValue("+strTheta+");";
        return strCode;
    };

    // Get Height.
    Blockly.Blocks["trackableItem_getHeight"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("getHeight");
            this.appendValueInput("TARGET")
                .appendField("target");
            this.setColour(30);
            this.setOutput(true);
            this.setInputsInline(true);
           this.setTooltip("Extract height from specified object.");
        }
    };
    Blockly.JavaScript["trackableItem_getHeight"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            " self.getItem(" + strTargetId + ").getHeight() ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Set Height
    Blockly.Blocks["trackableItem_setHeight"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("setHeight");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("HEIGHT")
              .appendField("Height");
            this.setColour(30);
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip("Set the height of the specified target.");
        }
    };
    Blockly.JavaScript["trackableItem_setHeight"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strHeight = Blockly.JavaScript.valueToCode(block, 'HEIGHT', Blockly.JavaScript.ORDER_ADDITION) || '0';

        var strCode = " self.getItem(" + strTargetId + ").setHeightValue("+strHeight+");";
        return strCode;
    };

    // Get Width.
    Blockly.Blocks["trackableItem_getWidth"] = {

        init: function() {

            this.appendDummyInput()
                .appendField("getWidth");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.setColour(30);
            this.setOutput(true);
            this.setInputsInline(true);
           this.setTooltip("Extract width from specified object.");
        }
    };
    Blockly.JavaScript["trackableItem_getWidth"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";

        var strCode = 
            " self.getItem(" + strTargetId + ").getWidth() ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Set Width.
    Blockly.Blocks["trackableItem_setWidth"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("setWidth");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("WIDTH")
              .appendField("Width");
            this.setColour(30);
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip("Set the width of the specified target.");
        }
    };
    Blockly.JavaScript["trackableItem_setWidth"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strWidth = Blockly.JavaScript.valueToCode(block, 'WIDTH', Blockly.JavaScript.ORDER_ADDITION) || '0';

        var strCode = " self.getItem(" + strTargetId + ").setWidthValue("+strWidth+");";
        return strCode;
    };
    
    // Get Attribute Value.
    Blockly.Blocks["trackableItem_getAttributeValue"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("getAttributeValue");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("ATTRIBUTE")
              .appendField("Attribute");
            this.setInputsInline(true);
            this.setOutput(true, "String");
            this.setColour(20);
            this.setTooltip("Get the specified attribute's value from the specified source item.");
        }
    };
    Blockly.JavaScript["trackableItem_getAttributeValue"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strAttribute = Blockly.JavaScript.valueToCode(block, 'ATTRIBUTE', Blockly.JavaScript.ORDER_ADDITION) || '0';

        var strCode = " self.getItem("+strTargetId+")["+strAttribute+"] ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Set Score.
    Blockly.Blocks["trackableItem_setScore"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("setScore");
            this.appendValueInput("TARGET")
              .appendField("target");
            this.appendValueInput("SCORE")
              .appendField("Score");
            this.setColour(20);
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip("Set the score of the specified target.");
        }
    };
    Blockly.JavaScript["trackableItem_setScore"] = function(block) {
        
        // Search the text for a substring.
        var strTargetId = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ADDITION) || "";
        var strScore = Blockly.JavaScript.valueToCode(block, 'SCORE', Blockly.JavaScript.ORDER_ADDITION) || '0';

        var strCode = " self.getItem(" + strTargetId + ").score = "+strScore+";";
        return strCode;
    };

    ///////////////////////////////////////////////////////////
    // System:

    // Get Global.
    Blockly.Blocks["system_getGlobal"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("getGlobal");
            this.appendValueInput("KEY")
              .appendField("Key");
            this.setColour(160);
            this.setOutput(true);
            this.setInputsInline(true);
            this.setTooltip("Get an ort of global data.");
        }
    };
    Blockly.JavaScript["system_getGlobal"] = function(block) {
        
        // Search the text for a substring.
        var strKey = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ADDITION) || '';

        var strCode = " self.globals[" + strKey + "] ";
        return [strCode, Blockly.JavaScript.ORDER_MEMBER];
    };

    // Set Global.
    Blockly.Blocks["system_setGlobal"] = {

        init: function() {

            this.appendDummyInput()
              .appendField("setGlobal");
            this.appendValueInput("KEY")
              .appendField("Key");
            this.appendValueInput("VALUE")
              .appendField("Value");
            this.setColour(160);
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip("Set an ort of global data.");
        }
    };
    Blockly.JavaScript["system_setGlobal"] = function(block) {
        
        var strKey = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ADDITION) || '';
        var strValue = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ADDITION) || '';

        var strCode = " self.globals[" + strKey + "]=" + strValue + "; ";
        return strCode;
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
}

$(document).ready(function () { 

    setTimeout(init, 
        200); 
});
