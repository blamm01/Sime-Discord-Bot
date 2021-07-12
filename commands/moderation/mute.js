const ms = require('ms')
const muteRole = require('../../models/muteRole');
const punishinfo = require('../../models/punishment')
const memberRole = require('../../models/memberRole');
const moment = require('moment')
const {
    MessageEmbed,
    WebhookClient
} = require('discord.js')
const logging = require('../../models/logging')

module.exports = {
    name: 'mute',
    usage: '<Member> [Time] [Reason]',
    description: "Mutes a member",
    example: `mute 842723556998512690 3d Advertising`,
    botPerms: ['MANAGE_ROLES'],
    userPerms: ['MANAGE_MESSAGES'],
    categories: 'Moderation',
    modRole: true
}

module.exports.run = async (sime, message, args) => {
    const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.lineReply(`You need mention member first`)
    const ti1 = args[1] || 'null'
    const time = ms(ti1) || "null";
    if(member.user.id == message.member.id || member.user.id == sime.user.id) return message.channel.send("You can't mute yourself or I can't mute myself")
    const punish = await sime.punishid(10);
    if (!Number(time)) {
        let reason = args.slice(1).join(" ")
        if (!reason) reason = "No reason provided"
        if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.owner.id) return message.lineReply(`You can't mute that user as their highest role is above or equal your highest role`)
        muteRole.findOne({
            Guild: message.guild.id
        }, async (err, data) => {
            if (!data) return message.lineReply(`:x: There is no muted role ! Set it using \`muterole\` command`);
            const role = message.guild.roles.cache.get(data.Role);
            if (!role) {
                message.lineReply(`Muted role is deleted ! Deleting Database...`)
                data.delete()
            }
            console.log(role)
            if (role.managed) return message.lineReply(`Mute role is managed by Discord/Bots. So I can't add/remove it`)
            try {
                member.send(`⚠️ You were muted on **${message.guild.name}** with reason **${reason}** with Punishment ID **${punish}**`)
            } catch (err) {
                console.log(`I can't DM ${member.id}`)
            }
            try {
                member.roles.add(role, `${message.author.tag}`)
                new punishinfo({
                    Guild: message.guild.id,
                    ID: punish,
                    User: member.id,
                    Moderator: message.member.id,
                    Reason: reason,
                    Type: "Mute",
                    At: moment.utc(Date.now()).format("MM/DD/YYYY")
                }).save()
                message.lineReply(`🔨 Muted **${member.user.tag}** with reason **${reason}** with Punishmemt ID **${punish}**`)
                memberRole.findOne({ Guild: message.guild.id }, async(err,data) => {
                    let roleMember;
                    if(!data) { 
                    roleMember = 'null'
                    } else if(data) {
                        roleMember = await message.guild.roles.cache.get(data.Role)
                        if(!roleMember) roleMember = 'null';
                    }
                    if(roleMember !== 'null') {
                      if(member.roles.cache.get(roleMember.id)) { 
                        member.roles.remove(roleMember)
                      }
                    } 
                })
            } catch (err) {
                message.lineReply(new MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED"))
            }
            const data1 = await logging.findOne({ Guild: message.guild.id })
    if(!data1 || !data1.Channel || !data1.WebhookID || !data1.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data1.WebhookID,
        data1.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Mute",
            description: `**${message.author.tag}** muted **${member.user.tag}** with reason **${reason}** with Punishment ID **${punish}**`,
            color: "BLUE",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
        })
    } else if (Number(time)) {
        let reason = args.slice(2).join(" ")
        if (!reason) reason = "No reason provided"
        if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.owner.id) return message.lineReply(`You can't mute that user as their highest role is above or equal your highest role`)
        muteRole.findOne({
            Guild: message.guild.id
        }, async (err, data) => {
            if (!data) return message.lineReply(`:x: There is no muted role ! Set it using \`muterole\` command`);
            const role = message.guild.roles.cache.get(data.Role);
            if (!role) {
                message.lineReply(`Muted role is deleted ! Deleting Database...`)
                data.delete()
            }
            if (role.managed) return message.lineReply(`Mute role is managed by Discord/Bots. So I can't add/remove it`)
            try {
                member.send(`⚠️ You were muted on **${message.guild.name}** with reason **${reason}** for **${ms(time, { long: true })}** with Punishmemt ID **${punish}**`)
            } catch (err) {
                console.log(`I can't DM ${member.id}`)
            }
            try {
                member.roles.add(role, `${message.author.tag}`)
                new punishinfo({
                    Guild: message.guild.id,
                    ID: punish,
                    User: member.id,
                    Moderator: message.member.id,
                    Reason: reason,
                    Type: "Mute",
                    At: moment.utc(Date.now()).format("MM/DD/YYYY")
                }).save()
                message.lineReply(`🔨 Muted **${member.user.tag}** with reason **${reason}** for **${ms(time, { long: true })}** with Punishmemt ID **${punish}**`)
            } catch (err) {
                message.lineReply(new MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED"))
            }
            setTimeout(async () => {
            punishinfo.findOne({
                Guild: message.guild.id,
                ID: punish,
                User: member.id,
                Moderator: message.member.id,
                Reason: reason,
                Type: "Mute"
            }, async(err, data) => {
                if(!data) return console.log(`Punishment ${punish} is deleted already`)
                data.delete()
                console.log(`Unmuted ${member.id}`)
            })
            muteRole.findOne({
                Guild: message.guild.id
            }, async (err, data) => {
                if (!data) return;
            const role = await message.guild.roles.cache.get(data.Role);
            if (!role) {
                console.log(`Muted role is deleted ! Deleting Database...`)
                data.delete()
                return;
            }
            member.roles.remove(role)
            })
        }, time)
            const data1 = await logging.findOne({ Guild: message.guild.id })
    if(!data1 || !data1.Channel || !data1.WebhookID || !data1.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data1.WebhookID,
        data1.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Mute",
            description: `**${message.author.tag}** muted **${member.user.tag}** with reason **${reason}** for **${ms(time, { long: true })}** with Punishment ID **${punish}**`,
            color: "BLUE",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
        })
    }
}