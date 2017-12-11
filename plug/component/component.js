$plug.onExplain(function() {
	for (var i in af.m.scene) {
		var scene = af.m.scene[i];
		for (var j in scene.component) {
			var component = scene.component[j];
			switch (component.type) {
				case 'input':
					{
						//
						var $input = $("<input id='" + scene.name + "_" + component.name + "' type='text' style='z-index: 9999;position: absolute;border:1px;color:#e35654;height:30px;bord' value='Enter your email' />");
						$("body").append($input);

						var content = new createjs.DOMElement(scene.name + "_" + component.name);
						content.name = component.name;
						scene.element.addChild(content);
						scene.element[content.name] = content;
						break;
					}
			}
		}
	}
})

$plug.onUpdateView(function() {

	for (var i in af.m.scene) {
		var scene = af.m.scene[i];
		var elem = scene.element;

		for (var arg in scene.component) {
			var componentItem = scene.component[arg];
			var display = elem[componentItem.name];

			var realyWidth = display.htmlElement.clientWidth;
			var realyHeight = display.htmlElement.clientHeight;
			
			//比例尺
			var compar=af.screenWidth/af.canvasWidth;
						
			if (componentItem.left) display.x = parseInt(componentItem.left)*compar;
			else if (componentItem.center) display.x = ((af.canvasWidth - realyWidth) * 0.5 + parseInt(componentItem.center))*compar;
			else if (componentItem.right) display.x = (af.canvasWidth - realyWidth - parseInt(componentItem.right))*compar;
			if (componentItem.top) display.y = parseInt(componentItem.top)*compar;
			else if (componentItem.middle) display.y = ((af.canvasHeight - realyHeight) * 0.5 + parseInt(componentItem.middle))*compar;
			else if (componentItem.bottom) display.y = (af.canvasHeight - realyHeight - parseInt(componentItem.bottom))*compar;
			
			display.scaleX=display.scaleY=af.screenWidth/af.canvasWidth;
		}
	}
})