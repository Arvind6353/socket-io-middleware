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
		msg.text = ' has joined the room '+msg.room;
		socket.join(room_name);
		console.log("joining rooom ---->" +msg.room)

		//sendMsg(msg.text,msg.room);

		//socket.broadcast.to(msg.room).emit('message', msg);
	});


	socket.on('leave:room', function(msg){
		msg.text = ' has left the room ' +msg.room;

		socket.leave(msg.room);

		//sendMsg(msg.text,msg.room);

		socket.broadcast.to(msg.room).emit('message', msg);
	});


	socket.on('send:message', function(msg){

		console.log("Sending msg to the room  "+msg.room+" ---->" +msg)
		
		sendMsg(msg.text,msg);

		socket.broadcast.to(msg.room).emit('message', msg);
	});


});



function sendMsg(msg,da){

var  options = {
        data: {
           room:da.room,
           user:da.user

        },
	          
            android_led:"#00ff00",  // LED hex color, device will do its best approximation
            android_ibc:"#ff0000" // Icon background color on Lollipop, #RRGGBB, #AARRGGBB, "red", "black", "yellow", etc.
 

    };

client.sendMessage(msg, options,function(error, response) {
     if (error) {
        console.log('Some error occurs: ', error);
     }
 
     console.log('Pushwoosh API response is', response);
});
}

