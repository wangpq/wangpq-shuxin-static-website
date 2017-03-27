/***************************************
 * home js file for home page
 * Released under the MIT license
 * http://www.ishuxin.cn/license
 * Author : Wangpq;
 * Date: 2015-04-21T11:00Z
 **************************************/
;(function($){
  $.fn.downloadsx = function(options){
    var opts = $.extend({
    }, options);
    this.each(function(){
      var self=$(this); 

    //如果是移动设备，则显示，否则，隐藏
    if($.browser.versions.mobile==false){
      //self.hide();
      //return;
    }

    var btnDownLoad=self.find(".btn-download");
    var btnClose=self.find(".btn-close");
    //删除按钮
    btnClose.on("click",function(){
       self.fadeOut("fast")
    })
    
    function a(v){
      return v==''? "javascript:void(0)": v ;
    }
    //立即下载按钮
    if($.browser.ios){
      var ios=btnDownLoad.attr("data-ios");
      btnDownLoad.attr("href",a(ios));
    }else if($.browser.android){
      var android=btnDownLoad.attr("data-android");
      btnDownLoad.attr("href",a(android));
    }else{
      var others=btnDownLoad.attr("data-others");
      btnDownLoad.attr("href",a(others));
    }

  });
};
})(jQuery);

jQuery(function(){

  // 应用头部headerFixed 文件
  $("header.am-topbar").headerFixed();

  $('#slider  .am-direction-nav a').html("");

  //处理数字格式
  $(".hot-show dl").each(function(index,dom){
  	var count=$(dom).find("strong");
  	count[0].innerHTML=$.format(count.text(), 3, ',');
  })

  
	//处理数字格式

        $(".hot-figrue table tbody tr").each(function(index,dom){
          var td=$(dom).find("td:nth-child(3)");
          var shu=FrilendUi.floatFormat( $.trim(td.text()) ) ;
          td.html(shu);
        })

    //判断是手机还是PC
  $.browser={
    versions:function(){
      var u = navigator.userAgent
        , app = navigator.appVersion;
      return {         //移动终端浏览器版本信息
          trident: u.indexOf('Trident') > -1, //IE内核
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
          iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf('iPad') > -1, //是否iPad
          webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
      };
   }(),
   language:(navigator.browserLanguage || navigator.language).toLowerCase()
  }

  //如果是手机，则焦点图左右箭头不显示
  if($.browser.versions.mobile==true){
     $("#slider .am-direction-nav").hide();
  }
  

  $("#dl-shuxin").downloadsx();

})

//特殊处理焦点图中第一张图在小屏幕(移动设备)显示不全的问题
$(window).on("load resize",function(){ 
  var slideItems=$("#slider .am-slides li");
  if($(window).width()<780){
    slideItems.each(function(index,dom){
       var link=$(dom).find("a");
       link.attr("style","background-image:url(./images/slider/"+link.attr("data-min-img")+")");
    })
  }else{
    slideItems.each(function(index,dom){
       var link=$(dom).find("a");
       link.attr("style","background-image:url(./images/slider/"+link.attr("data-big-img")+")");
    })
  }
})
