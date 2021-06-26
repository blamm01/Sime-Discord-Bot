const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'withdraw',
    categories: 'Economy',
    aliases: ['with'],
    description: "Withdraw coins from bank",
    usage: '<Coins/All>',
    example: 'withdraw 1000' 
}

module.exports.run = async(sime, message, args) => {
    let coins = args[0]
    let member = message.member
    let currentBalance = await sime.mongo.get(`balance_${member.id}_${message.guild.id}`) || '0'
    let currentBank = await sime.mongo.get(`bank_${member.id}_${message.guild.id}`) || '0'
    let currency = await sime.mongo.get(`currency_${message.guild.id}`)
    if(coins == 'all') coins = currentBank
    if(!currency) { 
    await sime.mongo.set(`currency_${message.guild.id}`, `🪙`); 
    currency = await sime.mongo.get(`currency_${message.guild.id}`) 
}
    if(!Number(coins)) return message.lineReply(`Please provide coins to deposit`)
    if(coins > currentBank) return message.lineReply(`The coins you want withdraw is larger than your bank`);
    await sime.mongo.subtract(`bank_${member.id}_${message.guild.id}`, parseInt(coins))
    await sime.mongo.add(`balance_${member.id}_${message.guild.id}`, parseInt(coins))
    message.lineReply(new MessageEmbed().setColor("GREEN").setTitle(`Coins Deposit`).setDescription(`You have withdraw **${currency} ${coins}** to your bank. Now you have **${currency} ${await sime.mongo.get(`bank_${member.id}_${message.guild.id}`)}** in bank`).setThumbnail(message.author.displayAvatarURL({ dynamic: true })))
}