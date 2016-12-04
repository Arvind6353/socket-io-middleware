 var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var html = require('escape-html');

var port = process.env.PORT || 3000;

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(port);
app.use( require('express').static(__dirname ));

io.on('connection', function(socket){


	socket.on('join:room', function(data){
		var room_name = data.room_name;
		msg.text = msg.user + ' has joined the room';
		socket.join(room_name);

		socket.broadcast.to(msg.room).emit('message', msg);
	});


	socket.on('leave:room', function(msg){
		msg.text = msg.user + ' has left the room';

		socket.leave(msg.room);
		socket.broadcast.to(msg.room).emit('message', msg);
	});


	socket.on('send:message', function(msg){

		console.log(msg);
		socket.broadcast.to(msg.room).emit('message', msg);
	});


});