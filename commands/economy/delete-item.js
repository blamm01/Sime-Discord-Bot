const schema = require('../../models/items')
const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'delete-item',
    categories: 'Economy',
    aliases: ['deleteitem','removeitem'],
    description: "Delete an item",
    example: 'delete-item DJ',
    userPerms: ['MANAGE_GUILD']
}

module.exports.run = async(sime, message, args) => {
    const item = args.join(" ")
    if(!item) return message.lineReply(`You need provide item name to delete`)
    schema.findOne({ Guild: message.guild.id, Name: item }, async(err, data) => {
        if(!data) return message.lineReply(`There is no item called **${item}**`)
        data.delete()
        message.lineReply(`Deleted Item **${item}**`)
    })
}