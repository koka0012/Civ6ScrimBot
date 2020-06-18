const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
  discordId: String,
  plataform: String
});

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;