'use strict';

var app = angular.module('app');

app.factory('socket', function(socketFactory) {
  var socket = io.connect('http://localhost:3000');
  return socketFactory({ ioSocket: socket });
});
