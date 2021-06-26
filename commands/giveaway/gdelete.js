const ms = require('ms');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'gdelete',
    description: "Deletes a giveaway",
    categories: "Giveaway",
    example: 'gdelete 843810523891761222',
    usage: '<Message ID>',
    userPerms: ['MANAGE_MESSAGES']
}

module.exports.run = async(sime, message, args) => {
    const messageID = args[0];
    if(!messageID) return message.lineReply(`:x: You need provide message ID to delete Giveaway`);
    const giveaway = sime.giveaways.giveaways.find((g) => g.messageID === messageID);
    if(!giveaway) return message.lineReply(`:x: There is no giveaway found with ID ${messageID}`)
    sime.giveawaysManager.delete(giveaway)
    .then(() => {
        message.lineReply(':white_check_mark: Giveaway was deleted.')
    }).catch(err => {
        console.log(err)
        message.lineReply(new MessageEmbed().setTitle(`:x: An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED"))
    })
}