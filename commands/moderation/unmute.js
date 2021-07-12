const ms = require('ms')
const muteRole = require('../../models/muteRole');
const punishinfo = require('../../models/punishment')
const memberRole = require('../../models/memberRole');
const {
    MessageEmbed,
    WebhookClient
} = require('discord.js')
const logging = require('../../models/logging')

module.exports = {
    name: 'unmute',
    usage: '<Member> [Reason]',
    description: "Unmutes a member",
    example: `unmute 842723556998512690 False Mute`,
    botPerms: ['MANAGE_ROLES'],
    userPerms: ['MANAGE_MESSAGES'],
    categories: 'Moderation',
    modRole: true
}

module.exports.run = async (sime, message, args) => {
    const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.lineReply(`You need mention member first`)
    if(member.user.id == message.member.id || member.user.id == sime.user.id) return message.channel.send("You can't unmute yourself or I can't unmute myself")
        let reason = args.slice(1).join(" ")
        if (!reason) reason = "No reason provided"
        if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.owner.id) return message.lineReply(`You can't unmute that user as their highest role is above or equal your highest role`)
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
                member.send(`⚠️ You were unmuted on **${message.guild.name}**`)
            } catch (err) {
                console.log(`I can't DM ${member.id}`)
            }
            try {
                member.roles.remove(role, `${message.author.tag}`)
                punishinfo.find({ Guild: message.guild.id, User: member.id }, async(err, data) => {
                    if(data) {
                        data.map((d) => d.delete())
                    }
                })
                message.lineReply(`🔨 Unmuted **${member.user.tag}** with reason **${reason}**`)
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
            title: "Unmute",
            description: `**${message.author.tag}** unmuted **${member.user.tag} with reason **${reason}**`,
            color: "GREEN",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
        })
}