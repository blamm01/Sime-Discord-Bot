const schema = require('../../models/items')
const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const inv = require('../../models/inventory')

module.exports = {
    name: 'use',
    categories: 'Economy',
    aliases: ['useitem'],
    description: "Use an item",
    example: 'use DJ',
}

module.exports.run = async(sime, message, args) => {
    const item = args.join(" ")
    if(!item) return message.lineReply(`You need provide item name to use`)
    schema.find({ Guild: message.guild.id, Name: item }, async(err, data) => {
        let amount = 0
        data.map((d) => {
            if(d.Name == item) {
                amount = amount + 1
                inv.findOne({ Guild: message.guild.id, User: message.member.id, Item: item }, async(err, data1) => {
                if(!data1) return message.lineReply(`You don't own **${item}**`)
                const role = message.guild.roles.cache.find(r => r.id == d.RoleGive) || '0'
                if(role) {
                    if(!message.member.roles.cache.get(role.id)) {
                    message.member.roles.add(role.id, `Item RoleGive`)
                }
            }
                const role1 = message.guild.roles.cache.find(r => r.id == d.RoleRemove) || '0'
                if(role1) { 
                if(message.member.roles.cache.get(role1.id)) {
                message.member.roles.remove(role1.id, `Item RoleRemove`)
                }
            }
            await data1.delete()
                message.lineReply(new MessageEmbed().setTitle(`Item Active Successfully`).setDescription(`You actived **${item}**`).setThumbnail(message.author.displayAvatarURL({ dynamic:true })).setColor("GREEN"))
            })
            }
        })
        if(amount == 0) return message.lineReply(`The server doesn't have item called **${item}** or the Moderator deleted it`)
    })
}