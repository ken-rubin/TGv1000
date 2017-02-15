///////////////////////////////////////
// Settings module.
//
// Contains visial settings for all GUI components.
//
// Return instance.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes"],
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
                            height: 40,
                            yOffset: -20,
                            fillBackground: "rgba(0,0,100,0.25)",
                            amount: 4
                        },
                        tinyScrollStub: {

                            width: 40,
                            height: 10,
                            yOffset: -5,
                            fillBackground: "rgba(0,0,100,0.25)",
                            amount: 4
                        },
                        margin: 4,
                        textOffset: 4,
                        strokeDrag: "rgba(0,0,0,0.1)",
                        fillDrag: "rgba(100,100,100,0.1)",
                        strokeBackgroundSelected: "#404",
                        fillBackgroundSelected: "#f0f",
                        // strokeBackgroundHighlight: "#000",
                        // fillBackgroundHighlight: "#fff",
                        strokeBackgroundHighlight: "#000",
                        fillBackgroundHighlight: "#0ff",
                        fillBackground: "rgba(0,0,0,0.5)",
						fillBackgroundSolid: "rgba(64,64,64,1.0)",
                        strokeBackground: "#000",
                        fillText: "#000",
                        blinkMS: 500,
                        maximumCharacters: 32,
                        smallFont: "15px Arial",
                        smallBoldFont: "bold 15px Arial",
                        font: "20px Arial",
                        boldFont: "bold 20px Arial",
                        largeFont: "30px Arial",
                        smallMonoSpaceFont: "15px Courier New",
                        monoSpaceFont: "20px Courier New",
                        largeMonoSpaceFont: "30px Courier New"
                    };
                    self.dialog = {

                        firstColumnWidth: 200,
                        lineHeight: 34,
                        font: "24px Arial"
                    };
                    self.button = {

                        background: "rgba(200, 200, 140, 0.5)",
                        backgroundMouseIn: "rgba(200, 200, 140, 0.75)",
                        backgroundMouseDown: "rgba(200, 200, 140, 1)"
                    };
                    self.area = {

                        cornerRadius: 8
                    };
                    self.background = {

                        imageURLs: [

                            "./js/NextWave/media/background0.png",
                            "./js/NextWave/media/background1.jpg",
                            "./js/NextWave/media/background2.jpg",
                            "./js/NextWave/media/background3.jpg",
                            "./js/NextWave/media/background4.jpg",
                            "./js/NextWave/media/background5.jpg",
                            "./js/NextWave/media/background6.png",
                            "./js/NextWave/media/background7.JPG"]
                    };
                    self.typeBuilder = {

                        firstColumnWidthPercent: 0.25,
                        lineHeight: 34,
                        font: "24px Arial"
                    };
                    self.manager = {

                        debugFill: "#000",
                        debugBackgroundStroke: "#000",
                        debugBackgroundFill: "rgba(225, 225, 200, 0.15)",
                        fontDebug: "16px Arial",
                        hostSelector: "#Palette",
                        showIconBackgrounds: false,
                        dragDistance: 5
                    };
                    self.layerDrag = {

                        showInsertionLines: false
                    };
                    self.panel = {

                        closedExtent: 30,
                        fillBackground: "rgba(200, 200, 250, 0.75)",
                        landingPageFillBackground: "rgba(255,255,255, .05)",
                        cornerRadius: 4,
                        fontTitle: "16px Arial",
                        fillTitle: "#123",
                        heightDelta: 10,
                        widthDelta: 10,
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

                        imageURL: "./js/NextWave/media/glyphicons.png",   // Icon sheet.
                        fillBackground: "rgba(0,0,0,0.25)",
                        width: 32,
                        height: 32,
                        smallWidth: 28,
                        smallHeight: 28,
                        //
                        // To get an initial estimate of where the icons are:
                        // 1) Find the row, col of the icon.
                        // 2) The average icon size is: 60.833 pixels high and 57.333 pixels wide.
                        // 3) Do the math.
                        // 4) Adjust....
						// Or, better yet, open the Icon sheet in paint.net, position your cursor at the upper left
						// corner of your selected glyphicon and use those coordinates.
						// Small adjustments will still be necessary.
                        //
						settings: {

							x: 1061,
							y: 6
						},
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
                        },
                        remove: {

                            x: 820,
                            y: 316
                        },
                        addNew: {

                            x: 707,
                            y: 316
                        },
                        save: {

                            x: 215,
                            y: 316
                        },
                        search: {

                            x: 1526,
                            y: 6
                        },
						cloudDownload: {

							x: 1038,
							y: 373
						},
						stop: {

							x: 1891,
							y: 248
						},
						play: {

							x: 1801,
							y: 249
						},
						home: {

							x: 688,
							y: 128
						},
                        openFile: {

                            x: 183,
                            y: 254
                        }
                    };
					self.layerLandingPage = {

						navOffset: 80,
						navTopMargin: 25,
						dVerticalPct: 0.6,
						pictureSpacer: 25

					};
                    self.layerPanels = {

                        namesPanel: {

                            x: 0,
                            width: 0.25,
                            height: 0.25
                        },
                        statementsPanel: {

                            x: 0.5,
                            width: 0.25,
                            height: 0.25
                        },
                        literalsPanel: {

                            x: 0.5,
                            width: 0.25,
                            height: 0.25
                        },
                        expressionsPanel: {

                            x: 0.75,
                            width: 0.25,
                            height: 0.25
                        },
                        typesPanel: {

                            y: 0,
                            width: 0.3,
                            height: 1
                        },
                        centerPanel: {

                            x: 0.3,
                            width: 0.7,
                            height: 1
                        }
                    };
                    self.centerPanel = {

                        font: "28px Arial",
                        lineHeight: 34,
                        fillBackground: "#bbb"
                    };
                    self.parameter = {

                        font: "16px Arial",
                        fillBackground: "#9c9"
                    };
                    self.typeMethodPair = {

                        font: "20px Arial",
                        fillBackground: "#4dd"
                    };
                    self.statementDragStub = {

                        height: 2,
                        widthMarginPercent: 0.1,
                        fillEven: "#ee0",
                        fillOdd: "rgba(0,0,0,0.25)",
                        fillHighlight: "#0f0",
                        blinkMS: 250
                    };
                    self.codeStatement = {

                        font: "26px Arial",
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
                        comment: {

                            fillBackground: "#faa"
                        },
                        freeForm: {

                            fillBackground: "#faa"
                        },
                        debugger: {

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
                        font: "12px Arial",
                        lineHeight: 24,
                        glyphExtent: 16
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

                            font: "18px Arial",
                            lineHeight: 26,
                            fillBackground: "#0ff"
                        },
                        statement: {

                            font: "18px Arial",
                            lineHeight: 26,
                            fillBackground: "#faa"
                        },
                        expression: {

                            font: "18px Arial",
                            lineHeight: 26,
                            fillBackground: "#afa"
                        },
                        literal: {

                            font: "18px Arial",
                            lineHeight: 26,
                            fillBackground: "#aaf"
                        },
                        picture: {

                        },
                        radio: {

                            font: "18px Arial",
							outlineFont: "14px Arial",
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

                            font: "24px Arial",
                            lineHeight: 40,
                            fillBackground: "#ffa"
                        },
                        methods: {

                            font: "16px Arial",
                            lineHeight: 30,
                            fillBackground: "#88f"
                        },
                        method: {

                            font: "12px Arial",
                            lineHeight: 25,
                            fillBackground: "#ddf"
                        },
                        properties: {

                            font: "16px Arial",
                            lineHeight: 30,
                            fillBackground: "#8f8"
                        },
                        property: {

                            font: "12px Arial",
                            lineHeight: 25,
                            fillBackground: "#dfd"
                        },
                        events: {

                            font: "16px Arial",
                            lineHeight: 30,
                            fillBackground: "#f88"
                        },
                        event: {

                            font: "12px Arial",
                            lineHeight: 25,
                            fillBackground: "#fdd"
                        }
                    };
					self.tooltip = {

						fillStyle: "#b5352f",
						textStyle: "#FFFFF0",
						lineWidth: 2,
						lineHeight: 25
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
