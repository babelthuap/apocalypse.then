'use strict';

var PORT = process.env.PORT || 3000;

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();

var http = require('http');
var server = http.Server(app);

var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('connected');
  socket.emit('message', 'hello');
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
