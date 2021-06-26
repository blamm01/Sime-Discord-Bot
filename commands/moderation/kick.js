const ms = require('ms')
const { WebhookClient } = require('discord.js')
const logging = require('../../models/logging')

module.exports = {
    name: 'kick',
    usage: '<Member> [Reason]',
    description: "Kicks a member",
    example: `kick 842723556998512690 Spamming`,
    botPerms: ['KICK_MEMBERS'],
    userPerms: ['KICK_MEMBERS'],
    categories: 'Moderation',
}

module.exports.run = async(sime, message, args) => {
    const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!member) return message.lineReply(`You need mention member first !`);
        let reason = args.slice(1).join(" ");
        if(!reason) reason = `No reason provided`;
        if(member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.owner.id) return message.lineReply(`You can't kick that user as their highest role is above or equal your highest role`)
        if(!member.kickable) return message.lineReply(`I can't kick ${member.user.tag}`);
        if(message.author.id == member.id) return message.lineReply(`You can't kick yourself`)
        try {
            member.send(`⚠️ You were kicked from **${message.guild.name}** with reason **${reason}**`)
        } catch(err) {
            console.log(`I can't DM ${member.id}`)
        }
        try {
            member.kick(`${reason} - ${message.author.tag}`)
            message.lineReply(`🔨 Kicked **${member.user.tag}** with reason **${reason}**`)
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
            title: "Kick",
            description: `**${message.author.tag}** kicked **${member.user.tag}** with reason **${reason}**`,
            color: "RED",
        }]
    })
    	.catch(err => { console.log(err); data.delete() })
}