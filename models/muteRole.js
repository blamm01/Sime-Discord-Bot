const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    Role: String,
})

module.exports = mongoose.model('muterole',Schema)