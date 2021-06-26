const { WebhookClient } = require('discord.js')
const logging = require('../../models/logging')

module.exports = {
    name: 'nuke',
    usage: '[Channel]',
    description: "Nuke a channel",
    example: `nuke #general`,
    botPerms: ['MANAGE_CHANNELS'],
    userPerms: ['MANAGE_CHANNELS'],
    categories: 'Moderation',
}

module.exports.run = async(sime, message, args) => {
    const channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(f => f.name == args[0]) || message.channel
    var position = channel.position
    const data = await logging.findOne({ Guild: message.guild.id })
    if(!data || !data.Channel || !data.WebhookID || !data.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data.WebhookID,
        data.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Nuke",
            description: `**${message.author.tag}** nuked **${channel.name}**`,
            color: "ORANGE",
        }]
    })
    	.catch(err => { console.log(err); data.delete() })
   	let newChannel = await channel.clone()
    await newChannel.setPosition(position);
    await channel.delete(`${message.author.tag}`);
    newChannel.send(`:white_check_mark: Nuked this channel`).then(msg => msg.delete({ timeout: '10000' }))
}