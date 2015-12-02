'use strict';

var mongoose = require('mongoose');
var moment = require('moment');
var jwt = require('jwt-simple');


var Schema = mongoose.Schema;

var userSchema = Schema({
  displayName: String,
  picture: String,
  google: String,
  github: String
});


userSchema.methods.createJWT = function() {
  var payload = {
    sub: this._id,
    iat: moment().unix(), // "Issued At Time"
    exp: moment().add(12, 'hours').unix()
  };
  return jwt.encode(payload, process.env.JWT_SECRET);
}

module.exports = mongoose.model('User', userSchema);;
