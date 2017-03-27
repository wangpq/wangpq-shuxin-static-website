/***************************************
 * autofix js file for wf page
 * Released under the MIT license
 * http://www.ishuxin.cn/license
 * Author : Wangpq;
 * Date: 2015-05-04T18:00Z
 **************************************/
;(function($) {
	
	"use strict";
    
	var AutoFix=function(){
		this._init.apply(this,arguments);	
	}
	AutoFix.prototype={
		/**
		 * 默认参数
		 */
		options:{
			/** 
			 * 要进行fix的对象
			 * @property {Number} selector 
			 */
			selector : 'h3',
			/** 
			 * 固定盒子距离顶部的高度
			 * @property {Number} fixHeight 
			 */
		    fixHeight:68,
			/** 
			 * 固定在某处的盒子选择器
			 * @property {String} fixbox 
			 */
		    fixbox: '#fix-box'
		},
		/**
		 * 初始化插件
		 */
		_init:function(element, options){
			var g=this;
			g.options= $.extend({}, g.options, options);
			g.element=$(element);
			g.dom=g.element[0];
			
			//初始化参数
			g._initOptions();
			
			//初始化事件
			g._initEvents();
		},
		/** 
		 * 初始化参数
		 * @method _initOptions 
		 * @for SpasticNav  
		 * @return {Null} 无返回值
		 */ 
		_initOptions : function(){
			var g = this
			   ,el = g.element
			   ,p = g.options;
			g.h = $(p.selector, el);
			g.fixbox=$(p.fixbox);
		},
		/** 
		 * 初始化事件
		 * @method _initEvents 
		 * @for SpasticNav  
		 * @return {Null} 无返回值
		 */ 
		_initEvents : function(){
			var g = this
			   ,el = g.element
			   ,p = g.options;
			$(window).bind("load scroll resize touchmove orientationchange",function(){ 
				var now=-1;  
				var nowTop = $(window).scrollTop()+p.fixHeight; 
			    if($(window).scrollTop()<p.fixHeight) 
			    	g.fixbox.hide();
                else
			    	g.fixbox.show();
				for(var i=0,l=g.h.length;i<l;i++){  
					var otop = g.h.eq(i).offset().top ;
					if(nowTop > otop)
						now = i; 
					if(now != -1)
						g.fixbox.find(".content").html(g.h.eq(now).text())
				}
			});
        }
	}

	
    // autofix plugin definition
    // =======================
	var old = $.fn.autofix;
	$.fn.autofix = function (option) {
		return this.each(function(){
			//new AutoFix(this,option);
			var $this   = $(this)
			  , data    = $this.data('wp.autofix')
			  , options = typeof option == 'object' && option
			if (!data) $this.data('wp.autofix', (data = new AutoFix(this, options)))
			if (typeof option == 'string') data[option].call($this)	 
		})
	};
	$.fn.autofix.Constructor = AutoFix ;
    // autofix no conflict
    // =================
	$.fn.autofix.noConflict = function () {
		$.fn.autofix = old
		return this
	}
})(jQuery);


