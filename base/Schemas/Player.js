const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
  discordId: String,
  plataform: String,
  rating: Number,
  rd: Number,
  vol: Number,
  resetCount: Number,
});

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;