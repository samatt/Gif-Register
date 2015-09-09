$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize varibles
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var myID = 0;
  // var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  // var socket = io();

  var socket = io();
  socket.emit('add user', username);

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

// // Sets the client's username
// function setUsername () {
//   username = cleanInput($usernameInput.val().trim());

//   // If the username is valid
//   if (username) {
//     console.log(username);
//     // Tell the server your username
//     socket.emit('add user', username);
//   }
// }

// $window.keydown(function (event) {
//   // Auto-focus the current input when a key is typed
//   if (!(event.ctrlKey || event.metaKey || event.altKey)) {
//     $currentInput.focus();
//   }
//   // When the client hits ENTER on their keyboard
//   if (event.which === 13) {
//     if (username) {
//     } else {
//       setUsername();
//     }
//   }
// });