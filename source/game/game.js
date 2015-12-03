'use strict';

var app = angular.module('app');

app.controller('gameCtrl', function($scope, $stateParams, $auth, $state, GameService, socket) {
  if (!$auth.isAuthenticated()) return $state.go('home');

  console.log('gameCtrl running with id', $stateParams.id);

  socket.emit('userlogin', $stateParams.id);

  $scope.logout = () => {
    $auth.logout();
    $state.go('home');
  }

  var HEIGHT;
  var WIDTH;
  $scope.gameboard;

  socket.on('startUser', function(data) {
    $scope.name = data.name;
    $scope.loc = data.loc;
    HEIGHT = data.HEIGHT;
    WIDTH = data.WIDTH;
  })

  socket.on('boardUpdate', function(updatedBoard) {
    console.log('updatedBoard:', updatedBoard);
    $scope.gameboard = updatedBoard;
  })

  // clamp n to the range [0, max]
  var clamp = (n, max) => n < 0 ? 0 : (n > max ? max : n);

  function changePositionTo(newY, newX) {
    if ($scope.gameboard[newY][newX].player) return;

    socket.emit('changeLoc', {
      oldLoc: $scope.loc,
      newLoc: [newY, newX],
      name: $scope.name
    });

    $scope.loc = [newY, newX];
  }

  var moveOnKey = {
    37: loc => { // left
      var newX = loc[1] - 1;
      changePositionTo(loc[0], clamp(newX, WIDTH - 1)); // clamp makes sure position stays in gameboard
    },
    38: loc => { // up
      var newY = loc[0] - 1;
      changePositionTo(clamp(newY, HEIGHT - 1), loc[1]);
    },
    39: loc => { // right
      var newX = loc[1] + 1;
      changePositionTo(loc[0], clamp(newX, WIDTH - 1));
    },
    40: loc => { // down
      var newY = loc[0] + 1;
      changePositionTo(clamp(newY, HEIGHT - 1), loc[1]);
    }
  }

  $scope.$on('keydown', (e, key) => {
    moveOnKey[key]($scope.loc);
  })

})
