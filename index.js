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


var imgs = ['001.png','002.png','003.png','004.png'];

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('add user', function () {
    socket.username = numUsers.toString();
    sockets[numUsers.toString()] = socket;
    ++numUsers;
    addedUser = true;
    
    socket.emit('login', {
        numUsers: numUsers,
        username : numUsers.toString()
    });
    socket.broadcast.emit('user joined', {
      numUsers: numUsers
    });

  });

  socket.on('disconnect', function () {
    if (addedUser) {
      delete sockets[socket.username];
      --numUsers;
      socket.broadcast.emit('user left', {
        numUsers: numUsers
      });
    }
  });
});

function displaySocketIDs(){

  if(Object.keys(sockets).length > 0){
    var numImages = imgs.length;
    var numClients = sockets.length;

    for (var i = 0; i < numImages; i++) {
      var idx = i.toString();
      if(Object.keys(sockets).indexOf(idx) >= 0){
        console.log('Client ' + idx + "exists");
        // console.log('Client ' + imgs[i] + "exists");
        sockets[idx].emit('new image',{
          name:imgs[i]
        })
      }
    };
  }
}
setInterval(displaySocketIDs,1000);

function udpateImages(){
  imgs.pop();
  var rand = Math.random(1)*100;
  console.log(rand);
  var name  = parseInt(rand).toString() + ".jpg";
  imgs.unshift(name);
  console.log(imgs);

}
// setInterval(udpateImages,1500);