const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    User: String,
    Item: String,
})

module.exports = mongoose.model('inventory',Schema)