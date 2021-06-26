const schema = require('../../models/level')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'level-settings',
    usage: '<RankUpChannel/RankUpMessage/Disable>',
    description: "Change Settings Of Leveling",
    example: `report-settings 32 No way...`,
    categories: 'Leveling',
    userPerms: ["ADMINISTRATOR"]
}

module.exports.run = async (sime, message, args) => {
    const query = args[0]
    if(!query || !(["rankupmessage",'rankupchannel','disable']).includes(query.toLowerCase())) return message.lineReply(`:x: You need provide option first. Option: RankUpChannel | RankUpMessage | Disable`);
    schema.findOne({ Guild: message.guild.id }, async (err, Data) => {
        if(query.toLowerCase() == 'rankupchannel') {
            const channel = await message.mentions.channels.first() || message.guild.channels.cache.find(c => c.id == args[1]) || message.guild.channels.cache.find(c => c.name == args.slice(1).join(" ")) || message.channel
            if(!Data) {
                new schema({
                    Guild: message.guild.id,
                    Channel: channel.id,
                    Text: ":tada: Congratulations, {user}. You leveled up to {level}"
                }).save()
            } else if(Data) {
                Data.Channel = channel.id
                Data.save()
            }
            message.lineReply(`:white_check_mark: Rank Up Channel Updated: **${channel.name}**`)
        } else if(query.toLowerCase() == 'disable') {
            if(!Data) {
                return message.lineReply(`:x: Leveling is not enabled.`)
            } else if(Data) {
                Data.delete()
            }
            message.lineReply(`:white_check_mark: Disabled Leveling`)
        } else if(query.toLowerCase() == 'rankupmessage') {
            const message1 = args.slice(1).join(" ") || args[1];
            if(!message1) return message.lineReply(new MessageEmbed().setTitle(`Variables`).setDescription(`{user}: Member\n{level}: Level\n{xp}: XP\n{requireXP}: Required XP for next Level`).setColor("RANDOM"));
            if(!Data) {
                new schema({
                    Guild: message.guild.id,
                    Channel: `null`,
                    Text: message1
                }).save()
                message.lineReply(`:white_check_mark: Updated Rank up message to **${message1}**`)
            } else if(Data) {
                Data.Text = message1
                Data.save()
                message.lineReply(`:white_check_mark: Updated Rank up message to **${message1}**`)
            }
        }
    })
}