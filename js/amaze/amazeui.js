/************************************************************************
 * 由于amazeui过于庞大，本项目大多数效果都没用上，所以进行了人工删减
 * http://www.ishuxin.cn   Wangpq  2015-05-09T10:00Z
 ***********************************************************************/
/*! Amaze UI v2.0.0 | by Amaze UI Team | (c) 2014 AllMobilize, Inc. | Licensed under MIT | 2014-12-05T02:12:50 UTC */
(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f
      }
      var l = n[o] = {
        exports: {}
      };
      t[o][0].call(l.exports, function(e) {
        var n = t[o][1][e];
        return s(n ? n : e)
      }, l, l.exports, e, t, n, r)
    }
    return n[o].exports
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s
})({
  2: [
    function(require, module, exports) {
      (function(global) {
        'use strict';
        var $ = (typeof window !== "undefined" ? window.jQuery : typeof global !==
          "undefined" ? global.jQuery : null);
        require('./core');
        require('./amazeui');
        require('./ui.collapse');
        require('./ui.flexslider');
        require('./ui.slider');
        module.exports = $.AMUI;

      }).call(this, typeof global !== "undefined" ? global : typeof self !==
        "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
      "./amazeui": 2,
      "./core": 4,
      "./ui.collapse": 26,
      "./ui.flexslider": 29,
      "./ui.slider": 20,
    }
  ],
  4: [
    function(require, module, exports) {
      (function(global) {
        'use strict';

        /* jshint -W040 */

        var $ = (typeof window !== "undefined" ? window.jQuery : typeof global !==
          "undefined" ? global.jQuery : null);

        if (typeof $ === 'undefined') {
          throw new Error('Amaze UI 2.x requires jQuery :-(\n' +
            '\u7231\u4e0a\u4e00\u5339\u91ce\u9a6c\uff0c\u53ef\u4f60' +
            '\u7684\u5bb6\u91cc\u6ca1\u6709\u8349\u539f\u2026');
        }

        var UI = $.AMUI || {};
        var $win = $(window);
        var doc = window.document;
        var $html = $('html');

        UI.VERSION = '2.0.0';

        UI.support = {};

        UI.support.transition = (function() {
          var transitionEnd = (function() {
            // https://developer.mozilla.org/en-US/docs/Web/Events/transitionend#Browser_compatibility
            var element = doc.body || doc.documentElement;
            var transEndEventNames = {
              WebkitTransition: 'webkitTransitionEnd',
              MozTransition: 'transitionend',
              OTransition: 'oTransitionEnd otransitionend',
              transition: 'transitionend'
            };
            var name;

            for (name in transEndEventNames) {
              if (element.style[name] !== undefined) {
                return transEndEventNames[name];
              }
            }
          })();

          return transitionEnd && {
            end: transitionEnd
          };
        })();

        UI.support.animation = (function() {
          var animationEnd = (function() {
            var element = doc.body || doc.documentElement;
            var animEndEventNames = {
              WebkitAnimation: 'webkitAnimationEnd',
              MozAnimation: 'animationend',
              OAnimation: 'oAnimationEnd oanimationend',
              animation: 'animationend'
            };
            var name;

            for (name in animEndEventNames) {
              if (element.style[name] !== undefined) {
                return animEndEventNames[name];
              }
            }
          })();

          return animationEnd && {
            end: animationEnd
          };
        })();

        UI.support.requestAnimationFrame = window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };

        /* jshint -W069 */
        UI.support.touch = (
          ('ontouchstart' in window &&
            navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
          (window.DocumentTouch && document instanceof window.DocumentTouch) ||
          (window.navigator['msPointerEnabled'] &&
            window.navigator['msMaxTouchPoints'] > 0) || //IE 10
          (window.navigator['pointerEnabled'] &&
            window.navigator['maxTouchPoints'] > 0) || //IE >=11
          false);

        // https://developer.mozilla.org/zh-CN/docs/DOM/MutationObserver
        UI.support.mutationobserver = (window.MutationObserver ||
          window.WebKitMutationObserver || window.MozMutationObserver ||
          null);

        UI.utils = {};

        /**
         * Debounce function
         * @param {function} func  Function to be debounced
         * @param {number} wait Function execution threshold in milliseconds
         * @param {bool} immediate  Whether the function should be called at
         *                          the beginning of the delay instead of the
         *                          end. Default is false.
         * @desc Executes a function when it stops being invoked for n seconds
         * @via  _.debounce() http://underscorejs.org
         */
        UI.utils.debounce = function(func, wait, immediate) {
          var timeout;
          return function() {
            var context = this;
            var args = arguments;
            var later = function() {
              timeout = null;
              if (!immediate) {
                func.apply(context, args);
              }
            };
            var callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) {
              func.apply(context, args);
            }
          };
        };

        UI.utils.isInView = function(element, options) {
          var $element = $(element);
          var visible = !!($element.width() || $element.height()) &&
            $element.css('display') !== 'none';

          if (!visible) {
            return false;
          }

          var windowLeft = $win.scrollLeft();
          var windowTop = $win.scrollTop();
          var offset = $element.offset();
          var left = offset.left;
          var top = offset.top;

          options = $.extend({
            topOffset: 0,
            leftOffset: 0
          }, options);

          return (top + $element.height() >= windowTop &&
            top - options.topOffset <= windowTop + $win.height() &&
            left + $element.width() >= windowLeft &&
            left - options.leftOffset <= windowLeft + $win.width());
        };

        /* jshint -W054 */
        UI.utils.parseOptions = UI.utils.options = function(string) {
          if ($.isPlainObject(string)) {
            return string;
          }

          var start = (string ? string.indexOf('{') : -1);
          var options = {};

          if (start != -1) {
            try {
              options = (new Function('',
                'var json = ' + string.substr(start) +
                '; return JSON.parse(JSON.stringify(json));'))();
            } catch (e) {}
          }

          return options;
        };

        /* jshint +W054 */

        UI.utils.generateGUID = function(namespace) {
          var uid = namespace + '-' || 'am-';

          do {
            uid += Math.random().toString(36).substring(2, 7);
          } while (document.getElementById(uid));

          return uid;
        };

        // http://blog.alexmaccaw.com/css-transitions
        $.fn.emulateTransitionEnd = function(duration) {
          var called = false;
          var $el = this;

          $(this).one(UI.support.transition.end, function() {
            called = true;
          });

          var callback = function() {
            if (!called) {
              $($el).trigger(UI.support.transition.end);
            }
            $el.transitionEndTimmer = undefined;
          };
          this.transitionEndTimmer = setTimeout(callback, duration);
          return this;
        };

        $.fn.redraw = function() {
          $(this).each(function() {
            /* jshint unused:false */
            var redraw = this.offsetHeight;
          });
          return this;
        };

        /* jshint unused:true */

        $.fn.transitionEnd = function(callback) {
          var endEvent = UI.support.transition.end;
          var dom = this;

          function fireCallBack(e) {
            callback.call(this, e);
            endEvent && dom.off(endEvent, fireCallBack);
          }

          if (callback && endEvent) {
            dom.on(endEvent, fireCallBack);
          }

          return this;
        };

        $.fn.removeClassRegEx = function() {
          return this.each(function(regex) {
            var classes = $(this).attr('class');

            if (!classes || !regex) {
              return false;
            }

            var classArray = [];
            classes = classes.split(' ');

            for (var i = 0, len = classes.length; i < len; i++) {
              if (!classes[i].match(regex)) {
                classArray.push(classes[i]);
              }
            }

            $(this).attr('class', classArray.join(' '));
          });
        };

        //
        $.fn.alterClass = function(removals, additions) {
          var self = this;

          if (removals.indexOf('*') === -1) {
            // Use native jQuery methods if there is no wildcard matching
            self.removeClass(removals);
            return !additions ? self : self.addClass(additions);
          }

          var classPattern = new RegExp('\\s' +
            removals.replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join(
              '\\s|\\s') +
            '\\s', 'g');

          self.each(function(i, it) {
            var cn = ' ' + it.className + ' ';
            while (classPattern.test(cn)) {
              cn = cn.replace(classPattern, ' ');
            }
            it.className = $.trim(cn);
          });

          return !additions ? self : self.addClass(additions);
        };

        // handle multiple browsers for requestAnimationFrame()
        // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        // https://github.com/gnarf/jquery-requestAnimationFrame
        UI.utils.rAF = (function() {
          return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            // if all else fails, use setTimeout
            function(callback) {
              return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
            };
        })();

        // handle multiple browsers for cancelAnimationFrame()
        UI.utils.cancelAF = (function() {
          return window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            function(id) {
              window.clearTimeout(id);
            };
        })();

        // via http://davidwalsh.name/detect-scrollbar-width
        UI.utils.measureScrollbar = function() {
          if (document.body.clientWidth >= window.innerWidth) {
            return 0;
          }

          // if ($html.width() >= window.innerWidth) return;
          // var scrollbarWidth = window.innerWidth - $html.width();
          var $measure = $('<div ' +
            'style="width: 100px;height: 100px;overflow: scroll;' +
            'position: absolute;top: -9999px;"></div>');

          $(document.body).append($measure);

          var scrollbarWidth = $measure[0].offsetWidth - $measure[0].clientWidth;

          $measure.remove();

          return scrollbarWidth;
        };

        UI.utils.imageLoader = function($image, callback) {
          function loaded() {
            callback($image[0]);
          }

          function bindLoad() {
            this.one('load', loaded);
            if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
              var src = this.attr('src'),
                param = src.match(/\?/) ? '&' : '?';

              param += 'random=' + (new Date()).getTime();
              this.attr('src', src + param);
            }
          }

          if (!$image.attr('src')) {
            loaded();
            return;
          }

          if ($image[0].complete || $image[0].readyState === 4) {
            loaded();
          } else {
            bindLoad.call($image);
          }
        };

        /**
         * https://github.com/cho45/micro-template.js
         * (c) cho45 http://cho45.github.com/mit-license
         */
        /* jshint -W109 */
        UI.template = function(id, data) {
          var me = UI.template;

          if (!me.cache[id]) {
            me.cache[id] = (function() {
              var name = id;
              var string = /^[\w\-]+$/.test(id) ?
                me.get(id) : (name = 'template(string)', id); // no warnings

              var line = 1;
              var body = ('try { ' + (me.variable ?
                  'var ' + me.variable + ' = this.stash;' :
                  'with (this.stash) { ') +
                "this.ret += '" +
                string.replace(/<%/g, '\x11').replace(/%>/g, '\x13'). // if you want other tag, just edit this line
                replace(/'(?![^\x11\x13]+?\x13)/g, '\\x27').replace(
                  /^\s*|\s*$/g, '').replace(/\n/g, function() {
                  return "';\nthis.line = " + (++line) +
                    "; this.ret += '\\n";
                }).replace(/\x11-(.+?)\x13/g, "' + ($1) + '").replace(
                  /\x11=(.+?)\x13/g, "' + this.escapeHTML($1) + '").replace(
                  /\x11(.+?)\x13/g, "'; $1; this.ret += '") +
                "'; " + (me.variable ? "" : "}") + "return this.ret;" +
                "} catch (e) { throw 'TemplateError: ' + e + ' (on " +
                name +
                "' + ' line ' + this.line + ')'; } " +
                "//@ sourceURL=" + name + "\n" // source map
              ).replace(/this\.ret \+= '';/g, '');
              /* jshint -W054 */
              var func = new Function(body);
              var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '\x22': '&#x22;',
                '\x27': '&#x27;'
              };
              var escapeHTML = function(string) {
                return ('' + string).replace(/[&<>\'\"]/g, function(_) {
                  return map[_];
                });
              };

              return function(stash) {
                return func.call(me.context = {
                  escapeHTML: escapeHTML,
                  line: 1,
                  ret: '',
                  stash: stash
                });
              };
            })();
          }

          return data ? me.cache[id](data) : me.cache[id];
        };
        /* jshint +W109 */
        /* jshint +W054 */

        UI.template.cache = {};

        UI.template.get = function(id) {
          if (id) {
            var element = document.getElementById(id);
            return element && element.innerHTML || '';
          }
        };

        // Attach FastClick on touch devices
        if (UI.support.touch) {
          $html.addClass('am-touch');

          $(function() {
            var FastClick = $.AMUI.FastClick;
            FastClick && FastClick.attach(document.body);
          });
        }

        $(function() {
          var $body = $('body');

          // trigger DOM ready event
          $(document).trigger('domready.amui');

          $html.removeClass('no-js').addClass('js');

          UI.support.animation && $html.addClass('cssanimations');

          // iOS standalone mode
          if (window.navigator.standalone) {
            $html.addClass('am-standalone');
          }

          $('.am-topbar-fixed-top').length &&
            $body.addClass('am-with-topbar-fixed-top');

          $('.am-topbar-fixed-bottom').length &&
            $body.addClass('am-with-topbar-fixed-bottom');

          // Remove responsive classes in .am-layout
          var $layout = $('.am-layout');
          $layout.find('[class*="md-block-grid"]').alterClass(
            'md-block-grid-*');
          $layout.find('[class*="lg-block-grid"]').alterClass(
            'lg-block-grid');

          // widgets not in .am-layout
          $('[data-am-widget]').each(function() {
            var $widget = $(this);
            // console.log($widget.parents('.am-layout').length)
            if ($widget.parents('.am-layout').length === 0) {
              $widget.addClass('am-no-layout');
            }
          });
        });

        $.AMUI = UI;

        module.exports = UI;

      }).call(this, typeof global !== "undefined" ? global : typeof self !==
        "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}
  ],


  20: [
    function(require, module, exports) {
      (function(global) {
        'use strict';

        var $ = (typeof window !== "undefined" ? window.jQuery : typeof global !==
          "undefined" ? global.jQuery : null);
        require('./core');
        require('./ui.flexslider');
        var UI = $.AMUI;

        function sliderInit() {
          var $sliders = $('[data-am-widget="slider"]');
          $sliders.not('.am-slider-manual').each(function(i, item) {
            var options = UI.utils.parseOptions($(item).attr(
              'data-am-slider'));
            $(item).flexslider(options);
          });
        }

        $(document).on('ready', sliderInit);

        module.exports = $.AMUI.slider = {
          VERSION: '3.0.0',
          init: sliderInit
        };

      }).call(this, typeof global !== "undefined" ? global : typeof self !==
        "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
      "./core": 4,
      "./ui.flexslider": 29
    }
  ],



  26: [
    function(require, module, exports) {
      (function(global) {
        'use strict';

        var $ = (typeof window !== "undefined" ? window.jQuery : typeof global !==
          "undefined" ? global.jQuery : null);
        var UI = require('./core');

        /**
         * @via https://github.com/twbs/bootstrap/blob/master/js/collapse.js
         * @copyright (c) 2011-2014 Twitter, Inc
         * @license The MIT License
         */

        var Collapse = function(element, options) {
          this.$element = $(element);
          this.options = $.extend({}, Collapse.DEFAULTS, options);
          this.transitioning = null;

          if (this.options.parent) {
            this.$parent = $(this.options.parent);
          }

          if (this.options.toggle) {
            this.toggle();
          }
        };

        Collapse.DEFAULTS = {
          toggle: true
        };

        Collapse.prototype.open = function() {
          if (this.transitioning || this.$element.hasClass('am-in')) {
            return;
          }

          var startEvent = $.Event('open.collapse.amui');
          this.$element.trigger(startEvent);

          if (startEvent.isDefaultPrevented()) {
            return;
          }

          var actives = this.$parent && this.$parent.find(
            '> .am-panel > .am-in');

          if (actives && actives.length) {
            var hasData = actives.data('amui.collapse');

            if (hasData && hasData.transitioning) {
              return;
            }

            Plugin.call(actives, 'close');

            hasData || actives.data('amui.collapse', null);
          }

          this.$element
            .removeClass('am-collapse')
            .addClass('am-collapsing').height(0);

          this.transitioning = 1;

          var complete = function() {
            this.$element.
            removeClass('am-collapsing').
            addClass('am-collapse am-in').
            height('');
            this.transitioning = 0;
            this.$element.trigger('opened.collapse.amui');
          };

          if (!UI.support.transition) {
            return complete.call(this);
          }

          var scrollHeight = this.$element[0].scrollHeight;

          this.$element
            .one(UI.support.transition.end, $.proxy(complete, this))
            .emulateTransitionEnd(300).
          css({
            height: scrollHeight
          }); // 当折叠的容器有 padding 时，如果用 height() 只能设置内容的宽度
        };

        Collapse.prototype.close = function() {
          if (this.transitioning || !this.$element.hasClass('am-in')) {
            return;
          }

          var startEvent = $.Event('close.collapse.amui');
          this.$element.trigger(startEvent);

          if (startEvent.isDefaultPrevented()) {
            return;
          }

          this.$element.height(this.$element.height()).redraw();

          this.$element.addClass('am-collapsing').
          removeClass('am-collapse am-in');

          this.transitioning = 1;

          var complete = function() {
            this.transitioning = 0;
            this.$element.trigger('closed.collapse.amui').
            removeClass('am-collapsing').
            addClass('am-collapse');
            // css({height: '0'});
          };

          if (!UI.support.transition) {
            return complete.call(this);
          }

          this.$element.height(0)
            .one(UI.support.transition.end, $.proxy(complete, this))
            .emulateTransitionEnd(300);
        };

        Collapse.prototype.toggle = function() {
          this[this.$element.hasClass('am-in') ? 'close' : 'open']();
        };

        // Collapse Plugin
        function Plugin(option) {
          return this.each(function() {
            var $this = $(this);
            var data = $this.data('amui.collapse');
            var options = $.extend({}, Collapse.DEFAULTS,
              UI.utils.options($this.attr('data-am-collapse')),
              typeof option == 'object' && option);

            if (!data && options.toggle && option == 'open') {
              option = !option;
            }
            if (!data) {
              $this.data('amui.collapse', (data = new Collapse(this,
                options)));
            }
            if (typeof option == 'string') {
              data[option]();
            }
          });
        }

        $.fn.collapse = Plugin;

        // Init code
        $(document).on('click.collapse.amui.data-api', '[data-am-collapse]',
          function(e) {
            var href;
            var $this = $(this);
            var options = UI.utils.options($this.attr('data-am-collapse'));
            var target = options.target ||
              e.preventDefault() ||
              (href = $this.attr('href')) &&
              href.replace(/.*(?=#[^\s]+$)/, '');
            var $target = $(target);
            var data = $target.data('amui.collapse');
            var option = data ? 'toggle' : options;
            var parent = options.parent;
            var $parent = parent && $(parent);

            if (!data || !data.transitioning) {
              if ($parent) {
                // '[data-am-collapse*="{parent: \'' + parent + '"]
                $parent.find('[data-am-collapse]').not($this).addClass(
                  'am-collapsed');
              }

              $this[$target.hasClass('am-in') ? 'addClass' :
                'removeClass']('am-collapsed');
            }

            Plugin.call($target, option);
          });

        $.AMUI.collapse = Collapse;

        module.exports = Collapse;

        // TODO: 更好的 target 选择方式
        //       折叠的容器必须没有 border/padding 才能正常处理，否则动画会有一些小问题
        //       寻找更好的未知高度 transition 动画解决方案，max-height 之类的就算了

      }).call(this, typeof global !== "undefined" ? global : typeof self !==
        "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
      "./core": 4
    }
  ],
  29: [
    function(require, module, exports) {
      (function(global) {
        var $ = (typeof window !== "undefined" ? window.jQuery : typeof global !==
          "undefined" ? global.jQuery : null);
        var UI = require('./core');

        // MODIFIED:
        // - LINE 226: add `<i></i>`
        // - namespace
        // - Init code
        // TODO: start after x ms when pause on actions

        /*
         * jQuery FlexSlider v2.2.2
         * Copyright 2012 WooThemes
         * Contributing Author: Tyler Smith
         */

        // FlexSlider: Object Instance
        $.flexslider = function(el, options) {
          var slider = $(el);

          // making variables public
          slider.vars = $.extend({}, $.flexslider.defaults, options);

          var namespace = slider.vars.namespace,
            msGesture = window.navigator && window.navigator.msPointerEnabled &&
            window.MSGesture,
            touch = (("ontouchstart" in window) || msGesture || window.DocumentTouch &&
              document instanceof DocumentTouch) && slider.vars.touch,
            // depricating this idea, as devices are being released with both of these events
            //eventType = (touch) ? "touchend" : "click",
            eventType = "click touchend MSPointerUp keyup",
            watchedEvent = "",
            watchedEventClearTimer,
            vertical = slider.vars.direction === "vertical",
            reverse = slider.vars.reverse,
            carousel = (slider.vars.itemWidth > 0),
            fade = slider.vars.animation === "fade",
            asNav = slider.vars.asNavFor !== "",
            methods = {},
            focused = true;

          // Store a reference to the slider object
          $.data(el, 'flexslider', slider);

          // Private slider methods
          methods = {
            init: function() {
              slider.animating = false;
              // Get current slide and make sure it is a number
              slider.currentSlide = parseInt((slider.vars.startAt ? slider.vars
                .startAt : 0), 10);
              if (isNaN(slider.currentSlide)) {
                slider.currentSlide = 0;
              }
              slider.animatingTo = slider.currentSlide;
              slider.atEnd = (slider.currentSlide === 0 || slider.currentSlide ===
                slider.last);
              slider.containerSelector = slider.vars.selector.substr(0,
                slider.vars.selector.search(' '));
              slider.slides = $(slider.vars.selector, slider);
              slider.container = $(slider.containerSelector, slider);
              slider.count = slider.slides.length;
              // SYNC:
              slider.syncExists = $(slider.vars.sync).length > 0;
              // SLIDE:
              if (slider.vars.animation === "slide") slider.vars.animation =
                "swing";
              slider.prop = (vertical) ? "top" : "marginLeft";
              slider.args = {};
              // SLIDESHOW:
              slider.manualPause = false;
              slider.stopped = false;
              //PAUSE WHEN INVISIBLE
              slider.started = false;
              slider.startTimeout = null;
              // TOUCH/USECSS:
              slider.transitions = !slider.vars.video && !fade && slider.vars
                .useCSS && (function() {
                  var obj = document.createElement('div'),
                    props = ['perspectiveProperty', 'WebkitPerspective',
                      'MozPerspective', 'OPerspective', 'msPerspective'
                    ];
                  for (var i in props) {
                    if (obj.style[props[i]] !== undefined) {
                      slider.pfx = props[i].replace('Perspective', '').toLowerCase();
                      slider.prop = "-" + slider.pfx + "-transform";
                      return true;
                    }
                  }
                  return false;
                }());
              slider.ensureAnimationEnd = '';
              // CONTROLSCONTAINER:
              if (slider.vars.controlsContainer !== "") slider.controlsContainer =
                $(slider.vars.controlsContainer).length > 0 && $(slider.vars
                  .controlsContainer);
              // MANUAL:
              if (slider.vars.manualControls !== "") slider.manualControls =
                $(slider.vars.manualControls).length > 0 && $(slider.vars.manualControls);

              // RANDOMIZE:
              if (slider.vars.randomize) {
                slider.slides.sort(function() {
                  return (Math.round(Math.random()) - 0.5);
                });
                slider.container.empty().append(slider.slides);
              }

              slider.doMath();

              // INIT
              slider.setup("init");

              // CONTROLNAV:
              if (slider.vars.controlNav) methods.controlNav.setup();

              // DIRECTIONNAV:
              if (slider.vars.directionNav) methods.directionNav.setup();

              // KEYBOARD:
              if (slider.vars.keyboard && ($(slider.containerSelector).length ===
                1 || slider.vars.multipleKeyboard)) {
                $(document).bind('keyup', function(event) {
                  var keycode = event.keyCode;
                  if (!slider.animating && (keycode === 39 || keycode ===
                    37)) {
                    var target = (keycode === 39) ? slider.getTarget(
                        'next') :
                      (keycode === 37) ? slider.getTarget('prev') : false;
                    slider.flexAnimate(target, slider.vars.pauseOnAction);
                  }
                });
              }
              // MOUSEWHEEL:
              if (slider.vars.mousewheel) {
                slider.bind('mousewheel', function(event, delta, deltaX,
                  deltaY) {
                  event.preventDefault();
                  var target = (delta < 0) ? slider.getTarget('next') :
                    slider.getTarget('prev');
                  slider.flexAnimate(target, slider.vars.pauseOnAction);
                });
              }

              // PAUSEPLAY
              if (slider.vars.pausePlay) methods.pausePlay.setup();

              //PAUSE WHEN INVISIBLE
              if (slider.vars.slideshow && slider.vars.pauseInvisible)
                methods.pauseInvisible.init();

              // SLIDSESHOW
              if (slider.vars.slideshow) {
                if (slider.vars.pauseOnHover) {
                  slider.hover(function() {
                    if (!slider.manualPlay && !slider.manualPause) slider
                      .pause();
                  }, function() {
                    if (!slider.manualPause && !slider.manualPlay && !
                      slider.stopped) slider.play();
                  });
                }
                // initialize animation
                //If we're visible, or we don't use PageVisibility API
                if (!slider.vars.pauseInvisible || !methods.pauseInvisible.isHidden()) {
                  (slider.vars.initDelay > 0) ? slider.startTimeout =
                    setTimeout(slider.play, slider.vars.initDelay) : slider
                    .play();
                }
              }

              // ASNAV:
              if (asNav) methods.asNav.setup();

              // TOUCH
              if (touch && slider.vars.touch) methods.touch();

              // FADE&&SMOOTHHEIGHT || SLIDE:
              if (!fade || (fade && slider.vars.smoothHeight)) $(window).bind(
                "resize orientationchange focus", methods.resize);

              slider.find("img").attr("draggable", "false");

              // API: start() Callback
              setTimeout(function() {
                slider.vars.start(slider);
              }, 200);
            },
            asNav: {
              setup: function() {
                slider.asNav = true;
                slider.animatingTo = Math.floor(slider.currentSlide /
                  slider.move);
                slider.currentItem = slider.currentSlide;
                slider.slides.removeClass(namespace + "active-slide").eq(
                  slider.currentItem).addClass(namespace + "active-slide");
                if (!msGesture) {
                  slider.slides.on(eventType, function(e) {
                    e.preventDefault();
                    var $slide = $(this),
                      target = $slide.index();
                    var posFromLeft = $slide.offset().left - $(slider).scrollLeft(); // Find position of slide relative to left of slider container
                    if (posFromLeft <= 0 && $slide.hasClass(namespace +
                      'active-slide')) {
                      slider.flexAnimate(slider.getTarget("prev"), true);
                    } else if (!$(slider.vars.asNavFor).data('flexslider')
                      .animating && !$slide.hasClass(namespace +
                        "active-slide")) {
                      slider.direction = (slider.currentItem < target) ?
                        "next" : "prev";
                      slider.flexAnimate(target, slider.vars.pauseOnAction,
                        false, true, true);
                    }
                  });
                } else {
                  el._slider = slider;
                  slider.slides.each(function() {
                    var that = this;
                    that._gesture = new MSGesture();
                    that._gesture.target = that;
                    that.addEventListener("MSPointerDown", function(e) {
                      e.preventDefault();
                      if (e.currentTarget._gesture)
                        e.currentTarget._gesture.addPointer(e.pointerId);
                    }, false);
                    that.addEventListener("MSGestureTap", function(e) {
                      e.preventDefault();
                      var $slide = $(this),
                        target = $slide.index();
                      if (!$(slider.vars.asNavFor).data('flexslider').animating &&
                        !$slide.hasClass('active')) {
                        slider.direction = (slider.currentItem < target) ?
                          "next" : "prev";
                        slider.flexAnimate(target, slider.vars.pauseOnAction,
                          false, true, true);
                      }
                    });
                  });
                }
              }
            },
            controlNav: {
              setup: function() {
                if (!slider.manualControls) {
                  methods.controlNav.setupPaging();
                } else { // MANUALCONTROLS:
                  methods.controlNav.setupManual();
                }
              },
              setupPaging: function() {
                var type = (slider.vars.controlNav === "thumbnails") ?
                  'control-thumbs' : 'control-paging',
                  j = 1,
                  item,
                  slide;

                slider.controlNavScaffold = $('<ol class="' + namespace +
                  'control-nav ' + namespace + type + '"></ol>');

                if (slider.pagingCount > 1) {
                  for (var i = 0; i < slider.pagingCount; i++) {
                    slide = slider.slides.eq(i);
                    item = (slider.vars.controlNav === "thumbnails") ?
                      '<img src="' + slide.attr('data-thumb') + '"/>' :
                      '<a>' + j + '</a>';
                    if ('thumbnails' === slider.vars.controlNav && true ===
                      slider.vars.thumbCaptions) {
                      var captn = slide.attr('data-thumbcaption');
                      if ('' != captn && undefined != captn) item +=
                        '<span class="' + namespace + 'caption">' + captn +
                        '</span>';
                    }
                    // slider.controlNavScaffold.append('<li>' + item + '</li>');
                    slider.controlNavScaffold.append('<li>' + item +
                      '<i></i></li>');
                    j++;
                  }
                }

                // CONTROLSCONTAINER:
                (slider.controlsContainer) ? $(slider.controlsContainer).append(
                  slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
                methods.controlNav.set();

                methods.controlNav.active();

                slider.controlNavScaffold.delegate('a, img', eventType,
                  function(event) {
                    event.preventDefault();

                    if (watchedEvent === "" || watchedEvent === event.type) {
                      var $this = $(this),
                        target = slider.controlNav.index($this);

                      if (!$this.hasClass(namespace + 'active')) {
                        slider.direction = (target > slider.currentSlide) ?
                          "next" : "prev";
                        slider.flexAnimate(target, slider.vars.pauseOnAction);
                      }
                    }

                    // setup flags to prevent event duplication
                    if (watchedEvent === "") {
                      watchedEvent = event.type;
                    }
                    methods.setToClearWatchedEvent();

                  });
              },
              setupManual: function() {
                slider.controlNav = slider.manualControls;
                methods.controlNav.active();

                slider.controlNav.bind(eventType, function(event) {
                  event.preventDefault();

                  if (watchedEvent === "" || watchedEvent === event.type) {
                    var $this = $(this),
                      target = slider.controlNav.index($this);

                    if (!$this.hasClass(namespace + 'active')) {
                      (target > slider.currentSlide) ? slider.direction =
                        "next" : slider.direction = "prev";
                      slider.flexAnimate(target, slider.vars.pauseOnAction);
                    }
                  }

                  // setup flags to prevent event duplication
                  if (watchedEvent === "") {
                    watchedEvent = event.type;
                  }
                  methods.setToClearWatchedEvent();
                });
              },
              set: function() {
                var selector = (slider.vars.controlNav === "thumbnails") ?
                  'img' : 'a';
                slider.controlNav = $('.' + namespace + 'control-nav li ' +
                  selector, (slider.controlsContainer) ? slider.controlsContainer :
                  slider);
              },
              active: function() {
                slider.controlNav.removeClass(namespace + "active").eq(
                  slider.animatingTo).addClass(namespace + "active");
              },
              update: function(action, pos) {
                if (slider.pagingCount > 1 && action === "add") {
                  slider.controlNavScaffold.append($('<li><a>' + slider.count +
                    '</a></li>'));
                } else if (slider.pagingCount === 1) {
                  slider.controlNavScaffold.find('li').remove();
                } else {
                  slider.controlNav.eq(pos).closest('li').remove();
                }
                methods.controlNav.set();
                (slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav
                  .length) ? slider.update(pos, action) : methods.controlNav
                  .active();
              }
            },
            directionNav: {
              setup: function() {
                var directionNavScaffold = $('<ul class="' + namespace +
                  'direction-nav"><li><a class="' + namespace +
                  'prev" href="#">' + slider.vars.prevText +
                  '</a></li><li><a class="' + namespace +
                  'next" href="#">' + slider.vars.nextText +
                  '</a></li></ul>');

                // CONTROLSCONTAINER:
                if (slider.controlsContainer) {
                  $(slider.controlsContainer).append(directionNavScaffold);
                  slider.directionNav = $('.' + namespace +
                    'direction-nav li a', slider.controlsContainer);
                } else {
                  slider.append(directionNavScaffold);
                  slider.directionNav = $('.' + namespace +
                    'direction-nav li a', slider);
                }

                methods.directionNav.update();

                slider.directionNav.bind(eventType, function(event) {
                  event.preventDefault();
                  var target;

                  if (watchedEvent === "" || watchedEvent === event.type) {
                    target = ($(this).hasClass(namespace + 'next')) ?
                      slider.getTarget('next') : slider.getTarget('prev');
                    slider.flexAnimate(target, slider.vars.pauseOnAction);
                  }

                  // setup flags to prevent event duplication
                  if (watchedEvent === "") {
                    watchedEvent = event.type;
                  }
                  methods.setToClearWatchedEvent();
                });
              },
              update: function() {
                var disabledClass = namespace + 'disabled';
                if (slider.pagingCount === 1) {
                  slider.directionNav.addClass(disabledClass).attr(
                    'tabindex', '-1');
                } else if (!slider.vars.animationLoop) {
                  if (slider.animatingTo === 0) {
                    slider.directionNav.removeClass(disabledClass).filter(
                      '.' + namespace + "prev").addClass(disabledClass).attr(
                      'tabindex', '-1');
                  } else if (slider.animatingTo === slider.last) {
                    slider.directionNav.removeClass(disabledClass).filter(
                      '.' + namespace + "next").addClass(disabledClass).attr(
                      'tabindex', '-1');
                  } else {
                    slider.directionNav.removeClass(disabledClass).removeAttr(
                      'tabindex');
                  }
                } else {
                  slider.directionNav.removeClass(disabledClass).removeAttr(
                    'tabindex');
                }
              }
            },
            pausePlay: {
              setup: function() {
                var pausePlayScaffold = $('<div class="' + namespace +
                  'pauseplay"><a></a></div>');

                // CONTROLSCONTAINER:
                if (slider.controlsContainer) {
                  slider.controlsContainer.append(pausePlayScaffold);
                  slider.pausePlay = $('.' + namespace + 'pauseplay a',
                    slider.controlsContainer);
                } else {
                  slider.append(pausePlayScaffold);
                  slider.pausePlay = $('.' + namespace + 'pauseplay a',
                    slider);
                }

                methods.pausePlay.update((slider.vars.slideshow) ?
                  namespace + 'pause' : namespace + 'play');

                slider.pausePlay.bind(eventType, function(event) {
                  event.preventDefault();

                  if (watchedEvent === "" || watchedEvent === event.type) {
                    if ($(this).hasClass(namespace + 'pause')) {
                      slider.manualPause = true;
                      slider.manualPlay = false;
                      slider.pause();
                    } else {
                      slider.manualPause = false;
                      slider.manualPlay = true;
                      slider.play();
                    }
                  }

                  // setup flags to prevent event duplication
                  if (watchedEvent === "") {
                    watchedEvent = event.type;
                  }
                  methods.setToClearWatchedEvent();
                });
              },
              update: function(state) {
                (state === "play") ? slider.pausePlay.removeClass(namespace +
                  'pause').addClass(namespace + 'play').html(slider.vars.playText) :
                  slider.pausePlay.removeClass(namespace + 'play').addClass(
                    namespace + 'pause').html(slider.vars.pauseText);
              }
            },
            touch: function() {
              var startX,
                startY,
                offset,
                cwidth,
                dx,
                startT,
                scrolling = false,
                localX = 0,
                localY = 0,
                accDx = 0;

              if (!msGesture) {
                el.addEventListener('touchstart', onTouchStart, false);

                function onTouchStart(e) {
                  if (slider.animating) {
                    e.preventDefault();
                  } else if ((window.navigator.msPointerEnabled) || e.touches
                    .length === 1) {
                    slider.pause();
                    // CAROUSEL:
                    cwidth = (vertical) ? slider.h : slider.w;
                    startT = Number(new Date());
                    // CAROUSEL:

                    // Local vars for X and Y points.
                    localX = e.touches[0].pageX;
                    localY = e.touches[0].pageY;

                    offset = (carousel && reverse && slider.animatingTo ===
                      slider.last) ? 0 :
                      (carousel && reverse) ? slider.limit - (((slider.itemW +
                      slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                      (carousel && slider.currentSlide === slider.last) ?
                      slider.limit :
                      (carousel) ? ((slider.itemW + slider.vars.itemMargin) *
                        slider.move) * slider.currentSlide :
                      (reverse) ? (slider.last - slider.currentSlide +
                        slider.cloneOffset) * cwidth : (slider.currentSlide +
                        slider.cloneOffset) * cwidth;
                    startX = (vertical) ? localY : localX;
                    startY = (vertical) ? localX : localY;

                    el.addEventListener('touchmove', onTouchMove, false);
                    el.addEventListener('touchend', onTouchEnd, false);
                  }
                }

                function onTouchMove(e) {
                  // Local vars for X and Y points.

                  localX = e.touches[0].pageX;
                  localY = e.touches[0].pageY;

                  dx = (vertical) ? startX - localY : startX - localX;
                  scrolling = (vertical) ? (Math.abs(dx) < Math.abs(localX -
                    startY)) : (Math.abs(dx) < Math.abs(localY - startY));

                  var fxms = 500;

                  if (!scrolling || Number(new Date()) - startT > fxms) {
                    e.preventDefault();
                    if (!fade && slider.transitions) {
                      if (!slider.vars.animationLoop) {
                        dx = dx / ((slider.currentSlide === 0 && dx < 0 ||
                            slider.currentSlide === slider.last && dx > 0) ?
                          (Math.abs(dx) / cwidth + 2) : 1);
                      }
                      slider.setProps(offset + dx, "setTouch");
                    }
                  }
                }

                function onTouchEnd(e) {
                  // finish the touch by undoing the touch session
                  el.removeEventListener('touchmove', onTouchMove, false);

                  if (slider.animatingTo === slider.currentSlide && !
                    scrolling && !(dx === null)) {
                    var updateDx = (reverse) ? -dx : dx,
                      target = (updateDx > 0) ? slider.getTarget('next') :
                      slider.getTarget('prev');

                    if (slider.canAdvance(target) && (Number(new Date()) -
                      startT < 550 && Math.abs(updateDx) > 50 || Math.abs(
                        updateDx) > cwidth / 2)) {
                      slider.flexAnimate(target, slider.vars.pauseOnAction);
                    } else {
                      if (!fade) slider.flexAnimate(slider.currentSlide,
                        slider.vars.pauseOnAction, true);
                    }
                  }
                  el.removeEventListener('touchend', onTouchEnd, false);

                  startX = null;
                  startY = null;
                  dx = null;
                  offset = null;
                }
              } else {
                el.style.msTouchAction = "none";
                el._gesture = new MSGesture();
                el._gesture.target = el;
                el.addEventListener("MSPointerDown", onMSPointerDown, false);
                el._slider = slider;
                el.addEventListener("MSGestureChange", onMSGestureChange,
                  false);
                el.addEventListener("MSGestureEnd", onMSGestureEnd, false);

                function onMSPointerDown(e) {
                  e.stopPropagation();
                  if (slider.animating) {
                    e.preventDefault();
                  } else {
                    slider.pause();
                    el._gesture.addPointer(e.pointerId);
                    accDx = 0;
                    cwidth = (vertical) ? slider.h : slider.w;
                    startT = Number(new Date());
                    // CAROUSEL:

                    offset = (carousel && reverse && slider.animatingTo ===
                      slider.last) ? 0 :
                      (carousel && reverse) ? slider.limit - (((slider.itemW +
                      slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                      (carousel && slider.currentSlide === slider.last) ?
                      slider.limit :
                      (carousel) ? ((slider.itemW + slider.vars.itemMargin) *
                        slider.move) * slider.currentSlide :
                      (reverse) ? (slider.last - slider.currentSlide +
                        slider.cloneOffset) * cwidth : (slider.currentSlide +
                        slider.cloneOffset) * cwidth;
                  }
                }

                function onMSGestureChange(e) {
                  e.stopPropagation();
                  var slider = e.target._slider;
                  if (!slider) {
                    return;
                  }
                  var transX = -e.translationX,
                    transY = -e.translationY;

                  //Accumulate translations.
                  accDx = accDx + ((vertical) ? transY : transX);
                  dx = accDx;
                  scrolling = (vertical) ? (Math.abs(accDx) < Math.abs(-
                    transX)) : (Math.abs(accDx) < Math.abs(-transY));

                  if (e.detail === e.MSGESTURE_FLAG_INERTIA) {
                    setImmediate(function() {
                      el._gesture.stop();
                    });

                    return;
                  }

                  if (!scrolling || Number(new Date()) - startT > 500) {
                    e.preventDefault();
                    if (!fade && slider.transitions) {
                      if (!slider.vars.animationLoop) {
                        dx = accDx / ((slider.currentSlide === 0 && accDx <
                          0 || slider.currentSlide === slider.last &&
                          accDx > 0) ? (Math.abs(accDx) / cwidth + 2) : 1);
                      }
                      slider.setProps(offset + dx, "setTouch");
                    }
                  }
                }

                function onMSGestureEnd(e) {
                  e.stopPropagation();
                  var slider = e.target._slider;
                  if (!slider) {
                    return;
                  }
                  if (slider.animatingTo === slider.currentSlide && !
                    scrolling && !(dx === null)) {
                    var updateDx = (reverse) ? -dx : dx,
                      target = (updateDx > 0) ? slider.getTarget('next') :
                      slider.getTarget('prev');

                    if (slider.canAdvance(target) && (Number(new Date()) -
                      startT < 550 && Math.abs(updateDx) > 50 || Math.abs(
                        updateDx) > cwidth / 2)) {
                      slider.flexAnimate(target, slider.vars.pauseOnAction);
                    } else {
                      if (!fade) slider.flexAnimate(slider.currentSlide,
                        slider.vars.pauseOnAction, true);
                    }
                  }

                  startX = null;
                  startY = null;
                  dx = null;
                  offset = null;
                  accDx = 0;
                }
              }
            },
            resize: function() {
              if (!slider.animating && slider.is(':visible')) {
                if (!carousel) slider.doMath();

                if (fade) {
                  // SMOOTH HEIGHT:
                  methods.smoothHeight();
                } else if (carousel) { //CAROUSEL:
                  slider.slides.width(slider.computedW);
                  slider.update(slider.pagingCount);
                  slider.setProps();
                } else if (vertical) { //VERTICAL:
                  slider.viewport.height(slider.h);
                  slider.setProps(slider.h, "setTotal");
                } else {
                  // SMOOTH HEIGHT:
                  if (slider.vars.smoothHeight) methods.smoothHeight();
                  slider.newSlides.width(slider.computedW);
                  slider.setProps(slider.computedW, "setTotal");
                }
              }
            },
            smoothHeight: function(dur) {
              if (!vertical || fade) {
                var $obj = (fade) ? slider : slider.viewport;
                (dur) ? $obj.animate({
                  "height": slider.slides.eq(slider.animatingTo).height()
                }, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height());
              }
            },
            sync: function(action) {
              var $obj = $(slider.vars.sync).data("flexslider"),
                target = slider.animatingTo;

              switch (action) {
                case "animate":
                  $obj.flexAnimate(target, slider.vars.pauseOnAction, false,
                    true);
                  break;
                case "play":
                  if (!$obj.playing && !$obj.asNav) {
                    $obj.play();
                  }
                  break;
                case "pause":
                  $obj.pause();
                  break;
              }
            },
            uniqueID: function($clone) {
              // Append _clone to current level and children elements with id attributes
              $clone.filter('[id]').add($clone.find('[id]')).each(function() {
                var $this = $(this);
                $this.attr('id', $this.attr('id') + '_clone');
              });
              return $clone;
            },
            pauseInvisible: {
              visProp: null,
              init: function() {
                var prefixes = ['webkit', 'moz', 'ms', 'o'];

                if ('hidden' in document) return 'hidden';
                for (var i = 0; i < prefixes.length; i++) {
                  if ((prefixes[i] + 'Hidden') in document)
                    methods.pauseInvisible.visProp = prefixes[i] + 'Hidden';
                }
                if (methods.pauseInvisible.visProp) {
                  var evtname = methods.pauseInvisible.visProp.replace(
                    /[H|h]idden/, '') + 'visibilitychange';
                  document.addEventListener(evtname, function() {
                    if (methods.pauseInvisible.isHidden()) {
                      if (slider.startTimeout) clearTimeout(slider.startTimeout); //If clock is ticking, stop timer and prevent from starting while invisible
                      else slider.pause(); //Or just pause
                    } else {
                      if (slider.started) slider.play(); //Initiated before, just play
                      else(slider.vars.initDelay > 0) ? setTimeout(slider
                        .play, slider.vars.initDelay) : slider.play(); //Didn't init before: simply init or wait for it
                    }
                  });
                }
              },
              isHidden: function() {
                return document[methods.pauseInvisible.visProp] || false;
              }
            },
            setToClearWatchedEvent: function() {
              clearTimeout(watchedEventClearTimer);
              watchedEventClearTimer = setTimeout(function() {
                watchedEvent = "";
              }, 3000);
            }
          };

          // public methods
          slider.flexAnimate = function(target, pause, override, withSync,
            fromNav) {
            if (!slider.vars.animationLoop && target !== slider.currentSlide) {
              slider.direction = (target > slider.currentSlide) ? "next" :
                "prev";
            }

            if (asNav && slider.pagingCount === 1) slider.direction = (
              slider.currentItem < target) ? "next" : "prev";

            if (!slider.animating && (slider.canAdvance(target, fromNav) ||
              override) && slider.is(":visible")) {
              if (asNav && withSync) {
                var master = $(slider.vars.asNavFor).data('flexslider');
                slider.atEnd = target === 0 || target === slider.count - 1;
                master.flexAnimate(target, true, false, true, fromNav);
                slider.direction = (slider.currentItem < target) ? "next" :
                  "prev";
                master.direction = slider.direction;

                if (Math.ceil((target + 1) / slider.visible) - 1 !== slider
                  .currentSlide && target !== 0) {
                  slider.currentItem = target;
                  slider.slides.removeClass(namespace + "active-slide").eq(
                    target).addClass(namespace + "active-slide");
                  target = Math.floor(target / slider.visible);
                } else {
                  slider.currentItem = target;
                  slider.slides.removeClass(namespace + "active-slide").eq(
                    target).addClass(namespace + "active-slide");
                  return false;
                }
              }

              slider.animating = true;
              slider.animatingTo = target;

              // SLIDESHOW:
              if (pause) slider.pause();

              // API: before() animation Callback
              slider.vars.before(slider);

              // SYNC:
              if (slider.syncExists && !fromNav) methods.sync("animate");

              // CONTROLNAV
              if (slider.vars.controlNav) methods.controlNav.active();

              // !CAROUSEL:
              // CANDIDATE: slide active class (for add/remove slide)
              if (!carousel) slider.slides.removeClass(namespace +
                'active-slide').eq(target).addClass(namespace +
                'active-slide');

              // INFINITE LOOP:
              // CANDIDATE: atEnd
              slider.atEnd = target === 0 || target === slider.last;

              // DIRECTIONNAV:
              if (slider.vars.directionNav) methods.directionNav.update();

              if (target === slider.last) {
                // API: end() of cycle Callback
                slider.vars.end(slider);
                // SLIDESHOW && !INFINITE LOOP:
                if (!slider.vars.animationLoop) slider.pause();
              }

              // SLIDE:
              if (!fade) {
                var dimension = (vertical) ? slider.slides.filter(':first')
                  .height() : slider.computedW,
                  margin, slideString, calcNext;

                // INFINITE LOOP / REVERSE:
                if (carousel) {
                  //margin = (slider.vars.itemWidth > slider.w) ? slider.vars.itemMargin * 2 : slider.vars.itemMargin;
                  margin = slider.vars.itemMargin;
                  calcNext = ((slider.itemW + margin) * slider.move) *
                    slider.animatingTo;
                  slideString = (calcNext > slider.limit && slider.visible !==
                    1) ? slider.limit : calcNext;
                } else if (slider.currentSlide === 0 && target === slider.count -
                  1 && slider.vars.animationLoop && slider.direction !==
                  "next") {
                  slideString = (reverse) ? (slider.count + slider.cloneOffset) *
                    dimension : 0;
                } else if (slider.currentSlide === slider.last && target ===
                  0 && slider.vars.animationLoop && slider.direction !==
                  "prev") {
                  slideString = (reverse) ? 0 : (slider.count + 1) *
                    dimension;
                } else {
                  slideString = (reverse) ? ((slider.count - 1) - target +
                    slider.cloneOffset) * dimension : (target + slider.cloneOffset) *
                    dimension;
                }
                slider.setProps(slideString, "", slider.vars.animationSpeed);
                if (slider.transitions) {
                  if (!slider.vars.animationLoop || !slider.atEnd) {
                    slider.animating = false;
                    slider.currentSlide = slider.animatingTo;
                  }

                  // Unbind previous transitionEnd events and re-bind new transitionEnd event
                  slider.container.unbind(
                    "webkitTransitionEnd transitionend");
                  slider.container.bind("webkitTransitionEnd transitionend",
                    function() {
                      clearTimeout(slider.ensureAnimationEnd);
                      slider.wrapup(dimension);
                    });

                  // Insurance for the ever-so-fickle transitionEnd event
                  clearTimeout(slider.ensureAnimationEnd);
                  slider.ensureAnimationEnd = setTimeout(function() {
                    slider.wrapup(dimension);
                  }, slider.vars.animationSpeed + 100);

                } else {
                  slider.container.animate(slider.args, slider.vars.animationSpeed,
                    slider.vars.easing, function() {
                      slider.wrapup(dimension);
                    });
                }
              } else { // FADE:
                if (!touch) {
                  //slider.slides.eq(slider.currentSlide).fadeOut(slider.vars.animationSpeed, slider.vars.easing);
                  //slider.slides.eq(target).fadeIn(slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

                  slider.slides.eq(slider.currentSlide).css({
                    "zIndex": 1
                  }).animate({
                    "opacity": 0
                  }, slider.vars.animationSpeed, slider.vars.easing);
                  slider.slides.eq(target).css({
                    "zIndex": 2
                  }).animate({
                      "opacity": 1
                    }, slider.vars.animationSpeed, slider.vars.easing,
                    slider.wrapup);

                } else {
                  slider.slides.eq(slider.currentSlide).css({
                    "opacity": 0,
                    "zIndex": 1
                  });
                  slider.slides.eq(target).css({
                    "opacity": 1,
                    "zIndex": 2
                  });
                  slider.wrapup(dimension);
                }
              }
              // SMOOTH HEIGHT:
              if (slider.vars.smoothHeight) methods.smoothHeight(slider.vars
                .animationSpeed);
            }
          };
          slider.wrapup = function(dimension) {
            // SLIDE:
            if (!fade && !carousel) {
              if (slider.currentSlide === 0 && slider.animatingTo ===
                slider.last && slider.vars.animationLoop) {
                slider.setProps(dimension, "jumpEnd");
              } else if (slider.currentSlide === slider.last && slider.animatingTo ===
                0 && slider.vars.animationLoop) {
                slider.setProps(dimension, "jumpStart");
              }
            }
            slider.animating = false;
            slider.currentSlide = slider.animatingTo;
            // API: after() animation Callback
            slider.vars.after(slider);
          };

          // SLIDESHOW:
          slider.animateSlides = function() {
            if (!slider.animating && focused) slider.flexAnimate(slider.getTarget(
              "next"));
          };
          // SLIDESHOW:
          slider.pause = function() {
            clearInterval(slider.animatedSlides);
            slider.animatedSlides = null;
            slider.playing = false;
            // PAUSEPLAY:
            if (slider.vars.pausePlay) methods.pausePlay.update("play");
            // SYNC:
            if (slider.syncExists) methods.sync("pause");
          };
          // SLIDESHOW:
          slider.play = function() {
            if (slider.playing) clearInterval(slider.animatedSlides);
            slider.animatedSlides = slider.animatedSlides || setInterval(
              slider.animateSlides, slider.vars.slideshowSpeed);
            slider.started = slider.playing = true;
            // PAUSEPLAY:
            if (slider.vars.pausePlay) methods.pausePlay.update("pause");
            // SYNC:
            if (slider.syncExists) methods.sync("play");
          };
          // STOP:
          slider.stop = function() {
            slider.pause();
            slider.stopped = true;
          };
          slider.canAdvance = function(target, fromNav) {
            // ASNAV:
            var last = (asNav) ? slider.pagingCount - 1 : slider.last;
            return (fromNav) ? true :
              (asNav && slider.currentItem === slider.count - 1 && target ===
                0 && slider.direction === "prev") ? true :
              (asNav && slider.currentItem === 0 && target === slider.pagingCount -
                1 && slider.direction !== "next") ? false :
              (target === slider.currentSlide && !asNav) ? false :
              (slider.vars.animationLoop) ? true :
              (slider.atEnd && slider.currentSlide === 0 && target === last &&
                slider.direction !== "next") ? false :
              (slider.atEnd && slider.currentSlide === last && target === 0 &&
                slider.direction === "next") ? false :
              true;
          };
          slider.getTarget = function(dir) {
            slider.direction = dir;
            if (dir === "next") {
              return (slider.currentSlide === slider.last) ? 0 : slider.currentSlide +
                1;
            } else {
              return (slider.currentSlide === 0) ? slider.last : slider.currentSlide -
                1;
            }
          };

          // SLIDE:
          slider.setProps = function(pos, special, dur) {
            var target = (function() {
              var posCheck = (pos) ? pos : ((slider.itemW + slider.vars
                  .itemMargin) * slider.move) * slider.animatingTo,
                posCalc = (function() {
                  if (carousel) {
                    return (special === "setTouch") ? pos :
                      (reverse && slider.animatingTo === slider.last) ?
                      0 :
                      (reverse) ? slider.limit - (((slider.itemW +
                          slider.vars.itemMargin) * slider.move) *
                        slider.animatingTo) :
                      (slider.animatingTo === slider.last) ? slider.limit :
                      posCheck;
                  } else {
                    switch (special) {
                      case "setTotal":
                        return (reverse) ? ((slider.count - 1) -
                            slider.currentSlide + slider.cloneOffset) *
                          pos : (slider.currentSlide + slider.cloneOffset) *
                          pos;
                      case "setTouch":
                        return (reverse) ? pos : pos;
                      case "jumpEnd":
                        return (reverse) ? pos : slider.count * pos;
                      case "jumpStart":
                        return (reverse) ? slider.count * pos : pos;
                      default:
                        return pos;
                    }
                  }
                }());

              return (posCalc * -1) + "px";
            }());

            if (slider.transitions) {
              target = (vertical) ? "translate3d(0," + target + ",0)" :
                "translate3d(" + target + ",0,0)";
              dur = (dur !== undefined) ? (dur / 1000) + "s" : "0s";
              slider.container.css("-" + slider.pfx +
                "-transition-duration", dur);
              slider.container.css("transition-duration", dur);
            }

            slider.args[slider.prop] = target;
            if (slider.transitions || dur === undefined) slider.container.css(
              slider.args);

            slider.container.css('transform', target);
          };

          slider.setup = function(type) {
            // SLIDE:
            if (!fade) {
              var sliderOffset, arr;

              if (type === "init") {
                slider.viewport = $('<div class="' + namespace +
                  'viewport"></div>').css({
                  "overflow": "hidden",
                  "position": "relative"
                }).appendTo(slider).append(slider.container);
                // INFINITE LOOP:
                slider.cloneCount = 0;
                slider.cloneOffset = 0;
                // REVERSE:
                if (reverse) {
                  arr = $.makeArray(slider.slides).reverse();
                  slider.slides = $(arr);
                  slider.container.empty().append(slider.slides);
                }
              }
              // INFINITE LOOP && !CAROUSEL:
              if (slider.vars.animationLoop && !carousel) {
                slider.cloneCount = 2;
                slider.cloneOffset = 1;
                // clear out old clones
                if (type !== "init") slider.container.find('.clone').remove();
                slider.container.append(methods.uniqueID(slider.slides.first()
                  .clone().addClass('clone')).attr('aria-hidden', 'true'))
                  .prepend(methods.uniqueID(slider.slides.last().clone().addClass(
                    'clone')).attr('aria-hidden', 'true'));
              }
              slider.newSlides = $(slider.vars.selector, slider);

              sliderOffset = (reverse) ? slider.count - 1 - slider.currentSlide +
                slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
              // VERTICAL:
              if (vertical && !carousel) {
                slider.container.height((slider.count + slider.cloneCount) *
                  200 + "%").css("position", "absolute").width("100%");
                setTimeout(function() {
                  slider.newSlides.css({
                    "display": "block"
                  });
                  slider.doMath();
                  slider.viewport.height(slider.h);
                  slider.setProps(sliderOffset * slider.h, "init");
                }, (type === "init") ? 100 : 0);
              } else {
                slider.container.width((slider.count + slider.cloneCount) *
                  200 + "%");
                slider.setProps(sliderOffset * slider.computedW, "init");
                setTimeout(function() {
                  slider.doMath();
                  slider.newSlides.css({
                    "width": slider.computedW,
                    "float": "left",
                    "display": "block"
                  });
                  // SMOOTH HEIGHT:
                  if (slider.vars.smoothHeight) methods.smoothHeight();
                }, (type === "init") ? 100 : 0);
              }
            } else { // FADE:
              slider.slides.css({
                "width": "100%",
                "float": "left",
                "marginRight": "-100%",
                "position": "relative"
              });
              if (type === "init") {
                if (!touch) {
                  //slider.slides.eq(slider.currentSlide).fadeIn(slider.vars.animationSpeed, slider.vars.easing);
                  if (slider.vars.fadeFirstSlide == false) {
                    slider.slides.css({
                      "opacity": 0,
                      "display": "block",
                      "zIndex": 1
                    }).eq(slider.currentSlide).css({
                      "zIndex": 2
                    }).css({
                      "opacity": 1
                    });
                  } else {
                    slider.slides.css({
                      "opacity": 0,
                      "display": "block",
                      "zIndex": 1
                    }).eq(slider.currentSlide).css({
                      "zIndex": 2
                    }).animate({
                      "opacity": 1
                    }, slider.vars.animationSpeed, slider.vars.easing);
                  }
                } else {
                  slider.slides.css({
                    "opacity": 0,
                    "display": "block",
                    "webkitTransition": "opacity " + slider.vars.animationSpeed /
                      1000 + "s ease",
                    "zIndex": 1
                  }).eq(slider.currentSlide).css({
                    "opacity": 1,
                    "zIndex": 2
                  });
                }
              }
              // SMOOTH HEIGHT:
              if (slider.vars.smoothHeight) methods.smoothHeight();
            }
            // !CAROUSEL:
            // CANDIDATE: active slide
            if (!carousel) slider.slides.removeClass(namespace +
              "active-slide").eq(slider.currentSlide).addClass(namespace +
              "active-slide");

            //FlexSlider: init() Callback
            slider.vars.init(slider);
          };

          slider.doMath = function() {
            var slide = slider.slides.first(),
              slideMargin = slider.vars.itemMargin,
              minItems = slider.vars.minItems,
              maxItems = slider.vars.maxItems;

            slider.w = (slider.viewport === undefined) ? slider.width() :
              slider.viewport.width();
            slider.h = slide.height();
            slider.boxPadding = slide.outerWidth() - slide.width();

            // CAROUSEL:
            if (carousel) {
              slider.itemT = slider.vars.itemWidth + slideMargin;
              slider.minW = (minItems) ? minItems * slider.itemT : slider.w;
              slider.maxW = (maxItems) ? (maxItems * slider.itemT) -
                slideMargin : slider.w;
              slider.itemW = (slider.minW > slider.w) ? (slider.w - (
                slideMargin * (minItems - 1))) / minItems :
                (slider.maxW < slider.w) ? (slider.w - (slideMargin * (
                maxItems - 1))) / maxItems :
                (slider.vars.itemWidth > slider.w) ? slider.w : slider.vars
                .itemWidth;

              slider.visible = Math.floor(slider.w / (slider.itemW));
              slider.move = (slider.vars.move > 0 && slider.vars.move <
                slider.visible) ? slider.vars.move : slider.visible;
              slider.pagingCount = Math.ceil(((slider.count - slider.visible) /
                slider.move) + 1);
              slider.last = slider.pagingCount - 1;
              slider.limit = (slider.pagingCount === 1) ? 0 :
                (slider.vars.itemWidth > slider.w) ? (slider.itemW * (
                slider.count - 1)) + (slideMargin * (slider.count - 1)) : (
                (slider.itemW + slideMargin) * slider.count) - slider.w -
                slideMargin;
            } else {
              slider.itemW = slider.w;
              slider.pagingCount = slider.count;
              slider.last = slider.count - 1;
            }
            slider.computedW = slider.itemW - slider.boxPadding;
          };

          slider.update = function(pos, action) {
            slider.doMath();

            // update currentSlide and slider.animatingTo if necessary
            if (!carousel) {
              if (pos < slider.currentSlide) {
                slider.currentSlide += 1;
              } else if (pos <= slider.currentSlide && pos !== 0) {
                slider.currentSlide -= 1;
              }
              slider.animatingTo = slider.currentSlide;
            }

            // update controlNav
            if (slider.vars.controlNav && !slider.manualControls) {
              if ((action === "add" && !carousel) || slider.pagingCount >
                slider.controlNav.length) {
                methods.controlNav.update("add");
              } else if ((action === "remove" && !carousel) || slider.pagingCount <
                slider.controlNav.length) {
                if (carousel && slider.currentSlide > slider.last) {
                  slider.currentSlide -= 1;
                  slider.animatingTo -= 1;
                }
                methods.controlNav.update("remove", slider.last);
              }
            }
            // update directionNav
            if (slider.vars.directionNav) methods.directionNav.update();

          };

          slider.addSlide = function(obj, pos) {
            var $obj = $(obj);

            slider.count += 1;
            slider.last = slider.count - 1;

            // append new slide
            if (vertical && reverse) {
              (pos !== undefined) ? slider.slides.eq(slider.count - pos).after(
                $obj) : slider.container.prepend($obj);
            } else {
              (pos !== undefined) ? slider.slides.eq(pos).before($obj) :
                slider.container.append($obj);
            }

            // update currentSlide, animatingTo, controlNav, and directionNav
            slider.update(pos, "add");

            // update slider.slides
            slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
            // re-setup the slider to accomdate new slide
            slider.setup();

            //FlexSlider: added() Callback
            slider.vars.added(slider);
          };
          slider.removeSlide = function(obj) {
            var pos = (isNaN(obj)) ? slider.slides.index($(obj)) : obj;

            // update count
            slider.count -= 1;
            slider.last = slider.count - 1;

            // remove slide
            if (isNaN(obj)) {
              $(obj, slider.slides).remove();
            } else {
              (vertical && reverse) ? slider.slides.eq(slider.last).remove() :
                slider.slides.eq(obj).remove();
            }

            // update currentSlide, animatingTo, controlNav, and directionNav
            slider.doMath();
            slider.update(pos, "remove");

            // update slider.slides
            slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
            // re-setup the slider to accomdate new slide
            slider.setup();

            // FlexSlider: removed() Callback
            slider.vars.removed(slider);
          };

          //FlexSlider: Initialize
          methods.init();
        };

        // Ensure the slider isn't focussed if the window loses focus.
        $(window).blur(function(e) {
          focused = false;
        }).focus(function(e) {
          focused = true;
        });

        // FlexSlider: Default Settings
        $.flexslider.defaults = {
          namespace: "am-", //{NEW} String: Prefix string attached to the class of every element generated by the plugin
          selector: ".am-slides > li", //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
          animation: "slide", //String: Select your animation type, "fade" or "slide"
          easing: "swing", //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
          direction: "horizontal", //String: Select the sliding direction, "horizontal" or "vertical"
          reverse: false, //{NEW} Boolean: Reverse the animation direction
          animationLoop: true, //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
          smoothHeight: false, //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
          startAt: 0, //Integer: The slide that the slider should start on. Array notation (0 = first slide)
          slideshow: true, //Boolean: Animate slider automatically
          slideshowSpeed: 5000, //Integer: Set the speed of the slideshow cycling, in milliseconds
          animationSpeed: 600, //Integer: Set the speed of animations, in milliseconds
          initDelay: 0, //{NEW} Integer: Set an initialization delay, in milliseconds
          randomize: false, //Boolean: Randomize slide order
          fadeFirstSlide: true, //Boolean: Fade in the first slide when animation type is "fade"
          thumbCaptions: false, //Boolean: Whether or not to put captions on thumbnails when using the "thumbnails" controlNav.

          // Usability features
          pauseOnAction: true, //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
          pauseOnHover: false, //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
          pauseInvisible: true, //{NEW} Boolean: Pause the slideshow when tab is invisible, resume when visible. Provides better UX, lower CPU usage.
          useCSS: true, //{NEW} Boolean: Slider will use CSS3 transitions if available
          touch: true, //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
          video: false, //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

          // Primary Controls
          controlNav: true, //Boolean: Create navigation for paging control of each slide? Note: Leave true for manualControls usage
          directionNav: true, //Boolean: Create navigation for previous/next navigation? (true/false)
          prevText: "Previous", //String: Set the text for the "previous" directionNav item
          nextText: "Next", //String: Set the text for the "next" directionNav item

          // Secondary Navigation
          keyboard: true, //Boolean: Allow slider navigating via keyboard left/right keys
          multipleKeyboard: false, //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
          mousewheel: false, //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
          pausePlay: false, //Boolean: Create pause/play dynamic element
          pauseText: "Pause", //String: Set the text for the "pause" pausePlay item
          playText: "Play", //String: Set the text for the "play" pausePlay item

          // Special properties
          controlsContainer: "", //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
          manualControls: "", //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
          sync: "", //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
          asNavFor: "", //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

          // Carousel Options
          itemWidth: 0, //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
          itemMargin: 0, //{NEW} Integer: Margin between carousel items.
          minItems: 1, //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
          maxItems: 0, //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
          move: 0, //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
          allowOneSlide: true, //{NEW} Boolean: Whether or not to allow a slider comprised of a single slide

          // Callback API
          start: function() {}, //Callback: function(slider) - Fires when the slider loads the first slide
          before: function() {}, //Callback: function(slider) - Fires asynchronously with each slider animation
          after: function() {}, //Callback: function(slider) - Fires after each slider animation completes
          end: function() {}, //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
          added: function() {}, //{NEW} Callback: function(slider) - Fires after a slide is added
          removed: function() {}, //{NEW} Callback: function(slider) - Fires after a slide is removed
          init: function() {} //{NEW} Callback: function(slider) - Fires after the slider is initially setup
        };

        // FlexSlider: Plugin Function
        $.fn.flexslider = function(options) {
          if (options === undefined) options = {};

          if (typeof options === "object") {
            return this.each(function() {
              var $this = $(this),
                selector = (options.selector) ? options.selector :
                ".am-slides > li",
                $slides = $this.find(selector);

              if (($slides.length === 1 && options.allowOneSlide ===
                true) || $slides.length === 0) {
                $slides.fadeIn(400);
                if (options.start) options.start($this);
              } else if ($this.data('flexslider') === undefined) {
                new $.flexslider(this, options);
              }
            });
          } else {
            // Helper strings to quickly pecdrform functions on the slider
            var $slider = $(this).data('flexslider');
            switch (options) {
              case 'play':
                $slider.play();
                break;
              case 'pause':
                $slider.pause();
                break;
              case 'stop':
                $slider.stop();
                break;
              case 'next':
                $slider.flexAnimate($slider.getTarget('next'), true);
                break;
              case 'prev':
              case 'previous':
                $slider.flexAnimate($slider.getTarget('prev'), true);
                break;
              default:
                if (typeof options === 'number') {
                  $slider.flexAnimate(options, true);
                }
            }
          }
        };

        // Init code
        $(function() {
          $('[data-am-flexslider]').each(function(i, item) {
            var $slider = $(item);
            var options = UI.utils.parseOptions($slider.data(
              'amFlexslider'));

            options.before = function(slider) {
              if (slider._pausedTimer) {
                window.clearTimeout(slider._pausedTimer);
                slider._pausedTimer = null;
              }
            };

            options.after = function(slider) {
              var pauseTime = slider.vars.playAfterPaused;
              if (pauseTime && !isNaN(pauseTime) && !slider.playing) {
                if (!slider.manualPause && !slider.manualPlay && !
                  slider.stopped) {
                  slider._pausedTimer = window.setTimeout(function() {
                    slider.play();
                  }, pauseTime);
                }
              }
            };

            $slider.flexslider(options);
          });
        });

        // if (!slider.manualPause && !slider.manualPlay && !slider.stopped) slider.play();

        module.exports = $.flexslider;

      }).call(this, typeof global !== "undefined" ? global : typeof self !==
        "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
      "./core": 4
    }
  ]
}, {}, [2]);  