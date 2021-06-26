const schema = require('../../models/report')
const schema1 = require('../../models/reports')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'report-info',
    usage: '<Report Case>',
    description: "Shows Information of a report",
    example: `report-info 32`,
    categories: 'Report',
}

module.exports.run = async (sime, message, args) => {
    const case1 = args[0]
    if (!case1) return message.lineReply(`You need provide report case to fetch information`);
    schema.findOne({ Guild: message.guild.id }, async (err, Data) => {
        if (!Data || !Data.Logs || !message.guild.channels.cache.find(r => r.id == Data.Logs && r.type == 'text')) return message.lineReply(`This server is not setup report module correctly. Ask Server Administrator setup using \`report-settings\` command`)
        schema1.findOne({ Guild: message.guild.id, Report: case1 }, async (err, data) => {
            if(!data) return message.lineReply(`There is no report case called **${case1}**`)
            let accept;
            if(data.Accept == false) accept = "Denied";
            if(data.Accept == true) accept = "Accepted";
            if(data.Accept == null) accept = "Not Respond";
            message.lineReply(new MessageEmbed()
                .setAuthor(`Case #${data.Report}`)
                .setTitle(`Report Information`)
                .setColor("RANDOM")
                .addField(`Member`, `<@!${data.Member}>` , true)
                .addField(`Reported By`, `<@!${data.Author}>`, true)
                .addField(`Reason`, data.Reason)
                .setTimestamp()
            )
        })
    })
}
