const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'deposit',
    categories: 'Economy',
    aliases: ['dep'],
    description: "Deposit Balance to bank",
    usage: '<Coins/All>',
    example: 'deposit 1000' 
}

module.exports.run = async(sime, message, args) => {
    let coins = args[0]
    let member = message.member
    let currentBalance = await sime.mongo.get(`balance_${member.id}_${message.guild.id}`) || '0'
    let currentBank = await sime.mongo.get(`bank_${member.id}_${message.guild.id}`) || '0'
    let currency = await sime.mongo.get(`currency_${message.guild.id}`)
    if(coins == 'all') coins = currentBalance
    if(!currency) { 
    await sime.mongo.set(`currency_${message.guild.id}`, `🪙`); 
    currency = await sime.mongo.get(`currency_${message.guild.id}`) 
}
    if(!Number(coins)) return message.lineReply(`Please provide coins to deposit`)
    if(coins > currentBalance) return message.lineReply(`The coins you want deposit is larger than your balance`);
    await sime.mongo.add(`bank_${member.id}_${message.guild.id}`, parseInt(coins))
    await sime.mongo.subtract(`balance_${member.id}_${message.guild.id}`, parseInt(coins))
    message.lineReply(new MessageEmbed().setColor("GREEN").setTitle(`Coins Deposit`).setDescription(`You have deposited **${currency} ${coins}** to your bank. Now you have **${currency} ${await sime.mongo.get(`bank_${member.id}_${message.guild.id}`)}** in bank`).setThumbnail(message.author.displayAvatarURL({ dynamic: true })))
}