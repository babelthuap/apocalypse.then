'use strict';

var app = angular.module('app');

app.controller('homeCtrl', function($scope, $rootScope, $auth, $state, socket) {
  console.log('homeCtrl running');

  $scope.authenticate = provider => {
    $auth.authenticate(provider)
    .then(res => {
      console.log('res:', res);
      $state.go('game', {id: res.data.id});
    })
    .catch(err => console.error('error:', err))
  }

})
