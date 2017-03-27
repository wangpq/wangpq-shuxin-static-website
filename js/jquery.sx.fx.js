/***************************************
 * fx js用于部分二级页面的菜单滚动固定的一些细节处理
 **************************************/
$(function(){
	$(window).bind("load scroll",function(){ 
	  var nowTop = $(window).scrollTop();
	  var nav=$("#l-box nav");
	  if(nowTop>28) {
		nav.css("top","56px")
	  }else{
		nav.css("top","95px")
	  }
	}); 
})