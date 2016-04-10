///////////////////////////////////////
// Settings module.
//
// Contains visial settings for all GUI components.
//
// Return instance.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes"],
    function (prototypes) {

        try {

            // Constructor function.
        	var functionRet = function Settings() {

                try {

            		var self = this;                          // Uber closure.

                    ///////////////////////
                    // Public fields.

                    self.general = {

                        scrollStub: {

                            width: 40,
                            height: 20,
                            yOffset: -10,
                            fillBackground: "rgba(0,0,100,0.25)",
                            amount: 4
                        },
                        margin: 4,
                        textOffset: 4,
                        strokeDrag: "#000",
                        fillDrag: "#666",
                        strokeBackgroundHighlight: "#000",
                        strokeBackground: "#000",
                        fillBackgroundHighlight: "#fff",
                        fillText: "#000"
                    };
                    self.area = {

                        cornerRadius: 8
                    };
                    self.background = {

                        imageURLs: [

                            "./media/background0.png",
                            "./media/background1.jpg",
                            "./media/background2.jpg",
                            "./media/background3.jpg",
                            "./media/background4.jpg",
                            "./media/background5.jpg",
                            "./media/background6.png"]
                    };
                    self.manager = {

                        debugFill: "#000",
                        debugBackgroundStroke: "#000",
                        debugBackgroundFill: "rgba(225, 225, 200, 0.75)",
                        fontDebug: "20px Arial",
                        hostSelector: "#Palette",
                        showIconBackgrounds: false,
                        dragDistance: 5
                    };
                    self.panel = {

                        closedExtent: 30,
                        fillBackground: "rgba(200, 200, 250, 0.75)",
                        cornerRadius: 4,
                        fontTitle: "20px Arial",
                        fillTitle: "#123",
                        heightDelta: 10,
                        gap: 4,
                        north: {

                            offsetWidth: 10,
                            lineHeight: 30
                        },
                        west: {

                            offsetHeight: 10
                        }
                    };
                    self.glyphs = {

                        imageURL: "./media/glyphicons.png",   // Icon sheet.
                        fillBackground: "rgba(0,0,0,0.25)",
                        width: 32,
                        height: 32,
                        pushpin: {
                            
                            x: 708,
                            y: 562
                        },
                        arrowNorth: {

                            x: 3,
                            y: 375
                        },
                        arrowSouth: {

                            x: 1932,
                            y: 312
                        },
                        arrowWest: {

                            x: 1831,
                            y: 311
                        },
                        expand: {

                            x: 112,
                            y: 376
                        },
                        contract: {

                            x: 55,
                            y: 376
                        }
                    };
                    self.layerPanels = {

                        namesPanel: {

                            x: 0.2,
                            width: 0.2,
                            height: 0.25
                        },
                        statementsPanel: {

                            x: 0.4,
                            width: 0.2,
                            height: 0.25
                        },
                        expressionsPanel: {

                            x: 0.8,
                            width: 0.2,
                            height: 0.8
                        },
                        literalsPanel: {

                            x: 0.6,
                            width: 0.2,
                            height: 0.25
                        },
                        typesPanel: {

                            y: 0.2,
                            width: 0.2,
                            height: 0.8
                        },
                        methodPanel: {

                            x: 0.2,
                            width: 0.6,
                            height: 0.75
                        }
                    };
                    self.methodBuilder = {

                        font: "20px Arial",
                        lineHeight: 30,
                        fillBackground: "#bbb"
                    };
                    self.parameter = {

                        font: "22px Arial",
                        fillBackground: "#9c9"
                    };
                    self.typeName = {

                        font: "22px Arial",
                        fillBackground: "#4dd"
                    };
                    self.statementDragStub = {

                        height: 16,
                        widthMarginPercent: 0.1,
                        fillEven: "#ee0",
                        fillOdd: "rgba(0,0,0,0.25)",
                        fillHighlight: "#0f0"
                    };
                    self.codeStatement = {

                        font: "32px Arial",
                        lineHeight: 48,
                        for: {

                            fillBackground: "#faa"
                        },
                        forIn: {

                            fillBackground: "#faa"
                        },
                        while: {

                            fillBackground: "#faa"
                        },
                        if: {

                            fillBackground: "#faa"
                        },
                        return: {

                            fillBackground: "#faa"
                        },
                        continue: {

                            fillBackground: "#faa"
                        },
                        break: {

                            fillBackground: "#faa"
                        },
                        expression: {

                            fillBackground: "#faa"
                        },
                        var: {

                            fillBackground: "#faa"
                        },
                        try: {

                            fillBackground: "#faa"
                        },
                        throw: {

                            fillBackground: "#faa"
                        }
                    };
                    self.block = {

                        fillBackgroundHighlight: "rgba(0,0,0,0.15)",
                        fillBackground: "rgba(0,0,0,0.3)",
                        emptyHeight: 20,
                        font: "16px Arial",
                        lineHeight: 24,
                        glyphExtent: 16
                    };
                    self.codeName = {

                        emptyWidth: 20
                    };
                    self.codeLiteral = {

                        emptyWidth: 20
                    };
                    self.codeExpressionStub = {

                        emptyWidth: 40,
                        fillBackground: "rgba(0,0,0,0.5)",
                        fillBackgroundHighlight: "rgba(0,0,0,0.25)"
                    };
                    self.list = {

                        name: {

                            font: "22px Arial",
                            lineHeight: 26,
                            fillBackground: "#0ff"
                        },
                        statement: {

                            font: "22px Arial",
                            lineHeight: 26,
                            fillBackground: "#faa"
                        },
                        expression: {

                            font: "22px Arial",
                            lineHeight: 26,
                            fillBackground: "#afa"
                        },
                        literal: {

                            font: "22px Arial",
                            lineHeight: 26,
                            fillBackground: "#aaf"
                        }
                    };
                    self.tree = {

                        hostSelector: "#TypeTree",
                        defaultWidth: 400,
                        defaultHeight: 300,
                        fillBackground: "#ddd",
                        type: {

                            font: "30px Arial",
                            lineHeight: 40,
                            fillBackground: "#ffa"
                        },
                        methods: {

                            font: "20px Arial",
                            lineHeight: 30,
                            fillBackground: "#88f"
                        },
                        method: {

                            font: "16px Arial",
                            lineHeight: 25,
                            fillBackground: "#ddf"
                        },
                        properties: {

                            font: "20px Arial",
                            lineHeight: 30,
                            fillBackground: "#8f8"
                        },
                        property: {

                            font: "16px Arial",
                            lineHeight: 25,
                            fillBackground: "#dfd"
                        },
                        events: {

                            font: "20px Arial",
                            lineHeight: 30,
                            fillBackground: "#f88"
                        },
                        event: {

                            font: "16px Arial",
                            lineHeight: 25,
                            fillBackground: "#fdd"
                        }
                    };
                  } catch (e) {

                    alert(e.message);
                }
        	};

            // Allocate and return instance, not constructor.
        	return new functionRet();
        } catch (e) {

            alert(e.message);
        }
    });
