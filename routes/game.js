'use strict';

var express = require('express');
var router = express.Router();

const HEIGHT = 5;
const WIDTH = 10;
var gameboard = Array(HEIGHT).fill(Array(WIDTH).fill(0))

router.get('/', function(req, res) {
  res.send(gameboard);
});

module.exports = router;
