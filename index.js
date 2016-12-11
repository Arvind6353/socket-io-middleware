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
	         android_vibration: 1,   // Android force-vibration for high-priority pushes, boolean
            android_led:"#ff0000",  // LED hex color, device will do its best approximation
            android_ibc:"#0ea7ed",  // Icon background color on Lollipop, #RRGGBB, #AARRGGBB, "red", "black", "yellow", etc.
 
			android_custom_icon:"data:image/jpeg;base64,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"
    };

client.sendMessage(msg, options,function(error, response) {
     if (error) {
        console.log('Some error occurs: ', error);
     }
 
     console.log('Pushwoosh API response is', response);
});
}

