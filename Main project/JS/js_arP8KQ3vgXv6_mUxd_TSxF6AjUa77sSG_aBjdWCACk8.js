/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function(_, $, Drupal, drupalSettings) {
    'use strict';
    var Bootstrap = {
        processedOnce: {},
        settings: drupalSettings.bootstrap || {}
    };
    Bootstrap.checkPlain = function(str) {
        return str && Drupal.checkPlain(str) || '';
    }
    ;
    Bootstrap.createPlugin = function(id, plugin, noConflict) {
        if ($.fn[id] !== void 0)
            return this.fatal('Specified jQuery plugin identifier already exists: @id. Use Drupal.bootstrap.replacePlugin() instead.', {
                '@id': id
            });
        if (typeof plugin !== 'function')
            return this.fatal('You must provide a constructor function to create a jQuery plugin "@id": @plugin', {
                '@id': id,
                '@plugin': plugin
            });
        this.pluginNoConflict(id, plugin, noConflict);
        $.fn[id] = plugin;
    }
    ;
    Bootstrap.diffObjects = function(objects) {
        var args = Array.prototype.slice.call(arguments);
        return _.pick(args[0], _.difference.apply(_, _.map(args, function(obj) {
            return Object.keys(obj);
        })));
    }
    ;
    Bootstrap.eventMap = {
        Event: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
        MouseEvent: /^(?:click|dblclick|mouse(?:down|enter|leave|up|over|move|out))$/,
        KeyboardEvent: /^(?:key(?:down|press|up))$/,
        TouchEvent: /^(?:touch(?:start|end|move|cancel))$/
    };
    Bootstrap.extendPlugin = function(id, callback) {
        if (typeof $.fn[id] !== 'function')
            return this.fatal('Specified jQuery plugin identifier does not exist: @id', {
                '@id': id
            });
        if (typeof callback !== 'function')
            return this.fatal('You must provide a callback function to extend the jQuery plugin "@id": @callback', {
                '@id': id,
                '@callback': callback
            });
        var constructor = $.fn[id] && $.fn[id].Constructor || $.fn[id];
        var plugin = callback.apply(constructor, [this.settings]);
        if (!$.isPlainObject(plugin))
            return this.fatal('Returned value from callback is not a plain object that can be used to extend the jQuery plugin "@id": @obj', {
                '@obj': plugin
            });
        this.wrapPluginConstructor(constructor, plugin, true);
        return $.fn[id];
    }
    ;
    Bootstrap.superWrapper = function(parent, fn) {
        return function() {
            var previousSuper = this.super;
            this.super = parent;
            var ret = fn.apply(this, arguments);
            if (previousSuper)
                this.super = previousSuper;
            else
                delete this.super;
            return ret;
        }
        ;
    }
    ;
    Bootstrap.fatal = function(message, args) {
        if (this.settings.dev && console.warn) {
            for (var name in args)
                if (args.hasOwnProperty(name) && typeof args[name] === 'object')
                    args[name] = JSON.stringify(args[name]);
            Drupal.throwError(new Error(Drupal.formatString(message, args)));
        }
        return false;
    }
    ;
    Bootstrap.intersectObjects = function(objects) {
        var args = Array.prototype.slice.call(arguments);
        return _.pick(args[0], _.intersection.apply(_, _.map(args, function(obj) {
            return Object.keys(obj);
        })));
    }
    ;
    Bootstrap.normalizeObject = function(obj) {
        if (!$.isPlainObject(obj))
            return obj;
        for (var k in obj)
            if (typeof obj[k] === 'string')
                if (obj[k] === 'true')
                    obj[k] = true;
                else if (obj[k] === 'false')
                    obj[k] = false;
                else {
                    if (obj[k].match(/^[\d-.]$/))
                        obj[k] = parseFloat(obj[k]);
                }
            else {
                if ($.isPlainObject(obj[k]))
                    obj[k] = Bootstrap.normalizeObject(obj[k]);
            }
        return obj;
    }
    ;
    Bootstrap.once = function(id, callback) {
        if (this.processedOnce[id])
            return this;
        callback.call(this, this.settings);
        this.processedOnce[id] = true;
        return this;
    }
    ;
    Bootstrap.option = function(key, value) {
        var options = $.isPlainObject(key) ? $.extend({}, key) : {};
        if (arguments.length === 0)
            return $.extend({}, this.options);
        if (typeof key === "string") {
            var parts = key.split('.');
            key = parts.shift();
            var obj = options;
            if (parts.length) {
                for (var i = 0; i < parts.length - 1; i++) {
                    obj[parts[i]] = obj[parts[i]] || {};
                    obj = obj[parts[i]];
                }
                key = parts.pop();
            }
            if (arguments.length === 1)
                return obj[key] === void 0 ? null : obj[key];
            obj[key] = value;
        }
        $.extend(true, this.options, options);
    }
    ;
    Bootstrap.pluginNoConflict = function(id, plugin, noConflict) {
        if (plugin.noConflict === void 0 && (noConflict === void 0 || noConflict)) {
            var old = $.fn[id];
            plugin.noConflict = function() {
                $.fn[id] = old;
                return this;
            }
            ;
        }
    }
    ;
    Bootstrap.relayEvent = function(target, name, stopPropagation) {
        return function(e) {
            if (stopPropagation === void 0 || stopPropagation)
                e.stopPropagation();
            var $target = $(target);
            var parts = name.split('.').filter(Boolean);
            var type = parts.shift();
            e.target = $target[0];
            e.currentTarget = $target[0];
            e.namespace = parts.join('.');
            e.type = type;
            $target.trigger(e);
        }
        ;
    }
    ;
    Bootstrap.replacePlugin = function(id, callback, noConflict) {
        if (typeof $.fn[id] !== 'function')
            return this.fatal('Specified jQuery plugin identifier does not exist: @id', {
                '@id': id
            });
        if (typeof callback !== 'function')
            return this.fatal('You must provide a valid callback function to replace a jQuery plugin: @callback', {
                '@callback': callback
            });
        var constructor = $.fn[id] && $.fn[id].Constructor || $.fn[id];
        var plugin = callback.apply(constructor, [this.settings]);
        if (typeof plugin !== 'function')
            return this.fatal('Returned value from callback is not a usable function to replace a jQuery plugin "@id": @plugin', {
                '@id': id,
                '@plugin': plugin
            });
        this.wrapPluginConstructor(constructor, plugin);
        this.pluginNoConflict(id, plugin, noConflict);
        $.fn[id] = plugin;
    }
    ;
    Bootstrap.simulate = function(element, type, options) {
        var ret = true;
        if (element instanceof $) {
            element.each(function() {
                if (!Bootstrap.simulate(this, type, options))
                    ret = false;
            });
            return ret;
        }
        if (!(element instanceof HTMLElement))
            this.fatal('Passed element must be an instance of HTMLElement, got "@type" instead.', {
                '@type': typeof element
            });
        if (typeof $.simulate === 'function') {
            new $.simulate(element,type,options);
            return true;
        }
        var event;
        var ctor;
        var types = [].concat(type);
        for (var i = 0, l = types.length; i < l; i++) {
            type = types[i];
            for (var name in this.eventMap)
                if (this.eventMap[name].test(type)) {
                    ctor = name;
                    break;
                }
            if (!ctor)
                throw new SyntaxError('Only rudimentary HTMLEvents, KeyboardEvents and MouseEvents are supported: ' + type);
            var opts = {
                bubbles: true,
                cancelable: true
            };
            if (ctor === 'KeyboardEvent' || ctor === 'MouseEvent')
                $.extend(opts, {
                    ctrlKey: !1,
                    altKey: !1,
                    shiftKey: !1,
                    metaKey: !1
                });
            if (ctor === 'MouseEvent')
                $.extend(opts, {
                    button: 0,
                    pointerX: 0,
                    pointerY: 0,
                    view: window
                });
            if (options)
                $.extend(opts, options);
            if (typeof window[ctor] === 'function') {
                event = new window[ctor](type,opts);
                if (!element.dispatchEvent(event))
                    ret = false;
            } else if (document.createEvent) {
                event = document.createEvent(ctor);
                event.initEvent(type, opts.bubbles, opts.cancelable);
                if (!element.dispatchEvent(event))
                    ret = false;
            } else if (typeof element.fireEvent === 'function') {
                event = $.extend(document.createEventObject(), opts);
                if (!element.fireEvent('on' + type, event))
                    ret = false;
            } else {
                if (typeof element[type])
                    element[type]();
            }
        }
        return ret;
    }
    ;
    Bootstrap.stripHtml = function(html) {
        if (html instanceof $)
            html = html.html();
        else {
            if (html instanceof Element)
                html = html.innerHTML;
        }
        var tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').replace(/^[\s\n\t]*|[\s\n\t]*$/, '');
    }
    ;
    Bootstrap.unsupported = function(type, name, value) {
        Bootstrap.warn('Unsupported by Drupal Bootstrap: (@type) @name -> @value', {
            '@type': type,
            '@name': name,
            '@value': typeof value === 'object' ? JSON.stringify(value) : value
        });
    }
    ;
    Bootstrap.warn = function(message, args) {
        if (this.settings.dev && console.warn)
            console.warn(Drupal.formatString(message, args));
    }
    ;
    Bootstrap.wrapPluginConstructor = function(constructor, plugin, extend) {
        var proto = constructor.prototype;
        var option = this.option;
        if (proto.option === void (0))
            proto.option = function() {
                return option.apply(this, arguments);
            }
            ;
        if (extend) {
            if (plugin.prototype !== void 0)
                for (var key in plugin.prototype) {
                    if (!plugin.prototype.hasOwnProperty(key))
                        continue;
                    var value = plugin.prototype[key];
                    if (typeof value === 'function')
                        proto[key] = this.superWrapper(proto[key] || function() {}
                        , value);
                    else
                        proto[key] = $.isPlainObject(value) ? $.extend(true, {}, proto[key], value) : value;
                }
            delete plugin.prototype;
            for (key in plugin) {
                if (!plugin.hasOwnProperty(key))
                    continue;
                value = plugin[key];
                if (typeof value === 'function')
                    constructor[key] = this.superWrapper(constructor[key] || function() {}
                    , value);
                else
                    constructor[key] = $.isPlainObject(value) ? $.extend(true, {}, constructor[key], value) : value;
            }
        }
    }
    ;
    Drupal.bootstrap = Drupal.bootstrap || Bootstrap;
}
)(window._, window.jQuery, window.Drupal, window.drupalSettings);
;(function($, Drupal, Bootstrap, Attributes) {
    if (!Drupal.icon)
        Drupal.icon = {
            bundles: {}
        };
    if (!Drupal.theme.icon || Drupal.theme.prototype.icon)
        $.extend(Drupal.theme, {
            icon: function(bundle, icon, attributes) {
                if (!Drupal.icon.bundles[bundle])
                    return '';
                attributes = Attributes.create(attributes).addClass('icon').set('aria-hidden', 'true');
                icon = Drupal.icon.bundles[bundle](icon, attributes);
                return '<span' + attributes + '></span>';
            }
        });
    Drupal.icon.bundles.bootstrap = function(icon, attributes) {
        attributes.addClass(['glyphicon', 'glyphicon-' + icon]);
    }
    ;
    $.extend(Drupal.theme, {
        ajaxThrobber: function() {
            return Drupal.theme('bootstrapIcon', 'refresh', {
                'class': ['ajax-throbber', 'glyphicon-spin']
            });
        },
        button: function(attributes) {
            attributes = Attributes.create(attributes).addClass('btn');
            var context = attributes.get('context', 'default');
            var label = attributes.get('value', '');
            attributes.remove('context').remove('value');
            if (!attributes.hasClass(['btn-default', 'btn-primary', 'btn-success', 'btn-info', 'btn-warning', 'btn-danger', 'btn-link']))
                attributes.addClass('btn-' + Bootstrap.checkPlain(context));
            if (!attributes.exists('type'))
                attributes.set('type', attributes.hasClass('form-submit') ? 'submit' : 'button');
            return '<button' + attributes + '>' + label + '</button>';
        },
        btn: function(attributes) {
            return Drupal.theme('button', attributes);
        },
        'btn-block': function(attributes) {
            return Drupal.theme('button', Attributes.create(attributes).addClass('btn-block'));
        },
        'btn-lg': function(attributes) {
            return Drupal.theme('button', Attributes.create(attributes).addClass('btn-lg'));
        },
        'btn-sm': function(attributes) {
            return Drupal.theme('button', Attributes.create(attributes).addClass('btn-sm'));
        },
        'btn-xs': function(attributes) {
            return Drupal.theme('button', Attributes.create(attributes).addClass('btn-xs'));
        },
        bootstrapIcon: function(name, attributes) {
            return Drupal.theme('icon', 'bootstrap', name, attributes);
        }
    });
}
)(window.jQuery, window.Drupal, window.Drupal.bootstrap, window.Attributes);
;(function(factory) {
    'use strict';
    if (typeof exports === 'object' && typeof exports.nodeName !== 'string')
        factory(require('jquery'));
    else if (typeof define === 'function' && define.amd)
        define(['jquery'], factory);
    else
        factory(jQuery);
}
)(function($) {
    'use strict';
    var checkId = function(id) {
        id = id || 'once';
        if (typeof id !== 'string')
            throw new TypeError('The jQuery Once id parameter must be a string');
        return id;
    };
    $.fn.once = function(id) {
        var name = 'jquery-once-' + checkId(id);
        return this.filter(function() {
            return $(this).data(name) !== true;
        }).data(name, true);
    }
    ;
    $.fn.removeOnce = function(id) {
        return this.findOnce(id).removeData('jquery-once-' + checkId(id));
    }
    ;
    $.fn.findOnce = function(id) {
        var name = 'jquery-once-' + checkId(id);
        return this.filter(function() {
            return $(this).data(name) === true;
        });
    }
    ;
});
;(function($, Drupal, window) {
    Drupal.behaviors.goalScripts = {
        data: {
            scriptsAppended: false
        },
        attach: function(context, settings) {
            var $window = $(window);
            $window.svgLogosMap = ["js", "jQuery", "cucumber", "webpack", "lodash", "amazon", "git", "react", "yandex", "cordova", "php", "html5", "debian", "backbone", "docker", "analytics", "css3", "memcached", "nodejs", "webgl", "bash", "apache", "varnish", "mysql", "adwords", "centos", "nginx", "mariadb", "ansible", "ubuntu", "drupal", "python", "less", "apc"];
            var that = this;
            $(document, context).once('global_scroll').each(function() {
                $window.scroll(function() {
                    if (!that.scriptsAppended && $('#logos-map').length) {
                        that.scriptsAppended = true;
                        setTimeout(function() {
                            var snap = document.createElement("script");
                            snap.setAttribute("src", "/themes/custom/bootstrap_dc/js/svglogos/snap.svg-min.js");
                            document.body.appendChild(snap);
                            var svgScript = document.createElement("script");
                            svgScript.setAttribute("src", "/themes/custom/bootstrap_dc/js/svglogos/svg.logos-min.js");
                            document.body.appendChild(svgScript);
                        }, 1000);
                    }
                });
            });
        }
    };
}
)(jQuery, Drupal, window);
;+function($) {
    'use strict';
    var Button = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Button.DEFAULTS, options);
        this.isLoading = false;
    };
    Button.VERSION = '3.3.6';
    Button.DEFAULTS = {
        loadingText: 'loading...'
    };
    Button.prototype.setState = function(state) {
        var d = 'disabled';
        var $el = this.$element;
        var val = $el.is('input') ? 'val' : 'html';
        var data = $el.data();
        state += 'Text';
        if (data.resetText == null)
            $el.data('resetText', $el[val]());
        setTimeout($.proxy(function() {
            $el[val](data[state] == null ? this.options[state] : data[state]);
            if (state == 'loadingText') {
                this.isLoading = true;
                $el.addClass(d).attr(d, d);
            } else {
                if (this.isLoading) {
                    this.isLoading = false;
                    $el.removeClass(d).removeAttr(d);
                }
            }
        }, this), 0);
    }
    ;
    Button.prototype.toggle = function() {
        var changed = true;
        var $parent = this.$element.closest('[data-toggle="buttons"]');
        if ($parent.length) {
            var $input = this.$element.find('input');
            if ($input.prop('type') == 'radio') {
                if ($input.prop('checked'))
                    changed = false;
                $parent.find('.active').removeClass('active');
                this.$element.addClass('active');
            } else {
                if ($input.prop('type') == 'checkbox') {
                    if (($input.prop('checked')) !== this.$element.hasClass('active'))
                        changed = false;
                    this.$element.toggleClass('active');
                }
            }
            $input.prop('checked', this.$element.hasClass('active'));
            if (changed)
                $input.trigger('change');
        } else {
            this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
            this.$element.toggleClass('active');
        }
    }
    ;
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('bs.button');
            var options = typeof option == 'object' && option;
            if (!data)
                $this.data('bs.button', (data = new Button(this,options)));
            if (option == 'toggle')
                data.toggle();
            else {
                if (option)
                    data.setState(option);
            }
        });
    }
    var old = $.fn.button;
    $.fn.button = Plugin;
    $.fn.button.Constructor = Button;
    $.fn.button.noConflict = function() {
        $.fn.button = old;
        return this;
    }
    ;
    $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function(e) {
        var $btn = $(e.target);
        if (!$btn.hasClass('btn'))
            $btn = $btn.closest('.btn');
        Plugin.call($btn, 'toggle');
        if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]')))
            e.preventDefault();
    }).on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function(e) {
        $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type));
    });
}(jQuery);
;+function($) {
    'use strict';
    var Collapse = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Collapse.DEFAULTS, options);
        this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' + '[data-toggle="collapse"][data-target="#' + element.id + '"]');
        this.transitioning = null;
        if (this.options.parent)
            this.$parent = this.getParent();
        else
            this.addAriaAndCollapsedClass(this.$element, this.$trigger);
        if (this.options.toggle)
            this.toggle();
    };
    Collapse.VERSION = '3.3.6';
    Collapse.TRANSITION_DURATION = 350;
    Collapse.DEFAULTS = {
        toggle: true
    };
    Collapse.prototype.dimension = function() {
        var hasWidth = this.$element.hasClass('width');
        return hasWidth ? 'width' : 'height';
    }
    ;
    Collapse.prototype.show = function() {
        if (this.transitioning || this.$element.hasClass('in'))
            return;
        var activesData;
        var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');
        if (actives && actives.length) {
            activesData = actives.data('bs.collapse');
            if (activesData && activesData.transitioning)
                return;
        }
        var startEvent = $.Event('show.bs.collapse');
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented())
            return;
        if (actives && actives.length) {
            Plugin.call(actives, 'hide');
            activesData || actives.data('bs.collapse', null);
        }
        var dimension = this.dimension();
        this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded', true);
        this.$trigger.removeClass('collapsed').attr('aria-expanded', true);
        this.transitioning = 1;
        var complete = function() {
            this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('');
            this.transitioning = 0;
            this.$element.trigger('shown.bs.collapse');
        };
        if (!$.support.transition)
            return complete.call(this);
        var scrollSize = $.camelCase(['scroll', dimension].join('-'));
        this.$element.one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
    }
    ;
    Collapse.prototype.hide = function() {
        if (this.transitioning || !this.$element.hasClass('in'))
            return;
        var startEvent = $.Event('hide.bs.collapse');
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented())
            return;
        var dimension = this.dimension();
        this.$element[dimension](this.$element[dimension]())[0].offsetHeight;
        this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded', false);
        this.$trigger.addClass('collapsed').attr('aria-expanded', false);
        this.transitioning = 1;
        var complete = function() {
            this.transitioning = 0;
            this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse');
        };
        if (!$.support.transition)
            return complete.call(this);
        this.$element[dimension](0).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);
    }
    ;
    Collapse.prototype.toggle = function() {
        this[this.$element.hasClass('in') ? 'hide' : 'show']();
    }
    ;
    Collapse.prototype.getParent = function() {
        return $(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function(i, element) {
            var $element = $(element);
            this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
        }, this)).end();
    }
    ;
    Collapse.prototype.addAriaAndCollapsedClass = function($element, $trigger) {
        var isOpen = $element.hasClass('in');
        $element.attr('aria-expanded', isOpen);
        $trigger.toggleClass('collapsed', !isOpen).attr('aria-expanded', isOpen);
    }
    ;
    function getTargetFromTrigger($trigger) {
        var href;
        var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '');
        return $(target);
    }
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('bs.collapse');
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option);
            if (!data && options.toggle && /show|hide/.test(option))
                options.toggle = false;
            if (!data)
                $this.data('bs.collapse', (data = new Collapse(this,options)));
            if (typeof option == 'string')
                data[option]();
        });
    }
    var old = $.fn.collapse;
    $.fn.collapse = Plugin;
    $.fn.collapse.Constructor = Collapse;
    $.fn.collapse.noConflict = function() {
        $.fn.collapse = old;
        return this;
    }
    ;
    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function(e) {
        var $this = $(this);
        if (!$this.attr('data-target'))
            e.preventDefault();
        var $target = getTargetFromTrigger($this);
        var data = $target.data('bs.collapse');
        var option = data ? 'toggle' : $this.data();
        Plugin.call($target, option);
    });
}(jQuery);
;+function($) {
    'use strict';
    var backdrop = '.dropdown-backdrop';
    var toggle = '[data-toggle="dropdown"]';
    var Dropdown = function(element) {
        $(element).on('click.bs.dropdown', this.toggle);
    };
    Dropdown.VERSION = '3.3.6';
    function getParent($this) {
        var selector = $this.attr('data-target');
        if (!selector) {
            selector = $this.attr('href');
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '');
        }
        var $parent = selector && $(selector);
        return $parent && $parent.length ? $parent : $this.parent();
    }
    function clearMenus(e) {
        if (e && e.which === 3)
            return;
        $(backdrop).remove();
        $(toggle).each(function() {
            var $this = $(this);
            var $parent = getParent($this);
            var relatedTarget = {
                relatedTarget: this
            };
            if (!$parent.hasClass('open'))
                return;
            if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target))
                return;
            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));
            if (e.isDefaultPrevented())
                return;
            $this.attr('aria-expanded', 'false');
            $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
        });
    }
    Dropdown.prototype.toggle = function(e) {
        var $this = $(this);
        if ($this.is('.disabled, :disabled'))
            return;
        var $parent = getParent($this);
        var isActive = $parent.hasClass('open');
        clearMenus();
        if (!isActive) {
            if ('ontouchstart'in document.documentElement && !$parent.closest('.navbar-nav').length)
                $(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
            var relatedTarget = {
                relatedTarget: this
            };
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));
            if (e.isDefaultPrevented())
                return;
            $this.trigger('focus').attr('aria-expanded', 'true');
            $parent.toggleClass('open').trigger($.Event('shown.bs.dropdown', relatedTarget));
        }
        return false;
    }
    ;
    Dropdown.prototype.keydown = function(e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName))
            return;
        var $this = $(this);
        e.preventDefault();
        e.stopPropagation();
        if ($this.is('.disabled, :disabled'))
            return;
        var $parent = getParent($this);
        var isActive = $parent.hasClass('open');
        if (!isActive && e.which != 27 || isActive && e.which == 27) {
            if (e.which == 27)
                $parent.find(toggle).trigger('focus');
            return $this.trigger('click');
        }
        var desc = ' li:not(.disabled):visible a';
        var $items = $parent.find('.dropdown-menu' + desc);
        if (!$items.length)
            return;
        var index = $items.index(e.target);
        if (e.which == 38 && index > 0)
            index--;
        if (e.which == 40 && index < $items.length - 1)
            index++;
        if (!~index)
            index = 0;
        $items.eq(index).trigger('focus');
    }
    ;
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('bs.dropdown');
            if (!data)
                $this.data('bs.dropdown', (data = new Dropdown(this)));
            if (typeof option == 'string')
                data[option].call($this);
        });
    }
    var old = $.fn.dropdown;
    $.fn.dropdown = Plugin;
    $.fn.dropdown.Constructor = Dropdown;
    $.fn.dropdown.noConflict = function() {
        $.fn.dropdown = old;
        return this;
    }
    ;
    $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function(e) {
        e.stopPropagation();
    }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
}(jQuery);
;+function($) {
    'use strict';
    function transitionEnd() {
        var el = document.createElement('bootstrap');
        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        };
        for (var name in transEndEventNames)
            if (el.style[name] !== undefined)
                return {
                    end: transEndEventNames[name]
                };
        return false;
    }
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false;
        var $el = this;
        $(this).one('bsTransitionEnd', function() {
            called = true;
        });
        var callback = function() {
            if (!called)
                $($el).trigger($.support.transition.end);
        };
        setTimeout(callback, duration);
        return this;
    }
    ;
    $(function() {
        $.support.transition = transitionEnd();
        if (!$.support.transition)
            return;
        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function(e) {
                if ($(e.target).is(this))
                    return e.handleObj.handler.apply(this, arguments);
            }
        };
    });
}(jQuery);
;(function($, Drupal, window) {
    "use strict";
    $(function() {
        if (document.body.clientWidth >= 768) {
            if ($('.block-main-background').is(':empty'))
                $(".block-main-background").html('<video playsinline autoplay="autoplay" loop="" class="fillWidth" preload="auto" muted>' + '<source src="/themes/custom/bootstrap_dc/video/code/MP4/code.mp4" type="video/mp4">' + 'Your browser does not support the video tag. I suggest you upgrade your browser.' + '</video>');
            $('video').attr('autoplay', true).attr('preload', 'auto');
        }
        $(window).resize(function() {
            if (document.body.clientWidth >= 768)
                $('video').attr('autoplay', true).attr('preload', 'auto');
        });
    });
    if ($(".navbar-toggle").css("display") !== 'none')
        $("li.dropdown > a").click(function(e) {
            $(this).next(".dropdown-menu-wrapper").toggleClass("show");
            return false;
        });
    $('a[href*="#"].anchor:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
    $(document).ready(function() {
        if (document.body.clientWidth >= 768)
            $('.menu.navbar-nav .dropdown-toggle').on('click', function() {
                var link = $(this).attr('href');
                if (link != '')
                    return location.href = this.href;
            });
        $('article.keys-1').on('click', function() {
            var link = $(this).attr('about');
            return location.href = link;
        });
        $('article.keys-2').on('click', function() {
            var link = $(this).attr('about');
            return location.href = link;
        });
        if ($("div").is('.page-node-type-blog .field--name-field-blog-img'))
            $('.page-node-type-blog .page-header-big').css('background-image', 'url(' + $('.page-node-type-blog .field--name-field-blog-img').html() + ')').addClass('with-img');
        $('.flowing-scroll').on('click', function() {
            console.log('.flowing-scroll');
            var el = $(this);
            var dest = el.attr('href');
            if (dest !== undefined && dest !== '')
                $('html').animate({
                    scrollTop: $(dest).offset().top
                }, 500);
            return false;
        });
    });
    $(document).ready(function() {
        function faqAccordion(e) {
            e.preventDefault();
            var parent = $(this).parent().parent().parent('.panel-faq .panel');
            var parentOpen = $('.panel-faq .panel.panel_open');
            var that = this;
            $(this).off('click', faqAccordion);
            if ($(this).attr('aria-expanded') === 'false') {
                parent.removeClass('panel_close');
                parent.addClass('panel_open');
            } else {
                parent.removeClass('panel_open');
                parent.addClass('panel_close');
            }
            parentOpen.find('.panel-faq .panel .panel-collapse').collapse('hide');
            parentOpen.removeClass('panel_open');
            parentOpen.addClass('panel_close');
            setTimeout(function() {
                $(that).on('click', faqAccordion);
            }, 400);
        }
        $('.panel-faq .panel .panel-btn').on('click', faqAccordion);
        if ($('*').is('.react-logo.custom'))
            animateReactLogo();
        function animateReactLogo() {
            var atom1 = Snap.select('.react-logo.custom .react-logo-atom-1');
            var orbit1 = Snap.select('.react-logo.custom .react-logo-orbit-1');
            var atom2 = Snap.select('.react-logo.custom .react-logo-atom-2');
            var orbit2 = Snap.select('.react-logo.custom .react-logo-orbit-2');
            var atom3 = Snap.select('.react-logo.custom .react-logo-atom-3');
            var orbit3 = Snap.select('.react-logo.custom .react-logo-orbit-3');
            var animationLink1;
            var animationLink2;
            var animationLink3;
            animationStart();
            function animationStart() {
                var pathLength = orbit1.getTotalLength();
                var duration = 18000;
                animationLink1 = Snap.animate(300, 10 * pathLength + 300, function(value) {
                    var movePoint = Snap.path.getPointAtLength(orbit1, value % pathLength);
                    atom1.transform(`t${movePoint.x},${movePoint.y},s1`);
                }, duration, mina.linear);
                pathLength = orbit2.getTotalLength();
                animationLink2 = Snap.animate(120, 10 * pathLength + 120, function(value) {
                    var movePoint = Snap.path.getPointAtLength(orbit2, value % pathLength);
                    atom2.transform(`t${movePoint.x},${movePoint.y},s1`);
                }, duration, mina.linear);
                pathLength = orbit3.getTotalLength();
                animationLink3 = Snap.animate(50, 10 * pathLength + 50, function(value) {
                    var movePoint = Snap.path.getPointAtLength(orbit3, value % pathLength);
                    atom3.transform(`t${movePoint.x},${movePoint.y},s1`);
                }, duration, mina.linear, animationStart);
            }
        }
    });
    Drupal.behaviors.testimonials = {
        attach: function(context, settings) {
            $('.view-testimonials .slick').on('init reInit afterChange', function(event, slick, currentSlide, nextSlide) {
                var i = (currentSlide ? currentSlide : 0) + 1;
                var i = i > 10 ? i : '0' + i;
                var count = slick.slideCount > 10 ? slick.slideCount : '0' + slick.slideCount;
                $(this).find('.slick-slide-num').html('<span class="slick-slide-num-current">' + i + '</span> / ' + count);
            });
        }
    };
}
)(jQuery, Drupal, window);
;(function($, Drupal, window) {
    Drupal.behaviors.goal = {
        attach: function(context, settings) {
            var idYm = drupalSettings.path.currentLanguage == 'en' ? 56301031 : 48330362;
            $('.page-node-1 #drupal-modal .modal-footer .form-submit').ready(function() {
                $('.page-node-1 #drupal-modal .modal-footer .form-submit').once().click(function() {
                    var text = $('#drupal-modal--body .field--name-message textarea').val();
                    var email = $('#drupal-modal--body .form-email').val();
                    var checkbox = $('#drupal-modal--body .form-type-checkbox .form-checkbox').prop('checked');
                    var captcha = $('#drupal-modal--body .captcha .form-text').val();
                    if (text != '' && email != '' && captcha != '' && checkbox) {
                        if (drupalSettings.path.currentLanguage == 'en')
                            ga('send', 'event', 'form', 'order');
                        if (typeof ym !== 'function')
                            return;
                        ym(idYm, 'reachGoal', 'support');
                    }
                });
            });
            $('#block-contactpopupblock-support .contact-form, #block-contact-popupblock-2 .contact-form').once().click(function() {
                ym(idYm, 'reachGoal', 'f_support');
            });
            $('.contact-message-order-support-form .form-submit').once().click(function() {
                var checkBox = $('.contact-message-order-support-form .form-item-fz152-agreement input');
                var textBox = $('.contact-message-order-support-form  .field--name-message textarea');
                var mailBox = $('.contact-message-order-support-form  .form-item-mail input');
                if (textBox.val() != '' && checkBox.prop('checked') === true && mailBox.val() != '') {
                    if (drupalSettings.path.currentLanguage == 'en')
                        ga('send', 'event', 'form', 'order');
                    if (typeof ym !== 'function')
                        return;
                    ym(idYm, 'reachGoal', 'f_support_success');
                }
            });
            $('.goal__tel').once().click(function() {
                if (typeof ym !== 'function')
                    return;
                ym(idYm, 'reachGoal', 'tel');
            });
            $('#block-contactpopupblock-2 .contact-form').once().click(function() {
                if (typeof ym !== 'function')
                    return;
                ym(idYm, 'reachGoal', 'f_create');
            });
            $('.contact-message-razrabotka-react-form .form-submit').once().click(function() {
                var mailBox = $('.contact-message-razrabotka-react-form .form-item-mail input');
                var textBox = $('.contact-message-razrabotka-react-form .field--name-message textarea');
                if (textBox.val() != '' && mailBox.val() != '') {
                    if (typeof ym !== 'function')
                        return;
                    ym(idYm, 'reachGoal', 'f_create_success');
                }
            });
            $('.page-node-2 .field--name-body #bx24_form_button .b24-web-form-popup-btn').once().click(function() {
                if (typeof ym !== 'function')
                    return;
                ym(idYm, 'reachGoal', 'f_admin');
            });
            $('#block-contactpopupblock-drupal-seo .contact-form').once().click(function() {
                if (typeof ym !== 'function')
                    return;
                ym(idYm, 'reachGoal', 'f_seo');
            });
            $('.contact-message-order-drupal-seo-form .form-submit').once().click(function() {
                var checkBox = $('.contact-message-order-drupal-seo-form .form-item-fz152-agreement input');
                var textBox = $('.contact-message-order-drupal-seo-form  .field--name-message textarea');
                var mailBox = $('.contact-message-order-drupal-seo-form  .form-item-mail input');
                if (textBox.val() != '' && checkBox.prop('checked') === true && mailBox.val() != '') {
                    if (typeof ym !== 'function')
                        return;
                    ym(idYm, 'reachGoal', 'f_seo_success');
                }
            });
            $('#block-auditbezopasnostidrupalmain .contact-form, #block-drupal-security-audit .contact-form, #block-contactpopupblock-drupal-security-audit .contact-form').once().click(function() {
                if (typeof ym !== 'function')
                    return;
                ym(idYm, 'reachGoal', 'f_audit_admin');
            });
            $('.contact-message-order-drupal-security-audit-form .form-submit').once().click(function() {
                var checkBox = $('.contact-message-order-drupal-security-audit-form .form-item-fz152-agreement input');
                var textBox = $('.contact-message-order-drupal-security-audit-form  .field--name-message textarea');
                var mailBox = $('.contact-message-order-drupal-security-audit-form  .form-item-mail input');
                if (textBox.val() != '' && checkBox.prop('checked') === true && mailBox.val() != '') {
                    if (typeof ym !== 'function')
                        return;
                    ym(idYm, 'reachGoal', 'f_audit_admin_success');
                }
            });
        }
    };
}
)(jQuery, Drupal, window);
;(function($, Drupal, debounce) {
    $.fn.drupalGetSummary = function() {
        const callback = this.data('summaryCallback');
        if (!this[0] || !callback)
            return '';
        const result = callback(this[0]);
        return result ? result.trim() : '';
    }
    ;
    $.fn.drupalSetSummary = function(callback) {
        const self = this;
        if (typeof callback !== 'function') {
            const val = callback;
            callback = function() {
                return val;
            }
            ;
        }
        return (this.data('summaryCallback', callback).off('formUpdated.summary').on('formUpdated.summary', () => {
            self.trigger('summaryUpdated');
        }
        ).trigger('summaryUpdated'));
    }
    ;
    Drupal.behaviors.formSingleSubmit = {
        attach() {
            function onFormSubmit(e) {
                const $form = $(e.currentTarget);
                const formValues = $form.serialize();
                const previousValues = $form.attr('data-drupal-form-submit-last');
                if (previousValues === formValues)
                    e.preventDefault();
                else
                    $form.attr('data-drupal-form-submit-last', formValues);
            }
            $(once('form-single-submit', 'body')).on('submit.singleSubmit', 'form:not([method~="GET"])', onFormSubmit);
        }
    };
    function triggerFormUpdated(element) {
        $(element).trigger('formUpdated');
    }
    function fieldsList(form) {
        return [].map.call(form.querySelectorAll('[name][id]'), (el) => el.id);
    }
    Drupal.behaviors.formUpdated = {
        attach(context) {
            const $context = $(context);
            const contextIsForm = $context.is('form');
            const $forms = $(once('form-updated', contextIsForm ? $context : $context.find('form')));
            let formFields;
            if ($forms.length)
                $.makeArray($forms).forEach( (form) => {
                    const events = 'change.formUpdated input.formUpdated ';
                    const eventHandler = debounce( (event) => {
                        triggerFormUpdated(event.target);
                    }
                    , 300);
                    formFields = fieldsList(form).join(',');
                    form.setAttribute('data-drupal-form-fields', formFields);
                    $(form).on(events, eventHandler);
                }
                );
            if (contextIsForm) {
                formFields = fieldsList(context).join(',');
                const currentFields = $(context).attr('data-drupal-form-fields');
                if (formFields !== currentFields)
                    triggerFormUpdated(context);
            }
        },
        detach(context, settings, trigger) {
            const $context = $(context);
            const contextIsForm = $context.is('form');
            if (trigger === 'unload')
                once.remove('form-updated', contextIsForm ? $context : $context.find('form')).forEach( (form) => {
                    form.removeAttribute('data-drupal-form-fields');
                    $(form).off('.formUpdated');
                }
                );
        }
    };
    Drupal.behaviors.fillUserInfoFromBrowser = {
        attach(context, settings) {
            const userInfo = ['name', 'mail', 'homepage'];
            const $forms = $(once('user-info-from-browser', '[data-user-info-from-browser]'));
            if ($forms.length)
                userInfo.forEach( (info) => {
                    const $element = $forms.find(`[name=${info}]`);
                    const browserData = localStorage.getItem(`Drupal.visitor.${info}`);
                    if (!$element.length)
                        return;
                    const emptyValue = $element[0].value === '';
                    const defaultValue = $element.attr('data-drupal-default-value') === $element[0].value;
                    if (browserData && (emptyValue || defaultValue))
                        $element.each(function(index, item) {
                            item.value = browserData;
                        });
                }
                );
            $forms.on('submit', () => {
                userInfo.forEach( (info) => {
                    const $element = $forms.find(`[name=${info}]`);
                    if ($element.length)
                        localStorage.setItem(`Drupal.visitor.${info}`, $element[0].value);
                }
                );
            }
            );
        }
    };
    const handleFragmentLinkClickOrHashChange = (e) => {
        let url;
        if (e.type === 'click')
            url = e.currentTarget.location ? e.currentTarget.location : e.currentTarget;
        else
            url = window.location;
        const hash = url.hash.substr(1);
        if (hash) {
            const $target = $(`#${hash}`);
            $('body').trigger('formFragmentLinkClickOrHashChange', [$target]);
            setTimeout( () => $target.trigger('focus'), 300);
        }
    }
    ;
    const debouncedHandleFragmentLinkClickOrHashChange = debounce(handleFragmentLinkClickOrHashChange, 300, true);
    $(window).on('hashchange.form-fragment', debouncedHandleFragmentLinkClickOrHashChange);
    $(document).on('click.form-fragment', 'a[href*="#"]', debouncedHandleFragmentLinkClickOrHashChange);
}
)(jQuery, Drupal, Drupal.debounce);
;(function($, window, Drupal, drupalSettings, once) {
    Drupal.behaviors.bootstrapForm = {
        attach: function(context) {
            if (drupalSettings.bootstrap && drupalSettings.bootstrap.forms_has_error_value_toggle) {
                var $context = $(context);
                $(once('error', '.form-item.has-error:not(.form-type-password.has-feedback)', context)).each(function() {
                    var $formItem = $(this);
                    var $input = $formItem.find(':input');
                    $input.on('keyup focus blur', function() {
                        if (this.defaultValue !== void 0) {
                            $formItem[this.defaultValue !== this.value ? 'removeClass' : 'addClass']('has-error');
                            $input[this.defaultValue !== this.value ? 'removeClass' : 'addClass']('error');
                        }
                    });
                });
            }
        }
    };
}
)(jQuery, this, Drupal, drupalSettings, once);
(Drupal, drupalSettings);
;( ($, Drupal) => {
    function updateTokenElement(element) {
        let timer;
        if (typeof grecaptcha === 'undefined')
            timer = setInterval( () => {
                if (typeof grecaptcha !== 'undefined' || !element) {
                    clearInterval(timer);
                    if (element)
                        doUpdateTokenElement(element);
                }
            }
            , 500);
        else
            doUpdateTokenElement(element);
    }
    function doUpdateTokenElement(element) {
        let $element = $(element);
        grecaptcha.ready( () => {
            if (!element)
                return;
            grecaptcha.execute($element.data('recaptchaV3SiteKey'), {
                action: $element.data('recaptchaV3Action')
            }).then( (token) => {
                $element.val(token);
                $element.trigger('change');
            }
            );
        }
        );
    }
    Drupal.behaviors.reCaptchaV3 = {
        attach: (context) => {
            once('recaptcha-v3-token', '.recaptcha-v3-token', context).forEach( (element) => {
                let interval;
                updateTokenElement(element);
                interval = setInterval( () => {
                    if (!element)
                        clearInterval(interval);
                    else
                        updateTokenElement(element);
                }
                , 90000);
            }
            );
        }
    };
}
)(jQuery, Drupal);
;/* @license GNU-GPL-2.0-or-later https://raw.githubusercontent.com/jquery-form/form/master/LICENSE */
/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/core/assets/vendor/jquery-form/jquery.form.min.js. */
/*!
 * jQuery Form Plugin
 * version: 4.3.0
 * Requires jQuery v1.7.2 or later
 * Project repository: https://github.com/jquery-form/form

 * Copyright 2017 Kevin Morris
 * Copyright 2006 M. Alsup

 * Dual licensed under the LGPL-2.1+ or MIT licenses
 * https://github.com/jquery-form/form#license

 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 */
!function(r) {
    "function" == typeof define && define.amd ? define(["jquery"], r) : "object" == typeof module && module.exports ? module.exports = function(e, t) {
        return void 0 === t && (t = "undefined" != typeof window ? require("jquery") : require("jquery")(e)),
        r(t),
        t
    }
    : r(jQuery)
}(function(q) {
    "use strict";
    var m = /\r?\n/g
      , S = {};
    S.fileapi = void 0 !== q('<input type="file">').get(0).files,
    S.formdata = void 0 !== window.FormData;
    var _ = !!q.fn.prop;
    function o(e) {
        var t = e.data;
        e.isDefaultPrevented() || (e.preventDefault(),
        q(e.target).closest("form").ajaxSubmit(t))
    }
    function i(e) {
        var t = e.target
          , r = q(t);
        if (!r.is("[type=submit],[type=image]")) {
            var a = r.closest("[type=submit]");
            if (0 === a.length)
                return;
            t = a[0]
        }
        var n, o = t.form;
        "image" === (o.clk = t).type && (void 0 !== e.offsetX ? (o.clk_x = e.offsetX,
        o.clk_y = e.offsetY) : "function" == typeof q.fn.offset ? (n = r.offset(),
        o.clk_x = e.pageX - n.left,
        o.clk_y = e.pageY - n.top) : (o.clk_x = e.pageX - t.offsetLeft,
        o.clk_y = e.pageY - t.offsetTop)),
        setTimeout(function() {
            o.clk = o.clk_x = o.clk_y = null
        }, 100)
    }
    function N() {
        var e;
        q.fn.ajaxSubmit.debug && (e = "[jquery.form] " + Array.prototype.join.call(arguments, ""),
        window.console && window.console.log ? window.console.log(e) : window.opera && window.opera.postError && window.opera.postError(e))
    }
    q.fn.attr2 = function() {
        if (!_)
            return this.attr.apply(this, arguments);
        var e = this.prop.apply(this, arguments);
        return e && e.jquery || "string" == typeof e ? e : this.attr.apply(this, arguments)
    }
    ,
    q.fn.ajaxSubmit = function(M, e, t, r) {
        if (!this.length)
            return N("ajaxSubmit: skipping submit process - no element selected"),
            this;
        var O, a, n, o, X = this;
        "function" == typeof M ? M = {
            success: M
        } : "string" == typeof M || !1 === M && 0 < arguments.length ? (M = {
            url: M,
            data: e,
            dataType: t
        },
        "function" == typeof r && (M.success = r)) : void 0 === M && (M = {}),
        O = M.method || M.type || this.attr2("method"),
        n = (n = (n = "string" == typeof (a = M.url || this.attr2("action")) ? q.trim(a) : "") || window.location.href || "") && (n.match(/^([^#]+)/) || [])[1],
        o = /(MSIE|Trident)/.test(navigator.userAgent || "") && /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank",
        M = q.extend(!0, {
            url: n,
            success: q.ajaxSettings.success,
            type: O || q.ajaxSettings.type,
            iframeSrc: o
        }, M);
        var i = {};
        if (this.trigger("form-pre-serialize", [this, M, i]),
        i.veto)
            return N("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),
            this;
        if (M.beforeSerialize && !1 === M.beforeSerialize(this, M))
            return N("ajaxSubmit: submit aborted via beforeSerialize callback"),
            this;
        var s = M.traditional;
        void 0 === s && (s = q.ajaxSettings.traditional);
        var u, c, C = [], l = this.formToArray(M.semantic, C, M.filtering);
        if (M.data && (c = q.isFunction(M.data) ? M.data(l) : M.data,
        M.extraData = c,
        u = q.param(c, s)),
        M.beforeSubmit && !1 === M.beforeSubmit(l, this, M))
            return N("ajaxSubmit: submit aborted via beforeSubmit callback"),
            this;
        if (this.trigger("form-submit-validate", [l, this, M, i]),
        i.veto)
            return N("ajaxSubmit: submit vetoed via form-submit-validate trigger"),
            this;
        var f = q.param(l, s);
        u && (f = f ? f + "&" + u : u),
        "GET" === M.type.toUpperCase() ? (M.url += (0 <= M.url.indexOf("?") ? "&" : "?") + f,
        M.data = null) : M.data = f;
        var d, m, p, h = [];
        M.resetForm && h.push(function() {
            X.resetForm()
        }),
        M.clearForm && h.push(function() {
            X.clearForm(M.includeHidden)
        }),
        !M.dataType && M.target ? (d = M.success || function() {}
        ,
        h.push(function(e, t, r) {
            var a = arguments
              , n = M.replaceTarget ? "replaceWith" : "html";
            q(M.target)[n](e).each(function() {
                d.apply(this, a)
            })
        })) : M.success && (q.isArray(M.success) ? q.merge(h, M.success) : h.push(M.success)),
        M.success = function(e, t, r) {
            for (var a = M.context || this, n = 0, o = h.length; n < o; n++)
                h[n].apply(a, [e, t, r || X, X])
        }
        ,
        M.error && (m = M.error,
        M.error = function(e, t, r) {
            var a = M.context || this;
            m.apply(a, [e, t, r, X])
        }
        ),
        M.complete && (p = M.complete,
        M.complete = function(e, t) {
            var r = M.context || this;
            p.apply(r, [e, t, X])
        }
        );
        var v = 0 < q("input[type=file]:enabled", this).filter(function() {
            return "" !== q(this).val()
        }).length
          , g = "multipart/form-data"
          , x = X.attr("enctype") === g || X.attr("encoding") === g
          , y = S.fileapi && S.formdata;
        N("fileAPI :" + y);
        var b, T = (v || x) && !y;
        !1 !== M.iframe && (M.iframe || T) ? M.closeKeepAlive ? q.get(M.closeKeepAlive, function() {
            b = w(l)
        }) : b = w(l) : b = (v || x) && y ? function(e) {
            for (var r = new FormData, t = 0; t < e.length; t++)
                r.append(e[t].name, e[t].value);
            if (M.extraData) {
                var a = function(e) {
                    var t, r, a = q.param(e, M.traditional).split("&"), n = a.length, o = [];
                    for (t = 0; t < n; t++)
                        a[t] = a[t].replace(/\+/g, " "),
                        r = a[t].split("="),
                        o.push([decodeURIComponent(r[0]), decodeURIComponent(r[1])]);
                    return o
                }(M.extraData);
                for (t = 0; t < a.length; t++)
                    a[t] && r.append(a[t][0], a[t][1])
            }
            M.data = null;
            var n = q.extend(!0, {}, q.ajaxSettings, M, {
                contentType: !1,
                processData: !1,
                cache: !1,
                type: O || "POST"
            });
            M.uploadProgress && (n.xhr = function() {
                var e = q.ajaxSettings.xhr();
                return e.upload && e.upload.addEventListener("progress", function(e) {
                    var t = 0
                      , r = e.loaded || e.position
                      , a = e.total;
                    e.lengthComputable && (t = Math.ceil(r / a * 100)),
                    M.uploadProgress(e, r, a, t)
                }, !1),
                e
            }
            );
            n.data = null;
            var o = n.beforeSend;
            return n.beforeSend = function(e, t) {
                M.formData ? t.data = M.formData : t.data = r,
                o && o.call(this, e, t)
            }
            ,
            q.ajax(n)
        }(l) : q.ajax(M),
        X.removeData("jqxhr").data("jqxhr", b);
        for (var j = 0; j < C.length; j++)
            C[j] = null;
        return this.trigger("form-submit-notify", [this, M]),
        this;
        function w(e) {
            var t, r, l, f, o, d, m, p, a, n, h, v, i = X[0], g = q.Deferred();
            if (g.abort = function(e) {
                p.abort(e)
            }
            ,
            e)
                for (r = 0; r < C.length; r++)
                    t = q(C[r]),
                    _ ? t.prop("disabled", !1) : t.removeAttr("disabled");
            (l = q.extend(!0, {}, q.ajaxSettings, M)).context = l.context || l,
            o = "jqFormIO" + (new Date).getTime();
            var s = i.ownerDocument
              , u = X.closest("body");
            if (l.iframeTarget ? (n = (d = q(l.iframeTarget, s)).attr2("name")) ? o = n : d.attr2("name", o) : (d = q('<iframe name="' + o + '" src="' + l.iframeSrc + '" />', s)).css({
                position: "absolute",
                top: "-1000px",
                left: "-1000px"
            }),
            m = d[0],
            p = {
                aborted: 0,
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: "n/a",
                getAllResponseHeaders: function() {},
                getResponseHeader: function() {},
                setRequestHeader: function() {},
                abort: function(e) {
                    var t = "timeout" === e ? "timeout" : "aborted";
                    N("aborting upload... " + t),
                    this.aborted = 1;
                    try {
                        m.contentWindow.document.execCommand && m.contentWindow.document.execCommand("Stop")
                    } catch (e) {}
                    d.attr("src", l.iframeSrc),
                    p.error = t,
                    l.error && l.error.call(l.context, p, t, e),
                    f && q.event.trigger("ajaxError", [p, l, t]),
                    l.complete && l.complete.call(l.context, p, t)
                }
            },
            (f = l.global) && 0 == q.active++ && q.event.trigger("ajaxStart"),
            f && q.event.trigger("ajaxSend", [p, l]),
            l.beforeSend && !1 === l.beforeSend.call(l.context, p, l))
                return l.global && q.active--,
                g.reject(),
                g;
            if (p.aborted)
                return g.reject(),
                g;
            (a = i.clk) && (n = a.name) && !a.disabled && (l.extraData = l.extraData || {},
            l.extraData[n] = a.value,
            "image" === a.type && (l.extraData[n + ".x"] = i.clk_x,
            l.extraData[n + ".y"] = i.clk_y));
            var x = 1
              , y = 2;
            function b(t) {
                var r = null;
                try {
                    t.contentWindow && (r = t.contentWindow.document)
                } catch (e) {
                    N("cannot get iframe.contentWindow document: " + e)
                }
                if (r)
                    return r;
                try {
                    r = t.contentDocument ? t.contentDocument : t.document
                } catch (e) {
                    N("cannot get iframe.contentDocument: " + e),
                    r = t.document
                }
                return r
            }
            var c = q("meta[name=csrf-token]").attr("content")
              , T = q("meta[name=csrf-param]").attr("content");
            function j() {
                var e = X.attr2("target")
                  , t = X.attr2("action")
                  , r = X.attr("enctype") || X.attr("encoding") || "multipart/form-data";
                i.setAttribute("target", o),
                O && !/post/i.test(O) || i.setAttribute("method", "POST"),
                t !== l.url && i.setAttribute("action", l.url),
                l.skipEncodingOverride || O && !/post/i.test(O) || X.attr({
                    encoding: "multipart/form-data",
                    enctype: "multipart/form-data"
                }),
                l.timeout && (v = setTimeout(function() {
                    h = !0,
                    A(x)
                }, l.timeout));
                var a = [];
                try {
                    if (l.extraData)
                        for (var n in l.extraData)
                            l.extraData.hasOwnProperty(n) && (q.isPlainObject(l.extraData[n]) && l.extraData[n].hasOwnProperty("name") && l.extraData[n].hasOwnProperty("value") ? a.push(q('<input type="hidden" name="' + l.extraData[n].name + '">', s).val(l.extraData[n].value).appendTo(i)[0]) : a.push(q('<input type="hidden" name="' + n + '">', s).val(l.extraData[n]).appendTo(i)[0]));
                    l.iframeTarget || d.appendTo(u),
                    m.attachEvent ? m.attachEvent("onload", A) : m.addEventListener("load", A, !1),
                    setTimeout(function e() {
                        try {
                            var t = b(m).readyState;
                            N("state = " + t),
                            t && "uninitialized" === t.toLowerCase() && setTimeout(e, 50)
                        } catch (e) {
                            N("Server abort: ", e, " (", e.name, ")"),
                            A(y),
                            v && clearTimeout(v),
                            v = void 0
                        }
                    }, 15);
                    try {
                        i.submit()
                    } catch (e) {
                        document.createElement("form").submit.apply(i)
                    }
                } finally {
                    i.setAttribute("action", t),
                    i.setAttribute("enctype", r),
                    e ? i.setAttribute("target", e) : X.removeAttr("target"),
                    q(a).remove()
                }
            }
            T && c && (l.extraData = l.extraData || {},
            l.extraData[T] = c),
            l.forceSync ? j() : setTimeout(j, 10);
            var w, S, k, D = 50;
            function A(e) {
                if (!p.aborted && !k) {
                    if ((S = b(m)) || (N("cannot access response document"),
                    e = y),
                    e === x && p)
                        return p.abort("timeout"),
                        void g.reject(p, "timeout");
                    if (e === y && p)
                        return p.abort("server abort"),
                        void g.reject(p, "error", "server abort");
                    if (S && S.location.href !== l.iframeSrc || h) {
                        m.detachEvent ? m.detachEvent("onload", A) : m.removeEventListener("load", A, !1);
                        var t, r = "success";
                        try {
                            if (h)
                                throw "timeout";
                            var a = "xml" === l.dataType || S.XMLDocument || q.isXMLDoc(S);
                            if (N("isXml=" + a),
                            !a && window.opera && (null === S.body || !S.body.innerHTML) && --D)
                                return N("requeing onLoad callback, DOM not available"),
                                void setTimeout(A, 250);
                            var n = S.body ? S.body : S.documentElement;
                            p.responseText = n ? n.innerHTML : null,
                            p.responseXML = S.XMLDocument ? S.XMLDocument : S,
                            a && (l.dataType = "xml"),
                            p.getResponseHeader = function(e) {
                                return {
                                    "content-type": l.dataType
                                }[e.toLowerCase()]
                            }
                            ,
                            n && (p.status = Number(n.getAttribute("status")) || p.status,
                            p.statusText = n.getAttribute("statusText") || p.statusText);
                            var o, i, s, u = (l.dataType || "").toLowerCase(), c = /(json|script|text)/.test(u);
                            c || l.textarea ? (o = S.getElementsByTagName("textarea")[0]) ? (p.responseText = o.value,
                            p.status = Number(o.getAttribute("status")) || p.status,
                            p.statusText = o.getAttribute("statusText") || p.statusText) : c && (i = S.getElementsByTagName("pre")[0],
                            s = S.getElementsByTagName("body")[0],
                            i ? p.responseText = i.textContent ? i.textContent : i.innerText : s && (p.responseText = s.textContent ? s.textContent : s.innerText)) : "xml" === u && !p.responseXML && p.responseText && (p.responseXML = F(p.responseText));
                            try {
                                w = E(p, u, l)
                            } catch (e) {
                                r = "parsererror",
                                p.error = t = e || r
                            }
                        } catch (e) {
                            N("error caught: ", e),
                            r = "error",
                            p.error = t = e || r
                        }
                        p.aborted && (N("upload aborted"),
                        r = null),
                        p.status && (r = 200 <= p.status && p.status < 300 || 304 === p.status ? "success" : "error"),
                        "success" === r ? (l.success && l.success.call(l.context, w, "success", p),
                        g.resolve(p.responseText, "success", p),
                        f && q.event.trigger("ajaxSuccess", [p, l])) : r && (void 0 === t && (t = p.statusText),
                        l.error && l.error.call(l.context, p, r, t),
                        g.reject(p, "error", t),
                        f && q.event.trigger("ajaxError", [p, l, t])),
                        f && q.event.trigger("ajaxComplete", [p, l]),
                        f && !--q.active && q.event.trigger("ajaxStop"),
                        l.complete && l.complete.call(l.context, p, r),
                        k = !0,
                        l.timeout && clearTimeout(v),
                        setTimeout(function() {
                            l.iframeTarget ? d.attr("src", l.iframeSrc) : d.remove(),
                            p.responseXML = null
                        }, 100)
                    }
                }
            }
            var F = q.parseXML || function(e, t) {
                return window.ActiveXObject ? ((t = new ActiveXObject("Microsoft.XMLDOM")).async = "false",
                t.loadXML(e)) : t = (new DOMParser).parseFromString(e, "text/xml"),
                t && t.documentElement && "parsererror" !== t.documentElement.nodeName ? t : null
            }
              , L = q.parseJSON || function(e) {
                return window.eval("(" + e + ")")
            }
              , E = function(e, t, r) {
                var a = e.getResponseHeader("content-type") || ""
                  , n = ("xml" === t || !t) && 0 <= a.indexOf("xml")
                  , o = n ? e.responseXML : e.responseText;
                return n && "parsererror" === o.documentElement.nodeName && q.error && q.error("parsererror"),
                r && r.dataFilter && (o = r.dataFilter(o, t)),
                "string" == typeof o && (("json" === t || !t) && 0 <= a.indexOf("json") ? o = L(o) : ("script" === t || !t) && 0 <= a.indexOf("javascript") && q.globalEval(o)),
                o
            };
            return g
        }
    }
    ,
    q.fn.ajaxForm = function(e, t, r, a) {
        if (("string" == typeof e || !1 === e && 0 < arguments.length) && (e = {
            url: e,
            data: t,
            dataType: r
        },
        "function" == typeof a && (e.success = a)),
        (e = e || {}).delegation = e.delegation && q.isFunction(q.fn.on),
        e.delegation || 0 !== this.length)
            return e.delegation ? (q(document).off("submit.form-plugin", this.selector, o).off("click.form-plugin", this.selector, i).on("submit.form-plugin", this.selector, e, o).on("click.form-plugin", this.selector, e, i),
            this) : (e.beforeFormUnbind && e.beforeFormUnbind(this, e),
            this.ajaxFormUnbind().on("submit.form-plugin", e, o).on("click.form-plugin", e, i));
        var n = {
            s: this.selector,
            c: this.context
        };
        return !q.isReady && n.s ? (N("DOM not ready, queuing ajaxForm"),
        q(function() {
            q(n.s, n.c).ajaxForm(e)
        })) : N("terminating; zero elements found by selector" + (q.isReady ? "" : " (DOM not ready)")),
        this
    }
    ,
    q.fn.ajaxFormUnbind = function() {
        return this.off("submit.form-plugin click.form-plugin")
    }
    ,
    q.fn.formToArray = function(e, t, r) {
        var a = [];
        if (0 === this.length)
            return a;
        var n, o, i, s, u, c, l, f, d, m, p = this[0], h = this.attr("id"), v = (v = e || void 0 === p.elements ? p.getElementsByTagName("*") : p.elements) && q.makeArray(v);
        if (h && (e || /(Edge|Trident)\//.test(navigator.userAgent)) && (n = q(':input[form="' + h + '"]').get()).length && (v = (v || []).concat(n)),
        !v || !v.length)
            return a;
        for (q.isFunction(r) && (v = q.map(v, r)),
        o = 0,
        c = v.length; o < c; o++)
            if ((m = (u = v[o]).name) && !u.disabled)
                if (e && p.clk && "image" === u.type)
                    p.clk === u && (a.push({
                        name: m,
                        value: q(u).val(),
                        type: u.type
                    }),
                    a.push({
                        name: m + ".x",
                        value: p.clk_x
                    }, {
                        name: m + ".y",
                        value: p.clk_y
                    }));
                else if ((s = q.fieldValue(u, !0)) && s.constructor === Array)
                    for (t && t.push(u),
                    i = 0,
                    l = s.length; i < l; i++)
                        a.push({
                            name: m,
                            value: s[i]
                        });
                else if (S.fileapi && "file" === u.type) {
                    t && t.push(u);
                    var g = u.files;
                    if (g.length)
                        for (i = 0; i < g.length; i++)
                            a.push({
                                name: m,
                                value: g[i],
                                type: u.type
                            });
                    else
                        a.push({
                            name: m,
                            value: "",
                            type: u.type
                        })
                } else
                    null != s && (t && t.push(u),
                    a.push({
                        name: m,
                        value: s,
                        type: u.type,
                        required: u.required
                    }));
        return e || !p.clk || (m = (d = (f = q(p.clk))[0]).name) && !d.disabled && "image" === d.type && (a.push({
            name: m,
            value: f.val()
        }),
        a.push({
            name: m + ".x",
            value: p.clk_x
        }, {
            name: m + ".y",
            value: p.clk_y
        })),
        a
    }
    ,
    q.fn.formSerialize = function(e) {
        return q.param(this.formToArray(e))
    }
    ,
    q.fn.fieldSerialize = function(n) {
        var o = [];
        return this.each(function() {
            var e = this.name;
            if (e) {
                var t = q.fieldValue(this, n);
                if (t && t.constructor === Array)
                    for (var r = 0, a = t.length; r < a; r++)
                        o.push({
                            name: e,
                            value: t[r]
                        });
                else
                    null != t && o.push({
                        name: this.name,
                        value: t
                    })
            }
        }),
        q.param(o)
    }
    ,
    q.fn.fieldValue = function(e) {
        for (var t = [], r = 0, a = this.length; r < a; r++) {
            var n = this[r]
              , o = q.fieldValue(n, e);
            null == o || o.constructor === Array && !o.length || (o.constructor === Array ? q.merge(t, o) : t.push(o))
        }
        return t
    }
    ,
    q.fieldValue = function(e, t) {
        var r = e.name
          , a = e.type
          , n = e.tagName.toLowerCase();
        if (void 0 === t && (t = !0),
        t && (!r || e.disabled || "reset" === a || "button" === a || ("checkbox" === a || "radio" === a) && !e.checked || ("submit" === a || "image" === a) && e.form && e.form.clk !== e || "select" === n && -1 === e.selectedIndex))
            return null;
        if ("select" !== n)
            return q(e).val().replace(m, "\r\n");
        var o = e.selectedIndex;
        if (o < 0)
            return null;
        for (var i = [], s = e.options, u = "select-one" === a, c = u ? o + 1 : s.length, l = u ? o : 0; l < c; l++) {
            var f = s[l];
            if (f.selected && !f.disabled) {
                var d = (d = f.value) || (f.attributes && f.attributes.value && !f.attributes.value.specified ? f.text : f.value);
                if (u)
                    return d;
                i.push(d)
            }
        }
        return i
    }
    ,
    q.fn.clearForm = function(e) {
        return this.each(function() {
            q("input,select,textarea", this).clearFields(e)
        })
    }
    ,
    q.fn.clearFields = q.fn.clearInputs = function(r) {
        var a = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function() {
            var e = this.type
              , t = this.tagName.toLowerCase();
            a.test(e) || "textarea" === t ? this.value = "" : "checkbox" === e || "radio" === e ? this.checked = !1 : "select" === t ? this.selectedIndex = -1 : "file" === e ? /MSIE/.test(navigator.userAgent) ? q(this).replaceWith(q(this).clone(!0)) : q(this).val("") : r && (!0 === r && /hidden/.test(e) || "string" == typeof r && q(this).is(r)) && (this.value = "")
        })
    }
    ,
    q.fn.resetForm = function() {
        return this.each(function() {
            var t = q(this)
              , e = this.tagName.toLowerCase();
            switch (e) {
            case "input":
                this.checked = this.defaultChecked;
            case "textarea":
                return this.value = this.defaultValue,
                !0;
            case "option":
            case "optgroup":
                var r = t.parents("select");
                return r.length && r[0].multiple ? "option" === e ? this.selected = this.defaultSelected : t.find("option").resetForm() : r.resetForm(),
                !0;
            case "select":
                return t.find("option").each(function(e) {
                    if (this.selected = this.defaultSelected,
                    this.defaultSelected && !t[0].multiple)
                        return t[0].selectedIndex = e,
                        !1
                }),
                !0;
            case "label":
                var a = q(t.attr("for"))
                  , n = t.find("input,select,textarea");
                return a[0] && n.unshift(a[0]),
                n.resetForm(),
                !0;
            case "form":
                return "function" != typeof this.reset && ("object" != typeof this.reset || this.reset.nodeType) || this.reset(),
                !0;
            default:
                return t.find("form,input,label,select,textarea").resetForm(),
                !0
            }
        })
    }
    ,
    q.fn.enable = function(e) {
        return void 0 === e && (e = !0),
        this.each(function() {
            this.disabled = !e
        })
    }
    ,
    q.fn.selected = function(r) {
        return void 0 === r && (r = !0),
        this.each(function() {
            var e, t = this.type;
            "checkbox" === t || "radio" === t ? this.checked = r : "option" === this.tagName.toLowerCase() && (e = q(this).parent("select"),
            r && e[0] && "select-one" === e[0].type && e.find("option").selected(!1),
            this.selected = r)
        })
    }
    ,
    q.fn.ajaxSubmit.debug = !1
});

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/core/assets/vendor/jquery-form/jquery.form.min.js. */
;/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
/* Source and licensing information for the line(s) below can be found at https://drupal-coder.ru/modules/contrib/slick/js/slick.load.min.js. */
!function(v, m, y, t) {
    "use strict";
    var C = "slick"
      , b = "unslick"
      , w = C + "--initialized"
      , e = ".slick:not(." + w + ")"
      , z = ".slick__slider"
      , _ = ".slick__arrow"
      , P = ".b-lazy[data-src]:not(.b-loaded)"
      , x = ".media__icon--close"
      , $ = "is-playing"
      , A = "is-paused"
      , D = "data-thumb"
      , L = "data-b-thumb"
      , S = m.blazy || {};
    function i(e) {
        var n, i, s = v(e), a = v("> " + z, e).length ? v("> " + z, e) : s, o = v("> " + _, e), t = a.data(C) ? v.extend({}, y.slick, a.data(C)) : v.extend({}, y.slick), l = !("array" !== v.type(t.responsive) || !t.responsive.length) && t.responsive, d = t.appendDots, c = "blazy" === t.lazyLoad && S, r = a.find(".media--player").length, f = a.hasClass(b);
        if (f || (t.appendDots = d === _ ? o : d || v(a)),
        l)
            for (n in l)
                Object.prototype.hasOwnProperty.call(l, n) && l[n].settings !== b && (l[n].settings = v.extend({}, y.slick, k(t), l[n].settings));
        function u(n) {
            a.find(P).length && ((n = a.find(n ? ".slide:not(.slick-cloned) " + P : ".slick-active " + P)).length || (n = a.find(".slick-cloned " + P)),
            n.length && S.init && S.init.load(n))
        }
        function h() {
            r && g(),
            c && u(!1)
        }
        function g() {
            a.removeClass(A);
            var n = a.find("." + $);
            n.length && n.removeClass($).find(x).click()
        }
        function p() {
            a.addClass(A).slick("slickPause")
        }
        function k(l) {
            return f ? {} : {
                slide: l.slide,
                lazyLoad: l.lazyLoad,
                dotsClass: l.dotsClass,
                rtl: l.rtl,
                prevArrow: v(".slick-prev", o),
                nextArrow: v(".slick-next", o),
                appendArrows: o,
                customPaging: function(n, i) {
                    var s, t = n.$slides.eq(i), e = t.find("[" + D + "]"), a = D;
                    e.length || (e = t.find("[" + L + "]"),
                    a = L),
                    e.length && (s = (s = e.find("img").attr("alt")) ? m.checkPlain(s) : "Preview",
                    s = '<img alt="' + m.t(s) + '" src="' + e.attr(a) + '">',
                    s = 0 < l.dotsClass.indexOf("thumbnail") ? '<div class="slick-dots__thumbnail">' + s + "</div>" : "");
                    i = n.defaults.customPaging(n, i);
                    return s ? i.add(s) : i
                }
            }
        }
        a.data(C, t),
        (t = a.data(C)).randomize && !a.hasClass("slick-initiliazed") && a.children().sort(function() {
            return .5 - Math.random()
        }).each(function() {
            a.append(this)
        }),
        f || a.on("init.sl", function(n, i) {
            d === _ && v(i.$dots).insertAfter(i.$prevArrow);
            i = a.find(".slick-cloned.slick-active " + P);
            c && i.length && S.init && S.init.load(i)
        }),
        c ? a.on("beforeChange.sl", function() {
            u(!0)
        }) : (i = v(".media", a)).length && (i.find("[data-src]").length || i.hasClass("b-bg")) && i.closest(".slide__content").addClass("is-loading"),
        a.on("setPosition.sl", function(n, i) {
            var s, t;
            i = (s = i).slideCount <= s.options.slidesToShow,
            t = i || !1 === s.options.arrows,
            a.attr("id") === s.$slider.attr("id") && (s.options.centerPadding && "0" !== s.options.centerPadding || s.$list.css("padding", ""),
            i && (s.$slideTrack.width() <= s.$slider.width() || v(e).hasClass("slick--thumbnail")) && s.$slideTrack.css({
                left: "",
                transform: ""
            }),
            (s = a.find(".b-loaded ~ .b-loader")).length && s.remove(),
            o.length && v.each(["next", "prev"], function(n, i) {
                v(".slick-" + i, o)[t ? "addClass" : "removeClass"]("visually-hidden")
            }))
        }),
        a.slick(k(t)),
        a.parent().on("click.sl", ".slick-down", function(n) {
            n.preventDefault();
            n = v(this);
            v("html, body").stop().animate({
                scrollTop: v(n.data("target")).offset().top - (n.data("offset") || 0)
            }, 800, v.easing && t.easing ? t.easing : "swing")
        }),
        t.mouseWheel && a.on("mousewheel.sl", function(n, i) {
            return n.preventDefault(),
            a.slick(i < 0 ? "slickNext" : "slickPrev")
        }),
        c || a.on("lazyLoaded lazyLoadError", function(n, i, s) {
            var t;
            t = (s = v(t = s)).closest(".slide") || s.closest("." + b),
            s.parentsUntil(t).removeClass(function(n, i) {
                return (i.match(/(\S+)loading/g) || []).join(" ")
            })
        }),
        a.on("afterChange.sl", h),
        r && (a.on("click.sl", x, g),
        a.on("click.sl", ".media__icon--play", p)),
        s.removeClass(function(n, i) {
            return (i.match(/(\S+)loading/g) || []).join(" ")
        }),
        f && a.slick(b),
        s.addClass(w)
    }
    m.behaviors.slick = {
        attach: function(n) {
            t.once(i, C, e, n)
        },
        detach: function(n, i, s) {
            "unload" === s && t.once.removeSafely(C, e, n)
        }
    }
}(jQuery, Drupal, drupalSettings, dBlazy);

/* Source and licensing information for the above line(s) can be found at https://drupal-coder.ru/modules/contrib/slick/js/slick.load.min.js. */
;(function($, Drupal, debounce) {
    const cache = {
        right: 0,
        left: 0,
        bottom: 0,
        top: 0
    };
    const cssVarPrefix = '--drupal-displace-offset';
    const documentStyle = document.documentElement.style;
    const offsetKeys = Object.keys(cache);
    const offsetProps = {};
    offsetKeys.forEach( (edge) => {
        offsetProps[edge] = {
            enumerable: true,
            get() {
                return cache[edge];
            },
            set(value) {
                if (value !== cache[edge])
                    documentStyle.setProperty(`${cssVarPrefix}-${edge}`, `${value}px`);
                cache[edge] = value;
            }
        };
    }
    );
    const offsets = Object.seal(Object.defineProperties({}, offsetProps));
    function getRawOffset(el, edge) {
        const $el = $(el);
        const documentElement = document.documentElement;
        let displacement = 0;
        const horizontal = edge === 'left' || edge === 'right';
        let placement = $el.offset()[horizontal ? 'left' : 'top'];
        placement -= window[`scroll${horizontal ? 'X' : 'Y'}`] || document.documentElement[`scroll${horizontal ? 'Left' : 'Top'}`] || 0;
        switch (edge) {
        case 'top':
            displacement = placement + $el.outerHeight();
            break;
        case 'left':
            displacement = placement + $el.outerWidth();
            break;
        case 'bottom':
            displacement = documentElement.clientHeight - placement;
            break;
        case 'right':
            displacement = documentElement.clientWidth - placement;
            break;
        default:
            displacement = 0;
        }
        return displacement;
    }
    function calculateOffset(edge) {
        let edgeOffset = 0;
        const displacingElements = document.querySelectorAll(`[data-offset-${edge}]`);
        const n = displacingElements.length;
        for (let i = 0; i < n; i++) {
            const el = displacingElements[i];
            if (el.style.display === 'none')
                continue;
            let displacement = parseInt(el.getAttribute(`data-offset-${edge}`), 10);
            if (isNaN(displacement))
                displacement = getRawOffset(el, edge);
            edgeOffset = Math.max(edgeOffset, displacement);
        }
        return edgeOffset;
    }
    function displace(broadcast=true) {
        const newOffsets = {};
        offsetKeys.forEach( (edge) => {
            newOffsets[edge] = calculateOffset(edge);
        }
        );
        offsetKeys.forEach( (edge) => {
            offsets[edge] = newOffsets[edge];
        }
        );
        if (broadcast)
            $(document).trigger('drupalViewportOffsetChange', offsets);
        return offsets;
    }
    Drupal.behaviors.drupalDisplace = {
        attach() {
            if (this.displaceProcessed)
                return;
            this.displaceProcessed = true;
            $(window).on('resize.drupalDisplace', debounce(displace, 200));
        }
    };
    Drupal.displace = displace;
    Object.defineProperty(Drupal.displace, 'offsets', {
        value: offsets,
        writable: false
    });
    Drupal.displace.calculateOffset = calculateOffset;
}
)(jQuery, Drupal, Drupal.debounce);
;( ($, Drupal, {isTabbable}) => {
    $.extend($.expr[':'], {
        tabbable(element) {
            Drupal.deprecationError({
                message: 'The :tabbable selector is deprecated in Drupal 9.2.0 and will be removed in Drupal 11.0.0. Use the core/tabbable library instead. See https://www.drupal.org/node/3183730'
            });
            return isTabbable(element);
        }
    });
}
)(jQuery, Drupal, window.tabbable);
;( ($) => {
    let cachedScrollbarWidth = null;
    const {max, abs} = Math;
    const regexHorizontal = /left|center|right/;
    const regexVertical = /top|center|bottom/;
    const regexOffset = /[+-]\d+(\.[\d]+)?%?/;
    const regexPosition = /^\w+/;
    const regexPercent = /%$/;
    const _position = $.fn.position;
    function getOffsets(offsets, width, height) {
        return [parseFloat(offsets[0]) * (regexPercent.test(offsets[0]) ? width / 100 : 1), parseFloat(offsets[1]) * (regexPercent.test(offsets[1]) ? height / 100 : 1)];
    }
    function parseCss(element, property) {
        return parseInt($.css(element, property), 10) || 0;
    }
    function getDimensions(elem) {
        const raw = elem[0];
        if (raw.nodeType === 9)
            return {
                width: elem.width(),
                height: elem.height(),
                offset: {
                    top: 0,
                    left: 0
                }
            };
        if ($.isWindow(raw))
            return {
                width: elem.width(),
                height: elem.height(),
                offset: {
                    top: elem.scrollTop(),
                    left: elem.scrollLeft()
                }
            };
        if (raw.preventDefault)
            return {
                width: 0,
                height: 0,
                offset: {
                    top: raw.pageY,
                    left: raw.pageX
                }
            };
        return {
            width: elem.outerWidth(),
            height: elem.outerHeight(),
            offset: elem.offset()
        };
    }
    const collisions = {
        fit: {
            left(position, data) {
                const {within} = data;
                const withinOffset = within.isWindow ? within.scrollLeft : within.offset.left;
                const outerWidth = within.width;
                const collisionPosLeft = position.left - data.collisionPosition.marginLeft;
                const overLeft = withinOffset - collisionPosLeft;
                const overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset;
                let newOverRight;
                if (data.collisionWidth > outerWidth)
                    if (overLeft > 0 && overRight <= 0) {
                        newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
                        position.left += overLeft - newOverRight;
                    } else if (overRight > 0 && overLeft <= 0)
                        position.left = withinOffset;
                    else if (overLeft > overRight)
                        position.left = withinOffset + outerWidth - data.collisionWidth;
                    else
                        position.left = withinOffset;
                else if (overLeft > 0)
                    position.left += overLeft;
                else if (overRight > 0)
                    position.left -= overRight;
                else
                    position.left = max(position.left - collisionPosLeft, position.left);
            },
            top(position, data) {
                const {within} = data;
                const withinOffset = within.isWindow ? within.scrollTop : within.offset.top;
                const outerHeight = data.within.height;
                const collisionPosTop = position.top - data.collisionPosition.marginTop;
                const overTop = withinOffset - collisionPosTop;
                const overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset;
                let newOverBottom;
                if (data.collisionHeight > outerHeight)
                    if (overTop > 0 && overBottom <= 0) {
                        newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
                        position.top += overTop - newOverBottom;
                    } else if (overBottom > 0 && overTop <= 0)
                        position.top = withinOffset;
                    else if (overTop > overBottom)
                        position.top = withinOffset + outerHeight - data.collisionHeight;
                    else
                        position.top = withinOffset;
                else if (overTop > 0)
                    position.top += overTop;
                else if (overBottom > 0)
                    position.top -= overBottom;
                else
                    position.top = max(position.top - collisionPosTop, position.top);
            }
        },
        flip: {
            left(position, data) {
                const {within} = data;
                const withinOffset = within.offset.left + within.scrollLeft;
                const outerWidth = within.width;
                const offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left;
                const collisionPosLeft = position.left - data.collisionPosition.marginLeft;
                const overLeft = collisionPosLeft - offsetLeft;
                const overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft;
                const myOffset = data.my[0] === 'left' ? -data.elemWidth : data.my[0] === 'right' ? data.elemWidth : 0;
                const atOffset = data.at[0] === 'left' ? data.targetWidth : data.at[0] === 'right' ? -data.targetWidth : 0;
                const offset = -2 * data.offset[0];
                let newOverRight;
                let newOverLeft;
                if (overLeft < 0) {
                    newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
                    if (newOverRight < 0 || newOverRight < abs(overLeft))
                        position.left += myOffset + atOffset + offset;
                } else {
                    if (overRight > 0) {
                        newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
                        if (newOverLeft > 0 || abs(newOverLeft) < overRight)
                            position.left += myOffset + atOffset + offset;
                    }
                }
            },
            top(position, data) {
                const {within} = data;
                const withinOffset = within.offset.top + within.scrollTop;
                const outerHeight = within.height;
                const offsetTop = within.isWindow ? within.scrollTop : within.offset.top;
                const collisionPosTop = position.top - data.collisionPosition.marginTop;
                const overTop = collisionPosTop - offsetTop;
                const overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop;
                const top = data.my[1] === 'top';
                const myOffset = top ? -data.elemHeight : data.my[1] === 'bottom' ? data.elemHeight : 0;
                const atOffset = data.at[1] === 'top' ? data.targetHeight : data.at[1] === 'bottom' ? -data.targetHeight : 0;
                const offset = -2 * data.offset[1];
                let newOverTop;
                let newOverBottom;
                if (overTop < 0) {
                    newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
                    if (newOverBottom < 0 || newOverBottom < abs(overTop))
                        position.top += myOffset + atOffset + offset;
                } else {
                    if (overBottom > 0) {
                        newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
                        if (newOverTop > 0 || abs(newOverTop) < overBottom)
                            position.top += myOffset + atOffset + offset;
                    }
                }
            }
        },
        flipfit: {
            left(...args) {
                collisions.flip.left.apply(this, args);
                collisions.fit.left.apply(this, args);
            },
            top(...args) {
                collisions.flip.top.apply(this, args);
                collisions.fit.top.apply(this, args);
            }
        }
    };
    $.position = {
        scrollbarWidth() {
            if (cachedScrollbarWidth !== undefined)
                return cachedScrollbarWidth;
            const div = $('<div ' + "style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'>" + "<div style='height:100px;width:auto;'></div></div>");
            const innerDiv = div.children()[0];
            $('body').append(div);
            const w1 = innerDiv.offsetWidth;
            div.css('overflow', 'scroll');
            let w2 = innerDiv.offsetWidth;
            if (w1 === w2)
                w2 = div[0].clientWidth;
            div.remove();
            cachedScrollbarWidth = w1 - w2;
            return cachedScrollbarWidth;
        },
        getScrollInfo(within) {
            const overflowX = within.isWindow || within.isDocument ? '' : within.element.css('overflow-x');
            const overflowY = within.isWindow || within.isDocument ? '' : within.element.css('overflow-y');
            const hasOverflowX = overflowX === 'scroll' || (overflowX === 'auto' && within.width < within.element[0].scrollWidth);
            const hasOverflowY = overflowY === 'scroll' || (overflowY === 'auto' && within.height < within.element[0].scrollHeight);
            return {
                width: hasOverflowY ? $.position.scrollbarWidth() : 0,
                height: hasOverflowX ? $.position.scrollbarWidth() : 0
            };
        },
        getWithinInfo(element) {
            const withinElement = $(element || window);
            const isWindow = $.isWindow(withinElement[0]);
            const isDocument = !!withinElement[0] && withinElement[0].nodeType === 9;
            const hasOffset = !isWindow && !isDocument;
            return {
                element: withinElement,
                isWindow,
                isDocument,
                offset: hasOffset ? $(element).offset() : {
                    left: 0,
                    top: 0
                },
                scrollLeft: withinElement.scrollLeft(),
                scrollTop: withinElement.scrollTop(),
                width: withinElement.outerWidth(),
                height: withinElement.outerHeight()
            };
        }
    };
    $.fn.position = function(options) {
        if (!options || !options.of)
            return _position.apply(this, arguments);
        options = $.extend({}, options);
        const within = $.position.getWithinInfo(options.within);
        const scrollInfo = $.position.getScrollInfo(within);
        const collision = (options.collision || 'flip').split(' ');
        const offsets = {};
        const target = typeof options.of === 'string' ? $(document).find(options.of) : $(options.of);
        const dimensions = getDimensions(target);
        const targetWidth = dimensions.width;
        const targetHeight = dimensions.height;
        const targetOffset = dimensions.offset;
        if (target[0].preventDefault)
            options.at = 'left top';
        const basePosition = $.extend({}, targetOffset);
        $.each(['my', 'at'], function() {
            let pos = (options[this] || '').split(' ');
            if (pos.length === 1)
                pos = regexHorizontal.test(pos[0]) ? pos.concat(['center']) : regexVertical.test(pos[0]) ? ['center'].concat(pos) : ['center', 'center'];
            pos[0] = regexHorizontal.test(pos[0]) ? pos[0] : 'center';
            pos[1] = regexVertical.test(pos[1]) ? pos[1] : 'center';
            const horizontalOffset = regexOffset.exec(pos[0]);
            const verticalOffset = regexOffset.exec(pos[1]);
            offsets[this] = [horizontalOffset ? horizontalOffset[0] : 0, verticalOffset ? verticalOffset[0] : 0];
            options[this] = [regexPosition.exec(pos[0])[0], regexPosition.exec(pos[1])[0]];
        });
        if (collision.length === 1)
            collision[1] = collision[0];
        if (options.at[0] === 'right')
            basePosition.left += targetWidth;
        else {
            if (options.at[0] === 'center')
                basePosition.left += targetWidth / 2;
        }
        if (options.at[1] === 'bottom')
            basePosition.top += targetHeight;
        else {
            if (options.at[1] === 'center')
                basePosition.top += targetHeight / 2;
        }
        const atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
        basePosition.left += atOffset[0];
        basePosition.top += atOffset[1];
        return this.each(function() {
            let using;
            const elem = $(this);
            const elemWidth = elem.outerWidth();
            const elemHeight = elem.outerHeight();
            const marginLeft = parseCss(this, 'marginLeft');
            const marginTop = parseCss(this, 'marginTop');
            const collisionWidth = elemWidth + marginLeft + parseCss(this, 'marginRight') + scrollInfo.width;
            const collisionHeight = elemHeight + marginTop + parseCss(this, 'marginBottom') + scrollInfo.height;
            const position = $.extend({}, basePosition);
            const myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());
            if (options.my[0] === 'right')
                position.left -= elemWidth;
            else {
                if (options.my[0] === 'center')
                    position.left -= elemWidth / 2;
            }
            if (options.my[1] === 'bottom')
                position.top -= elemHeight;
            else {
                if (options.my[1] === 'center')
                    position.top -= elemHeight / 2;
            }
            position.left += myOffset[0];
            position.top += myOffset[1];
            const collisionPosition = {
                marginLeft,
                marginTop
            };
            $.each(['left', 'top'], function(i, dir) {
                if (collisions[collision[i]])
                    collisions[collision[i]][dir](position, {
                        targetWidth,
                        targetHeight,
                        elemWidth,
                        elemHeight,
                        collisionPosition,
                        collisionWidth,
                        collisionHeight,
                        offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
                        my: options.my,
                        at: options.at,
                        within,
                        elem
                    });
            });
            if (options.using)
                using = function(props) {
                    const left = targetOffset.left - position.left;
                    const right = left + targetWidth - elemWidth;
                    const top = targetOffset.top - position.top;
                    const bottom = top + targetHeight - elemHeight;
                    const feedback = {
                        target: {
                            element: target,
                            left: targetOffset.left,
                            top: targetOffset.top,
                            width: targetWidth,
                            height: targetHeight
                        },
                        element: {
                            element: elem,
                            left: position.left,
                            top: position.top,
                            width: elemWidth,
                            height: elemHeight
                        },
                        horizontal: right < 0 ? 'left' : left > 0 ? 'right' : 'center',
                        vertical: bottom < 0 ? 'top' : top > 0 ? 'bottom' : 'middle'
                    };
                    if (targetWidth < elemWidth && abs(left + right) < targetWidth)
                        feedback.horizontal = 'center';
                    if (targetHeight < elemHeight && abs(top + bottom) < targetHeight)
                        feedback.vertical = 'middle';
                    if (max(abs(left), abs(right)) > max(abs(top), abs(bottom)))
                        feedback.important = 'horizontal';
                    else
                        feedback.important = 'vertical';
                    options.using.call(this, props, feedback);
                }
                ;
            elem.offset($.extend(position, {
                using
            }));
        });
    }
    ;
    if (!$.hasOwnProperty('ui'))
        $.ui = {};
    $.ui.position = collisions;
}
)(jQuery);
;(function($, Drupal, drupalSettings) {
    drupalSettings.dialog = {
        autoOpen: true,
        dialogClass: '',
        buttonClass: 'button',
        buttonPrimaryClass: 'button--primary',
        close(event) {
            Drupal.dialog(event.target).close();
            Drupal.detachBehaviors(event.target, null, 'unload');
        }
    };
    Drupal.dialog = function(element, options) {
        let undef;
        const $element = $(element);
        const dialog = {
            open: false,
            returnValue: undef
        };
        function openDialog(settings) {
            settings = $.extend({}, drupalSettings.dialog, options, settings);
            $(window).trigger('dialog:beforecreate', [dialog, $element, settings]);
            $element.dialog(settings);
            dialog.open = true;
            $(window).trigger('dialog:aftercreate', [dialog, $element, settings]);
        }
        function closeDialog(value) {
            $(window).trigger('dialog:beforeclose', [dialog, $element]);
            $element.dialog('close');
            dialog.returnValue = value;
            dialog.open = false;
            $(window).trigger('dialog:afterclose', [dialog, $element]);
        }
        dialog.show = () => {
            openDialog({
                modal: false
            });
        }
        ;
        dialog.showModal = () => {
            openDialog({
                modal: true
            });
        }
        ;
        dialog.close = closeDialog;
        return dialog;
    }
    ;
}
)(jQuery, Drupal, drupalSettings);
;(function($, Drupal, drupalSettings, debounce, displace) {
    drupalSettings.dialog = $.extend({
        autoResize: true,
        maxHeight: '95%'
    }, drupalSettings.dialog);
    function resetPosition(options) {
        const offsets = displace.offsets;
        const left = offsets.left - offsets.right;
        const top = offsets.top - offsets.bottom;
        const leftString = `${(left > 0 ? '+' : '-') + Math.abs(Math.round(left / 2))}px`;
        const topString = `${(top > 0 ? '+' : '-') + Math.abs(Math.round(top / 2))}px`;
        options.position = {
            my: `center${left !== 0 ? leftString : ''} center${top !== 0 ? topString : ''}`,
            of: window
        };
        return options;
    }
    function resetSize(event) {
        const positionOptions = ['width', 'height', 'minWidth', 'minHeight', 'maxHeight', 'maxWidth', 'position'];
        let adjustedOptions = {};
        let windowHeight = $(window).height();
        let option;
        let optionValue;
        let adjustedValue;
        for (let n = 0; n < positionOptions.length; n++) {
            option = positionOptions[n];
            optionValue = event.data.settings[option];
            if (optionValue)
                if (typeof optionValue === 'string' && /%$/.test(optionValue) && /height/i.test(option)) {
                    windowHeight -= displace.offsets.top + displace.offsets.bottom;
                    adjustedValue = parseInt(0.01 * parseInt(optionValue, 10) * windowHeight, 10);
                    if (option === 'height' && event.data.$element.parent().outerHeight() < adjustedValue)
                        adjustedValue = 'auto';
                    adjustedOptions[option] = adjustedValue;
                }
        }
        if (!event.data.settings.modal)
            adjustedOptions = resetPosition(adjustedOptions);
        event.data.$element.dialog('option', adjustedOptions).trigger('dialogContentResize');
    }
    $(window).on({
        'dialog:aftercreate': function(event, dialog, $element, settings) {
            const autoResize = debounce(resetSize, 20);
            const eventData = {
                settings,
                $element
            };
            if (settings.autoResize === true || settings.autoResize === 'true') {
                $element.dialog('option', {
                    resizable: false,
                    draggable: false
                }).dialog('widget').css('position', 'fixed');
                $(window).on('resize.dialogResize scroll.dialogResize', eventData, autoResize).trigger('resize.dialogResize');
                $(document).on('drupalViewportOffsetChange.dialogResize', eventData, autoResize);
            }
        },
        'dialog:beforeclose': function(event, dialog, $element) {
            $(window).off('.dialogResize');
            $(document).off('.dialogResize');
        }
    });
}
)(jQuery, Drupal, drupalSettings, Drupal.debounce, Drupal.displace);
;(function($, {tabbable, isTabbable}) {
    $.widget('ui.dialog', $.ui.dialog, {
        options: {
            buttonClass: 'button',
            buttonPrimaryClass: 'button--primary'
        },
        _createButtons() {
            const opts = this.options;
            let primaryIndex;
            let index;
            const il = opts.buttons.length;
            for (index = 0; index < il; index++)
                if (opts.buttons[index].primary && opts.buttons[index].primary === true) {
                    primaryIndex = index;
                    delete opts.buttons[index].primary;
                    break;
                }
            this._super();
            const $buttons = this.uiButtonSet.children().addClass(opts.buttonClass);
            if (typeof primaryIndex !== 'undefined')
                $buttons.eq(index).addClass(opts.buttonPrimaryClass);
        },
        _focusTabbable() {
            let hasFocus = this._focusedElement ? this._focusedElement.get(0) : null;
            if (!hasFocus)
                hasFocus = this.element.find('[autofocus]').get(0);
            if (!hasFocus) {
                const $elements = [this.element, this.uiDialogButtonPane];
                for (let i = 0; i < $elements.length; i++) {
                    const element = $elements[i].get(0);
                    if (element) {
                        const elementTabbable = tabbable(element);
                        hasFocus = elementTabbable.length ? elementTabbable[0] : null;
                    }
                    if (hasFocus)
                        break;
                }
            }
            if (!hasFocus) {
                const closeBtn = this.uiDialogTitlebarClose.get(0);
                hasFocus = closeBtn && isTabbable(closeBtn) ? closeBtn : null;
            }
            if (!hasFocus)
                hasFocus = this.uiDialog.get(0);
            $(hasFocus).eq(0).trigger('focus');
        }
    });
}
)(jQuery, window.tabbable);
;( ($) => {
    $.widget('ui.dialog', $.ui.dialog, {
        _allowInteraction(event) {
            return event.target.classList.contains('ck') || this._super(event);
        }
    });
}
)(jQuery);
;(function($, Drupal, {focusable}) {
    Drupal.behaviors.dialog = {
        attach(context, settings) {
            const $context = $(context);
            if (!$('#drupal-modal').length)
                $('<div id="drupal-modal" class="ui-front"></div>').hide().appendTo('body');
            const $dialog = $context.closest('.ui-dialog-content');
            if ($dialog.length) {
                if ($dialog.dialog('option', 'drupalAutoButtons'))
                    $dialog.trigger('dialogButtonsChange');
                $dialog.dialog('widget').trigger('focus');
            }
            const originalClose = settings.dialog.close;
            settings.dialog.close = function(event, ...args) {
                originalClose.apply(settings.dialog, [event, ...args]);
                const $element = $(event.target);
                const ajaxContainer = $element.data('uiDialog') ? $element.data('uiDialog').opener.closest('[data-drupal-ajax-container]') : [];
                if (ajaxContainer.length && (document.activeElement === document.body || $(document.activeElement).not(':visible'))) {
                    const focusableChildren = focusable(ajaxContainer[0]);
                    if (focusableChildren.length > 0)
                        setTimeout( () => {
                            focusableChildren[0].focus();
                        }
                        , 0);
                }
                $(event.target).remove();
            }
            ;
        },
        prepareDialogButtons($dialog) {
            const buttons = [];
            const $buttons = $dialog.find('.form-actions input[type=submit], .form-actions a.button');
            $buttons.each(function() {
                const $originalButton = $(this).css({
                    display: 'none'
                });
                buttons.push({
                    text: $originalButton.html() || $originalButton.attr('value'),
                    class: $originalButton.attr('class'),
                    click(e) {
                        if ($originalButton.is('a'))
                            $originalButton[0].click();
                        else {
                            $originalButton.trigger('mousedown').trigger('mouseup').trigger('click');
                            e.preventDefault();
                        }
                    }
                });
            });
            return buttons;
        }
    };
    Drupal.AjaxCommands.prototype.openDialog = function(ajax, response, status) {
        if (!response.selector)
            return false;
        let $dialog = $(response.selector);
        if (!$dialog.length)
            $dialog = $(`<div id="${response.selector.replace(/^#/, '')}" class="ui-front"></div>`).appendTo('body');
        if (!ajax.wrapper)
            ajax.wrapper = $dialog.attr('id');
        response.command = 'insert';
        response.method = 'html';
        ajax.commands.insert(ajax, response, status);
        if (!response.dialogOptions.buttons) {
            response.dialogOptions.drupalAutoButtons = true;
            response.dialogOptions.buttons = Drupal.behaviors.dialog.prepareDialogButtons($dialog);
        }
        $dialog.on('dialogButtonsChange', () => {
            const buttons = Drupal.behaviors.dialog.prepareDialogButtons($dialog);
            $dialog.dialog('option', 'buttons', buttons);
        }
        );
        response.dialogOptions = response.dialogOptions || {};
        const dialog = Drupal.dialog($dialog.get(0), response.dialogOptions);
        if (response.dialogOptions.modal)
            dialog.showModal();
        else
            dialog.show();
        $dialog.parent().find('.ui-dialog-buttonset').addClass('form-actions');
    }
    ;
    Drupal.AjaxCommands.prototype.closeDialog = function(ajax, response, status) {
        const $dialog = $(response.selector);
        if ($dialog.length) {
            Drupal.dialog($dialog.get(0)).close();
            if (!response.persist)
                $dialog.remove();
        }
        $dialog.off('dialogButtonsChange');
    }
    ;
    Drupal.AjaxCommands.prototype.setDialogOption = function(ajax, response, status) {
        const $dialog = $(response.selector);
        if ($dialog.length)
            $dialog.dialog('option', response.optionName, response.optionValue);
    }
    ;
    $(window).on('dialog:aftercreate', (e, dialog, $element, settings) => {
        $element.on('click.dialog', '.dialog-cancel', (e) => {
            dialog.close('cancel');
            e.preventDefault();
            e.stopPropagation();
        }
        );
    }
    );
    $(window).on('dialog:beforeclose', (e, dialog, $element) => {
        $element.off('.dialog');
    }
    );
}
)(jQuery, Drupal, window.tabbable);
;