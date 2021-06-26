const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    Reaction: String,
    Content: String,
})

module.exports = mongoose.model('ticket-choices',Schema)