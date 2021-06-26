const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild : String,
    Role : Array,
})

module.exports = mongoose.model('authorization-roles',Schema)