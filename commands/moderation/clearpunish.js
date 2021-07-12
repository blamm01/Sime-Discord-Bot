const { MessageEmbed, WebhookClient } = require('discord.js');
const schema = require('../../models/punishment')
const logging = require('../../models/logging')

module.exports = {
    name: 'clearpunish',
    aliases: ['clearwarnings'],
    description: "Clear all punishes of a user",
    categories: "Moderation",
    example: 'clearpunish 736636650796351559',
    usage: '[Member]',
    userPerms: ['MANAGE_MESSAGES'],
    modRole: true
}

module.exports.run = async(sime, message, args) => {
    const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    schema.find({ Guild: message.guild.id, User: member.user.id }, async(err, data) => {
        if(err) throw err;
        if(!data) return message.lineReply(`**${member.user.tag}** doesn't have any punishment`);
        data.map((d) => d.delete())
        message.lineReply(`🔨 Cleared all punishment of **${member.user.tag}**`)
        const data1 = await logging.findOne({ Guild: message.guild.id })
    if(!data1 || !data1.Channel || !data1.WebhookID || !data1.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data1.WebhookID,
        data1.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Clear Punish",
            description: `**${message.author.tag}** cleared all punishments of **${member.user.tag}**`,
            color: "GREEN",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
    })
}