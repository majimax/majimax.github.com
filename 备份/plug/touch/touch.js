//注册 touch事件

var swipe_list;
var swipe_effect;
var swipe_index;
var swipe_able=true;
var ease_type;

//数据初始化阶段
$plug.onExplain(function() {
	
	if(null!=af.m.swipe)
	{
		var swipe=af.m.swipe[0];
		af.asDefault(swipe,'effect','default');
		af.asDefault(swipe,'ease','linear');
		swipe_effect=swipe.effect;
		ease_type=getEaseType(swipe.ease);
		
		if(null!=swipe.scene&&swipe.scene.length>0)
		{
			var scenes=swipe.scene;
			swipe_list=[];
			swipe_index=0;
			for(var i in scenes)
			{
				var scene=scenes[i];
				swipe_list.push(scene.name);
			}
		}
	}
	
	
	createjs.Touch.enable(af.stage);
	var panel = document.querySelector("#panels");
	var hammer = new Hammer.Manager(panel);
	hammer.add(new Hammer.Pan());
	hammer.add(new Hammer.Swipe({
		velocity: 0.1
	})).recognizeWith(hammer.get('pan'));
	hammer.add(new Hammer.Tap());
	hammer.on("swipe", function(ev) {
		//只向可视化的scene传递swipe事件
		$plug.dispatch("touch", {
			direction: ev.direction
		});
		//
		switch (ev.direction) {
			case 2:
				{
					$plug.dispatch("swipe_left", null);
					break;
				}
			case 4:
				{
					$plug.dispatch("swipe_right", null);
					break;
				}
			case 8:
				{
					turnNext();
					$plug.dispatch("swipe_top", null);
					break;
				}
			case 16:
				{
					turnPrev();
					$plug.dispatch("swipe_bottom", null);
					break;
				}
		}
	});
});

function getEaseType(value)
{
	var Ease = createjs.Ease; // shortcut.
	var dataProvider = [
			{type: Ease.backIn, label: "backIn"},
			{type: Ease.backInOut, label: "backInOut"},
			{type: Ease.backOut, label: "backOut"},
			{type: Ease.bounceIn, label: "bounceIn"},
			{type: Ease.bounceInOut, label: "bounceInOut"},
			{type: Ease.bounceOut, label: "bounceOut"},
			{type: Ease.circIn, label: "circIn"},
			{type: Ease.circInOut, label: "circInOut"},
			{type: Ease.circOut, label: "circOut"},
			{type: Ease.cubicIn, label: "cubicIn"},
			{type: Ease.cubicInOut, label: "cubicInOut"},
			{type: Ease.cubicOut, label: "cubicOut"},
			{type: Ease.elasticIn, label: "elasticIn"},
			{type: Ease.elasticInOut, label: "elasticInOut"},
			{type: Ease.elasticOut, label: "elasticOut"},
			{type: Ease.linear, label: "linear"},
			{type: Ease.quadIn, label: "quadIn"},
			{type: Ease.quadInOut, label: "quadInOut"},
			{type: Ease.quadOut, label: "quadOut"},
			{type: Ease.quartIn, label: "quartIn"},
			{type: Ease.quartInOut, label: "quartInOut"},
			{type: Ease.quartOut, label: "quartOut"},
			{type: Ease.quintIn, label: "quintIn"},
			{type: Ease.quintInOut, label: "quintInOut"},
			{type: Ease.quintOut, label: "quintOut"},
			{type: Ease.sineIn, label: "sineIn"},
			{type: Ease.sineInOut, label: "sineInOut"},
			{type: Ease.sineOut, label: "sineOut"}];
	
	for(var i in dataProvider)
	{
		if(dataProvider[i].label==value)
			return dataProvider[i].type;
	}
	return Ease.linear;
}

function turnPrev(){
	if(af.ismode())return;
	if(swipe_able==false)return;
	if(null==swipe_list)return;
	if(swipe_index<=0)return;
	swipe_able=false;
	swipe_index--;
	
	var lastScene=swipe_list[swipe_index+1];
	var currentScene=swipe_list[swipe_index];
	//平移，扫描
	//translation,scanning
	if(swipe_effect=='default')
	{
		af.hideScene(lastScene,true);
		af.showScene(currentScene,true);
		swipe_able=true;
	}
	else if(swipe_effect=='translation')
	{
		af.showScene(currentScene,false,"before");
		
		var currentDisplay=af.s(currentScene).element;
		currentDisplay.x=0;
		currentDisplay.y=-af.canvas.height;
		
		var lastDisplay=af.s(lastScene).element;
		
		afAction.dispatchOn(lastScene, "hide");
		
		createjs.Tween.get(lastDisplay)
			.to({y:af.canvas.height},1000,ease_type);
		
		createjs.Tween.get(currentDisplay)
			.to({y:0},1000,ease_type)
			.call(function(){
				af.hideScene(lastScene);
				afAction.dispatchOn(currentScene, "show");
				swipe_able=true;
			});
	}
	else if(swipe_effect=='scanning')
	{
		af.showScene(currentScene);
		
		var _mask= new createjs.Shape();
		_mask.graphics.beginFill("#0000ff").drawRect(0, 0, af.canvas.width,af.canvas.height);
		_mask.visible = false;
		_mask.y=-af.canvas.height;
		af.stage.addChild(_mask);
		
		var currentDisplay=af.s(currentScene).element;
		currentDisplay.mask=_mask;
		
		createjs.Tween.get(_mask)
			.to({y:0},1000,ease_type)
			.call(function(){
				currentDisplay.mask=null;
				af.stage.removeChild(_mask);
				af.hideScene(lastScene);
				swipe_able=true;
			})
	}
}

function turnNext(){
	if(af.ismode())return;
	if(swipe_able==false)return;
	if(null==swipe_list)return;
	if(swipe_index>=(swipe_list.length-1))return;
	swipe_able=false;
	swipe_index++;
	
	var lastScene=swipe_list[swipe_index-1];
	var currentScene=swipe_list[swipe_index];
	
	if(swipe_effect=='default')
	{
		af.hideScene(lastScene,true);
		af.showScene(currentScene,true);
		swipe_able=true;
	}
	else if(swipe_effect=='translation')
	{
		af.showScene(currentScene);
		
		var currentDisplay=af.s(currentScene).element;
		currentDisplay.x=0;
		currentDisplay.y=af.canvas.height;
		
		var lastDisplay=af.s(lastScene).element;
		
		afAction.dispatchOn(lastScene, "hide");
		
		createjs.Tween.get(lastDisplay)
			.to({y:-af.canvas.height},1000,ease_type);
		
		createjs.Tween.get(currentDisplay)
			.to({y:0},1000,ease_type)
			.call(function(){
				af.hideScene(lastScene);
				afAction.dispatchOn(currentScene, "show");
				swipe_able=true;
			});
	}
	else if(swipe_effect=='scanning')
	{
		af.showScene(currentScene);
		
		var _mask= new createjs.Shape();
		_mask.graphics.beginFill("#0000ff").drawRect(0, 0, af.canvas.width,af.canvas.height);
		_mask.visible = false;
		_mask.y=af.canvas.height;
		af.stage.addChild(_mask);
		
		var currentDisplay=af.s(currentScene).element;
		currentDisplay.mask=_mask;
		
		createjs.Tween.get(_mask)
			.to({y:0},1000,ease_type)
			.call(function(){
				currentDisplay.mask=null;
				af.stage.removeChild(_mask);
				af.hideScene(lastScene);
				swipe_able=true;
			})
	}
}


$plug.onAction("touch", function(sceneName, evt) {
	$plug.trigger(sceneName,"touch","swipe",evt);
})

$plug.onAction("swipe_left", function(sceneName, evt) {

})

$plug.onAction("swipe_right", function(sceneName, evt) {

})

$plug.onAction("swipe_top", function(sceneName, evt) {

})

$plug.onAction("swipe_bottom", function(sceneName, evt) {

})