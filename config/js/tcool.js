/**
 * Created by livein80 on 2014/10/10.
 */
var App = {
    init:function(_app){
        var app = _app ? _app : App;
        for (var a in app) {
            if (app[a] && app[a].init) {
                app[a].init();
            }
        }
    }
}
$(document).ready(function () {
    App.init();
});

App.weixin = {curPos:0,
    init:function(){
        if (!$("body").hasClass("app")) {
            return;
        }
        var pages = $("#app-content .pages .page"),len = pages.length,wid = mheight = 0,h = false;
        
        //检查是否有leftrightPage标签
//      App.weixin.checkLeftRight();
        App.addQuestion();
        App.addPop();
        //new ShareTool();
        
		resizeHandle = function(){
            wid = $("#app-content").width();
            mheight = $(window).height();

            $("#app-content .pages").css({height:mheight});
//            pages.find("img.c").css({marginLeft: -(mheight / 2)});

            pages.css({"transition-delay":"0","transition-duration":"0",transform:"translate3d(0px,"+(-mheight * App.weixin.curPos)+"px,0px)"}).eq(App.weixin.curPos).addClass("start").siblings().removeClass("start");
            if (Math.abs(window.orientation) == 90) {
            } else {h = true;}
        }
        $(window).on("orientationchange",resizeHandle);
        $(window).on("resize",resizeHandle).resize();

//allowPageScroll: "vertical",
        $("#app-content .pages").swipe({triggerOnTouchEnd: true, swipeStatus:function(event, phase, direction, distance, duration,fingerCount){
            if(h==false){return;}
            event.preventDefault();
            if(phase == "end" ){
            	$(App).trigger(direction);
            }
        }})
		
		$(App).on("up down",function(e){
			
			switch(e.type){
				case "up":
					up();
					break;
				case "down":
					down();
					break;						
			}
		})
		
        function up(){
            if(App.weixin.curPos == len-1){return;}
            pages.eq(App.weixin.curPos).addClass("up");
            App.weixin.curPos = Math.min(App.weixin.curPos+1,len-1);
            App.weixin.moveItem(App.weixin.curPos);
        }
        function down(){
            if(App.weixin.curPos == 0){return;}
            pages.eq(App.weixin.curPos).addClass("down");
            App.weixin.curPos = Math.max(App.weixin.curPos-1,0);
            App.weixin.moveItem(App.weixin.curPos);
        }

        pages.eq(0).addClass("start");
    },
    moveItem:function(curId){
        $("#app-content .pages section.page").css({"-webkit-transition-delay": ".2s", "-webkit-transition-duration": ".7s",
            transform: "translate3d(0px," + (-mheight * curId) + "px,0px)"}).eq(curId).removeClass("up down start");

        var  tt = setTimeout(function () {
            $("#app-content .pages .page").eq(curId).addClass("start").trigger("current").siblings().removeClass("up down start").trigger("off");
        }, 700);

        App.weixin.curPos= curId;
    },
    
    //检查是否需要调用 checkLeftRight
    checkLeftRight:function() {
    	var leftRightPage = $("#app-content .pages .leftrightPage");
		if(leftRightPage.length>0){
			$(leftRightPage).each(function(index,elm){
				if($(elm).find(".page-screen").length>1){
					var lr = new LeftRightPage(elm);
//					console.log("lr.state");
				}
			});
		}
    },  
    checkShare:function(){
    	
    }
    
};
App.tools = {
    //获取设备信息
    getDeviceInfo:function(){

    }
}

var LeftRightPage = function(pages){
	var curpos = 0;
	var pageScreens = $(pages).find(".pageScreens");
	if(pageScreens .length<=0) return;
	var screenPage = $(pages).find(".page-screen"),len=screenPage.length;
//	console.log("len=",len)
	
	$(App).on("up down left right",function(e){
		switch(e.type){
			case "up":
			case "down":
				init();
				break;
			case "left":
				left();
				break;
			case "right":
				right();
				break;	
		}
	})
	
	function init(){
		if(curpos==0)return;
		curpos = 0;
		moveItem(curpos);
	}
	
	 function left(){
	 	//console.log('left',curpos);
	 	if(curpos==len-1)return;
	 	$(screenPage).eq(curpos).addClass("left");
	 	curpos = Math.min(len-1,curpos+1);
	 	moveItem(curpos);	
	 }
	 function right(){
	 	if(curpos ==0) return;
	 	$(screenPage).eq(curpos).addClass("right");
	 	curpos = Math.max(0,curpos-1);
	 	moveItem(curpos);
	 }
	 function moveItem(curId){
	 	var mwidth = $("#app-content").width();
//	 	console.log("mwidth ",mwidth );
        $(pageScreens).css({"-webkit-transition-delay": ".2s", "-webkit-transition-duration": ".5s",
            transform: "translate3d(" +(-mwidth * curId) + "px,"+"0px,0px)"}).eq(curId).removeClass("in left right");

        var  tt = setTimeout(function () {
            $(screenPage).eq(curId).addClass("in").siblings().removeClass("in left right");
        }, 700);

        curpos = curId;
    }
}

App.addQuestion = function(){
	var questions = $("#app-content .pages .pageScreens .icons");
	var list = [];
	var q;
	var answers = [3,2,3,1];
	var right = 0;
	$(questions).each(function(index,elm){
		q = new Question(elm);
		list .push(q);
	})
	$(App).on("up down  right",function(e){
//		if(e.type == "up" || e.type == "down" ){
//			resetQuestion();
//		}
		resetState();
	})
//	showFail();
	$("#buyBtn").on('click tap',function(e){
//		console.log('0');
		LinkClick('cn:curveduhdwap_20141111_371:buy','o');
		window.open("http://www.samsung.com/cn/consumer/tv-audio-video/televisions/curved-tv/UA65HU9800JXXZ","_blank");
	})
	$("#subbtn").on('click tap',function(e){
		right = 0;
		$(list).each(function(index,elm){
			if(elm.answer == answers[index]){
				right++;
			}
		})
		if(right==4){
			showSuccess();
		}else{
			showFail();
		}
		resetQuestion();
		LinkClick('cn:curveduhdwap_20141111_371:submit','o');
	})
	
	$("#resetbtn").on('click tap',function(e){
		LinkClick('cn:curveduhdwap_20141111_371:returnwrite','o');
		resetQuestion();
	})
	$("#p7_againBtn").on('click tap',function(e){
		LinkClick('cn:curveduhdwap_20141111_371:again','o');
		resetQuestion();
		resetState();
	})
	$("#p7_giveupBtn").on('click tap',function(e){
		LinkClick('cn:curveduhdwap_20141111_371:giveup','o');
		resetQuestion();
		resetState();
	})
	
	function resetQuestion(){	
		right = 0;
		$(list).each(function(index,elm){
			elm.reset();
		})
	}
	function resetState(){
		$("#app-content .pages .pop .p7_fail").removeClass("show");
		$("#app-content .pages .pop .p7_success").removeClass("show");
		$("#app-content .pages .pop").removeClass("popIn");
	}
	function showSuccess(){		
		$("#app-content .pages .pop .p7_fail").removeClass("show");
		$("#app-content .pages .pop .p7_success").addClass("show");
		$("#app-content .pages .pop").addClass("popIn");
	}
	function showFail(){
		$("#app-content .pages .pop .p7_success").removeClass("show");
		$("#app-content .pages .pop .p7_fail").addClass("show");
		$("#p7_rightInfo").text("您答对了"+right+"个问题，要不要再试一试？");
		$("#app-content .pages .pop").addClass("popIn");
	}
}
var Question = function(elm){
	this.answer = -1;
	var _this = this;
	var lis = $(elm).find('li');//$(".icons > li");//.children();
	console.log('lis ==',lis );

	$(lis).each(function(index,liitem){
		$(liitem).on("click",function(e){
			
			console.log("liitem== click tap",e.type);
			_this.answer = $(lis).index(this);
			$(lis).eq(_this.answer).addClass("in").siblings().removeClass("in");
		});
	})
	
	$(".ahref").on("click",function(e){
		 e.preventDefault();
	})
	this.reset = function(){
		this.answer = -1;
		$(lis).each(function(index,liitem){
			$(lis).removeClass("in");
		})
	}		
}

var Loader = function(){
    var loading= $("#loadingUI");
    //$(window).on("resize.load", resized).resize();

    function resized(){
        var _height = $(window).height()/2-$("#loading").width()/2;
        console.log(_height );
        $(loading).css({"top":_height });
    }
    var loader = new createjs.LoadQueue(false);

    loader.installPlugin(createjs.Sound);
    loader.addEventListener("fileload", onFileLoad);
    loader.addEventListener("progress", onProgress);
    loader.addEventListener("complete", onComplete);
    loader.loadManifest(Manifest);
    function fileload(e){

    }
    function onProgress(e){
        var progress = e.loaded * 100;
        console.log("progress ==",progress );
        //$('.loading-line').css({width: progress + "%", left: progress * .5 + "%"});
    }
    function onFileLoad(e){
        if (e.item.type == "image") { images[e.item.id] = e.result; }
    }

    function onComplete(e){
//        初始化页面
         $(window).off("resize.load", resized);
         $(loading).remove();        
        console.log("onComplete");
          App.init();
    }
}

//var loader = new Loader();

App.enableFlipPage= function(b){
    this.$isAbleFlipPage = b;
}

App.shareTool = {
	url : window.location.href,
    title:"",
    summry : "",
    descr :"",
    pic : "",
    share:function(){
	    var meta,metas = document.getElementsByTagName("meta");
	    $(metas).each(function(index,elm){
	    	if($(elm).attr("name")=="shareInfo"){
	    		meta = elm;
	    	}
	    })
	    if(!meta)return;
	    
	    this.url = window.location.href;
	    this.title =$(meta).attr("data-sharetitle");
	    this.summry = $(meta).attr("data-sharesummry");//"摘要"
	    this.descr = $(meta).attr("data-sharedescr");//描述
	    this.pic = $(meta).attr("data-sharepic");//分享的图片
	    
		
	    var _this = this;
	    function sharedPage(target){
	        if(target == 'qq'){
	            _this.qq();
	        }
	    }
	
	    function weibo(){
	        var toUrl = 'http://v.t.sina.com.cn/share/share.php?';
	        var p = {
	            url:_this.url,
	            title:_this.title,/*分享标题(可选)*/
	            source:''
	        };
	        for(var i in p){
	            var para = i + '=' + encodeURIComponent(p[i]||'') + '&';
	            toUrl += para;
	        }
	        window.location = toUrl;
	    }
	    //微信
	     function weixin(){
	        if(isWeixin()){
	            alert('请点击右上角按钮分享到朋友圈吧!');
	        }
	        else{
	            alert('请到微信浏览器下分享');
	        }
	    }
	
	    //朋友圈
	    function shareTimeline (){
	        WeixinJSBridge.invoke('shareTimeline',{
	            "img_url": _this.pic,
	            "img_width": "640",
	            "img_height": "960",
	            "link": _this.url,
	            "desc": _this.descr,
	            "title": _this.title
	        }, function(res) {
	            alert('分享成功');
	            //_report('timeline', res.err_msg);
	        });
	    }
	   //朋友
	    function shareFriend (){
	        WeixinJSBridge.invoke('sendAppMessage',{
	            "appid": '',
	            "img_url": _this.pic,
	            "img_width": "640",
	            "img_height": "960",
	            "link": _this.url,
	            "desc": _this.descr,
	            "title": _this.title
	        }, function(res) {
	            alert('分享成功');
	            //_report('timeline', res.err_msg);
	        });
	    }
	    //微博分享
	    function shareWeibo () {
	        WeixinJSBridge.invoke('shareWeibo',{
	            "content": _this.descr,
	            "url": _this.url
	        }, function(res) {
	            alert('分享成功');
	            //_report('weibo', res.err_msg);
	        });
	    }
	
	    function yingyongbao (){
	    }
	    //qq
	     function qq(){
	        var toUrl = 'http://connect.qq.com/widget/shareqq/index.html?';
	        var p = {
	            url:_this.url,
	            showcount:'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
	            desc:_this.descr,/*默认分享理由(可选)*/
	            summary:_this.summry,/*分享摘要(可选)*/
	            title:_this.title,/*分享标题(可选)*/
	            site:'',/*分享来源 如：腾讯网(可选)*/
	            pics:_this.pic, /*分享图片的路径(可选)*/
	            style:'201',
	            width:32,
	            height:32
	        };
	        for(var i in p){
	            var para = i + '=' + encodeURIComponent(p[i]||'') + '&';
	            toUrl += para;
	        }
	        window.location = toUrl;
	    }
	    //qq空间
	    function qqzone(){
	        var toUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
	        var p = {
	            url:_this.url,
	            showcount:'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
	            desc:_this.descr,/*默认分享理由(可选)*/
	            summary:_this.summry,/*分享摘要(可选)*/
	            title:_this.title,/*分享标题(可选)*/
	            site:'',/*分享来源 如：腾讯网(可选)*/
	            pics:_this.pic, /*分享图片的路径(可选)*/
	            style:'201',
	            width:32,
	            height:32
	        };
	        for(var i in p){
	            var para = i + '=' + encodeURIComponent(p[i]||'') + '&';
	            toUrl += para;
	        }
	        window.location = toUrl;
	    }
	
	    function isWeixin(){
	        var ua = window.navigator.userAgent.toLowerCase();
	        return ua.match(/MicroMessenger/i) == 'micromessenger';
	    }
    }
}



//++++++++++++++++++++++++微信 pop++++++++++++++++++++++++
var MaskLayer = function($parentDiv,$btn,$popDiv) {
    this.pop = $popDiv;
    this.isShow = false;  //_pop[0].classList.contains("m-show");

    var _this = this;
    var closeBtn = $popDiv;
//  var closeBtn = $('<a href="javascript:void(0);" class="m-weixinShareLayer-close"></a>');
//  $(this.pop).append(closeBtn);
    //关闭 按钮
    $(closeBtn).on("click tap",function(ev){
        _this.isShow = false;
        $($popDiv).removeClass("pop-show");
          setTimeout(function() {
            	$($popDiv).removeClass("m-show");
            },300);
      
   })

    $($btn).on("click tap",function(ev){
    	LinkClick('cn:curveduhdwap_20141111_371:share_wechat','o');
        ev.stopPropagation();
        ev.preventDefault();
        if(_this.isShow==false){
            _this.isShow = true;
            $($parentDiv).append($popDiv);
            $($popDiv).addClass("m-show");
            setTimeout(function() {
            	$($popDiv).addClass("pop-show");
            },100);
 			
        }else{
            _this.isShow = false;
        }
    });
}
App.addPop = function(){
    var _this = this;
    var pagelink = $("#app-content .pages .page-link");
  
    $(pagelink).each(function(index,elm){
        var _page = $(elm);
        var _btns = _page.find('.weixinshare');
        if(_btns.length>0){
            var _pop = _page.find(".m-weixinShareLayer");
            if(_pop.length==1){
                new MaskLayer(_page,_btns[0],_pop[0]);
            }else if(_pop.length>1 && _btns.length>1){
                $(_pop).each(function(index2,elm2){
                    new MaskLayer(_page,_btns[index2],_pop[index2]);
                });
            }else{

            }
        }
    });
}
//++++++++++++++++++++++++微信 pop++++++++++++++++++++++++

//++++++++++++++++++++++++级联图文++++++++++++++++++++++++
App.cascadingTeletext = function(){
//	this.
    var telePage = $(".page-teletext");
    if(telePage.length>0){
        var tele = $(telePage).find(".m-cascadingTeletext");
        if(tele.length>0){
            var teletext = new TeleText(tele);
            telePage.on("active",function(){
                $(tele).removeClass("z-viewArea").find("li.z-current").removeClass("z-current");
            }).on("current",function(){
                $(tele).addClass("z-viewArea");
                setTimeout(function(){$(tele).find("li:first").addClass("z-current");},2000);
            });
        }
    }
}
var TeleText = function(elm){
    var _this = this;
    var _target = $(elm);
    var _currentItem = $(_target).find("li").first().addClass("z-current");
    $(window).on("resize",function(){
        $(_target).css({height:window.innerHeight});
    }).trigger("resize");

    $(_target).find(".imgText").each(function(index,elm){
        if($.trim(elm.innerHTML).length<=0){
            $(elm).remove();
        }
    });

    var _win = $(window);
    (function(){
        _win.on("touchmove.elasticity",function(ev){
            ev.preventDefault();
        })
        _win.delegate("img", "mousemove", function (e) {
            e.preventDefault();
        });
        _win.on("dragstart",function(e){
            e.preventDefault();
        })
    })();

    var mc = new Hammer(_target[0]);
    mc.get("pan").set({direction:Hammer.DIRECTION_HORIZONTAL});
    var item;
    var islock = false;//是否上锁
    var isAniEnd = true;//是否已经完成了上一次为完成的动画;
    mc.on("panstart pan panend",function(ev){
            if(ev.type == "panstart" && isAniEnd && islock==false){
                islock = true;
                isAniEnd = false;
                item = $(_target).find("li").first();
            }else if(ev.type == "pan"){
                if(islock) {
                    if (item.length > 0) {
                        TweenMax.to($(item), .1, {x: ev.deltaX});
                    }
                }
            }else if(ev.type == "panend" ){
                if(islock){
                        if(Math.abs(ev.deltaX)>120){
                            if(ev.deltaX<0){
                                TweenMax.to($(item),.6,{x:-window.innerWidth,onComplete:function(){
                                    $(item).removeClass("z-current");
                                    $(_target).append(item);
                                    TweenMax.to($(item),.2,{x:0});
                                    $(_target).find("li").first().addClass("z-current");
                                    isAniEnd = true;
                                }});
                            }else{
                                TweenMax.to($(item),.6,{x:window.innerWidth,onComplete:function(){
                                    $(item).removeClass("z-current");
                                    $(_target).append(item);
                                    TweenMax.to($(item),.2,{x:0,ease:Quart.easeOut});
                                    $(_target).find("li").first().addClass("z-current");
                                    isAniEnd = true;
                                }});
                            }

                        }else{
                            TweenMax.to($(item),.4,{x:0,onComplete:function(){
                                isAniEnd = true;
                            }});
                        }
                    }
                islock = false;
            }

    })
}
//++++++++++++++++++++++++级联图文++++++++++++++++++++++++


//++++++++++++++++++++++++ 视频 ++++++++++++++++++++++++
var VideoLayer = function($parentDiv,$btn,$popDiv){
    this.pop = $popDiv;
    this.isShow = $popDiv.classList.contains("m-show");

    var _this = this;
    var closeBtn = $('<a href="javascript:void(0);" class="m-weixinShareLayer-close"></a>');
    var mvideo = $($popDiv).find(".m-video");
    var videoId = $(mvideo).attr("id");
    var videoConfig = $.parseJSON($(mvideo).attr("data-config"));

    var player;
    $(document).ready(function() {
        player = projekktor("#"+videoId, {
                poster: videoConfig.poster,
                title: videoConfig.title,
                playerFlashMP4: 'swf/StrobeMediaPlayback/StrobeMediaPlayback.swf',
                playerFlashMP3: 'swf/StrobeMediaPlayback/StrobeMediaPlayback.swf',
                width: videoConfig.width,
                height: videoConfig.height,
                playlist:videoConfig.playlist
            }, function(player) {} // on ready
        );
    });



    $(this.pop).append(closeBtn);
    //关闭 按钮
    $(closeBtn).on("click tap",function(ev){
        _this.isShow = false;
        $($popDiv).addClass("m-hide");
        $($popDiv).removeClass("m-show");
        if(player ){
            player.setStop();
        }
        TweenMax.to($popDiv,.5,{delay:.4,autoAlpha:0,display:'none',onComplete:function(){
            $(window).trigger("enableFlipPage",[true]);
        }});
    })

    $($btn).on("click tap",function(ev){
        if(_this.isShow==false){
            _this.isShow = true;
            $($parentDiv).append($popDiv);

            $(window).trigger("enableFlipPage",[false]);
            TweenMax.to($popDiv,.5,{autoAlpha:1,display:'block',onComplete:function(){
                $($popDiv).addClass("m-show");
                $($popDiv).removeClass("m-hide");
            }});
        }else{
            _this.isShow = false;
            TweenMax.to($popDiv,.5,{autoAlpha:0,display:'none'});
        }
    });
}
App.addVideo = function(){
    var  videopage = this.$pages.filter(".page-video");
    if(videopage.length>0){
        $(videopage).each(function(index,elm){
            var videoBtns = $(elm).find(".m-btnPlay");
            var mvideoLayers= $(elm).find(".m-videoLayer");
            if(videoBtns.length == 1){
                   if(mvideoLayers.length>0){
                         new VideoLayer(videopage,videoBtns[0],mvideoLayers[0]);
                   }
               }else{
                   videoBtns.each(function(index,elm){
                        if(mvideoLayers[index] != undefined){
                            new VideoLayer(videopage,videoBtns[index],mvideoLayers[index]);
                        }
                   });
               }
        });
    }

}
//++++++++++++++++++++++++ 视频 ++++++++++++++++++++++++



//var app = new App($("body"));
//app.enableFlipPage(true);
//app.addPop();
//app.addVideo();
//app.cascadingTeletext();



























