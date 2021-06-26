const ms = require('ms');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'greroll',
    description: "Rerolls a giveaway",
    categories: "Giveaway",
    example: 'greroll 843810523891761222',
    usage: '<Message ID>',
    userPerms: ['MANAGE_MESSAGES']
}

module.exports.run = async(sime, message, args) => {
    const messageID = args[0];
    if(!messageID) return message.lineReply(`:x: You need provide message ID to end Giveaway`);
    const giveaway = sime.giveaways.giveaways.find((g) => g.messageID === messageID);
    if(!giveaway) return message.lineReply(`:x: There is no giveaway found with ID ${messageID}`)
    sime.giveaways.reroll(giveaway.messageID).then(() => {
        message.lineReply(':white_check_mark: Giveaway was rerolled')
    }).catch(err => {
        console.log(err)
        message.lineReply(new MessageEmbed().setTitle(`:x: An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED"))
    })
}