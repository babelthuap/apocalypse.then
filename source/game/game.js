'use strict';

var app = angular.module('app');

app.controller('gameCtrl', function($scope, $stateParams, $auth, $state, GameService, socket) {
  if (!$auth.isAuthenticated()) return $state.go('home');

  console.log('gameCtrl running with id', $stateParams.id);

  var turnOffKeyListener;

  var timer;

  $scope.playing = false;
  $scope.loc;

  var VIEW_RADIUS = 5;
  $scope.closeToPlayer = function(y, x){
    var locY = $scope.loc[0];
    var locX = $scope.loc[1];
    return (locY - y)*(locY - y) + (locX - x)*(locX - x) < VIEW_RADIUS*VIEW_RADIUS;
  }

  $scope.start = function(){
    turnOffKeyListener = $scope.$on('keydown', (e, key) => {
      moveOnKey[key]($scope.loc);
    });
    socket.emit('userlogin', $stateParams.id);
    $scope.death = false;
    $scope.playing = true;

    $scope.time = 0;
    timer = setInterval(function(){
      $scope.time++;
    }, 1000)
  }

  $scope.logout = () => {
    $auth.logout();
    socket.emit('logout', $scope.loc);
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
    $scope.gameboard = updatedBoard;
  })

  socket.on('playerDeath', function(id) {
    console.log('somebody died:', id);
    if (id === $stateParams.id) {
      $scope.loc = null;
      turnOffKeyListener();
      $scope.death = true;
      $scope.playing = false;
      clearInterval(timer);
    }
  })

  // clamp n to the range [0, max]
  var clamp = (n, max) => n < 0 ? 0 : (n > max ? max : n);

  function changePositionTo(newY, newX) {
    if ($scope.gameboard[newY][newX].player) return;

    socket.emit('changeLoc', {
      oldLoc: $scope.loc,
      newLoc: [newY, newX],
      name: $scope.name,
      id: $stateParams.id
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

})
