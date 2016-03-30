///////////////////////////////////////
// ScrollRegionMulti module--.
//
// Return function constructor.
//

"use strict";

// Define module.
define(["Core/errorHelper", "Core/resourceHelper"],
    function (errorHelper, resourceHelper) {

        // Define constructor function.
        var functionRet = function ScrollRegionMulti() {

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
                dWidth,
                dHeight,
                functionClick) {

                try {

                    // Save state.
                    m_strRootElementSelector = strRootElementSelector;
                    m_dWidth = dWidth;
                    m_dHeight = dHeight;
                    self.click = functionClick;

                    return self.finishCreating();
                    
                } catch (e) {

                    return e;
                }
            };

            self.finishCreating = function() {

                try {
                    
                    // Get j-reference to root element.
                    m_jRoot = $(m_strRootElementSelector);
                    var strRowHeight = (m_dHeight + 10).toString() + "px";  // Typically 100 + 10 for images.
                    m_jRoot.css("height", strRowHeight);

                    // Allocate and inject DOM.
                    m_jSliderContainer = $("<div class='ScrollRegionSliderContainer' />");
                    var strSliderHeight = m_dHeight.toString() + "px";
                    m_jSlider = $("<div class='ScrollRegionSlider' style='height:" + strSliderHeight + "' />");
                    m_jLeft = $("<div class='ScrollRegionLeft'><span class='glyphicon glyphicon-chevron-left'></span></div>");
                    m_jRight = $("<div class='ScrollRegionRight'><span class='glyphicon glyphicon-chevron-right'></span></div>");

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
            self.addImage = function (  iBase,                  // All params are required.
                                        strId, 
                                        strName, 
                                        strDescription, 
                                        strResourceUrl, 
                                        strImageClass, 
                                        functionJItemCallBack,
                                        bInLoadLoop) 
            {

                try {

                    m_bInLoadLoop = bInLoadLoop;

                    // Build the item.
                    var jItem = $("<img data-ibase='" + iBase + "' title='" + quoteattr(strName) + "' style='position:absolute;z-index:9999;' id='" + 
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
                    m_jRoot.empty();

                    return self.finishCreating();

                } catch (e) {

                    return e;
                }
            };

            // If a new Image was just added, it may be overflow-hidden.
            self.functionMakeSureImageIsVisible = function(strSearchId) {

                try {

                    var iPxVisible = m_jSliderContainer.width();
                    var iNumVisible = Math.floor(iPxVisible / m_dWidth);

                    // Find index of image in m_arrayItems.
                    var index = -1;
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
            // The img has data-iBase to tell us where to position this, since we can come in in incorrect order due to asynchronicity.
            var m_functionOnNewImageLoaded = function () {

                try {

                    // Get reference to the item that raised the load.
                    var jItem = $(this);

                    // Get position calculation base.
                    var iBase = parseInt(jItem.context.attributes['data-ibase'].value, 10) % 10;

                    // Add to collection--but we want it in position iBase.
                    m_arrayItems.splice(iBase, 0, jItem);

                    var exceptionRet = m_functionCompleteImageAddUpdate(jItem, iBase);
                    if (exceptionRet) { throw exceptionRet; }

                    // Last, add to DOM, ...
                    m_jSlider.append(jItem);
                    // ...and make room in the slider if necessary. This is conditional, because we do things async so possibly out of order.
                    // So it would otherwise be possible to shrink the slider width after it got big.
                    var dSliderWidth = m_jSlider.width();
                    var dSliderNewWidth = (iBase + 1) * m_dWidth;
                    if (dSliderNewWidth > dSliderWidth) {

                        m_jSlider.width(dSliderNewWidth);
                    }
                    // ...and opt-in on the tooltip.
                    jItem.powerTip({
                        smartPlacement: true
                    });

                    // Make sure strip scrolls to show new image.
                    if (!m_bInLoadLoop) {

                        exceptionRet = m_functionAssureImageIsVisible(jItem[0].id);
                        if (exceptionRet) { throw exceptionRet; }
                    }
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

                            // Not sure if this applies in hor. scroll region like it does in vertical, but it should do no harm.
                            // User may have selected an image, scrolled it out of sight and then changed it.
                            // I want it to be seen in the strip.
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
                    if (dHeight > dWidth) {

                        // Position across whole height and center on width.
                        // Remove bottom. It might have been left over from a previous image that was centered vertically.
                        jItem.css("bottom", "");
                        jItem.css("top",
                            "0px");
                        jItem.css("height",
                            m_dHeight.toString() + "px");
                        var dItemWidth = m_dWidth * dWidth / dHeight;
                        jItem.css("width",
                            dItemWidth.toString() + "px");
                        var dWork = (iBase * m_dWidth + (m_dWidth - dItemWidth) / 2);
                        jItem.css("margin-left",
                            dWork.toString() + "px");
                    } else {

                        // Position across whole width and center on height.
                        // Remove top. It might have been left over from a previous image that was centered vertically.
                        jItem.css("top", "");
                        jItem.css("margin-left",
                            (iBase * m_dWidth).toString() + "px");
                        jItem.css("width",
                            m_dWidth.toString() + "px");
                        var dItemHeight = m_dHeight * dHeight / dWidth;
                        jItem.css("height",
                            dItemHeight.toString() + "px");
                        var dWork = ((m_dHeight - dItemHeight) / 2);
                        jItem.css("bottom",
                            dWork.toString() + "px");
                    }

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

                    errorHelper.show(e);
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

                    errorHelper.show(e);
                }
            };

            // jItem with id strSearchId may or may not be visible. If not, scroll to make sure it is.
            // This could involve scrolling left or right since it happens on new or updated image. 
            var m_functionAssureImageIsVisible = function(strSearchId) {

                try {

                    var iIndexOfFirstFullyVisibleItem = Math.ceil((-1 * parseFloat(m_jSlider.css("left"))) / m_dWidth);
                    var iNumFullyVisibleItems = Math.floor(m_jSliderContainer.width() / m_dWidth);
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

                    // Calculate left that displays iIndexOfStrSearchIdItem. It's guaranteed not visible now.

                    // There are 3 cases to check for:
                    // (1) If there are at least iNumFullyVisibleItems items beyond iIndexOfStrSearchIdItem, position to iIndexOfStrSearchIdItem.
                    // (2) If iIndexOfStrSearchIdItem is < iNumFullyVisibleItems, position to 0.
                    // (3) Otherwise, position to m_arrayItems.length - iNumFullyVisibleItems;

                    var iPositionToIndex = m_arrayItems.length - iNumFullyVisibleItems;     // Fall through case.
                    if (m_arrayItems.length - iIndexOfStrSearchIdItem >= iNumFullyVisibleItems) {

                        iPositionToIndex = iIndexOfStrSearchIdItem;
                    
                    } else if (iIndexOfStrSearchIdItem < iNumFullyVisibleItems) {

                        iPositionToIndex = 0;
                    }

                    var dNewLeft = 0 - (m_dWidth * iPositionToIndex);
                    m_jSlider.css("left", dNewLeft.toString() + "px");

                    return null;

                } catch(e) {

                    return e;
                }
            }

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

                    errorHelper.show(e);
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
                    m_cookieInterval = setInterval(m_functionScrollRight,
                        m_dScrollRefreshMS);

                    // Indicate in the DOM that the button is depressed.
                    m_jLeft.addClass("ScrollRegionButtonDown");
                } catch (e) {

                    errorHelper.show(e);
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

                    errorHelper.show(e);
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
                    m_cookieInterval = setInterval(m_functionScrollLeft,
                        m_dScrollRefreshMS);

                    // Indicate in the DOM that the button is depressed.
                    m_jRight.addClass("ScrollRegionButtonDown");

                } catch (e) {

                    errorHelper.show(e);
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

                    errorHelper.show(e);
                }
            };

            ///////////////////////////
            // Private fields.

            // Save the outer selector.
            var m_strRootElementSelector = null;
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
            // Collection of items.
            var m_arrayItems = [];
            // Width of item.
            var m_dWidth = 100;
            // Height of item.
            var m_dHeight = 88;
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
            // Used to prevent scrolling to right when loading an entire set images.
            var m_bInLoadLoop = false;
        };

        // Return constructor function.
        return functionRet;
    });
