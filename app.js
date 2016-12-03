var io = require('socket.io')(process.env.PORT);

io.on('connection', function(socket){

	socket.on('join:room', function(data){
		var room_name = data.room_name;
		msg.text = msg.user + ' has joined the room';
		socket.join(room_name);

		socket.in(msg.room).emit('message', msg);
	});


	socket.on('leave:room', function(msg){
		msg.text = msg.user + ' has left the room';

		socket.leave(msg.room);
		socket.in(msg.room).emit('message', msg);
	});


	socket.on('send:message', function(msg){

		console.log(msg);
		socket.broadcast.emit('message', msg);
	});


});