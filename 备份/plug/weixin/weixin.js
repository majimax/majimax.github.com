//数据初始化阶段
$plug.onExplain(function() {

	if (null == af.m.weixin) return;
//	if(false==isWeiXin())return;
	
	var weixin = af.m.weixin[0];
	af.asDefault(weixin, 'title', 'AF引擎实例应用');
	af.asDefault(weixin, 'description', '基于html5的快速开发引擎AF');

	var baseURL = getRealPath();
	window.shareData = {
		'title': weixin.title,
		'description': weixin.description,
		'url': location.href,  
		'picURL': baseURL + '/share.jpg'
	};
	
    $.ajax({
        url: 'http://zafir2.sinaapp.com/weixin/getSign.php',
        type: "GET",
        dataType: 'jsonp',
        data: {url:location.href},
        success: function (json) {
            wx.config({
                debug: false,
                appId: json.appId,
                timestamp: json.timestamp,
                nonceStr: json.nonceStr,
                signature: json.signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ'
                ]
            });

        } });


	wx.ready(function() {
		wx.onMenuShareTimeline({
			title: window.shareData.title, // 分享标题
			link: window.shareData.url, // 分享链接
			imgUrl: window.shareData.picURL, // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
				setShareCount()
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		var desStr = '心花怒放吉羊到，华夏银行和您一起羊气过大年！ ' //''+u_name+'祝您新的一年工作"羊羊"得意，生活喜气"羊羊"，赚钱有模有"羊"，一起，羊气过大年'

		wx.onMenuShareAppMessage({
			title: window.shareData.title, // 分享标题
			desc: window.shareData.description, // 分享描述
			link: window.shareData.url, // 分享链接
			imgUrl: window.shareData.picURL, // 分享图标
			type: '', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function() {
				// 用户确认分享后执行的回调函数
				setShareCount()
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});

		wx.onMenuShareQQ({
			title: window.shareData.title, // 分享标题
			desc: window.shareData.description, // 分享描述
			link: window.shareData.url, // 分享链接
			imgUrl: window.shareData.picURL, // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
				setShareCount()
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
	});

})


function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}

function getRealPath() {
	/*//获取当前网址，如： http://localhost:8083/myproj/view/my.jsp
	var curWwwPath=window.document.location.href;
	//获取主机地址之后的目录，如： myproj/view/my.jsp
	var pathName=window.document.location.pathname;
	var pos=curWwwPath.indexOf(pathName);
	//获取主机地址，如： http://localhost:8083
	var localhostPaht=curWwwPath.substring(0,pos);
	//获取带"/"的项目名，如：/myproj
	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);

	//得到了 http://localhost:8083/myproj
	var realPath=localhostPaht+projectName;*/
	var curWwwPath = location.href;
	var temp = curWwwPath.split("/")
	temp.pop();
	temp = temp.join("/")

	return temp;
}