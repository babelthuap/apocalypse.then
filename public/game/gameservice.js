'use strict';

var app = angular.module('app');

app.service('GameService', function($http){
  this.getBoardState = () => $http.get('/game');
})
