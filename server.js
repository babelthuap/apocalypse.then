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
  zombie: false
};

var HEIGHT = 5;
var WIDTH = 10;
var gameboard = [];

// generate fresh gameboard
for (var row = 0; row < HEIGHT; row++) {
  var newRow = []
  for (var col = 0; col < WIDTH; col++) {
    newRow.push( JSON.parse(JSON.stringify(cell)) );
  }
  gameboard.push(newRow);
}

io.on('connection', function(socket){
  console.log('connected');
  socket.on('keypress', data => console.log(data));
  socket.on('userlogin', id => {
    console.log('userlogin:', id);
    User.findById(id, (err, user) => {
      if (err) return;

      var name = user.displayName;
      var loc = [rand(0, HEIGHT), rand(0, WIDTH)]; // random location
      gameboard[loc[0]][loc[1]].player = name;

      socket.emit('startUser', {
        name: name,
        loc: loc,
        height: HEIGHT,
        width: WIDTH
      }); // respond to user
      io.emit('boardUpdate', gameboard); // broadcast to all
    })
  });
  socket.on('changeLoc', data => {
    console.log('changeLoc data:', data);
    // clear old pos
    var oldY = data.oldLoc[0];
    var oldX = data.oldLoc[1];
    gameboard[oldY][oldX].player = null;
    // update new pos
    var newY = data.newLoc[0];
    var newX = data.newLoc[1];
    gameboard[newY][newX].player = data.name;
    // respond to user
    // socket.emit('yourNewLoc', [newY, newX]);
    // broadcast updated gameboard to all
    io.emit('boardUpdate', gameboard);
  });


})




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
