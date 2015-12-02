"use strict";var app=angular.module("app",["satellizer","ui.router","btford.socket-io"]);app.config(["$stateProvider","$urlRouterProvider","$authProvider",function(o,e,a){e.otherwise("/"),o.state("home",{url:"/",templateUrl:"home/home.html",controller:"homeCtrl"}).state("game",{url:"/game",templateUrl:"game/game.html",controller:"gameCtrl"}),a.google({clientId:"403356814232-l0l5edtnt2uamllctq4eeuflrr4t395d.apps.googleusercontent.com"})}]);var app=angular.module("app");app.controller("gameCtrl",["$scope","$auth","$state","GameService","socket",function(o,e,a,t,r){function n(e,a){var t=o.player.location;o.gameboard[t[0]][t[1]]=0,o.gameboard[e][a]=o.player.name,o.player.location=[e,a]}function l(o,e,a){return o>a?a:e>o?e:o}if(!e.isAuthenticated())return a.go("home");console.log("gameCtrl running"),r.on("message",function(o){console.log(o)}),o.logout=function(){e.logout(),a.go("home")},o.player;var c,u;t.getBoardState().then(function(e){console.log(e),o.gameboard=e.data.gameboard,c=o.gameboard.length,u=o.gameboard[0].length,o.player=e.data.player;var a=o.player.location[0],t=o.player.location[1];o.gameboard[a][t]=o.player.name})["catch"](function(o){console.error(o)});var p={37:function(){var e=o.player.location,a=e[1]-1;n(e[0],l(a,0,u-1))},38:function(){var e=o.player.location,a=e[0]-1;n(l(a,0,c-1),e[1])},39:function(){var e=o.player.location,a=e[1]+1;n(e[0],l(a,0,u-1))},40:function(){var e=o.player.location,a=e[0]+1;n(l(a,0,c-1),e[1])}};o.$on("keydown",function(o,e){console.log(e),p[e]()})}]);var app=angular.module("app");app.service("GameService",["$http",function(o){this.getBoardState=function(){return o.get("/game")}}]);var app=angular.module("app");app.controller("homeCtrl",["$scope","$auth","$state",function(o,e,a){console.log("homeCtrl running"),o.authenticate=function(o){e.authenticate(o).then(function(o){return a.go("game")})["catch"](function(o){return console.error("error:",o)})}}]);var app=angular.module("app");app.controller("keyCtrl",["$scope",function(o){console.log("keyCtrl running"),o.log=function(e){e.which>=37&&e.which<=40&&(e.preventDefault(),o.$broadcast("keydown",e.which))}}]);var app=angular.module("app");app.factory("socket",["socketFactory",function(o){var e=io.connect("http://localhost:3000");return o({ioSocket:e})}]);