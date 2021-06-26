const schema = require('../../models/items')
const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'item-info',
    categories: 'Economy',
    description: "Shows information of a item",
    example: 'item-info DJ',
}

module.exports.run = async(sime, message, args) => {
    const name = args.join(" ")
    if(!name) return message.lineReply(`You need provide Item Name to shows information`)
    let currency = db.get(`currency_${message.guild.id}`)
    if(!currency) { 
    await db.set(`currency_${message.guild.id}`, `🪙`); 
    currency = db.get(`currency_${message.guild.id}`) 
}
    schema.findOne({ Guild: message.guild.id, Name: name }, async(err, data) => {
        if(!data) return message.lineReply(`There is no item called **${name}**`)
        const role1 = message.guild.roles.cache.get(data.RoleRequire) || "No Role";
        const role2 = message.guild.roles.cache.get(data.RoleRemove) || "No Role";
        const role = message.guild.roles.cache.get(data.RoleGive) || "No Role"
        message.lineReply(new MessageEmbed().setTitle(`Item Information`).addField(`Name`, data.Name, true).addField(`Description`, data.Description, true).addField(`Price`, `${currency} ${data.Price}`, true).addField(`Role Require`, `${role1}`, true).addField(`Role Give`, `${role} `, true).addField(`Role Remove`, `${role2}`, true).setThumbnail(message.author.displayAvatarURL({ dynamic: true })).setColor("RANDOM"))
    })
}