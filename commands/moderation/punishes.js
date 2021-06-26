const { MessageEmbed } = require('discord.js');
const schema = require('../../models/punishment')

module.exports = {
    name: 'punishes',
    aliases: ['warns','mutes','warnings'],
    description: "Checks warnings of user",
    categories: "Moderation",
    example: 'warnings 736636650796351559',
    usage: '[Member]',
    userPerms: ['MANAGE_MESSAGES']
}

module.exports.run = async(sime, message, args) => {
    const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    schema.find({ Guild: message.guild.id, User: member.user.id }, async(err, data) => {
        if(err) throw err;
        let amount = 0
        data.map((d) => {
            amount = amount + 1
        })
        if(amount == 0) return message.lineReply(`:x: **${member.user.tag}** doesn't have any punishment`)
        let embed = new MessageEmbed()
            .setTitle(`Punishment`)
            .setColor("RANDOM")
            .setTimestamp()
        data.map((d) => {
            embed.addField(`${d.Reason}`, `Punishment ID: ${d.ID} | Moderator: <@!${d.Moderator}> (${d.Moderator})\nAt Time: ${d.At}`)
        })
        message.lineReply(embed)
    })
}