'use strict';

var app = angular.module('app');

app.controller('gameCtrl', function($scope, $auth, $state, GameService, socket) {
  if (!$auth.isAuthenticated()) return $state.go('home');

  console.log('gameCtrl running');

  // var socket = io.connect('http://localhost:3000');
  socket.on('message', function(data){
    console.log(data);
  })

  $scope.logout = () => {
    $auth.logout();
    $state.go('home');
  }

  $scope.player;

  var height, width;

  GameService.getBoardState().then( res => {
    console.log(res);
    $scope.gameboard = res.data.gameboard;

    // get height and width of gameboard for clamp function
    height = $scope.gameboard.length;
    width = $scope.gameboard[0].length;

    $scope.player = res.data.player;
    var y = $scope.player.location[0];
    var x = $scope.player.location[1];

    $scope.gameboard[y][x] = $scope.player.name;

  }).catch( err => {
    console.error(err);
  });

  function changePositionTo(newY, newX){
    var loc = $scope.player.location;
    // clear old position
    $scope.gameboard[loc[0]][loc[1]] = 0;
    // draw player at new position
    $scope.gameboard[newY][newX] = $scope.player.name;
    // set new player location
    $scope.player.location = [newY, newX];
  }

  function clamp(num, low, high){
    if (num > high) return high;
    if (num < low) return low;
    return num;
  }

  var moveOnKey = {
    37: () => {
      var loc = $scope.player.location;
      var newX = loc[1] - 1;
      changePositionTo(loc[0], clamp(newX, 0, width - 1)); // clamp keeps position in range
    },
    38: () => {
      var loc = $scope.player.location;
      var newY = loc[0] - 1;
      changePositionTo(clamp(newY, 0, height - 1), loc[1]);
    },
    39: () => {
      var loc = $scope.player.location;
      var newX = loc[1] + 1;
      changePositionTo(loc[0], clamp(newX, 0, width - 1));
    },
    40: () => {
      var loc = $scope.player.location;
      var newY = loc[0] + 1;
      changePositionTo(clamp(newY, 0, height - 1), loc[1]);
    }
  }

  $scope.$on('keydown', (e, key) => {
    console.log(key);
    moveOnKey[key]();
  })

})
