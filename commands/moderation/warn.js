const ms = require('ms')
const schema = require('../../models/punishment')
const logging = require('../../models/logging');
const autoPunish = require("../../function/auto-punish").autoPunish
const moment = require('moment')
const { WebhookClient, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'warn',
    usage: '<Member> [Time] <Reason>',
    description: "Warns a member",
    example: `warn 842723556998512690 3d Bypass Filtered Words`,
    userPerms: ['MANAGE_MESSAGES'],
    categories: 'Moderation',
    modRole: true
}

module.exports.run = async(sime, message, args, lang) => {
    let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!member) return message.lineReply(`You need mention member first`)
    const ti1 = args[1] || 'null'
    const time = ms(ti1) || "null";
    if(member.user.id == message.member.id || member.user.id == sime.user.id) return message.channel.send("You can't warn yourself or I can't warn myself")
    if(member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.owner.id) return message.lineReply(`You can't warn that user as their highest role is above or equal your highest role`)
    let punish = sime.punishid(10)
    if(!Number(time)) {
        let reason = args.slice(1).join(" ");
        if(!reason) return message.lineReply(`You need provide reason`)
        if(message.author.id == member.id) return message.lineReply(`You can't warn yourself`)
        try {
            member.send(`⚠️ You were warned on **${message.guild.name}** with reason **${reason}** with Punishment ID **${punish}**`)
        } catch(err) {
            console.log(`I can't DM ${member.id}`)
        }
        try {
            let data = new schema({
                Guild : message.guild.id,
                ID: punish,
                User: member.user.id,
                Moderator: message.author.id,
                Reason: reason,
                Type: "Warn",
                At: moment.utc(Date.now()).format("MM/DD/YYYY")
            }).save()
            message.lineReply(`🔨 Warned **${member.user.tag}** with reason **${reason}** with Punishment ID **${punish}**`)
            const autoPun = await autoPunish(sime, message.guild, member, message.channel, lang)
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
            title: "Warn",
            description: `**${message.author.tag}** warned **${member.user.tag}** with reason **${reason}** with Punishment ID **${punish}**`,
            color: "ORANGE",
        }]
    })
    	.catch(err => { console.log(err); data.delete() })
    } else if(Number(time)) {
        let reason = args.slice(2).join(" ");
        if(!reason) return message.lineReply(`You need provide reason`)
        if(message.author.id == member.id) return message.lineReply(`You can't warn yourself`)
        try {
            member.send(`⚠️ You were warned from **${message.guild.name}** with reason **${reason}** for **${ms(time, { long: true })}** with Punishment ID **${punish}**`)
        } catch(err) {
            console.log(`I can't DM ${member.id}`)
        }
        try {
            let data = new schema({
                Guild : message.guild.id,
                ID: punish,
                User: member.user.id,
                Moderator: message.author.id,
                Reason: reason,
                Type: 'Warn',
                At: moment.utc(Date.now()).format("MM/DD/YYYY")
            }).save()
            message.lineReply(`🔨 Warned **${member.user.tag}** with reason **${reason}** for **${ms(time, { long: true })}** with Punishment ID **${punish}**`)
            const autoPun = await autoPunish(sime, message.guild, member, message.channel, lang)
        } catch(err) {
            message.lineReply(`❌ An error occured: \`\`\`${typeof err == String}\`\`\``)
        }
  setTimeout(async() => {
            schema.findOne({ Guild: message.guild.id, ID: punish, User: member.user.id, Moderator: message.author.id, Reason: reason, Type: 'Warn' }, async(err, data) => {
                if(!data) return console.log(`${punish} was deleted already`)
                data.delete()
                .then(console.log(`Deleted Warnings ${punish}`))
            })
        }, time)
        const data = await logging.findOne({ Guild: message.guild.id })
    if(!data || !data.Channel || !data.WebhookID || !data.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data.WebhookID,
        data.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Warn",
            description: `**${message.author.tag}** warned **${member.user.tag}** with reason **${reason}** for **${ms(time, { long: true })}** with Punishment ID **${punish}**`,
            color: "ORANGE",
        }]
    })
    	.catch(err => { console.log(err); data.delete() })
    }
}