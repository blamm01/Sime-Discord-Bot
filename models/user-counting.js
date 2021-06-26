const mongo = require('mongoose')

module.exports = mongo.model("user-counting", new mongo.Schema({
  Guild: String,
  Member: String,
  Number: Number,
}))