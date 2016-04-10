///////////////////////////////////////
// Main application module.
//

"use strict";

// The main module requires other modules, it does not define its own, per se.
require(["utility/prototypes",
    "utility/settings",
    "utility/glyphs",
    "manager/Manager"],
    function (prototypes, settings, glyphs, Manager) {

        try {

            // Create the glyphs module first, its 
            // complete callback will contiue things.
            glyphs.create(function () {

                try {

                    // Allocate and create the layer manager.
                    var manager = new Manager();
                    var exceptionRet = manager.create();
                    if (exceptionRet) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            });
        } catch (e) {

            alert(e.message);
        }
    });
