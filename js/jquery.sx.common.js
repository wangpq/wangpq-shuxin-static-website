/***************************************
 * common js file for all webapp's page
 * Released under the MIT license
 * http://www.ishuxin.cn/license
 * Author : Wangpq;
 * Date: 2015-04-21T11:00Z
 **************************************/

/**
 * headerFixed js file for home page header
 * 实现页面头部滚动后变小的效果
 */
!(function($){
    jQuery.fn.headerFixed=function(){
    	var self=$(this);
	    $(window).on("scroll",function(){
	        var scrollTop=$(window).scrollTop();
	        var header=self;
	        if(scrollTop>28){
	        	if(header.hasClass("am-topbar-fixed")){
	                 return;
	        	}else{
	                 header.addClass("am-topbar-fixed");
	        	}
	        }else{
	        	if(header.hasClass("am-topbar-fixed")){
	                header.removeClass("am-topbar-fixed");
	        	}else{
	                return;
	        	}	
	        }
	    })
    }
})(jQuery)


/**
 * 格式化数字
 */
;(function($) {
jQuery.extend({
	format : function(str, step, splitor) {
		str = str.toString();
		//str=str+''; 同样可以转换为字符串
		var len = str.length;
		if(len > step) {
			 var l1 = len%step,
				 l2 = parseInt(len/step),
				 arr = [],
				 first = str.substr(0, l1);
			 if(first != '') {
				 arr.push(first);
			 };
			 for(var i=0; i<l2 ; i++) {
				 arr.push(str.substr(l1 + i*step, step));                                   
			 };
			 str = arr.join(splitor);
		 };
		 return str;
	}
});
})(jQuery);


/**
 * 自动显示和隐藏跳转到顶部的工具栏
 */
/*
;(function($) {
	"use strict";
    $(function(){
	    var scrollBar=function(scrollTop){
	        if(scrollTop>768){
	        	$("#scroll-top-box").show();
	        }else{
	        	$("#scroll-top-box").hide();
	        }
	    }
	    var scrollTpl=
	    '<div class="amz-toolbar sx-toolbar-scroll" id="scroll-top-box">'+
	       '<a title="回到顶部" class="am-icon-btn am-icon-arrow-up am-active" id="amz-go-top"></a>'+
	    '</div>';
	    $("body").append(scrollTpl);

	    var scrollTop=$(window).scrollTop();
	    scrollBar(scrollTop);

		//跳转到顶部	
		$('#amz-go-top').on('click', function(e) {  
		   $("html,body").animate({scrollTop: $("html,body").offset().top}, {duration: 250,queue: false});
		   e.preventDefault();
		});	
	    $(window).on("scroll",function(){
	        var scrollTop=$(window).scrollTop();
	        var header=self;
	        scrollBar(scrollTop);
	    });

    })
})(jQuery);
*/

/**
 * 处理菜单的选中效果     
 */
;(function($) {
"use strict";
$(function(){
	var href=window.location.href;
    var arr=['index','creditenquiry','ambw','security','download'];
    for(var i=0,l=arr.length;i<l;i++){
    	if(href.indexOf(arr[i])>-1){ 
    		$("header .am-topbar-nav li").eq(i).addClass("current")
    		.siblings("li").removeClass("current");
    		return;
    	}
    }
})    
})(jQuery);



////////////////////////////////////
var FrilendUi={};
//格式化可能带有小数点的数字
FrilendUi.floatFormat=function(num){
  var shu=num;
  if(num.indexOf(".")>-1){
    var m=num.split(".")[0];
    var n=num.split(".")[1];
    shu=$.format(m, 3, ',')+'.'+n;
  }else{
    shu=$.format(num, 3, ',')
  }
  return shu;
}
