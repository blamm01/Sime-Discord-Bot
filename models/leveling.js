const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    User: String,
    Level: Number,
    XP: Number,
    Require: Number
})

module.exports = mongoose.model('leveling',Schema)