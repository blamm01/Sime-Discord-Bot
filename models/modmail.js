const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    Category : String,
    Role: String,
})

module.exports = mongoose.model('modMail',Schema)