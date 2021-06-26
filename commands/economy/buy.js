const shopItem = require('../../models/items')
const inventory = require('../../models/inventory');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'buy',
     categories: 'Economy',
     aliases: ['buyitem','buy-item'],
     description: "Buys an item from the stop",
     usage: '<Item>',
     example: 'balance' 
 }

module.exports.run = async(sime, message, args) => {
    const item = args.join(" ")
    if(!item) return message.lineReply(`You need provide item name to buy`)
    let currency = await sime.mongo.get(`currency_${message.guild.id}`)
    if(!currency) { 
    await sime.mongo.set(`currency_${message.guild.id}`, `🪙`); 
    currency = await sime.mongo.get(`currency_${message.guild.id}`) 
}
    shopItem.find({ Guild: message.guild.id }, async(err, data) => {
        let amount = 0        
        const bal = await sime.mongo.get(`balance_${message.member.id}_${message.guild.id}`)
        data.map(async(d) => {
            if(d.Name == item) {
            amount = amount + 1
                if(bal < d.Price) return message.lineReply(`Item **${d.Name}** require you to have **${currency} ${d.Price}**`)
                const role = message.guild.roles.cache.get(d.RoleRequire)
                if(role) {
                    if(!message.member.roles.cache.get(role.id)) return message.lineReply(`This Item require you to have **${role.name}** role`)
                    new inventory({
                        Guild: message.guild.id,
                        User: message.member.id,
                        Item: d.Name,
                    }).save()
                    await sime.mongo.set(`balance_${message.author.id}_${message.guild.id}`, (parseInt(bal) -  parseInt(d.Price)))
                    message.lineReply(new MessageEmbed().setTitle(`Item Bought Successfully`).setDescription(`**${message.author.tag}** bought **${item}**`).setThumbnail(message.author.displayAvatarURL({ dynamic: true })).setColor("GREEN"))
                } else {
                    new inventory({
                        Guild: message.guild.id,
                        User: message.member.id,
                        Item: d.Name,
                    }).save()
                    await sime.mongo.set(`balance_${message.author.id}_${message.guild.id}`, (parseInt(bal) -  parseInt(d.Price)))
                    message.lineReply(new MessageEmbed().setTitle(`Item Bought Successfully`).setDescription(`**${message.author.tag}** bought **${item}**`).setThumbnail(message.author.displayAvatarURL({ dynamic: true })).setColor("GREEN"))
                }
        }
        })
        if(amount == 0) return message.lineReply(`There is no item called **${item}** on this server`)
    })
}
 