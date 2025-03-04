/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/safe-blur-min.js. */
!function(e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery)
}((function(e) {
    "use strict";
    return e.ui.safeBlur = function(n) {
        n && "body" !== n.nodeName.toLowerCase() && e(n).trigger("blur")
    }
}
));
/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/safe-blur-min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widget-min.js. */
/*!
 * jQuery UI Widget 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "./version"], t) : t(jQuery)
}((function(t) {
    "use strict";
    var e, i = 0, s = Array.prototype.hasOwnProperty, n = Array.prototype.slice;
    return t.cleanData = (e = t.cleanData,
    function(i) {
        var s, n, o;
        for (o = 0; null != (n = i[o]); o++)
            (s = t._data(n, "events")) && s.remove && t(n).triggerHandler("remove");
        e(i)
    }
    ),
    t.widget = function(e, i, s) {
        var n, o, a, r = {}, l = e.split(".")[0], u = l + "-" + (e = e.split(".")[1]);
        return s || (s = i,
        i = t.Widget),
        Array.isArray(s) && (s = t.extend.apply(null, [{}].concat(s))),
        t.expr.pseudos[u.toLowerCase()] = function(e) {
            return !!t.data(e, u)
        }
        ,
        t[l] = t[l] || {},
        n = t[l][e],
        o = t[l][e] = function(t, e) {
            if (!this || !this._createWidget)
                return new o(t,e);
            arguments.length && this._createWidget(t, e)
        }
        ,
        t.extend(o, n, {
            version: s.version,
            _proto: t.extend({}, s),
            _childConstructors: []
        }),
        (a = new i).options = t.widget.extend({}, a.options),
        t.each(s, (function(t, e) {
            r[t] = "function" == typeof e ? function() {
                function s() {
                    return i.prototype[t].apply(this, arguments)
                }
                function n(e) {
                    return i.prototype[t].apply(this, e)
                }
                return function() {
                    var t, i = this._super, o = this._superApply;
                    return this._super = s,
                    this._superApply = n,
                    t = e.apply(this, arguments),
                    this._super = i,
                    this._superApply = o,
                    t
                }
            }() : e
        }
        )),
        o.prototype = t.widget.extend(a, {
            widgetEventPrefix: n && a.widgetEventPrefix || e
        }, r, {
            constructor: o,
            namespace: l,
            widgetName: e,
            widgetFullName: u
        }),
        n ? (t.each(n._childConstructors, (function(e, i) {
            var s = i.prototype;
            t.widget(s.namespace + "." + s.widgetName, o, i._proto)
        }
        )),
        delete n._childConstructors) : i._childConstructors.push(o),
        t.widget.bridge(e, o),
        o
    }
    ,
    t.widget.extend = function(e) {
        for (var i, o, a = n.call(arguments, 1), r = 0, l = a.length; r < l; r++)
            for (i in a[r])
                o = a[r][i],
                s.call(a[r], i) && void 0 !== o && (t.isPlainObject(o) ? e[i] = t.isPlainObject(e[i]) ? t.widget.extend({}, e[i], o) : t.widget.extend({}, o) : e[i] = o);
        return e
    }
    ,
    t.widget.bridge = function(e, i) {
        var s = i.prototype.widgetFullName || e;
        t.fn[e] = function(o) {
            var a = "string" == typeof o
              , r = n.call(arguments, 1)
              , l = this;
            return a ? this.length || "instance" !== o ? this.each((function() {
                var i, n = t.data(this, s);
                return "instance" === o ? (l = n,
                !1) : n ? "function" != typeof n[o] || "_" === o.charAt(0) ? t.error("no such method '" + o + "' for " + e + " widget instance") : (i = n[o].apply(n, r)) !== n && void 0 !== i ? (l = i && i.jquery ? l.pushStack(i.get()) : i,
                !1) : void 0 : t.error("cannot call methods on " + e + " prior to initialization; attempted to call method '" + o + "'")
            }
            )) : l = void 0 : (r.length && (o = t.widget.extend.apply(null, [o].concat(r))),
            this.each((function() {
                var e = t.data(this, s);
                e ? (e.option(o || {}),
                e._init && e._init()) : t.data(this, s, new i(o,this))
            }
            ))),
            l
        }
    }
    ,
    t.Widget = function() {}
    ,
    t.Widget._childConstructors = [],
    t.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            classes: {},
            disabled: !1,
            create: null
        },
        _createWidget: function(e, s) {
            s = t(s || this.defaultElement || this)[0],
            this.element = t(s),
            this.uuid = i++,
            this.eventNamespace = "." + this.widgetName + this.uuid,
            this.bindings = t(),
            this.hoverable = t(),
            this.focusable = t(),
            this.classesElementLookup = {},
            s !== this && (t.data(s, this.widgetFullName, this),
            this._on(!0, this.element, {
                remove: function(t) {
                    t.target === s && this.destroy()
                }
            }),
            this.document = t(s.style ? s.ownerDocument : s.document || s),
            this.window = t(this.document[0].defaultView || this.document[0].parentWindow)),
            this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e),
            this._create(),
            this.options.disabled && this._setOptionDisabled(this.options.disabled),
            this._trigger("create", null, this._getCreateEventData()),
            this._init()
        },
        _getCreateOptions: function() {
            return {}
        },
        _getCreateEventData: t.noop,
        _create: t.noop,
        _init: t.noop,
        destroy: function() {
            var e = this;
            this._destroy(),
            t.each(this.classesElementLookup, (function(t, i) {
                e._removeClass(i, t)
            }
            )),
            this.element.off(this.eventNamespace).removeData(this.widgetFullName),
            this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),
            this.bindings.off(this.eventNamespace)
        },
        _destroy: t.noop,
        widget: function() {
            return this.element
        },
        option: function(e, i) {
            var s, n, o, a = e;
            if (0 === arguments.length)
                return t.widget.extend({}, this.options);
            if ("string" == typeof e)
                if (a = {},
                s = e.split("."),
                e = s.shift(),
                s.length) {
                    for (n = a[e] = t.widget.extend({}, this.options[e]),
                    o = 0; o < s.length - 1; o++)
                        n[s[o]] = n[s[o]] || {},
                        n = n[s[o]];
                    if (e = s.pop(),
                    1 === arguments.length)
                        return void 0 === n[e] ? null : n[e];
                    n[e] = i
                } else {
                    if (1 === arguments.length)
                        return void 0 === this.options[e] ? null : this.options[e];
                    a[e] = i
                }
            return this._setOptions(a),
            this
        },
        _setOptions: function(t) {
            var e;
            for (e in t)
                this._setOption(e, t[e]);
            return this
        },
        _setOption: function(t, e) {
            return "classes" === t && this._setOptionClasses(e),
            this.options[t] = e,
            "disabled" === t && this._setOptionDisabled(e),
            this
        },
        _setOptionClasses: function(e) {
            var i, s, n;
            for (i in e)
                n = this.classesElementLookup[i],
                e[i] !== this.options.classes[i] && n && n.length && (s = t(n.get()),
                this._removeClass(n, i),
                s.addClass(this._classes({
                    element: s,
                    keys: i,
                    classes: e,
                    add: !0
                })))
        },
        _setOptionDisabled: function(t) {
            this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!t),
            t && (this._removeClass(this.hoverable, null, "ui-state-hover"),
            this._removeClass(this.focusable, null, "ui-state-focus"))
        },
        enable: function() {
            return this._setOptions({
                disabled: !1
            })
        },
        disable: function() {
            return this._setOptions({
                disabled: !0
            })
        },
        _classes: function(e) {
            var i = []
              , s = this;
            function n() {
                var i = [];
                e.element.each((function(e, n) {
                    t.map(s.classesElementLookup, (function(t) {
                        return t
                    }
                    )).some((function(t) {
                        return t.is(n)
                    }
                    )) || i.push(n)
                }
                )),
                s._on(t(i), {
                    remove: "_untrackClassesElement"
                })
            }
            function o(o, a) {
                var r, l;
                for (l = 0; l < o.length; l++)
                    r = s.classesElementLookup[o[l]] || t(),
                    e.add ? (n(),
                    r = t(t.uniqueSort(r.get().concat(e.element.get())))) : r = t(r.not(e.element).get()),
                    s.classesElementLookup[o[l]] = r,
                    i.push(o[l]),
                    a && e.classes[o[l]] && i.push(e.classes[o[l]])
            }
            return (e = t.extend({
                element: this.element,
                classes: this.options.classes || {}
            }, e)).keys && o(e.keys.match(/\S+/g) || [], !0),
            e.extra && o(e.extra.match(/\S+/g) || []),
            i.join(" ")
        },
        _untrackClassesElement: function(e) {
            var i = this;
            t.each(i.classesElementLookup, (function(s, n) {
                -1 !== t.inArray(e.target, n) && (i.classesElementLookup[s] = t(n.not(e.target).get()))
            }
            )),
            this._off(t(e.target))
        },
        _removeClass: function(t, e, i) {
            return this._toggleClass(t, e, i, !1)
        },
        _addClass: function(t, e, i) {
            return this._toggleClass(t, e, i, !0)
        },
        _toggleClass: function(t, e, i, s) {
            s = "boolean" == typeof s ? s : i;
            var n = "string" == typeof t || null === t
              , o = {
                extra: n ? e : i,
                keys: n ? t : e,
                element: n ? this.element : t,
                add: s
            };
            return o.element.toggleClass(this._classes(o), s),
            this
        },
        _on: function(e, i, s) {
            var n, o = this;
            "boolean" != typeof e && (s = i,
            i = e,
            e = !1),
            s ? (i = n = t(i),
            this.bindings = this.bindings.add(i)) : (s = i,
            i = this.element,
            n = this.widget()),
            t.each(s, (function(s, a) {
                function r() {
                    if (e || !0 !== o.options.disabled && !t(this).hasClass("ui-state-disabled"))
                        return ("string" == typeof a ? o[a] : a).apply(o, arguments)
                }
                "string" != typeof a && (r.guid = a.guid = a.guid || r.guid || t.guid++);
                var l = s.match(/^([\w:-]*)\s*(.*)$/)
                  , u = l[1] + o.eventNamespace
                  , h = l[2];
                h ? n.on(u, h, r) : i.on(u, r)
            }
            ))
        },
        _off: function(e, i) {
            i = (i || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace,
            e.off(i),
            this.bindings = t(this.bindings.not(e).get()),
            this.focusable = t(this.focusable.not(e).get()),
            this.hoverable = t(this.hoverable.not(e).get())
        },
        _delay: function(t, e) {
            var i = this;
            return setTimeout((function() {
                return ("string" == typeof t ? i[t] : t).apply(i, arguments)
            }
            ), e || 0)
        },
        _hoverable: function(e) {
            this.hoverable = this.hoverable.add(e),
            this._on(e, {
                mouseenter: function(e) {
                    this._addClass(t(e.currentTarget), null, "ui-state-hover")
                },
                mouseleave: function(e) {
                    this._removeClass(t(e.currentTarget), null, "ui-state-hover")
                }
            })
        },
        _focusable: function(e) {
            this.focusable = this.focusable.add(e),
            this._on(e, {
                focusin: function(e) {
                    this._addClass(t(e.currentTarget), null, "ui-state-focus")
                },
                focusout: function(e) {
                    this._removeClass(t(e.currentTarget), null, "ui-state-focus")
                }
            })
        },
        _trigger: function(e, i, s) {
            var n, o, a = this.options[e];
            if (s = s || {},
            (i = t.Event(i)).type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(),
            i.target = this.element[0],
            o = i.originalEvent)
                for (n in o)
                    n in i || (i[n] = o[n]);
            return this.element.trigger(i, s),
            !("function" == typeof a && !1 === a.apply(this.element[0], [i].concat(s)) || i.isDefaultPrevented())
        }
    },
    t.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, (function(e, i) {
        t.Widget.prototype["_" + e] = function(s, n, o) {
            var a;
            "string" == typeof n && (n = {
                effect: n
            });
            var r = n ? !0 === n || "number" == typeof n ? i : n.effect || i : e;
            "number" == typeof (n = n || {}) ? n = {
                duration: n
            } : !0 === n && (n = {}),
            a = !t.isEmptyObject(n),
            n.complete = o,
            n.delay && s.delay(n.delay),
            a && t.effects && t.effects.effect[r] ? s[e](n) : r !== e && s[r] ? s[r](n.duration, n.easing, o) : s.queue((function(i) {
                t(this)[e](),
                o && o.call(s[0]),
                i()
            }
            ))
        }
    }
    )),
    t.widget
}
));

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widget-min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/labels-min.js. */
!function(t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "./version"], t) : t(jQuery)
}((function(t) {
    "use strict";
    return t.fn.labels = function() {
        var e, s, i, n, a;
        return this.length ? this[0].labels && this[0].labels.length ? this.pushStack(this[0].labels) : (n = this.eq(0).parents("label"),
        (i = this.attr("id")) && (a = (e = this.eq(0).parents().last()).add(e.length ? e.siblings() : this.siblings()),
        s = "label[for='" + t.escapeSelector(i) + "']",
        n = n.add(a.find(s).addBack(s))),
        this.pushStack(n)) : this.pushStack([])
    }
}
));
/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/labels-min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/controlgroup-min.js. */
/*!
 * jQuery UI Controlgroup 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "../widget"], t) : t(jQuery)
}((function(t) {
    "use strict";
    var e = /ui-corner-([a-z]){2,6}/g;
    return t.widget("ui.controlgroup", {
        version: "1.13.2",
        defaultElement: "<div>",
        options: {
            direction: "horizontal",
            disabled: null,
            onlyVisible: !0,
            items: {
                button: "input[type=button], input[type=submit], input[type=reset], button, a",
                controlgroupLabel: ".ui-controlgroup-label",
                checkboxradio: "input[type='checkbox'], input[type='radio']",
                selectmenu: "select",
                spinner: ".ui-spinner-input"
            }
        },
        _create: function() {
            this._enhance()
        },
        _enhance: function() {
            this.element.attr("role", "toolbar"),
            this.refresh()
        },
        _destroy: function() {
            this._callChildMethod("destroy"),
            this.childWidgets.removeData("ui-controlgroup-data"),
            this.element.removeAttr("role"),
            this.options.items.controlgroupLabel && this.element.find(this.options.items.controlgroupLabel).find(".ui-controlgroup-label-contents").contents().unwrap()
        },
        _initWidgets: function() {
            var e = this
              , i = [];
            t.each(this.options.items, (function(n, o) {
                var s, l = {};
                if (o)
                    return "controlgroupLabel" === n ? ((s = e.element.find(o)).each((function() {
                        var e = t(this);
                        e.children(".ui-controlgroup-label-contents").length || e.contents().wrapAll("<span class='ui-controlgroup-label-contents'></span>")
                    }
                    )),
                    e._addClass(s, null, "ui-widget ui-widget-content ui-state-default"),
                    void (i = i.concat(s.get()))) : void (t.fn[n] && (l = e["_" + n + "Options"] ? e["_" + n + "Options"]("middle") : {
                        classes: {}
                    },
                    e.element.find(o).each((function() {
                        var o = t(this)
                          , s = o[n]("instance")
                          , r = t.widget.extend({}, l);
                        if ("button" !== n || !o.parent(".ui-spinner").length) {
                            s || (s = o[n]()[n]("instance")),
                            s && (r.classes = e._resolveClassesValues(r.classes, s)),
                            o[n](r);
                            var u = o[n]("widget");
                            t.data(u[0], "ui-controlgroup-data", s || o[n]("instance")),
                            i.push(u[0])
                        }
                    }
                    ))))
            }
            )),
            this.childWidgets = t(t.uniqueSort(i)),
            this._addClass(this.childWidgets, "ui-controlgroup-item")
        },
        _callChildMethod: function(e) {
            this.childWidgets.each((function() {
                var i = t(this).data("ui-controlgroup-data");
                i && i[e] && i[e]()
            }
            ))
        },
        _updateCornerClass: function(t, e) {
            var i = this._buildSimpleOptions(e, "label").classes.label;
            this._removeClass(t, null, "ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all"),
            this._addClass(t, null, i)
        },
        _buildSimpleOptions: function(t, e) {
            var i = "vertical" === this.options.direction
              , n = {
                classes: {}
            };
            return n.classes[e] = {
                middle: "",
                first: "ui-corner-" + (i ? "top" : "left"),
                last: "ui-corner-" + (i ? "bottom" : "right"),
                only: "ui-corner-all"
            }[t],
            n
        },
        _spinnerOptions: function(t) {
            var e = this._buildSimpleOptions(t, "ui-spinner");
            return e.classes["ui-spinner-up"] = "",
            e.classes["ui-spinner-down"] = "",
            e
        },
        _buttonOptions: function(t) {
            return this._buildSimpleOptions(t, "ui-button")
        },
        _checkboxradioOptions: function(t) {
            return this._buildSimpleOptions(t, "ui-checkboxradio-label")
        },
        _selectmenuOptions: function(t) {
            var e = "vertical" === this.options.direction;
            return {
                width: !!e && "auto",
                classes: {
                    middle: {
                        "ui-selectmenu-button-open": "",
                        "ui-selectmenu-button-closed": ""
                    },
                    first: {
                        "ui-selectmenu-button-open": "ui-corner-" + (e ? "top" : "tl"),
                        "ui-selectmenu-button-closed": "ui-corner-" + (e ? "top" : "left")
                    },
                    last: {
                        "ui-selectmenu-button-open": e ? "" : "ui-corner-tr",
                        "ui-selectmenu-button-closed": "ui-corner-" + (e ? "bottom" : "right")
                    },
                    only: {
                        "ui-selectmenu-button-open": "ui-corner-top",
                        "ui-selectmenu-button-closed": "ui-corner-all"
                    }
                }[t]
            }
        },
        _resolveClassesValues: function(i, n) {
            var o = {};
            return t.each(i, (function(t) {
                var s = n.options.classes[t] || "";
                s = String.prototype.trim.call(s.replace(e, "")),
                o[t] = (s + " " + i[t]).replace(/\s+/g, " ")
            }
            )),
            o
        },
        _setOption: function(t, e) {
            "direction" === t && this._removeClass("ui-controlgroup-" + this.options.direction),
            this._super(t, e),
            "disabled" !== t ? this.refresh() : this._callChildMethod(e ? "disable" : "enable")
        },
        refresh: function() {
            var e, i = this;
            this._addClass("ui-controlgroup ui-controlgroup-" + this.options.direction),
            "horizontal" === this.options.direction && this._addClass(null, "ui-helper-clearfix"),
            this._initWidgets(),
            e = this.childWidgets,
            this.options.onlyVisible && (e = e.filter(":visible")),
            e.length && (t.each(["first", "last"], (function(t, n) {
                var o = e[n]().data("ui-controlgroup-data");
                if (o && i["_" + o.widgetName + "Options"]) {
                    var s = i["_" + o.widgetName + "Options"](1 === e.length ? "only" : n);
                    s.classes = i._resolveClassesValues(s.classes, o),
                    o.element[o.widgetName](s)
                } else
                    i._updateCornerClass(e[n](), n)
            }
            )),
            this._callChildMethod("refresh"))
        }
    })
}
));

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/controlgroup-min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/form-reset-mixin-min.js. */
!function(e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "./form", "./version"], e) : e(jQuery)
}((function(e) {
    "use strict";
    return e.ui.formResetMixin = {
        _formResetHandler: function() {
            var t = e(this);
            setTimeout((function() {
                var r = t.data("ui-form-reset-instances");
                e.each(r, (function() {
                    this.refresh()
                }
                ))
            }
            ))
        },
        _bindFormResetHandler: function() {
            if (this.form = this.element._form(),
            this.form.length) {
                var e = this.form.data("ui-form-reset-instances") || [];
                e.length || this.form.on("reset.ui-form-reset", this._formResetHandler),
                e.push(this),
                this.form.data("ui-form-reset-instances", e)
            }
        },
        _unbindFormResetHandler: function() {
            if (this.form.length) {
                var t = this.form.data("ui-form-reset-instances");
                t.splice(e.inArray(this, t), 1),
                t.length ? this.form.data("ui-form-reset-instances", t) : this.form.removeData("ui-form-reset-instances").off("reset.ui-form-reset")
            }
        }
    }
}
));
/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/form-reset-mixin-min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/mouse-min.js. */
/*!
 * jQuery UI Mouse 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "../ie", "../version", "../widget"], e) : e(jQuery)
}((function(e) {
    "use strict";
    var t = !1;
    return e(document).on("mouseup", (function() {
        t = !1
    }
    )),
    e.widget("ui.mouse", {
        version: "1.13.2",
        options: {
            cancel: "input, textarea, button, select, option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var t = this;
            this.element.on("mousedown." + this.widgetName, (function(e) {
                return t._mouseDown(e)
            }
            )).on("click." + this.widgetName, (function(i) {
                if (!0 === e.data(i.target, t.widgetName + ".preventClickEvent"))
                    return e.removeData(i.target, t.widgetName + ".preventClickEvent"),
                    i.stopImmediatePropagation(),
                    !1
            }
            )),
            this.started = !1
        },
        _mouseDestroy: function() {
            this.element.off("." + this.widgetName),
            this._mouseMoveDelegate && this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function(i) {
            if (!t) {
                this._mouseMoved = !1,
                this._mouseStarted && this._mouseUp(i),
                this._mouseDownEvent = i;
                var s = this
                  , o = 1 === i.which
                  , n = !("string" != typeof this.options.cancel || !i.target.nodeName) && e(i.target).closest(this.options.cancel).length;
                return !(o && !n && this._mouseCapture(i)) || (this.mouseDelayMet = !this.options.delay,
                this.mouseDelayMet || (this._mouseDelayTimer = setTimeout((function() {
                    s.mouseDelayMet = !0
                }
                ), this.options.delay)),
                this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = !1 !== this._mouseStart(i),
                !this._mouseStarted) ? (i.preventDefault(),
                !0) : (!0 === e.data(i.target, this.widgetName + ".preventClickEvent") && e.removeData(i.target, this.widgetName + ".preventClickEvent"),
                this._mouseMoveDelegate = function(e) {
                    return s._mouseMove(e)
                }
                ,
                this._mouseUpDelegate = function(e) {
                    return s._mouseUp(e)
                }
                ,
                this.document.on("mousemove." + this.widgetName, this._mouseMoveDelegate).on("mouseup." + this.widgetName, this._mouseUpDelegate),
                i.preventDefault(),
                t = !0,
                !0))
            }
        },
        _mouseMove: function(t) {
            if (this._mouseMoved) {
                if (e.ui.ie && (!document.documentMode || document.documentMode < 9) && !t.button)
                    return this._mouseUp(t);
                if (!t.which)
                    if (t.originalEvent.altKey || t.originalEvent.ctrlKey || t.originalEvent.metaKey || t.originalEvent.shiftKey)
                        this.ignoreMissingWhich = !0;
                    else if (!this.ignoreMissingWhich)
                        return this._mouseUp(t)
            }
            return (t.which || t.button) && (this._mouseMoved = !0),
            this._mouseStarted ? (this._mouseDrag(t),
            t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = !1 !== this._mouseStart(this._mouseDownEvent, t),
            this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)),
            !this._mouseStarted)
        },
        _mouseUp: function(i) {
            this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate),
            this._mouseStarted && (this._mouseStarted = !1,
            i.target === this._mouseDownEvent.target && e.data(i.target, this.widgetName + ".preventClickEvent", !0),
            this._mouseStop(i)),
            this._mouseDelayTimer && (clearTimeout(this._mouseDelayTimer),
            delete this._mouseDelayTimer),
            this.ignoreMissingWhich = !1,
            t = !1,
            i.preventDefault()
        },
        _mouseDistanceMet: function(e) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return !0
        }
    })
}
));

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/mouse-min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/checkboxradio-min.js. */
/*!
 * jQuery UI Checkboxradio 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "../form-reset-mixin", "../labels", "../widget"], e) : e(jQuery)
}((function(e) {
    "use strict";
    return e.widget("ui.checkboxradio", [e.ui.formResetMixin, {
        version: "1.13.2",
        options: {
            disabled: null,
            label: null,
            icon: !0,
            classes: {
                "ui-checkboxradio-label": "ui-corner-all",
                "ui-checkboxradio-icon": "ui-corner-all"
            }
        },
        _getCreateOptions: function() {
            var i, t, s, n = this._super() || {};
            return this._readType(),
            t = this.element.labels(),
            this.label = e(t[t.length - 1]),
            this.label.length || e.error("No label found for checkboxradio widget"),
            this.originalLabel = "",
            (s = this.label.contents().not(this.element[0])).length && (this.originalLabel += s.clone().wrapAll("<div></div>").parent().html()),
            this.originalLabel && (n.label = this.originalLabel),
            null != (i = this.element[0].disabled) && (n.disabled = i),
            n
        },
        _create: function() {
            var e = this.element[0].checked;
            this._bindFormResetHandler(),
            null == this.options.disabled && (this.options.disabled = this.element[0].disabled),
            this._setOption("disabled", this.options.disabled),
            this._addClass("ui-checkboxradio", "ui-helper-hidden-accessible"),
            this._addClass(this.label, "ui-checkboxradio-label", "ui-button ui-widget"),
            "radio" === this.type && this._addClass(this.label, "ui-checkboxradio-radio-label"),
            this.options.label && this.options.label !== this.originalLabel ? this._updateLabel() : this.originalLabel && (this.options.label = this.originalLabel),
            this._enhance(),
            e && this._addClass(this.label, "ui-checkboxradio-checked", "ui-state-active"),
            this._on({
                change: "_toggleClasses",
                focus: function() {
                    this._addClass(this.label, null, "ui-state-focus ui-visual-focus")
                },
                blur: function() {
                    this._removeClass(this.label, null, "ui-state-focus ui-visual-focus")
                }
            })
        },
        _readType: function() {
            var i = this.element[0].nodeName.toLowerCase();
            this.type = this.element[0].type,
            "input" === i && /radio|checkbox/.test(this.type) || e.error("Can't create checkboxradio on element.nodeName=" + i + " and element.type=" + this.type)
        },
        _enhance: function() {
            this._updateIcon(this.element[0].checked)
        },
        widget: function() {
            return this.label
        },
        _getRadioGroup: function() {
            var i = this.element[0].name
              , t = "input[name='" + e.escapeSelector(i) + "']";
            return i ? (this.form.length ? e(this.form[0].elements).filter(t) : e(t).filter((function() {
                return 0 === e(this)._form().length
            }
            ))).not(this.element) : e([])
        },
        _toggleClasses: function() {
            var i = this.element[0].checked;
            this._toggleClass(this.label, "ui-checkboxradio-checked", "ui-state-active", i),
            this.options.icon && "checkbox" === this.type && this._toggleClass(this.icon, null, "ui-icon-check ui-state-checked", i)._toggleClass(this.icon, null, "ui-icon-blank", !i),
            "radio" === this.type && this._getRadioGroup().each((function() {
                var i = e(this).checkboxradio("instance");
                i && i._removeClass(i.label, "ui-checkboxradio-checked", "ui-state-active")
            }
            ))
        },
        _destroy: function() {
            this._unbindFormResetHandler(),
            this.icon && (this.icon.remove(),
            this.iconSpace.remove())
        },
        _setOption: function(e, i) {
            if ("label" !== e || i) {
                if (this._super(e, i),
                "disabled" === e)
                    return this._toggleClass(this.label, null, "ui-state-disabled", i),
                    void (this.element[0].disabled = i);
                this.refresh()
            }
        },
        _updateIcon: function(i) {
            var t = "ui-icon ui-icon-background ";
            this.options.icon ? (this.icon || (this.icon = e("<span>"),
            this.iconSpace = e("<span> </span>"),
            this._addClass(this.iconSpace, "ui-checkboxradio-icon-space")),
            "checkbox" === this.type ? (t += i ? "ui-icon-check ui-state-checked" : "ui-icon-blank",
            this._removeClass(this.icon, null, i ? "ui-icon-blank" : "ui-icon-check")) : t += "ui-icon-blank",
            this._addClass(this.icon, "ui-checkboxradio-icon", t),
            i || this._removeClass(this.icon, null, "ui-icon-check ui-state-checked"),
            this.icon.prependTo(this.label).after(this.iconSpace)) : void 0 !== this.icon && (this.icon.remove(),
            this.iconSpace.remove(),
            delete this.icon)
        },
        _updateLabel: function() {
            var e = this.label.contents().not(this.element[0]);
            this.icon && (e = e.not(this.icon[0])),
            this.iconSpace && (e = e.not(this.iconSpace[0])),
            e.remove(),
            this.label.append(this.options.label)
        },
        refresh: function() {
            var e = this.element[0].checked
              , i = this.element[0].disabled;
            this._updateIcon(e),
            this._toggleClass(this.label, "ui-checkboxradio-checked", "ui-state-active", e),
            null !== this.options.label && this._updateLabel(),
            i !== this.options.disabled && this._setOptions({
                disabled: i
            })
        }
    }]),
    e.ui.checkboxradio
}
));

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/checkboxradio-min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/draggable-min.js. */
/*!
 * jQuery UI Draggable 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "./mouse", "../data", "../plugin", "../safe-active-element", "../safe-blur", "../scroll-parent", "../version", "../widget"], t) : t(jQuery)
}((function(t) {
    "use strict";
    return t.widget("ui.draggable", t.ui.mouse, {
        version: "1.13.2",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1,
            drag: null,
            start: null,
            stop: null
        },
        _create: function() {
            "original" === this.options.helper && this._setPositionRelative(),
            this.options.addClasses && this._addClass("ui-draggable"),
            this._setHandleClassName(),
            this._mouseInit()
        },
        _setOption: function(t, e) {
            this._super(t, e),
            "handle" === t && (this._removeHandleClassName(),
            this._setHandleClassName())
        },
        _destroy: function() {
            (this.helper || this.element).is(".ui-draggable-dragging") ? this.destroyOnClear = !0 : (this._removeHandleClassName(),
            this._mouseDestroy())
        },
        _mouseCapture: function(e) {
            var s = this.options;
            return !(this.helper || s.disabled || t(e.target).closest(".ui-resizable-handle").length > 0) && (this.handle = this._getHandle(e),
            !!this.handle && (this._blurActiveElement(e),
            this._blockFrames(!0 === s.iframeFix ? "iframe" : s.iframeFix),
            !0))
        },
        _blockFrames: function(e) {
            this.iframeBlocks = this.document.find(e).map((function() {
                var e = t(this);
                return t("<div>").css("position", "absolute").appendTo(e.parent()).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).offset(e.offset())[0]
            }
            ))
        },
        _unblockFrames: function() {
            this.iframeBlocks && (this.iframeBlocks.remove(),
            delete this.iframeBlocks)
        },
        _blurActiveElement: function(e) {
            var s = t.ui.safeActiveElement(this.document[0]);
            t(e.target).closest(s).length || t.ui.safeBlur(s)
        },
        _mouseStart: function(e) {
            var s = this.options;
            return this.helper = this._createHelper(e),
            this._addClass(this.helper, "ui-draggable-dragging"),
            this._cacheHelperProportions(),
            t.ui.ddmanager && (t.ui.ddmanager.current = this),
            this._cacheMargins(),
            this.cssPosition = this.helper.css("position"),
            this.scrollParent = this.helper.scrollParent(!0),
            this.offsetParent = this.helper.offsetParent(),
            this.hasFixedAncestor = this.helper.parents().filter((function() {
                return "fixed" === t(this).css("position")
            }
            )).length > 0,
            this.positionAbs = this.element.offset(),
            this._refreshOffsets(e),
            this.originalPosition = this.position = this._generatePosition(e, !1),
            this.originalPageX = e.pageX,
            this.originalPageY = e.pageY,
            s.cursorAt && this._adjustOffsetFromHelper(s.cursorAt),
            this._setContainment(),
            !1 === this._trigger("start", e) ? (this._clear(),
            !1) : (this._cacheHelperProportions(),
            t.ui.ddmanager && !s.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e),
            this._mouseDrag(e, !0),
            t.ui.ddmanager && t.ui.ddmanager.dragStart(this, e),
            !0)
        },
        _refreshOffsets: function(t) {
            this.offset = {
                top: this.positionAbs.top - this.margins.top,
                left: this.positionAbs.left - this.margins.left,
                scroll: !1,
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            },
            this.offset.click = {
                left: t.pageX - this.offset.left,
                top: t.pageY - this.offset.top
            }
        },
        _mouseDrag: function(e, s) {
            if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()),
            this.position = this._generatePosition(e, !0),
            this.positionAbs = this._convertPositionTo("absolute"),
            !s) {
                var i = this._uiHash();
                if (!1 === this._trigger("drag", e, i))
                    return this._mouseUp(new t.Event("mouseup",e)),
                    !1;
                this.position = i.position
            }
            return this.helper[0].style.left = this.position.left + "px",
            this.helper[0].style.top = this.position.top + "px",
            t.ui.ddmanager && t.ui.ddmanager.drag(this, e),
            !1
        },
        _mouseStop: function(e) {
            var s = this
              , i = !1;
            return t.ui.ddmanager && !this.options.dropBehaviour && (i = t.ui.ddmanager.drop(this, e)),
            this.dropped && (i = this.dropped,
            this.dropped = !1),
            "invalid" === this.options.revert && !i || "valid" === this.options.revert && i || !0 === this.options.revert || "function" == typeof this.options.revert && this.options.revert.call(this.element, i) ? t(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), (function() {
                !1 !== s._trigger("stop", e) && s._clear()
            }
            )) : !1 !== this._trigger("stop", e) && this._clear(),
            !1
        },
        _mouseUp: function(e) {
            return this._unblockFrames(),
            t.ui.ddmanager && t.ui.ddmanager.dragStop(this, e),
            this.handleElement.is(e.target) && this.element.trigger("focus"),
            t.ui.mouse.prototype._mouseUp.call(this, e)
        },
        cancel: function() {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp(new t.Event("mouseup",{
                target: this.element[0]
            })) : this._clear(),
            this
        },
        _getHandle: function(e) {
            return !this.options.handle || !!t(e.target).closest(this.element.find(this.options.handle)).length
        },
        _setHandleClassName: function() {
            this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element,
            this._addClass(this.handleElement, "ui-draggable-handle")
        },
        _removeHandleClassName: function() {
            this._removeClass(this.handleElement, "ui-draggable-handle")
        },
        _createHelper: function(e) {
            var s = this.options
              , i = "function" == typeof s.helper
              , o = i ? t(s.helper.apply(this.element[0], [e])) : "clone" === s.helper ? this.element.clone().removeAttr("id") : this.element;
            return o.parents("body").length || o.appendTo("parent" === s.appendTo ? this.element[0].parentNode : s.appendTo),
            i && o[0] === this.element[0] && this._setPositionRelative(),
            o[0] === this.element[0] || /(fixed|absolute)/.test(o.css("position")) || o.css("position", "absolute"),
            o
        },
        _setPositionRelative: function() {
            /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative")
        },
        _adjustOffsetFromHelper: function(t) {
            "string" == typeof t && (t = t.split(" ")),
            Array.isArray(t) && (t = {
                left: +t[0],
                top: +t[1] || 0
            }),
            "left"in t && (this.offset.click.left = t.left + this.margins.left),
            "right"in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left),
            "top"in t && (this.offset.click.top = t.top + this.margins.top),
            "bottom"in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
        },
        _isRootNode: function(t) {
            return /(html|body)/i.test(t.tagName) || t === this.document[0]
        },
        _getParentOffset: function() {
            var e = this.offsetParent.offset()
              , s = this.document[0];
            return "absolute" === this.cssPosition && this.scrollParent[0] !== s && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(),
            e.top += this.scrollParent.scrollTop()),
            this._isRootNode(this.offsetParent[0]) && (e = {
                top: 0,
                left: 0
            }),
            {
                top: e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function() {
            if ("relative" !== this.cssPosition)
                return {
                    top: 0,
                    left: 0
                };
            var t = this.element.position()
              , e = this._isRootNode(this.scrollParent[0]);
            return {
                top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + (e ? 0 : this.scrollParent.scrollTop()),
                left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + (e ? 0 : this.scrollParent.scrollLeft())
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function() {
            var e, s, i, o = this.options, n = this.document[0];
            this.relativeContainer = null,
            o.containment ? "window" !== o.containment ? "document" !== o.containment ? o.containment.constructor !== Array ? ("parent" === o.containment && (o.containment = this.helper[0].parentNode),
            (i = (s = t(o.containment))[0]) && (e = /(scroll|auto)/.test(s.css("overflow")),
            this.containment = [(parseInt(s.css("borderLeftWidth"), 10) || 0) + (parseInt(s.css("paddingLeft"), 10) || 0), (parseInt(s.css("borderTopWidth"), 10) || 0) + (parseInt(s.css("paddingTop"), 10) || 0), (e ? Math.max(i.scrollWidth, i.offsetWidth) : i.offsetWidth) - (parseInt(s.css("borderRightWidth"), 10) || 0) - (parseInt(s.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (e ? Math.max(i.scrollHeight, i.offsetHeight) : i.offsetHeight) - (parseInt(s.css("borderBottomWidth"), 10) || 0) - (parseInt(s.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom],
            this.relativeContainer = s)) : this.containment = o.containment : this.containment = [0, 0, t(n).width() - this.helperProportions.width - this.margins.left, (t(n).height() || n.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top] : this.containment = [t(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, t(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, t(window).scrollLeft() + t(window).width() - this.helperProportions.width - this.margins.left, t(window).scrollTop() + (t(window).height() || n.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top] : this.containment = null
        },
        _convertPositionTo: function(t, e) {
            e || (e = this.position);
            var s = "absolute" === t ? 1 : -1
              , i = this._isRootNode(this.scrollParent[0]);
            return {
                top: e.top + this.offset.relative.top * s + this.offset.parent.top * s - ("fixed" === this.cssPosition ? -this.offset.scroll.top : i ? 0 : this.offset.scroll.top) * s,
                left: e.left + this.offset.relative.left * s + this.offset.parent.left * s - ("fixed" === this.cssPosition ? -this.offset.scroll.left : i ? 0 : this.offset.scroll.left) * s
            }
        },
        _generatePosition: function(t, e) {
            var s, i, o, n, r = this.options, l = this._isRootNode(this.scrollParent[0]), a = t.pageX, h = t.pageY;
            return l && this.offset.scroll || (this.offset.scroll = {
                top: this.scrollParent.scrollTop(),
                left: this.scrollParent.scrollLeft()
            }),
            e && (this.containment && (this.relativeContainer ? (i = this.relativeContainer.offset(),
            s = [this.containment[0] + i.left, this.containment[1] + i.top, this.containment[2] + i.left, this.containment[3] + i.top]) : s = this.containment,
            t.pageX - this.offset.click.left < s[0] && (a = s[0] + this.offset.click.left),
            t.pageY - this.offset.click.top < s[1] && (h = s[1] + this.offset.click.top),
            t.pageX - this.offset.click.left > s[2] && (a = s[2] + this.offset.click.left),
            t.pageY - this.offset.click.top > s[3] && (h = s[3] + this.offset.click.top)),
            r.grid && (o = r.grid[1] ? this.originalPageY + Math.round((h - this.originalPageY) / r.grid[1]) * r.grid[1] : this.originalPageY,
            h = s ? o - this.offset.click.top >= s[1] || o - this.offset.click.top > s[3] ? o : o - this.offset.click.top >= s[1] ? o - r.grid[1] : o + r.grid[1] : o,
            n = r.grid[0] ? this.originalPageX + Math.round((a - this.originalPageX) / r.grid[0]) * r.grid[0] : this.originalPageX,
            a = s ? n - this.offset.click.left >= s[0] || n - this.offset.click.left > s[2] ? n : n - this.offset.click.left >= s[0] ? n - r.grid[0] : n + r.grid[0] : n),
            "y" === r.axis && (a = this.originalPageX),
            "x" === r.axis && (h = this.originalPageY)),
            {
                top: h - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : l ? 0 : this.offset.scroll.top),
                left: a - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : l ? 0 : this.offset.scroll.left)
            }
        },
        _clear: function() {
            this._removeClass(this.helper, "ui-draggable-dragging"),
            this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(),
            this.helper = null,
            this.cancelHelperRemoval = !1,
            this.destroyOnClear && this.destroy()
        },
        _trigger: function(e, s, i) {
            return i = i || this._uiHash(),
            t.ui.plugin.call(this, e, [s, i, this], !0),
            /^(drag|start|stop)/.test(e) && (this.positionAbs = this._convertPositionTo("absolute"),
            i.offset = this.positionAbs),
            t.Widget.prototype._trigger.call(this, e, s, i)
        },
        plugins: {},
        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    }),
    t.ui.plugin.add("draggable", "connectToSortable", {
        start: function(e, s, i) {
            var o = t.extend({}, s, {
                item: i.element
            });
            i.sortables = [],
            t(i.options.connectToSortable).each((function() {
                var s = t(this).sortable("instance");
                s && !s.options.disabled && (i.sortables.push(s),
                s.refreshPositions(),
                s._trigger("activate", e, o))
            }
            ))
        },
        stop: function(e, s, i) {
            var o = t.extend({}, s, {
                item: i.element
            });
            i.cancelHelperRemoval = !1,
            t.each(i.sortables, (function() {
                var t = this;
                t.isOver ? (t.isOver = 0,
                i.cancelHelperRemoval = !0,
                t.cancelHelperRemoval = !1,
                t._storedCSS = {
                    position: t.placeholder.css("position"),
                    top: t.placeholder.css("top"),
                    left: t.placeholder.css("left")
                },
                t._mouseStop(e),
                t.options.helper = t.options._helper) : (t.cancelHelperRemoval = !0,
                t._trigger("deactivate", e, o))
            }
            ))
        },
        drag: function(e, s, i) {
            t.each(i.sortables, (function() {
                var o = !1
                  , n = this;
                n.positionAbs = i.positionAbs,
                n.helperProportions = i.helperProportions,
                n.offset.click = i.offset.click,
                n._intersectsWith(n.containerCache) && (o = !0,
                t.each(i.sortables, (function() {
                    return this.positionAbs = i.positionAbs,
                    this.helperProportions = i.helperProportions,
                    this.offset.click = i.offset.click,
                    this !== n && this._intersectsWith(this.containerCache) && t.contains(n.element[0], this.element[0]) && (o = !1),
                    o
                }
                ))),
                o ? (n.isOver || (n.isOver = 1,
                i._parent = s.helper.parent(),
                n.currentItem = s.helper.appendTo(n.element).data("ui-sortable-item", !0),
                n.options._helper = n.options.helper,
                n.options.helper = function() {
                    return s.helper[0]
                }
                ,
                e.target = n.currentItem[0],
                n._mouseCapture(e, !0),
                n._mouseStart(e, !0, !0),
                n.offset.click.top = i.offset.click.top,
                n.offset.click.left = i.offset.click.left,
                n.offset.parent.left -= i.offset.parent.left - n.offset.parent.left,
                n.offset.parent.top -= i.offset.parent.top - n.offset.parent.top,
                i._trigger("toSortable", e),
                i.dropped = n.element,
                t.each(i.sortables, (function() {
                    this.refreshPositions()
                }
                )),
                i.currentItem = i.element,
                n.fromOutside = i),
                n.currentItem && (n._mouseDrag(e),
                s.position = n.position)) : n.isOver && (n.isOver = 0,
                n.cancelHelperRemoval = !0,
                n.options._revert = n.options.revert,
                n.options.revert = !1,
                n._trigger("out", e, n._uiHash(n)),
                n._mouseStop(e, !0),
                n.options.revert = n.options._revert,
                n.options.helper = n.options._helper,
                n.placeholder && n.placeholder.remove(),
                s.helper.appendTo(i._parent),
                i._refreshOffsets(e),
                s.position = i._generatePosition(e, !0),
                i._trigger("fromSortable", e),
                i.dropped = !1,
                t.each(i.sortables, (function() {
                    this.refreshPositions()
                }
                )))
            }
            ))
        }
    }),
    t.ui.plugin.add("draggable", "cursor", {
        start: function(e, s, i) {
            var o = t("body")
              , n = i.options;
            o.css("cursor") && (n._cursor = o.css("cursor")),
            o.css("cursor", n.cursor)
        },
        stop: function(e, s, i) {
            var o = i.options;
            o._cursor && t("body").css("cursor", o._cursor)
        }
    }),
    t.ui.plugin.add("draggable", "opacity", {
        start: function(e, s, i) {
            var o = t(s.helper)
              , n = i.options;
            o.css("opacity") && (n._opacity = o.css("opacity")),
            o.css("opacity", n.opacity)
        },
        stop: function(e, s, i) {
            var o = i.options;
            o._opacity && t(s.helper).css("opacity", o._opacity)
        }
    }),
    t.ui.plugin.add("draggable", "scroll", {
        start: function(t, e, s) {
            s.scrollParentNotHidden || (s.scrollParentNotHidden = s.helper.scrollParent(!1)),
            s.scrollParentNotHidden[0] !== s.document[0] && "HTML" !== s.scrollParentNotHidden[0].tagName && (s.overflowOffset = s.scrollParentNotHidden.offset())
        },
        drag: function(e, s, i) {
            var o = i.options
              , n = !1
              , r = i.scrollParentNotHidden[0]
              , l = i.document[0];
            r !== l && "HTML" !== r.tagName ? (o.axis && "x" === o.axis || (i.overflowOffset.top + r.offsetHeight - e.pageY < o.scrollSensitivity ? r.scrollTop = n = r.scrollTop + o.scrollSpeed : e.pageY - i.overflowOffset.top < o.scrollSensitivity && (r.scrollTop = n = r.scrollTop - o.scrollSpeed)),
            o.axis && "y" === o.axis || (i.overflowOffset.left + r.offsetWidth - e.pageX < o.scrollSensitivity ? r.scrollLeft = n = r.scrollLeft + o.scrollSpeed : e.pageX - i.overflowOffset.left < o.scrollSensitivity && (r.scrollLeft = n = r.scrollLeft - o.scrollSpeed))) : (o.axis && "x" === o.axis || (e.pageY - t(l).scrollTop() < o.scrollSensitivity ? n = t(l).scrollTop(t(l).scrollTop() - o.scrollSpeed) : t(window).height() - (e.pageY - t(l).scrollTop()) < o.scrollSensitivity && (n = t(l).scrollTop(t(l).scrollTop() + o.scrollSpeed))),
            o.axis && "y" === o.axis || (e.pageX - t(l).scrollLeft() < o.scrollSensitivity ? n = t(l).scrollLeft(t(l).scrollLeft() - o.scrollSpeed) : t(window).width() - (e.pageX - t(l).scrollLeft()) < o.scrollSensitivity && (n = t(l).scrollLeft(t(l).scrollLeft() + o.scrollSpeed)))),
            !1 !== n && t.ui.ddmanager && !o.dropBehaviour && t.ui.ddmanager.prepareOffsets(i, e)
        }
    }),
    t.ui.plugin.add("draggable", "snap", {
        start: function(e, s, i) {
            var o = i.options;
            i.snapElements = [],
            t(o.snap.constructor !== String ? o.snap.items || ":data(ui-draggable)" : o.snap).each((function() {
                var e = t(this)
                  , s = e.offset();
                this !== i.element[0] && i.snapElements.push({
                    item: this,
                    width: e.outerWidth(),
                    height: e.outerHeight(),
                    top: s.top,
                    left: s.left
                })
            }
            ))
        },
        drag: function(e, s, i) {
            var o, n, r, l, a, h, p, c, f, d, g = i.options, u = g.snapTolerance, m = s.offset.left, v = m + i.helperProportions.width, _ = s.offset.top, P = _ + i.helperProportions.height;
            for (f = i.snapElements.length - 1; f >= 0; f--)
                h = (a = i.snapElements[f].left - i.margins.left) + i.snapElements[f].width,
                c = (p = i.snapElements[f].top - i.margins.top) + i.snapElements[f].height,
                v < a - u || m > h + u || P < p - u || _ > c + u || !t.contains(i.snapElements[f].item.ownerDocument, i.snapElements[f].item) ? (i.snapElements[f].snapping && i.options.snap.release && i.options.snap.release.call(i.element, e, t.extend(i._uiHash(), {
                    snapItem: i.snapElements[f].item
                })),
                i.snapElements[f].snapping = !1) : ("inner" !== g.snapMode && (o = Math.abs(p - P) <= u,
                n = Math.abs(c - _) <= u,
                r = Math.abs(a - v) <= u,
                l = Math.abs(h - m) <= u,
                o && (s.position.top = i._convertPositionTo("relative", {
                    top: p - i.helperProportions.height,
                    left: 0
                }).top),
                n && (s.position.top = i._convertPositionTo("relative", {
                    top: c,
                    left: 0
                }).top),
                r && (s.position.left = i._convertPositionTo("relative", {
                    top: 0,
                    left: a - i.helperProportions.width
                }).left),
                l && (s.position.left = i._convertPositionTo("relative", {
                    top: 0,
                    left: h
                }).left)),
                d = o || n || r || l,
                "outer" !== g.snapMode && (o = Math.abs(p - _) <= u,
                n = Math.abs(c - P) <= u,
                r = Math.abs(a - m) <= u,
                l = Math.abs(h - v) <= u,
                o && (s.position.top = i._convertPositionTo("relative", {
                    top: p,
                    left: 0
                }).top),
                n && (s.position.top = i._convertPositionTo("relative", {
                    top: c - i.helperProportions.height,
                    left: 0
                }).top),
                r && (s.position.left = i._convertPositionTo("relative", {
                    top: 0,
                    left: a
                }).left),
                l && (s.position.left = i._convertPositionTo("relative", {
                    top: 0,
                    left: h - i.helperProportions.width
                }).left)),
                !i.snapElements[f].snapping && (o || n || r || l || d) && i.options.snap.snap && i.options.snap.snap.call(i.element, e, t.extend(i._uiHash(), {
                    snapItem: i.snapElements[f].item
                })),
                i.snapElements[f].snapping = o || n || r || l || d)
        }
    }),
    t.ui.plugin.add("draggable", "stack", {
        start: function(e, s, i) {
            var o, n = i.options, r = t.makeArray(t(n.stack)).sort((function(e, s) {
                return (parseInt(t(e).css("zIndex"), 10) || 0) - (parseInt(t(s).css("zIndex"), 10) || 0)
            }
            ));
            r.length && (o = parseInt(t(r[0]).css("zIndex"), 10) || 0,
            t(r).each((function(e) {
                t(this).css("zIndex", o + e)
            }
            )),
            this.css("zIndex", o + r.length))
        }
    }),
    t.ui.plugin.add("draggable", "zIndex", {
        start: function(e, s, i) {
            var o = t(s.helper)
              , n = i.options;
            o.css("zIndex") && (n._zIndex = o.css("zIndex")),
            o.css("zIndex", n.zIndex)
        },
        stop: function(e, s, i) {
            var o = i.options;
            o._zIndex && t(s.helper).css("zIndex", o._zIndex)
        }
    }),
    t.ui.draggable
}
));

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/draggable-min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/resizable-min.js. */
/*!
 * jQuery UI Resizable 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "./mouse", "../disable-selection", "../plugin", "../version", "../widget"], t) : t(jQuery)
}((function(t) {
    "use strict";
    return t.widget("ui.resizable", t.ui.mouse, {
        version: "1.13.2",
        widgetEventPrefix: "resize",
        options: {
            alsoResize: !1,
            animate: !1,
            animateDuration: "slow",
            animateEasing: "swing",
            aspectRatio: !1,
            autoHide: !1,
            classes: {
                "ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
            },
            containment: !1,
            ghost: !1,
            grid: !1,
            handles: "e,s,se",
            helper: !1,
            maxHeight: null,
            maxWidth: null,
            minHeight: 10,
            minWidth: 10,
            zIndex: 90,
            resize: null,
            start: null,
            stop: null
        },
        _num: function(t) {
            return parseFloat(t) || 0
        },
        _isNumber: function(t) {
            return !isNaN(parseFloat(t))
        },
        _hasScroll: function(i, e) {
            if ("hidden" === t(i).css("overflow"))
                return !1;
            var s = e && "left" === e ? "scrollLeft" : "scrollTop"
              , h = !1;
            if (i[s] > 0)
                return !0;
            try {
                i[s] = 1,
                h = i[s] > 0,
                i[s] = 0
            } catch (t) {}
            return h
        },
        _create: function() {
            var i, e = this.options, s = this;
            this._addClass("ui-resizable"),
            t.extend(this, {
                _aspectRatio: !!e.aspectRatio,
                aspectRatio: e.aspectRatio,
                originalElement: this.element,
                _proportionallyResizeElements: [],
                _helper: e.helper || e.ghost || e.animate ? e.helper || "ui-resizable-helper" : null
            }),
            this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i) && (this.element.wrap(t("<div class='ui-wrapper'></div>").css({
                overflow: "hidden",
                position: this.element.css("position"),
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                top: this.element.css("top"),
                left: this.element.css("left")
            })),
            this.element = this.element.parent().data("ui-resizable", this.element.resizable("instance")),
            this.elementIsWrapper = !0,
            i = {
                marginTop: this.originalElement.css("marginTop"),
                marginRight: this.originalElement.css("marginRight"),
                marginBottom: this.originalElement.css("marginBottom"),
                marginLeft: this.originalElement.css("marginLeft")
            },
            this.element.css(i),
            this.originalElement.css("margin", 0),
            this.originalResizeStyle = this.originalElement.css("resize"),
            this.originalElement.css("resize", "none"),
            this._proportionallyResizeElements.push(this.originalElement.css({
                position: "static",
                zoom: 1,
                display: "block"
            })),
            this.originalElement.css(i),
            this._proportionallyResize()),
            this._setupHandles(),
            e.autoHide && t(this.element).on("mouseenter", (function() {
                e.disabled || (s._removeClass("ui-resizable-autohide"),
                s._handles.show())
            }
            )).on("mouseleave", (function() {
                e.disabled || s.resizing || (s._addClass("ui-resizable-autohide"),
                s._handles.hide())
            }
            )),
            this._mouseInit()
        },
        _destroy: function() {
            this._mouseDestroy(),
            this._addedHandles.remove();
            var i, e = function(i) {
                t(i).removeData("resizable").removeData("ui-resizable").off(".resizable")
            };
            return this.elementIsWrapper && (e(this.element),
            i = this.element,
            this.originalElement.css({
                position: i.css("position"),
                width: i.outerWidth(),
                height: i.outerHeight(),
                top: i.css("top"),
                left: i.css("left")
            }).insertAfter(i),
            i.remove()),
            this.originalElement.css("resize", this.originalResizeStyle),
            e(this.originalElement),
            this
        },
        _setOption: function(t, i) {
            switch (this._super(t, i),
            t) {
            case "handles":
                this._removeHandles(),
                this._setupHandles();
                break;
            case "aspectRatio":
                this._aspectRatio = !!i
            }
        },
        _setupHandles: function() {
            var i, e, s, h, n, o = this.options, a = this;
            if (this.handles = o.handles || (t(".ui-resizable-handle", this.element).length ? {
                n: ".ui-resizable-n",
                e: ".ui-resizable-e",
                s: ".ui-resizable-s",
                w: ".ui-resizable-w",
                se: ".ui-resizable-se",
                sw: ".ui-resizable-sw",
                ne: ".ui-resizable-ne",
                nw: ".ui-resizable-nw"
            } : "e,s,se"),
            this._handles = t(),
            this._addedHandles = t(),
            this.handles.constructor === String)
                for ("all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"),
                s = this.handles.split(","),
                this.handles = {},
                e = 0; e < s.length; e++)
                    h = "ui-resizable-" + (i = String.prototype.trim.call(s[e])),
                    n = t("<div>"),
                    this._addClass(n, "ui-resizable-handle " + h),
                    n.css({
                        zIndex: o.zIndex
                    }),
                    this.handles[i] = ".ui-resizable-" + i,
                    this.element.children(this.handles[i]).length || (this.element.append(n),
                    this._addedHandles = this._addedHandles.add(n));
            this._renderAxis = function(i) {
                var e, s, h, n;
                for (e in i = i || this.element,
                this.handles)
                    this.handles[e].constructor === String ? this.handles[e] = this.element.children(this.handles[e]).first().show() : (this.handles[e].jquery || this.handles[e].nodeType) && (this.handles[e] = t(this.handles[e]),
                    this._on(this.handles[e], {
                        mousedown: a._mouseDown
                    })),
                    this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i) && (s = t(this.handles[e], this.element),
                    n = /sw|ne|nw|se|n|s/.test(e) ? s.outerHeight() : s.outerWidth(),
                    h = ["padding", /ne|nw|n/.test(e) ? "Top" : /se|sw|s/.test(e) ? "Bottom" : /^e$/.test(e) ? "Right" : "Left"].join(""),
                    i.css(h, n),
                    this._proportionallyResize()),
                    this._handles = this._handles.add(this.handles[e])
            }
            ,
            this._renderAxis(this.element),
            this._handles = this._handles.add(this.element.find(".ui-resizable-handle")),
            this._handles.disableSelection(),
            this._handles.on("mouseover", (function() {
                a.resizing || (this.className && (n = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),
                a.axis = n && n[1] ? n[1] : "se")
            }
            )),
            o.autoHide && (this._handles.hide(),
            this._addClass("ui-resizable-autohide"))
        },
        _removeHandles: function() {
            this._addedHandles.remove()
        },
        _mouseCapture: function(i) {
            var e, s, h = !1;
            for (e in this.handles)
                ((s = t(this.handles[e])[0]) === i.target || t.contains(s, i.target)) && (h = !0);
            return !this.options.disabled && h
        },
        _mouseStart: function(i) {
            var e, s, h, n = this.options, o = this.element;
            return this.resizing = !0,
            this._renderProxy(),
            e = this._num(this.helper.css("left")),
            s = this._num(this.helper.css("top")),
            n.containment && (e += t(n.containment).scrollLeft() || 0,
            s += t(n.containment).scrollTop() || 0),
            this.offset = this.helper.offset(),
            this.position = {
                left: e,
                top: s
            },
            this.size = this._helper ? {
                width: this.helper.width(),
                height: this.helper.height()
            } : {
                width: o.width(),
                height: o.height()
            },
            this.originalSize = this._helper ? {
                width: o.outerWidth(),
                height: o.outerHeight()
            } : {
                width: o.width(),
                height: o.height()
            },
            this.sizeDiff = {
                width: o.outerWidth() - o.width(),
                height: o.outerHeight() - o.height()
            },
            this.originalPosition = {
                left: e,
                top: s
            },
            this.originalMousePosition = {
                left: i.pageX,
                top: i.pageY
            },
            this.aspectRatio = "number" == typeof n.aspectRatio ? n.aspectRatio : this.originalSize.width / this.originalSize.height || 1,
            h = t(".ui-resizable-" + this.axis).css("cursor"),
            t("body").css("cursor", "auto" === h ? this.axis + "-resize" : h),
            this._addClass("ui-resizable-resizing"),
            this._propagate("start", i),
            !0
        },
        _mouseDrag: function(i) {
            var e, s, h = this.originalMousePosition, n = this.axis, o = i.pageX - h.left || 0, a = i.pageY - h.top || 0, l = this._change[n];
            return this._updatePrevProperties(),
            !!l && (e = l.apply(this, [i, o, a]),
            this._updateVirtualBoundaries(i.shiftKey),
            (this._aspectRatio || i.shiftKey) && (e = this._updateRatio(e, i)),
            e = this._respectSize(e, i),
            this._updateCache(e),
            this._propagate("resize", i),
            s = this._applyChanges(),
            !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(),
            t.isEmptyObject(s) || (this._updatePrevProperties(),
            this._trigger("resize", i, this.ui()),
            this._applyChanges()),
            !1)
        },
        _mouseStop: function(i) {
            this.resizing = !1;
            var e, s, h, n, o, a, l, r = this.options, p = this;
            return this._helper && (h = (s = (e = this._proportionallyResizeElements).length && /textarea/i.test(e[0].nodeName)) && this._hasScroll(e[0], "left") ? 0 : p.sizeDiff.height,
            n = s ? 0 : p.sizeDiff.width,
            o = {
                width: p.helper.width() - n,
                height: p.helper.height() - h
            },
            a = parseFloat(p.element.css("left")) + (p.position.left - p.originalPosition.left) || null,
            l = parseFloat(p.element.css("top")) + (p.position.top - p.originalPosition.top) || null,
            r.animate || this.element.css(t.extend(o, {
                top: l,
                left: a
            })),
            p.helper.height(p.size.height),
            p.helper.width(p.size.width),
            this._helper && !r.animate && this._proportionallyResize()),
            t("body").css("cursor", "auto"),
            this._removeClass("ui-resizable-resizing"),
            this._propagate("stop", i),
            this._helper && this.helper.remove(),
            !1
        },
        _updatePrevProperties: function() {
            this.prevPosition = {
                top: this.position.top,
                left: this.position.left
            },
            this.prevSize = {
                width: this.size.width,
                height: this.size.height
            }
        },
        _applyChanges: function() {
            var t = {};
            return this.position.top !== this.prevPosition.top && (t.top = this.position.top + "px"),
            this.position.left !== this.prevPosition.left && (t.left = this.position.left + "px"),
            this.size.width !== this.prevSize.width && (t.width = this.size.width + "px"),
            this.size.height !== this.prevSize.height && (t.height = this.size.height + "px"),
            this.helper.css(t),
            t
        },
        _updateVirtualBoundaries: function(t) {
            var i, e, s, h, n, o = this.options;
            n = {
                minWidth: this._isNumber(o.minWidth) ? o.minWidth : 0,
                maxWidth: this._isNumber(o.maxWidth) ? o.maxWidth : 1 / 0,
                minHeight: this._isNumber(o.minHeight) ? o.minHeight : 0,
                maxHeight: this._isNumber(o.maxHeight) ? o.maxHeight : 1 / 0
            },
            (this._aspectRatio || t) && (i = n.minHeight * this.aspectRatio,
            s = n.minWidth / this.aspectRatio,
            e = n.maxHeight * this.aspectRatio,
            h = n.maxWidth / this.aspectRatio,
            i > n.minWidth && (n.minWidth = i),
            s > n.minHeight && (n.minHeight = s),
            e < n.maxWidth && (n.maxWidth = e),
            h < n.maxHeight && (n.maxHeight = h)),
            this._vBoundaries = n
        },
        _updateCache: function(t) {
            this.offset = this.helper.offset(),
            this._isNumber(t.left) && (this.position.left = t.left),
            this._isNumber(t.top) && (this.position.top = t.top),
            this._isNumber(t.height) && (this.size.height = t.height),
            this._isNumber(t.width) && (this.size.width = t.width)
        },
        _updateRatio: function(t) {
            var i = this.position
              , e = this.size
              , s = this.axis;
            return this._isNumber(t.height) ? t.width = t.height * this.aspectRatio : this._isNumber(t.width) && (t.height = t.width / this.aspectRatio),
            "sw" === s && (t.left = i.left + (e.width - t.width),
            t.top = null),
            "nw" === s && (t.top = i.top + (e.height - t.height),
            t.left = i.left + (e.width - t.width)),
            t
        },
        _respectSize: function(t) {
            var i = this._vBoundaries
              , e = this.axis
              , s = this._isNumber(t.width) && i.maxWidth && i.maxWidth < t.width
              , h = this._isNumber(t.height) && i.maxHeight && i.maxHeight < t.height
              , n = this._isNumber(t.width) && i.minWidth && i.minWidth > t.width
              , o = this._isNumber(t.height) && i.minHeight && i.minHeight > t.height
              , a = this.originalPosition.left + this.originalSize.width
              , l = this.originalPosition.top + this.originalSize.height
              , r = /sw|nw|w/.test(e)
              , p = /nw|ne|n/.test(e);
            return n && (t.width = i.minWidth),
            o && (t.height = i.minHeight),
            s && (t.width = i.maxWidth),
            h && (t.height = i.maxHeight),
            n && r && (t.left = a - i.minWidth),
            s && r && (t.left = a - i.maxWidth),
            o && p && (t.top = l - i.minHeight),
            h && p && (t.top = l - i.maxHeight),
            t.width || t.height || t.left || !t.top ? t.width || t.height || t.top || !t.left || (t.left = null) : t.top = null,
            t
        },
        _getPaddingPlusBorderDimensions: function(t) {
            for (var i = 0, e = [], s = [t.css("borderTopWidth"), t.css("borderRightWidth"), t.css("borderBottomWidth"), t.css("borderLeftWidth")], h = [t.css("paddingTop"), t.css("paddingRight"), t.css("paddingBottom"), t.css("paddingLeft")]; i < 4; i++)
                e[i] = parseFloat(s[i]) || 0,
                e[i] += parseFloat(h[i]) || 0;
            return {
                height: e[0] + e[2],
                width: e[1] + e[3]
            }
        },
        _proportionallyResize: function() {
            if (this._proportionallyResizeElements.length)
                for (var t, i = 0, e = this.helper || this.element; i < this._proportionallyResizeElements.length; i++)
                    t = this._proportionallyResizeElements[i],
                    this.outerDimensions || (this.outerDimensions = this._getPaddingPlusBorderDimensions(t)),
                    t.css({
                        height: e.height() - this.outerDimensions.height || 0,
                        width: e.width() - this.outerDimensions.width || 0
                    })
        },
        _renderProxy: function() {
            var i = this.element
              , e = this.options;
            this.elementOffset = i.offset(),
            this._helper ? (this.helper = this.helper || t("<div></div>").css({
                overflow: "hidden"
            }),
            this._addClass(this.helper, this._helper),
            this.helper.css({
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                position: "absolute",
                left: this.elementOffset.left + "px",
                top: this.elementOffset.top + "px",
                zIndex: ++e.zIndex
            }),
            this.helper.appendTo("body").disableSelection()) : this.helper = this.element
        },
        _change: {
            e: function(t, i) {
                return {
                    width: this.originalSize.width + i
                }
            },
            w: function(t, i) {
                var e = this.originalSize;
                return {
                    left: this.originalPosition.left + i,
                    width: e.width - i
                }
            },
            n: function(t, i, e) {
                var s = this.originalSize;
                return {
                    top: this.originalPosition.top + e,
                    height: s.height - e
                }
            },
            s: function(t, i, e) {
                return {
                    height: this.originalSize.height + e
                }
            },
            se: function(i, e, s) {
                return t.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [i, e, s]))
            },
            sw: function(i, e, s) {
                return t.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [i, e, s]))
            },
            ne: function(i, e, s) {
                return t.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [i, e, s]))
            },
            nw: function(i, e, s) {
                return t.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [i, e, s]))
            }
        },
        _propagate: function(i, e) {
            t.ui.plugin.call(this, i, [e, this.ui()]),
            "resize" !== i && this._trigger(i, e, this.ui())
        },
        plugins: {},
        ui: function() {
            return {
                originalElement: this.originalElement,
                element: this.element,
                helper: this.helper,
                position: this.position,
                size: this.size,
                originalSize: this.originalSize,
                originalPosition: this.originalPosition
            }
        }
    }),
    t.ui.plugin.add("resizable", "animate", {
        stop: function(i) {
            var e = t(this).resizable("instance")
              , s = e.options
              , h = e._proportionallyResizeElements
              , n = h.length && /textarea/i.test(h[0].nodeName)
              , o = n && e._hasScroll(h[0], "left") ? 0 : e.sizeDiff.height
              , a = n ? 0 : e.sizeDiff.width
              , l = {
                width: e.size.width - a,
                height: e.size.height - o
            }
              , r = parseFloat(e.element.css("left")) + (e.position.left - e.originalPosition.left) || null
              , p = parseFloat(e.element.css("top")) + (e.position.top - e.originalPosition.top) || null;
            e.element.animate(t.extend(l, p && r ? {
                top: p,
                left: r
            } : {}), {
                duration: s.animateDuration,
                easing: s.animateEasing,
                step: function() {
                    var s = {
                        width: parseFloat(e.element.css("width")),
                        height: parseFloat(e.element.css("height")),
                        top: parseFloat(e.element.css("top")),
                        left: parseFloat(e.element.css("left"))
                    };
                    h && h.length && t(h[0]).css({
                        width: s.width,
                        height: s.height
                    }),
                    e._updateCache(s),
                    e._propagate("resize", i)
                }
            })
        }
    }),
    t.ui.plugin.add("resizable", "containment", {
        start: function() {
            var i, e, s, h, n, o, a, l = t(this).resizable("instance"), r = l.options, p = l.element, d = r.containment, g = d instanceof t ? d.get(0) : /parent/.test(d) ? p.parent().get(0) : d;
            g && (l.containerElement = t(g),
            /document/.test(d) || d === document ? (l.containerOffset = {
                left: 0,
                top: 0
            },
            l.containerPosition = {
                left: 0,
                top: 0
            },
            l.parentData = {
                element: t(document),
                left: 0,
                top: 0,
                width: t(document).width(),
                height: t(document).height() || document.body.parentNode.scrollHeight
            }) : (i = t(g),
            e = [],
            t(["Top", "Right", "Left", "Bottom"]).each((function(t, s) {
                e[t] = l._num(i.css("padding" + s))
            }
            )),
            l.containerOffset = i.offset(),
            l.containerPosition = i.position(),
            l.containerSize = {
                height: i.innerHeight() - e[3],
                width: i.innerWidth() - e[1]
            },
            s = l.containerOffset,
            h = l.containerSize.height,
            n = l.containerSize.width,
            o = l._hasScroll(g, "left") ? g.scrollWidth : n,
            a = l._hasScroll(g) ? g.scrollHeight : h,
            l.parentData = {
                element: g,
                left: s.left,
                top: s.top,
                width: o,
                height: a
            }))
        },
        resize: function(i) {
            var e, s, h, n, o = t(this).resizable("instance"), a = o.options, l = o.containerOffset, r = o.position, p = o._aspectRatio || i.shiftKey, d = {
                top: 0,
                left: 0
            }, g = o.containerElement, u = !0;
            g[0] !== document && /static/.test(g.css("position")) && (d = l),
            r.left < (o._helper ? l.left : 0) && (o.size.width = o.size.width + (o._helper ? o.position.left - l.left : o.position.left - d.left),
            p && (o.size.height = o.size.width / o.aspectRatio,
            u = !1),
            o.position.left = a.helper ? l.left : 0),
            r.top < (o._helper ? l.top : 0) && (o.size.height = o.size.height + (o._helper ? o.position.top - l.top : o.position.top),
            p && (o.size.width = o.size.height * o.aspectRatio,
            u = !1),
            o.position.top = o._helper ? l.top : 0),
            h = o.containerElement.get(0) === o.element.parent().get(0),
            n = /relative|absolute/.test(o.containerElement.css("position")),
            h && n ? (o.offset.left = o.parentData.left + o.position.left,
            o.offset.top = o.parentData.top + o.position.top) : (o.offset.left = o.element.offset().left,
            o.offset.top = o.element.offset().top),
            e = Math.abs(o.sizeDiff.width + (o._helper ? o.offset.left - d.left : o.offset.left - l.left)),
            s = Math.abs(o.sizeDiff.height + (o._helper ? o.offset.top - d.top : o.offset.top - l.top)),
            e + o.size.width >= o.parentData.width && (o.size.width = o.parentData.width - e,
            p && (o.size.height = o.size.width / o.aspectRatio,
            u = !1)),
            s + o.size.height >= o.parentData.height && (o.size.height = o.parentData.height - s,
            p && (o.size.width = o.size.height * o.aspectRatio,
            u = !1)),
            u || (o.position.left = o.prevPosition.left,
            o.position.top = o.prevPosition.top,
            o.size.width = o.prevSize.width,
            o.size.height = o.prevSize.height)
        },
        stop: function() {
            var i = t(this).resizable("instance")
              , e = i.options
              , s = i.containerOffset
              , h = i.containerPosition
              , n = i.containerElement
              , o = t(i.helper)
              , a = o.offset()
              , l = o.outerWidth() - i.sizeDiff.width
              , r = o.outerHeight() - i.sizeDiff.height;
            i._helper && !e.animate && /relative/.test(n.css("position")) && t(this).css({
                left: a.left - h.left - s.left,
                width: l,
                height: r
            }),
            i._helper && !e.animate && /static/.test(n.css("position")) && t(this).css({
                left: a.left - h.left - s.left,
                width: l,
                height: r
            })
        }
    }),
    t.ui.plugin.add("resizable", "alsoResize", {
        start: function() {
            var i = t(this).resizable("instance").options;
            t(i.alsoResize).each((function() {
                var i = t(this);
                i.data("ui-resizable-alsoresize", {
                    width: parseFloat(i.width()),
                    height: parseFloat(i.height()),
                    left: parseFloat(i.css("left")),
                    top: parseFloat(i.css("top"))
                })
            }
            ))
        },
        resize: function(i, e) {
            var s = t(this).resizable("instance")
              , h = s.options
              , n = s.originalSize
              , o = s.originalPosition
              , a = {
                height: s.size.height - n.height || 0,
                width: s.size.width - n.width || 0,
                top: s.position.top - o.top || 0,
                left: s.position.left - o.left || 0
            };
            t(h.alsoResize).each((function() {
                var i = t(this)
                  , s = t(this).data("ui-resizable-alsoresize")
                  , h = {}
                  , n = i.parents(e.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                t.each(n, (function(t, i) {
                    var e = (s[i] || 0) + (a[i] || 0);
                    e && e >= 0 && (h[i] = e || null)
                }
                )),
                i.css(h)
            }
            ))
        },
        stop: function() {
            t(this).removeData("ui-resizable-alsoresize")
        }
    }),
    t.ui.plugin.add("resizable", "ghost", {
        start: function() {
            var i = t(this).resizable("instance")
              , e = i.size;
            i.ghost = i.originalElement.clone(),
            i.ghost.css({
                opacity: .25,
                display: "block",
                position: "relative",
                height: e.height,
                width: e.width,
                margin: 0,
                left: 0,
                top: 0
            }),
            i._addClass(i.ghost, "ui-resizable-ghost"),
            !1 !== t.uiBackCompat && "string" == typeof i.options.ghost && i.ghost.addClass(this.options.ghost),
            i.ghost.appendTo(i.helper)
        },
        resize: function() {
            var i = t(this).resizable("instance");
            i.ghost && i.ghost.css({
                position: "relative",
                height: i.size.height,
                width: i.size.width
            })
        },
        stop: function() {
            var i = t(this).resizable("instance");
            i.ghost && i.helper && i.helper.get(0).removeChild(i.ghost.get(0))
        }
    }),
    t.ui.plugin.add("resizable", "grid", {
        resize: function() {
            var i, e = t(this).resizable("instance"), s = e.options, h = e.size, n = e.originalSize, o = e.originalPosition, a = e.axis, l = "number" == typeof s.grid ? [s.grid, s.grid] : s.grid, r = l[0] || 1, p = l[1] || 1, d = Math.round((h.width - n.width) / r) * r, g = Math.round((h.height - n.height) / p) * p, u = n.width + d, c = n.height + g, f = s.maxWidth && s.maxWidth < u, m = s.maxHeight && s.maxHeight < c, z = s.minWidth && s.minWidth > u, w = s.minHeight && s.minHeight > c;
            s.grid = l,
            z && (u += r),
            w && (c += p),
            f && (u -= r),
            m && (c -= p),
            /^(se|s|e)$/.test(a) ? (e.size.width = u,
            e.size.height = c) : /^(ne)$/.test(a) ? (e.size.width = u,
            e.size.height = c,
            e.position.top = o.top - g) : /^(sw)$/.test(a) ? (e.size.width = u,
            e.size.height = c,
            e.position.left = o.left - d) : ((c - p <= 0 || u - r <= 0) && (i = e._getPaddingPlusBorderDimensions(this)),
            c - p > 0 ? (e.size.height = c,
            e.position.top = o.top - g) : (c = p - i.height,
            e.size.height = c,
            e.position.top = o.top + n.height - c),
            u - r > 0 ? (e.size.width = u,
            e.position.left = o.left - d) : (u = r - i.width,
            e.size.width = u,
            e.position.left = o.left + n.width - u))
        }
    }),
    t.ui.resizable
}
));

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/resizable-min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/button-min.js. */
/*!
 * jQuery UI Button 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "./controlgroup", "./checkboxradio", "../keycode", "../widget"], t) : t(jQuery)
}((function(t) {
    "use strict";
    var i;
    return t.widget("ui.button", {
        version: "1.13.2",
        defaultElement: "<button>",
        options: {
            classes: {
                "ui-button": "ui-corner-all"
            },
            disabled: null,
            icon: null,
            iconPosition: "beginning",
            label: null,
            showLabel: !0
        },
        _getCreateOptions: function() {
            var t, i = this._super() || {};
            return this.isInput = this.element.is("input"),
            null != (t = this.element[0].disabled) && (i.disabled = t),
            this.originalLabel = this.isInput ? this.element.val() : this.element.html(),
            this.originalLabel && (i.label = this.originalLabel),
            i
        },
        _create: function() {
            !this.option.showLabel & !this.options.icon && (this.options.showLabel = !0),
            null == this.options.disabled && (this.options.disabled = this.element[0].disabled || !1),
            this.hasTitle = !!this.element.attr("title"),
            this.options.label && this.options.label !== this.originalLabel && (this.isInput ? this.element.val(this.options.label) : this.element.html(this.options.label)),
            this._addClass("ui-button", "ui-widget"),
            this._setOption("disabled", this.options.disabled),
            this._enhance(),
            this.element.is("a") && this._on({
                keyup: function(i) {
                    i.keyCode === t.ui.keyCode.SPACE && (i.preventDefault(),
                    this.element[0].click ? this.element[0].click() : this.element.trigger("click"))
                }
            })
        },
        _enhance: function() {
            this.element.is("button") || this.element.attr("role", "button"),
            this.options.icon && (this._updateIcon("icon", this.options.icon),
            this._updateTooltip())
        },
        _updateTooltip: function() {
            this.title = this.element.attr("title"),
            this.options.showLabel || this.title || this.element.attr("title", this.options.label)
        },
        _updateIcon: function(i, o) {
            var s = "iconPosition" !== i
              , n = s ? this.options.iconPosition : o
              , e = "top" === n || "bottom" === n;
            this.icon ? s && this._removeClass(this.icon, null, this.options.icon) : (this.icon = t("<span>"),
            this._addClass(this.icon, "ui-button-icon", "ui-icon"),
            this.options.showLabel || this._addClass("ui-button-icon-only")),
            s && this._addClass(this.icon, null, o),
            this._attachIcon(n),
            e ? (this._addClass(this.icon, null, "ui-widget-icon-block"),
            this.iconSpace && this.iconSpace.remove()) : (this.iconSpace || (this.iconSpace = t("<span> </span>"),
            this._addClass(this.iconSpace, "ui-button-icon-space")),
            this._removeClass(this.icon, null, "ui-wiget-icon-block"),
            this._attachIconSpace(n))
        },
        _destroy: function() {
            this.element.removeAttr("role"),
            this.icon && this.icon.remove(),
            this.iconSpace && this.iconSpace.remove(),
            this.hasTitle || this.element.removeAttr("title")
        },
        _attachIconSpace: function(t) {
            this.icon[/^(?:end|bottom)/.test(t) ? "before" : "after"](this.iconSpace)
        },
        _attachIcon: function(t) {
            this.element[/^(?:end|bottom)/.test(t) ? "append" : "prepend"](this.icon)
        },
        _setOptions: function(t) {
            var i = void 0 === t.showLabel ? this.options.showLabel : t.showLabel
              , o = void 0 === t.icon ? this.options.icon : t.icon;
            i || o || (t.showLabel = !0),
            this._super(t)
        },
        _setOption: function(t, i) {
            "icon" === t && (i ? this._updateIcon(t, i) : this.icon && (this.icon.remove(),
            this.iconSpace && this.iconSpace.remove())),
            "iconPosition" === t && this._updateIcon(t, i),
            "showLabel" === t && (this._toggleClass("ui-button-icon-only", null, !i),
            this._updateTooltip()),
            "label" === t && (this.isInput ? this.element.val(i) : (this.element.html(i),
            this.icon && (this._attachIcon(this.options.iconPosition),
            this._attachIconSpace(this.options.iconPosition)))),
            this._super(t, i),
            "disabled" === t && (this._toggleClass(null, "ui-state-disabled", i),
            this.element[0].disabled = i,
            i && this.element.trigger("blur"))
        },
        refresh: function() {
            var t = this.element.is("input, button") ? this.element[0].disabled : this.element.hasClass("ui-button-disabled");
            t !== this.options.disabled && this._setOptions({
                disabled: t
            }),
            this._updateTooltip()
        }
    }),
    !1 !== t.uiBackCompat && (t.widget("ui.button", t.ui.button, {
        options: {
            text: !0,
            icons: {
                primary: null,
                secondary: null
            }
        },
        _create: function() {
            this.options.showLabel && !this.options.text && (this.options.showLabel = this.options.text),
            !this.options.showLabel && this.options.text && (this.options.text = this.options.showLabel),
            this.options.icon || !this.options.icons.primary && !this.options.icons.secondary ? this.options.icon && (this.options.icons.primary = this.options.icon) : this.options.icons.primary ? this.options.icon = this.options.icons.primary : (this.options.icon = this.options.icons.secondary,
            this.options.iconPosition = "end"),
            this._super()
        },
        _setOption: function(t, i) {
            "text" !== t ? ("showLabel" === t && (this.options.text = i),
            "icon" === t && (this.options.icons.primary = i),
            "icons" === t && (i.primary ? (this._super("icon", i.primary),
            this._super("iconPosition", "beginning")) : i.secondary && (this._super("icon", i.secondary),
            this._super("iconPosition", "end"))),
            this._superApply(arguments)) : this._super("showLabel", i)
        }
    }),
    t.fn.button = (i = t.fn.button,
    function(o) {
        var s = "string" == typeof o
          , n = Array.prototype.slice.call(arguments, 1)
          , e = this;
        return s ? this.length || "instance" !== o ? this.each((function() {
            var i, s = t(this).attr("type"), h = "checkbox" !== s && "radio" !== s ? "button" : "checkboxradio", a = t.data(this, "ui-" + h);
            return "instance" === o ? (e = a,
            !1) : a ? "function" != typeof a[o] || "_" === o.charAt(0) ? t.error("no such method '" + o + "' for button widget instance") : (i = a[o].apply(a, n)) !== a && void 0 !== i ? (e = i && i.jquery ? e.pushStack(i.get()) : i,
            !1) : void 0 : t.error("cannot call methods on button prior to initialization; attempted to call method '" + o + "'")
        }
        )) : e = void 0 : (n.length && (o = t.widget.extend.apply(null, [o].concat(n))),
        this.each((function() {
            var s = t(this).attr("type")
              , n = "checkbox" !== s && "radio" !== s ? "button" : "checkboxradio"
              , e = t.data(this, "ui-" + n);
            if (e)
                e.option(o || {}),
                e._init && e._init();
            else {
                if ("button" === n)
                    return void i.call(t(this), o);
                t(this).checkboxradio(t.extend({
                    icon: !1
                }, o))
            }
        }
        ))),
        e
    }
    ),
    t.fn.buttonset = function() {
        return t.ui.controlgroup || t.error("Controlgroup widget missing"),
        "option" === arguments[0] && "items" === arguments[1] && arguments[2] ? this.controlgroup.apply(this, [arguments[0], "items.button", arguments[2]]) : "option" === arguments[0] && "items" === arguments[1] ? this.controlgroup.apply(this, [arguments[0], "items.button"]) : ("object" == typeof arguments[0] && arguments[0].items && (arguments[0].items = {
            button: arguments[0].items
        }),
        this.controlgroup.apply(this, arguments))
    }
    ),
    t.ui.button
}
));

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/button-min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/dialog-min.js. */
/*!
 * jQuery UI Dialog 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(i) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "./button", "./draggable", "./mouse", "./resizable", "../focusable", "../keycode", "../position", "../safe-active-element", "../safe-blur", "../tabbable", "../unique-id", "../version", "../widget"], i) : i(jQuery)
}((function(i) {
    "use strict";
    return i.widget("ui.dialog", {
        version: "1.13.2",
        options: {
            appendTo: "body",
            autoOpen: !0,
            buttons: [],
            classes: {
                "ui-dialog": "ui-corner-all",
                "ui-dialog-titlebar": "ui-corner-all"
            },
            closeOnEscape: !0,
            closeText: "Close",
            draggable: !0,
            hide: null,
            height: "auto",
            maxHeight: null,
            maxWidth: null,
            minHeight: 150,
            minWidth: 150,
            modal: !1,
            position: {
                my: "center",
                at: "center",
                of: window,
                collision: "fit",
                using: function(t) {
                    var e = i(this).css(t).offset().top;
                    e < 0 && i(this).css("top", t.top - e)
                }
            },
            resizable: !0,
            show: null,
            title: null,
            width: 300,
            beforeClose: null,
            close: null,
            drag: null,
            dragStart: null,
            dragStop: null,
            focus: null,
            open: null,
            resize: null,
            resizeStart: null,
            resizeStop: null
        },
        sizeRelatedOptions: {
            buttons: !0,
            height: !0,
            maxHeight: !0,
            maxWidth: !0,
            minHeight: !0,
            minWidth: !0,
            width: !0
        },
        resizableRelatedOptions: {
            maxHeight: !0,
            maxWidth: !0,
            minHeight: !0,
            minWidth: !0
        },
        _create: function() {
            this.originalCss = {
                display: this.element[0].style.display,
                width: this.element[0].style.width,
                minHeight: this.element[0].style.minHeight,
                maxHeight: this.element[0].style.maxHeight,
                height: this.element[0].style.height
            },
            this.originalPosition = {
                parent: this.element.parent(),
                index: this.element.parent().children().index(this.element)
            },
            this.originalTitle = this.element.attr("title"),
            null == this.options.title && null != this.originalTitle && (this.options.title = this.originalTitle),
            this.options.disabled && (this.options.disabled = !1),
            this._createWrapper(),
            this.element.show().removeAttr("title").appendTo(this.uiDialog),
            this._addClass("ui-dialog-content", "ui-widget-content"),
            this._createTitlebar(),
            this._createButtonPane(),
            this.options.draggable && i.fn.draggable && this._makeDraggable(),
            this.options.resizable && i.fn.resizable && this._makeResizable(),
            this._isOpen = !1,
            this._trackFocus()
        },
        _init: function() {
            this.options.autoOpen && this.open()
        },
        _appendTo: function() {
            var t = this.options.appendTo;
            return t && (t.jquery || t.nodeType) ? i(t) : this.document.find(t || "body").eq(0)
        },
        _destroy: function() {
            var i, t = this.originalPosition;
            this._untrackInstance(),
            this._destroyOverlay(),
            this.element.removeUniqueId().css(this.originalCss).detach(),
            this.uiDialog.remove(),
            this.originalTitle && this.element.attr("title", this.originalTitle),
            (i = t.parent.children().eq(t.index)).length && i[0] !== this.element[0] ? i.before(this.element) : t.parent.append(this.element)
        },
        widget: function() {
            return this.uiDialog
        },
        disable: i.noop,
        enable: i.noop,
        close: function(t) {
            var e = this;
            this._isOpen && !1 !== this._trigger("beforeClose", t) && (this._isOpen = !1,
            this._focusedElement = null,
            this._destroyOverlay(),
            this._untrackInstance(),
            this.opener.filter(":focusable").trigger("focus").length || i.ui.safeBlur(i.ui.safeActiveElement(this.document[0])),
            this._hide(this.uiDialog, this.options.hide, (function() {
                e._trigger("close", t)
            }
            )))
        },
        isOpen: function() {
            return this._isOpen
        },
        moveToTop: function() {
            this._moveToTop()
        },
        _moveToTop: function(t, e) {
            var o = !1
              , s = this.uiDialog.siblings(".ui-front:visible").map((function() {
                return +i(this).css("z-index")
            }
            )).get()
              , n = Math.max.apply(null, s);
            return n >= +this.uiDialog.css("z-index") && (this.uiDialog.css("z-index", n + 1),
            o = !0),
            o && !e && this._trigger("focus", t),
            o
        },
        open: function() {
            var t = this;
            this._isOpen ? this._moveToTop() && this._focusTabbable() : (this._isOpen = !0,
            this.opener = i(i.ui.safeActiveElement(this.document[0])),
            this._size(),
            this._position(),
            this._createOverlay(),
            this._moveToTop(null, !0),
            this.overlay && this.overlay.css("z-index", this.uiDialog.css("z-index") - 1),
            this._show(this.uiDialog, this.options.show, (function() {
                t._focusTabbable(),
                t._trigger("focus")
            }
            )),
            this._makeFocusTarget(),
            this._trigger("open"))
        },
        _focusTabbable: function() {
            var i = this._focusedElement;
            i || (i = this.element.find("[autofocus]")),
            i.length || (i = this.element.find(":tabbable")),
            i.length || (i = this.uiDialogButtonPane.find(":tabbable")),
            i.length || (i = this.uiDialogTitlebarClose.filter(":tabbable")),
            i.length || (i = this.uiDialog),
            i.eq(0).trigger("focus")
        },
        _restoreTabbableFocus: function() {
            var t = i.ui.safeActiveElement(this.document[0]);
            this.uiDialog[0] === t || i.contains(this.uiDialog[0], t) || this._focusTabbable()
        },
        _keepFocus: function(i) {
            i.preventDefault(),
            this._restoreTabbableFocus(),
            this._delay(this._restoreTabbableFocus)
        },
        _createWrapper: function() {
            this.uiDialog = i("<div>").hide().attr({
                tabIndex: -1,
                role: "dialog"
            }).appendTo(this._appendTo()),
            this._addClass(this.uiDialog, "ui-dialog", "ui-widget ui-widget-content ui-front"),
            this._on(this.uiDialog, {
                keydown: function(t) {
                    if (this.options.closeOnEscape && !t.isDefaultPrevented() && t.keyCode && t.keyCode === i.ui.keyCode.ESCAPE)
                        return t.preventDefault(),
                        void this.close(t);
                    if (t.keyCode === i.ui.keyCode.TAB && !t.isDefaultPrevented()) {
                        var e = this.uiDialog.find(":tabbable")
                          , o = e.first()
                          , s = e.last();
                        t.target !== s[0] && t.target !== this.uiDialog[0] || t.shiftKey ? t.target !== o[0] && t.target !== this.uiDialog[0] || !t.shiftKey || (this._delay((function() {
                            s.trigger("focus")
                        }
                        )),
                        t.preventDefault()) : (this._delay((function() {
                            o.trigger("focus")
                        }
                        )),
                        t.preventDefault())
                    }
                },
                mousedown: function(i) {
                    this._moveToTop(i) && this._focusTabbable()
                }
            }),
            this.element.find("[aria-describedby]").length || this.uiDialog.attr({
                "aria-describedby": this.element.uniqueId().attr("id")
            })
        },
        _createTitlebar: function() {
            var t;
            this.uiDialogTitlebar = i("<div>"),
            this._addClass(this.uiDialogTitlebar, "ui-dialog-titlebar", "ui-widget-header ui-helper-clearfix"),
            this._on(this.uiDialogTitlebar, {
                mousedown: function(t) {
                    i(t.target).closest(".ui-dialog-titlebar-close") || this.uiDialog.trigger("focus")
                }
            }),
            this.uiDialogTitlebarClose = i("<button type='button'></button>").button({
                label: i("<a>").text(this.options.closeText).html(),
                icon: "ui-icon-closethick",
                showLabel: !1
            }).appendTo(this.uiDialogTitlebar),
            this._addClass(this.uiDialogTitlebarClose, "ui-dialog-titlebar-close"),
            this._on(this.uiDialogTitlebarClose, {
                click: function(i) {
                    i.preventDefault(),
                    this.close(i)
                }
            }),
            t = i("<span>").uniqueId().prependTo(this.uiDialogTitlebar),
            this._addClass(t, "ui-dialog-title"),
            this._title(t),
            this.uiDialogTitlebar.prependTo(this.uiDialog),
            this.uiDialog.attr({
                "aria-labelledby": t.attr("id")
            })
        },
        _title: function(i) {
            this.options.title ? i.text(this.options.title) : i.html("&#160;")
        },
        _createButtonPane: function() {
            this.uiDialogButtonPane = i("<div>"),
            this._addClass(this.uiDialogButtonPane, "ui-dialog-buttonpane", "ui-widget-content ui-helper-clearfix"),
            this.uiButtonSet = i("<div>").appendTo(this.uiDialogButtonPane),
            this._addClass(this.uiButtonSet, "ui-dialog-buttonset"),
            this._createButtons()
        },
        _createButtons: function() {
            var t = this
              , e = this.options.buttons;
            this.uiDialogButtonPane.remove(),
            this.uiButtonSet.empty(),
            i.isEmptyObject(e) || Array.isArray(e) && !e.length ? this._removeClass(this.uiDialog, "ui-dialog-buttons") : (i.each(e, (function(e, o) {
                var s, n;
                o = "function" == typeof o ? {
                    click: o,
                    text: e
                } : o,
                o = i.extend({
                    type: "button"
                }, o),
                s = o.click,
                n = {
                    icon: o.icon,
                    iconPosition: o.iconPosition,
                    showLabel: o.showLabel,
                    icons: o.icons,
                    text: o.text
                },
                delete o.click,
                delete o.icon,
                delete o.iconPosition,
                delete o.showLabel,
                delete o.icons,
                "boolean" == typeof o.text && delete o.text,
                i("<button></button>", o).button(n).appendTo(t.uiButtonSet).on("click", (function() {
                    s.apply(t.element[0], arguments)
                }
                ))
            }
            )),
            this._addClass(this.uiDialog, "ui-dialog-buttons"),
            this.uiDialogButtonPane.appendTo(this.uiDialog))
        },
        _makeDraggable: function() {
            var t = this
              , e = this.options;
            function o(i) {
                return {
                    position: i.position,
                    offset: i.offset
                }
            }
            this.uiDialog.draggable({
                cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
                handle: ".ui-dialog-titlebar",
                containment: "document",
                start: function(e, s) {
                    t._addClass(i(this), "ui-dialog-dragging"),
                    t._blockFrames(),
                    t._trigger("dragStart", e, o(s))
                },
                drag: function(i, e) {
                    t._trigger("drag", i, o(e))
                },
                stop: function(s, n) {
                    var a = n.offset.left - t.document.scrollLeft()
                      , l = n.offset.top - t.document.scrollTop();
                    e.position = {
                        my: "left top",
                        at: "left" + (a >= 0 ? "+" : "") + a + " top" + (l >= 0 ? "+" : "") + l,
                        of: t.window
                    },
                    t._removeClass(i(this), "ui-dialog-dragging"),
                    t._unblockFrames(),
                    t._trigger("dragStop", s, o(n))
                }
            })
        },
        _makeResizable: function() {
            var t = this
              , e = this.options
              , o = e.resizable
              , s = this.uiDialog.css("position")
              , n = "string" == typeof o ? o : "n,e,s,w,se,sw,ne,nw";
            function a(i) {
                return {
                    originalPosition: i.originalPosition,
                    originalSize: i.originalSize,
                    position: i.position,
                    size: i.size
                }
            }
            this.uiDialog.resizable({
                cancel: ".ui-dialog-content",
                containment: "document",
                alsoResize: this.element,
                maxWidth: e.maxWidth,
                maxHeight: e.maxHeight,
                minWidth: e.minWidth,
                minHeight: this._minHeight(),
                handles: n,
                start: function(e, o) {
                    t._addClass(i(this), "ui-dialog-resizing"),
                    t._blockFrames(),
                    t._trigger("resizeStart", e, a(o))
                },
                resize: function(i, e) {
                    t._trigger("resize", i, a(e))
                },
                stop: function(o, s) {
                    var n = t.uiDialog.offset()
                      , l = n.left - t.document.scrollLeft()
                      , h = n.top - t.document.scrollTop();
                    e.height = t.uiDialog.height(),
                    e.width = t.uiDialog.width(),
                    e.position = {
                        my: "left top",
                        at: "left" + (l >= 0 ? "+" : "") + l + " top" + (h >= 0 ? "+" : "") + h,
                        of: t.window
                    },
                    t._removeClass(i(this), "ui-dialog-resizing"),
                    t._unblockFrames(),
                    t._trigger("resizeStop", o, a(s))
                }
            }).css("position", s)
        },
        _trackFocus: function() {
            this._on(this.widget(), {
                focusin: function(t) {
                    this._makeFocusTarget(),
                    this._focusedElement = i(t.target)
                }
            })
        },
        _makeFocusTarget: function() {
            this._untrackInstance(),
            this._trackingInstances().unshift(this)
        },
        _untrackInstance: function() {
            var t = this._trackingInstances()
              , e = i.inArray(this, t);
            -1 !== e && t.splice(e, 1)
        },
        _trackingInstances: function() {
            var i = this.document.data("ui-dialog-instances");
            return i || (i = [],
            this.document.data("ui-dialog-instances", i)),
            i
        },
        _minHeight: function() {
            var i = this.options;
            return "auto" === i.height ? i.minHeight : Math.min(i.minHeight, i.height)
        },
        _position: function() {
            var i = this.uiDialog.is(":visible");
            i || this.uiDialog.show(),
            this.uiDialog.position(this.options.position),
            i || this.uiDialog.hide()
        },
        _setOptions: function(t) {
            var e = this
              , o = !1
              , s = {};
            i.each(t, (function(i, t) {
                e._setOption(i, t),
                i in e.sizeRelatedOptions && (o = !0),
                i in e.resizableRelatedOptions && (s[i] = t)
            }
            )),
            o && (this._size(),
            this._position()),
            this.uiDialog.is(":data(ui-resizable)") && this.uiDialog.resizable("option", s)
        },
        _setOption: function(t, e) {
            var o, s, n = this.uiDialog;
            "disabled" !== t && (this._super(t, e),
            "appendTo" === t && this.uiDialog.appendTo(this._appendTo()),
            "buttons" === t && this._createButtons(),
            "closeText" === t && this.uiDialogTitlebarClose.button({
                label: i("<a>").text("" + this.options.closeText).html()
            }),
            "draggable" === t && ((o = n.is(":data(ui-draggable)")) && !e && n.draggable("destroy"),
            !o && e && this._makeDraggable()),
            "position" === t && this._position(),
            "resizable" === t && ((s = n.is(":data(ui-resizable)")) && !e && n.resizable("destroy"),
            s && "string" == typeof e && n.resizable("option", "handles", e),
            s || !1 === e || this._makeResizable()),
            "title" === t && this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))
        },
        _size: function() {
            var i, t, e, o = this.options;
            this.element.show().css({
                width: "auto",
                minHeight: 0,
                maxHeight: "none",
                height: 0
            }),
            o.minWidth > o.width && (o.width = o.minWidth),
            i = this.uiDialog.css({
                height: "auto",
                width: o.width
            }).outerHeight(),
            t = Math.max(0, o.minHeight - i),
            e = "number" == typeof o.maxHeight ? Math.max(0, o.maxHeight - i) : "none",
            "auto" === o.height ? this.element.css({
                minHeight: t,
                maxHeight: e,
                height: "auto"
            }) : this.element.height(Math.max(0, o.height - i)),
            this.uiDialog.is(":data(ui-resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight())
        },
        _blockFrames: function() {
            this.iframeBlocks = this.document.find("iframe").map((function() {
                var t = i(this);
                return i("<div>").css({
                    position: "absolute",
                    width: t.outerWidth(),
                    height: t.outerHeight()
                }).appendTo(t.parent()).offset(t.offset())[0]
            }
            ))
        },
        _unblockFrames: function() {
            this.iframeBlocks && (this.iframeBlocks.remove(),
            delete this.iframeBlocks)
        },
        _allowInteraction: function(t) {
            return !!i(t.target).closest(".ui-dialog").length || !!i(t.target).closest(".ui-datepicker").length
        },
        _createOverlay: function() {
            if (this.options.modal) {
                var t = i.fn.jquery.substring(0, 4)
                  , e = !0;
                this._delay((function() {
                    e = !1
                }
                )),
                this.document.data("ui-dialog-overlays") || this.document.on("focusin.ui-dialog", function(i) {
                    if (!e) {
                        var o = this._trackingInstances()[0];
                        o._allowInteraction(i) || (i.preventDefault(),
                        o._focusTabbable(),
                        "3.4." !== t && "3.5." !== t || o._delay(o._restoreTabbableFocus))
                    }
                }
                .bind(this)),
                this.overlay = i("<div>").appendTo(this._appendTo()),
                this._addClass(this.overlay, null, "ui-widget-overlay ui-front"),
                this._on(this.overlay, {
                    mousedown: "_keepFocus"
                }),
                this.document.data("ui-dialog-overlays", (this.document.data("ui-dialog-overlays") || 0) + 1)
            }
        },
        _destroyOverlay: function() {
            if (this.options.modal && this.overlay) {
                var i = this.document.data("ui-dialog-overlays") - 1;
                i ? this.document.data("ui-dialog-overlays", i) : (this.document.off("focusin.ui-dialog"),
                this.document.removeData("ui-dialog-overlays")),
                this.overlay.remove(),
                this.overlay = null
            }
        }
    }),
    !1 !== i.uiBackCompat && i.widget("ui.dialog", i.ui.dialog, {
        options: {
            dialogClass: ""
        },
        _createWrapper: function() {
            this._super(),
            this.uiDialog.addClass(this.options.dialogClass)
        },
        _setOption: function(i, t) {
            "dialogClass" === i && this.uiDialog.removeClass(this.options.dialogClass).addClass(t),
            this._superApply(arguments)
        }
    }),
    i.ui.dialog
}
));

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/jquery.ui/ui/widgets/dialog-min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/dblazy.min.js. */
!function(l, o) {
    "use strict";
    var r, e, u = Object.assign, c = Array.prototype, i = Object.prototype, a = i.toString, n = c.splice, f = c.some, t = "undefined" != typeof Symbol && Symbol, s = "jQuery"in l, d = "cash"in l, p = "add", h = "remove", m = "has", v = "get", y = "set", g = "width", b = "clientWidth", E = "scroll", w = "iterator", S = "Observer", C = "EventListener", N = "body", x = "html", O = /-([a-z])/g, A = /^--/, I = l.localStorage, j = {}, z = Math.pow(2, 53) - 1, L = (T.prototype.init = function(n, t) {
        t = new T(n,t);
        return Q(n) ? (n.idblazy || (n.idblazy = t),
        n.idblazy) : t
    }
    ,
    T);
    function T(n, t) {
        if (this.name = "dblazy",
        n) {
            if (D(n))
                return n;
            var e = n;
            if (Y(n)) {
                if (!(e = Sn(Tn(t, n), n)).length)
                    return
            } else if (V(n))
                return this.ready(n);
            !e.nodeType && e !== l || (e = [e]);
            for (var r = this.length = e.length, i = 0; i < r; i++)
                this[i] = e[i]
        }
    }
    function M(n) {
        var t = this
          , e = (t = D(t) ? t : r(t)).length;
        return V(n) && (e && 1 !== e ? t.each(n) : n(t[0], 0)),
        t
    }
    function P(n, t) {
        function e() {
            return setTimeout(n, t || 0, r)
        }
        return "loading" !== o.readyState ? e() : o.addEventListener("DOMContentLoaded", e),
        this
    }
    function W(n) {
        var t = "[object " + n + "]";
        return function(n) {
            return a.call(n) === t
        }
    }
    e = L.prototype,
    ((r = e.init).fn = r.prototype = e).length = 0,
    e.splice = n,
    t && (e[t[w]] = c[t[w]]);
    var q, B, R = (q = "length",
    function(n) {
        return G(n) ? void 0 : n[q]
    }
    ), _ = (B = R,
    function(n) {
        n = B(n);
        return "number" == typeof n && 0 <= n && n <= z
    }
    );
    function k(n) {
        return X(n) ? Object.keys(n) : []
    }
    function D(n) {
        return n instanceof L
    }
    function F(n) {
        return !Y(n) && (n && (Array.isArray(n) || _(n)))
    }
    function H(n) {
        return !0 === n || !1 === n || "[object Boolean]" === a.call(n)
    }
    function Q(n) {
        return n && (n instanceof Element || n.querySelector)
    }
    function $(n) {
        return !isNaN(n) && parseInt(Number(n)) === n && !isNaN(parseInt(n, 10))
    }
    function U(n, t) {
        return $(n) || (n = parseInt(n)),
        n || t || 0
    }
    var V = W("Function");
    function J(n) {
        if (G(n) || Z(n) || !1 === n)
            return !0;
        var t = R(n);
        return "number" == typeof t && (F(n) || Y(n)) ? 0 === t : 0 === R(k(n))
    }
    function G(n) {
        return null === n
    }
    function K(n) {
        return !isNaN(parseFloat(n)) && isFinite(n)
    }
    function X(n) {
        if (!n || "object" != typeof n)
            return !1;
        n = Object.getPrototypeOf(n);
        return G(n) || n === i
    }
    function Y(n) {
        return n && "string" == typeof n
    }
    function Z(n) {
        return void 0 === n
    }
    function nn(n) {
        return !!n && n === n.window
    }
    function tn(n) {
        return -1 !== [9, 11].indexOf(!!n && n.nodeType)
    }
    function en(n) {
        return n && (n.querySelector || -1 !== [1, 9, 11].indexOf(!!n && n.nodeType))
    }
    function rn(n) {
        return en(n) || nn(n)
    }
    function on(n) {
        return n && "getAttribute"in n
    }
    function un(n, t) {
        var e = {};
        return n && n.length && c.slice.call(n).forEach(function(n) {
            e[n.name] = n.value
        }, t || this),
        e
    }
    function cn(n, t, e) {
        if (V(n) || Y(n) || H(n) || K(n))
            return [];
        if (F(n) && !Z(n.length)) {
            var r = n.length;
            if (!r || 1 === r && " " === n[0])
                return []
        }
        if (X(n) && J(n))
            return [];
        var i;
        if ("[object Object]" === a.call(n)) {
            for (var o in n)
                if (an(n, o) && "length" !== o && "name" !== o && !1 === t.call(e, n[o], o, n))
                    break
        } else
            n && (n instanceof HTMLCollection && (n = c.slice.call(n)),
            n instanceof NamedNodeMap ? (i = un(n, e),
            t.call(e, i, 0, n)) : (i = n.length) && 1 === i && !Z(n[0]) ? t.call(e, n[0], 0, n) : n.forEach(t, e));
        return n
    }
    function an(n, t) {
        return i.hasOwnProperty.call(n, t)
    }
    function fn(n) {
        if (Y(n)) {
            if (-1 !== (n = n.trim()).indexOf(","))
                return n.split(",").map(function(n) {
                    return n.trim()
                });
            if (/\s/.test(n))
                return n.split(" ").map(function(n) {
                    return n.trim()
                })
        }
        return F(n) ? n : [n]
    }
    function ln(n, t, e, r) {
        return on(n) ? n[t + "Attribute"](e, r) : ""
    }
    function sn(n, t, r, e) {
        var i = this
          , o = Z(r)
          , u = !X(t) && (o || H(e))
          , c = Y(e) ? e : ""
          , a = Mn(n);
        if (Z(t) && Q(a))
            return un(a.attributes);
        if (u && Y(t)) {
            t = t.trim(),
            o && (r = "");
            var f = r;
            return fn(t).every(function(n) {
                return !ln(a, m, n) || !(f = ln(a, v, n))
            }),
            f
        }
        return M.call(n, function(e) {
            if (!on(e))
                return u ? "" : i;
            X(t) ? cn(t, function(n, t) {
                ln(e, y, c + t, n)
            }) : G(r) ? cn(fn(t), function(n) {
                n = c + n;
                ln(e, m, n) && ln(e, h, n)
            }) : "src" === t ? e.src = r : "href" === t ? e.href = r : ln(e, y, t, r)
        })
    }
    function dn(n, r, i) {
        return M.call(n, function(n, t) {
            var e;
            on(n) && (e = n.classList,
            V(r) && (r = r(ln(n, v, "class"), t)),
            t = fn(r),
            e && (Z(i) ? t.map(function(n) {
                e.toggle(n)
            }) : e[i].apply(e, t)))
        })
    }
    function pn(t, n) {
        var e = 0;
        return Q(t) && Q(n) ? t !== n && t.contains(n) : F(t) ? -1 !== t.indexOf(n) : (Y(t) && Y(n) && (t = t.toLowerCase(),
        cn(fn(n = n.toLowerCase()), function(n) {
            -1 !== t.indexOf(n) && e++
        })),
        0 < e)
    }
    function hn(n) {
        return n.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&")
    }
    function mn(t, n) {
        var e = 0;
        return Y(t) && cn(fn(n), function(n) {
            t.startsWith(n) && e++
        }),
        0 < e
    }
    function vn(n) {
        return n.replace(/\s+/g, " ").trim()
    }
    function yn(n, t) {
        return Q(n) && Y(t) ? n.closest(t) : null
    }
    function gn(n, t) {
        if (Q(n)) {
            if (Y(t))
                return t = wn(t),
                !!n.matches && n.matches(t);
            if (Q(t))
                return n === t
        }
        return n === t
    }
    function bn(t, n) {
        return !(!t || !t.nodeName) && f.call(fn(n), function(n) {
            return t.nodeName.toLowerCase() === n.toLowerCase()
        })
    }
    function En(n, t, e) {
        e = Z(e) && Y(t);
        return Y(n = n || o) && (n = Mn(n, !0)),
        en(n) ? (n = Tn(n, t = wn(t)),
        e ? n.querySelector(t) : function(n, t) {
            var e = fn(n);
            Y(n) && (e = t.querySelectorAll(n));
            return c.slice.call(e)
        }(t, n)) : e ? null : []
    }
    function wn(n) {
        var t = n;
        return Y(n) && mn(n, ">") && (t = ":scope " + n),
        t
    }
    function Sn(n, t) {
        return En(n, t, 1)
    }
    function Cn(n) {
        return Q(n) && n.currentStyle || !Z(o.documentMode)
    }
    function Nn() {
        return l.devicePixelRatio || 1
    }
    function xn() {
        return l.innerWidth || o.documentElement[b] || l.screen[g]
    }
    function On(n, t, e, r, i, o) {
        return Ln(n, t, e, r, i, o, p)
    }
    function An(n, t, e, r, i, o) {
        return Ln(n, t, e, r, i, o, h)
    }
    function In(n) {
        return n.decoded || n.complete
    }
    function jn(n, t) {
        return (t || mn(n, ["blazy.", "bio."]) ? n : n.split(".")[0]).trim()
    }
    var zn = {
        _opts: function(n) {
            var t = !1
              , e = n || !1;
            return X(n) && (t = (e = u({
                capture: !1,
                passive: !0
            }, n)).once || !1),
            {
                one: t,
                options: e
            }
        },
        add: function(t, n, e, r, i) {
            var o = this._opts(r)
              , r = o.options
              , u = jn(n, i)
              , i = e;
            o.one && Cn() && (i = function n() {
                t[h + C](u, n),
                e.apply(this, arguments)
            }
            ),
            V(i) && (j[n] = i,
            t[p + C](u, i, r))
        },
        remove: function(n, t, e, r, i) {
            r = this._opts(r).options,
            i = jn(t, i),
            e = j[t] || e;
            V(e) && (n[h + C](i, e, r),
            delete j[t])
        }
    };
    function Ln(n, e, t, r, i, o, u) {
        var c, a = r, f = Cn();
        Y(n) && V(e) ? (i = t,
        r = e,
        e = n,
        n = [l]) : Y(t) ? (c = pn(e, ["touchstart", E, "wheel"]),
        Z(i) && (i = !f && {
            capture: !c,
            passive: c
        }),
        r = function(n) {
            !function(n, t, e) {
                var r = n.target;
                if (gn(r, e))
                    t.call(r, n);
                else
                    for (; r && r !== this; ) {
                        if (gn(r, e)) {
                            t.call(r, n);
                            break
                        }
                        r = r.parentElement || r.parentNode
                    }
            }(n, a, t)
        }
        ) : V(t) && (o = i,
        i = a,
        r = t);
        return M.call(n, function(t) {
            rn(t) && cn(fn(e), function(n) {
                zn[u](t, n, r, i, o)
            })
        })
    }
    function Tn(n, t) {
        return n = Mn(n = n || o, !0) || o,
        t && (gn(n, t) || gn(t, N) || gn(t, x)) && (n = o),
        en(n) && n.children && n.children.length || tn(n) ? n : o
    }
    function Mn(n, t) {
        if (Y(n))
            return n === N ? o.body : n === x ? o : o.querySelector(n);
        if (t && gn(n, x))
            return o;
        var e = s && n instanceof l.jQuery
          , t = d && n instanceof l.cash;
        return n && (D(n) || e || t) ? n[0] : n
    }
    function Pn(n) {
        return A.test(n)
    }
    function Wn(n, t, e) {
        if (Q(n)) {
            var r = n[e];
            if (Z(t))
                return r;
            for (; r; ) {
                if (gn(r, t) || bn(r, t))
                    return r;
                r = r[e]
            }
        }
        return null
    }
    function qn(n, t) {
        return Wn(n, t, "parentElement")
    }
    function Bn(n, t, e) {
        return Wn(n, t, e + "ElementSibling")
    }
    function Rn(n, t) {
        return Bn(n, t, "previous")
    }
    r.isTag = W,
    r.isArr = F,
    r.isBool = H,
    r.isDoc = tn,
    r.isElm = Q,
    r.isFun = V,
    r.isEmpty = J,
    r.isInt = $,
    r.isNull = G,
    r.isNum = K,
    r.isObj = X,
    r.isStr = Y,
    r.isUnd = Z,
    r.isEvt = rn,
    r.isQsa = en,
    r.isIo = "Intersection" + S in l,
    r.isMo = "Mutation" + S in l,
    r.isRo = "Resize" + S in l,
    r.isNativeLazy = "loading"in HTMLImageElement.prototype,
    r.isAmd = "function" == typeof define && define.amd,
    r.isWin = nn,
    r._er = -1,
    r._ok = 1,
    r.chain = function(n, t) {
        return M.call(n, t)
    }
    ,
    r.each = cn,
    r.extend = u,
    e.extend = function(n, t) {
        return (t = t || !1) ? u(n, e) : u(e, n)
    }
    ,
    r.hasProp = an,
    r.parse = function(n) {
        try {
            return 0 === n.length || "1" === n ? {} : JSON.parse(n)
        } catch (n) {
            return {}
        }
    }
    ,
    r.toArray = fn,
    r.toInt = U,
    r.attr = sn.bind(r),
    r.hasAttr = function(t, n) {
        var e = 0;
        return on(t) && Y(n) && cn(fn(n), function(n) {
            ln(t, m, n) && e++
        }),
        0 < e
    }
    ,
    r.nodeMapAttr = un,
    r.removeAttr = function(n, t, e) {
        return sn(n, t, null, e || "")
    }
    .bind(r),
    r.hasClass = function(n, t) {
        var e, r = 0;
        return on(n) && Y(t) && (e = sn(n, "class"),
        cn(fn(t), function(t) {
            cn(fn(e), function(n) {
                n && n === t && r++
            })
        })),
        0 < r
    }
    ,
    r.toggleClass = dn,
    r.addClass = function(n, t) {
        return dn(n, t, p)
    }
    ,
    r.removeClass = function(n, t) {
        return dn(n, t, h)
    }
    ,
    r.contains = pn,
    r.escape = hn,
    r.startsWith = mn,
    r.trimSpaces = vn,
    r.closest = yn,
    r.is = gn,
    r.equal = bn,
    r.find = En,
    r.findAll = Sn,
    r.remove = function(n) {
        var t;
        !Q(n) || (t = qn(n)) && t.removeChild(n)
    }
    ,
    r.ie = Cn,
    r.pixelRatio = Nn,
    r.windowWidth = xn,
    r.windowSize = function() {
        return {
            width: xn(),
            height: l.innerHeight || o.documentElement.clientHeight
        }
    }
    ,
    r.activeWidth = function(t, n) {
        var e = n.up || !1
          , r = k(t)
          , i = r[0]
          , o = r[r.length - 1]
          , u = n.ww || xn()
          , n = u * Nn()
          , c = e ? u : n;
        return Z(r = r.filter(function(n) {
            return e ? U(n, 0) <= c : U(n, 0) >= c
        }).map(function(n) {
            return t[n]
        })[e ? "pop" : "shift"]()) ? t[o <= c ? o : i] : r
    }
    ,
    r.on = On,
    r.off = An,
    r.one = function(n, t, e, r) {
        return On(n, t, e, {
            once: !0
        }, r)
    }
    ,
    r.trigger = function(n, t, r, i) {
        return M.call(n, function(e) {
            rn(e) && cn(fn(t), function(n) {
                var t = Z(r) ? new Event(n) : (t = {
                    bubbles: !0,
                    cancelable: !0,
                    detail: r || {}
                },
                X(i) && (t = u(t, i)),
                new CustomEvent(n,t));
                e.dispatchEvent(t)
            })
        })
    }
    ,
    r.getScript = function(n, e, t) {
        var r = o.createElement("script")
          , i = o.getElementsByTagName("script")[0];
        r.async = 1,
        r.id = t,
        r.onload = r.onreadystatechange = function(n, t) {
            !t && r.readyState && !/loaded|complete/.test(r.readyState) || (r.onload = r.onreadystatechange = null,
            r = null,
            !t && e && l.setTimeout(e, 0))
        }
        ,
        r.src = n,
        i.parentNode.insertBefore(r, i)
    }
    ,
    r.isDecoded = In,
    r.ready = P.bind(r),
    r.decode = function(e) {
        return In(e) ? Promise.resolve(e) : "decode"in e ? (e.decoding = "async",
        e.decode()) : new Promise(function(n, t) {
            e.onload = function() {
                n(e)
            }
            ,
            e.onerror = t()
        }
        )
    }
    ,
    r.throttle = function(t, e, r) {
        e = e || 50;
        var i = 0;
        return function() {
            var n = +new Date;
            n - i < e || (i = n,
            t.apply(r, arguments))
        }
    }
    ,
    r.resize = function(t, e) {
        return l.onresize = function(n) {
            clearTimeout(e),
            e = setTimeout(t.bind(n), 200)
        }
        ,
        t
    }
    ,
    r.template = function(n, t) {
        for (var e in t)
            an(t, e) && (n = n.replace(new RegExp(hn("$" + e),"g"), t[e]));
        return vn(n)
    }
    ,
    r.context = Tn,
    r.toElm = Mn,
    r.camelCase = function(n) {
        return n.replace(O, function(n, t) {
            return t.toUpperCase()
        })
    }
    ,
    r.isVar = Pn,
    r.computeStyle = function(n, t, e) {
        if (!Q(n))
            return null;
        var r = getComputedStyle(n, null);
        return Z(t) ? r : e || Pn(t) ? r.getPropertyValue(t) || null : r[t] || n.style[t]
    }
    ,
    r.rect = function(n) {
        return Q(n) ? n.getBoundingClientRect() : {}
    }
    ,
    r.empty = function(n) {
        return M.call(n, function(n) {
            if (Q(n))
                for (; n.firstChild; )
                    n.removeChild(n.firstChild)
        })
    }
    ,
    r.parent = qn,
    r.next = function(n, t) {
        return Bn(n, t, "next")
    }
    ,
    r.prev = Rn,
    r.index = function(e, n) {
        var r = 0
          , i = !0;
        if (Q(e) && (Z(n) || cn(fn(n), function(n, t) {
            if (Q(n)) {
                if (i = !1,
                gn(e, n))
                    return r = t,
                    !1
            } else if (Y(n)) {
                n = yn(e, n);
                if (Q(n))
                    return e = n,
                    !1
            }
        }),
        i))
            for (; !G(e = Rn(e)); )
                r++;
        return r
    }
    ,
    r.keys = k,
    r._op = ln,
    r.storage = function(t, e, n, r) {
        if (I) {
            if (Z(e))
                return I.getItem(t);
            if (G(e))
                I.removeItem(t);
            else
                try {
                    I.setItem(t, e)
                } catch (n) {
                    I.removeItem(t),
                    r && I.setItem(t, e)
                }
        }
        return n || !1
    }
    ,
    S = {
        chain: function(n) {
            return M.call(this, n)
        },
        each: function(n) {
            return cn(this, n)
        },
        ready: function(n) {
            return P.call(this, n)
        }
    },
    e.extend(S),
    r.matches = gn,
    r.forEach = cn,
    r.bindEvent = On.bind(r),
    r.unbindEvent = An.bind(r),
    "undefined" != typeof exports ? module.exports = r : l.dBlazy = r
}(this, this.document);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/dblazy.min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.once.min.js. */
!function(o, c) {
    "use strict";
    var u = "data-once"
      , f = "jQuery"in c
      , a = "remove"
      , s = "set"
      , v = /[\11\12\14\15\40]+/;
    function i(e, n, r) {
        return n.filter(function(n) {
            var t = o.is(n, e);
            return t && r && r(n),
            t
        })
    }
    function d(n, t) {
        return o.findAll(t, n)
    }
    function h(n) {
        return "[" + u + '~="' + n + '"]'
    }
    function l(n, t) {
        var e = t.add
          , r = t.remove
          , i = [];
        o.hasAttr(n, u) && (t = o.attr(n, u).trim().split(v),
        o.each(t, function(n) {
            o.contains(i, n) || n === r || i.push(n)
        })),
        e && !o.contains(i, e) && i.push(e);
        e = i.join(" ");
        o._op(n, "" === e ? a : s, u, e.trim())
    }
    function m(t, n, e) {
        return i(":not(" + h(t) + ")", d(n, e), function(n) {
            l(n, {
                add: t
            })
        })
    }
    o.once = function(n, t, e, r) {
        var i = [];
        return o.isStr(n) && o.isUnd(r) ? m(n, t, e) : (o.isUnd(e) ? 0 : (i = m(t, e, r)).length && o.each(i, n),
        i)
    }
    ,
    o.filter = i,
    o.once.find || (o.once.find = function(n, t) {
        return d(n ? h(n) : "[" + u + "]", t)
    }
    ,
    o.once.filter = function(n, t, e) {
        return i(h(n), d(t, e))
    }
    ,
    o.once.remove = function(t, n, e, r) {
        return i(h(t), d(n, e), function(n) {
            l(n, {
                remove: t
            })
        })
    }
    ,
    o.once.removeSafely = function(n, t, e, r) {
        var i = c.jQuery;
        this.find(n, e).length && this.remove(n, t, e, r),
        f && i && i.fn && o.isFun(i.fn.removeOnce) && i(t, o.context(e)).removeOnce(n)
    }
    )
}(dBlazy, this);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.once.min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.sanitizer.min.js. */
!function(i, s) {
    "use strict";
    function a(t, e, n) {
        return t ? ("undefined" != typeof DOMPurify ? (r = DOMPurify.sanitize(t, e),
        r = i.isObj(e) && e.RETURN_DOM ? (n = !0,
        r) : c(r)) : function r(t) {
            t = t.children;
            i.each(t, function(t) {
                var n, e;
                n = t,
                e = i.nodeMapAttr(n.attributes),
                i.each(e, function(t, e) {
                    return !!o(e, t) && void n.removeAttribute(e)
                }),
                r(t)
            })
        }(r = c(t)),
        n ? r.childNodes : r.innerHTML) : "";
        var r
    }
    function o(t, e) {
        t = t.toLowerCase(),
        e = e.replace(/\s+/g, "").toLowerCase();
        return !(!["src", "href", "xlink:href"].includes(t) || !e.includes("script:") && !e.includes("data:text/html")) || t.startsWith("on")
    }
    function c(t) {
        return (new DOMParser).parseFromString(t, "text/html").body || s.createElement("body")
    }
    i.create = function(t, e, n) {
        var r = s.createElement(t);
        return (i.isStr(e) || i.isObj(e)) && (i.isStr(e) ? r.className = e : i.attr(r, e)),
        n && (n = n.trim(),
        r.innerHTML = a(n),
        "template" === t && (r = r.content.firstChild || r)),
        r
    }
    ,
    i.sanitizer = {
        isDangerous: o,
        sanitize: a,
        toNode: c
    },
    i.sanitize = a
}(dBlazy, this.document);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.sanitizer.min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.dom.min.js. */
!function(c, n) {
    "use strict";
    var t = Array.prototype.some
      , u = "remove"
      , h = "width"
      , l = "height"
      , e = "after"
      , r = "before"
      , i = "begin"
      , o = "Top"
      , s = "Left"
      , f = "Height"
      , a = "scroll";
    function d(t, n, r) {
        var i = this
          , e = c.isUnd(r)
          , u = c.isObj(n)
          , o = !u && e;
        if (o && c.isStr(n)) {
            var s = c.toElm(t)
              , f = [h, l, "top", "right", "bottom", "left"]
              , e = c.computeStyle(s, n)
              , s = c.toInt(e, 0);
            return -1 === f.indexOf(n) ? e : s
        }
        return c.chain(t, function(e) {
            if (!c.isElm(e))
                return o ? "" : i;
            function t(t, n) {
                c.isFun(t) && (t = t()),
                (c.contains(n, "-") || c.isVar(n)) && (n = c.camelCase(n)),
                e.style[n] = c.isStr(t) ? t : t + "px"
            }
            u ? c.each(n, t) : c.isNull(r) ? c.each(c.toArray(n), function(t) {
                e.style.removeProperty(t)
            }) : c.isStr(n) && t(r, n)
        })
    }
    function m(t) {
        t = c.rect(t);
        return {
            top: (t.top || 0) + n.body[a + o],
            left: (t.left || 0) + n.body[a + s]
        }
    }
    function p(t, n) {
        return d(t, h, n)
    }
    function g(t, n) {
        return d(t, l, n)
    }
    function v(t, n, e) {
        var r, i = 0;
        return c.isElm(t) && (i = t["offset" + e],
        n && (r = c.computeStyle(t),
        t = function(t) {
            return c.toInt(r["margin" + t], 0)
        }
        ,
        i += e === f ? t(o) + t("Bottom") : t(s) + t("Right"))),
        i
    }
    function y(t, n) {
        return v(t, n, "Width")
    }
    function A(t, n) {
        return v(t, n, f)
    }
    function C(t, n, e) {
        c.isElm(t) && t["insertAdjacent" + (c.isElm(n) ? "Element" : "HTML")](e, n)
    }
    function E(t, n) {
        C(t, n, e + "end")
    }
    function b(t, n) {
        C(t, n, r + i)
    }
    function x(t, n) {
        c.isElm(t) && (c.isElm(n) ? t.appendChild(n) : C(t, n, r + "end"))
    }
    function S(t, n) {
        C(t, n, e + i)
    }
    function H(t, n) {
        c.isUnd(n) && (n = !0);
        return c.chain(t, function(t) {
            return c.isElm(t) && t.cloneNode(n)
        })
    }
    var w = {
        css: function(t, n) {
            return d(this, t, n)
        },
        hasAttr: function(n) {
            return t.call(this, function(t) {
                return c.hasAttr(t, n)
            })
        },
        attr: function(t, n, e) {
            return c.isNull(n) ? this.removeAttr(t, e) : c.attr(this, t, n, e)
        },
        removeAttr: function(t, n) {
            return c.removeAttr(this, t, n)
        },
        hasClass: function(n) {
            return t.call(this, function(t) {
                return c.hasClass(t, n)
            })
        },
        toggleClass: function(t, n) {
            return c.toggleClass(this, t, n)
        },
        addClass: function(t) {
            return this.toggleClass(t, "add")
        },
        removeClass: function(t) {
            return arguments.length ? this.toggleClass(t, u) : this.attr("class", "")
        },
        empty: function() {
            return c.empty(this)
        },
        first: function(t) {
            return c.isUnd(t) ? this[0] : t
        },
        after: function(t) {
            return E(this[0], t)
        },
        before: function(t) {
            return b(this[0], t)
        },
        append: function(t) {
            return x(this[0], t)
        },
        prepend: function(t) {
            return S(this[0], t)
        },
        remove: function() {
            this.each(c.remove)
        },
        closest: function(t) {
            return c.closest(this[0], t)
        },
        equal: function(t) {
            return c.equal(this[0], t)
        },
        find: function(t, n) {
            return c.find(this[0], t, n)
        },
        findAll: function(t) {
            return c.findAll(this[0], t)
        },
        clone: function(t) {
            return H(this, t)
        },
        computeStyle: function(t) {
            return c.computeStyle(this[0], t)
        },
        offset: function() {
            return m(this[0])
        },
        parent: function(t) {
            return c.parent(this[0], t)
        },
        prev: function(t) {
            return c.prev(this[0], t)
        },
        next: function(t) {
            return c.next(this[0], t)
        },
        index: function(t) {
            return c.index(this[0], t)
        },
        width: function(t) {
            return p(this[0], t)
        },
        height: function(t) {
            return g(this[0], t)
        },
        outerWidth: function(t) {
            return y(this[0], t)
        },
        outerHeight: function(t) {
            return A(this[0], t)
        },
        on: function(t, n, e, r, i) {
            return c.on(this, t, n, e, r, i, "add")
        },
        off: function(t, n, e, r, i) {
            return c.off(this, t, n, e, r, i, u)
        },
        one: function(t, n, e) {
            return c.one(this, t, n, e)
        },
        trigger: function(t, n, e) {
            return c.trigger(this, t, n, e)
        }
    };
    c.fn.extend(w),
    c.css = d,
    c.offset = m,
    c.clone = H,
    c.after = E,
    c.before = b,
    c.append = x,
    c.prepend = S,
    c.width = p,
    c.height = g,
    c.outerWidth = y,
    c.outerHeight = A
}(dBlazy, this.document);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.dom.min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/base/blazy.base.min.js. */
!function(e, r, i) {
    "use strict";
    function u(t) {
        return t.target || t
    }
    function c(t, n) {
        return e.hasClass(u(t), n)
    }
    e.debounce = function(t, n, i, e) {
        return i ? r.debounce(function() {
            t.call(i, n)
        }, e || 201, !0) : r.debounce.call(this, t)
    }
    ,
    e.matchMedia = function(t, n) {
        return !!i.matchMedia && (e.isUnd(n) && (n = "max"),
        i.matchMedia("(" + n + "-device-width: " + t + ")").matches)
    }
    ,
    e.isBg = function(t, n) {
        return c(t, n && n.bgClass || "b-bg")
    }
    ,
    e.isBlur = function(t) {
        return c(t, "b-blur")
    }
    ,
    e.isGrid = function(t) {
        return e.isElm(e.closest(u(t), ".grid"))
    }
    ,
    e.isHtml = function(t) {
        return c(t, "b-html")
    }
    ,
    e.image = {
        alt: function(t, n) {
            var i = e.find(t, "img:not(.b-blur)")
              , i = e.attr(i, "alt");
            return n = n || "Video preview",
            i || (t = e.find(t, ".media"),
            i = e.attr(t, "title")),
            i ? r.checkPlain(i) : r.t(n)
        },
        ratio: function(t) {
            var n = e.toInt(t.width, 640);
            return (e.toInt(t.height, 360) / n * 100).toFixed(2)
        },
        dimension: function(t, n) {
            return {
                width: t,
                height: n
            }
        },
        hack: function(t, n) {
            return {
                paddingBottom: t,
                height: n
            }
        }
    }
}(dBlazy, Drupal, this);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/base/blazy.base.min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.dataset.min.js. */
!function(i) {
    "use strict";
    function o(t, n, a) {
        return i.chain(t, function(e) {
            i.isElm(e) && i.each(i.toArray(n), function(t) {
                var n, r = "data-" + t;
                i.hasAttr(e, r) && (n = i.attr(e, r),
                i.attr(e, t, n),
                a && i.removeAttr(e, r))
            })
        })
    }
    function e(t, a, u, c) {
        i.isUnd(c) && (c = !0);
        return i.chain(t, function(t) {
            var n, r, e;
            i.isElm(t) && (n = t.parentNode,
            r = i.equal(n, "picture"),
            e = null,
            c ? e = r ? n : t : r && (e = n),
            i.isElm(e) && (e = e.getElementsByTagName("source"),
            a = a || (r ? "srcset" : "src"),
            e.length && o(e, a, u)))
        })
    }
    i.mapAttr = o,
    i.fn.mapAttr = function(t, n) {
        return o(this, t, n)
    }
    ,
    i.mapSource = e,
    i.fn.mapSource = function(t, n, r) {
        return e(this, t, n, r)
    }
}(dBlazy);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.dataset.min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.viewport.min.js. */
!function(r, e, o) {
    "use strict";
    function s(t) {
        return t ? t.target || t : null
    }
    function u(t) {
        t = t || 0;
        var i = r.windowSize();
        return {
            top: 0 - t,
            left: 0 - t,
            bottom: i.height + t,
            right: i.width + t
        }
    }
    function f(t) {
        t = s(t);
        return t && r.isNull(t.offsetParent)
    }
    r.viewport = {
        vp: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        ww: 0,
        init: function(t) {
            return this.vp = u(t.offset),
            this.vp
        },
        isResized: function(t, i) {
            return i && "contentRect"in i && (!!i.contentRect || !!t.resizeTrigger) || !1
        },
        isHidden: f,
        isVisible: function(t, i) {
            if (!t)
                return !1;
            var n = s(t);
            return r.isIo && "isIntersecting"in t ? t.isIntersecting || 0 < t.intersectionRatio : (n = n,
            i = i,
            n = r.isElm(n) ? r.rect(n) : n,
            i = i || u(),
            n.right >= i.left && n.bottom >= i.top && n.left <= i.right && n.top <= i.bottom)
        },
        onresizing: function(t, i) {
            var n = t.elms
              , e = t.options;
            r.isFun(e.resizing) && e.resizing(t, n, i)
        },
        update: function(t) {
            var i = this
              , n = t.offset;
            return i.vp.bottom = (e.innerHeight || o.documentElement.clientHeight) + n,
            i.vp.right = (e.innerWidth || o.documentElement.clientWidth) + n,
            i.windowData(t)
        },
        visibleParent: function(t) {
            for (var t = s(t), i = r.parent(t), n = i; i; ) {
                if (r.isElm(i) && !f(i)) {
                    n = i;
                    break
                }
                i = i.parentElement || i.parentNode
            }
            return n
        },
        windowData: function(t, i) {
            var n = this
              , e = t.offset || 100
              , r = t.mobileFirst || !1;
            return i && n.init(t),
            n.ww = n.vp.right - e,
            {
                vp: n.vp,
                ww: n.ww,
                up: r
            }
        }
    }
}(dBlazy, this, this.document);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.viewport.min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.xlazy.min.js. */
!function(l, s) {
    "use strict";
    var u = "data-"
      , e = "srcset"
      , d = u + "src"
      , f = [e, "src"]
      , b = 0;
    function r(s, e, r) {
        var t = l.closest(s, r.parent) || s
          , a = e === l._ok || !0 === e
          , o = r.successClass
          , i = r.errorClass
          , c = "is-" + o
          , n = "is-" + i;
        return l.addClass(s, a ? o : i),
        l.addClass(t, a ? c : n),
        a ? (i = s,
        c = e,
        n = t,
        a = r,
        (l.isFun(a.success) || l.isObj(a.success)) && a.success(i, c, n, a),
        0 < b && b--,
        l.hasAttr(s, d) && l.removeAttr(s, f, u)) : (s = s,
        e = e,
        t = t,
        r = r,
        (l.isFun(r.error) || l.isObj(r.error)) && r.error(s, e, t, r),
        b = ++b),
        b
    }
    l._defaults = {
        error: !1,
        offset: 100,
        root: s,
        success: !1,
        selector: ".b-lazy",
        separator: "|",
        container: !1,
        containerClass: !1,
        errorClass: "b-error",
        loadInvisible: !1,
        successClass: "b-loaded",
        visibleClass: !1,
        validateDelay: 25,
        saveViewportOffsetDelay: 50,
        srcset: "data-srcset",
        src: d,
        bgClass: "b-bg",
        isMedia: !1,
        parent: ".media",
        disconnect: !1,
        intersecting: !1,
        observing: !1,
        resizing: !1,
        mobileFirst: !1,
        rootMargin: "0px",
        threshold: [0]
    },
    l.isCompleted = function(s) {
        if (l.isElm(s)) {
            if (l.equal(s, "img"))
                return l.isDecoded(s);
            if (l.equal(s, "iframe"))
                return "complete" === (s.contentDocument || s.contentWindow.document).readyState
        }
        return !1
    }
    ,
    l.selector = function(s, e) {
        var r = s.selector;
        return e && l.isBool(e) && (e = ":not(." + s.successClass + ")"),
        r + (e = e || "")
    }
    ,
    l.status = r
}(dBlazy, this.document);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.xlazy.min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.observer.min.js. */
!function(h, u) {
    "use strict";
    var c = h.viewport;
    h.observer = {
        init: function(i, o, e, n) {
            var r, t = i.options || {}, a = i._queue || [], s = "windowData"in i ? i.windowData() : {}, u = h.viewport, c = {
                rootMargin: t.rootMargin || "0px",
                threshold: t.threshold || 0
            };
            function v(e) {
                var n;
                return a.length || (n = requestAnimationFrame(l),
                i._raf.push(n)),
                a.push(e),
                !1
            }
            function l() {
                var e, n, r;
                e = a,
                n = o,
                r = i,
                h.each(e, n.bind(r)),
                e.length = 0
            }
            e = h.toArray(e),
            n && (i.ioObserver = h.isIo ? new IntersectionObserver(v,c) : o.call(i, e));
            return i.roObserver = function() {
                return r = this,
                s = h.isUnd(s.ww) ? u.windowData(t, !0) : i.windowData(),
                h.isRo ? new ResizeObserver(v) : o.call(i, e)
            }(),
            i.resizeTrigger = r,
            s
        },
        observe: function(e, n, r) {
            function i(r) {
                r && n && n.length && h.each(n, function(e) {
                    var n;
                    s && r === t && s.isHidden(e) && (n = s.visibleParent(e),
                    h.isElm(n) && r.observe(n)),
                    r.observe(e)
                })
            }
            var o = e.options || {}
              , t = e.ioObserver
              , a = e.roObserver
              , s = c;
            return h.isIo && (t || a) ? (r && i(t),
            i(a)) : "Blazy"in u && (e.bLazy = new Blazy(o)),
            e
        },
        unload: function(e) {
            e = e._raf;
            e && e.length && h.each(e, function(e) {
                cancelAnimationFrame(e)
            })
        }
    }
}(dBlazy, this);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.observer.min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.loading.min.js. */
!function(s) {
    "use strict";
    function n(n) {
        return s.chain(n, function(n) {
            var a, i = "loading", e = s.parent(n, ".media") || n, n = [n, s.closest(n, ".is-" + i), s.closest(n, '[class*="' + i + '"]')];
            setTimeout(function() {
                a = s.next(e, ".b-loader"),
                s.isElm(a) && s.remove(a)
            }, 1500),
            s.each(n, function(n) {
                var a;
                s.isElm(n) && (a = n.className,
                s.contains(a, i) && (n.className = a.replace(/(\S+)loading/g, "")))
            })
        })
    }
    s.unloading = n,
    s.fn.unloading = function() {
        return n(this)
    }
}(dBlazy);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/plugin/blazy.loading.min.js. */
;/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/polyfill/blazy.webp.min.js. */
!function(c, t, s) {
    "use strict";
    var r = "bwebp"
      , o = "data-srcset"
      , p = "picture"
      , l = "image/webp"
      , d = "source"
      , n = t.picturefill;
    function e() {
        var t = !0;
        if (n) {
            var e = c.storage(r);
            if (!c.isNull(e))
                return "true" === e;
            t = c.isUnd(n._.supportsType(l)),
            c.storage(r, t)
        }
        return t
    }
    function i(t) {
        var e = s.importNode(t, !0)
          , r = []
          , n = []
          , i = c.attr(e, o)
          , t = c.attr(e, "srcset");
        return !(!t.length && !i.length || !(t = t.length ? t : i).length || (c.each(t.split(","), function(t) {
            (c.contains(t, ".webp") ? r : n).push(t)
        }),
        !r.length)) && function(t, e, r, n) {
            if (!c.isElm(t))
                return !1;
            var i = c.create(p)
              , s = c.create(d)
              , a = c.attr(t, "sizes")
              , u = e.join(",").trim()
              , e = r.join(",").trim()
              , r = c.find(i, d);
            return c.isElm(r) || (n ? (c.attr(s, o, u),
            c.attr(t, o, e)) : (s.srcset = u,
            t.srcset = e),
            a && (s.sizes = a),
            s.type = l,
            c.append(i, s),
            c.append(i, t)),
            i
        }(e, r, n, i.length)
    }
    c.webp = {
        isSupported: e,
        run: function(t) {
            !e() && t.length && c.each(t, function(t) {
                var e = c.equal(t, "img")
                  , r = c.closest(t, p);
                e && c.isNull(r) && (e = c.closest(t, ".media") || t.parentNode,
                (r = i(t)) && (c.append(e, r),
                c.remove(t)))
            })
        }
    }
}(dBlazy, this, this.document);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/polyfill/blazy.webp.min.js. */
;/* @license MIT https://github.com/dinbror/blazy/blob/master/LICENSE */
/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/base/blazy.min.js. */
!function(t, e) {
    "use strict";
    var o = "Blazy"
      , s = t.dBlazy;
    s.isAmd ? define([o, s, t], e) : "object" == typeof exports ? module.exports = e(o, s, t) : t.Blazy = e(o, s, t)
}(this, function(f, u, o) {
    "use strict";
    var d, v, n = o.document, g = "srcset", i = {}, r = {}, p = {}, a = u.viewport;
    return function(t) {
        var s = this;
        s.name = f,
        s.options = i = u.extend(u._defaults, t || {}),
        s.options.container = !!i.containerClass && u.findAll(n, i.containerClass),
        s.destroyed = !0;
        t = s._util = {};
        return i = s.options,
        d = i.src || "data-src",
        v = 1 < u.pixelRatio(),
        a.init(i),
        s.windowData = function() {
            return u.isUnd(p.vp) ? a.windowData(i, !0) : p
        }
        ,
        s.revalidate = function() {
            e(s)
        }
        ,
        s.load = function(t, e) {
            var o = s.options;
            t && u.isUnd(t.length) ? c(t, e, o) : u.each(t, function(t) {
                c(t, e, o)
            })
        }
        ,
        s.destroy = function() {
            var e = s._util;
            i.container && u.each(i.container, function(t) {
                u.off(t, "scroll." + f, e.validateT)
            }),
            u.off(o, "scroll." + f, e.validateT),
            u.off(o, "resize." + f, e.validateT),
            u.off(o, "resize." + f, e.saveViewportOffsetT),
            s.count = 0,
            s.elms.length = 0,
            s.destroyed = !0
        }
        ,
        t.validateT = u.throttle(function() {
            l(s)
        }, i.validateDelay, s),
        t.saveViewportOffsetT = u.throttle(function() {
            b(i),
            a.onresizing(s, p)
        }, i.saveViewportOffsetDelay, s),
        b(i),
        setTimeout(function() {
            e(s)
        }),
        s
    }
    ;
    function e(t) {
        var e = t._util;
        t.elms = u.findAll(i.root || n, u.selector(i)),
        t.count = t.elms.length,
        t.destroyed && (t.destroyed = !1,
        i.container && u.each(i.container, function(t) {
            u.on(t, "scroll." + f, e.validateT)
        }),
        u.on(o, "resize." + f, e.saveViewportOffsetT),
        u.on(o, "resize." + f, e.validateT),
        u.on(o, "scroll." + f, e.validateT)),
        l(t)
    }
    function l(t) {
        for (var e = 0; e < t.count; e++) {
            var o = t.elms[e];
            (function(t, e) {
                var o = u.rect(t);
                if (e.container) {
                    var s = u.closest(t, e.containerClass);
                    if (s) {
                        var n = u.rect(s);
                        if (a.isVisible(n, r)) {
                            var i = n.top - e.offset
                              , t = n.right + e.offset
                              , s = n.bottom + e.offset
                              , e = n.left - e.offset
                              , e = {
                                top: i > r.top ? i : r.top,
                                right: t < r.right ? t : r.right,
                                bottom: s < r.bottom ? s : r.bottom,
                                left: e > r.left ? e : r.left
                            };
                            return a.isVisible(o, e)
                        }
                        return !1
                    }
                }
                return a.isVisible(o, r)
            }(o, t.options) || u.hasClass(o, t.options.successClass)) && (t.load(o),
            t.elms.splice(e, 1),
            t.count--,
            e--)
        }
        0 === t.count && t.destroy()
    }
    function c(t, e, o) {
        var s, n, i, r, a, l, c;
        !u.hasClass(t, o.successClass) && (e || o.loadInvisible || 0 < t.offsetWidth && 0 < t.offsetHeight) && ((c = u.attr(t, d) || u.attr(t, o.src)) ? (e = c.split(o.separator),
        s = e[v && 1 < e.length ? 1 : 0],
        n = u.attr(t, o.srcset),
        c = u.isBg(t, o),
        i = u.equal(t, "img"),
        e = t.parentNode,
        r = u.equal(e, "picture"),
        a = u.ie(t),
        l = a && t.currentStyle["object-fit"],
        i || c ? (c = new Image,
        r && (c = t,
        u.each(e.getElementsByTagName("source"), function(t) {
            h(t, g, o.srcset)
        })),
        u.one(c, "error." + f, function() {
            u.status(t, !1, o)
        }),
        u.one(c, "load." + f, function() {
            i ? r || (y(t, s, n, l),
            l && (t.style.backgroundImage = 'url("' + s + '")')) : (l = a,
            u.isFun(u.bgUrl) ? (s = u.bgUrl(t, p),
            u.bg(t, p)) : t.style.backgroundImage = 'url("' + s + '")'),
            m(t, o)
        }),
        y(c, s, n, l)) : (t.src = s,
        m(t, o))) : u.equal(t, "video") ? (u.each(t.getElementsByTagName("source"), function(t) {
            h(t, "src", o.src)
        }),
        t.load(),
        m(t, o)) : (o.error && o.error(t, "missing"),
        u.addClass(t, o.errorClass)))
    }
    function m(t, e) {
        u.status(t, !0, e)
    }
    function h(t, e, o) {
        var s = u.attr(t, o);
        s && (u.attr(t, e, s),
        u.removeAttr(t, o))
    }
    function y(t, e, o, s) {
        o && u.attr(t, g, o),
        s ? (u.addClass(t, "is-b-ie"),
        t.src = "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20" + (t.width || 1) + "%20" + (t.height || 1) + "'%2F%3E") : t.src = e
    }
    function b(t) {
        p = a.update(t),
        r = a.vp
    }
});

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/base/blazy.min.js. */
;/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/blazy/js/base/io/bio.min.js. */
!function(i, e) {
    "use strict";
    var s = "Bio"
      , t = i.dBlazy;
    t.isAmd ? define([s, t, i], e) : "object" == typeof exports ? module.exports = e(s, t, i) : i[s] = e(s, t, i)
}(this || module || {}, function(s, f, v) {
    "use strict";
    f.isAmd && (v = window);
    var t, o, n = v.document, r = n, p = "bio", h = {}, a = 0, e = 0, l = 0, d = "b-bg", b = "is-b-visible", u = p + ".intersecting " + p + ":intersecting", g = ".media", m = "addClass", y = "removeClass", c = !1, z = 25, C = 0, w = f.observer, L = f.viewport;
    function i(i) {
        var e = f.extend({}, o, this);
        return e.name = s,
        e.options = t = f.extend({}, f._defaults, i || {}),
        d = t.bgClass || d,
        z = t.validateDelay || z,
        g = t.parent || g,
        r = t.root || r,
        setTimeout(function() {
            e.reinit()
        }),
        e
    }
    function x(i, e) {
        var s = this
          , t = s.options
          , o = t.selector
          , n = s.count
          , r = s.ioObserver
          , d = t.visibleClass || e || !1;
        a === n - 1 && (f.trigger(v, p + ":done", {
            options: t
        }),
        d || s.destroyQuietly()),
        r && (f.is(i, o) || (o = f.find(i, o),
        f.isElm(o) && (r.unobserve(i),
        i = o)),
        s.isLoaded(i) && !e && (t.isMedia && !d && r.unobserve(i),
        a++)),
        i.bhit && !e || (s.lazyLoad(i, h),
        f.isFun(t.intersecting) && t.intersecting(i, t),
        f.trigger(i, u, {
            options: t
        }),
        l++,
        i.bhit = !0)
    }
    function A(i) {
        var n = this
          , r = n.options
          , d = L.vp || {}
          , a = L.ww || 0
          , e = i[0]
          , l = f.isBlur(e)
          , e = L.isResized(n, e)
          , u = r.visibleClass
          , c = f.isBool(u) && u;
        if (e)
            h = L.update(r),
            L.onresizing(n, h),
            0 < C && (e = {
                winData: h,
                entries: n.elms,
                currentWidth: a,
                oldWidth: C,
                enlarged: C < a
            },
            C !== a ? f.trigger(v, p + ":resizing", e) : f.trigger(v, p + ":resized", e),
            n.resizeTick++);
        else if (n.destroyed && !u)
            return;
        f.each(i, function(i) {
            var e = i.target || i
              , s = L.isResized(n, i)
              , t = L.isVisible(i, d)
              , o = f.closest(e, g) || e;
            l = l && !f.hasClass(o, "is-b-animated"),
            t ? (x.call(n, e),
            n.isLoaded(e) && ((l || c) && f[m](o, b),
            c || setTimeout(function() {
                f[y](o, b)
            }, 601))) : f[y](o, b),
            u && f.isStr(u) && f[t ? m : y](o, u),
            s && 0 < C && !l && C !== a && n.resizing(e, h),
            f.isFun(r.observing) && r.observing(i, t, r)
        }),
        C = a
    }
    return (o = i.prototype).constructor = i,
    o.count = 0,
    o.erCount = 0,
    o.resizeTick = 0,
    o.destroyed = !1,
    o.options = {},
    o.lazyLoad = function(i, e) {}
    ,
    o.loadImage = function(i, e, s) {}
    ,
    o.resizing = function(i, e) {}
    ,
    o.prepare = function() {}
    ,
    o.windowData = function() {
        return f.isUnd(h.vp) ? L.windowData(this.options, !0) : h
    }
    ,
    o.load = function(i, e, s) {
        var t = this;
        i = i && f.toArray(i),
        f.isUnd(s) || (t.options = f.extend({}, t.options, s || {})),
        e = e || t.options.loadInvisible,
        f.each(i, function(i) {
            (t.isValid(i) || f.isElm(i) && e) && x.call(t, i, e)
        })
    }
    ,
    o.isLoaded = function(i) {
        return f.hasClass(i, this.options.successClass)
    }
    ,
    o.isValid = function(i) {
        return f.isElm(i) && !this.isLoaded(i)
    }
    ,
    o.revalidate = function(i) {
        (!0 === i || this.count !== l) && e < l && (this.elms = f.findAll(r, f.selector(this.options))).length && (this.observe(!0),
        e++)
    }
    ,
    o.destroyQuietly = function(i) {
        var e = this.options;
        this.destroyed || !i && !f.isUnd(Drupal.io) || (e = f.find(n, f.selector(e, ":not(." + e.successClass + ")")),
        f.isElm(e) || this.destroy(i))
    }
    ,
    o.destroy = function(i) {
        var e = this
          , s = e.options
          , t = e.ioObserver
          , s = a === e.count - 1 && s.disconnect;
        e.destroyed || 0 < e.erCounted && !i || (s || i) && (t && t.disconnect(),
        w.unload(e),
        e.count = 0,
        e.elms = [],
        e.ioObserver = null,
        e.destroyed = !0)
    }
    ,
    o.observe = function(i) {
        var e = this
          , s = e.elms;
        i = i || e.destroyed,
        c && !i || (f.isIo && (h = w.init(e, A, s, !0),
        e.destroyed = !1),
        w.observe(e, s, !0),
        c = !0)
    }
    ,
    o.reinit = function() {
        this.destroyed = !0,
        a = 0,
        function(i) {
            i.prepare();
            var e = f.findAll(r, f.selector(i.options));
            i.elms = e,
            i.count = e.length,
            i._raf = [],
            i._queue = [],
            i.observe(!0)
        }(this)
    }
    ,
    i
});

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/blazy/js/base/io/bio.min.js. */
;