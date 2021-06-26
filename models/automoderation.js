const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    Role: Array,
    Channel: Array,
})

module.exports = mongoose.model('auto-moderation',Schema)