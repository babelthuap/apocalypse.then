'use strict';

var app = angular.module('app');

app.controller('gameCtrl', function($scope, $auth, $state, GameService) {
  if (!$auth.isAuthenticated()) return $state.go('home');

  console.log('gameCtrl running');

  $scope.logout = () => {
    $auth.logout();
    $state.go('home');
  }

  GameService.getBoardState().then( res => {
    console.log(res);
    $scope.gameboard = res.data;
  }).catch( err => {
    console.error(err);
  });

})
