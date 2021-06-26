const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    Logs: String,
})

module.exports = mongoose.model('report',Schema)