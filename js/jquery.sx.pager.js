/***************************************
 * pager 是一个简易的移动端分页插件
 * Released under the MIT license
 * http://www.ishuxin.cn/license
 * Author : Wangpq;
 * Date: 2015-05-19T12:00Z
 **************************************/
;(function($){

  "use strict";

  var WpPager   = function (el,options) {
      this.element=$(el);
      this.options=options;
      
      this._initOptions();
      this._initEvents();
  }
  WpPager.prototype={
      /** 
       * 初始化参数
       */
      _initOptions : function () {
        var g=this
          , el = g.element
          , p=g.options;

        p.onBeforeInitPager.call(g,null,{
          g : g,
          element : el
        })

        g.target=$(p.target);
        g.items= g.target.find(p.selector);
        g.curPage=1;
        g.count= !!p.target ? g.items.length :  p.count;
        g.perPage=p.perPage;

        g.pageCount=Math.ceil(g.count/g.perPage);

        var pagerTpl=
          '<a href="javascript:void(0);" class="sx-pagination-prev '+p.btnPrevClass+'"></a>'+
          '<select class="am-pagination-select"></select>'+
          '<a href="javascript:void(0);" class="sx-pagination-next '+p.btnNextClass+'"></a>';
        el.addClass("sx-pagination").html(pagerTpl);

        g.select=g.element.find("select");
        g.btnPrev=g.element.find(".sx-pagination-prev");
        g.btnNext=g.element.find(".sx-pagination-next");  

        var optStr='';
        for(var i=1,len=g.pageCount;i<=len;i++) {
           optStr+='<option value="'+i+'" class="">'+i+'&nbsp;&nbsp;/&nbsp;&nbsp;'+len+'</option>';
        }
        g.select.html(optStr);

        g._initTable();

      },
      /** 
       * 初始化事件
       */
      _initEvents : function () {
        var g=this
          , el = g.element
          , p=g.options;

        //控件初始化完成后，先自动根据当前页码分页
        g.doPager(g.curPage);
        p.onSelect.call(g,null,{
          g : g,
          element : el,
          curPage : g.curPage, 
          options : p
        })

        g.btnPrev.off(".pager");
        //上一页
        g.btnPrev.on("click.pager",function(e){ 
          if(g.curPage<=1) return;
          --g.curPage;
          p.onSelect.call(g,null,{
            g : g,
            element : el,
            curPage : g.curPage, 
            options : p
          })
          g.doPager(g.curPage);
          e.preventDefault();
        })
        //下一页
        g.btnNext.on("click.pager",function(e){  
          if(g.curPage>=g.pageCount) return;
          ++g.curPage;
          p.onSelect.call(g,null,{
            g : g,
            element : el,
            curPage : g.curPage, 
            options : p
          })
          g.doPager(g.curPage);
          e.preventDefault();
        })
        //select change 事件
        g.select.on("change.pager",function(e){
          g.curPage=this.value;
          g.doPager(g.curPage);
          p.onSelect.call(g,null,{
            g : g,
            element : el,
            curPage : g.curPage, 
            options : p
          })
          e.preventDefault();
        })
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

        if(g.curPage<=1){
          g.curPage=1;
          g.btnPrev.addClass("sx-btn-disabled")
        }
        if(g.curPage>=g.pageCount){
          g.curPage=g.pageCount;
          g.btnNext.addClass("sx-btn-disabled")
        }
        if(value>1 && value< g.pageCount){
            g.btnNext.removeClass("sx-btn-disabled");
            g.btnPrev.removeClass("sx-btn-disabled");
        }

        if(!!p.target){
          var trs=$(p.target).find(p.selector);
          for(var i=0,len=g.count;i<len;i++){
            if(i<g.perPage*value && i>=g.perPage*(value-1) ) {
              trs.eq(i).show();
            }else{
              trs.eq(i).hide();
            } 
          }
          g.changeSelectText(g.curPage);
        }else{ 
          return;
        }
      },
      //
      changeSelectText : function (v) {
        var g=this
          , el = g.element
          , p=this.options;
        g.select.find("option").eq(v-1)[0].selected=true;  
      }

   }


  WpPager.DEFAULT={
    /**
     * 当前为第几页(从1开始计数)
     * @param {Integer}  curPage 当前第几页
     */
    curPage :1,
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
    btnPrevClass:"am-icon-arrow-left",
    btnNextClass:"am-icon-arrow-right", 
    onBeforeInitPager : $.noop,
    onSelect: $.noop
  }

  //pager plugin definition
  var old = $.fn.pager

  $.fn.pager = function (option) {
    var opts = $.extend({},WpPager.DEFAULT,option);
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('wp.pager')
      if (!data) $this.data('wp.pager', (data = new WpPager(this,opts) ) )
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.pager.Constructor = WpPager

  //pager no conflict
  $.fn.pager.noConflict = function () {
    $.fn.pager = old
    return this
  }
})(jQuery);



