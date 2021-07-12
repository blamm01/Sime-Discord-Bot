const mongo = require('mongoose')

module.exports = mongo.model("auto-punishes", new mongo.Schema({
  Guild: String,
  Count: Number,
  Punish: String
}))