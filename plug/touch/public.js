/*

在action中的侦听方法：
<action type='touch' swipe='swipeHandler'>

</action>

针对swipe交互类型，提供了四种侦听：

<action type='swipe_left'></action>
<action type='swipe_right'></action>
<action type='swipe_top'></action>
<action type='swipe_bottom'></action>

*/

module.name = "touch";

module.author = 'zhangpeng';

module.description = "这是一个支持手势划动的插件";

module.depends = ["hammer.js"];

module.exports = "touch.js";
