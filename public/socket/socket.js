'use strict';

var app = angular.module('app');

app.factory('socket', function(socketFactory) {
  var socket = io.connect('https://protected-spire-4855.herokuapp.com');
  return socketFactory({ ioSocket: socket });
});
