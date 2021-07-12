const { MessageEmbed, WebhookClient } = require('discord.js');
const schema = require('../../models/punishment')
const logging = require('../../models/logging')

module.exports = {
    name: 'removepunish',
    aliases: ['removewarn','removewarning'],
    description: "Remove a warning",
    categories: "Moderation",
    example: 'removepunish B87k5AQHrf',
    usage: '[Member]',
    userPerms: ['MANAGE_MESSAGES'],
    modRole: true
}

module.exports.run = async(sime, message, args) => {
    const punish = args[0];
    if(!punish) return message.lineReply(`You need provide Punishment ID first !`)
    schema.find({ Guild: message.guild.id, ID: punish }, async(err, data) => {
        if(err) throw err;
        let amount = 0
        let punishment;
        if(!data) return message.lineReply(`There is no punishment ID **${punish}**`);
        data.map((d) => {  punishment = d.Type; d.delete(); amount = amount + 1;})
        if(amount == 0) return message.lineReply(`There is no punishment ID **${punish}**`);
        message.lineReply(`🔨 Removed Punishment **${punish}**`)
         const data1 = await logging.findOne({ Guild: message.guild.id })
    if(!data1 || !data1.Channel || !data1.WebhookID || !data1.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data1.WebhookID,
        data1.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Remove Punish",
            description: `**${message.author.tag}** removed punishment **${punish}**`,
            color: "GREEN",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
    })
}