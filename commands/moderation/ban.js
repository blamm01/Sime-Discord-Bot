const ms = require('ms')
const logging = require('../../models/logging.js')
const { WebhookClient } = require('discord.js')
module.exports = {
    name: 'ban',
    usage: '<Member> [Time] [Reason]',
    description: "Bans a member",
    example: `ban 842723556998512690 3d Advertising`,
    botPerms: ['BAN_MEMBERS'],
    userPerms: ['BAN_MEMBERS'],
    categories: 'Moderation',
}

module.exports.run = async(sime, message, args) => {
    const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!member) return message.lineReply(`You need mention member first !`);
    const ti1 = args[1] || 'null'
    const time = ms(ti1) || "null";
    if(member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.owner.id) return message.lineReply(`You can't ban that user as their highest role is above or equal your highest role`)
    if(!member.bannable) return message.lineReply(`I can't ban ${member.user.tag}`);
    if(!Number(time)) {
        let reason = args.slice(1).join(" ");
        if(!reason) reason = `No reason provided`;
        try {
            member.send(`⚠️ You were banned from **${message.guild.name}** with reason **${reason}**`)
        } catch(err) {
            console.log(`I can't DM ${member.id}`)
        }
        try {
            member.ban({
                reason: `${reason} - ${message.author.tag}`
            })
            message.lineReply(`🔨 Banned **${member.user.tag}** with reason **${reason}**`)
        } catch(err) {
            message.lineReply(new MessageEmbed().setTitle(`❌ An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED"))
        }
        const data = await logging.findOne({ Guild: message.guild.id })
    if(!data || !data.Channel || !data.WebhookID || !data.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data.WebhookID,
        data.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Ban",
            description: `**${message.author.tag}** banned **${member.user.tag}** with reason **${reason}**`,
            color: "RED",
        }]
    })
    	.catch(err => { console.log(err); data.delete() })
    } else if(Number(time)) {
        let reason = args.slice(2).join(" ");
        if(!reason) reason = `No reason provided`;
        if(message.author.id == member.id) return message.lineReply(`You can't ban yourself`)
        try {
            member.send(`⚠️ You were banned from **${message.guild.name}** with reason **${reason}** for **${ms(time, { long: true })}**`)
        } catch(err) {
            console.log(`I can't DM ${member.id}`)
        }
        try {
            member.ban({
                reason: `${reason} - ${message.author.tag}`
            })
            message.lineReply(`🔨 Banned **${member.user.tag}** with reason **${reason}** for **${ms(time, { long: true })}**`)
        } catch(err) {
            message.lineReply(`❌ An error occured: \`\`\`${typeof err == String}\`\`\``)
        }
        const data = await logging.findOne({ Guild: message.guild.id })
    if(!data || !data.Channel || !data.WebhookID || !data.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data.WebhookID,
        data.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Ban",
            description: `**${message.author.tag}** banned **${member.user.tag}** with reason **${reason}** for **${ms(time, { long: true })}** with Punishment ID **${punish}**`,
            color: "RED",
        }]
    })
    	.catch(err => { console.log(err); data.delete() })
        setTimeout(async() => {
            message.guild.members.unban(member, `Duration Expired`)
        }, time)
    }
}