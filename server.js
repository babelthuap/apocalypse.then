'use strict';

var PORT = process.env.PORT || 3000;

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();

var http = require('http');
var server = http.Server(app);

var io = require('socket.io')(server);

var User = require('./models/user');

// rand # in interval [min, max)
var rand = (min, max) => min + Math.floor((max - min) * Math.random());

var cell = {
  player: null,
  playerId: null,
  picture: null,
  zombie: null
};

var HEIGHT = 4;
var WIDTH = 7;
var gameboard = [];

// generate fresh gameboard
for (var row = 0; row < HEIGHT; row++) {
  var newRow = []
  for (var col = 0; col < WIDTH; col++) {
    newRow.push( JSON.parse(JSON.stringify(cell)) );
  }
  gameboard.push(newRow);
}

var clamp = (n, max) => n < 0 ? 0 : (n > max ? max : n);


function zombie() {
  // make a zombie
  var loc = [rand(0, HEIGHT), rand(0, WIDTH)]; // random location
  gameboard[loc[0]][loc[1]].zombie = true;

  setInterval(function() {
    var moves = [
      [loc[0], clamp(loc[1] + 1, WIDTH - 1)],
      [loc[0], clamp(loc[1] - 1, WIDTH - 1)],
      [clamp(loc[0] + 1, HEIGHT - 1), loc[1]],
      [clamp(loc[0] - 1, HEIGHT - 1), loc[1]]
    ];

    var newLoc = moves[rand(0, 4)]
    if (changeLoc(loc, newLoc, 'zombie')){
      loc = newLoc;
    }

  }, 500);
}

io.on('connection', function(socket){
  console.log('connected');
  socket.on('keypress', data => console.log(data));
  socket.on('userlogin', id => {
    console.log('userlogin:', id);
    User.findById(id, (err, user) => {
      if (err) return;

      // OH NO! A ZOMBIE!
      zombie();

      var name = user.displayName;
      var loc = [rand(0, HEIGHT), rand(0, WIDTH)]; // random location
      gameboard[loc[0]][loc[1]].player = name;
      gameboard[loc[0]][loc[1]].playerId = id;
      gameboard[loc[0]][loc[1]].picture = user.picture;


      socket.emit('startUser', {
        name: name,
        loc: loc,
        HEIGHT: HEIGHT,
        WIDTH: WIDTH
      }); // respond to user
      io.emit('boardUpdate', gameboard); // broadcast to all
    })
  });

  socket.on('changeLoc', data => {
    changeLoc(data.oldLoc, data.newLoc, 'player', data.name, data.id);
  });

  socket.on('logout', loc => {
    console.log('loc:', loc);
    if (!loc) return;
    gameboard[loc[0]][loc[1]].player = null;
    io.emit('boardUpdate', gameboard);
  });

})

// asset = 'player' or 'zombie'
function changeLoc(oldLoc, newLoc, asset, name, id) {
  if (asset === 'player') {
    var oldY = oldLoc[0];
    var oldX = oldLoc[1];
    gameboard[oldY][oldX][asset] = null;
    gameboard[oldY][oldX].playerId = null;
    var picture = gameboard[oldY][oldX].picture
    gameboard[oldY][oldX].picture = null;


    var newY = newLoc[0];
    var newX = newLoc[1];

    if (gameboard[newY][newX].zombie) {
      killPlayer(id);
      gameboard[newY][newX].picture = null;
    } else {
      gameboard[newY][newX][asset] = name;
      gameboard[newY][newX].playerId = id;
      gameboard[newY][newX].picture = picture
    }

  } else if (asset === 'zombie') {
    // clear old pos
    var oldY = oldLoc[0];
    var oldX = oldLoc[1];
    // update new pos
    var newY = newLoc[0];
    var newX = newLoc[1];

    if (gameboard[newY][newX].zombie){
      return false;
    }
    gameboard[oldY][oldX][asset] = null;

    if (gameboard[newY][newX].player) {
      killPlayer(gameboard[newY][newX].playerId);
      gameboard[newY][newX].player = null;
      gameboard[newY][newX].playerId = null;
      gameboard[newY][newX].picture = null;
    }

    gameboard[newY][newX].zombie = true;
  }

  // broadcast updated gameboard to all
  io.emit('boardUpdate', gameboard);
  return true;
}


function killPlayer(id) {
  console.log(id);
  io.emit('playerDeath', id);
}




var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/apocalypse');

app.set('view engine', 'ejs');

// GENERAL MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());
app.use(express.static('public'));

// ROUTES
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/game', require('./routes/game'));

// 404 HANDLER
app.use(function(req, res){
  res.status(404).render('404')
})

server.listen(PORT, function(){
  console.log('Listening on port ', PORT);
});
