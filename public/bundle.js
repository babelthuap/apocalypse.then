"use strict";var app=angular.module("app",["satellizer","ui.router","btford.socket-io"]);app.config(["$stateProvider","$urlRouterProvider","$authProvider",function(o,e,t){e.otherwise("/"),o.state("home",{url:"/",templateUrl:"home/home.html",controller:"homeCtrl"}).state("game",{url:"/game/:id",templateUrl:"game/game.html",controller:"gameCtrl"}),t.google({clientId:"403356814232-l0l5edtnt2uamllctq4eeuflrr4t395d.apps.googleusercontent.com"})}]);var app=angular.module("app");app.controller("gameCtrl",["$scope","$stateParams","$auth","$state","GameService","socket",function(o,e,t,a,n,r){function l(t,a){o.gameboard[t][a].player||r.emit("changeLoc",{oldLoc:o.loc,newLoc:[t,a],name:o.name,id:e.id})}if(!t.isAuthenticated())return a.go("home");console.log("gameCtrl running with id",e.id);var c,i;o.playing=!1,o.loc;var u=5;o.closeToPlayer=function(e,t){if(!o.loc)return!0;var a=o.loc[0],n=o.loc[1];return u*u>(a-e)*(a-e)+(n-t)*(n-t)},o.start=function(){c=o.$on("keydown",function(e,t){s[t](o.loc)}),r.emit("userlogin",e.id),o.death=!1,o.playing=!0,o.time=0,i=setInterval(function(){o.time++},1e3)},o.logout=function(){t.logout(),r.emit("logout",o.loc),a.go("home")};var p,g;o.gameboard,r.on("startUser",function(e){o.name=e.name,o.loc=e.loc,p=e.HEIGHT,g=e.WIDTH}),r.on("boardUpdate",function(e){o.gameboard=e}),r.on("playerDeath",function(t){console.log("somebody died:",t),t===e.id&&(o.loc=null,c(),o.death=!0,o.playing=!1,clearInterval(i))});var m=function(o,e){return 0>o?0:o>e?e:o};r.on("successfulMove",function(e){o.loc=e});var s={37:function(o){var e=o[1]-1;l(o[0],m(e,g-1))},38:function(o){var e=o[0]-1;l(m(e,p-1),o[1])},39:function(o){var e=o[1]+1;l(o[0],m(e,g-1))},40:function(o){var e=o[0]+1;l(m(e,p-1),o[1])}}}]);var app=angular.module("app");app.service("GameService",["$http",function(o){this.getBoardState=function(){return o.get("/game")}}]);var app=angular.module("app");app.controller("homeCtrl",["$scope","$rootScope","$auth","$state","socket",function(o,e,t,a,n){console.log("homeCtrl running"),t.logout(),o.authenticate=function(o){t.authenticate(o).then(function(o){console.log("res:",o),a.go("game",{id:o.data.id})})["catch"](function(o){return console.error("error:",o)})}}]);var app=angular.module("app");app.controller("keyCtrl",["$scope",function(o){console.log("keyCtrl running"),o.log=function(e){e.which>=37&&e.which<=40&&(e.preventDefault(),o.$broadcast("keydown",e.which))}}]);var app=angular.module("app");app.factory("socket",["socketFactory",function(o){var e=io.connect("https://protected-spire-4855.herokuapp.com");return o({ioSocket:e})}]);