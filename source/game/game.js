'use strict';

var app = angular.module('app');

app.controller('gameCtrl', function($scope, $auth, $state, GameService, socket) {
  if (!$auth.isAuthenticated()) return $state.go('home');

  console.log('gameCtrl running');

  socket.on('message', function(data) {
    console.log(data);
  })

  $scope.logout = () => {
    $auth.logout();
    $state.go('home');
  }

  $scope.player;

  var height, width;

  GameService.getBoardState().then(res => {

    $scope.gameboard = res.data.gameboard;

    // get height and width of gameboard (used in clamp function)
    height = $scope.gameboard.length;
    width = $scope.gameboard[0].length;

    $scope.player = res.data.player;
    var y = $scope.player.location[0];
    var x = $scope.player.location[1];

    $scope.gameboard[y][x] = $scope.player.name;

  }).catch(err => {
    console.error(err);
  });

  function changePositionTo(newY, newX) {
    var loc = $scope.player.location; 
    $scope.gameboard[loc[0]][loc[1]] = 0;              // clear old position
    $scope.gameboard[newY][newX] = $scope.player.name; // draw player at new position
    $scope.player.location = [newY, newX];             // set new player location
  }

  // clamp n to the range [0, max]
  var clamp = (n, max) => n < 0 ? 0 : (n > max ? max : n);

  var moveOnKey = {
    37: loc => { // left
      var newX = loc[1] - 1;
      changePositionTo(loc[0], clamp(newX, width - 1)); // clamp makes sure position stays in gameboard
    },
    38: loc => { // up
      var newY = loc[0] - 1;
      changePositionTo(clamp(newY, height - 1), loc[1]);
    },
    39: loc => { // right
      var newX = loc[1] + 1;
      changePositionTo(loc[0], clamp(newX, width - 1));
    },
    40: loc => { // down
      var newY = loc[0] + 1;
      changePositionTo(clamp(newY, height - 1), loc[1]);
    }
  }

  $scope.$on('keydown', (e, key) => {
    console.log('key pressed:', key);
    var loc = $scope.player.location;
    moveOnKey[key](loc);
  })

})
