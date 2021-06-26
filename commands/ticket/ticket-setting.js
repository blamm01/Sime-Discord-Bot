const schema = require('../../models/ticket');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'ticket-setting',
    description: "Settings the ticket module",
    example: `ticket-setting Role @Staff Team`,
    categories: 'Ticket',
    usage: '<Role/Category/Disable>',
    userPerms: ["ADMINISTRATOR"]
}

module.exports.run = async(sime, message, args) => {
    await schema.findOne({ Guild: message.guild.id }, async(err,Data) => {
    const query = args[0]
    if(!query || !(["role","category","disable"]).includes(query.toLowerCase())) return message.lineReply(`You need provide option first. Option: Role | Category | Disable`);
    if(query.toLowerCase() == 'role') {
        const role = await message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id == args[1]) || message.guild.roles.cache.find(r => r.name == args.slice(1).join(" "))
        if(!role) return message.lineReply(`You need mention support role to update`)
        if(!Data) {
            new schema({
                Guild: message.guild.id,
                Role: role.id,
                Category: 'null',
            }).save()
        } else if(Data) {
            Data.Role = role.id
            Data.save()
        }
        message.lineReply(`Support Role Updated: **${role.name}**`)
    } else if(query.toLowerCase() == 'category') {
        const role = await message.guild.channels.cache.find(r => r.id == args[1] && r.type == 'category') || message.guild.roles.cache.find(r => r.name == args.slice(1).join(" ") && r.type == 'category')
        if(!role) return message.lineReply(`You need provide category id to update`)
        if(!Data) {
            new schema({
                Guild: message.guild.id,
                Category: role.id,
                Role: 'null',
            }).save()
        } else if(Data) {
            Data.Category = role.id
            Data.save()
        }
        message.lineReply(`Ticket Category Updated: **${role.name}**`)
    }else if(query.toLowerCase() == 'disable') {
        if(!Data) {
            message.lineReply(`Ticket Module is not enabled`)
        } else if(Data) {
            Data.delete()
            message.lineReply(`Ticket Module disabled`)
        }
    }
})
}
