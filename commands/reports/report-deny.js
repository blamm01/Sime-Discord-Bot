const schema = require('../../models/report')
const schema1 = require('../../models/reports')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'report-deny',
    usage: '<Report Case> <Reason>',
    description: "Deny a report",
    example: `report-deny 32 No way...`,
    categories: 'Reports',
    userPerms: ["MANAGE_MESSAGES"]
}

module.exports.run = async (sime, message, args) => {
    const case1 = args[0]
    if (!case1) return message.lineReply(`You need provide report case to deny`);
    const reason = args.slice(1).join(" ") || args[1]
    if (!reason) return message.lineReply(`You need provide reason to deny`);
    schema.findOne({ Guild: message.guild.id }, async (err, Data) => {
        if (!Data || !Data.Logs || !message.guild.channels.cache.find(r => r.id == Data.Logs && r.type == 'text')) return message.lineReply(`This server is not setup report module correctly. Ask Server Administrator setup using \`report-settings\` command`)
        const channel = message.guild.channels.cache.find(r => r.id == Data.Logs && r.type == 'text')
        schema1.findOne({ Guild: message.guild.id, Report: case1 }, async (err, data) => {
            if(!data) return message.lineReply(`There is no report case called **${case1}**`)
            channel.send(new MessageEmbed()
                .setAuthor(`Case #${data.Report}`)
                .setTitle(`Report Denied`)
                .setColor("RED")
                .addField(`Member`, `<@!${data.member}>` , true)
                .addField(`Reported By`, `<@!${data.Author}>`, true)
                .addField(`Reason`, data.Reason)
                .addField(`Response from ${message.author.tag}`, reason)
                .setTimestamp()
            )
            data.Accept = false
            data.save()
            message.lineReply(`:hammer: Denied report **${case1}** with reason **${reason}**. I have DMed Reported User and Report Author`);
            try {
                const user = message.guild.members.cache.find(r => r.id == data.Author)
                user.send(`**${message.author.tag}** denied your report **${case1}** with response **${reason}**`)
            } catch(e) {

            }
            try {
                const user = message.guild.members.cache.find(r => r.id == data.User)
                user.send(`You have been reported in Report **${case1}** but it was denied by **${message.author.tag}** with reason **${reason}**`)
            } catch(e) {

            }
        })
    })
}