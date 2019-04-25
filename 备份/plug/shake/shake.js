//摇摆

$plug.onExplain(function() {

	var SHAKE_THRESHOLD = 2000;
	var last_update = 0;
	var x, y, z, last_x = 0,
		last_y = 0,
		last_z = 0;
	var time_control = 0;

	if (window.DeviceMotionEvent) window.addEventListener('devicemotion', deviceMotionHandler, false);

	function deviceMotionHandler(eventData) {
		var acceleration = eventData.accelerationIncludingGravity;
		var curTime = new Date().getTime();
		if ((curTime - last_update) > 10) {
			var diffTime = curTime - last_update;
			last_update = curTime;
			x = acceleration.x;
			y = acceleration.y;
			z = acceleration.z;
			var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

			if (speed > SHAKE_THRESHOLD) {

				var cur_time = new Date().getTime();
				if (cur_time - time_control > 1000) {
					time_control = cur_time;
					$plug.dispatch("shake", null);
				}
			}
			last_x = x;
			last_y = y;
			last_z = z;
		}
	}

});



$plug.onAction("shake",function(sceneName,evt){
	$plug.trigger(sceneName,"shake","shake",evt);
})