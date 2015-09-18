// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var spawn   = require('child_process').spawn;
var fs = require('fs');
var _  = require("underscore")

console.log(spawn);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var numUsers = 0;
var sockets = {};
var socketList = [];


var imgs = fs.readdirSync(__dirname+"/public/gifs");

if(imgs.indexOf(".DS_Store") >= 0){
  var x = imgs.indexOf(".DS_Store");
  imgs.splice(x,1);
} 
console.log("Existing Gifs:");
console.log(imgs);
app.get('/capture', function(req, res) {
  // var command = spawn(__dirname + '/run.sh', [ req.query.color || '' ]);
  // console.log(__dirname + '/run.sh');
  var command = spawn(__dirname + '/run.sh');
  var output  = [];
  
  command.stdout.on('data', function(chunk) {
    
    output.push(chunk);
    console.log(Buffer.concat(output));
  }); 

  command.on('close', function(code) {
    if (code === 0){
      res.send(200);
      new_imgs = fs.readdirSync(__dirname+"/public/gifs");
      var diff = _.difference(new_imgs, imgs) ;
// Similar to without, but returns the values from array that are not present in the other arrays.
      // console.log();
      if(diff.indexOf(".DS_Store") >= 0){
        var x = diff.indexOf(".DS_Store");
          diff.splice(x,1);
      } 

      console.log(diff);
      if(diff.length === 1){
        imgs.unshift(diff[0])
      }
      else{
        //SM Notes: THIS SHOULD NEVER HAPPEN
        console.log(diff)  
      }
      
      updateImages();
    }
    else{
      res.send(500); // when the script fails, generate a Server Error HTTP response
    }
  });
});



io.on('connection', function (socket) {
  var addedUser = false;
console.log("New User!");
  socket.on('add user', function () {
    // socket.username = numUsers.toString();
    // sockets[numUsers.toString()] = socket;
    
    // console.log()
    socketList.push(socket);
    ++numUsers;
    addedUser = true;
    
    socket.emit('login', {
        numUsers: numUsers,
        username : (numUsers-1).toString()
    });
    socket.broadcast.emit('user joined', {
      numUsers: numUsers
    });
    updateImages(); 
  });

  socket.on('disconnect', function () {
    if (addedUser) {
      // delete sockets[socket.username];
      
      var idx = findWithAttr(socketList, "id", socket.id);
      var removed = socketList.splice(idx,1);
      
      --numUsers;
      // console.log("removed : " + removed);
      // console.log(removed);
      updateIds()
    }
  });
});


function updateIds(){

  for (var i = 0; i < socketList.length; i++) {
      console.log()
    socketList[i].emit('user left', {
        numUsers: numUsers,
        myID: i
      });
  };
}

function updateImages(){

  if(imgs.length <= socketList.length){
    for (var i = 0; i < imgs.length; i++) {
      socketList[i].emit('new image', {
          name: "gifs/"+imgs[i]
        });
      
    };

  }
  else if(imgs.length > socketList.length){
    for (var i = 0; i < socketList.length; i++) {
        console.log()
      socketList[i].emit('new image', {
          name: "gifs/"+imgs[i]
        });
    };
  }
}

function udpateImages(){
  imgs.pop();
  var rand = Math.random(1)*100;
  console.log(rand);
  var name  = parseInt(rand).toString() + ".jpg";
  imgs.unshift(name);
  console.log(imgs);

}

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}

// var sortedDates = dates.sort(function (var1, var2) { 
//    var a= new Date(var1), b = new Date(var2);
//     if (a > b)
//       return 1;
//     if (a < b)
//       return -1;
   
//     return 0;
// });
// setInterval(udpateImages,1500);

// function displaySocketIDs(){

//   if(Object.keys(sockets).length > 0){
//     var numImages = imgs.length;
//     var numClients = sockets.length;

//     for (var i = 0; i < numImages; i++) {
//       var idx = i.toString();
//       if(Object.keys(sockets).indexOf(idx) >= 0){
//         console.log('Client ' + idx + "exists");
//         // console.log('Client ' + imgs[i] + "exists");
//         sockets[idx].emit('new image',{
//           name:imgs[i]
//         })
//       }
//     };
//   }
// }
// setInterval(displaySocketIDs,1000);
