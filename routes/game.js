'use strict';

var express = require('express');
var router = express.Router();

const HEIGHT = 5;
const WIDTH = 10;
var gameboard = Array(HEIGHT).fill(Array(WIDTH).fill(0))

var player = {
  name: 'player1',
  location: [1, 2]
}

var data = {
  gameboard: gameboard,
  player: player
}

router.get('/', function(req, res) {
  res.send(data);
});



module.exports = router;
