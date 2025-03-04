/* @license MIT https://github.com/kenwheeler/slick/blob/master/LICENSE */
!function(a) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], a) : "undefined" != typeof exports ? module.exports = a(require("jquery")) : a(jQuery);
}(function(a) {
    "use strict";
    var b = window.Slick || {};
    b = function() {
        function c(c, d) {
            var f, e = this;
            e.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: a(c),
                appendDots: a(c),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function(b, c) {
                    return a('<button type="button" data-role="none" role="button" tabindex="0" />').text(c + 1);
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            },
            e.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            },
            a.extend(e, e.initials),
            e.activeBreakpoint = null,
            e.animType = null,
            e.animProp = null,
            e.breakpoints = [],
            e.breakpointSettings = [],
            e.cssTransitions = !1,
            e.focussed = !1,
            e.interrupted = !1,
            e.hidden = "hidden",
            e.paused = !0,
            e.positionProp = null,
            e.respondTo = null,
            e.rowCount = 1,
            e.shouldClick = !0,
            e.$slider = a(c),
            e.$slidesCache = null,
            e.transformType = null,
            e.transitionType = null,
            e.visibilityChange = "visibilitychange",
            e.windowWidth = 0,
            e.windowTimer = null,
            f = a(c).data("slick") || {},
            e.options = a.extend({}, e.defaults, d, f),
            e.currentSlide = e.options.initialSlide,
            e.originalSettings = e.options,
            "undefined" != typeof document.mozHidden ? (e.hidden = "mozHidden",
            e.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (e.hidden = "webkitHidden",
            e.visibilityChange = "webkitvisibilitychange"),
            e.autoPlay = a.proxy(e.autoPlay, e),
            e.autoPlayClear = a.proxy(e.autoPlayClear, e),
            e.autoPlayIterator = a.proxy(e.autoPlayIterator, e),
            e.changeSlide = a.proxy(e.changeSlide, e),
            e.clickHandler = a.proxy(e.clickHandler, e),
            e.selectHandler = a.proxy(e.selectHandler, e),
            e.setPosition = a.proxy(e.setPosition, e),
            e.swipeHandler = a.proxy(e.swipeHandler, e),
            e.dragHandler = a.proxy(e.dragHandler, e),
            e.keyHandler = a.proxy(e.keyHandler, e),
            e.instanceUid = b++,
            e.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/,
            e.registerBreakpoints(),
            e.init(!0);
        }
        var b = 0;
        return c;
    }(),
    b.prototype.activateADA = function() {
        var a = this;
        a.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        });
    }
    ,
    b.prototype.addSlide = b.prototype.slickAdd = function(b, c, d) {
        var e = this;
        if ("boolean" == typeof c)
            d = c,
            c = null;
        else {
            if (0 > c || c >= e.slideCount)
                return !1;
        }
        e.unload(),
        "number" == typeof c ? 0 === c && 0 === e.$slides.length ? a(b).appendTo(e.$slideTrack) : d ? a(b).insertBefore(e.$slides.eq(c)) : a(b).insertAfter(e.$slides.eq(c)) : d === !0 ? a(b).prependTo(e.$slideTrack) : a(b).appendTo(e.$slideTrack),
        e.$slides = e.$slideTrack.children(this.options.slide),
        e.$slideTrack.children(this.options.slide).detach(),
        e.$slideTrack.append(e.$slides),
        e.$slides.each(function(b, c) {
            a(c).attr("data-slick-index", b);
        }),
        e.$slidesCache = e.$slides,
        e.reinit();
    }
    ,
    b.prototype.animateHeight = function() {
        var a = this;
        if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) {
            var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
            a.$list.animate({
                height: b
            }, a.options.speed);
        }
    }
    ,
    b.prototype.animateSlide = function(b, c) {
        var d = {}
          , e = this;
        e.animateHeight(),
        e.options.rtl === !0 && e.options.vertical === !1 && (b = -b),
        e.transformsEnabled === !1 ? e.options.vertical === !1 ? e.$slideTrack.animate({
            left: b
        }, e.options.speed, e.options.easing, c) : e.$slideTrack.animate({
            top: b
        }, e.options.speed, e.options.easing, c) : e.cssTransitions === !1 ? (e.options.rtl === !0 && (e.currentLeft = -e.currentLeft),
        a({
            animStart: e.currentLeft
        }).animate({
            animStart: b
        }, {
            duration: e.options.speed,
            easing: e.options.easing,
            step: function(a) {
                a = Math.ceil(a),
                e.options.vertical === !1 ? (d[e.animType] = "translate(" + a + "px, 0px)",
                e.$slideTrack.css(d)) : (d[e.animType] = "translate(0px," + a + "px)",
                e.$slideTrack.css(d));
            },
            complete: function() {
                c && c.call();
            }
        })) : (e.applyTransition(),
        b = Math.ceil(b),
        e.options.vertical === !1 ? d[e.animType] = "translate3d(" + b + "px, 0px, 0px)" : d[e.animType] = "translate3d(0px," + b + "px, 0px)",
        e.$slideTrack.css(d),
        c && setTimeout(function() {
            e.disableTransition(),
            c.call();
        }, e.options.speed));
    }
    ,
    b.prototype.getNavTarget = function() {
        var b = this
          , c = b.options.asNavFor;
        return c && null !== c && (c = a(c).not(b.$slider)),
        c;
    }
    ,
    b.prototype.asNavFor = function(b) {
        var c = this
          , d = c.getNavTarget();
        null !== d && "object" == typeof d && d.each(function() {
            var c = a(this).slick("getSlick");
            c.unslicked || c.slideHandler(b, !0);
        });
    }
    ,
    b.prototype.applyTransition = function(a) {
        var b = this
          , c = {};
        b.options.fade === !1 ? c[b.transitionType] = b.transformType + " " + b.options.speed + "ms " + b.options.cssEase : c[b.transitionType] = "opacity " + b.options.speed + "ms " + b.options.cssEase,
        b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c);
    }
    ,
    b.prototype.autoPlay = function() {
        var a = this;
        a.autoPlayClear(),
        a.slideCount > a.options.slidesToShow && (a.autoPlayTimer = setInterval(a.autoPlayIterator, a.options.autoplaySpeed));
    }
    ,
    b.prototype.autoPlayClear = function() {
        var a = this;
        a.autoPlayTimer && clearInterval(a.autoPlayTimer);
    }
    ,
    b.prototype.autoPlayIterator = function() {
        var a = this
          , b = a.currentSlide + a.options.slidesToScroll;
        a.paused || a.interrupted || a.focussed || (a.options.infinite === !1 && (1 === a.direction && a.currentSlide + 1 === a.slideCount - 1 ? a.direction = 0 : 0 === a.direction && (b = a.currentSlide - a.options.slidesToScroll,
        a.currentSlide - 1 === 0 && (a.direction = 1))),
        a.slideHandler(b));
    }
    ,
    b.prototype.buildArrows = function() {
        var b = this;
        b.options.arrows === !0 && (b.$prevArrow = a(b.options.prevArrow).addClass("slick-arrow"),
        b.$nextArrow = a(b.options.nextArrow).addClass("slick-arrow"),
        b.slideCount > b.options.slidesToShow ? (b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.prependTo(b.options.appendArrows),
        b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.appendTo(b.options.appendArrows),
        b.options.infinite !== !0 && b.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }));
    }
    ,
    b.prototype.buildDots = function() {
        var c, d, b = this;
        if (b.options.dots === !0 && b.slideCount > b.options.slidesToShow) {
            for (b.$slider.addClass("slick-dotted"),
            d = a("<ul />").addClass(b.options.dotsClass),
            c = 0; c <= b.getDotCount(); c += 1)
                d.append(a("<li />").append(b.options.customPaging.call(this, b, c)));
            b.$dots = d.appendTo(b.options.appendDots),
            b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false");
        }
    }
    ,
    b.prototype.buildOut = function() {
        var b = this;
        b.$slides = b.$slider.children(b.options.slide + ":not(.slick-cloned)").addClass("slick-slide"),
        b.slideCount = b.$slides.length,
        b.$slides.each(function(b, c) {
            a(c).attr("data-slick-index", b).data("originalStyling", a(c).attr("style") || "");
        }),
        b.$slider.addClass("slick-slider"),
        b.$slideTrack = 0 === b.slideCount ? a('<div class="slick-track"/>').appendTo(b.$slider) : b.$slides.wrapAll('<div class="slick-track"/>').parent(),
        b.$list = b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),
        b.$slideTrack.css("opacity", 0),
        (b.options.centerMode === !0 || b.options.swipeToSlide === !0) && (b.options.slidesToScroll = 1),
        a("img[data-lazy]", b.$slider).not("[src]").addClass("slick-loading"),
        b.setupInfinite(),
        b.buildArrows(),
        b.buildDots(),
        b.updateDots(),
        b.setSlideClasses("number" == typeof b.currentSlide ? b.currentSlide : 0),
        b.options.draggable === !0 && b.$list.addClass("draggable");
    }
    ,
    b.prototype.buildRows = function() {
        var b, c, d, e, f, g, h, a = this;
        if (e = document.createDocumentFragment(),
        g = a.$slider.children(),
        a.options.rows > 1) {
            for (h = a.options.slidesPerRow * a.options.rows,
            f = Math.ceil(g.length / h),
            b = 0; f > b; b++) {
                var i = document.createElement("div");
                for (c = 0; c < a.options.rows; c++) {
                    var j = document.createElement("div");
                    for (d = 0; d < a.options.slidesPerRow; d++) {
                        var k = b * h + (c * a.options.slidesPerRow + d);
                        g.get(k) && j.appendChild(g.get(k));
                    }
                    i.appendChild(j);
                }
                e.appendChild(i);
            }
            a.$slider.empty().append(e),
            a.$slider.children().children().children().css({
                width: 100 / a.options.slidesPerRow + "%",
                display: "inline-block"
            });
        }
    }
    ,
    b.prototype.checkResponsive = function(b, c) {
        var e, f, g, d = this, h = !1, i = d.$slider.width(), j = window.innerWidth || a(window).width();
        if ("window" === d.respondTo ? g = j : "slider" === d.respondTo ? g = i : "min" === d.respondTo && (g = Math.min(j, i)),
        d.options.responsive && d.options.responsive.length && null !== d.options.responsive) {
            f = null;
            for (e in d.breakpoints)
                d.breakpoints.hasOwnProperty(e) && (d.originalSettings.mobileFirst === !1 ? g < d.breakpoints[e] && (f = d.breakpoints[e]) : g > d.breakpoints[e] && (f = d.breakpoints[e]));
            null !== f ? null !== d.activeBreakpoint ? (f !== d.activeBreakpoint || c) && (d.activeBreakpoint = f,
            "unslick" === d.breakpointSettings[f] ? d.unslick(f) : (d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f]),
            b === !0 && (d.currentSlide = d.options.initialSlide),
            d.refresh(b)),
            h = f) : (d.activeBreakpoint = f,
            "unslick" === d.breakpointSettings[f] ? d.unslick(f) : (d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f]),
            b === !0 && (d.currentSlide = d.options.initialSlide),
            d.refresh(b)),
            h = f) : null !== d.activeBreakpoint && (d.activeBreakpoint = null,
            d.options = d.originalSettings,
            b === !0 && (d.currentSlide = d.options.initialSlide),
            d.refresh(b),
            h = f),
            b || h === !1 || d.$slider.trigger("breakpoint", [d, h]);
        }
    }
    ,
    b.prototype.changeSlide = function(b, c) {
        var f, g, h, d = this, e = a(b.currentTarget);
        switch (e.is("a") && b.preventDefault(),
        e.is("li") || (e = e.closest("li")),
        h = d.slideCount % d.options.slidesToScroll !== 0,
        f = h ? 0 : (d.slideCount - d.currentSlide) % d.options.slidesToScroll,
        b.data.message) {
        case "previous":
            g = 0 === f ? d.options.slidesToScroll : d.options.slidesToShow - f,
            d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide - g, !1, c);
            break;
        case "next":
            g = 0 === f ? d.options.slidesToScroll : f,
            d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide + g, !1, c);
            break;
        case "index":
            var i = 0 === b.data.index ? 0 : b.data.index || e.index() * d.options.slidesToScroll;
            d.slideHandler(d.checkNavigable(i), !1, c),
            e.children().trigger("focus");
            break;
        default:
            return;
        }
    }
    ,
    b.prototype.checkNavigable = function(a) {
        var c, d, b = this;
        if (c = b.getNavigableIndexes(),
        d = 0,
        a > c[c.length - 1])
            a = c[c.length - 1];
        else
            for (var e in c) {
                if (a < c[e]) {
                    a = d;
                    break;
                }
                d = c[e];
            }
        return a;
    }
    ,
    b.prototype.cleanUpEvents = function() {
        var b = this;
        b.options.dots && null !== b.$dots && a("li", b.$dots).off("click.slick", b.changeSlide).off("mouseenter.slick", a.proxy(b.interrupt, b, !0)).off("mouseleave.slick", a.proxy(b.interrupt, b, !1)),
        b.$slider.off("focus.slick blur.slick"),
        b.options.arrows === !0 && b.slideCount > b.options.slidesToShow && (b.$prevArrow && b.$prevArrow.off("click.slick", b.changeSlide),
        b.$nextArrow && b.$nextArrow.off("click.slick", b.changeSlide)),
        b.$list.off("touchstart.slick mousedown.slick", b.swipeHandler),
        b.$list.off("touchmove.slick mousemove.slick", b.swipeHandler),
        b.$list.off("touchend.slick mouseup.slick", b.swipeHandler),
        b.$list.off("touchcancel.slick mouseleave.slick", b.swipeHandler),
        b.$list.off("click.slick", b.clickHandler),
        a(document).off(b.visibilityChange, b.visibility),
        b.cleanUpSlideEvents(),
        b.options.accessibility === !0 && b.$list.off("keydown.slick", b.keyHandler),
        b.options.focusOnSelect === !0 && a(b.$slideTrack).children().off("click.slick", b.selectHandler),
        a(window).off("orientationchange.slick.slick-" + b.instanceUid, b.orientationChange),
        a(window).off("resize.slick.slick-" + b.instanceUid, b.resize),
        a("[draggable!=true]", b.$slideTrack).off("dragstart", b.preventDefault),
        a(window).off("load.slick.slick-" + b.instanceUid, b.setPosition),
        a(document).off("ready.slick.slick-" + b.instanceUid, b.setPosition);
    }
    ,
    b.prototype.cleanUpSlideEvents = function() {
        var b = this;
        b.$list.off("mouseenter.slick", a.proxy(b.interrupt, b, !0)),
        b.$list.off("mouseleave.slick", a.proxy(b.interrupt, b, !1));
    }
    ,
    b.prototype.cleanUpRows = function() {
        var b, a = this;
        a.options.rows > 1 && (b = a.$slides.children().children(),
        b.removeAttr("style"),
        a.$slider.empty().append(b));
    }
    ,
    b.prototype.clickHandler = function(a) {
        var b = this;
        b.shouldClick === !1 && (a.stopImmediatePropagation(),
        a.stopPropagation(),
        a.preventDefault());
    }
    ,
    b.prototype.destroy = function(b) {
        var c = this;
        c.autoPlayClear(),
        c.touchObject = {},
        c.cleanUpEvents(),
        a(".slick-cloned", c.$slider).detach(),
        c.$dots && c.$dots.remove(),
        c.$prevArrow && c.$prevArrow.length && (c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        c.htmlExpr.test(c.options.prevArrow) && c.$prevArrow.remove()),
        c.$nextArrow && c.$nextArrow.length && (c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        c.htmlExpr.test(c.options.nextArrow) && c.$nextArrow.remove()),
        c.$slides && (c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
            a(this).attr("style", a(this).data("originalStyling"));
        }),
        c.$slideTrack.children(this.options.slide).detach(),
        c.$slideTrack.detach(),
        c.$list.detach(),
        c.$slider.append(c.$slides)),
        c.cleanUpRows(),
        c.$slider.removeClass("slick-slider"),
        c.$slider.removeClass("slick-initialized"),
        c.$slider.removeClass("slick-dotted"),
        c.unslicked = !0,
        b || c.$slider.trigger("destroy", [c]);
    }
    ,
    b.prototype.disableTransition = function(a) {
        var b = this
          , c = {};
        c[b.transitionType] = "",
        b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c);
    }
    ,
    b.prototype.fadeSlide = function(a, b) {
        var c = this;
        c.cssTransitions === !1 ? (c.$slides.eq(a).css({
            zIndex: c.options.zIndex
        }),
        c.$slides.eq(a).animate({
            opacity: 1
        }, c.options.speed, c.options.easing, b)) : (c.applyTransition(a),
        c.$slides.eq(a).css({
            opacity: 1,
            zIndex: c.options.zIndex
        }),
        b && setTimeout(function() {
            c.disableTransition(a),
            b.call();
        }, c.options.speed));
    }
    ,
    b.prototype.fadeSlideOut = function(a) {
        var b = this;
        b.cssTransitions === !1 ? b.$slides.eq(a).animate({
            opacity: 0,
            zIndex: b.options.zIndex - 2
        }, b.options.speed, b.options.easing) : (b.applyTransition(a),
        b.$slides.eq(a).css({
            opacity: 0,
            zIndex: b.options.zIndex - 2
        }));
    }
    ,
    b.prototype.filterSlides = b.prototype.slickFilter = function(a) {
        var b = this;
        null !== a && (b.$slidesCache = b.$slides,
        b.unload(),
        b.$slideTrack.children(this.options.slide).detach(),
        b.$slidesCache.filter(a).appendTo(b.$slideTrack),
        b.reinit());
    }
    ,
    b.prototype.focusHandler = function() {
        var b = this;
        b.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*:not(.slick-arrow)", function(c) {
            c.stopImmediatePropagation();
            var d = a(this);
            setTimeout(function() {
                b.options.pauseOnFocus && (b.focussed = d.is(":focus"),
                b.autoPlay());
            }, 0);
        });
    }
    ,
    b.prototype.getCurrent = b.prototype.slickCurrentSlide = function() {
        var a = this;
        return a.currentSlide;
    }
    ,
    b.prototype.getDotCount = function() {
        var a = this
          , b = 0
          , c = 0
          , d = 0;
        if (a.options.infinite === !0)
            for (; b < a.slideCount; )
                ++d,
                b = c + a.options.slidesToScroll,
                c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
        else if (a.options.centerMode === !0)
            d = a.slideCount;
        else if (a.options.asNavFor)
            for (; b < a.slideCount; )
                ++d,
                b = c + a.options.slidesToScroll,
                c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
        else
            d = 1 + Math.ceil((a.slideCount - a.options.slidesToShow) / a.options.slidesToScroll);
        return d - 1;
    }
    ,
    b.prototype.getLeft = function(a) {
        var c, d, f, b = this, e = 0;
        return b.slideOffset = 0,
        d = b.$slides.first().outerHeight(!0),
        b.options.infinite === !0 ? (b.slideCount > b.options.slidesToShow && (b.slideOffset = b.slideWidth * b.options.slidesToShow * -1,
        e = d * b.options.slidesToShow * -1),
        b.slideCount % b.options.slidesToScroll !== 0 && a + b.options.slidesToScroll > b.slideCount && b.slideCount > b.options.slidesToShow && (a > b.slideCount ? (b.slideOffset = (b.options.slidesToShow - (a - b.slideCount)) * b.slideWidth * -1,
        e = (b.options.slidesToShow - (a - b.slideCount)) * d * -1) : (b.slideOffset = b.slideCount % b.options.slidesToScroll * b.slideWidth * -1,
        e = b.slideCount % b.options.slidesToScroll * d * -1))) : a + b.options.slidesToShow > b.slideCount && (b.slideOffset = (a + b.options.slidesToShow - b.slideCount) * b.slideWidth,
        e = (a + b.options.slidesToShow - b.slideCount) * d),
        b.slideCount <= b.options.slidesToShow && (b.slideOffset = 0,
        e = 0),
        b.options.centerMode === !0 && b.options.infinite === !0 ? b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2) - b.slideWidth : b.options.centerMode === !0 && (b.slideOffset = 0,
        b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2)),
        c = b.options.vertical === !1 ? a * b.slideWidth * -1 + b.slideOffset : a * d * -1 + e,
        b.options.variableWidth === !0 && (f = b.slideCount <= b.options.slidesToShow || b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow),
        c = b.options.rtl === !0 ? f[0] ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width()) : 0 : f[0] ? -1 * f[0].offsetLeft : 0,
        b.options.centerMode === !0 && (f = b.slideCount <= b.options.slidesToShow || b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow + 1),
        c = b.options.rtl === !0 ? f[0] ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width()) : 0 : f[0] ? -1 * f[0].offsetLeft : 0,
        c += (b.$list.width() - f.outerWidth()) / 2)),
        c;
    }
    ,
    b.prototype.getOption = b.prototype.slickGetOption = function(a) {
        var b = this;
        return b.options[a];
    }
    ,
    b.prototype.getNavigableIndexes = function() {
        var e, a = this, b = 0, c = 0, d = [];
        for (a.options.infinite === !1 ? e = a.slideCount : (b = -1 * a.options.slidesToScroll,
        c = -1 * a.options.slidesToScroll,
        e = 2 * a.slideCount); e > b; )
            d.push(b),
            b = c + a.options.slidesToScroll,
            c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
        return d;
    }
    ,
    b.prototype.getSlick = function() {
        return this;
    }
    ,
    b.prototype.getSlideCount = function() {
        var c, d, e, b = this;
        return e = b.options.centerMode === !0 ? b.slideWidth * Math.floor(b.options.slidesToShow / 2) : 0,
        b.options.swipeToSlide === !0 ? (b.$slideTrack.find(".slick-slide").each(function(c, f) {
            return f.offsetLeft - e + a(f).outerWidth() / 2 > -1 * b.swipeLeft ? (d = f,
            !1) : void 0;
        }),
        c = Math.abs(a(d).attr("data-slick-index") - b.currentSlide) || 1) : b.options.slidesToScroll;
    }
    ,
    b.prototype.goTo = b.prototype.slickGoTo = function(a, b) {
        var c = this;
        c.changeSlide({
            data: {
                message: "index",
                index: parseInt(a)
            }
        }, b);
    }
    ,
    b.prototype.init = function(b) {
        var c = this;
        a(c.$slider).hasClass("slick-initialized") || (a(c.$slider).addClass("slick-initialized"),
        c.buildRows(),
        c.buildOut(),
        c.setProps(),
        c.startLoad(),
        c.loadSlider(),
        c.initializeEvents(),
        c.updateArrows(),
        c.updateDots(),
        c.checkResponsive(!0),
        c.focusHandler()),
        b && c.$slider.trigger("init", [c]),
        c.options.accessibility === !0 && c.initADA(),
        c.options.autoplay && (c.paused = !1,
        c.autoPlay());
    }
    ,
    b.prototype.initADA = function() {
        var b = this;
        b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        }),
        b.$slideTrack.attr("role", "listbox"),
        b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function(c) {
            a(this).attr({
                role: "option",
                "aria-describedby": "slick-slide" + b.instanceUid + c
            });
        }),
        null !== b.$dots && b.$dots.attr("role", "tablist").find("li").each(function(c) {
            a(this).attr({
                role: "presentation",
                "aria-selected": "false",
                "aria-controls": "navigation" + b.instanceUid + c,
                id: "slick-slide" + b.instanceUid + c
            });
        }).first().attr("aria-selected", "true").end().find("button").attr("role", "button").end().closest("div").attr("role", "toolbar"),
        b.activateADA();
    }
    ,
    b.prototype.initArrowEvents = function() {
        var a = this;
        a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.off("click.slick").on("click.slick", {
            message: "previous"
        }, a.changeSlide),
        a.$nextArrow.off("click.slick").on("click.slick", {
            message: "next"
        }, a.changeSlide));
    }
    ,
    b.prototype.initDotEvents = function() {
        var b = this;
        b.options.dots === !0 && b.slideCount > b.options.slidesToShow && a("li", b.$dots).on("click.slick", {
            message: "index"
        }, b.changeSlide),
        b.options.dots === !0 && b.options.pauseOnDotsHover === !0 && a("li", b.$dots).on("mouseenter.slick", a.proxy(b.interrupt, b, !0)).on("mouseleave.slick", a.proxy(b.interrupt, b, !1));
    }
    ,
    b.prototype.initSlideEvents = function() {
        var b = this;
        b.options.pauseOnHover && (b.$list.on("mouseenter.slick", a.proxy(b.interrupt, b, !0)),
        b.$list.on("mouseleave.slick", a.proxy(b.interrupt, b, !1)));
    }
    ,
    b.prototype.initializeEvents = function() {
        var b = this;
        b.initArrowEvents(),
        b.initDotEvents(),
        b.initSlideEvents(),
        b.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, b.swipeHandler),
        b.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, b.swipeHandler),
        b.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, b.swipeHandler),
        b.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, b.swipeHandler),
        b.$list.on("click.slick", b.clickHandler),
        a(document).on(b.visibilityChange, a.proxy(b.visibility, b)),
        b.options.accessibility === !0 && b.$list.on("keydown.slick", b.keyHandler),
        b.options.focusOnSelect === !0 && a(b.$slideTrack).children().on("click.slick", b.selectHandler),
        a(window).on("orientationchange.slick.slick-" + b.instanceUid, a.proxy(b.orientationChange, b)),
        a(window).on("resize.slick.slick-" + b.instanceUid, a.proxy(b.resize, b)),
        a("[draggable!=true]", b.$slideTrack).on("dragstart", b.preventDefault),
        a(window).on("load.slick.slick-" + b.instanceUid, b.setPosition),
        a(document).on("ready.slick.slick-" + b.instanceUid, b.setPosition);
    }
    ,
    b.prototype.initUI = function() {
        var a = this;
        a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.show(),
        a.$nextArrow.show()),
        a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.show();
    }
    ,
    b.prototype.keyHandler = function(a) {
        var b = this;
        a.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === a.keyCode && b.options.accessibility === !0 ? b.changeSlide({
            data: {
                message: b.options.rtl === !0 ? "next" : "previous"
            }
        }) : 39 === a.keyCode && b.options.accessibility === !0 && b.changeSlide({
            data: {
                message: b.options.rtl === !0 ? "previous" : "next"
            }
        }));
    }
    ,
    b.prototype.lazyLoad = function() {
        function g(c) {
            a("img[data-lazy]", c).each(function() {
                var c = a(this)
                  , d = a(this).attr("data-lazy")
                  , e = document.createElement("img");
                e.onload = function() {
                    c.animate({
                        opacity: 0
                    }, 100, function() {
                        c.attr("src", d).animate({
                            opacity: 1
                        }, 200, function() {
                            c.removeAttr("data-lazy").removeClass("slick-loading");
                        }),
                        b.$slider.trigger("lazyLoaded", [b, c, d]);
                    });
                }
                ,
                e.onerror = function() {
                    c.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                    b.$slider.trigger("lazyLoadError", [b, c, d]);
                }
                ,
                e.src = d;
            });
        }
        var c, d, e, f, b = this;
        b.options.centerMode === !0 ? b.options.infinite === !0 ? (e = b.currentSlide + (b.options.slidesToShow / 2 + 1),
        f = e + b.options.slidesToShow + 2) : (e = Math.max(0, b.currentSlide - (b.options.slidesToShow / 2 + 1)),
        f = 2 + (b.options.slidesToShow / 2 + 1) + b.currentSlide) : (e = b.options.infinite ? b.options.slidesToShow + b.currentSlide : b.currentSlide,
        f = Math.ceil(e + b.options.slidesToShow),
        b.options.fade === !0 && (e > 0 && e--,
        f <= b.slideCount && f++)),
        c = b.$slider.find(".slick-slide").slice(e, f),
        g(c),
        b.slideCount <= b.options.slidesToShow ? (d = b.$slider.find(".slick-slide"),
        g(d)) : b.currentSlide >= b.slideCount - b.options.slidesToShow ? (d = b.$slider.find(".slick-cloned").slice(0, b.options.slidesToShow),
        g(d)) : 0 === b.currentSlide && (d = b.$slider.find(".slick-cloned").slice(-1 * b.options.slidesToShow),
        g(d));
    }
    ,
    b.prototype.loadSlider = function() {
        var a = this;
        a.setPosition(),
        a.$slideTrack.css({
            opacity: 1
        }),
        a.$slider.removeClass("slick-loading"),
        a.initUI(),
        "progressive" === a.options.lazyLoad && a.progressiveLazyLoad();
    }
    ,
    b.prototype.next = b.prototype.slickNext = function() {
        var a = this;
        a.changeSlide({
            data: {
                message: "next"
            }
        });
    }
    ,
    b.prototype.orientationChange = function() {
        var a = this;
        a.checkResponsive(),
        a.setPosition();
    }
    ,
    b.prototype.pause = b.prototype.slickPause = function() {
        var a = this;
        a.autoPlayClear(),
        a.paused = !0;
    }
    ,
    b.prototype.play = b.prototype.slickPlay = function() {
        var a = this;
        a.autoPlay(),
        a.options.autoplay = !0,
        a.paused = !1,
        a.focussed = !1,
        a.interrupted = !1;
    }
    ,
    b.prototype.postSlide = function(a) {
        var b = this;
        b.unslicked || (b.$slider.trigger("afterChange", [b, a]),
        b.animating = !1,
        b.setPosition(),
        b.swipeLeft = null,
        b.options.autoplay && b.autoPlay(),
        b.options.accessibility === !0 && b.initADA());
    }
    ,
    b.prototype.prev = b.prototype.slickPrev = function() {
        var a = this;
        a.changeSlide({
            data: {
                message: "previous"
            }
        });
    }
    ,
    b.prototype.preventDefault = function(a) {
        a.preventDefault();
    }
    ,
    b.prototype.progressiveLazyLoad = function(b) {
        b = b || 1;
        var e, f, g, c = this, d = a("img[data-lazy]", c.$slider);
        d.length ? (e = d.first(),
        f = e.attr("data-lazy"),
        g = document.createElement("img"),
        g.onload = function() {
            e.attr("src", f).removeAttr("data-lazy").removeClass("slick-loading"),
            c.options.adaptiveHeight === !0 && c.setPosition(),
            c.$slider.trigger("lazyLoaded", [c, e, f]),
            c.progressiveLazyLoad();
        }
        ,
        g.onerror = function() {
            3 > b ? setTimeout(function() {
                c.progressiveLazyLoad(b + 1);
            }, 500) : (e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
            c.$slider.trigger("lazyLoadError", [c, e, f]),
            c.progressiveLazyLoad());
        }
        ,
        g.src = f) : c.$slider.trigger("allImagesLoaded", [c]);
    }
    ,
    b.prototype.refresh = function(b) {
        var d, e, c = this;
        e = c.slideCount - c.options.slidesToShow,
        !c.options.infinite && c.currentSlide > e && (c.currentSlide = e),
        c.slideCount <= c.options.slidesToShow && (c.currentSlide = 0),
        d = c.currentSlide,
        c.destroy(!0),
        a.extend(c, c.initials, {
            currentSlide: d
        }),
        c.init(),
        b || c.changeSlide({
            data: {
                message: "index",
                index: d
            }
        }, !1);
    }
    ,
    b.prototype.registerBreakpoints = function() {
        var c, d, e, b = this, f = b.options.responsive || null;
        if ("array" === a.type(f) && f.length) {
            b.respondTo = b.options.respondTo || "window";
            for (c in f)
                if (e = b.breakpoints.length - 1,
                d = f[c].breakpoint,
                f.hasOwnProperty(c)) {
                    for (; e >= 0; )
                        b.breakpoints[e] && b.breakpoints[e] === d && b.breakpoints.splice(e, 1),
                        e--;
                    b.breakpoints.push(d),
                    b.breakpointSettings[d] = f[c].settings;
                }
            b.breakpoints.sort(function(a, c) {
                return b.options.mobileFirst ? a - c : c - a;
            });
        }
    }
    ,
    b.prototype.reinit = function() {
        var b = this;
        b.$slides = b.$slideTrack.children(b.options.slide).addClass("slick-slide"),
        b.slideCount = b.$slides.length,
        b.currentSlide >= b.slideCount && 0 !== b.currentSlide && (b.currentSlide = b.currentSlide - b.options.slidesToScroll),
        b.slideCount <= b.options.slidesToShow && (b.currentSlide = 0),
        b.registerBreakpoints(),
        b.setProps(),
        b.setupInfinite(),
        b.buildArrows(),
        b.updateArrows(),
        b.initArrowEvents(),
        b.buildDots(),
        b.updateDots(),
        b.initDotEvents(),
        b.cleanUpSlideEvents(),
        b.initSlideEvents(),
        b.checkResponsive(!1, !0),
        b.options.focusOnSelect === !0 && a(b.$slideTrack).children().on("click.slick", b.selectHandler),
        b.setSlideClasses("number" == typeof b.currentSlide ? b.currentSlide : 0),
        b.setPosition(),
        b.focusHandler(),
        b.paused = !b.options.autoplay,
        b.autoPlay(),
        b.$slider.trigger("reInit", [b]);
    }
    ,
    b.prototype.resize = function() {
        var b = this;
        a(window).width() !== b.windowWidth && (clearTimeout(b.windowDelay),
        b.windowDelay = window.setTimeout(function() {
            b.windowWidth = a(window).width(),
            b.checkResponsive(),
            b.unslicked || b.setPosition();
        }, 50));
    }
    ,
    b.prototype.removeSlide = b.prototype.slickRemove = function(a, b, c) {
        var d = this;
        return "boolean" == typeof a ? (b = a,
        a = b === !0 ? 0 : d.slideCount - 1) : a = b === !0 ? --a : a,
        d.slideCount < 1 || 0 > a || a > d.slideCount - 1 ? !1 : (d.unload(),
        c === !0 ? d.$slideTrack.children().remove() : d.$slideTrack.children(this.options.slide).eq(a).remove(),
        d.$slides = d.$slideTrack.children(this.options.slide),
        d.$slideTrack.children(this.options.slide).detach(),
        d.$slideTrack.append(d.$slides),
        d.$slidesCache = d.$slides,
        void d.reinit());
    }
    ,
    b.prototype.setCSS = function(a) {
        var d, e, b = this, c = {};
        b.options.rtl === !0 && (a = -a),
        d = "left" == b.positionProp ? Math.ceil(a) + "px" : "0px",
        e = "top" == b.positionProp ? Math.ceil(a) + "px" : "0px",
        c[b.positionProp] = a,
        b.transformsEnabled === !1 ? b.$slideTrack.css(c) : (c = {},
        b.cssTransitions === !1 ? (c[b.animType] = "translate(" + d + ", " + e + ")",
        b.$slideTrack.css(c)) : (c[b.animType] = "translate3d(" + d + ", " + e + ", 0px)",
        b.$slideTrack.css(c)));
    }
    ,
    b.prototype.setDimensions = function() {
        var a = this;
        a.options.vertical === !1 ? a.options.centerMode === !0 && a.$list.css({
            padding: "0px " + a.options.centerPadding
        }) : (a.$list.height(a.$slides.first().outerHeight(!0) * a.options.slidesToShow),
        a.options.centerMode === !0 && a.$list.css({
            padding: a.options.centerPadding + " 0px"
        })),
        a.listWidth = a.$list.width(),
        a.listHeight = a.$list.height(),
        a.options.vertical === !1 && a.options.variableWidth === !1 ? (a.slideWidth = Math.ceil(a.listWidth / a.options.slidesToShow),
        a.$slideTrack.width(Math.ceil(a.slideWidth * a.$slideTrack.children(".slick-slide").length))) : a.options.variableWidth === !0 ? a.$slideTrack.width(5e3 * a.slideCount) : (a.slideWidth = Math.ceil(a.listWidth),
        a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0) * a.$slideTrack.children(".slick-slide").length)));
        var b = a.$slides.first().outerWidth(!0) - a.$slides.first().width();
        a.options.variableWidth === !1 && a.$slideTrack.children(".slick-slide").width(a.slideWidth - b);
    }
    ,
    b.prototype.setFade = function() {
        var c, b = this;
        b.$slides.each(function(d, e) {
            c = b.slideWidth * d * -1,
            b.options.rtl === !0 ? a(e).css({
                position: "relative",
                right: c,
                top: 0,
                zIndex: b.options.zIndex - 2,
                opacity: 0
            }) : a(e).css({
                position: "relative",
                left: c,
                top: 0,
                zIndex: b.options.zIndex - 2,
                opacity: 0
            });
        }),
        b.$slides.eq(b.currentSlide).css({
            zIndex: b.options.zIndex - 1,
            opacity: 1
        });
    }
    ,
    b.prototype.setHeight = function() {
        var a = this;
        if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) {
            var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
            a.$list.css("height", b);
        }
    }
    ,
    b.prototype.setOption = b.prototype.slickSetOption = function() {
        var c, d, e, f, h, b = this, g = !1;
        if ("object" === a.type(arguments[0]) ? (e = arguments[0],
        g = arguments[1],
        h = "multiple") : "string" === a.type(arguments[0]) && (e = arguments[0],
        f = arguments[1],
        g = arguments[2],
        "responsive" === arguments[0] && "array" === a.type(arguments[1]) ? h = "responsive" : "undefined" != typeof arguments[1] && (h = "single")),
        "single" === h)
            b.options[e] = f;
        else if ("multiple" === h)
            a.each(e, function(a, c) {
                b.options[a] = c;
            });
        else {
            if ("responsive" === h)
                for (d in f)
                    if ("array" !== a.type(b.options.responsive))
                        b.options.responsive = [f[d]];
                    else {
                        for (c = b.options.responsive.length - 1; c >= 0; )
                            b.options.responsive[c].breakpoint === f[d].breakpoint && b.options.responsive.splice(c, 1),
                            c--;
                        b.options.responsive.push(f[d]);
                    }
        }
        g && (b.unload(),
        b.reinit());
    }
    ,
    b.prototype.setPosition = function() {
        var a = this;
        a.setDimensions(),
        a.setHeight(),
        a.options.fade === !1 ? a.setCSS(a.getLeft(a.currentSlide)) : a.setFade(),
        a.$slider.trigger("setPosition", [a]);
    }
    ,
    b.prototype.setProps = function() {
        var a = this
          , b = document.body.style;
        a.positionProp = a.options.vertical === !0 ? "top" : "left",
        "top" === a.positionProp ? a.$slider.addClass("slick-vertical") : a.$slider.removeClass("slick-vertical"),
        (void 0 !== b.WebkitTransition || void 0 !== b.MozTransition || void 0 !== b.msTransition) && a.options.useCSS === !0 && (a.cssTransitions = !0),
        a.options.fade && ("number" == typeof a.options.zIndex ? a.options.zIndex < 3 && (a.options.zIndex = 3) : a.options.zIndex = a.defaults.zIndex),
        void 0 !== b.OTransform && (a.animType = "OTransform",
        a.transformType = "-o-transform",
        a.transitionType = "OTransition",
        void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)),
        void 0 !== b.MozTransform && (a.animType = "MozTransform",
        a.transformType = "-moz-transform",
        a.transitionType = "MozTransition",
        void 0 === b.perspectiveProperty && void 0 === b.MozPerspective && (a.animType = !1)),
        void 0 !== b.webkitTransform && (a.animType = "webkitTransform",
        a.transformType = "-webkit-transform",
        a.transitionType = "webkitTransition",
        void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)),
        void 0 !== b.msTransform && (a.animType = "msTransform",
        a.transformType = "-ms-transform",
        a.transitionType = "msTransition",
        void 0 === b.msTransform && (a.animType = !1)),
        void 0 !== b.transform && a.animType !== !1 && (a.animType = "transform",
        a.transformType = "transform",
        a.transitionType = "transition"),
        a.transformsEnabled = a.options.useTransform && null !== a.animType && a.animType !== !1;
    }
    ,
    b.prototype.setSlideClasses = function(a) {
        var c, d, e, f, b = this;
        d = b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"),
        b.$slides.eq(a).addClass("slick-current"),
        b.options.centerMode === !0 ? (c = Math.floor(b.options.slidesToShow / 2),
        b.options.infinite === !0 && (a >= c && a <= b.slideCount - 1 - c ? b.$slides.slice(a - c, a + c + 1).addClass("slick-active").attr("aria-hidden", "false") : (e = b.options.slidesToShow + a,
        d.slice(e - c + 1, e + c + 2).addClass("slick-active").attr("aria-hidden", "false")),
        0 === a ? d.eq(d.length - 1 - b.options.slidesToShow).addClass("slick-center") : a === b.slideCount - 1 && d.eq(b.options.slidesToShow).addClass("slick-center")),
        b.$slides.eq(a).addClass("slick-center")) : a >= 0 && a <= b.slideCount - b.options.slidesToShow ? b.$slides.slice(a, a + b.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : d.length <= b.options.slidesToShow ? d.addClass("slick-active").attr("aria-hidden", "false") : (f = b.slideCount % b.options.slidesToShow,
        e = b.options.infinite === !0 ? b.options.slidesToShow + a : a,
        b.options.slidesToShow == b.options.slidesToScroll && b.slideCount - a < b.options.slidesToShow ? d.slice(e - (b.options.slidesToShow - f), e + f).addClass("slick-active").attr("aria-hidden", "false") : d.slice(e, e + b.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")),
        "ondemand" === b.options.lazyLoad && b.lazyLoad();
    }
    ,
    b.prototype.setupInfinite = function() {
        var c, d, e, b = this;
        if (b.options.fade === !0 && (b.options.centerMode = !1),
        b.options.infinite === !0 && b.options.fade === !1 && (d = null,
        b.slideCount > b.options.slidesToShow)) {
            for (e = b.options.centerMode === !0 ? b.options.slidesToShow + 1 : b.options.slidesToShow,
            c = b.slideCount; c > b.slideCount - e; c -= 1)
                d = c - 1,
                a(b.$slides[d]).clone(!0).attr("id", "").attr("data-slick-index", d - b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");
            for (c = 0; e > c; c += 1)
                d = c,
                a(b.$slides[d]).clone(!0).attr("id", "").attr("data-slick-index", d + b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");
            b.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                a(this).attr("id", "");
            });
        }
    }
    ,
    b.prototype.interrupt = function(a) {
        var b = this;
        a || b.autoPlay(),
        b.interrupted = a;
    }
    ,
    b.prototype.selectHandler = function(b) {
        var c = this
          , d = a(b.target).is(".slick-slide") ? a(b.target) : a(b.target).parents(".slick-slide")
          , e = parseInt(d.attr("data-slick-index"));
        return e || (e = 0),
        c.slideCount <= c.options.slidesToShow ? (c.setSlideClasses(e),
        void c.asNavFor(e)) : void c.slideHandler(e);
    }
    ,
    b.prototype.slideHandler = function(a, b, c) {
        var d, e, f, g, j, h = null, i = this;
        return b = b || !1,
        i.animating === !0 && i.options.waitForAnimate === !0 || i.options.fade === !0 && i.currentSlide === a || i.slideCount <= i.options.slidesToShow ? void 0 : (b === !1 && i.asNavFor(a),
        d = a,
        h = i.getLeft(d),
        g = i.getLeft(i.currentSlide),
        i.currentLeft = null === i.swipeLeft ? g : i.swipeLeft,
        i.options.infinite === !1 && i.options.centerMode === !1 && (0 > a || a > i.getDotCount() * i.options.slidesToScroll) ? void (i.options.fade === !1 && (d = i.currentSlide,
        c !== !0 ? i.animateSlide(g, function() {
            i.postSlide(d);
        }) : i.postSlide(d))) : i.options.infinite === !1 && i.options.centerMode === !0 && (0 > a || a > i.slideCount - i.options.slidesToScroll) ? void (i.options.fade === !1 && (d = i.currentSlide,
        c !== !0 ? i.animateSlide(g, function() {
            i.postSlide(d);
        }) : i.postSlide(d))) : (i.options.autoplay && clearInterval(i.autoPlayTimer),
        e = 0 > d ? i.slideCount % i.options.slidesToScroll !== 0 ? i.slideCount - i.slideCount % i.options.slidesToScroll : i.slideCount + d : d >= i.slideCount ? i.slideCount % i.options.slidesToScroll !== 0 ? 0 : d - i.slideCount : d,
        i.animating = !0,
        i.$slider.trigger("beforeChange", [i, i.currentSlide, e]),
        f = i.currentSlide,
        i.currentSlide = e,
        i.setSlideClasses(i.currentSlide),
        i.options.asNavFor && (j = i.getNavTarget(),
        j = j.slick("getSlick"),
        j.slideCount <= j.options.slidesToShow && j.setSlideClasses(i.currentSlide)),
        i.updateDots(),
        i.updateArrows(),
        i.options.fade === !0 ? (c !== !0 ? (i.fadeSlideOut(f),
        i.fadeSlide(e, function() {
            i.postSlide(e);
        })) : i.postSlide(e),
        void i.animateHeight()) : void (c !== !0 ? i.animateSlide(h, function() {
            i.postSlide(e);
        }) : i.postSlide(e))));
    }
    ,
    b.prototype.startLoad = function() {
        var a = this;
        a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.hide(),
        a.$nextArrow.hide()),
        a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.hide(),
        a.$slider.addClass("slick-loading");
    }
    ,
    b.prototype.swipeDirection = function() {
        var a, b, c, d, e = this;
        return a = e.touchObject.startX - e.touchObject.curX,
        b = e.touchObject.startY - e.touchObject.curY,
        c = Math.atan2(b, a),
        d = Math.round(180 * c / Math.PI),
        0 > d && (d = 360 - Math.abs(d)),
        45 >= d && d >= 0 ? e.options.rtl === !1 ? "left" : "right" : 360 >= d && d >= 315 ? e.options.rtl === !1 ? "left" : "right" : d >= 135 && 225 >= d ? e.options.rtl === !1 ? "right" : "left" : e.options.verticalSwiping === !0 ? d >= 35 && 135 >= d ? "down" : "up" : "vertical";
    }
    ,
    b.prototype.swipeEnd = function(a) {
        var c, d, b = this;
        if (b.dragging = !1,
        b.interrupted = !1,
        b.shouldClick = b.touchObject.swipeLength > 10 ? !1 : !0,
        void 0 === b.touchObject.curX)
            return !1;
        if (b.touchObject.edgeHit === !0 && b.$slider.trigger("edge", [b, b.swipeDirection()]),
        b.touchObject.swipeLength >= b.touchObject.minSwipe) {
            switch (d = b.swipeDirection()) {
            case "left":
            case "down":
                c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide + b.getSlideCount()) : b.currentSlide + b.getSlideCount(),
                b.currentDirection = 0;
                break;
            case "right":
            case "up":
                c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide - b.getSlideCount()) : b.currentSlide - b.getSlideCount(),
                b.currentDirection = 1;
            }
            "vertical" != d && (b.slideHandler(c),
            b.touchObject = {},
            b.$slider.trigger("swipe", [b, d]));
        } else
            b.touchObject.startX !== b.touchObject.curX && (b.slideHandler(b.currentSlide),
            b.touchObject = {});
    }
    ,
    b.prototype.swipeHandler = function(a) {
        var b = this;
        if (!(b.options.swipe === !1 || "ontouchend"in document && b.options.swipe === !1 || b.options.draggable === !1 && -1 !== a.type.indexOf("mouse")))
            switch (b.touchObject.fingerCount = a.originalEvent && void 0 !== a.originalEvent.touches ? a.originalEvent.touches.length : 1,
            b.touchObject.minSwipe = b.listWidth / b.options.touchThreshold,
            b.options.verticalSwiping === !0 && (b.touchObject.minSwipe = b.listHeight / b.options.touchThreshold),
            a.data.action) {
            case "start":
                b.swipeStart(a);
                break;
            case "move":
                b.swipeMove(a);
                break;
            case "end":
                b.swipeEnd(a);
            }
    }
    ,
    b.prototype.swipeMove = function(a) {
        var d, e, f, g, h, b = this;
        return h = void 0 !== a.originalEvent ? a.originalEvent.touches : null,
        !b.dragging || h && 1 !== h.length ? !1 : (d = b.getLeft(b.currentSlide),
        b.touchObject.curX = void 0 !== h ? h[0].pageX : a.clientX,
        b.touchObject.curY = void 0 !== h ? h[0].pageY : a.clientY,
        b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curX - b.touchObject.startX, 2))),
        b.options.verticalSwiping === !0 && (b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curY - b.touchObject.startY, 2)))),
        e = b.swipeDirection(),
        "vertical" !== e ? (void 0 !== a.originalEvent && b.touchObject.swipeLength > 4 && a.preventDefault(),
        g = (b.options.rtl === !1 ? 1 : -1) * (b.touchObject.curX > b.touchObject.startX ? 1 : -1),
        b.options.verticalSwiping === !0 && (g = b.touchObject.curY > b.touchObject.startY ? 1 : -1),
        f = b.touchObject.swipeLength,
        b.touchObject.edgeHit = !1,
        b.options.infinite === !1 && (0 === b.currentSlide && "right" === e || b.currentSlide >= b.getDotCount() && "left" === e) && (f = b.touchObject.swipeLength * b.options.edgeFriction,
        b.touchObject.edgeHit = !0),
        b.options.vertical === !1 ? b.swipeLeft = d + f * g : b.swipeLeft = d + f * (b.$list.height() / b.listWidth) * g,
        b.options.verticalSwiping === !0 && (b.swipeLeft = d + f * g),
        b.options.fade === !0 || b.options.touchMove === !1 ? !1 : b.animating === !0 ? (b.swipeLeft = null,
        !1) : void b.setCSS(b.swipeLeft)) : void 0);
    }
    ,
    b.prototype.swipeStart = function(a) {
        var c, b = this;
        return b.interrupted = !0,
        1 !== b.touchObject.fingerCount || b.slideCount <= b.options.slidesToShow ? (b.touchObject = {},
        !1) : (void 0 !== a.originalEvent && void 0 !== a.originalEvent.touches && (c = a.originalEvent.touches[0]),
        b.touchObject.startX = b.touchObject.curX = void 0 !== c ? c.pageX : a.clientX,
        b.touchObject.startY = b.touchObject.curY = void 0 !== c ? c.pageY : a.clientY,
        void (b.dragging = !0));
    }
    ,
    b.prototype.unfilterSlides = b.prototype.slickUnfilter = function() {
        var a = this;
        null !== a.$slidesCache && (a.unload(),
        a.$slideTrack.children(this.options.slide).detach(),
        a.$slidesCache.appendTo(a.$slideTrack),
        a.reinit());
    }
    ,
    b.prototype.unload = function() {
        var b = this;
        a(".slick-cloned", b.$slider).remove(),
        b.$dots && b.$dots.remove(),
        b.$prevArrow && b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.remove(),
        b.$nextArrow && b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.remove(),
        b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "");
    }
    ,
    b.prototype.unslick = function(a) {
        var b = this;
        b.$slider.trigger("unslick", [b, a]),
        b.destroy();
    }
    ,
    b.prototype.updateArrows = function() {
        var b, a = this;
        b = Math.floor(a.options.slidesToShow / 2),
        a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && !a.options.infinite && (a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        0 === a.currentSlide ? (a.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : a.currentSlide >= a.slideCount - a.options.slidesToShow && a.options.centerMode === !1 ? (a.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : a.currentSlide >= a.slideCount - 1 && a.options.centerMode === !0 && (a.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")));
    }
    ,
    b.prototype.updateDots = function() {
        var a = this;
        null !== a.$dots && (a.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"),
        a.$dots.find("li").eq(Math.floor(a.currentSlide / a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden", "false"));
    }
    ,
    b.prototype.visibility = function() {
        var a = this;
        a.options.autoplay && (document[a.hidden] ? a.interrupted = !0 : a.interrupted = !1);
    }
    ,
    a.fn.slick = function() {
        var f, g, a = this, c = arguments[0], d = Array.prototype.slice.call(arguments, 1), e = a.length;
        for (f = 0; e > f; f++)
            if ("object" == typeof c || "undefined" == typeof c ? a[f].slick = new b(a[f],c) : g = a[f].slick[c].apply(a[f].slick, d),
            "undefined" != typeof g)
                return g;
        return a;
    }
    ;
});
;/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/base/io/bio.media.min.js. */
!function(t, e) {
    "use strict";
    var a = "BioMedia"
      , n = t.dBlazy
      , r = t.Bio;
    "function" == typeof define && define.amd ? define([a, n, r], e) : "object" == typeof exports ? module.exports = e(a, n, r) : t[a] = e(a, n, r)
}(this, function(a, l, n) {
    "use strict";
    var r, i, o = document, t = "data-", p = "src", f = "srcset", m = t + p, s = t + "b-html", h = [f, p], g = 0, c = !1, b = l.multimedia || !1;
    function e(t) {
        var e = n.apply(l.extend({}, i, l.extend({}, r, this)), arguments);
        return e.name = a,
        e
    }
    function A(t, e) {
        var a, n;
        l.isHtml(t) && l.hasAttr(t, s) && (n = !1,
        (a = l.attr(t, s)) && (n = !0,
        a = a.replace("data:text/plain;base64,", ""),
        a = atob(a),
        l.append(t, a),
        l.removeAttr(t, s)),
        g = l.status(t, n, e))
    }
    function v(t, e, a, n) {
        return c || (u(t, "defer", function(t) {
            l.attr(t, "loading", "lazy")
        }),
        c = !0),
        l.status(e, a, n)
    }
    function u(t, e, a) {
        t = t.options;
        if (!l.isNativeLazy)
            return 1;
        e = e || "a";
        e = l.selector(t, '[data-src][loading*="' + e + '"]:not(.b-blur)'),
        e = l.findAll(o, e);
        return e.length && l.each(e, function(t) {
            l.mapAttr(t, ["srcset", "src"], !0),
            l.mapSource(t, !1, !0, !1),
            l.isFun(a) && a(t)
        }),
        e
    }
    return i = Bio.prototype,
    (r = e.prototype = Object.create(i)).constructor = e,
    r.lazyLoad = function(t, e) {
        var a = this
          , n = a.options
          , r = t.parentNode
          , i = l.isBg(t)
          , o = l.equal(r, "picture")
          , s = l.equal(t, "img")
          , c = l.equal(t, "audio")
          , u = l.equal(t, "video")
          , d = l.hasAttr(t, m);
        o ? (d && (l.mapSource(t, f, !0),
        l.mapAttr(t, p, !0)),
        g = v(a, t, !0, n)) : u || c ? (l.isBg(r) && a.loadImage(r, !0, e),
        u = t,
        c = !0,
        r = n,
        l.mapSource(u, p, !0),
        u.load(),
        b && b.init(u),
        g = l.status(u, c, r)) : s || i ? (a.loadImage(t, i, e),
        i && l.isHtml(t) && A(t, n)) : l.hasAttr(t, p) ? (l.attr(t, m) && l.mapAttr(t, p, !0),
        g = v(a, t, !0, n)) : A(t, n),
        a.erCount = g
    }
    ,
    r.loadImage = function(t, a, n) {
        function e(t, e) {
            g = a && l.isFun(l.bg) ? (l.bg(t, n),
            l.status(t, e, i)) : v(r, t, e, i)
        }
        var r = this
          , i = r.options
          , o = new Image
          , s = l.hasAttr(t, f)
          , c = l.hasAttr(t, m)
          , u = c ? m : p
          , d = c ? "data-srcset" : f;
        "decode"in o && (o.decoding = "async"),
        a && l.isFun(l.bgUrl) ? o.src = l.bgUrl(t, n) : (c && l.mapAttr(t, h, !1),
        o.src = l.attr(t, u)),
        s && (o.srcset = l.attr(t, d)),
        l.decode(o).then(function() {
            e(t, !0)
        }).catch(function() {
            e(t, s),
            s || (t.bhit = !1)
        })
    }
    ,
    r.resizing = function(t, e) {
        var a = l.isBg(t, this.options);
        a && this.loadImage(t, a, e)
    }
    ,
    r.prepare = function() {
        var e, t, a;
        u(this),
        l.webp && (e = this,
        l.webp.isSupported() || (t = function(t) {
            return t = t || "",
            l.selector(e.options, "[" + t + 'srcset*=".webp"]')
        }
        ,
        (a = l.findAll(o, t())).length || (a = l.findAll(o, t("data-"))),
        a.length && l.webp.run(a)))
    }
    ,
    e
});

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/base/io/bio.media.min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/base/blazy.drupal.min.js. */
!function(r, e, t, l, a) {
    "use strict";
    var s = "data"
      , o = ".b-blur"
      , u = ".media"
      , i = "successClass"
      , c = (n = "blazy") + ".done"
      , n = function() {}
      , d = {};
    e.blazy = {
        context: a,
        name: "Drupal.blazy",
        init: null,
        instances: [],
        resizeTick: 0,
        resizeTrigger: !1,
        blazySettings: t.blazy || {},
        ioSettings: t.blazyIo || {},
        options: {},
        clearCompat: n,
        clearScript: n,
        checkResize: n,
        resizing: n,
        revalidate: n,
        isIo: function() {
            return !0
        },
        isBlazy: function() {
            return !r.isIo && "Blazy"in l
        },
        isFluid: function(t, n) {
            return r.equal(t.parentNode, "picture") && r.hasAttr(n, "data-b-ratios data-ratios")
        },
        isLoaded: function(t) {
            return r.hasClass(t, this.options[i])
        },
        globals: function() {
            var t = this
              , n = {
                isMedia: !0,
                success: t.clearing.bind(t),
                error: t.clearing.bind(t),
                resizing: t.resizing.bind(t),
                selector: ".b-lazy",
                parent: u,
                errorClass: "b-error",
                successClass: "b-loaded"
            };
            return r.extend(t.blazySettings, t.ioSettings, n)
        },
        extend: function(t) {
            d = r.extend({}, d, t)
        },
        merge: function(t) {
            var n = this;
            return n.options = r.extend({}, n.globals(), n.options, t || {}),
            n.options
        },
        run: function(t) {
            return new BioMedia(t)
        },
        mount: function(t) {
            var n = this;
            return n.merge(),
            t && r.each(d, function(t) {
                r.isFun(t) && t.call(n)
            }),
            r.extend(n, d)
        },
        selector: function(t) {
            t = t || "";
            var n = this.options;
            return n.selector + t + ":not(." + n[i] + ")"
        },
        clearing: function(t) {
            var n = this
              , i = r.hasClass(t, "b-responsive") && r.hasAttr(t, s + "-pfsrc");
            l.picturefill && i && l.picturefill({
                reevaluate: !0,
                elements: [t]
            }),
            l.setTimeout(function() {
                r.isHtml(t) && e.attachBehaviors(t),
                r.isFun(r.unloading) && r.unloading(t)
            }, 300),
            n.clearCompat(t),
            n.clearScript(t),
            r.trigger(t, c + " blazy:done", {
                options: n.options,
                warning: e.t("blazy.done is deprecated in 2.17, use with colon blazy:done to allow namespacing instead.")
            })
        },
        windowData: function() {
            return this.init ? this.init.windowData() : {}
        },
        load: function(n) {
            var i = this;
            l.setTimeout(function() {
                var t = r.findAll(n || a, i.selector());
                t.length && r.each(t, i.update.bind(i))
            }, 100)
        },
        update: function(t, n, i) {
            function e() {
                r.hasAttr(t, "data-b-bg") && r.isFun(r.bg) ? r.bg(t, i || a.windowData()) : a.init && (r.hasClass(t, o.substring(1)) || (t = r.find(t, o) || t),
                a.init.load(t, !0, s))
            }
            var a = this
              , s = a.options
              , o = s.selector;
            (n = n || !1) ? l.setTimeout(e, 100) : e()
        },
        rebind: function(t, i, e) {
            var n = r.findAll(t, this.options.selector + ":not(" + o + ")")
              , a = n.length;
            a || (n = r.findAll(t, "img:not(" + o + ")")),
            n.length && r.each(n, function(t) {
                var n = a ? c : "load";
                r.one(t, n, i, a),
                e && e.observe(t)
            })
        },
        pad: function(n, i, t) {
            var e = this
              , a = r.closest(n, u) || n;
            setTimeout(function() {
                var t = Math.round(n.naturalHeight / n.naturalWidth * 100, 2);
                e.isFluid(n, a) && (a.style.paddingBottom = t + "%"),
                r.isFun(i) && i.call(e, n, a, t)
            }, t || 0)
        }
    }
}(dBlazy, Drupal, drupalSettings, this, this.document);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/base/blazy.drupal.min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/blazy.load.min.js. */
!function(s, e, n) {
    "use strict";
    var c = "blazy"
      , i = c
      , d = "is-" + c
      , r = ".blazy:not(." + d + ")"
      , o = "body"
      , l = "b-root"
      , t = "b-checked"
      , u = "image"
      , b = "#drupal-modal, .is-b-scroll"
      , f = {};
    function h(a, t, e) {
        var n, i = this, r = 1 < i.resizeTick, o = i.instances;
        o.length && r && (n = function(a) {
            a.dblazy && a.dbuniform && (a.dblazy !== t.dblazy || a.dbpicture || (s.trigger(a, c + ":uniform" + a.dblazy, {
                pad: e
            }),
            a.dbpicture = !0))
        }
        ,
        s.each(o, function(a) {
            s.debounce(n, a, i)
        }, i))
    }
    e.blazy = s.extend(e.blazy || {}, {
        clearScript: function(a) {
            s.hasClass(a, f.errorClass) && !s.hasClass(a, t) && (s.addClass(a, t),
            this.update(a, !0)),
            this.pad(a, h)
        },
        fixDataUri: function() {
            var a = s.findAll(n, this.selector('[src^="image"]'));
            a.length && s.each(a, function(a) {
                var t = s.attr(a, "src");
                s.contains(t, ["base64", "svg+xml"]) && s.attr(a, "src", t.replace(u, "data:" + u))
            })
        }
    }),
    e.behaviors.blazy = {
        attach: function(a) {
            var t = e.blazy;
            t.context = s.context(a),
            s.once(function(a) {
                var t = this
                  , e = s.parse(s.attr(a, "data-" + c))
                  , n = s.hasClass(a, c + "--field b-grid " + c + "--uniform")
                  , i = (1e4 * Math.random()).toFixed(0)
                  , r = c + ":uniform" + i
                  , o = s.findAll(a, ".media--ratio");
                f = t.merge(e),
                t.revalidate = t.revalidate || s.hasClass(a, c + "--revalidate"),
                a.dblazy = i,
                a.dbuniform = n,
                t.instances.push(a),
                n && o.length && s.on(a, r, function(a) {
                    var t = a.detail.pad || 0;
                    10 < t && s.each(o, function(a) {
                        a.style.paddingBottom = t + "%"
                    })
                }),
                s.addClass(a, d)
            }
            .bind(t), i, r, a),
            s.once(function(a) {
                var t = this
                  , e = {
                    mobileFirst: !1
                };
                n.documentElement.isSameNode(a) || (e.root = a);
                a = (e = t.merge(e)).container;
                a && !s.contains(b, a) && (b += ", " + a.trim()),
                e.container = b,
                f = t.merge(e),
                t.fixDataUri(),
                t.init = t.run(t.options)
            }
            .bind(t), l, o, a)
        },
        detach: function(a, t, e) {
            "unload" === e && (s.once.removeSafely(i, r, a),
            s.once.removeSafely(l, o, a))
        }
    }
}(dBlazy, Drupal, (drupalSettings,
this.document));

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/blazy.load.min.js. */
;/* @license MIT https://raw.githubusercontent.com/focus-trap/tabbable/v6.1.2/LICENSE */
/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/tabbable/index.umd.min.js. */
/*!
* tabbable 6.1.2
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
!function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : (t = "undefined" != typeof globalThis ? globalThis : t || self,
    function() {
        var n = t.tabbable
          , o = t.tabbable = {};
        e(o),
        o.noConflict = function() {
            return t.tabbable = n,
            o
        }
    }())
}(this, (function(t) {
    "use strict";
    var e = ["input:not([inert])", "select:not([inert])", "textarea:not([inert])", "a[href]:not([inert])", "button:not([inert])", "[tabindex]:not(slot):not([inert])", "audio[controls]:not([inert])", "video[controls]:not([inert])", '[contenteditable]:not([contenteditable="false"]):not([inert])', "details>summary:first-of-type:not([inert])", "details:not([inert])"]
      , n = e.join(",")
      , o = "undefined" == typeof Element
      , r = o ? function() {}
    : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector
      , i = !o && Element.prototype.getRootNode ? function(t) {
        var e;
        return null == t || null === (e = t.getRootNode) || void 0 === e ? void 0 : e.call(t)
    }
    : function(t) {
        return null == t ? void 0 : t.ownerDocument
    }
      , a = function t(e, n) {
        var o;
        void 0 === n && (n = !0);
        var r = null == e || null === (o = e.getAttribute) || void 0 === o ? void 0 : o.call(e, "inert");
        return "" === r || "true" === r || n && e && t(e.parentNode)
    }
      , l = function(t, e, o) {
        if (a(t))
            return [];
        var i = Array.prototype.slice.apply(t.querySelectorAll(n));
        return e && r.call(t, n) && i.unshift(t),
        i = i.filter(o)
    }
      , u = function t(e, o, i) {
        for (var l = [], u = Array.from(e); u.length; ) {
            var d = u.shift();
            if (!a(d, !1))
                if ("SLOT" === d.tagName) {
                    var c = d.assignedElements()
                      , f = t(c.length ? c : d.children, !0, i);
                    i.flatten ? l.push.apply(l, f) : l.push({
                        scopeParent: d,
                        candidates: f
                    })
                } else {
                    r.call(d, n) && i.filter(d) && (o || !e.includes(d)) && l.push(d);
                    var s = d.shadowRoot || "function" == typeof i.getShadowRoot && i.getShadowRoot(d)
                      , p = !a(s, !1) && (!i.shadowRootFilter || i.shadowRootFilter(d));
                    if (s && p) {
                        var h = t(!0 === s ? d.children : s.children, !0, i);
                        i.flatten ? l.push.apply(l, h) : l.push({
                            scopeParent: d,
                            candidates: h
                        })
                    } else
                        u.unshift.apply(u, d.children)
                }
        }
        return l
    }
      , d = function(t, e) {
        return t.tabIndex < 0 && (e || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || function(t) {
            var e, n = null == t || null === (e = t.getAttribute) || void 0 === e ? void 0 : e.call(t, "contenteditable");
            return "" === n || "true" === n
        }(t)) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex
    }
      , c = function(t, e) {
        return t.tabIndex === e.tabIndex ? t.documentOrder - e.documentOrder : t.tabIndex - e.tabIndex
    }
      , f = function(t) {
        return "INPUT" === t.tagName
    }
      , s = function(t) {
        return function(t) {
            return f(t) && "radio" === t.type
        }(t) && !function(t) {
            if (!t.name)
                return !0;
            var e, n = t.form || i(t), o = function(t) {
                return n.querySelectorAll('input[type="radio"][name="' + t + '"]')
            };
            if ("undefined" != typeof window && void 0 !== window.CSS && "function" == typeof window.CSS.escape)
                e = o(window.CSS.escape(t.name));
            else
                try {
                    e = o(t.name)
                } catch (t) {
                    return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", t.message),
                    !1
                }
            var r = function(t, e) {
                for (var n = 0; n < t.length; n++)
                    if (t[n].checked && t[n].form === e)
                        return t[n]
            }(e, t.form);
            return !r || r === t
        }(t)
    }
      , p = function(t) {
        var e = t.getBoundingClientRect()
          , n = e.width
          , o = e.height;
        return 0 === n && 0 === o
    }
      , h = function(t, e) {
        var n = e.displayCheck
          , o = e.getShadowRoot;
        if ("hidden" === getComputedStyle(t).visibility)
            return !0;
        var a = r.call(t, "details>summary:first-of-type") ? t.parentElement : t;
        if (r.call(a, "details:not([open]) *"))
            return !0;
        if (n && "full" !== n && "legacy-full" !== n) {
            if ("non-zero-area" === n)
                return p(t)
        } else {
            if ("function" == typeof o) {
                for (var l = t; t; ) {
                    var u = t.parentElement
                      , d = i(t);
                    if (u && !u.shadowRoot && !0 === o(u))
                        return p(t);
                    t = t.assignedSlot ? t.assignedSlot : u || d === t.ownerDocument ? u : d.host
                }
                t = l
            }
            if (function(t) {
                var e, n, o, r, a = t && i(t), l = null === (e = a) || void 0 === e ? void 0 : e.host, u = !1;
                if (a && a !== t)
                    for (u = !!(null !== (n = l) && void 0 !== n && null !== (o = n.ownerDocument) && void 0 !== o && o.contains(l) || null != t && null !== (r = t.ownerDocument) && void 0 !== r && r.contains(t)); !u && l; ) {
                        var d, c, f;
                        u = !(null === (c = l = null === (d = a = i(l)) || void 0 === d ? void 0 : d.host) || void 0 === c || null === (f = c.ownerDocument) || void 0 === f || !f.contains(l))
                    }
                return u
            }(t))
                return !t.getClientRects().length;
            if ("legacy-full" !== n)
                return !0
        }
        return !1
    }
      , v = function(t, e) {
        return !(e.disabled || a(e) || function(t) {
            return f(t) && "hidden" === t.type
        }(e) || h(e, t) || function(t) {
            return "DETAILS" === t.tagName && Array.prototype.slice.apply(t.children).some((function(t) {
                return "SUMMARY" === t.tagName
            }
            ))
        }(e) || function(t) {
            if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
                for (var e = t.parentElement; e; ) {
                    if ("FIELDSET" === e.tagName && e.disabled) {
                        for (var n = 0; n < e.children.length; n++) {
                            var o = e.children.item(n);
                            if ("LEGEND" === o.tagName)
                                return !!r.call(e, "fieldset[disabled] *") || !o.contains(t)
                        }
                        return !0
                    }
                    e = e.parentElement
                }
            return !1
        }(e))
    }
      , b = function(t, e) {
        return !(s(e) || d(e) < 0 || !v(t, e))
    }
      , m = function(t) {
        var e = parseInt(t.getAttribute("tabindex"), 10);
        return !!(isNaN(e) || e >= 0)
    }
      , y = function t(e) {
        var n = []
          , o = [];
        return e.forEach((function(e, r) {
            var i = !!e.scopeParent
              , a = i ? e.scopeParent : e
              , l = d(a, i)
              , u = i ? t(e.candidates) : a;
            0 === l ? i ? n.push.apply(n, u) : n.push(a) : o.push({
                documentOrder: r,
                tabIndex: l,
                item: e,
                isScope: i,
                content: u
            })
        }
        )),
        o.sort(c).reduce((function(t, e) {
            return e.isScope ? t.push.apply(t, e.content) : t.push(e.content),
            t
        }
        ), []).concat(n)
    }
      , g = e.concat("iframe").join(",");
    t.focusable = function(t, e) {
        return (e = e || {}).getShadowRoot ? u([t], e.includeContainer, {
            filter: v.bind(null, e),
            flatten: !0,
            getShadowRoot: e.getShadowRoot
        }) : l(t, e.includeContainer, v.bind(null, e))
    }
    ,
    t.isFocusable = function(t, e) {
        if (e = e || {},
        !t)
            throw new Error("No node provided");
        return !1 !== r.call(t, g) && v(e, t)
    }
    ,
    t.isTabbable = function(t, e) {
        if (e = e || {},
        !t)
            throw new Error("No node provided");
        return !1 !== r.call(t, n) && b(e, t)
    }
    ,
    t.tabbable = function(t, e) {
        var n;
        return n = (e = e || {}).getShadowRoot ? u([t], e.includeContainer, {
            filter: b.bind(null, e),
            flatten: !1,
            getShadowRoot: e.getShadowRoot,
            shadowRootFilter: m
        }) : l(t, e.includeContainer, b.bind(null, e)),
        y(n)
    }
    ,
    Object.defineProperty(t, "__esModule", {
        value: !0
    })
}
));

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/tabbable/index.umd.min.js. */
;/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function($, Drupal, drupalSettings, once) {
    'use strict';
    Drupal.behaviors.initColorbox = {
        attach: function(context, settings) {
            if (!$.isFunction($.colorbox) || typeof settings.colorbox === 'undefined')
                return;
            if (settings.colorbox.mobiledetect && window.matchMedia) {
                var mq = window.matchMedia('(max-device-width: ' + settings.colorbox.mobiledevicewidth + ')');
                if (mq.matches) {
                    $.colorbox.remove();
                    return;
                }
            }
            settings.colorbox.rel = function() {
                return $(this).data('colorbox-gallery');
            }
            ;
            $(once('init-colorbox', '.colorbox', context)).each(function() {
                var extendParams = {
                    photo: true
                };
                var title = $(this).attr('title');
                if (title)
                    extendParams.title = Drupal.colorbox.sanitizeMarkup(title);
                $(this).colorbox($.extend({}, settings.colorbox, extendParams));
            });
            $('.colorbox', context).colorbox({
                onComplete: function(e) {
                    var focus = $('#cboxContent').find('#cboxPrevious').css('display') !== 'none' ? $('#cboxContent').find('#cboxPrevious') : $('#cboxContent').find('#cboxClose');
                    focus.focus();
                    $('#cboxContent').on('keydown', function(e) {
                        var keyCode = e.keyCode || e.which;
                        var firstElement = $('#cboxContent').find('#cboxPrevious').last().is(':focus');
                        var lastElement = $('#cboxContent').find('#cboxClose').first().is(':focus');
                        if (keyCode === 9 && !e.shiftKey && lastElement) {
                            e.preventDefault();
                            $('#cboxContent').find('#cboxPrevious').first().focus();
                        } else {
                            if (keyCode === 9 && e.shiftKey && firstElement) {
                                e.preventDefault();
                                $('#cboxContent').find('#cboxClose').first().focus();
                            }
                        }
                    });
                }
            });
        }
    };
    if (!Drupal.hasOwnProperty('colorbox'))
        Drupal.colorbox = {};
    Drupal.colorbox.sanitizeMarkup = function(markup) {
        if (typeof DOMPurify !== 'undefined') {
            var purifyConfig = {
                ALLOWED_TAGS: ['a', 'b', 'strong', 'i', 'em', 'u', 'cite', 'code', 'br'],
                ALLOWED_ATTR: ['href', 'hreflang', 'title', 'target']
            };
            if (drupalSettings.hasOwnProperty('dompurify_custom_config'))
                purifyConfig = drupalSettings.dompurify_custom_config;
            return DOMPurify.sanitize(markup, purifyConfig);
        } else
            return Drupal.checkPlain(markup);
    }
    ;
}
)(jQuery, Drupal, drupalSettings, once);
;(function($) {
    Drupal.behaviors.initColorboxDefaultStyle = {
        attach: function(context, settings) {
            $(context).bind('cbox_complete', function() {
                if ($('#cboxTitle:empty', context).length == false) {
                    $('#cboxLoadedContent img', context).bind('mouseover', function() {
                        $('#cboxTitle', context).slideDown();
                    });
                    $('#cboxOverlay', context).bind('mouseover', function() {
                        $('#cboxTitle', context).slideUp();
                    });
                } else
                    $('#cboxTitle', context).hide();
            });
        }
    };
}
)(jQuery);
;/* @license MIT https://github.com/jackmoore/colorbox/blob/master/LICENSE.md */
/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/libraries/colorbox/jquery.colorbox-min.js. */
/*!
	Colorbox 1.6.4
	license: MIT
	http://www.jacklmoore.com/colorbox
*/
(function(t, e, i) {
    function n(i, n, o) {
        var r = e.createElement(i);
        return n && (r.id = Z + n),
        o && (r.style.cssText = o),
        t(r)
    }
    function o() {
        return i.innerHeight ? i.innerHeight : t(i).height()
    }
    function r(e, i) {
        i !== Object(i) && (i = {}),
        this.cache = {},
        this.el = e,
        this.value = function(e) {
            var n;
            return void 0 === this.cache[e] && (n = t(this.el).attr("data-cbox-" + e),
            void 0 !== n ? this.cache[e] = n : void 0 !== i[e] ? this.cache[e] = i[e] : void 0 !== X[e] && (this.cache[e] = X[e])),
            this.cache[e]
        }
        ,
        this.get = function(e) {
            var i = this.value(e);
            return t.isFunction(i) ? i.call(this.el, this) : i
        }
    }
    function h(t) {
        var e = W.length
          , i = (A + t) % e;
        return 0 > i ? e + i : i
    }
    function a(t, e) {
        return Math.round((/%/.test(t) ? ("x" === e ? E.width() : o()) / 100 : 1) * parseInt(t, 10))
    }
    function s(t, e) {
        return t.get("photo") || t.get("photoRegex").test(e)
    }
    function l(t, e) {
        return t.get("retinaUrl") && i.devicePixelRatio > 1 ? e.replace(t.get("photoRegex"), t.get("retinaSuffix")) : e
    }
    function d(t) {
        "contains"in x[0] && !x[0].contains(t.target) && t.target !== v[0] && (t.stopPropagation(),
        x.focus())
    }
    function c(t) {
        c.str !== t && (x.add(v).removeClass(c.str).addClass(t),
        c.str = t)
    }
    function g(e) {
        A = 0,
        e && e !== !1 && "nofollow" !== e ? (W = t("." + te).filter(function() {
            var i = t.data(this, Y)
              , n = new r(this,i);
            return n.get("rel") === e
        }),
        A = W.index(_.el),
        -1 === A && (W = W.add(_.el),
        A = W.length - 1)) : W = t(_.el)
    }
    function u(i) {
        t(e).trigger(i),
        ae.triggerHandler(i)
    }
    function f(i) {
        var o;
        if (!G) {
            if (o = t(i).data(Y),
            _ = new r(i,o),
            g(_.get("rel")),
            !U) {
                U = $ = !0,
                c(_.get("className")),
                x.css({
                    visibility: "hidden",
                    display: "block",
                    opacity: ""
                }),
                I = n(se, "LoadedContent", "width:0; height:0; overflow:hidden; visibility:hidden"),
                b.css({
                    width: "",
                    height: ""
                }).append(I),
                j = T.height() + k.height() + b.outerHeight(!0) - b.height(),
                D = C.width() + H.width() + b.outerWidth(!0) - b.width(),
                N = I.outerHeight(!0),
                z = I.outerWidth(!0);
                var h = a(_.get("initialWidth"), "x")
                  , s = a(_.get("initialHeight"), "y")
                  , l = _.get("maxWidth")
                  , f = _.get("maxHeight");
                _.w = Math.max((l !== !1 ? Math.min(h, a(l, "x")) : h) - z - D, 0),
                _.h = Math.max((f !== !1 ? Math.min(s, a(f, "y")) : s) - N - j, 0),
                I.css({
                    width: "",
                    height: _.h
                }),
                J.position(),
                u(ee),
                _.get("onOpen"),
                O.add(F).hide(),
                x.focus(),
                _.get("trapFocus") && e.addEventListener && (e.addEventListener("focus", d, !0),
                ae.one(re, function() {
                    e.removeEventListener("focus", d, !0)
                })),
                _.get("returnFocus") && ae.one(re, function() {
                    t(_.el).focus()
                })
            }
            var p = parseFloat(_.get("opacity"));
            v.css({
                opacity: p === p ? p : "",
                cursor: _.get("overlayClose") ? "pointer" : "",
                visibility: "visible"
            }).show(),
            _.get("closeButton") ? B.html(_.get("close")).appendTo(b) : B.appendTo("<div/>"),
            w()
        }
    }
    function p() {
        x || (V = !1,
        E = t(i),
        x = n(se).attr({
            id: Y,
            "class": t.support.opacity === !1 ? Z + "IE" : "",
            role: "dialog",
            tabindex: "-1"
        }).hide(),
        v = n(se, "Overlay").hide(),
        L = t([n(se, "LoadingOverlay")[0], n(se, "LoadingGraphic")[0]]),
        y = n(se, "Wrapper"),
        b = n(se, "Content").append(F = n(se, "Title"), R = n(se, "Current"), P = t('<button type="button"/>').attr({
            id: Z + "Previous"
        }), K = t('<button type="button"/>').attr({
            id: Z + "Next"
        }), S = t('<button type="button"/>').attr({
            id: Z + "Slideshow"
        }), L),
        B = t('<button type="button"/>').attr({
            id: Z + "Close"
        }),
        y.append(n(se).append(n(se, "TopLeft"), T = n(se, "TopCenter"), n(se, "TopRight")), n(se, !1, "clear:left").append(C = n(se, "MiddleLeft"), b, H = n(se, "MiddleRight")), n(se, !1, "clear:left").append(n(se, "BottomLeft"), k = n(se, "BottomCenter"), n(se, "BottomRight"))).find("div div").css({
            "float": "left"
        }),
        M = n(se, !1, "position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"),
        O = K.add(P).add(R).add(S)),
        e.body && !x.parent().length && t(e.body).append(v, x.append(y, M))
    }
    function m() {
        function i(t) {
            t.which > 1 || t.shiftKey || t.altKey || t.metaKey || t.ctrlKey || (t.preventDefault(),
            f(this))
        }
        return x ? (V || (V = !0,
        K.click(function() {
            J.next()
        }),
        P.click(function() {
            J.prev()
        }),
        B.click(function() {
            J.close()
        }),
        v.click(function() {
            _.get("overlayClose") && J.close()
        }),
        t(e).bind("keydown." + Z, function(t) {
            var e = t.keyCode;
            U && _.get("escKey") && 27 === e && (t.preventDefault(),
            J.close()),
            U && _.get("arrowKey") && W[1] && !t.altKey && (37 === e ? (t.preventDefault(),
            P.click()) : 39 === e && (t.preventDefault(),
            K.click()))
        }),
        t.isFunction(t.fn.on) ? t(e).on("click." + Z, "." + te, i) : t("." + te).live("click." + Z, i)),
        !0) : !1
    }
    function w() {
        var e, o, r, h = J.prep, d = ++le;
        if ($ = !0,
        q = !1,
        u(he),
        u(ie),
        _.get("onLoad"),
        _.h = _.get("height") ? a(_.get("height"), "y") - N - j : _.get("innerHeight") && a(_.get("innerHeight"), "y"),
        _.w = _.get("width") ? a(_.get("width"), "x") - z - D : _.get("innerWidth") && a(_.get("innerWidth"), "x"),
        _.mw = _.w,
        _.mh = _.h,
        _.get("maxWidth") && (_.mw = a(_.get("maxWidth"), "x") - z - D,
        _.mw = _.w && _.w < _.mw ? _.w : _.mw),
        _.get("maxHeight") && (_.mh = a(_.get("maxHeight"), "y") - N - j,
        _.mh = _.h && _.h < _.mh ? _.h : _.mh),
        e = _.get("href"),
        Q = setTimeout(function() {
            L.show()
        }, 100),
        _.get("inline")) {
            var c = t(e).eq(0);
            r = t("<div>").hide().insertBefore(c),
            ae.one(he, function() {
                r.replaceWith(c)
            }),
            h(c)
        } else
            _.get("iframe") ? h(" ") : _.get("html") ? h(_.get("html")) : s(_, e) ? (e = l(_, e),
            q = _.get("createImg"),
            t(q).addClass(Z + "Photo").bind("error." + Z, function() {
                h(n(se, "Error").html(_.get("imgError")))
            }).one("load", function() {
                d === le && setTimeout(function() {
                    var e;
                    _.get("retinaImage") && i.devicePixelRatio > 1 && (q.height = q.height / i.devicePixelRatio,
                    q.width = q.width / i.devicePixelRatio),
                    _.get("scalePhotos") && (o = function() {
                        q.height -= q.height * e,
                        q.width -= q.width * e
                    }
                    ,
                    _.mw && q.width > _.mw && (e = (q.width - _.mw) / q.width,
                    o()),
                    _.mh && q.height > _.mh && (e = (q.height - _.mh) / q.height,
                    o())),
                    _.h && (q.style.marginTop = Math.max(_.mh - q.height, 0) / 2 + "px"),
                    W[1] && (_.get("loop") || W[A + 1]) && (q.style.cursor = "pointer",
                    t(q).bind("click." + Z, function() {
                        J.next()
                    })),
                    q.style.width = q.width + "px",
                    q.style.height = q.height + "px",
                    h(q)
                }, 1)
            }),
            q.src = e) : e && M.load(e, _.get("data"), function(e, i) {
                d === le && h("error" === i ? n(se, "Error").html(_.get("xhrError")) : t(this).contents())
            })
    }
    var v, x, y, b, T, C, H, k, W, E, I, M, L, F, R, S, K, P, B, O, _, j, D, N, z, A, q, U, $, G, Q, J, V, X = {
        html: !1,
        photo: !1,
        iframe: !1,
        inline: !1,
        transition: "elastic",
        speed: 300,
        fadeOut: 300,
        width: !1,
        initialWidth: "600",
        innerWidth: !1,
        maxWidth: !1,
        height: !1,
        initialHeight: "450",
        innerHeight: !1,
        maxHeight: !1,
        scalePhotos: !0,
        scrolling: !0,
        opacity: .9,
        preloading: !0,
        className: !1,
        overlayClose: !0,
        escKey: !0,
        arrowKey: !0,
        top: !1,
        bottom: !1,
        left: !1,
        right: !1,
        fixed: !1,
        data: void 0,
        closeButton: !0,
        fastIframe: !0,
        open: !1,
        reposition: !0,
        loop: !0,
        slideshow: !1,
        slideshowAuto: !0,
        slideshowSpeed: 2500,
        slideshowStart: "start slideshow",
        slideshowStop: "stop slideshow",
        photoRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,
        retinaImage: !1,
        retinaUrl: !1,
        retinaSuffix: "@2x.$1",
        current: "image {current} of {total}",
        previous: "previous",
        next: "next",
        close: "close",
        xhrError: "This content failed to load.",
        imgError: "This image failed to load.",
        returnFocus: !0,
        trapFocus: !0,
        onOpen: !1,
        onLoad: !1,
        onComplete: !1,
        onCleanup: !1,
        onClosed: !1,
        rel: function() {
            return this.rel
        },
        href: function() {
            return t(this).attr("href")
        },
        title: function() {
            return this.title
        },
        createImg: function() {
            var e = new Image
              , i = t(this).data("cbox-img-attrs");
            return "object" == typeof i && t.each(i, function(t, i) {
                e[t] = i
            }),
            e
        },
        createIframe: function() {
            var i = e.createElement("iframe")
              , n = t(this).data("cbox-iframe-attrs");
            return "object" == typeof n && t.each(n, function(t, e) {
                i[t] = e
            }),
            "frameBorder"in i && (i.frameBorder = 0),
            "allowTransparency"in i && (i.allowTransparency = "true"),
            i.name = (new Date).getTime(),
            i.allowFullscreen = !0,
            i
        }
    }, Y = "colorbox", Z = "cbox", te = Z + "Element", ee = Z + "_open", ie = Z + "_load", ne = Z + "_complete", oe = Z + "_cleanup", re = Z + "_closed", he = Z + "_purge", ae = t("<a/>"), se = "div", le = 0, de = {}, ce = function() {
        function t() {
            clearTimeout(h)
        }
        function e() {
            (_.get("loop") || W[A + 1]) && (t(),
            h = setTimeout(J.next, _.get("slideshowSpeed")))
        }
        function i() {
            S.html(_.get("slideshowStop")).unbind(s).one(s, n),
            ae.bind(ne, e).bind(ie, t),
            x.removeClass(a + "off").addClass(a + "on")
        }
        function n() {
            t(),
            ae.unbind(ne, e).unbind(ie, t),
            S.html(_.get("slideshowStart")).unbind(s).one(s, function() {
                J.next(),
                i()
            }),
            x.removeClass(a + "on").addClass(a + "off")
        }
        function o() {
            r = !1,
            S.hide(),
            t(),
            ae.unbind(ne, e).unbind(ie, t),
            x.removeClass(a + "off " + a + "on")
        }
        var r, h, a = Z + "Slideshow_", s = "click." + Z;
        return function() {
            r ? _.get("slideshow") || (ae.unbind(oe, o),
            o()) : _.get("slideshow") && W[1] && (r = !0,
            ae.one(oe, o),
            _.get("slideshowAuto") ? i() : n(),
            S.show())
        }
    }();
    t[Y] || (t(p),
    J = t.fn[Y] = t[Y] = function(e, i) {
        var n, o = this;
        return e = e || {},
        t.isFunction(o) && (o = t("<a/>"),
        e.open = !0),
        o[0] ? (p(),
        m() && (i && (e.onComplete = i),
        o.each(function() {
            var i = t.data(this, Y) || {};
            t.data(this, Y, t.extend(i, e))
        }).addClass(te),
        n = new r(o[0],e),
        n.get("open") && f(o[0])),
        o) : o
    }
    ,
    J.position = function(e, i) {
        function n() {
            T[0].style.width = k[0].style.width = b[0].style.width = parseInt(x[0].style.width, 10) - D + "px",
            b[0].style.height = C[0].style.height = H[0].style.height = parseInt(x[0].style.height, 10) - j + "px"
        }
        var r, h, s, l = 0, d = 0, c = x.offset();
        if (E.unbind("resize." + Z),
        x.css({
            top: -9e4,
            left: -9e4
        }),
        h = E.scrollTop(),
        s = E.scrollLeft(),
        _.get("fixed") ? (c.top -= h,
        c.left -= s,
        x.css({
            position: "fixed"
        })) : (l = h,
        d = s,
        x.css({
            position: "absolute"
        })),
        d += _.get("right") !== !1 ? Math.max(E.width() - _.w - z - D - a(_.get("right"), "x"), 0) : _.get("left") !== !1 ? a(_.get("left"), "x") : Math.round(Math.max(E.width() - _.w - z - D, 0) / 2),
        l += _.get("bottom") !== !1 ? Math.max(o() - _.h - N - j - a(_.get("bottom"), "y"), 0) : _.get("top") !== !1 ? a(_.get("top"), "y") : Math.round(Math.max(o() - _.h - N - j, 0) / 2),
        x.css({
            top: c.top,
            left: c.left,
            visibility: "visible"
        }),
        y[0].style.width = y[0].style.height = "9999px",
        r = {
            width: _.w + z + D,
            height: _.h + N + j,
            top: l,
            left: d
        },
        e) {
            var g = 0;
            t.each(r, function(t) {
                return r[t] !== de[t] ? (g = e,
                void 0) : void 0
            }),
            e = g
        }
        de = r,
        e || x.css(r),
        x.dequeue().animate(r, {
            duration: e || 0,
            complete: function() {
                n(),
                $ = !1,
                y[0].style.width = _.w + z + D + "px",
                y[0].style.height = _.h + N + j + "px",
                _.get("reposition") && setTimeout(function() {
                    E.bind("resize." + Z, J.position)
                }, 1),
                t.isFunction(i) && i()
            },
            step: n
        })
    }
    ,
    J.resize = function(t) {
        var e;
        U && (t = t || {},
        t.width && (_.w = a(t.width, "x") - z - D),
        t.innerWidth && (_.w = a(t.innerWidth, "x")),
        I.css({
            width: _.w
        }),
        t.height && (_.h = a(t.height, "y") - N - j),
        t.innerHeight && (_.h = a(t.innerHeight, "y")),
        t.innerHeight || t.height || (e = I.scrollTop(),
        I.css({
            height: "auto"
        }),
        _.h = I.height()),
        I.css({
            height: _.h
        }),
        e && I.scrollTop(e),
        J.position("none" === _.get("transition") ? 0 : _.get("speed")))
    }
    ,
    J.prep = function(i) {
        function o() {
            return _.w = _.w || I.width(),
            _.w = _.mw && _.mw < _.w ? _.mw : _.w,
            _.w
        }
        function a() {
            return _.h = _.h || I.height(),
            _.h = _.mh && _.mh < _.h ? _.mh : _.h,
            _.h
        }
        if (U) {
            var d, g = "none" === _.get("transition") ? 0 : _.get("speed");
            I.remove(),
            I = n(se, "LoadedContent").append(i),
            I.hide().appendTo(M.show()).css({
                width: o(),
                overflow: _.get("scrolling") ? "auto" : "hidden"
            }).css({
                height: a()
            }).prependTo(b),
            M.hide(),
            t(q).css({
                "float": "none"
            }),
            c(_.get("className")),
            d = function() {
                function i() {
                    t.support.opacity === !1 && x[0].style.removeAttribute("filter")
                }
                var n, o, a = W.length;
                U && (o = function() {
                    clearTimeout(Q),
                    L.hide(),
                    u(ne),
                    _.get("onComplete")
                }
                ,
                F.html(_.get("title")).show(),
                I.show(),
                a > 1 ? ("string" == typeof _.get("current") && R.html(_.get("current").replace("{current}", A + 1).replace("{total}", a)).show(),
                K[_.get("loop") || a - 1 > A ? "show" : "hide"]().html(_.get("next")),
                P[_.get("loop") || A ? "show" : "hide"]().html(_.get("previous")),
                ce(),
                _.get("preloading") && t.each([h(-1), h(1)], function() {
                    var i, n = W[this], o = new r(n,t.data(n, Y)), h = o.get("href");
                    h && s(o, h) && (h = l(o, h),
                    i = e.createElement("img"),
                    i.src = h)
                })) : O.hide(),
                _.get("iframe") ? (n = _.get("createIframe"),
                _.get("scrolling") || (n.scrolling = "no"),
                t(n).attr({
                    src: _.get("href"),
                    "class": Z + "Iframe"
                }).one("load", o).appendTo(I),
                ae.one(he, function() {
                    n.src = "//about:blank"
                }),
                _.get("fastIframe") && t(n).trigger("load")) : o(),
                "fade" === _.get("transition") ? x.fadeTo(g, 1, i) : i())
            }
            ,
            "fade" === _.get("transition") ? x.fadeTo(g, 0, function() {
                J.position(0, d)
            }) : J.position(g, d)
        }
    }
    ,
    J.next = function() {
        !$ && W[1] && (_.get("loop") || W[A + 1]) && (A = h(1),
        f(W[A]))
    }
    ,
    J.prev = function() {
        !$ && W[1] && (_.get("loop") || A) && (A = h(-1),
        f(W[A]))
    }
    ,
    J.close = function() {
        U && !G && (G = !0,
        U = !1,
        u(oe),
        _.get("onCleanup"),
        E.unbind("." + Z),
        v.fadeTo(_.get("fadeOut") || 0, 0),
        x.stop().fadeTo(_.get("fadeOut") || 0, 0, function() {
            x.hide(),
            v.hide(),
            u(he),
            I.remove(),
            setTimeout(function() {
                G = !1,
                u(re),
                _.get("onClosed")
            }, 1)
        }))
    }
    ,
    J.remove = function() {
        x && (x.stop(),
        t[Y].close(),
        x.stop(!1, !0).remove(),
        v.remove(),
        G = !1,
        x = null,
        t("." + te).removeData(Y).removeClass(te),
        t(e).unbind("click." + Z).unbind("keydown." + Z))
    }
    ,
    J.element = function() {
        return t(_.el)
    }
    ,
    J.settings = X)
}
)(jQuery, document, window);
/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/libraries/colorbox/jquery.colorbox-min.js. */
;/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function($) {
    "use strict";
    Drupal.behaviors.colorboxInline = {
        attach: function(context, drupalSettings) {
            $(once('colorbox-inline-processed', '[data-colorbox-inline]', context)).each(function() {
                var $link = $(this)
                  , data = $link.data()
                  , settings = $.extend({}, drupalSettings.colorbox, {
                    href: false,
                    inline: true
                }, {
                    className: data.class,
                    href: data.colorboxInline,
                    width: data.width,
                    height: data.height,
                    rel: data.rel,
                    open: false
                });
                if (!$(settings.href).filter(':visible')[0])
                    settings.onCleanup = function($link) {
                        $($link.cache.href).hide();
                    }
                    ;
                $link.colorbox(settings);
                $link.click(function() {
                    $($(this).data('colorboxInline')).show();
                    $(this).colorbox();
                });
            });
        }
    };
}
)(jQuery);
;(function($, Drupal) {
    Drupal.theme.progressBar = function(id) {
        return (`<div id="${id}" class="progress" aria-live="polite">` + '<div class="progress__label">&nbsp;</div>' + '<div class="progress__track"><div class="progress__bar"></div></div>' + '<div class="progress__percentage"></div>' + '<div class="progress__description">&nbsp;</div>' + '</div>');
    }
    ;
    Drupal.ProgressBar = function(id, updateCallback, method, errorCallback) {
        this.id = id;
        this.method = method || 'GET';
        this.updateCallback = updateCallback;
        this.errorCallback = errorCallback;
        this.element = $(Drupal.theme('progressBar', id));
    }
    ;
    $.extend(Drupal.ProgressBar.prototype, {
        setProgress(percentage, message, label) {
            if (percentage >= 0 && percentage <= 100) {
                $(this.element).find('div.progress__bar').css('width', `${percentage}%`);
                $(this.element).find('div.progress__percentage').html(`${percentage}%`);
            }
            $('div.progress__description', this.element).html(message);
            $('div.progress__label', this.element).html(label);
            if (this.updateCallback)
                this.updateCallback(percentage, message, this);
        },
        startMonitoring(uri, delay) {
            this.delay = delay;
            this.uri = uri;
            this.sendPing();
        },
        stopMonitoring() {
            clearTimeout(this.timer);
            this.uri = null;
        },
        sendPing() {
            if (this.timer)
                clearTimeout(this.timer);
            if (this.uri) {
                const pb = this;
                let uri = this.uri;
                if (uri.indexOf('?') === -1)
                    uri += '?';
                else
                    uri += '&';
                uri += '_format=json';
                $.ajax({
                    type: this.method,
                    url: uri,
                    data: '',
                    dataType: 'json',
                    success(progress) {
                        if (progress.status === 0) {
                            pb.displayError(progress.data);
                            return;
                        }
                        pb.setProgress(progress.percentage, progress.message, progress.label);
                        pb.timer = setTimeout( () => {
                            pb.sendPing();
                        }
                        , pb.delay);
                    },
                    error(xmlhttp) {
                        const e = new Drupal.AjaxError(xmlhttp,pb.uri);
                        pb.displayError(`<pre>${e.message}</pre>`);
                    }
                });
            }
        },
        displayError(string) {
            const error = $('<div class="messages messages--error"></div>').html(string);
            $(this.element).before(error).hide();
            if (this.errorCallback)
                this.errorCallback(this);
        }
    });
}
)(jQuery, Drupal);
;(function($, Drupal) {
    'use strict';
    Drupal.theme.progressBar = function(id) {
        return '<div class="progress-wrapper" aria-live="polite">' + '<div class="message"></div>' + '<div id ="' + id + '" class="progress progress-striped active">' + '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' + '<span class="percentage"></span>' + '</div>' + '</div>' + '<div class="progress-label"></div>' + '</div>';
    }
    ;
    $.extend(Drupal.ProgressBar.prototype, {
        setProgress: function(percentage, message, label) {
            if (percentage >= 0 && percentage <= 100) {
                $(this.element).find('.progress-bar').css('width', percentage + '%').attr('aria-valuenow', percentage);
                $(this.element).find('.percentage').html(percentage + '%');
            }
            if (message) {
                message = message.replace(/<br\/>&nbsp;|\s*$/, '');
                $('.message', this.element).html(message);
            }
            if (label)
                $('.progress-label', this.element).html(label);
            if (this.updateCallback)
                this.updateCallback(percentage, message, this);
        },
        displayError: function(string) {
            var error = $('<div class="alert alert-block alert-error"><button class="close" data-dismiss="alert">&times;</button><h4>' + Drupal.t('Error message') + '</h4></div>').append(string);
            $(this.element).before(error).hide();
            if (this.errorCallback)
                this.errorCallback(this);
        }
    });
}
)(jQuery, Drupal);
;/* @license MIT https://raw.githubusercontent.com/muicss/loadjs/4.2.0/LICENSE.txt */
/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/loadjs/loadjs.min.js. */
loadjs = function() {
    var h = function() {}
      , c = {}
      , u = {}
      , f = {};
    function o(e, n) {
        if (e) {
            var r = f[e];
            if (u[e] = n,
            r)
                for (; r.length; )
                    r[0](e, n),
                    r.splice(0, 1)
        }
    }
    function l(e, n) {
        e.call && (e = {
            success: e
        }),
        n.length ? (e.error || h)(n) : (e.success || h)(e)
    }
    function d(r, t, s, i) {
        var c, o, e = document, n = s.async, u = (s.numRetries || 0) + 1, f = s.before || h, l = r.replace(/[\?|#].*$/, ""), a = r.replace(/^(css|img)!/, "");
        i = i || 0,
        /(^css!|\.css$)/.test(l) ? ((o = e.createElement("link")).rel = "stylesheet",
        o.href = a,
        (c = "hideFocus"in o) && o.relList && (c = 0,
        o.rel = "preload",
        o.as = "style")) : /(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l) ? (o = e.createElement("img")).src = a : ((o = e.createElement("script")).src = r,
        o.async = void 0 === n || n),
        !(o.onload = o.onerror = o.onbeforeload = function(e) {
            var n = e.type[0];
            if (c)
                try {
                    o.sheet.cssText.length || (n = "e")
                } catch (e) {
                    18 != e.code && (n = "e")
                }
            if ("e" == n) {
                if ((i += 1) < u)
                    return d(r, t, s, i)
            } else if ("preload" == o.rel && "style" == o.as)
                return o.rel = "stylesheet";
            t(r, n, e.defaultPrevented)
        }
        ) !== f(r, o) && e.head.appendChild(o)
    }
    function r(e, n, r) {
        var t, s;
        if (n && n.trim && (t = n),
        s = (t ? r : n) || {},
        t) {
            if (t in c)
                throw "LoadJS";
            c[t] = !0
        }
        function i(n, r) {
            !function(e, t, n) {
                var r, s, i = (e = e.push ? e : [e]).length, c = i, o = [];
                for (r = function(e, n, r) {
                    if ("e" == n && o.push(e),
                    "b" == n) {
                        if (!r)
                            return;
                        o.push(e)
                    }
                    --i || t(o)
                }
                ,
                s = 0; s < c; s++)
                    d(e[s], r, n)
            }(e, function(e) {
                l(s, e),
                n && l({
                    success: n,
                    error: r
                }, e),
                o(t, e)
            }, s)
        }
        if (s.returnPromise)
            return new Promise(i);
        i()
    }
    return r.ready = function(e, n) {
        return function(e, r) {
            e = e.push ? e : [e];
            var n, t, s, i = [], c = e.length, o = c;
            for (n = function(e, n) {
                n.length && i.push(e),
                --o || r(i)
            }
            ; c--; )
                t = e[c],
                (s = u[t]) ? n(t, s) : (f[t] = f[t] || []).push(n)
        }(e, function(e) {
            l(n, e)
        }),
        r
    }
    ,
    r.done = function(e) {
        o(e, [])
    }
    ,
    r.reset = function() {
        c = {},
        u = {},
        f = {}
    }
    ,
    r.isDefined = function(e) {
        return e in c
    }
    ,
    r
}();
/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/loadjs/loadjs.min.js. */
;/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function(Drupal, debounce) {
    let liveElement;
    const announcements = [];
    Drupal.behaviors.drupalAnnounce = {
        attach(context) {
            if (!liveElement) {
                liveElement = document.createElement('div');
                liveElement.id = 'drupal-live-announce';
                liveElement.className = 'visually-hidden';
                liveElement.setAttribute('aria-live', 'polite');
                liveElement.setAttribute('aria-busy', 'false');
                document.body.appendChild(liveElement);
            }
        }
    };
    function announce() {
        const text = [];
        let priority = 'polite';
        let announcement;
        const il = announcements.length;
        for (let i = 0; i < il; i++) {
            announcement = announcements.pop();
            text.unshift(announcement.text);
            if (announcement.priority === 'assertive')
                priority = 'assertive';
        }
        if (text.length) {
            liveElement.innerHTML = '';
            liveElement.setAttribute('aria-busy', 'true');
            liveElement.setAttribute('aria-live', priority);
            liveElement.innerHTML = text.join('\n');
            liveElement.setAttribute('aria-busy', 'false');
        }
    }
    Drupal.announce = function(text, priority) {
        announcements.push({
            text,
            priority
        });
        return debounce(announce, 200)();
    }
    ;
}
)(Drupal, Drupal.debounce);
;( (Drupal) => {
    Drupal.Message = class {
        constructor(messageWrapper=null) {
            if (!messageWrapper)
                this.messageWrapper = Drupal.Message.defaultWrapper();
            else
                this.messageWrapper = messageWrapper;
        }
        static defaultWrapper() {
            let wrapper = document.querySelector('[data-drupal-messages]');
            if (!wrapper) {
                wrapper = document.querySelector('[data-drupal-messages-fallback]');
                wrapper.removeAttribute('data-drupal-messages-fallback');
                wrapper.setAttribute('data-drupal-messages', '');
                wrapper.classList.remove('hidden');
            }
            return wrapper.innerHTML === '' ? Drupal.Message.messageInternalWrapper(wrapper) : wrapper.firstElementChild;
        }
        static getMessageTypeLabels() {
            return {
                status: Drupal.t('Status message'),
                error: Drupal.t('Error message'),
                warning: Drupal.t('Warning message')
            };
        }
        add(message, options={}) {
            if (!options.hasOwnProperty('type'))
                options.type = 'status';
            if (typeof message !== 'string')
                throw new Error('Message must be a string.');
            Drupal.Message.announce(message, options);
            options.id = options.id ? String(options.id) : `${options.type}-${Math.random().toFixed(15).replace('0.', '')}`;
            if (!Drupal.Message.getMessageTypeLabels().hasOwnProperty(options.type)) {
                const {type} = options;
                throw new Error(`The message type, ${type}, is not present in Drupal.Message.getMessageTypeLabels().`);
            }
            this.messageWrapper.appendChild(Drupal.theme('message', {
                text: message
            }, options));
            return options.id;
        }
        select(id) {
            return this.messageWrapper.querySelector(`[data-drupal-message-id^="${id}"]`);
        }
        remove(id) {
            return this.messageWrapper.removeChild(this.select(id));
        }
        clear() {
            Array.prototype.forEach.call(this.messageWrapper.querySelectorAll('[data-drupal-message-id]'), (message) => {
                this.messageWrapper.removeChild(message);
            }
            );
        }
        static announce(message, options) {
            if (!options.priority && (options.type === 'warning' || options.type === 'error'))
                options.priority = 'assertive';
            if (options.announce !== '')
                Drupal.announce(options.announce || message, options.priority);
        }
        static messageInternalWrapper(messageWrapper) {
            const innerWrapper = document.createElement('div');
            innerWrapper.setAttribute('class', 'messages__wrapper');
            messageWrapper.insertAdjacentElement('afterbegin', innerWrapper);
            return innerWrapper;
        }
    }
    ;
    Drupal.theme.message = ({text}, {type, id}) => {
        const messagesTypes = Drupal.Message.getMessageTypeLabels();
        const messageWrapper = document.createElement('div');
        messageWrapper.setAttribute('class', `messages messages--${type}`);
        messageWrapper.setAttribute('role', type === 'error' || type === 'warning' ? 'alert' : 'status');
        messageWrapper.setAttribute('data-drupal-message-id', id);
        messageWrapper.setAttribute('data-drupal-message-type', type);
        messageWrapper.setAttribute('aria-label', messagesTypes[type]);
        messageWrapper.innerHTML = `${text}`;
        return messageWrapper;
    }
    ;
}
)(Drupal);
;(function($, Drupal) {
    Drupal.Message.getMessageTypeClass = function(type) {
        var classes = this.getMessageTypeClasses();
        return 'alert alert-' + (classes[type] || 'success');
    }
    ;
    Drupal.Message.getMessageTypeClasses = function() {
        return {
            status: 'success',
            error: 'danger',
            warning: 'warning',
            info: 'info'
        };
    }
    ;
    Drupal.Message.getMessageTypeLabel = function(type) {
        var labels = this.getMessageTypeLabels();
        return labels[type];
    }
    ;
    Drupal.Message.getMessageTypeLabels = function() {
        return {
            status: Drupal.t('Status message'),
            error: Drupal.t('Error message'),
            warning: Drupal.t('Warning message'),
            info: Drupal.t('Informative message')
        };
    }
    ;
    Drupal.Message.getMessageTypeRole = function(type) {
        var labels = this.getMessageTypeRoles();
        return labels[type];
    }
    ;
    Drupal.Message.getMessageTypeRoles = function() {
        return {
            status: 'status',
            error: 'alert',
            warning: 'alert',
            info: 'status'
        };
    }
    ;
    Drupal.theme.message = function(message, options) {
        options = options || {};
        var wrapper = Drupal.theme('messageWrapper', options.id || (new Date()).getTime(), options.type || 'status');
        if (options.dismissible === void 0 || !!options.dismissible) {
            wrapper.classList.add('alert-dismissible');
            wrapper.appendChild(Drupal.theme('messageClose'));
        }
        wrapper.appendChild(Drupal.theme('messageContents', message && message.text));
        return wrapper;
    }
    ;
    Drupal.theme.messageWrapper = function(id, type) {
        var wrapper = document.createElement('div');
        var label = Drupal.Message.getMessageTypeLabel(type);
        wrapper.setAttribute('class', Drupal.Message.getMessageTypeClass(type));
        wrapper.setAttribute('role', Drupal.Message.getMessageTypeRole(type));
        wrapper.setAttribute('aria-label', label);
        wrapper.setAttribute('data-drupal-message-id', id);
        wrapper.setAttribute('data-drupal-message-type', type);
        if (label)
            wrapper.appendChild(Drupal.theme('messageLabel', label));
        return wrapper;
    }
    ;
    Drupal.theme.messageClose = function() {
        var element = document.createElement('button');
        element.setAttribute('class', 'close');
        element.setAttribute('type', 'button');
        element.setAttribute('role', 'button');
        element.setAttribute('data-dismiss', 'alert');
        element.setAttribute('aria-label', Drupal.t('Close'));
        element.innerHTML = '<span aria-hidden="true">&times;</span>';
        return element;
    }
    ;
    Drupal.theme.messageLabel = function(label) {
        var element = document.createElement('h2');
        element.setAttribute('class', 'sr-only');
        element.innerHTML = label;
        return element;
    }
    ;
    Drupal.theme.messageContents = function(html) {
        var element = document.createElement('p');
        element.innerHTML = '' + html;
        return element;
    }
    ;
}
)(window.jQuery, window.Drupal);
;(function($, window, Drupal, drupalSettings, loadjs, {isFocusable, tabbable}) {
    Drupal.behaviors.AJAX = {
        attach(context, settings) {
            function loadAjaxBehavior(base) {
                const elementSettings = settings.ajax[base];
                if (typeof elementSettings.selector === 'undefined')
                    elementSettings.selector = `#${base}`;
                once('drupal-ajax', $(elementSettings.selector)).forEach( (el) => {
                    elementSettings.element = el;
                    elementSettings.base = base;
                    Drupal.ajax(elementSettings);
                }
                );
            }
            Object.keys(settings.ajax || {}).forEach(loadAjaxBehavior);
            Drupal.ajax.bindAjaxLinks(document.body);
            once('ajax', '.use-ajax-submit').forEach( (el) => {
                const elementSettings = {};
                elementSettings.url = $(el.form).attr('action');
                elementSettings.setClick = true;
                elementSettings.event = 'click';
                elementSettings.progress = {
                    type: 'throbber'
                };
                elementSettings.base = el.id;
                elementSettings.element = el;
                Drupal.ajax(elementSettings);
            }
            );
        },
        detach(context, settings, trigger) {
            if (trigger === 'unload')
                Drupal.ajax.expired().forEach( (instance) => {
                    Drupal.ajax.instances[instance.instanceIndex] = null;
                }
                );
        }
    };
    Drupal.AjaxError = function(xmlhttp, uri, customMessage) {
        let statusCode;
        let statusText;
        let responseText;
        if (xmlhttp.status)
            statusCode = `\n${Drupal.t('An AJAX HTTP error occurred.')}\n${Drupal.t('HTTP Result Code: !status', {
                '!status': xmlhttp.status
            })}`;
        else
            statusCode = `\n${Drupal.t('An AJAX HTTP request terminated abnormally.')}`;
        statusCode += `\n${Drupal.t('Debugging information follows.')}`;
        const pathText = `\n${Drupal.t('Path: !uri', {
            '!uri': uri
        })}`;
        statusText = '';
        try {
            statusText = `\n${Drupal.t('StatusText: !statusText', {
                '!statusText': xmlhttp.statusText.trim()
            })}`;
        } catch (e) {}
        responseText = '';
        try {
            responseText = `\n${Drupal.t('ResponseText: !responseText', {
                '!responseText': xmlhttp.responseText.trim()
            })}`;
        } catch (e) {}
        responseText = responseText.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi, '');
        responseText = responseText.replace(/[\n]+\s+/g, '\n');
        const readyStateText = xmlhttp.status === 0 ? `\n${Drupal.t('ReadyState: !readyState', {
            '!readyState': xmlhttp.readyState
        })}` : '';
        customMessage = customMessage ? `\n${Drupal.t('CustomMessage: !customMessage', {
            '!customMessage': customMessage
        })}` : '';
        this.message = statusCode + pathText + statusText + customMessage + responseText + readyStateText;
        this.name = 'AjaxError';
        if (!Drupal.AjaxError.messages)
            Drupal.AjaxError.messages = new Drupal.Message();
        Drupal.AjaxError.messages.add(Drupal.t("Oops, something went wrong. Check your browser's developer console for more details."), {
            type: 'error'
        });
    }
    ;
    Drupal.AjaxError.prototype = new Error();
    Drupal.AjaxError.prototype.constructor = Drupal.AjaxError;
    Drupal.ajax = function(settings) {
        if (arguments.length !== 1)
            throw new Error('Drupal.ajax() function must be called with one configuration object only');
        const base = settings.base || false;
        const element = settings.element || false;
        delete settings.base;
        delete settings.element;
        if (!settings.progress && !element)
            settings.progress = false;
        const ajax = new Drupal.Ajax(base,element,settings);
        ajax.instanceIndex = Drupal.ajax.instances.length;
        Drupal.ajax.instances.push(ajax);
        return ajax;
    }
    ;
    Drupal.ajax.instances = [];
    Drupal.ajax.expired = function() {
        return Drupal.ajax.instances.filter( (instance) => instance && instance.element !== false && !document.body.contains(instance.element));
    }
    ;
    Drupal.ajax.bindAjaxLinks = (element) => {
        once('ajax', '.use-ajax', element).forEach( (ajaxLink) => {
            const $linkElement = $(ajaxLink);
            const elementSettings = {
                progress: {
                    type: 'throbber'
                },
                dialogType: $linkElement.data('dialog-type'),
                dialog: $linkElement.data('dialog-options'),
                dialogRenderer: $linkElement.data('dialog-renderer'),
                base: $linkElement.attr('id'),
                element: ajaxLink
            };
            const href = $linkElement.attr('href');
            if (href) {
                elementSettings.url = href;
                elementSettings.event = 'click';
            }
            const httpMethod = $linkElement.data('ajax-http-method');
            if (httpMethod)
                elementSettings.httpMethod = httpMethod;
            Drupal.ajax(elementSettings);
        }
        );
    }
    ;
    Drupal.Ajax = function(base, element, elementSettings) {
        const defaults = {
            httpMethod: 'POST',
            event: element ? 'mousedown' : null,
            keypress: true,
            selector: base ? `#${base}` : null,
            effect: 'none',
            speed: 'none',
            method: 'replaceWith',
            progress: {
                type: 'throbber',
                message: Drupal.t('Please wait...')
            },
            submit: {
                js: true
            }
        };
        $.extend(this, defaults, elementSettings);
        this.commands = new Drupal.AjaxCommands();
        this.instanceIndex = false;
        if (this.wrapper)
            this.wrapper = `#${this.wrapper}`;
        this.element = element;
        this.elementSettings = elementSettings;
        if (this.element && this.element.form)
            this.$form = $(this.element.form);
        if (!this.url) {
            const $element = $(this.element);
            if ($element.is('a'))
                this.url = $element.attr('href');
            else {
                if (this.element && element.form)
                    this.url = this.$form.attr('action');
            }
        }
        const originalUrl = this.url;
        this.url = this.url.replace(/\/nojs(\/|$|\?|#)/, '/ajax$1');
        if (drupalSettings.ajaxTrustedUrl[originalUrl])
            drupalSettings.ajaxTrustedUrl[this.url] = true;
        const ajax = this;
        ajax.options = {
            url: ajax.url,
            data: ajax.submit,
            isInProgress() {
                return ajax.ajaxing;
            },
            beforeSerialize(elementSettings, options) {
                return ajax.beforeSerialize(elementSettings, options);
            },
            beforeSubmit(formValues, elementSettings, options) {
                ajax.ajaxing = true;
                return ajax.beforeSubmit(formValues, elementSettings, options);
            },
            beforeSend(xmlhttprequest, options) {
                ajax.ajaxing = true;
                return ajax.beforeSend(xmlhttprequest, options);
            },
            success(response, status, xmlhttprequest) {
                if (typeof response === 'string')
                    response = $.parseJSON(response);
                if (response !== null && !drupalSettings.ajaxTrustedUrl[ajax.url])
                    if (xmlhttprequest.getResponseHeader('X-Drupal-Ajax-Token') !== '1') {
                        const customMessage = Drupal.t('The response failed verification so will not be processed.');
                        return ajax.error(xmlhttprequest, ajax.url, customMessage);
                    }
                return (Promise.resolve(ajax.success(response, status)).then( () => {
                    ajax.ajaxing = false;
                    $(document).trigger('ajaxSuccess', [xmlhttprequest, this]);
                    $(document).trigger('ajaxComplete', [xmlhttprequest, this]);
                    if (--$.active === 0)
                        $(document).trigger('ajaxStop');
                }
                ));
            },
            error(xmlhttprequest, status, error) {
                ajax.ajaxing = false;
            },
            complete(xmlhttprequest, status) {
                if (status === 'error' || status === 'parsererror')
                    return ajax.error(xmlhttprequest, ajax.url);
            },
            dataType: 'json',
            jsonp: false,
            method: ajax.httpMethod
        };
        if (elementSettings.dialog)
            ajax.options.data.dialogOptions = elementSettings.dialog;
        if (ajax.options.url.indexOf('?') === -1)
            ajax.options.url += '?';
        else
            ajax.options.url += '&';
        let wrapper = `drupal_${elementSettings.dialogType || 'ajax'}`;
        if (elementSettings.dialogRenderer)
            wrapper += `.${elementSettings.dialogRenderer}`;
        ajax.options.url += `${Drupal.ajax.WRAPPER_FORMAT}=${wrapper}`;
        $(ajax.element).on(elementSettings.event, function(event) {
            if (!drupalSettings.ajaxTrustedUrl[ajax.url] && !Drupal.url.isLocal(ajax.url))
                throw new Error(Drupal.t('The callback URL is not local and not trusted: !url', {
                    '!url': ajax.url
                }));
            return ajax.eventResponse(this, event);
        });
        if (elementSettings.keypress)
            $(ajax.element).on('keypress', function(event) {
                return ajax.keypressResponse(this, event);
            });
        if (elementSettings.prevent)
            $(ajax.element).on(elementSettings.prevent, false);
    }
    ;
    Drupal.ajax.WRAPPER_FORMAT = '_wrapper_format';
    Drupal.Ajax.AJAX_REQUEST_PARAMETER = '_drupal_ajax';
    Drupal.Ajax.prototype.execute = function() {
        if (this.ajaxing)
            return;
        try {
            this.beforeSerialize(this.element, this.options);
            return $.ajax(this.options);
        } catch (e) {
            this.ajaxing = false;
            window.alert(`An error occurred while attempting to process ${this.options.url}: ${e.message}`);
            return $.Deferred().reject();
        }
    }
    ;
    Drupal.Ajax.prototype.keypressResponse = function(element, event) {
        const ajax = this;
        if (event.which === 13 || (event.which === 32 && element.type !== 'text' && element.type !== 'textarea' && element.type !== 'tel' && element.type !== 'number')) {
            event.preventDefault();
            event.stopPropagation();
            $(element).trigger(ajax.elementSettings.event);
        }
    }
    ;
    Drupal.Ajax.prototype.eventResponse = function(element, event) {
        event.preventDefault();
        event.stopPropagation();
        const ajax = this;
        if (ajax.ajaxing)
            return;
        try {
            if (ajax.$form) {
                if (ajax.setClick)
                    element.form.clk = element;
                ajax.$form.ajaxSubmit(ajax.options);
            } else {
                ajax.beforeSerialize(ajax.element, ajax.options);
                $.ajax(ajax.options);
            }
        } catch (e) {
            ajax.ajaxing = false;
            window.alert(`An error occurred while attempting to process ${ajax.options.url}: ${e.message}`);
        }
    }
    ;
    Drupal.Ajax.prototype.beforeSerialize = function(element, options) {
        if (this.$form && document.body.contains(this.$form.get(0))) {
            const settings = this.settings || drupalSettings;
            Drupal.detachBehaviors(this.$form.get(0), settings, 'serialize');
        }
        options.data[Drupal.Ajax.AJAX_REQUEST_PARAMETER] = 1;
        const pageState = drupalSettings.ajaxPageState;
        options.data['ajax_page_state[theme]'] = pageState.theme;
        options.data['ajax_page_state[theme_token]'] = pageState.theme_token;
        options.data['ajax_page_state[libraries]'] = pageState.libraries;
    }
    ;
    Drupal.Ajax.prototype.beforeSubmit = function(formValues, element, options) {}
    ;
    Drupal.Ajax.prototype.beforeSend = function(xmlhttprequest, options) {
        if (this.$form) {
            options.extraData = options.extraData || {};
            options.extraData.ajax_iframe_upload = '1';
            const v = $.fieldValue(this.element);
            if (v !== null)
                options.extraData[this.element.name] = v;
        }
        $(this.element).prop('disabled', true);
        if (!this.progress || !this.progress.type)
            return;
        const progressIndicatorMethod = `setProgressIndicator${this.progress.type.slice(0, 1).toUpperCase()}${this.progress.type.slice(1).toLowerCase()}`;
        if (progressIndicatorMethod in this && typeof this[progressIndicatorMethod] === 'function')
            this[progressIndicatorMethod].call(this);
    }
    ;
    Drupal.theme.ajaxProgressThrobber = (message) => {
        const messageMarkup = typeof message === 'string' ? Drupal.theme('ajaxProgressMessage', message) : '';
        const throbber = '<div class="throbber">&nbsp;</div>';
        return `<div class="ajax-progress ajax-progress-throbber">${throbber}${messageMarkup}</div>`;
    }
    ;
    Drupal.theme.ajaxProgressIndicatorFullscreen = () => '<div class="ajax-progress ajax-progress-fullscreen">&nbsp;</div>';
    Drupal.theme.ajaxProgressMessage = (message) => `<div class="message">${message}</div>`;
    Drupal.theme.ajaxProgressBar = ($element) => $('<div class="ajax-progress ajax-progress-bar"></div>').append($element);
    Drupal.Ajax.prototype.setProgressIndicatorBar = function() {
        const progressBar = new Drupal.ProgressBar(`ajax-progress-${this.element.id}`,$.noop,this.progress.method,$.noop);
        if (this.progress.message)
            progressBar.setProgress(-1, this.progress.message);
        if (this.progress.url)
            progressBar.startMonitoring(this.progress.url, this.progress.interval || 1500);
        this.progress.element = $(Drupal.theme('ajaxProgressBar', progressBar.element));
        this.progress.object = progressBar;
        $(this.element).after(this.progress.element);
    }
    ;
    Drupal.Ajax.prototype.setProgressIndicatorThrobber = function() {
        this.progress.element = $(Drupal.theme('ajaxProgressThrobber', this.progress.message));
        if ($(this.element).closest('[data-drupal-ajax-container]').length)
            $(this.element).closest('[data-drupal-ajax-container]').after(this.progress.element);
        else
            $(this.element).after(this.progress.element);
    }
    ;
    Drupal.Ajax.prototype.setProgressIndicatorFullscreen = function() {
        this.progress.element = $(Drupal.theme('ajaxProgressIndicatorFullscreen'));
        $('body').append(this.progress.element);
    }
    ;
    Drupal.Ajax.prototype.commandExecutionQueue = function(response, status) {
        const ajaxCommands = this.commands;
        return Object.keys(response || {}).reduce( (executionQueue, key) => executionQueue.then( () => {
            const {command} = response[key];
            if (command && ajaxCommands[command])
                return ajaxCommands[command](this, response[key], status);
        }
        ), Promise.resolve());
    }
    ;
    Drupal.Ajax.prototype.success = function(response, status) {
        if (this.progress.element)
            $(this.progress.element).remove();
        if (this.progress.object)
            this.progress.object.stopMonitoring();
        $(this.element).prop('disabled', false);
        const elementParents = $(this.element).parents('[data-drupal-selector]').addBack().toArray();
        const focusChanged = Object.keys(response || {}).some( (key) => {
            const {command, method} = response[key];
            return (command === 'focusFirst' || (command === 'invoke' && method === 'focus'));
        }
        );
        return (this.commandExecutionQueue(response, status).then( () => {
            if (!focusChanged && this.element && !$(this.element).data('disable-refocus')) {
                let target = false;
                for (let n = elementParents.length - 1; !target && n >= 0; n--)
                    target = document.querySelector(`[data-drupal-selector="${elementParents[n].getAttribute('data-drupal-selector')}"]`);
                if (target)
                    $(target).trigger('focus');
            }
            if (this.$form && document.body.contains(this.$form.get(0))) {
                const settings = this.settings || drupalSettings;
                Drupal.attachBehaviors(this.$form.get(0), settings);
            }
            this.settings = null;
        }
        ).catch( (error) => console.error(Drupal.t('An error occurred during the execution of the Ajax response: !error', {
            '!error': error
        }))));
    }
    ;
    Drupal.Ajax.prototype.getEffect = function(response) {
        const type = response.effect || this.effect;
        const speed = response.speed || this.speed;
        const effect = {};
        if (type === 'none') {
            effect.showEffect = 'show';
            effect.hideEffect = 'hide';
            effect.showSpeed = '';
        } else if (type === 'fade') {
            effect.showEffect = 'fadeIn';
            effect.hideEffect = 'fadeOut';
            effect.showSpeed = speed;
        } else {
            effect.showEffect = `${type}Toggle`;
            effect.hideEffect = `${type}Toggle`;
            effect.showSpeed = speed;
        }
        return effect;
    }
    ;
    Drupal.Ajax.prototype.error = function(xmlhttprequest, uri, customMessage) {
        if (this.progress.element)
            $(this.progress.element).remove();
        if (this.progress.object)
            this.progress.object.stopMonitoring();
        $(this.wrapper).show();
        $(this.element).prop('disabled', false);
        if (this.$form && document.body.contains(this.$form.get(0))) {
            const settings = this.settings || drupalSettings;
            Drupal.attachBehaviors(this.$form.get(0), settings);
        }
        throw new Drupal.AjaxError(xmlhttprequest,uri,customMessage);
    }
    ;
    Drupal.theme.ajaxWrapperNewContent = ($newContent, ajax, response) => (response.effect || ajax.effect) !== 'none' && $newContent.filter( (i) => !(($newContent[i].nodeName === '#comment' || ($newContent[i].nodeName === '#text' && /^(\s|\n|\r)*$/.test($newContent[i].textContent))))).length > 1 ? Drupal.theme('ajaxWrapperMultipleRootElements', $newContent) : $newContent;
    Drupal.theme.ajaxWrapperMultipleRootElements = ($elements) => $('<div></div>').append($elements);
    Drupal.AjaxCommands = function() {}
    ;
    Drupal.AjaxCommands.prototype = {
        insert(ajax, response) {
            const $wrapper = response.selector ? $(response.selector) : $(ajax.wrapper);
            const method = response.method || ajax.method;
            const effect = ajax.getEffect(response);
            const settings = response.settings || ajax.settings || drupalSettings;
            let $newContent = $($.parseHTML(response.data, document, true));
            $newContent = Drupal.theme('ajaxWrapperNewContent', $newContent, ajax, response);
            switch (method) {
            case 'html':
            case 'replaceWith':
            case 'replaceAll':
            case 'empty':
            case 'remove':
                Drupal.detachBehaviors($wrapper.get(0), settings);
                break;
            default:
                break;
            }
            $wrapper[method]($newContent);
            if (effect.showEffect !== 'show')
                $newContent.hide();
            const $ajaxNewContent = $newContent.find('.ajax-new-content');
            if ($ajaxNewContent.length) {
                $ajaxNewContent.hide();
                $newContent.show();
                $ajaxNewContent[effect.showEffect](effect.showSpeed);
            } else {
                if (effect.showEffect !== 'show')
                    $newContent[effect.showEffect](effect.showSpeed);
            }
            if ($newContent.parents('html').length)
                $newContent.each( (index, element) => {
                    if (element.nodeType === Node.ELEMENT_NODE)
                        Drupal.attachBehaviors(element, settings);
                }
                );
        },
        remove(ajax, response, status) {
            const settings = response.settings || ajax.settings || drupalSettings;
            $(response.selector).each(function() {
                Drupal.detachBehaviors(this, settings);
            }).remove();
        },
        changed(ajax, response, status) {
            const $element = $(response.selector);
            if (!$element.hasClass('ajax-changed')) {
                $element.addClass('ajax-changed');
                if (response.asterisk)
                    $element.find(response.asterisk).append(` <abbr class="ajax-changed" title="${Drupal.t('Changed')}">*</abbr> `);
            }
        },
        alert(ajax, response, status) {
            window.alert(response.text);
        },
        announce(ajax, response) {
            if (response.priority)
                Drupal.announce(response.text, response.priority);
            else
                Drupal.announce(response.text);
        },
        redirect(ajax, response, status) {
            window.location = response.url;
        },
        css(ajax, response, status) {
            $(response.selector).css(response.argument);
        },
        settings(ajax, response, status) {
            const ajaxSettings = drupalSettings.ajax;
            if (ajaxSettings)
                Drupal.ajax.expired().forEach( (instance) => {
                    if (instance.selector) {
                        const selector = instance.selector.replace('#', '');
                        if (selector in ajaxSettings)
                            delete ajaxSettings[selector];
                    }
                }
                );
            if (response.merge)
                $.extend(true, drupalSettings, response.settings);
            else
                ajax.settings = response.settings;
        },
        data(ajax, response, status) {
            $(response.selector).data(response.name, response.value);
        },
        focusFirst(ajax, response, status) {
            let focusChanged = false;
            const container = document.querySelector(response.selector);
            if (container) {
                const tabbableElements = tabbable(container);
                if (tabbableElements.length) {
                    tabbableElements[0].focus();
                    focusChanged = true;
                } else {
                    if (isFocusable(container)) {
                        container.focus();
                        focusChanged = true;
                    }
                }
            }
            if (ajax.hasOwnProperty('element') && !focusChanged)
                ajax.element.focus();
        },
        invoke(ajax, response, status) {
            const $element = $(response.selector);
            $element[response.method](...response.args);
        },
        restripe(ajax, response, status) {
            $(response.selector).find('> tbody > tr:visible, > tr:visible').removeClass('odd even').filter(':even').addClass('odd').end().filter(':odd').addClass('even');
        },
        update_build_id(ajax, response, status) {
            document.querySelectorAll(`input[name="form_build_id"][value="${response.old}"]`).forEach( (item) => {
                item.value = response.new;
            }
            );
        },
        add_css(ajax, response, status) {
            if (typeof response.data === 'string') {
                Drupal.deprecationError({
                    message: 'Passing a string to the Drupal.ajax.add_css() method is deprecated in 10.1.0 and is removed from drupal:11.0.0. See https://www.drupal.org/node/3154948.'
                });
                $('head').prepend(response.data);
                return;
            }
            const allUniqueBundleIds = response.data.map(function(style) {
                const uniqueBundleId = style.href + ajax.instanceIndex;
                loadjs(style.href, uniqueBundleId, {
                    before(path, styleEl) {
                        Object.keys(style).forEach( (attributeKey) => {
                            styleEl.setAttribute(attributeKey, style[attributeKey]);
                        }
                        );
                    }
                });
                return uniqueBundleId;
            });
            return new Promise( (resolve, reject) => {
                loadjs.ready(allUniqueBundleIds, {
                    success() {
                        resolve();
                    },
                    error(depsNotFound) {
                        const message = Drupal.t(`The following files could not be loaded: @dependencies`, {
                            '@dependencies': depsNotFound.join(', ')
                        });
                        reject(message);
                    }
                });
            }
            );
        },
        message(ajax, response) {
            const messages = new Drupal.Message(document.querySelector(response.messageWrapperQuerySelector));
            if (response.clearPrevious)
                messages.clear();
            messages.add(response.message, response.messageOptions);
        },
        add_js(ajax, response, status) {
            const parentEl = document.querySelector(response.selector || 'body');
            const settings = ajax.settings || drupalSettings;
            const allUniqueBundleIds = response.data.map( (script) => {
                const uniqueBundleId = script.src + ajax.instanceIndex;
                loadjs(script.src, uniqueBundleId, {
                    async: false,
                    before(path, scriptEl) {
                        Object.keys(script).forEach( (attributeKey) => {
                            scriptEl.setAttribute(attributeKey, script[attributeKey]);
                        }
                        );
                        parentEl.appendChild(scriptEl);
                        return false;
                    }
                });
                return uniqueBundleId;
            }
            );
            return new Promise( (resolve, reject) => {
                loadjs.ready(allUniqueBundleIds, {
                    success() {
                        Drupal.attachBehaviors(parentEl, settings);
                        resolve();
                    },
                    error(depsNotFound) {
                        const message = Drupal.t(`The following files could not be loaded: @dependencies`, {
                            '@dependencies': depsNotFound.join(', ')
                        });
                        reject(message);
                    }
                });
            }
            );
        },
        scrollTop(ajax, response) {
            const offset = $(response.selector).offset();
            let scrollTarget = response.selector;
            while ($(scrollTarget).scrollTop() === 0 && $(scrollTarget).parent())
                scrollTarget = $(scrollTarget).parent();
            if (offset.top - 10 < $(scrollTarget).scrollTop())
                $(scrollTarget).animate({
                    scrollTop: offset.top - 10
                }, 500);
        }
    };
    const stopEvent = (xhr, settings) => {
        return (xhr.getResponseHeader('X-Drupal-Ajax-Token') === '1' && settings.isInProgress && settings.isInProgress());
    }
    ;
    $.extend(true, $.event.special, {
        ajaxSuccess: {
            trigger(event, xhr, settings) {
                if (stopEvent(xhr, settings))
                    return false;
            }
        },
        ajaxComplete: {
            trigger(event, xhr, settings) {
                if (stopEvent(xhr, settings)) {
                    $.active++;
                    return false;
                }
            }
        }
    });
}
)(jQuery, window, Drupal, drupalSettings, loadjs, window.tabbable);
;(function($, window, Drupal, drupalSettings) {
    Drupal.Ajax.prototype.findGlyphicon = function(element) {
        return $(element).closest('.form-item').find('.ajax-progress.glyphicon');
    }
    ;
    Drupal.Ajax.prototype.glyphiconStart = function(element, message) {
        var $glyphicon = this.findGlyphicon(element);
        if ($glyphicon[0]) {
            $glyphicon.addClass('glyphicon-spin');
            if ($.fn.tooltip && drupalSettings.bootstrap.tooltip_enabled) {
                $glyphicon.removeAttr('data-toggle').removeAttr('data-original-title').removeAttr('title').tooltip('destroy');
                if (message)
                    $glyphicon.attr('data-toggle', 'tooltip').attr('title', message).tooltip();
            }
            if (message)
                $glyphicon.parent().append('<div class="sr-only message">' + message + '</div>');
        }
        return $glyphicon;
    }
    ;
    Drupal.Ajax.prototype.glyphiconStop = function(element) {
        var $glyphicon = this.findGlyphicon(element);
        if ($glyphicon[0]) {
            $glyphicon.removeClass('glyphicon-spin');
            if ($.fn.tooltip && drupalSettings.bootstrap.tooltip_enabled)
                $glyphicon.removeAttr('data-toggle').removeAttr('data-original-title').removeAttr('title').tooltip('destroy');
        }
    }
    ;
    Drupal.Ajax.prototype.setProgressIndicatorThrobber = function() {
        var $element = $(this.element);
        var $glyphicon = this.glyphiconStart($element, this.progress.message);
        if ($glyphicon[0]) {
            this.progress.element = $glyphicon.parent();
            this.progress.glyphicon = true;
            return;
        }
        if (!this.progress.element)
            this.progress.element = $(Drupal.theme('ajaxThrobber'));
        if (this.progress.message)
            this.progress.element.after('<div class="message">' + this.progress.message + '</div>');
        if ($element.is('input'))
            $element.after(this.progress.element);
        else
            $element.append(this.progress.element);
    }
    ;
    var success = Drupal.Ajax.prototype.success;
    Drupal.Ajax.prototype.success = function(response, status) {
        if (this.progress.element) {
            if (this.progress.glyphicon)
                this.glyphiconStop(this.progress.element);
            else
                this.progress.element.remove();
            this.progress.element.parent().find('.message').remove();
        }
        return success.apply(this, [response, status]);
    }
    ;
}
)(jQuery, this, Drupal, drupalSettings);
;(function($) {
    'use strict';
    Drupal.AjaxCommands.prototype.colorboxLoadOpen = function(ajax, response) {
        $.colorbox($.extend({}, drupalSettings.colorbox, {
            html: response.data,
            width: '90%',
            height: '90%'
        }));
        Drupal.attachBehaviors();
    }
    ;
}
)(jQuery);
;(function($, Drupal, drupalSettings) {
    'use strict';
    Drupal.google_analytics = {};
    $(document).ready(function() {
        $(document.body).on('mousedown keyup touchstart', function(event) {
            $(event.target).closest('a,area').each(function() {
                if (Drupal.google_analytics.isInternal(this.href))
                    if ($(this).is('.colorbox') && (drupalSettings.google_analytics.trackColorbox)) {} else if (drupalSettings.google_analytics.trackDownload && Drupal.google_analytics.isDownload(this.href))
                        gtag('event', Drupal.google_analytics.getDownloadExtension(this.href).toUpperCase(), {
                            event_category: 'Downloads',
                            event_label: Drupal.google_analytics.getPageUrl(this.href),
                            transport_type: 'beacon'
                        });
                    else {
                        if (Drupal.google_analytics.isInternalSpecial(this.href))
                            gtag('config', drupalSettings.google_analytics.account, {
                                page_path: Drupal.google_analytics.getPageUrl(this.href),
                                transport_type: 'beacon'
                            });
                    }
                else if (drupalSettings.google_analytics.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']"))
                    gtag('event', 'Click', {
                        event_category: 'Mails',
                        event_label: this.href.substring(7),
                        transport_type: 'beacon'
                    });
                else if (drupalSettings.google_analytics.trackTel && $(this).is("a[href^='tel:'],area[href^='tel:']"))
                    gtag('event', 'Click', {
                        event_category: 'Telephone calls',
                        event_label: this.href.substring(4),
                        transport_type: 'beacon'
                    });
                else {
                    if (drupalSettings.google_analytics.trackOutbound && this.href.match(/^\w+:\/\//i))
                        if (drupalSettings.google_analytics.trackDomainMode !== 2 || (drupalSettings.google_analytics.trackDomainMode === 2 && !Drupal.google_analytics.isCrossDomain(this.hostname, drupalSettings.google_analytics.trackCrossDomains)))
                            gtag('event', 'Click', {
                                event_category: 'Outbound links',
                                event_label: this.href,
                                transport_type: 'beacon'
                            });
                }
            });
        });
        if (drupalSettings.google_analytics.trackUrlFragments)
            window.onhashchange = function() {
                gtag('config', drupalSettings.google_analytics.account, {
                    page_path: location.pathname + location.search + location.hash
                });
            }
            ;
        if (drupalSettings.google_analytics.trackColorbox)
            $(document).on('cbox_complete', function() {
                var href = $.colorbox.element().attr('href');
                if (href)
                    gtag('config', drupalSettings.google_analytics.account, {
                        page_path: Drupal.google_analytics.getPageUrl(href)
                    });
            });
    });
    Drupal.google_analytics.isCrossDomain = function(hostname, crossDomains) {
        return $.inArray(hostname, crossDomains) > -1 ? true : false;
    }
    ;
    Drupal.google_analytics.isDownload = function(url) {
        var isDownload = new RegExp('\\.(' + drupalSettings.google_analytics.trackDownloadExtensions + ')([\?#].*)?$','i');
        return isDownload.test(url);
    }
    ;
    Drupal.google_analytics.isInternal = function(url) {
        var isInternal = new RegExp('^(https?):\/\/' + window.location.host,'i');
        return isInternal.test(url);
    }
    ;
    Drupal.google_analytics.isInternalSpecial = function(url) {
        var isInternalSpecial = new RegExp('(\/go\/.*)$','i');
        return isInternalSpecial.test(url);
    }
    ;
    Drupal.google_analytics.getPageUrl = function(url) {
        var extractInternalUrl = new RegExp('^(https?):\/\/' + window.location.host,'i');
        return url.replace(extractInternalUrl, '');
    }
    ;
    Drupal.google_analytics.getDownloadExtension = function(url) {
        var extractDownloadextension = new RegExp('\\.(' + drupalSettings.google_analytics.trackDownloadExtensions + ')([\?#].*)?$','i');
        var extension = extractDownloadextension.exec(url);
        return (extension === null) ? '' : extension[1];
    }
    ;
}
)(jQuery, Drupal, drupalSettings);
;(function($, _) {
    var Attributes = function(attributes) {
        this.data = {};
        this.data['class'] = [];
        this.merge(attributes);
    };
    Attributes.prototype.toString = function() {
        var output = '';
        var name, value;
        var checkPlain = function(str) {
            return str && str.toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') || '';
        };
        var data = this.getData();
        for (name in data) {
            if (!data.hasOwnProperty(name))
                continue;
            value = data[name];
            if (_.isFunction(value))
                value = value();
            if (_.isObject(value))
                value = _.values(value);
            if (_.isArray(value))
                value = value.join(' ');
            output += ' ' + checkPlain(name) + '="' + checkPlain(value) + '"';
        }
        return output;
    }
    ;
    Attributes.prototype.toPlainObject = function() {
        var object = {};
        var name, value;
        var data = this.getData();
        for (name in data) {
            if (!data.hasOwnProperty(name))
                continue;
            value = data[name];
            if (_.isFunction(value))
                value = value();
            if (_.isObject(value))
                value = _.values(value);
            if (_.isArray(value))
                value = value.join(' ');
            object[name] = value;
        }
        return object;
    }
    ;
    Attributes.prototype.addClass = function(value) {
        var args = Array.prototype.slice.call(arguments);
        this.data['class'] = this.sanitizeClasses(this.data['class'].concat(args));
        return this;
    }
    ;
    Attributes.prototype.exists = function(name) {
        return this.data[name] !== void (0) && this.data[name] !== null;
    }
    ;
    Attributes.prototype.get = function(name, defaultValue) {
        if (!this.exists(name))
            this.data[name] = defaultValue;
        return this.data[name];
    }
    ;
    Attributes.prototype.getData = function() {
        return _.extend({}, this.data);
    }
    ;
    Attributes.prototype.getClasses = function() {
        return this.get('class', []);
    }
    ;
    Attributes.prototype.hasClass = function(className) {
        className = this.sanitizeClasses(Array.prototype.slice.call(arguments));
        var classes = this.getClasses();
        for (var i = 0, l = className.length; i < l; i++)
            if (_.indexOf(classes, className[i]) === -1)
                return false;
        return true;
    }
    ;
    Attributes.prototype.merge = function(object, recursive) {
        if (!object)
            return this;
        if (object instanceof $)
            object = object[0];
        if (object instanceof Node)
            object = Array.prototype.slice.call(object.attributes).reduce(function(attributes, attribute) {
                attributes[attribute.name] = attribute.value;
                return attributes;
            }, {});
        else if (object instanceof Attributes)
            object = object.getData();
        else
            object = _.extend({}, object);
        if (!$.isPlainObject(object)) {
            setTimeout(function() {
                throw new Error('Passed object is not supported: ' + object);
            });
            return this;
        }
        if (object && object['class'] !== void 0) {
            this.addClass(object['class']);
            delete object['class'];
        }
        if (recursive === void 0 || recursive)
            this.data = $.extend(true, {}, this.data, object);
        else
            this.data = $.extend({}, this.data, object);
        return this;
    }
    ;
    Attributes.prototype.remove = function(name) {
        if (this.exists(name))
            delete this.data[name];
        return this;
    }
    ;
    Attributes.prototype.removeClass = function(className) {
        var remove = this.sanitizeClasses(Array.prototype.slice.apply(arguments));
        this.data['class'] = _.without(this.getClasses(), remove);
        return this;
    }
    ;
    Attributes.prototype.replaceClass = function(oldValue, newValue) {
        var classes = this.getClasses();
        var i = _.indexOf(this.sanitizeClasses(oldValue), classes);
        if (i >= 0) {
            classes[i] = newValue;
            this.set('class', classes);
        }
        return this;
    }
    ;
    Attributes.prototype.sanitizeClasses = function(classes) {
        return _.chain(Array.prototype.slice.call(arguments)).flatten().map(function(string) {
            return string.split(' ');
        }).flatten().filter().map(function(value) {
            return Attributes.cleanClass(value);
        }).uniq().value();
    }
    ;
    Attributes.prototype.set = function(name, value) {
        var obj = $.isPlainObject(name) ? name : {};
        if (typeof name === 'string')
            obj[name] = value;
        return this.merge(obj);
    }
    ;
    Attributes.cleanClass = function(identifier, filter) {
        filter = filter || {
            ' ': '-',
            '_': '-',
            '/': '-',
            '[': '-',
            ']': ''
        };
        identifier = identifier.toLowerCase();
        if (filter['__'] === void 0)
            identifier = identifier.replace('__', '#DOUBLE_UNDERSCORE#');
        identifier = identifier.replace(Object.keys(filter), Object.keys(filter).map(function(key) {
            return filter[key];
        }));
        if (filter['__'] === void 0)
            identifier = identifier.replace('#DOUBLE_UNDERSCORE#', '__');
        identifier = identifier.replace(/[^\u002D\u0030-\u0039\u0041-\u005A\u005F\u0061-\u007A\u00A1-\uFFFF]/g, '');
        identifier = identifier.replace(['/^[0-9]/', '/^(-[0-9])|^(--)/'], ['_', '__']);
        return identifier;
    }
    ;
    Attributes.create = function(attributes) {
        return new Attributes(attributes);
    }
    ;
    window.Attributes = Attributes;
}
)(window.jQuery, window._);
;