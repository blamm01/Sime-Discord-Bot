const schema = require('../../models/report')
const schema1 = require('../../models/reports')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'report',
    usage: '<Member> <Reason>',
    description: "Reports a member",
    example: `report 842723556998512690 Advertising`,
    categories: 'Reports',
}

module.exports.run = async (sime, message, args) => {
    const member = await message.mentions.members.first() || message.guild.roles.cache.find(r => r.id == args[0]);
    if (!member) return message.lineReply(`You need mention member to report`);
    const reason = args.slice(1).join(" ") || args[1]
    if (!reason) return message.lineReply(`You need provide reason to report`);
    schema.findOne({ Guild: message.guild.id }, async (err, Data) => {
        if (!Data || !Data.Logs || !message.guild.channels.cache.find(r => r.id == Data.Logs && r.type == 'text')) return message.lineReply(`This server is not setup report module correctly. Ask Server Administrator setup using \`report-settings\` command`)
        const channel = message.guild.channels.cache.find(r => r.id == Data.Logs && r.type == 'text')
        schema1.find({ Guild: message.guild.id }, async (err, data) => {
            let amount = 0
            data.map((d) => {
                if (d.Report > amount) amount = sime.math('+', amount, 1)
            })
            new schema1({
                Guild: message.guild.id,
                Report: amount + 1,
                Member: member.id,
                Author: message.author.id,
                Reason: reason,
                Accept: null
            }).save()
            channel.send(new MessageEmbed()
                .setAuthor(`Case #${(amount + 1)}`)
                .setTitle(`Report Recorded`)
                .setColor("ORANGE")
                .addField(`Member`, member, true)
                .addField(`Reported By`, message.author, true)
                .addField(`Report Case`, amount + 1, true)
                .addField(`Reason`, reason)
                .setTimestamp()
            )
            message.lineReply(`:hammer: Reported **${member.user.tag}** with Report Case **${(amount + 1)}** with reason **${reason}**. You will get the response soon.`);
        })
    })
}