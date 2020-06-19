const mongoose = require('mongoose');

const MatchSchema = mongoose.Schema({
  type: String,
  host: String,
  leaderboard: [{
    position: Number,
    civ: String,
    player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'}
  }]
});

const Match = mongoose.model('Match', MatchSchema);

module.exports = Match;