const schema = require('../../models/report')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'report-settings',
    usage: '<LogChannel/Disable>',
    description: "Change Settings Of Report Module",
    example: `report-settings 32 No way...`,
    categories: 'Report',
    userPerms: ["ADMINISTRATOR"]
}

module.exports.run = async (sime, message, args) => {
    const query = args[0]
    if(!query || !(["logchannel","disable"]).includes(query.toLowerCase())) return message.lineReply(`:x: You need provide option first. Option: LogChannel | Disable`);
    schema.findOne({ Guild: message.guild.id }, async (err, Data) => {
        if(query.toLowerCase() == 'logchannel') {
            const channel = await message.mentions.channels.first() || message.guild.channels.cache.find(c => c.id == args[1]) || message.guild.channels.cache.find(c => c.name == args.slice(1).join(" ")) || message.channel
            if(!Data) {
                new schema({
                    Guild: message.guild.id,
                    Logs: channel.id
                }).save()
            } else if(Data) {
                Data.Logs = channel.id
                Data.save()
            }
            message.lineReply(`:white_check_mark: Report Logs Updated: **${channel.name}**`)
        } else if(query.toLowerCase() == 'delete') {
            if(!Data) {
                return message.lineReply(`:x: Report Module is not enabled.`)
            } else if(Data) {
                Data.delete()
            }
            message.lineReply(`:white_check_mark: Disabled Report Module`)
        } 
    })
}