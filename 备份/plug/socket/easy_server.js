var es = (function(io) {
	var socket;

	var connect = function(url, dataHandler, connectHandler,errorHandler,reconnect,reconnectHandler) {
		if(reconnect)
		{
			socket = io.connect(url,{reconnection:true});
		}
		else
		{
			socket = io.connect(url);
		}

		socket.on('connect', function() {
			console.log("connect");
			socket.emit('adduser');
		});

		socket.on('connectHandler', function() {
			connectHandler(socket.id);
		});
		
		socket.on('data', function(data) {
			dataHandler(JSON.parse(data));
		});
		
		socket.on('error',function(data){
			console.log("error");
			if(errorHandler)errorHandler();
		})
		
		socket.on("reconnect",function(){
			console.log("reconnect");
			if(reconnectHandler)reconnectHandler();
		})
	}
	
	var socket=function()
	{
		return socket;
	}

	var switchRoom = function(room) {
		socket.emit('switchRoom', room);
	}

	var sendData = function(data) {
		socket.emit('sendData', JSON.stringify(data));
	}
	
	var queuing=function(peer,gamename,members){
		socket.emit('queuing',[peer,gamename,members]);
	}
	
	var disconnect=function(){
		socket.disconnect();
	}

	return {
		socket:socket,
		connect: connect,
		switchRoom: switchRoom,
		sendData: sendData,
		disconnect:disconnect,
		queuing:queuing
	};

})(io)