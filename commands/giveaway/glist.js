const ms = require('ms');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'glist',
    description: "Check information of all giveaways",
    categories: "Giveaway",
    example: 'glist',
    userPerms: ['MANAGE_MESSAGES']
}

module.exports.run = async(sime, message, args) => {
    let allGiveaways = sime.giveaways.giveaways
    let notEnded = sime.giveaways.giveaways.filter((g) => !g.ended);
    let ended = sime.giveaways.giveaways.filter((g) => g.ended);
    message.lineReply(
        new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`All Giveaways: **${allGiveaways.length}**\nStarting: **${notEnded.length}**\nEnded: **${ended.length}**`)
    )
}