const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')
const akinator = require('discord.js-akinator')

module.exports = {
    name: 'akinator',
    description: "Plays akinator game",
    aliases: ["aki"],
    botPerms: ["EMBED_LINKS","MANAGE_MESSAGES"],
    userPerms: [],
    categories: 'Fun',
}

module.exports.run = async(sime, message, args) => {
    akinator(message, sime)
}