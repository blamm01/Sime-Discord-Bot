const { MessageEmbed } = require('discord.js')
const schema = require('../../models/modmail')

module.exports = {
    name: 'modmail-settings',
    description: "Changes settings of modmail",
    userPerms: ["ADMINISTRATOR"],
    categories: 'ModMail',
    example: 'modmail-settings Role @Staff Team',
    usage: '<Role/Category/Disable>'
}

module.exports.run = async(sime, message, args) => {
    const query = args[0]
    if(!query || !(["role","category","disable"]).includes(query.toLowerCase())) return message.lineReply(`You need provide option first. Option: Role | Category | Disable`)
    const Data = await schema.findOne({ Guild: message.guild.id })
    if(query.toLowerCase() == "role") {
        const role = await message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name == args.slice(1).join(" ") || args[1]) || message.guild.roles.cache.find(r => r.id == args[1])
        if(!role) return message.lineReply(`You need mention role to continue`)
        if(!Data) {
            new schema({
                Guild: message.guild.id,
                Role: role.id,
                Category: "null"
            }).save()
            message.lineReply(`Updated ModMail Support Role: **${role.name}**`)
        } else {
            Data.Role = role.id;
            Data.save()
            message.lineReply(`Updated ModMail Support Role: **${role.name}**`)
        }
    } else if(query.toLowerCase() == "category") {
        const parent = await message.guild.channels.cache.find(r => r.name == args[1] && r.type == 'category') || message.guild.channels.cache.find(r => r.id == args[1] && r.type == 'category')
        if(!parent) return message.lineReply(`You need provide Category ID to continue`)
        if(!Data) {
            new schema({
                Guild: message.guild.id,
                Role: "null",
                Category: parent.id
            }).save()
            message.lineReply(`Updated ModMail Category: **${parent.name}**`)
        } else {
            Data.Category = parent.id;
            Data.save()
            message.lineReply(`Updated ModMail Category: **${parent.name}**`)
        }
    } else if(query.toLowerCase() == "disable") {
        if(!Data) return message.lineReply(`This server is not enabled ModMail System`);
        await Data.delete()
        message.lineReply(`Disabled ModMail System.`)
    }
}