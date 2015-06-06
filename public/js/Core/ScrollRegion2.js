///////////////////////////////////////
// ScrollRegion module--.
//
// Return function constructor.
//

"use strict";

// Define module.
define(["Core/errorHelper"],
    function (errorHelper) {

        // Define constructor function.
        var functionRet = function ScrollRegion() {

            var self = this;

            ///////////////////////////
            // Public events

            // Expose click handler.  Clicked item's Id passed as parameter to callback.
            self.click = null;

            ///////////////////////////
            // Public methods

            // Method adds new item to slider.
            //
            // jItem
            self.addItem = function (jItem) {

                try {

                    // Get calculation base.
                    var iBase = m_arrayItems.length;

                    // Add to collection.
                    m_arrayItems.push(jItem);

                    // Add to DOM.
                    m_jSlider.append(jItem);

                    // Is this item taller or wider?
                    var dWidth = jItem.width();
                    var dHeight = jItem.height();

                    // Position item and make room in slider.
                    jItem.css("left",
                        (iBase * m_dWidth).toString() + "px");
                    jItem.css("width",
                        m_dWidth.toString() + "px");

                    m_jSlider.width((iBase + 1) * m_dWidth);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method adds new item to slider.
            //
            // jItem
            self.addImage = function (strId, strName, strDescription, strResourceUrl) {

                try {

                    // Build the item.
                    var jItem = $("<img id='" + 
                        strId + 
                        "' class='ScrollRegionImage'></img>");

                    // Wire the load.  This is what adds the image to the DOM.
                    jItem.load(m_functionImageLoad);

                    // Wire the click.
                    jItem.click(m_functionImageClick);

                    // Wire the hover to enable tooltip
                    jItem.mousemove(function (e) {

                        try {

                            // Show tooltip on mouse move over image.

                            // Define function which is invoked either
                            // immediately or after a short delay depending
                            // on whether the tooltip is already visible.
                            var functionCallback = function () {

                                try {

                                    // Get the location of the cursor relative to the page.
                                    var dLeft = e.pageX - m_jRoot.position().left + m_dTooltipWidthOffset;
                                    var dTop = e.pageY - m_jRoot.position().top + m_dTooltipHeightOffset;

                                    // Configure and show the tooltip.
                                    m_jTooltip.html(strName + "<br/>" + strDescription);
                                    m_jTooltip.css("left",
                                        dLeft.toString() + "px");
                                    m_jTooltip.css("top",
                                        dTop.toString() + "px");
                                    m_jTooltip.css("display", 
                                        "inherit");
                                } catch (e) {

                                    errorHelper.show(e);
                                }
                            };

                            // If the tooltip is currently hidden, then 
                            // only show it after a pause, otherwise
                            // just update its position right now.
                            if (m_jTooltip.css("display").toUpperCase() === "NONE")
                            {
                                if (m_cookieTooltip) {

                                    clearTimeout(m_cookieTooltip);
                                    // m_cookieTooltip = null; // Would be needed, but we're about to set it.
                                }
                                m_cookieTooltip = setTimeout(functionCallback,
                                    400);
                            }
                            else
                            {
                                functionCallback();
                            }
                        } catch (e) {

                            errorHelper.show(e);
                        }
                    });
                    jItem.mouseout(function (e) {

                        if (m_cookieTooltip) {

                            clearTimeout(m_cookieTooltip);
                            m_cookieTooltip = null;
                        }
                        m_jTooltip.css("display", 
                            "none");
                    });

                    // Cause the load to be called.
                    // Load is called whether or not
                    // the image resource is cached.
                    jItem.attr("src",
                        strResourceUrl)

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Remove all items.
            //
            // jItem
            self.empty = function () {

                try {

                    // Remove from collection.
                    m_arrayItems = [];

                    // Remove from DOM.
                    m_jSlider.empty();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method creates, attaches and injects scroll region.
            //
            // strRootElementSelector - selector for DOM element.
            self.create = function (strRootElementSelector,
                dWidth,
                functionClick) {

                try {

                    // Save state.
                    m_dWidth = dWidth;
                    self.click = functionClick;

                    // Get j-reference to root element.
                    m_jRoot = $(strRootElementSelector);

                    // Allocate and inject DOM.
                    m_jSliderContainer = $("<div class='ScrollRegionSliderContainer' />");
                    m_jSlider = $("<div class='ScrollRegionSlider' />");
                    m_jLeft = $("<div class='ScrollRegionLeft'>&lt;&lt;</div>");
                    m_jRight = $("<div class='ScrollRegionRight'>&gt;&gt;</div>");

                    m_jSliderContainer.append(m_jSlider);
                    m_jRoot.append(m_jSliderContainer);
                    m_jRoot.append(m_jLeft);
                    m_jRoot.append(m_jRight);

                    // Install size handler to position the left and right glyphs.
                    $(window).resize(m_functionResize);

                    // Hook up the "buttons".
                    m_jLeft.mousedown(m_functionLeftDown);
                    m_jLeft.mouseup(m_functionLeftUp);
                    m_jLeft.mouseout(m_functionLeftUp);
                    m_jRight.mousedown(m_functionRightDown);
                    m_jRight.mouseup(m_functionRightUp);
                    m_jRight.mouseout(m_functionRightUp);

                    // Cause the resiez functionality to kick in.
                    m_functionResize();

                    // Create tooltip.
                    m_jTooltip = $("<div class='ScrollRegionTooltip' />");
                    m_jRoot.append(m_jTooltip);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////
            // Private methods.

            // Invoked when an image is loaded.
            // Implemented to add image to DOM.
            var m_functionImageLoad = function () {

                try {

                    // Get reference to the item that raised the load.
                    var jItem = $(this);

                    // Get position calculation base.
                    var iBase = m_arrayItems.length;

                    // Add to collection.
                    m_arrayItems.push(jItem);

                    // Is this item taller or wider?
                    var dWidth = jItem[0].naturalWidth;
                    var dHeight = jItem[0].naturalHeight;

                    // Position item and make room in slider.
                    if (dHeight > dWidth) {

                        // Position across whole height and center on width.
                        jItem.css("top",
                            "0px");
                        jItem.css("height",
                            m_dEffectiveHeight.toString() + "px");
                        var dItemWidth = m_dWidth * dWidth / dHeight;
                        jItem.css("width",
                            dItemWidth.toString() + "px");
                        jItem.css("left",
                            (iBase * m_dWidth + (m_dWidth - dItemWidth) / 2).toString() + "px");
                    } else {

                        // Position across whole width and center on height.
                        jItem.css("left",
                            (iBase * m_dWidth).toString() + "px");
                        jItem.css("width",
                            m_dWidth.toString() + "px");
                        var dItemHeight = m_dEffectiveHeight * dHeight / dWidth;
                        jItem.css("height",
                            dItemHeight.toString() + "px");
                        jItem.css("top",
                            ((m_dEffectiveHeight - dItemHeight) / 2).toString() + "px");
                    }

                    // Last, add to DOM, ...
                    m_jSlider.append(jItem);
                    // ...and make room in the slider.
                    m_jSlider.width((iBase + 1) * m_dWidth);

                } catch (e) {

                    alert(e.message);
                }
            };

            // Invoked when an image is clicked.
            // Implemented to raise the event.
            var m_functionImageClick = function () {

                try {

                    var jItem = $(this);
                    if ($.isFunction(self.click)) {

                        self.click.call(jItem);
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Handle resize.
            var m_functionResize = function (e) {

                try {

                    // Adjust the line-heights of the "buttons".
                    // This keeps the "direction"-glyphs centered.
                    m_jLeft.css("line-height",
                        m_jLeft.height() + "px");
                    m_jRight.css("line-height",
                        m_jLeft.height() + "px");

                    // Test if have to slide the slider over because 
                    // a gap has opened up due to resizing the browser.
                    var iW1 = m_jSliderContainer.width();
                    var iW2 = m_jSlider.width();

                    // If the "right" (the left plus the width) is  
                    // less than the width of the container, then 
                    // move the slider over--up to the point that  
                    // it would leave the left-hand side of container.
                    var dLeft = parseFloat(m_jSlider.css("left"));
                    if (dLeft + iW2 < iW1) {

                        // Position it to take as much space as allowed...
                        dLeft = iW1 - iW2;

                        // Unless it were to leave the edge...
                        if (dLeft > 0) {

                            dLeft = 0;
                        }

                        // And update.
                        m_jSlider.css("left",
                            dLeft.toString() + "px");
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Scroll left.
            var m_functionScrollLeft = function () {

                try {

                    // Scroll left, if there is still space to do so.
                    var iW1 = m_jSliderContainer.width();
                    var iW2 = m_jSlider.width();

                    // If the "right" (the left plus the width) is greater than
                    // the width of the container, then allow scrolling to left.
                    var dLeft = parseFloat(m_jSlider.css("left"));
                    if (dLeft + iW2 > iW1) {

                        // Scroll back by one increment.
                        dLeft -= m_dIncr;

                        // Stop when get to end--so that the end of the slider
                        // is only visible if the container is wider than it is.
                        if (dLeft < -iW2 + iW1) {

                            dLeft = -iW2 + iW1;
                        }
                    }

                    // Update the left.
                    m_jSlider.css("left",
                        dLeft.toString() + "px");

                    // Also update the increment a little bit if it is less than the max.
                    if (m_dIncr < m_dMaxIncr) {

                        // Small inrement.
                        m_dIncr *= m_dAcceleration;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Scroll right.
            var m_functionScrollRight = function () {

                try {

                    // Scroll to the right, if the left is off the view-port.
                    var dLeft = parseFloat(m_jSlider.css("left"));
                    if (dLeft < 0) {

                        // Add the increment.
                        dLeft += m_dIncr;

                        // If gone too far...
                        if (dLeft > 0) {

                            // Adjust back to max.
                            dLeft = 0;
                        }
                    }

                    // Set the left.
                    m_jSlider.css("left",
                        dLeft.toString() + "px");

                    // Increment the increment if less than the max.
                    if (m_dIncr < m_dMaxIncr) {

                        m_dIncr *= m_dAcceleration;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Handle left button down.
            var m_functionLeftDown = function (e) {

                try {

                    // Only allow new scroll if previous scroll has completed.
                    if (m_cookieInterval) {

                        return;
                    }

                    // Set up the new scroll.
                    m_cookieInterval = setInterval(m_functionScrollLeft,
                        m_dScrollRefreshMS);

                    // Indicate in the DOM that the button is depressed.
                    m_jLeft.addClass("ScrollRegionButtonDown");
                } catch (e) {

                    alert(e.message);
                }
            };

            // Handle left button up.
            var m_functionLeftUp = function (e) {

                try {

                    // Define callback method that is invoked
                    // over and over until it has dampened
                    // the increment below the threshold value.
                    var functionSomeFunction = function () {

                        // Damp the increment.
                        m_dIncr *= m_dStopDampening;

                        // If below the threshold, ...
                        if (m_dIncr < m_dDampeningIncrementEpsilon) {

                            // Stop the animation cookie.
                            if (m_cookieInterval) {

                                clearInterval(m_cookieInterval);
                                m_cookieInterval = null;
                            }

                            // Reset GUI and increment.
                            m_jLeft.removeClass("ScrollRegionButtonDown");
                            m_dIncr = m_dIncrRoot;
                        } else {

                            // Call back into this function to dampen more.
                            setTimeout(functionSomeFunction,
                                m_dDampeningRefreshMS);
                        }
                    };

                    // Start a timer that decrements the increment.
                    setTimeout(functionSomeFunction, 
                        m_dDampeningRefreshMS)
                } catch (e) {

                    alert(e.message);
                }
            };

            // Handle right button down.
            var m_functionRightDown = function (e) {

                try {

                    // Only allow new scroll if previous scroll has completed.
                    if (m_cookieInterval) {

                        return;
                    }

                    // Set up the new scroll.
                    m_cookieInterval = setInterval(m_functionScrollRight,
                        m_dScrollRefreshMS);

                    // Indicate in the DOM that the button is depressed.
                    m_jRight.addClass("ScrollRegionButtonDown");
                } catch (e) {

                    alert(e.message);
                }
            };

            // Handle right button up.
            var m_functionRightUp = function (e) {

                try {

                    // Define callback method that is invoked
                    // over and over until it has dampened
                    // the increment below the threshold value.
                    var functionSomeFunction = function () {

                        // Damp the increment.
                        m_dIncr *= m_dStopDampening;

                        // If below the threshold, ...
                        if (m_dIncr < m_dDampeningIncrementEpsilon) {

                            // Stop the animation cookie.
                            if (m_cookieInterval) {

                                clearInterval(m_cookieInterval);
                                m_cookieInterval = null;
                            }

                            // Reset GUI and increment.
                            m_jRight.removeClass("ScrollRegionButtonDown");
                            m_dIncr = m_dIncrRoot;
                        } else {

                            // Call back into this function to dampen more.
                            setTimeout(functionSomeFunction,
                                m_dDampeningRefreshMS);
                        }
                    };

                    // Start a timer that decrements the increment.
                    setTimeout(functionSomeFunction, 
                        m_dDampeningRefreshMS)
                } catch (e) {

                    alert(e.message);
                }
            };

            ///////////////////////////
            // Private fields.

            // The base element--from the DOM.
            var m_jRoot = null;
            // The slider container.
            var m_jSliderContainer = null;
            // The slider.
            var m_jSlider = null;
            // The "move the items to the left" button.
            var m_jLeft = null;
            // The "move the items to the right" button.
            var m_jRight = null;
            // The tooltip.
            var m_jTooltip = null;
            // Collection of items.
            var m_arrayItems = [];
            // Width of item.
            var m_dWidth = 100;
            // Height of item.
            var m_dEffectiveHeight = 88;
            // Initial scroll distance per step.
            var m_dIncrRoot = 0.8;
            // Scroll distance per step.
            var m_dIncr = m_dIncrRoot;
            // The cookie causing the scrolling to occur.
            var m_cookieInterval = null;
            // Max jump per step.
            var m_dMaxIncr = 5;
            // The acceleration of the increment.
            var m_dAcceleration = 1.01;
            // MS freq of scrolling.
            var m_dScrollRefreshMS = 4;
            // MS freq of scrolling.
            var m_dDampeningRefreshMS = 1;
            // Amount by which the increment decelerates 
            // when the mouse button is lifted.
            var m_dStopDampening = 0.95;
            // Amount, below which, the increment is 
            // considered 0 and the scroll may stop.
            var m_dDampeningIncrementEpsilon = 0.1;
            // Number of pixels to offset tooltip from cursor left-right.
            var m_dTooltipWidthOffset = 20;
            // Number of pixels to offset tooltip from cursor top-bottom.
            var m_dTooltipHeightOffset = 2;
            // Cookie keeps track of tooltip callback staged on mouse move.
            var m_cookieTooltip = null;
        };

        // Return constructor function.
        return functionRet;
    });
