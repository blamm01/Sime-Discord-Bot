const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    ID: String,
    User: String,
    Moderator: String,
    Reason: String,
    Type: String,
    At: String,
})

module.exports = mongoose.model('punishment',Schema)