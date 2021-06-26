const schema = require('../../models/items')
const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'shop',
    categories: 'Economy',
    description: "Shows all items on the shop",
    example: 'shop',
}

module.exports.run = async(sime, message, args) => {
    let currency = await sime.mongo.get(`currency_${message.guild.id}`)
    if(!currency) { 
    await sime.mongo.set(`currency_${message.guild.id}`, `🪙`); 
    currency = await sime.mongo.get(`currency_${message.guild.id}`) 
}
    schema.find({ Guild: message.guild.id }, async(err, data) => {
        let amount = 0
        const embed = new MessageEmbed().setTitle(`Shop`).setColor("RANDOM").setThumbnail(message.guild.iconURL({ dynamic:true })).setFooter(`Use \`item-info\` with item name to check information`)
        data.map((d) => {
            embed.addField(`${d.Name} - ${currency} ${d.Price}`, d.Description)
            amount = amount + 1
        })
        if(amount = 0) embed.addField(`Oops ! There is no item in the shop :(`)
        message.lineReply(embed)
    })
}
