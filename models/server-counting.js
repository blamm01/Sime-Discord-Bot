const mongo = require('mongoose')

module.exports = mongo.model("server-counting", new mongo.Schema({
  Guild: String,
  Channel: String,
  Number: Number,
}))