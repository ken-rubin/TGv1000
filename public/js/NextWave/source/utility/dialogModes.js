///////////////////////////////////////
// LandingPage Modes module.
//
// "Enum": 'Normal user','Privileged user'
//
// Return instance.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes"],
    function (prototypes) {

        try {

            // Constructor function.
        	var functionRet = function Orientation() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

					// Used in LayerNavbar.js.
                    self.normaluserinitialstate = 101;
                    self.privilegeduserinitialstate = 102;

					// Universal mode -- used to ensure a match whatever the dialog's m_mode is set to.
					self.universalmode = -1;

					// Unfiltered mode -- used to show everything.
					self.unfilteredMode = -2;

					// Used in LayerLandingPage.js.
                    self.normalusersearching = 1;
                    self.privilegedusersearching = 2;
					self.programMode = 50;
					self.classMode = 51;
					self.kitMode = 52;

					// Used in LayerNavbar.js and in LayerLandingPage.js.
					self.normaluserclickstrip0 = 3;
					self.normaluserclickstrip1 = 4;
					self.normaluserclickstrip2 = 5;
					self.normaluserclickstrip3 = 6;
					self.normaluserclickstrip4 = 7;
					self.normaluserclickstrip5 = 8;
					self.privilegeduserclickstrip0 = 9;
					self.privilegeduserclickstrip1 = 10;
					self.privilegeduserclickstrip2 = 11;
					self.privilegeduserclickstrip3 = 12;
					self.privilegeduserclickstrip4 = 13;
					self.privilegeduserclickstrip5 = 14;

                } catch (e) {

                    alert(e.message);
                }
        	};

        	return new functionRet();
        } catch (e) {

            alert(e.message);
        }
    });
