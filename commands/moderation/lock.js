const {
    MessageEmbed,
    WebhookClient
} = require('discord.js')
const memberRoleSchema = require('../../models/memberRole')
const logging = require('../../models/logging')
module.exports = {
    name: 'lock',
    description: "Locks the channel",
    usage: '[Channel] [Reason]',
    category: "Moderation",
    example: `lock #general Staff Days`,
    botPerms: ['MANAGE_ROLES'],
    userPerms: ['MANAGE_MESSAGES',"MANAGE_ROLES"],
}

module.exports.run = async (sime, message, args) => {
    let channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    let reason;
    if (channel) {
        reason = args.slice(1).join(" ") || "No reason provided"
    } else if (!channel) {
        reason = args.join(" ") || "No reason provided";
        channel = message.channel
    }
    let role;
    await memberRoleSchema.findOne({
        Guild: message.guild.id
    }, async(err, data) => {
        if (data) {
            const role1 = message.guild.roles.cache.get(data.Role)
            if (!role1) role = message.guild.roles.everyone
            if(role1) role = role1
        } else if(!data) {
            role = message.guild.roles.everyone;
        }
    if(!channel.permissionsFor(role).has(["SEND_MESSAGES"])) return message.lineReply(`${channel} is already locked down.`)
    const database = await sime.mongo.get(`staffRole_${message.guild.id}`) || '0'
    const staffRole = await message.guild.roles.cache.get(database)

    if(staffRole) {
      channel.updateOverwrite(staffRole.id, {
        SEND_MESSAGES: true,
        ADD_REACTIONS: true
    }, `${message.author.tag}`)
    }
    channel.updateOverwrite(role.id, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
    }, `${message.author.tag}`)
    channel.send(`⚠️ Channel Locked\n\nReason: **${reason}**`);
        const data1 = await logging.findOne({ Guild: message.guild.id })
    if(!data1 || !data1.Channel || !data1.WebhookID || !data1.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data1.WebhookID,
        data1.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Lock",
            description: `**${message.author.tag}** locked ${channel} with reason **${reason}**`,
            color: "YELLOW",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
    if (channel.id == message.channel.id) return;
    message.lineReply(`🔨 Locked ${channel}`);
})
}