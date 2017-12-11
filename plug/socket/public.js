/*
在body标签内，声明socket连接地址
<socket src='http://socket的通讯地址'></socket>

在action中的侦听方法：
<action type='socket' data='dataHandler' connect='connectHandler' error='errorHandler'>

</action>

*/



module.name = "socket";

module.author='zhangpeng';

module.description="这是一个支持socket的插件";

module.depends = ["socket.io-1.3.5.js","easy_server.js"];

module.exports = "socket.js";
