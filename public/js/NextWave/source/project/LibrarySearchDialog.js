///////////////////////////////////////
// LibrarySearchDialog module.
//
// Gui component responsible for 
// a search for library dialog.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/DialogHost",
    "NextWave/source/utility/List",
    "NextWave/source/utility/ListItem"
    ],
    function (prototypes, settings, Point, Size, Area, DialogHost, List, ListItem) {

        try {

            // Constructor function.
            var functionRet = function LibrarySearchDialog() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from DialogHost.
                    self.inherits(DialogHost);

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "LibrarySearchDialog: Instance already created!" };
                            }

                            // Add input element.
                            let elementInput = document.createElement("input");
                            elementInput.id = "ProjectDialogInput";
                            elementInput.type = "file";
                            elementInput.accept = ".json";
                            elementInput.style = "display:none;";
                            elementInput.addEventListener("change", 
                                function (event) {

                                    try {

                                        // .
                                        var reader = new FileReader();

                                        reader.onload = function(e) {

                                            var text = reader.result;
                                            let objectLibrary = JSON.parse(text);
                                            //alert(text);
                                            window.projectDialog.mergeLibrary(objectLibrary);
                                        }

                                        reader.readAsText(this.files[0]);
                                        this.value = "";

                                    } catch (e) {

                                        alert(e.message);
                                    }
                                });
                            document.body.appendChild(elementInput);

                            // Create the dialog.
                            var exceptionRet = self.dialog.create({

                                localButton: {

                                    type: "Button",
                                    text: "Search This Machine...",
                                    x: settings.general.margin,
                                    y: settings.general.margin,
                                    width: settings.dialog.firstColumnWidth * 2,
                                    height: settings.dialog.lineHeight * 3,
                                    click: function () {

                                        // Click the hidden input to dropdown the select file browser facility.
                                        document.getElementById("ProjectDialogInput").click();
                                    }
                                },
                                serverButton: {

                                    type: "Button",
                                    text: "Search The Server",
                                    x: settings.general.margin,
                                    y: settings.general.margin * 2 + 
                                        settings.dialog.lineHeight * 3,
                                    width: settings.dialog.firstColumnWidth * 2,
                                    height: settings.dialog.lineHeight * 3,
                                    click: function () {
                                    
                                        // Go off to the server, select data, display result in dialog.
                                        client.searchLibraries(
                                            m_searchPhrase,
                                            function(err, libraries) {
                                                if (err) {
                                                    alert(err.message);
                                                    return;
                                                }

                                                let lhLibraryResult = self.dialog.controlObject["libraryResult"];
                                                let listLibraryResult = lhLibraryResult.list;
                                                
                                                // Don't check result because if destroy fails, that's because it hadn't been created, so it's ok.
                                                listLibraryResult.destroy();
                                                let arrayOutput = libraries.map((library) => {

                                                    let liNew = new ListItem(library.name);
                                                    liNew.data = library;
                                                    liNew.clickHandler = () => {

                                                        let objectLibrary = JSON.parse(library.libraryJSON);
                                                        window.projectDialog.mergeLibrary(objectLibrary);                                                    
                                                    };
                                                    return liNew;
                                                })

                                                listLibraryResult.create(arrayOutput);
                                            }
                                        );   
                                    }
                                },
                                criteriaLabel: {

                                    type: "Label",
                                    text: "Server Search Criteria",
                                    x: settings.general.margin,
                                    y: settings.dialog.lineHeight * 6 + 
                                        3 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                criteriaEdit: {

                                    type: "Edit",
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: settings.dialog.lineHeight * 6 + 
                                        3 * settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight * 5,
                                    exitFocus: function (localSelf) {

                                        try {
                                            // Save off criteria.
                                            m_searchPhrase = localSelf.text;
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                },
                                libraryResult: {

                                    type: "ListHost",
                                    constructorParameterString: "true",
                                    x: settings.general.margin,
                                    y: settings.general.margin * 4 + 
                                        settings.dialog.lineHeight * 11,
                                    widthType: "reserve",
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth,
                                    heightType: "callback",
                                    height: function(area) {
                                        return area.extent.height - (settings.general.margin * 5 + settings.dialog.lineHeight * 11);
                                    }
                                }
                            });

                            // Because it is!
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Decompose instance.
                    self.destroy = function () {

                        try {

                            // Can only destroy a created instance.
                            if (!m_bCreated) {

                                throw { message: "Instance not created!" };
                            }

                            window.librarySearchDialog = null;
                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    var m_searchPhrase = "";
                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
