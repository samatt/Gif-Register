// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var numUsers = 0;
var sockets = {};


var imgs = ['a','b','c','d'];

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('add user', function (username) {
    socket.username = username;
    sockets[username] = socket;
    ++numUsers;
    addedUser = true;
  });

  socket.on('disconnect', function () {
    if (addedUser) {
      delete sockets[socket.username];
      --numUsers;
      console.log()
    }
  });
});

function displaySocketIDs(){

  if(Object.keys(sockets).length > 0){
    var numImages = imgs.length;
    var numClients = sockets.length;

    for (var i = 0; i < numImages; i++) {
      // console.log(Object.keys(sockets),i.toString());
      // console.log(Object.keys(sockets).indexOf(i.toString()) )
      var idx = i.toString();
      if(Object.keys(sockets).indexOf(idx) >= 0){

        console.log('Client ' + idx + "exists");
        sockets[idx].emit('new image',{
          name: "image_"+sockets[idx].username
        })
      }
    };
  }
}
setInterval(displaySocketIDs,1000);

  // socket.emit('login', {
  //   numUsers: numUsers,
  //   username : username
  // });

  // echo globally (all clients) that a person has connected
  // socket.broadcast.emit('user joined', {
  //   username: socket.username,
  //   numUsers: numUsers
  // });

  // echo globally that this client has left
  // socket.broadcast.emit('user left', {
  //   username: socket.username,
  //   numUsers: numUsers
  // });