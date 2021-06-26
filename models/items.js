const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    Guild: String,
    Name: String,
    Price: String,
    Description: String,
    RoleGive: String,
    RoleRequire: String,
    RoleRemove: String
})

module.exports = mongoose.model('items',Schema)