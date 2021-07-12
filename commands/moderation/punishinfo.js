const schema = require('../../models/punishment')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "punishinfo",
    description: "Checks Information of a warning",
    aliases: ['punishmentinfo'],
    categories: 'Moderation',
    userPerms: ["MANAGE_MESSAGES"],
    example: 'punishinfo B87k5AQHrf',
    usage: '<Punishment ID>',
    modRole: true
}

module.exports.run = async(sime, message, args) => {
    const punish = args[0]
    if(!punish) return message.lineReply(`You need provide Punishment ID first !`);
    schema.findOne({ Guild: message.guild.id, ID: punish }, async(err, data) => {
        if(!data) return message.lineReply(`:x: There is no Punishment ID **${punish}**`)
        message.lineReply(new MessageEmbed()
            .setTitle(`Punishment Information`)
            .addField(`Punishment`, punish, true)
            .addField(`Type`, data.Type, true)
            .addField(`User`, `<@!${data.User}> (${data.User})`,true)
            .addField(`Moderator`, `<@!${data.Moderator}> (${data.Moderator})`, true)
            .addField(`Reason`, data.Reason).setColor("ORANGE")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        )
    })
}