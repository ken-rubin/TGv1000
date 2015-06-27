///////////////////////////////////////
// ScrollRegionV module--.
//
// Return function constructor.
//

"use strict";

// Define module.
define(["Core/errorHelper", "Core/resourceHelper"],
    function (errorHelper, resourceHelper) {

        // Define constructor function.
        var functionRet = function ScrollRegionV() {

            var self = this;

            ///////////////////////////
            // Public events

            // Expose click handler.  Clicked item's Id passed as parameter to callback.
            self.click = null;

            ///////////////////////////
            // Public methods

            // Method creates, attaches and injects scroll region.
            //
            // strRootElementSelector - selector for DOM element.
            self.create = function (strRootElementSelector,
                dHeight,
                functionClick) {

                try {

                    // Save state.
                    m_dHeight = dHeight;
                    m_dWidth = dHeight;    // everything's a square.
                    self.click = functionClick;

                    // Get j-reference to root element.
                    m_jRoot = $(strRootElementSelector);

                    // Allocate and inject DOM.
                    m_jSliderContainer = $("<div class='ScrollRegionVSliderContainer' />");
                    m_jSlider = $("<div class='ScrollRegionVSlider' />");
                    m_jTop = $("<div class='ScrollRegionVTop'><img src='/media/images/uparrow.png' /></div>");
                    m_jBottom = $("<div class='ScrollRegionVBottom'><img src='/media/images/downarrow.png' /></div>");

                    m_jSliderContainer.append(m_jSlider);
                    m_jRoot.append(m_jSliderContainer);
                    m_jRoot.append(m_jTop);
                    m_jRoot.append(m_jBottom);

                    // Install size handler to position the left and right glyphs.
                    $(window).resize(m_functionResize);

                    // Hook up the "buttons".
                    m_jTop.mousedown(m_functionTopDown);
                    m_jTop.mouseup(m_functionTopUp);
                    m_jTop.mouseout(m_functionTopUp);
                    m_jBottom.mousedown(m_functionBotDown);
                    m_jBottom.mouseup(m_functionBotUp);
                    m_jBottom.mouseout(m_functionBotUp);

                    // Cause the resize functionality to kick in.
                    m_functionResize();

                    return null;
                    
                } catch (e) {

                    return e;
                }
            };

            // Method adds new item to slider.
            //
            // jItem
            self.addImage = function (strId, strName, strDescription, strResourceUrl, strImageClass, functionJItemCallBack) {

                try {

                    // Build the item.
                    var jItem = $("<img data-toggle='tooltip' data-placement='bottom' title='" + strName + "' style='position:absolute;' id='" + 
                        strId + 
                        "' class='" + strImageClass + "'></img>");

                    // Wire the load.  This is what adds the image to the DOM.
                    jItem.load(m_functionOnNewImageLoaded);

                    // Wire the click.
                    jItem.click(m_functionImageClick);

                    jItem.attr("src",
                        strResourceUrl);

                    if ($.isFunction(functionJItemCallBack)) {

                        functionJItemCallBack(jItem);
                    }

                    return null;

                } catch (e) {

                    return e;
                }
            };

            // Update scroll region image.
            self.updateImage = function(selector, strName, strDescription, strUrl) {

                try {

                    var jItem = $(selector);
                    jItem.off('load');  // unbind the previous event handler or they'll all fire.
                    jItem.on('load', m_functionOnUpdatedImageLoaded);
                    jItem.attr("title", strName);   // for the updated tooltip
                    jItem.attr("src", strUrl);

                    return null;

                } catch (e) {

                    return e;
                }

            }

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

            // If a new type/tool was just added, it may be overflow-hidden.
            self.functionMakeSureToolIsVisible = function(clType) {

                try {

                    var iPxVisible = m_jSliderContainer.height();
                    var iNumVisible = Math.floor(iPxVisible / m_dHeight);

                    // Find index of clType in m_arrayItems.
                    var index = -1;
                    var strSearchId = "tool-" + client.removeSpaces(clType.data.name);
                    for (var i = 0; i < m_arrayItems.length; i++) {

                        if (m_arrayItems[i][0].id === strSearchId) {

                            index = i;
                            break;
                        }
                    }

                    if (index > -1) {

                        return m_functionAssureImageIsVisible(strSearchId);
                    }

                    return null;

                } catch(e) {

                    return e;
                }
            }

            ///////////////////////////
            // Private methods.

            // Invoked when an image is loaded.
            // Implemented to add image to DOM.
            var m_functionOnNewImageLoaded = function () {

                try {

                    // Get reference to the item that raised the load.
                    var jItem = $(this);

                    // Get position calculation base.
                    var iBase = m_arrayItems.length;

                    // Add to collection.
                    m_arrayItems.push(jItem);

                    var exceptionRet = m_functionCompleteImageAddUpdate(jItem, iBase);
                    if (exceptionRet) { throw exceptionRet; }

                    // Last, add to DOM, ...
                    m_jSlider.append(jItem);
                    // ...and make room in the slider.
                    m_jSlider.height((iBase + 1) * m_dHeight);

                    // Make sure toolstrip scrolls to show new image.
                    exceptionRet = m_functionAssureImageIsVisible(jItem[0].id);
                    if (exceptionRet) { throw exceptionRet; }

                } catch (e) {

                    errorHelper.show(e);
                }
            };

            var m_functionOnUpdatedImageLoaded = function() {

                try {

                    // Get reference to the item that raised the load.
                    var jItem = $(this);

                    // Calculate/search for iBase: index of this item in m_arrayItems.
                    for (var iBase = 0; iBase < m_arrayItems.length; iBase++) {

                        if (m_arrayItems[iBase][0].id === jItem[0].id) {

                            var exceptionRet = m_functionCompleteImageAddUpdate(jItem, iBase);
                            if (exceptionRet) { throw exceptionRet; }

                            // User may have selected a type for the TypeWell, scrolled it out of sight and then changed its image.
                            // I want it to be seen in the toolstrip.
                            exceptionRet = m_functionAssureImageIsVisible(jItem[0].id);
                            if (exceptionRet) { throw exceptionRet; }

                            break;
                        }
                    }
                } catch(e) {

                    errorHelper.show(e);
                }
            }

            // Shared code for image add and update.
            var m_functionCompleteImageAddUpdate = function (jItem, iBase) {

                try {

                    // Is this item taller or wider?
                    var dWidth = jItem[0].naturalWidth;
                    var dHeight = jItem[0].naturalHeight;

                    // Position item and make room in slider.
                    if (dWidth > dHeight) {

                        // Position across whole width and center on height.
                        // Remove left. It might have been left over from a previous image that was centered horizontally.
                        jItem.css("left", "");
                        jItem.css("right",
                            "0px");
                        jItem.css("width",
                            m_dWidth.toString() + "px");
                        var dItemHeight = m_dHeight * dHeight / dWidth;
                        jItem.css("height",
                            dItemHeight.toString() + "px");
                        var dWork = (iBase * m_dHeight + (m_dHeight - dItemHeight) / 2);
                        jItem.css("top",
                            dWork.toString() + "px");
                    } else {

                        // Position down whole height and center on width.
                        // Remove right. It might have been left over from a previous image that was centered horizontally.
                        jItem.css("right", "");
                        jItem.css("top",
                            (iBase * m_dHeight).toString() + "px");
                        jItem.css("height",
                            m_dHeight.toString() + "px");
                        var dItemWidth = m_dWidth * dWidth / dHeight;
                        jItem.css("width",
                            dItemWidth.toString() + "px");
                        var dWork = ((m_dWidth - dItemWidth) / 2);
                        jItem.css("left",
                            dWork.toString() + "px");
                    }

                    // Fire bootstrap tooltip opt-in.











                    return null;
                
                } catch (e) {

                    return e;
                }
            }

            // Invoked when an image is clicked.
            // Implemented to raise the event.
            var m_functionImageClick = function () {

                try {

                    var jItem = $(this);
                    if ($.isFunction(self.click)) {

                        self.click.call(jItem);
                    }
                } catch (e) {

                    errorHelper.show(e);
                }
            };

            // Handle resize.
            var m_functionResize = function (e) {

                try {

                    // Adjust the line-heights of the "buttons".
                    // This keeps the "direction"-glyphs centered.
                    m_jTop.css("line-height",
                        m_jTop.height() + "px");
                    m_jBottom.css("line-height",
                        m_jTop.height() + "px");

                    // Test if have to slide the slider up because 
                    // a gap has opened up due to resizing the browser.
                    var iW1 = m_jSliderContainer.height();
                    var iW2 = m_jSlider.height();

                    // If the "bottom" (the top plus the height) is  
                    // less than the height of the container, then 
                    // move the slider up--up to the point that  
                    // it would leave the top side of container.
                    var dTop = parseFloat(m_jSlider.css("top"));
                    if (dTop + iW2 < iW1) {

                        // Position it to take as much space as allowed...
                        dTop = iW1 - iW2;

                        // Unless it were to leave the edge...
                        if (dTop > 0) {

                            dTop = 0;
                        }

                        // And update.
                        m_jSlider.css("top",
                            dTop.toString() + "px");
                    }
                } catch (e) {

                    errorHelper.show(e);
                }
            };

            // Scroll up.
            var m_functionScrollUp = function () {

                try {

                    // Scroll up, if there is still space to do so.
                    var iW1 = m_jSliderContainer.height();
                    var iW2 = m_jSlider.height();

                    // If the "bottom" (the top plus the height) is greater than
                    // the height of the container, then allow scrolling to top.
                    var dTop = parseFloat(m_jSlider.css("top"));
                    if (dTop + iW2 > iW1) {

                        // Scroll back by one increment.
                        dTop -= m_dIncr;

                        // Stop when get to end--so that the end of the slider
                        // is only visible if the container is higher/taller than it is.
                        if (dTop < -iW2 + iW1) {

                            dTop = -iW2 + iW1;
                        }
                    }

                    // Update the top.
                    m_jSlider.css("top",
                        dTop.toString() + "px");

                    // Also update the increment a little bit if it is less than the max.
                    if (m_dIncr < m_dMaxIncr) {

                        // Small inrement.
                        m_dIncr *= m_dAcceleration;
                    }
                } catch (e) {

                    errorHelper.show(e);
                }
            };

            // jItem with id strSearchId may or may not be visible. If not, scroll to make sure it is.
            // This could involve scrolling up or down since it happens on new Type or updated type image. 
            var m_functionAssureImageIsVisible = function(strSearchId) {

                try {

                    var iIndexOfFirstFullyVisibleItem = Math.floor((-1 * parseFloat(m_jSlider.css("top"))) / m_dHeight);
                    var iNumFullyVisibleItems = Math.floor(m_jSliderContainer.height() / m_dHeight) - 1;
                    var iIndexOfLastFullyVisibleItem = iIndexOfFirstFullyVisibleItem + iNumFullyVisibleItems - 1;

                    var iIndexOfStrSearchIdItem = -1;
                    for (var i = 0; i < m_arrayItems.length; i++) {

                        if (m_arrayItems[i][0].id === strSearchId) {

                            iIndexOfStrSearchIdItem = i;
                            break;
                        }
                    }

                    if (iIndexOfStrSearchIdItem === -1) {

                        return null;    // give up
                    }

                    if (iIndexOfStrSearchIdItem >= iIndexOfFirstFullyVisibleItem && iIndexOfStrSearchIdItem <= iIndexOfLastFullyVisibleItem) {

                        return null;    // item is already visible
                    }

                    // Calculate top that displays iIndexOfStrSearchIdItem.
                    m_jSlider.css("top", (m_jSliderContainer.height() - m_jSlider.height() /*- m_dHeight*/ ).toString() + "px");

                    return null;

                } catch(e) {

                    return e;
                }
            }

            // Scroll down.
            var m_functionScrollDown = function () {

                try {

                    // Scroll to the bottom, if the top is off the view-port.
                    var dTop = parseFloat(m_jSlider.css("top"));
                    if (dTop < 0) {

                        // Add the increment.
                        dTop += m_dIncr;

                        // If gone too far...
                        if (dTop > 0) {

                            // Adjust back to max.
                            dTop = 0;
                        }
                    }

                    // Set the top.
                    m_jSlider.css("top",
                        dTop.toString() + "px");

                    // Increment the increment if less than the max.
                    if (m_dIncr < m_dMaxIncr) {

                        m_dIncr *= m_dAcceleration;
                    }
                } catch (e) {

                    errorHelper.show(e);
                }
            };

            // Handle left button down.
            var m_functionTopDown = function (e) {

                try {

                    // Only allow new scroll if previous scroll has completed.
                    if (m_cookieInterval) {

                        return;
                    }

                    // Set up the new scroll.
                    m_cookieInterval = setInterval(m_functionScrollDown,
                        m_dScrollRefreshMS);

                    // Indicate in the DOM that the button is depressed.
                    m_jTop.addClass("ScrollRegionVButtonDown");

                } catch (e) {

                    errorHelper.show(e);
                }
            };

            // Handle left button up.
            var m_functionTopUp = function (e) {

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
                            m_jTop.removeClass("ScrollRegionVButtonDown");
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

                    errorHelper.show(e);
                }
            };

            // Handle right button down.
            var m_functionBotDown = function (e) {

                try {

                    // Only allow new scroll if previous scroll has completed.
                    if (m_cookieInterval) {

                        return;
                    }

                    // Set up the new scroll.
                    m_cookieInterval = setInterval(m_functionScrollUp,
                        m_dScrollRefreshMS);

                    // Indicate in the DOM that the button is depressed.
                    m_jBottom.addClass("ScrollRegionVButtonDown");

                } catch (e) {

                    errorHelper.show(e);
                }
            };

            // Handle right button up.
            var m_functionBotUp = function (e) {

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
                            m_jBottom.removeClass("ScrollRegionVButtonDown");
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

                    errorHelper.show(e);
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
            var m_jTop = null;
            // The "move the items to the right" button.
            var m_jBottom = null;
            // Collection of items.
            var m_arrayItems = [];
            // Width of item.
            var m_dHeight = 100;
            // Height of item.
            var m_dWidth = 88;
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
