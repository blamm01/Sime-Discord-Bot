const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    Report: String,
    Member: String,
    Author: String,
    Reason: String,
    Accept: Boolean,
})

module.exports = mongoose.model('reports',Schema)