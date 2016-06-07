var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
  name: String,
  scoreBoard: Array
});

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;