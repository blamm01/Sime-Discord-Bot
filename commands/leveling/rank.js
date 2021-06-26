const canvacord = require('canvacord');
const Discord = require('discord.js')
const schema = require('../../models/level')
const Levels = require("discord-xp")

module.exports = {
    name: 'rank',
    description: "Shows Rank Card of a member",
    categories: "Leveling",
    example: 'rank',
    usage: '[Member]',
}

module.exports.run = async(sime, message, args) => {
    const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    const data = await schema.findOne({ Guild: message.guild.id })
    if(!data) return message.lineReply(`Leveling System is not enabled.`)
    const user = await Levels.fetch(member.id, message.guild.id)
    if(!user) return message.channel.send(`**${member.user.tag}** doesn't have earned any XP.`)
    try {
        const rank = new canvacord.Rank()
        .setAvatar(member.user.displayAvatarURL({dynamic: false, format:'png'}))
        .setCurrentXP(parseInt(user.xp))
        .setLevel(parseInt(user.level))
        .setRequiredXP(sime.Levels.xpFor(user.level + 1))
        .setStatus(member.presence.status)
        .setProgressBar('#FF0000', 'COLOR')
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)
         rank.build()
           .then(data => {
            const attachment = new Discord.MessageAttachment
            (data, `${member.id}-rank.png`)
             message.channel.send(attachment);
        })
    } catch(err) {
        message.channel.send(new Discord.MessageEmbed().setTitle(`An error occured`).setColor("RED").setDescription(`\`\`\`${err}\`\`\``))
    }
}