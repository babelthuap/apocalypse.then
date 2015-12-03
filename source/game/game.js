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

  var height;
  var width;
  $scope.gameboard;

  socket.on('startUser', function(data) {
    $scope.name = data.name;
    $scope.loc = data.loc;
    height = data.height;
    width = data.width;
  })

  socket.on('boardUpdate', function(updatedBoard) {
    console.log('updatedBoard:', updatedBoard);
    $scope.gameboard = updatedBoard;
  })

  // socket.on('yourNewLoc', function(loc) {
  //   $scope.loc = loc;
  // })

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
    // var loc = $scope.player.location;
    moveOnKey[key]($scope.loc);
    // socket.emit('keypress', key);
  })









  $scope.player;
  var height, width;

  // GameService.getBoardState().then(res => {

  //   $scope.gameboard = res.data.gameboard;

  //   // get height and width of gameboard (used in clamp function)
  //   height = $scope.gameboard.length;
  //   width = $scope.gameboard[0].length;

  //   $scope.player = res.data.player;
  //   var y = $scope.player.location[0];
  //   var x = $scope.player.location[1];

  //   $scope.gameboard[y][x] = $scope.player.name;

  // }).catch(err => {
  //   console.error(err);
  // });





})
