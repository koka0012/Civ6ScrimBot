const mongoose = require('mongoose');

const InfoSchema = mongoose.Schema({
  key: String,
  value: String,
});

const Info = mongoose.model('Info', InfoSchema);

module.exports = Info;