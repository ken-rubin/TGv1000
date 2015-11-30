//////////////////////////////////////////////////////
//
// This file contains 3 versions of blockly schema data and methods.
// They are all here so that they can all be updated in one place if anything changes (really, is added).
// One inconsistency is that if an item is added, it also has to be implemented in blocklyframe.js. But by separating them,
// we don't need the huge blocklyframe.js in adminzone.
//
//////////////////////////////////////////////////////

// Function returns a schema from an array of names.
function getSchemaFromArrayOfNames(nameArray) {

    var System = {};
    var Event = {};
    var Controls = {};
    var ControlsIf = {};
    var ControlsLoops = {};
    var Logic = {};
    var sMath = {};
    var Lists = {};
    var Text = {};
    var Variables = false;
    var Functions = false;

    for (var i = 0; i < nameArray.length; i++) {

        var nameIth = nameArray[i];
        var parts = nameIth.split('_');
        if (parts.length === 1) {

            if (parts[0] === "text")
                Text["Text"] = true;

        } else if (parts.length === 2) {
    
            parts[1] = parts[1][0].toUpperCase() + parts[1].slice(1);
            switch(parts[0]) {

                case "system":
                    System[parts[1]] = true;
                    break;
                case "event":
                    Event[parts[1]] = true;
                    break;
                case "controls":
                    if (parts[1] === "whileUntil")
                        ControlsLoops["While"] = true;
                    else
                        ControlsIf[parts[1]] = true;
                    break;
                case "logic":
                    Logic[parts[1]] = true;
                    break;
                case "math":
                    sMath[parts[1]] = true;
                    break;
                case "lists":
                    Lists[parts[1]] = true;
                    break;
                case "text":
                    Text[parts[1]] = true;
                    break;
                case "variables":
                    Variables = true;
                    break;
                case "procedures":
                    Functions = true;
                    break;
            }
        } else if (parts.length === 3) {

            if (parts[1] === "create") {

                if (parts[2] === "empty")
                    Lists["CreateEmpty"] = true;
                else if (parts[2] === "with")
                    Lists["CreateWith"] = true;

            } else if (parts[0] === "controls") {

                if (parts[1] === "repeat" && parts[2] === "ext")
                    ControlsLoops["Repeat"] = true;
                else if (parts[1] === "flow")
                    ControlsLoops["Flow"] = true;
            }
        }
    }

    var sc = {};
    if (!$.isEmptyObject(System))
        Controls['System'] = System;
    if (!$.isEmptyObject(Event))
        sc['Event'] = Event;
    if (!$.isEmptyObject(ControlsIf))
        Controls['If'] = ControlsIf;
    if (!$.isEmptyObject(ControlsLoops))
        Controls['Loops'] = ControlsLoops;
    if (!$.isEmptyObject(Controls))
        sc['Controls'] = Controls;
    if (!$.isEmptyObject(Logic))
        sc['Logic'] = Logic;
    if (!$.isEmptyObject(sMath))
        sc['Math'] = sMath;
    if (!$.isEmptyObject(Lists))
        sc['Lists'] = Lists;
    if (!$.isEmptyObject(Text))
        sc['Text'] = Text;
    if (Variables)
        sc['Variables'] = true;
    if (Functions)
        sc['Functions'] = true;

    return sc;
}

// Define function which build up the
// DOM XML string which defines the menu.
BlocklyMenuRenderer = function (include) {

    var strRet = '<xml id="toolbox" style="display: none">';

    if (include.System) {

        strRet += '<category name="System">';

        if (include.System.DesignerCanvasContext) {

            strRet += '<block type="system_DesignerCanvasContext"></block>';
        }
        if (include.System.ClearRect) {

            strRet += '<block type="system_ClearRect"></block>';
        }
        
        strRet += '</category>';
    }

    if (include.Event) {

        strRet += '<category name="Event">';

        if (include.Event.WhoAmI) 
            strRet += '<block type="event_whoAmI"></block>';
        if (include.Event.CollideTarget) 
            strRet += '<block type="event_collideTarget"></block>';

        strRet += '</category>';
    }

    if (include.Controls) {

        strRet += '<category name="Control">';

        if (include.Controls.If) {

            strRet += '<category name="If">';

            if (include.Controls.If.If) 
                strRet += '<block type="controls_if"></block>';
            if (include.Controls.If.IfElse) 
                strRet += '<block type="controls_if"><mutation else="1"></mutation></block>';

            strRet += '</category>';
        }

        if (include.Controls.Loops) {

            strRet += '<category name="Loops">';

            if (include.Controls.Loops.Repeat) 
                strRet += '<block type="controls_repeat_ext"><value name="TIMES"><block type="math_number"><field name="NUM">10</field></block></value></block>';
            if (include.Controls.Loops.While)
                strRet += '<block type="controls_whileUntil"></block>';
            if (include.Controls.Loops.For)
                strRet += '<block type="controls_for"><field name="VAR">i</field><value name="FROM"><block type="math_number"><field name="NUM">1</field></block></value><value name="TO"><block type="math_number"><field name="NUM">10</field></block></value><value name="BY"><block type="math_number"><field name="NUM">1</field></block></value></block>';
            if (include.Controls.Loops.ForEach)
                strRet += '<block type="controls_forEach"></block>';
            if (include.Controls.Loops.Flow)
                strRet += '<block type="controls_flow_statements"></block>';

            strRet += '</category>';

        }

        strRet += '</category>';
    }

    if (include.Logic) {

        strRet += '<category name="Logic">';

        if (include.Logic.Compare) 
            strRet += '<block type="logic_compare"></block>';
        if (include.Logic.Operation) 
            strRet += '<block type="logic_operation"></block>';
        if (include.Logic.Negate) 
            strRet += '<block type="logic_negate"></block>';
        if (include.Logic.Boolean) 
            strRet += '<block type="logic_boolean"></block>';
        if (include.Logic.Null) 
            strRet += '<block type="logic_null"></block>';
        if (include.Logic.Ternary) 
            strRet += '<block type="logic_ternary"></block>';

        strRet += '</category>';
    }

    if (include.Math) {

        strRet += '<category name="Math">';

        if (include.Math.Number)
            strRet += '<block type="math_number"></block>';
        if (include.Math.Arithmetic)
            strRet += '<block type="math_arithmetic"></block>';
        if (include.Math.Single)
            strRet += '<block type="math_single"></block>';
        if (include.Math.Trig)
            strRet += '<block type="math_trig"></block>';
        if (include.Math.Constant)
            strRet += '<block type="math_constant"></block>';
        if (include.Math.NumberProperty)
            strRet += '<block type="math_number_property"></block>';
        if (include.Math.Change)
            strRet += '<block type="math_change"><value name="DELTA"><block type="math_number"><field name="NUM">1</field></block></value></block>';
        if (include.Math.Round)
            strRet += '<block type="math_round"></block>';
        if (include.Math.Random)
            strRet += '<block type="math_random_int"></block>';

        strRet += '</category>';
    }

    if (include.Lists) {

        strRet += '<category name="Lists">';

        if (include.Lists.CreateEmpty)
            strRet += '<block type="lists_create_empty"></block>';
        if (include.Lists.CreateWith)
            strRet += '<block type="lists_create_with"></block>';
        if (include.Lists.Repeat)
            strRet += '<block type="lists_repeat"><value name="NUM"><block type="math_number"><field name="NUM">5</field></block></value></block>';
        if (include.Lists.Length)
            strRet += '<block type="lists_length"></block>';
        if (include.Lists.IsEmpty)
            strRet += '<block type="lists_isEmpty"></block>';
        if (include.Lists.IndexOf)
            strRet += '<block type="lists_indexOf"></block>';
        if (include.Lists.GetIndex)
            strRet += '<block type="lists_getIndex"></block>';
        if (include.Lists.SetIndex)
            strRet += '<block type="lists_setIndex"></block>';

        strRet += '</category>';
    }

    if (include.Text) {

        strRet += '<category name="Text">';

        if (include.Text.Text)
            strRet += '<block type="text"></block>';
        if (include.Text.Append)
            strRet += '<block type="text_append"></block>';
        if (include.Text.Length)
            strRet += '<block type="text_length"></block>';
        if (include.Text.IsEmpty)
            strRet += '<block type="text_isEmpty"></block>';
        if (include.Text.IndexOf)
            strRet += '<block type="text_indexOf"></block>';
        if (include.Text.CharAt)
            strRet += '<block type="text_charAt"></block>';
        if (include.Text.GetSubstring)
            strRet += '<block type="text_getSubstring"></block>';
        if (include.Text.ChangeCase)
            strRet += '<block type="text_changeCase"></block>';
        if (include.Text.Trim)
            strRet += '<block type="text_trim"></block>';
        if (include.Text.Print)
            strRet += '<block type="text_print"></block>';
        if (include.Text.Prompt)
            strRet += '<block type="text_prompt"></block>';
        if (include.Text.ToString)
            strRet += '<block type="text_toString"></block>';

        strRet += '</category>';
    }

    if (include.Variables) {

        strRet += '<category name="Variables" custom="VARIABLE"></category>';
    }

    if (include.Functions) {

        strRet += '<category name="Functions" custom="PROCEDURE"></category>';
    }

    // Include all system and user defined types in their own nodes.
    if (include.Types) {

        // Loop over each type.
        for (var key in include.Types) {

            strRet += '<category name="' + key + '">';

            var objectType = include.Types[key];

            // Loop over each member.
            for (var keyInner in objectType) {

                strRet += '<block type="' + keyInner + '"></block>';
            }

            strRet += '</category>';
        }
    }

    strRet += "</xml>";

    return strRet;
};

// Generate schema from JSON structure.
var defaultSchema = {

    System: {

        DesignerCanvasContext: true,
    },
    Event: {

        WhoAmI: true,
        CollideTarget: true
    },
    Controls: {

        If: {

            If: true,
            IfElse: true

        },
        Loops: {

            Repeat: true,
            While: true,
            For: true,
            ForEach: true,
            Flow: true
        },
    },
    Logic: {

        Compare: true,
        Operation: true,
        Negate: true,
        Boolean: true,
        Null: true,
        Ternary: true
    },
    Math: {

        Number: true,
        Arithmetic: true,
        Single: true,
        Trig: true,
        Constant: true,
        NumberProperty: true,
        Change: true,
        Round: true,
        Random: true
    },
    Lists: {

        CreateEmpty: true,
        CreateWith: true,
        Repeat: true,
        Length: true,
        IsEmpty: true,
        IndexOf: true,
        GetIndex: true,
        SetIndex: true
    },
    Text: {

        Text: true,
        Append: true,
        Length: true,
        IsEmpty: true,
        IndexOf: true,
        CharAt: true,
        GetSubstring: true,
        ChangeCase: true,
        Trim: true,
        Print: true,
        Prompt: true,
        ToString: true
    },
    Variables: true,
    Functions: true
};

// Allow projects.jade and blocklyframe.js to retrieve the full strDefaultSchema.
function getDefaultSchema() {

    return JSON.parse(JSON.stringify(defaultSchema));   // Done this way to return a copy of defaultSchema.
}

