'use strict';

var express = require('express');
var router = express.Router();

const HEIGHT = 5;
const WIDTH = 10;
var gameboard = Array(HEIGHT).fill(Array(WIDTH).fill(0))

// rand # in interval [min, max)
var rand = (min, max) => min + Math.floor((max - min) * Math.random());

router.get('/', function(req, res) {
  User.findById(req.user)

  var player = {
    name: 'player1',
    location: [rand(0, HEIGHT), rand(0, WIDTH)]
  }

  var data = {
    gameboard: gameboard,
    player: player
  }

  res.send(data);
});





module.exports = router;
