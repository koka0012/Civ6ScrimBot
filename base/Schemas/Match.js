const mongoose = require('mongoose');

const MatchSchema = mongoose.Schema({
  type: String,
  host: String,
  verified: Boolean,
  messageId: String,
  messageChannelId: String,
  leaderboard: [{
    position: Number,
    civ: String,
    player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'}
  }]
});

const Match = mongoose.model('Match', MatchSchema);

module.exports = Match;