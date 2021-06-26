const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    Channel: String,
    Text: String,
})

module.exports = mongoose.model('levelSettings', Schema)