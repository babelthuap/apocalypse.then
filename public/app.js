'use strict';

var app = angular.module('app', ['satellizer', 'ui.router', 'btford.socket-io']);

app.config(function($stateProvider, $urlRouterProvider, $authProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home/home.html',
      controller: 'homeCtrl'
    })
    .state('game', {
      url: '/game/:id',
      templateUrl: 'game/game.html',
      controller: 'gameCtrl'
    })

  $authProvider.google({
    clientId: '403356814232-l0l5edtnt2uamllctq4eeuflrr4t395d.apps.googleusercontent.com'
  });
});
