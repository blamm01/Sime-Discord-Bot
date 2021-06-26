const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')

module.exports = {
    name: 'support',
    description: "Gets the support invite link",
    botPerms: ["EMBED_LINKS"],
    userPerms: [],
    categories: 'Utilities',
}

module.exports.run = async(sime, message, args) => {
    const embed = new MessageEmbed().setDescription(`**[Support Server](https://discord.gg/wchWg5Aayt)**`)
    .setColor("RANDOM");
    message.lineReply(embed)
}