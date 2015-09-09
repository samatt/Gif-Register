$(function() {

  var myID = 0;
  // var lastTypingTime;
  // var $currentInput = $usernameInput.focus();

  // var socket = io();

  var socket = io();
  socket.emit('add user');

  socket.on('login', function (data) {
    var message = "Welcome to the Gif Register you are client " + data.username + " of " +data.numUsers ;
    console.log('login');
    myID = data.username
    console.log(myID);
    $("#ID").empty();
    $("#ID").text(message);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
     var message = "User added to the Gif Register you are now client " + myID + " of " +data.numUsers ;
    console.log(myID);
    $("#ID").empty();
    $("#ID").text(message);
  });

  socket.on('new image', function (data) {
    $("#TEST").empty();
    $("#TEST").text(data.name);
    $("#my_img").attr("src", "imgs/"+data.name);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
     var message = "User removed from the Gif Register you are now client " + myID + " of " +data.numUsers ;
    console.log(data);
    $("#ID").empty();
    $("#ID").text(message);
  });


  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

});