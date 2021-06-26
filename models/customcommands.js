const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    Command: String,
    Response: String,
})

module.exports = mongoose.model('custom-commands',Schema)