const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    Channel: String,
    WebhookID: String,
    WebhookToken: String
})

module.exports = mongoose.model('logging',Schema)