/***************************************
 * easypager js file for sq page
 * Released under the MIT license
 * http://www.ishuxin.cn/license
 * Author : Wangpq;
 * Date: 2015-05-25T12:00Z
 **************************************/
;(function($){

	"use strict";

	var EasyPager   = function (el,options) {
		this.element=$(el);
		this.options=options;
		this._initOptions();
		this._initEvents();
	}
	EasyPager.prototype={
		/** 
		 * 初始化参数
		 */
	    _initOptions : function () {
	        var g=this
	          , el = g.element
	          , p=g.options;
	        g.target=$(p.target);
	        g.items= g.target.find(p.selector);
	        g.curPage=p.curPage;
	        g.count= !!p.target ? g.items.length :  p.count;
	        g.perPage=(!p.perPage || p.perPage < 0)?1:p.perPage;

	        g.pageCount=Math.ceil(g.count/g.perPage);
           
            g._initTable();
            
            // 所有初始化完成后，自动绘制页码按钮
			g.drawLinks();

            p.onSelect(g.curPage, g);  

	    },
		/** 
		* 初始化事件
		*/
		_initEvents : function () {
        },
		/**
		 * 获取分页开始和结束的点
		 * @return {Array} 
		 */
        getInterval :function(){
	        var g=this
	          , el = g.element
	          , p=g.options;
			var ne_half = Math.ceil(p.displayEntriesNum/2);
			var upper_limit = g.pageCount-p.displayEntriesNum;
			var start = g.curPage>ne_half?Math.max(Math.min(g.curPage-ne_half, upper_limit), 0):0;
			var end = g.curPage>ne_half?Math.min(g.curPage+ne_half, g.pageCount):Math.min(p.displayEntriesNum, g.pageCount);
			return [start,end];
        },

		/**
		 * 分页按钮选中被选中
		 * @param {int} page_id 新页码
		 * @param {Event} evt 选中事件
		 */
        pageSelected :function(page_id, evt){
	        var g=this
	          , el = g.element
	          , p=g.options;
			g.curPage = page_id;
			g.drawLinks();
			var continuePropagation = p.onSelect(page_id, el);
			if (!continuePropagation) {
				if (evt.stopPropagation) {
					evt.stopPropagation();
				}else {
					evt.cancelBubble = true;
				}
			}
			g.doPager(g.curPage);
			return continuePropagation;
        },
		/**
		 * 绘制分页链接按钮
		 */
        drawLinks:function(){
	        var g=this
	          , el = g.element
	          , p=g.options;

			el.addClass("sx-pager").empty();
			var interval = g.getInterval();
			var np = g.pageCount;
			// This helper function returns a handler function that calls pageSelected with the right page_id
			var getClickHandler = function(page_id) {
				return function(evt){ return g.pageSelected(page_id,evt); }
			}
			// Helper function for generating a single link (or a span tag if it's the current page)
			var appendItem = function(page_id, appendopts){
				page_id = page_id<0?0:(page_id<np?page_id:np-1); // Normalize page id to sane value
				appendopts = $.extend({text:page_id+1, classes:""}, appendopts||{});
				if(page_id == g.curPage){
					var lnk = $("<span class='btn-active'>"+(appendopts.text)+"</span>");
				}
				else{
					var lnk = $("<a class='btn'>"+(appendopts.text)+"</a>")
						.bind("click", getClickHandler(page_id))
						.attr('href', p.link_to.replace(/__id__/,page_id));			
				}
				if(appendopts.classes){lnk.addClass(appendopts.classes);}
				el.append(lnk);
			}
			// 创建上一页按钮
			if(p.prev_text && (g.curPage > 0 || p.prev_show_always)){
				appendItem(g.curPage-1,{text:p.prev_text, classes:"btn-prev "+p.prevClass});
			}
		    // 创建开始的点
			if (interval[0] > 0 && p.num_edge_entries > 0){
				var end = Math.min(p.num_edge_entries, interval[0]);
				for(var i=0; i<end; i++) {
					appendItem(i);
				}
				if(p.num_edge_entries < interval[0] && p.ellipse_text)
				{
					$("<span>"+p.ellipse_text+"</span>").appendTo(el);
				}
			}
			// Generate interval links
			// 创建interval链接节点
			for(var i=interval[0]; i<interval[1]; i++) {
				appendItem(i);
			}
			// 创建结束的点
			if (interval[1] < np && p.num_edge_entries > 0){
				if(np-p.num_edge_entries > interval[1]&& p.ellipse_text){
					$("<span>"+p.ellipse_text+"</span>").appendTo(panel);
				}
				var begin = Math.max(np-p.num_edge_entries, interval[1]);
				for(var i=begin; i<np; i++) {
					appendItem(i);
				}
				
			}
			// 创建下一页按钮
			if(p.next_text && (g.curPage < np-1 || p.next_show_always)){
				appendItem(g.curPage+1,{text:p.next_text, classes:"btn-next "+p.nextClass});
			}
        },
		/** 
		* 初始化表格
		*/
		_initTable : function () {
			var g=this
			, el = g.element
			, p=this.options;
			if(!!p.target){
				var trs=$(p.target).find(p.selector);
				for(var i=0,len=g.count;i<len;i++){
					if(i<g.perPage){
						trs.eq(i).show();
					}else{
					    trs.eq(i).hide();
					} 
				}
			}else{ 
				return;
			}
        },
		/** 
		* 表格分页(显示第value页的数据)
		* @property {Number} value 
		*/
		doPager : function (value) {
			var g=this
			  , el = g.element
			  , p=this.options;

			if(!!p.target){
				var trs=$(p.target).find(p.selector);
				for(var i=0,len=g.count;i<len;i++){
					if(i<g.perPage*(value+1) && i>=g.perPage*value ) {
						trs.eq(i).show();
					}else{
						trs.eq(i).hide();
					} 
				}
			}else{ 
			    return;
			}
		},
		/** 
		* 选择指定页
		* @param {int} page 新页码
		*/ 
        selectPage: function (page) {
			var g=this
			  , el = g.element
			  , p=g.options;
			g.pageSelected(page);
        },
		/** 
		* 上一页
		*/ 
        prevPage: function () {
			var g=this
			  , el = g.element
			  , p=g.options;
			if (g.curPage > 0) {
				g.pageSelected(g.curPage - 1);
				return true;
			}else {
				return false;
			}
        },
		/** 
		* 下一页
		*/ 
        nextPage : function(){ 
			var g=this
			  , el = g.element
			  , p=g.options;
			if(g.curPage < g.pageCount-1) {
				g.pageSelected(g.curPage+1);
				return true;
			}else {
				return false;
			}
		}
	}

	EasyPager.DEFAULT={
		/**
		 * 当前为第几页
		 * @param {Integer}  curPage 当前第几页
		 */
		curPage :0,
		/**
		 * 分页对象总条数
		 * @param {Integer}  count 分页对象总条数
		 */
		count: null,
		/**
		 * 每页显示多少条
		 * @param {Integer}  perPage 每页显示条数
		 */
		perPage:5,
		/**
		 * 要分页的(表格)对象
		 * @param {String}  分页对象
		 */
		target : null,
		/**
		 * 分页(表格)对象的items选择器
		 * @param {String}  selector 分页(表格)对象选择器
		 */
		selector: null,

		onSelect: $.noop,
		/**
		 * 分页插件显示的数字链接条数
		 * @param {Number}  displayEntriesNum 分页插件显示的数字链接条数
		 */    
		displayEntriesNum:10,

		num_edge_entries:0,
		link_to:"javascript:void(0);",
		prev_text:" ",
		next_text:" ",
		prevClass:"am-icon-arrow-left",
		nextClass:"am-icon-arrow-right",
		ellipse_text:"...",
		prev_show_always:true,
		next_show_always:true
	}

	//easypager plugin definition
	var old = $.fn.easypager;

	$.fn.easypager = function (option) {
		var opts = $.extend({},EasyPager.DEFAULT,option);
		return this.each(function () {
			var $this = $(this)
			var data  = $this.data('wp.easypager')
			if (!data) $this.data('wp.easypager', (data = new EasyPager(this,opts) ) )
			if (typeof option == 'string') data[option].call($this)
		})
	}

	$.fn.easypager.Constructor = EasyPager

	//easypager no conflict
	$.fn.easypager.noConflict = function () {
	    $.fn.easypager = old
		return this
	}
})(jQuery);



