'use strict';

var app = angular.module('app');

app.controller('keyCtrl', function($scope) {

  console.log('keyCtrl running');

  $scope.log = event => {
    // can add more keys here
    if (event.which >= 37 && event.which <= 40 ){
      event.preventDefault();

      $scope.$broadcast('keydown', event.which)
    }
  }


})
