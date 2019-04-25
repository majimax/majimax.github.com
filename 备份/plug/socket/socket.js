//注册 socket事件

//数据初始化阶段
$plug.onExplain(function() {
	
	if(null==af.m.socket)return;
	if(null==af.m.socket[0].url)return;
	
	es.connect(af.m.socket[0].url,function(data){
		$plug.dispatch("socket", {type:"data",data:data});
	},function(peer){
		$plug.dispatch("socket", {type:"connect",peer:peer});
	});
});

$plug.onAction("socket", function(sceneName, evt) {
	if(evt.type=='data')
	{
		$plug.trigger(sceneName,"socket","data",evt.data);
	}
	else if(evt.type=='connect')
	{
		$plug.trigger(sceneName,"socket","connect",evt.peer);
	}
})