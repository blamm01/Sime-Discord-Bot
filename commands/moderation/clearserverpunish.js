const schema = require('../../models/punishment');
const { WebhookClient } = require('discord.js')
const logging = require('../../models/logging')

module.exports = {
    name: 'clearserverpunish',
    description: "Clear all punishes on the server",
    categories: "Moderation",
    userPerms: ["ADMINISTRATOR"],
    example: 'clearserverpunish',
    modRole: true
}

module.exports.run = async(sime, message, args) => {
    schema.find({ Guild: message.guild.id }, async(err, data) => {
        let amount = 0;
        data.map((d) => {
            d.delete()
            amount = amount + 1
        });
        if(amount == 0) return message.lineReply(`:x: There is no active punishment on this server`);
        message.lineReply(`🔨 Cleared all punishment on this server`)
        const data1 = await logging.findOne({ Guild: message.guild.id })
    if(!data1 || !data1.Channel || !data1.WebhookID || !data1.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data1.WebhookID,
        data1.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Clear All Punish",
            description: `**${message.author.tag}** cleared all punishments in the server`,
            color: "GREEN",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
    })
}