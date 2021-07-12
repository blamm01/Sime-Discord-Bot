const {
    MessageEmbed
} = require('discord.js')
const memberRoleSchema = require('../../models/memberRole')
module.exports = {
    name: 'unlock',
    description: "Unlocks the channel",
    usage: '[Channel] [Reason]',
    categories: "Moderation",
    example: `unlock #general Staff Days is over`,
    botPerms: ['MANAGE_ROLES'],
    userPerms: ['MANAGE_MESSAGES',"MANAGE_ROLES"],
    modRole: true
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
    if(channel.permissionsFor(role).has(["SEND_MESSAGES"])) return message.lineReply(`${channel} is already unlocked`)
    channel.updateOverwrite(role.id, {
        SEND_MESSAGES: null,
        ADD_REACTIONS: null
    }, `${message.author.tag}`)
    const perms = role.permissions.toArray()
    channel.send(`⚠️ Channel Unlocked\n\nReason: **${reason}**`);
        const data1 = await logging.findOne({ Guild: message.guild.id })
    if(!data1 || !data1.Channel || !data1.WebhookID || !data1.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data1.WebhookID,
        data1.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Unlock",
            description: `**${message.author.tag}** unlocked ${channel} with reason **${reason}**`,
            color: "GREEN",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
    if (channel.id == message.channel.id) return;
    message.lineReply(`🔨 Unlocked ${channel}`);
})
}