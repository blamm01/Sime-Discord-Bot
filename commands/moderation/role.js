const { WebhookClient } = require('discord.js')
const logging = require('../../models/logging')

module.exports = {
    name: 'role',
    usage: '<Member> <Role>',
    description: "Add/Remove Role for a member",
    example: `role @ToLaCut @Admin`,
    userPerms: ['MANAGE_ROLES'],
    categories: 'Moderation',
}

module.exports.run = async(sime, message, args) => {
    const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
    const role = await message.guild.roles.cache.find(role => role.name === args[1]) || message.guild.roles.cache.find(role => role.id === args[1]) || message.mentions.roles.first()
    if(!member) return message.lineReply(`You need mention member first !`)
    if(!role) return message.lineReply(`You need mention role to add`)
    if(member.roles.highest.position >= role.position && role.managed) return message.lineReply(`You can't add/remove that role as it is above or equal your highest role or the role is managed by Discord/Bots`);
    if(message.guild.me.roles.highest.position >= role.position && role.managed) return message.lineReply(`I can't add/remove that role as it is above or equal my highest role or the role is managed by Discord/Bots`);
    if(!member.roles.cache.get(role.id)) {
        member.roles.add(role, `${member.user.tag}`);
        message.lineReply(`🔨 Added **${role.name}** to **${member.user.tag}**`)
        const data1 = await logging.findOne({ Guild: message.guild.id })
    if(data1 && data1.Channel && data1.WebhookID && data1.WebhookToken) {
    const webhookclient = new WebhookClient(
    	data1.WebhookID,
        data1.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Role Added",
            description: `**${message.author.tag}** added **${role}** to **${member.user.tag}**`,
            color: "GREEN",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
    }
    }
    if(member.roles.cache.get(role.id)) {
        member.roles.remove(role, `${member.user.tag}`);
        message.lineReply(`🔨 Removed **${role.name}** from **${member.user.tag}**`)
        const data1 = await logging.findOne({ Guild: message.guild.id })
    if(data1 && data1.Channel && data1.WebhookID && data1.WebhookToken) {
    const webhookclient = new WebhookClient(
    	data1.WebhookID,
        data1.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Role Removed",
            description: `**${message.author.tag}** removed **${role}** from **${member.user.tag}**`,
            color: "GREEN",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
    }
    }
}