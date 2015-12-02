'use strict';

var app = angular.module('app');

app.controller('gameCtrl', function($scope, $auth, $state) {
  if (!$auth.isAuthenticated()) return $state.go('home');

  console.log('gameCtrl running');

  $scope.logout = () => {
    $auth.logout();
    $state.go('home');
  }

})
