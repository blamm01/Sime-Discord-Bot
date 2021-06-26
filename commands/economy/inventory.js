const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const inventory = require('../../models/inventory')

module.exports = {
   name: 'inventory',
    categories: 'Economy',
    aliases: ['inv'],
    description: "Checks User's Inventory",
    usage: '[Member]',
    example: 'inventory' 
}

module.exports.run = async(sime, message, args) => {
    const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    inventory.find({ Guild: message.guild.id, User: member.id }, async(err, data) => {
        let amount = 0
        const embed = new MessageEmbed()
            .setTitle(`${member.user.username}'s Inventory`)
            .setColor("RANDOM")
        data.map((d) => {
            embed.addField(`Item`, `${d.Item}`, true)
            amount = amount + 1
        })
        if(amount == 0) return message.lineReply(`**${member.user.tag}** doesn't have any items`)
        message.lineReply(embed)
    })
}