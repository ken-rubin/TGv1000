//////////////////////////////////////////////////////
//
// This file contains 3 versions of blockly schema data and methods.
// They are all here so that they can all be updated in one place if anything changes (really, is added).
// One inconsistency is that if an item is added, it also has to be implemented in blocklyframe.js. But by separating them,
// we don't need the huge blocklyframe.js in adminzone.
//
//////////////////////////////////////////////////////


function getSchemaFromArrayOfNames(nameArray) {

    var Global = {};
    var sObject = {};
    var Ship = {};
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
                    Global[parts[1]] = true;
                    break;
                case "trackableItem":
                    sObject[parts[1]] = true;
                    break;
                case "ship":
                    Ship[parts[1]] = true;
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
    if (!$.isEmptyObject(Global))
        sc['Global'] = Global;
    if (!$.isEmptyObject(sObject))
        sc['Object'] = sObject;
    if (!$.isEmptyObject(Ship))
        sc['Ship'] = Ship;
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

    if (include.Global) {

        strRet += '<category name="Global">';

        if (include.Global.GetGlobal) 
            strRet += '<block type="system_getGlobal"></block>';
        if (include.Global.SetGlobal) 
            strRet += '<block type="system_setGlobal"></block>';
        if (include.Global.InvokeMethod) 
            strRet += '<block type="system_invokeMethod"></block>';
        if (include.Global.PlaySound) 
            strRet += '<block type="system_playSound"></block>';
        if (include.Global.SetTimeout) 
            strRet += '<block type="window_setTimeout"></block>';
        if (include.Global.SetBackgroundUrl) 
            strRet += '<block type="system_setBackgroundUrl"></block>';
        if (include.Global.SetBackgroundDrift) 
            strRet += '<block type="system_setBackgroundDrift"></block>';

        strRet += '</category>';
    }

    if (include.Object) {

        strRet += '<category name="Object">';

        if (include.Object.Add) 
            strRet += '<block type="trackableItem_add"></block>';
        if (include.Object.Remove) 
            strRet += '<block type="trackableItem_remove"></block>';
        if (include.Object.Exists) 
            strRet += '<block type="trackableItem_exists"></block>';

        if (include.Object.SetonUpdate) 
            strRet += '<block type="trackableItem_setonUpdate"></block>';

        if (include.Object.SetonCollide) 
            strRet += '<block type="trackableItem_setonCollide"></block>';

        if (include.Object.SetonOutOfBounds) 
            strRet += '<block type="trackableItem_setonOutOfBounds"></block>';

        if (include.Object.GetLeft) 
            strRet += '<block type="trackableItem_getLeft"></block>';
        if (include.Object.SetLeft) 
            strRet += '<block type="trackableItem_setLeft"></block>';
        if (include.Object.GetTop) 
            strRet += '<block type="trackableItem_getTop"></block>';
        if (include.Object.SetTop) 
            strRet += '<block type="trackableItem_setTop"></block>';

        if (include.Object.GetWidth) 
            strRet += '<block type="trackableItem_getWidth"></block>';
        if (include.Object.SetWidth) 
            strRet += '<block type="trackableItem_setWidth"></block>';
        if (include.Object.GetHeight) 
            strRet += '<block type="trackableItem_getHeight"></block>';
        if (include.Object.SetHeight) 
            strRet += '<block type="trackableItem_setHeight"></block>';

        if (include.Object.GetImage) 
            strRet += '<block type="trackableItem_getImage"></block>';
        if (include.Object.SetImage) 
            strRet += '<block type="trackableItem_setImage"></block>';
        if (include.Object.GetMass) 
            strRet += '<block type="trackableItem_getMass"></block>';
        if (include.Object.SetMass) 
            strRet += '<block type="trackableItem_setMass"></block>';
        if (include.Object.GetPresentation) 
            strRet += '<block type="trackableItem_getPresentation"></block>';
        if (include.Object.SetPresentation) 
            strRet += '<block type="trackableItem_setPresentation"></block>';
        if (include.Object.GetRadius) 
            strRet += '<block type="trackableItem_getRadius"></block>';
        if (include.Object.SetRadius) 
            strRet += '<block type="trackableItem_setRadius"></block>';
        if (include.Object.GetTheta) 
            strRet += '<block type="trackableItem_getTheta"></block>';
        if (include.Object.SetTheta) 
            strRet += '<block type="trackableItem_setTheta"></block>';

        if (include.Object.SetOOB) 
            strRet += '<block type="trackableItem_setOOB"></block>';

        if (include.Object.GetVelocityX) 
            strRet += '<block type="trackableItem_getVelocityX"></block>';
        if (include.Object.GetVelocityY) 
            strRet += '<block type="trackableItem_getVelocityY"></block>';
        if (include.Object.SetVelocity) 
            strRet += '<block type="trackableItem_setVelocity"></block>';

        if (include.Object.GetAttributeValue) 
            strRet += '<block type="trackableItem_getAttributeValue"></block>';

        if (include.Object.SetScore) 
            strRet += '<block type="trackableItem_setScore"></block>';

        strRet += '</category>';
    }

    if (include.Ship) {

        strRet += '<category name="Ship">';

        if (include.Ship.BeginCounterRotate) 
            strRet += '<block type="ship_beginCounterRotate"></block>';
        if (include.Ship.EndCounterRotate) 
            strRet += '<block type="ship_endCounterRotate"></block>';
        if (include.Ship.BeginRotate) 
            strRet += '<block type="ship_beginRotate"></block>';
        if (include.Ship.EndRotate) 
            strRet += '<block type="ship_endRotate"></block>';

        if (include.Ship.BeginThrust) 
            strRet += '<block type="ship_beginThrust"></block>';
        if (include.Ship.EndThrust) 
            strRet += '<block type="ship_endThrust"></block>';

        if (include.Ship.Fire) 
            strRet += '<block type="ship_fire"></block>';

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

    strRet += "</xml>";

    return strRet;
};

// Generate schema from JSON structure.
var defaultSchema = {

    Global: {

        GetGlobal: true,
        SetGlobal: true,
        InvokeMethod: true,
        PlaySound: true,
        SetTimeout: true,
        SetBackgroundUrl: true,
        SetBackgroundDrift: true
    },
    Object: {

        Add: true,
        Remove: true,
        Exists: true,
        SetonUpdate: true,
        SetonCollide: true,
        SetonOutOfBounds: true,
        GetLeft: true,
        SetLeft: true,
        GetTop: true,
        SetTop: true,
        GetWidth: true,
        SetWidth: true,
        GetHeight: true,
        SetHeight: true,
        GetImage: true,
        SetImage: true,
        GetMass: true,
        SetMass: true,
        GetPresentation: true,
        SetPresentation: true,
        GetRadius: true,
        SetRadius: true,
        GetTheta: true,
        SetTheta: true,
        SetOOB: true,
        GetVelocityX: true,
        GetVelocityY: true,
        SetVelocity: true,
        GetAttributeValue: true,
        SetScore: true
    },
    Ship: {

        BeginCounterRotate: true,
        EndCounterRotate: true,
        BeginRotate: true,
        EndRotate: true,
        BeginThrust: true,
        EndThrust: true,
        Fire: true
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

