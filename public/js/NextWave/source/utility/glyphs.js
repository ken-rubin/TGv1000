/////////////////////////
// Glyph module.
//
// Wrapps access to the Bootstrap glyph icons.
// Public fields specify an Area for a single
//      glyph.
//
// Returns instance.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
	"NextWave/source/utility/settings",
	"NextWave/source/utility/Point",
	"NextWave/source/utility/Size",
	"NextWave/source/utility/Area"],
    function (prototypes, settings, Point, Size, Area) {

        try {

            // Constructor function.
        	var functionRet = function Glyph() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // pushpin.
                    self.pushpin = new Area(new Point(settings.glyphs.pushpin.x,settings.glyphs.pushpin.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // arrowNorth.
                    self.arrowNorth = new Area(new Point(settings.glyphs.arrowNorth.x,settings.glyphs.arrowNorth.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // arrowSouth.
                    self.arrowSouth = new Area(new Point(settings.glyphs.arrowSouth.x,settings.glyphs.arrowSouth.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // arrowWest.
                    self.arrowWest = new Area(new Point(settings.glyphs.arrowWest.x,settings.glyphs.arrowWest.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // expand.
                    self.expand = new Area(new Point(settings.glyphs.expand.x,settings.glyphs.expand.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // contract.
                    self.contract = new Area(new Point(settings.glyphs.contract.x,settings.glyphs.contract.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // contract.
                    self.remove = new Area(new Point(settings.glyphs.remove.x,settings.glyphs.remove.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // addNew.
                    self.addNew = new Area(new Point(settings.glyphs.addNew.x,settings.glyphs.addNew.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // save.
                    self.save = new Area(new Point(settings.glyphs.save.x,settings.glyphs.save.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // search.
                    self.search = new Area(new Point(settings.glyphs.search.x,settings.glyphs.search.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // openFile.
                    self.openFile = new Area(new Point(settings.glyphs.openFile.x,settings.glyphs.openFile.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // cloudDownload.
                    self.cloudDownload = new Area(new Point(settings.glyphs.cloudDownload.x,settings.glyphs.cloudDownload.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // stop.
                    self.stop = new Area(new Point(settings.glyphs.stop.x,settings.glyphs.stop.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // play.
                    self.play = new Area(new Point(settings.glyphs.play.x,settings.glyphs.play.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // home.
                    self.home = new Area(new Point(settings.glyphs.home.x,settings.glyphs.home.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));
                    // settings.
                    self.settings = new Area(new Point(settings.glyphs.settings.x,settings.glyphs.settings.y),
                        new Size(settings.glyphs.width, settings.glyphs.width));

                    ///////////////////////
                    // Public methods.

                    // Helper method loads up icons and
                    // then calls back to specified callback.
                    self.create = function (functionComplete) {

                    	try {

                    		// Load bitmap of glyphs.
                    		m_imageGlyphs = new Image();
                    		m_imageGlyphs.onload = function () {

                    			// Mark created.
                    			m_bCreated = true;

                    			// Invoke callback.
                    			functionComplete();
                    		};
                            m_imageGlyphs.src = settings.glyphs.imageURL;

                    		return null;
                    	} catch (e) {

                    		return e;
                    	}
                    }

                    // Draw an icon. If bProtected, we will temporarily decrease globalAlpha.
                    self.render = function (contextRender, areaRender, areaIcon, bBackground, bProtected) {

                        try {

                        	if (m_bCreated) {

                                if (bBackground) {

                                    // Render the background in place.
                                    contextRender.fillStyle = settings.glyphs.fillBackground;
                                    contextRender.fillRect(areaRender.location.x,
                                        areaRender.location.y,
                                        areaRender.extent.width,
                                        areaRender.extent.height);
                                }

								if (bProtected) {
									contextRender.globalAlpha = 0.35;
								}

                        		// Render the icon in place.
	                            contextRender.drawImage(m_imageGlyphs,
	                                areaIcon.location.x,
	                                areaIcon.location.y,
	                                areaIcon.extent.width,
	                                areaIcon.extent.height,
	                                areaRender.location.x,
	                                areaRender.location.y,
	                                areaRender.extent.width,
	                                areaRender.extent.height);

								if (bProtected) {
									contextRender.globalAlpha = 1.0;
								}
	                        }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////
                    // Private fields.

                    // Load bitmap of glyphs.
                    var m_imageGlyphs = null;
                    // Indicates so.
                    var m_bCreated = false;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return new functionRet();
        } catch (e) {

            alert(e.message);
        }
    });
