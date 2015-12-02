'use strict';

var app = angular.module('app');

app.controller('homeCtrl', function($scope, $auth, $state) {
  console.log('homeCtrl running');

  $scope.authenticate = provider => {
    $auth.authenticate(provider)
    .then(res => $state.go('game'))
    .catch(err => console.error('error:', err))
  }
})
