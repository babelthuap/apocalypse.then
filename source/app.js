'use strict';

var app = angular.module('app', ['satellizer', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $authProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home/home.html',
      controller: 'homeCtrl'
    })


  $authProvider.google({
    clientId: '167830915916-66jqfp5n2p922m33hu8rdn87apmjn4el.apps.googleusercontent.com'
  });
});
