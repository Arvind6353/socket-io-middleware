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

var Pushwoosh = require('pushwoosh-client');
var client= new Pushwoosh("34DED-0A6A3", "HHWkLcbmh98JAg9Rhzk0AejcE2sZX73kLD2OPhnyppraOuIgXngdCNpyMB1pI56MT8NTpca9UivYLezWCQMn");
 

io.on('connection', function(socket){


	socket.on('join:room', function(msg){
		var room_name = msg.room;
		msg.text = msg.user + ' has joined the room';
		socket.join(room_name);
		console.log("joining rooom ---->" +msg.room)

		sendMsg(msg.text);

		socket.broadcast.to(msg.room).emit('message', msg);
	});


	socket.on('leave:room', function(msg){
		msg.text = msg.user + ' has left the room';

		socket.leave(msg.room);
		socket.broadcast.to(msg.room).emit('message', msg);
	});


	socket.on('send:message', function(msg){

		console.log("Sending msg to the room  "+msg.room+" ---->" +msg)
		
		sendMsg(msg.text);

		socket.broadcast.to(msg.room).emit('message', msg);
	});


});



function sendMsg(msg){
client.sendMessage(msg, function(error, response) {
     if (error) {
        console.log('Some error occurs: ', error);
     }
 
     console.log('Pushwoosh API response is', response);
});
}

